import React, { useState } from "react";
import { Meteor } from 'meteor/meteor';
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if(username === "" || password === "") {
      return;
    }

    Meteor.loginWithPassword(username, password, (error) => {
      if(error) {
        setPassword("");
        alert("Login failed.");
      } else {
        navigate("/hello");
      }
    });
  }

  return (
    <form className="login-form-container" onSubmit={handleSubmit}>
      <input
        className="login-form-text-input"
        type="text"
        value={username}
        placeholder="user name"
        onChange={e => setUsername(e.target.value)}/>
      <input
        className="login-form-text-input"
        type="password"
        value={password}
        placeholder="password"
        onChange={e => setPassword(e.target.value)}/>
      <input className="submit-button" type="submit" value="Entrar"/>
    </form>
  );
}
