import React from "react";
import { Redirect } from "./Redirect";
import { Meteor } from 'meteor/meteor';

export function RedirectWrapper(props) {
  const user = Meteor.user();
  if(!user) {
    return <Redirect to="/login"/>
  } else {
    return props.children;
  }
}
