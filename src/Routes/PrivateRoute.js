import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getAuth = () => {
  const user = sessionStorage.getItem("user");
  if (user !== null) {
    return true;
  } else {
    return false;
  }
};

const getRole = () => {
  let roles = [];
  const role = sessionStorage.getItem("roles")?.split(",");
  if (role?.length > 0) {
    role.forEach((role) => {
      roles.push(parseInt(role, 10));
    });
    return roles;
  } else return roles;
};

const PrivateRoute = ({ roles, routes }) => {
  let auth = getAuth();
  let role = getRole();
  let rolesList = roles.length !== 0 ? roles : role;

  return role?.filter((a) => rolesList?.includes(a)).length > 0 ? (
    <>
      <Outlet context={{ routes: routes ? routes : [] }} />
    </>
  ) : auth ? (
    <>
      <Navigate to="/unauthorized" />
    </>
  ) : (
    <>
      <Navigate to="/userlogin" />
    </>
  );
};

export default PrivateRoute;
