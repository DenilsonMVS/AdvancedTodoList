import React from "react";
import { LoginForm } from './LoginForm';
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="root-div">
      <h1>Bem vindo ao todo list</h1>
      <LoginForm/>
      <button className="secondary-button" onClick={() => navigate("/register")}>Cadastrar</button>
      <button className="secondary-button" onClick={() => console.log("recuperar senha")}>Recuperar Senha</button>
    </div>
  );
};
