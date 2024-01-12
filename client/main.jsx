import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Login } from '../imports/ui/Login';
import { Redirect } from '../imports/ui/Redirect';
import { RedirectWrapper } from '../imports/ui/RedirectWrapper';
import { Hello } from '../imports/ui/Hello';
import { TodoList } from '../imports/ui/TodoList';
import { EditTask } from '../imports/ui/EditTask';
import { CreateUser } from '../imports/ui/CreateUser';
import { EditUser } from '../imports/ui/EditUser';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Redirect to="/login" />
  },
  {
    path: "/hello",
    element: <RedirectWrapper><Hello/></RedirectWrapper>
  },
  {
    path: "/list",
    element: <RedirectWrapper><TodoList/></RedirectWrapper>
  },
  {
    path: "/edit/:id?",
    element: <RedirectWrapper><EditTask/></RedirectWrapper>
  },
  {
    path: "/register",
    element: <CreateUser/>
  },
  {
    path: "/editUser",
    element: <RedirectWrapper><EditUser/></RedirectWrapper>
  }
]);

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
