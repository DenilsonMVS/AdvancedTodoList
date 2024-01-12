import React, { useState, useEffect } from "react";

import { tasksCollection, TASK_STATUS, subscribeTasks } from "../db/tasksCollection";
import { subscribeUsers } from "../db/users";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Button, List, ListItem, ListItemText, IconButton, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { formatDateTime, dateFromDateTimeString } from "./utils/parseDate";




function RenderData({
  isNewTask,
  isEditor,
  name,
  handleNameChange,
  description,
  handleDescriptionChange,
  date,
  handleDateChange,
  users,
  addUser,
  currentUser,
  handleRemoveUser,
  handleChangeAddUser,
  onAddUser,
  handleChangePersonal,
  personal,
  handleCancel,
  handleSave
}) {
  return <Box>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh">
      <Box
        maxWidth="500px"
        width="80vw"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        
        <Typography marginBottom="20px" variant="h4">
          {isNewTask ? "Nova tarefa" : (isEditor ? "Editar tarefa" : "Visualizar Tarefa")}
        </Typography>

        <Box marginBottom="10px" width="100%">
          <TextField
            fullWidth
            label="Nome"
            variant="filled"
            id="filled-basic"
            value={name}
            disabled={!isEditor}
            onChange={handleNameChange}
          />
        </Box>
        <Box marginBottom="10px" width="100%">
          <TextField
            fullWidth
            label="Descrição"
            variant="filled"
            id="filled-basic"
            value={description}
            disabled={!isEditor}
            onChange={handleDescriptionChange}
          />
        </Box>
        <Box marginBottom="10px" width="100%">
          <TextField
            fullWidth
            label="Data"
            type="datetime-local"
            variant="filled"
            id="filled-basic"
            InputLabelProps={{ shrink: true }}
            value={date}
            disabled={!isEditor}
            onChange={handleDateChange}
          />
        </Box>

        <Box bgcolor="lightgray" width="100%" padding="5px" margin="5px">
          <Typography variant="h6">Usuários:</Typography>
          <List>
            {users.map(user => {
              return <ListItem key={user._id}>
                <ListItemText primary={user.username}/>
                {user._id !== currentUser._id ? (
                  <IconButton
                    disabled={!isEditor}
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveUser(user._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : <></>}
              </ListItem>;
            })}

          </List>
          <TextField
            label="Adicionar Usuário"
            disabled={!isEditor}
            variant="filled"
            id="filled-basic"
            value={addUser}
            onChange={handleChangeAddUser}/>
          <Button onClick={() => onAddUser()} disabled={!isEditor}>Adicionar usuário</Button>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%" padding="10px" >
          <input
            disabled={!isEditor}
            type="checkbox"
            checked={personal}
            onClick={() => handleChangePersonal(!personal)}
            readOnly
          />
          <label>Personal</label>
        </Box>
        
        
        <Box marginTop="30px" width="100%" display="flex" justifyContent="space-around">
          {isEditor ? <>
            <Button
              onClick={handleCancel}
              variant="contained"
              sx={{ backgroundColor: 'gray', borderRadius: 0, color: 'white' }}
            >Cancelar</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ backgroundColor: 'gray', borderRadius: 0, color: 'white' }}
            >Salvar</Button>
          </> : <Button
              onClick={handleCancel}
              variant="contained"
              sx={{ backgroundColor: 'gray', borderRadius: 0, color: 'white' }}
            >Voltar</Button>}
        </Box>
      </Box>
    </Box>
  </Box>;
}

function defaultTask(user) {
  return {
    name: "",
    description: "",
    date: new Date(),
    personal: false,
    status: TASK_STATUS.READY,
    creator: user._id,
    users: [user._id]
  };
}

function getTask(subscriptionReady, taskId, user) {
  if(!subscriptionReady || !taskId)
    return defaultTask(user);

  return tasksCollection.findOne(taskId);
}

function getUsers(subscriptionReady, userIds) {
  if(!subscriptionReady)
    return [];

  return Meteor.users.find({
    _id: { $in: userIds }
  }, {
    fields: { id_: 1, username: 1}
  }).fetch();
}


export function EditTask() {

  const [taskSubscribed, setTaskSubscribed] = useState(false);
  const [userSubscribed, setUserSubscribed] = useState(false);
  const subscriptionReady = taskSubscribed && userSubscribed;

  subscribeTasks(() => {
    setTaskSubscribed(true);
  });
  subscribeUsers(() => {
    setUserSubscribed(true);
  });


  const user = Meteor.user(); 
  const { id } = useParams("id");
  const navigate = useNavigate();
  
  const task = useTracker(() => getTask(subscriptionReady, id, user));

  const isNewTask = id == null;
  const isEditor = task.creator === user._id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(formatDateTime(new Date()));
  const [users, setUsers] = useState([]);
  const [addUser, setAddUser] = useState("");
  const [personal, setPersonal] = useState(false);


  useEffect(() => {
    setName(task.name);
    setDescription(task.description);
    setDate(formatDateTime(task.date));
    setUsers(getUsers(subscriptionReady, task.users));
    setPersonal(task.personal);
  }, [subscriptionReady]);

  return <RenderData
    isNewTask={isNewTask}
    isEditor={isEditor}
    name={name}
    handleNameChange={e => setName(e.target.value)}
    description={description}
    handleDescriptionChange={e => setDescription(e.target.value)}
    date={date}
    handleDateChange={e => setDate(e.target.value)}
    users={users}
    currentUser={user}
    handleRemoveUser={userId => setUsers(users.filter(user => user._id !== userId))}
    addUser={addUser}
    handleChangeAddUser={e => setAddUser(e.target.value)}
    onAddUser={() => {

      if(addUser === "" || !subscriptionReady) {
        return;
      }

      const existingUser = users.find(user => user.username === addUser);
      if(existingUser) {
        setAddUser("");
        return;
      }

      const foundUser = Meteor.users.findOne({username: addUser});
      if(!foundUser) {
        alert("Usuário inexistente");
        setAddUser("");
        return;
      }

      setUsers([...users, foundUser]);
      setAddUser("");
    }}
    personal={personal}
    handleChangePersonal={() => setPersonal(!personal)}
    handleCancel={() => navigate("/list")}
    handleSave={() => {

      if(name === "") {
        alert("Nome não pode ser vazio");
        return;
      }

      const newDate = dateFromDateTimeString(date);
      const userIds = users.map(user => user._id);

      if(!isNewTask) {
        Meteor.call("tasks.update", id, {
          name,
          description,
          date: newDate,
          users: userIds,
          personal
        });
      } else {
        Meteor.call("tasks.create", {
          name,
          description,
          date: newDate,
          status: TASK_STATUS.READY,
          creator: user._id,
          users: userIds,
          personal
        });
      }
      navigate("/list");
    }}
  />;
}
