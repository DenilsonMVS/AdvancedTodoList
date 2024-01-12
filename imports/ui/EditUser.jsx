import React, { useState, useEffect } from "react";
import { UserForm } from "./UserForm";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { userData } from "../db/userData";
import { useTracker } from 'meteor/react-meteor-data';
import { dateFromDateString } from "./utils/parseDate";

import { subscribeUserData } from "../db/userData";


export function EditUser() {

  const [subscriptionReady, setSubscriptionReady] = useState(false);
  subscribeUserData(() => setSubscriptionReady(true));

  const navigate = useNavigate();

  const user = Meteor.user();
  const name = user.username;
  const email = user.emails[0].address;

  const [birthDate, setBirthDate] = useState(new Date());
  const [sex, setSex] = useState("s");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if(!subscriptionReady) {
      return;
    }

    const data = userData.findOne({ userId: user._id });
    setBirthDate(data.birthDate);
    setSex(data.sex);
    setCompany(data.company);
    setImage(data.image);
  }, [subscriptionReady]);


  const onSubmit = ({
    birthDate,
    sex,
    company,
    image,
    password,
    confirmPassword
  }) => {
  
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

    if(password !== "" && password != confirmPassword) {
      alert("Senhas não são iguais.");
      return;
    }

    Meteor.call("userData.update", {
      birthDate: dateFromDateString(birthDate),
      sex: sex,
      company: company,
      image: image
    });

    if(password !== "") {
      Meteor.call("user.changePassword", password);
    }

    navigate("/hello");
  };

  return <UserForm
    initName={name}
    initBirthDate={birthDate}
    initCompany={company}
    initEmail={email}
    initImage={image}
    initSex={sex}
    onSubmit={onSubmit}
    onCancel={() => navigate("/hello")}
    newUser={false}
  />;
}
