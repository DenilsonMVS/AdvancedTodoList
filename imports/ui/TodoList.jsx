import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import { Button, IconButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tasksCollection, TASK_STATUS, subscribeTasks } from "../db/tasksCollection";
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { ReturnButton } from "./ReturnButton";


function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getColor(status) {
  switch(status) {
    case TASK_STATUS.FINISHED:
      return "green";
    case TASK_STATUS.IN_PROGRESS:
      return "yellow";
    case TASK_STATUS.READY:
      return "white";
  }
  return "black";
}

function nextStatus(status) {
  switch(status) {
    case TASK_STATUS.FINISHED:
      return TASK_STATUS.READY;
    case TASK_STATUS.IN_PROGRESS:
      return TASK_STATUS.FINISHED;
    case TASK_STATUS.READY:
      return TASK_STATUS.IN_PROGRESS;
  }
  return TASK_STATUS.READY;
}


export function TodoList() {
  const [anchor, setAnchor] = useState({});
  const [onlyToDo, setOnlyToDo] = useState(false);

  const user = Meteor.user();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = subscribeTasks(onlyToDo, () => {});
    return () => {
      handler.stop();
    };
  }, [onlyToDo]);

  const tasks = useTracker(() => tasksCollection.find({}, {}).fetch());

  function handleClose() {
    setAnchor({});
  }

  function handleClick(e, id) {
    setAnchor({
      [id]: e.currentTarget
    });
  }

  function handleEdit(id) {
    navigate(`/edit/${id}`);
  }

  function handleDelete(id) {
    Meteor.call("tasks.remove", id);
    setAnchor({});
  }

  function handleDone(task) {
    Meteor.call("tasks.changeStatus", task._id, nextStatus(task.status));
  }
  
  return <Box>
    <ReturnButton to="/hello"/>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h3">
        Tarefas cadastradas
      </Typography>
      <List>
        {tasks.map((task) => {
          const taskCreator = Meteor.users.findOne(task.creator).username;
          const editor = taskCreator === user.username;
          return <ListItem
            key={task._id}
            secondaryAction={
              <IconButton edge="end" aria-label="Options" onClick={(e) => handleClick(e, task._id)} sx={{ color: "black" }}>
                <MoreVertOutlinedIcon />
              </IconButton>
            }
            sx={{
              bgcolor: "gray",
              margin: "1vmin",
              width: "60vmin"
            }}
          >
            <Button disabled={!editor} onClick={() => handleDone(task)}>
              <ListItemIcon sx={{ color: getColor(task.status) }}>
                <AssignmentIcon />
              </ListItemIcon>
            </Button>
            <ListItemText
              primary={formatTime(task.date) + " - " + task.name}
              secondary={taskCreator}
              secondaryTypographyProps={{ color: "white" }}
            />
            <Menu anchorEl={anchor[task._id]} open={Boolean(anchor[task._id])} onClose={() => handleClose()}>
              <MenuItem onClick={() => handleEdit(task._id)}>{editor ? "Editar" : "Visualizar"}</MenuItem>
              <MenuItem disabled={!editor} onClick={() => handleDelete(task._id)}>Remover</MenuItem>
            </Menu>
          </ListItem>;
        })}
      </List>
      <Box position="relative" display="flex" alignItems="center" justifyContent="flex-start" width="100%" padding="10px" left="30vw">
        <input
          type="checkbox"
          checked={onlyToDo}
          onClick={() => setOnlyToDo(!onlyToDo)}
          readOnly
        />
        <label>Apenas não concluídas</label>
      </Box>
      <Box display="flex" justifyContent="flex-end" width="60vmin">
        <IconButton
          aria-label="add"
          style={{
            borderRadius: '50%',
            padding: '10px',
            backgroundColor: 'gray'
          }}
          onClick={() => { navigate("/edit"); }}
        >
          <AddIcon style={{ color: 'black' }} />
        </IconButton>
      </Box>
    </Box>
  </Box>;
}
