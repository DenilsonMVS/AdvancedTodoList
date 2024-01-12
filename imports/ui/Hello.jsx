import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { tasksCollection, TASK_STATUS, subscribeTasks } from "../db/tasksCollection";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssignmentIcon from '@mui/icons-material/Assignment';


export function Hello() {
  
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  subscribeTasks(() => {
    setSubscriptionReady(true);
  });

  const user = Meteor.user();

  const [totalTasks, setTotalTasks] = useState(0);
  const [tasksFinished, setTasksFinished] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const tasksToFinish = totalTasks - tasksFinished;
  const navigate = useNavigate();

  useEffect(() => {
    setTotalTasks(tasksCollection.find({}).count());
    setTasksFinished(tasksCollection.find({ status: TASK_STATUS.FINISHED }).count());
  }, [subscriptionReady]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <Box display="flex" flexDirection="row">
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box maxWidth="20vw" height="100vh" padding="2vmin" bgcolor={"lightgrey"}>
          <List>
            <ListItemButton onClick={() => navigate("/editUser")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>Perfil</ListItemText>
            </ListItemButton>
          </List>
          <List>
            <ListItemButton onClick={() => navigate("/list")}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText>Acessar Lista</ListItemText>
            </ListItemButton>
          </List>
          <List>
            <ListItemButton onClick={() => {Meteor.logout(); navigate("/login");}}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box width="80vw" height="100vh" paddingTop="4vh">
        <Box width="100%" display="flex" justifyContent="center">
          <Typography variant="h5">
            Olá {user.username}, seja bem vindo ao Todo List
          </Typography>
        </Box>
        <Box width="100%" display="flex" flexDirection="line" alignItems="center" justifyContent="center">
          <Box
            position="relative"
            padding="1vmin"
            margin="3vmin"
            width="30vmin"
            height="30vmin"
            bgcolor="gray"
          >
            <Typography fontSize="3vh">
              Total de tarefas cadastradas
            </Typography>
            <Typography fontSize="8vmin" position="absolute" left="1vmin" bottom="1vmin">
              {totalTasks}
            </Typography>
          </Box>
          <Box
            position="relative"
            padding="1vmin"
            margin="3vmin"
            width="30vmin"
            height="30vmin"
            bgcolor="gray"
          >
            <Typography fontSize="3vh">
              Total de tarefas concluídas
            </Typography>
            <Typography fontSize="8vmin" position="absolute" left="1vmin" bottom="1vmin">
              {tasksFinished}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="line"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            position="relative"
            padding="1vmin"
            margin="3vmin"
            width="30vmin"
            height="30vmin"
            bgcolor="gray"
          >
            <Typography fontSize="3vh">
              Total de tarefas a serem concluidas
            </Typography>
            <Typography fontSize="8vmin" position="absolute" left="1vmin" bottom="1vmin">
              {tasksToFinish}
            </Typography>
          </Box>
          <Box
            padding="1vmin"
            margin="3vmin"
            bgcolor="gray"
            width="30vmin"
            height="30vmin"
            onClick={toggleDrawer}
            sx={{
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#909090',
              },
            }}
          >
            <Typography fontSize="3vh">
              Opções
            </Typography>
          </Box>  
        </Box>
      </Box>
    </Box>
  );
}
