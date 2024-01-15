import React, { useEffect, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tasksCollection, TASK_STATUS, subscribeTasks } from "../db/tasksCollection";
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { ReturnButton } from "./ReturnButton";
import SearchIcon from '@mui/icons-material/Search';
import { TodoListPage } from "./TodoListPage";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";


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
  
  const [onlyToDo, setOnlyToDo] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [effectiveSearchText, setEffectiveSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const handler = subscribeTasks({onlyToDo, substr: searchText, pageNumber: currentPage});
    return () => {
      handler.stop();
    };
  }, [onlyToDo, effectiveSearchText, currentPage]);

  const tasks = useTracker(() => tasksCollection.find({}, {}).fetch());

  function handleDelete(id) {
    Meteor.call("tasks.remove", id);
    setAnchor({});
  }

  function handleDone(task) {
    Meteor.call("tasks.changeStatus", task._id, nextStatus(task.status));
  }

  function handlePageChange(nextPage) {
    if(nextPage < 0) {
      return;
    }

    setCurrentPage(nextPage);
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

      <Box width="60vmin" marginBottom="2rem" textAlign="center" display="flex" marginTop="2rem">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton
          color="primary"
          aria-label="search"
          onClick={() => {
            setEffectiveSearchText(searchText);
            setCurrentPage(0);
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      <TodoListPage
        tasks={tasks}
        handleDone={handleDone}
        handleDelete={handleDelete}/>
      
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="60vmin"
        padding="10px"
      >
        <Box display="flex" alignItems="center">
          <input
            type="checkbox"
            checked={onlyToDo}
            onClick={() => setOnlyToDo(!onlyToDo)}
            readOnly
          />
          <label>Apenas não concluídas</label>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 0}>
            <KeyboardArrowLeftIcon/>
          </IconButton>
          <Typography variant="p">
            {currentPage + 1}
          </Typography>
          <IconButton onClick={() => handlePageChange(currentPage + 1)} disabled={false/*currentPage + 1 >= numPages*/}>
            <KeyboardArrowRightIcon/>
          </IconButton>
        </Box>
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
