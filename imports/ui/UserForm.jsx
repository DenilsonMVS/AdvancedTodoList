
import React, { useState, useEffect } from "react";

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { PhotoInput } from "./PhotoInput";
import { formatDate } from "./utils/parseDate";


export function UserForm({
  initName="",
  initEmail="",
  initBirthDate=new Date(),
  initSex="s",
  initCompany="",
  initImage=null,
  onSubmit,
  onCancel,
  newUser
}) {
  const [name, setName] = useState(initName);
  const [email, setEmail] = useState(initEmail);
  const [birthDate, setBirthDate] = useState(formatDate(initBirthDate));
  const [sex, setSex] = useState(initSex);
  const [company, setCompany] = useState(initCompany);
  const [image, setImage] = useState(initImage);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName(initName);
    setEmail(initEmail);
    setBirthDate(formatDate(initBirthDate));
    setSex(initSex);
    setCompany(initCompany);
    setImage(initImage);
  }, [initName, initEmail, initBirthDate, initSex, initCompany, initImage]);

  const onChangePhoto = newImage => {
    setImage(newImage);
  };

  return <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <Box width="50%">
      <Box padding="10px">
        <PhotoInput value={image} onChange={onChangePhoto}/>
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="Nome"
          variant="filled"
          value={name}
          required
          disabled={!newUser}
          onChange={(e) => setName(e.target.value)}/>
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="e-mail"
          variant="filled"
          type="email"
          value={email}
          disabled={!newUser}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="Data de Nascimento"
          variant="filled"
          type="date"
          value={birthDate}
          required
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </Box>
      <Box padding="10px">
        <FormControl fullWidth required>
          <InputLabel id="demo-simple-select-label">Sexo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={sex}
            label="Sexo"
            onChange={e => setSex(e.target.value)}
          >
            <MenuItem value="s">Selecionar</MenuItem>
            <MenuItem value="m">Masculino</MenuItem>
            <MenuItem value="f">Feminino</MenuItem>
            <MenuItem value="n">Não Informar</MenuItem>  
          </Select>
        </FormControl>
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="Empresa"
          variant="filled"
          value={company}
          required
          onChange={(e) => setCompany(e.target.value)}
        />
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="Senha"
          variant="filled"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box padding="10px">
        <TextField
          fullWidth
          label="Confirmar senha"
          variant="filled"
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Box>
      <Box padding="10px" display="flex" justifyContent="space-around">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSubmit({
          name,
          email,
          birthDate,
          sex,
          company,
          image,
          password,
          confirmPassword
        })}>Salvar</Button>
      </Box>
    </Box>
  </Box>;
}
