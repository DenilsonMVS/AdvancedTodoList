import { List, ListItem, IconButton, Button, ListItemIcon, Menu, MenuItem, ListItemText } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import React, { useState } from "react";
import { Meteor } from 'meteor/meteor';
import { TASK_STATUS } from "../db/tasksCollection";
import { useNavigate } from "react-router-dom";


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

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}


export function TodoListPage({ tasks, handleDone, handleDelete }) {

  const navigate = useNavigate();
  const [anchor, setAnchor] = useState({});
  const user = Meteor.user();


  return <List>
    {tasks.map(task => {
      const taskCreator = Meteor.users.findOne(task.creator).username;
      const editor = taskCreator === user.username;
      return <ListItem
        key={task._id}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="Options"
            onClick={e => setAnchor({ [task._id]: e.currentTarget })}
            sx={{ color: "black" }}
          >
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
        <Menu anchorEl={anchor[task._id]} open={Boolean(anchor[task._id])} onClose={() => setAnchor({})}>
          <MenuItem onClick={() => navigate(`/edit/${task._id}`)}>{editor ? "Editar" : "Visualizar"}</MenuItem>
          <MenuItem disabled={!editor} onClick={() => handleDelete(task._id)}>Remover</MenuItem>
        </Menu>
      </ListItem>;
    })}
  </List>;
}
