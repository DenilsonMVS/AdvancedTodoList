import React from "react";
import { UserForm } from "./UserForm";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { dateFromDateString } from "./utils/parseDate";
import { validateEmail } from "./utils/email";


export function CreateUser() {

  const navigate = useNavigate();

  const onSubmit = ({
    name,
    email,
    birthDate,
    sex,
    company,
    image,
    password,
    confirmPassword,
  }) => {
    if (name === "") {
      alert("Nome vazio.");
      return;
    }
  
    if (email === "0") {
      alert("Email vazio.");
      return;
    }

    if(!validateEmail(email)) {
      alert("Email invalido.");
      return;
    }
  
    if (sex === "s") {
      alert("Sexo vazio.");
      return;
    }
  
    if (company === "") {
      alert("Empresa vazia.");
      return;
    }
  
    if (image === null) {
      alert("Imagem vazia.");
      return;
    }

    if(password === "") {
      alert("Senha vazia.");
      return;
    }

    if(password !== confirmPassword) {
      alert("Senhas não são iguais.")
      return;
    }

    Meteor.call("user.create", {
      name,
      email,
      birthDate: dateFromDateString(birthDate),
      sex,
      company,
      image,
      password
    }, (error, result) => {
      if(error) {
        alert(error);
      } else {
        navigate("/login");
      }
    });
  };

  const onCancel = () => {
    navigate("/login");
  };

  return <UserForm onSubmit={onSubmit} onCancel={onCancel} newUser={true}/>
}
