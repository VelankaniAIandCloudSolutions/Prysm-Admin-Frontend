import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  routes,
  totalRoutes,
  totalElements,
  componentsregistry,
} from "./Routes/Route";
import UnAuthorized from "./UnAuthorized/UnAuthorized";
import PageNotFound from "./PageNotFound/PageNotFound";
import { RouteContext } from "./Routes/RouteContext";
import PrivateRoute from "./Routes/PrivateRoute";
import UserLogin from "./UserLogin/UserLogin";
import Layout from "./Layout/Layout";
import AdminLayout from "./AdminLayout/AdminLayouts/AdminLayout";
import { filterPlainArray } from "./Helpers/Helpers";

import ToastHelper from "./ToastHelper";

export default function App() {
  const [rolesArrayFilter, setRolesArrayFilter] = useState([]);
  const [routesList, setRoutesList] = useState([]);
  const [adminTestVar, setAdminTestVar] = useState("admintest");
  const [adminrolesArrayFilter, setAdminRolesArrayFilter] = useState([]);

  useEffect(() => {
    let roles = [];
    const role = sessionStorage.getItem("roles")?.split(",");
    if (role?.length > 0) {
      role.forEach((role) => {
        roles.push(parseInt(role, 10));
      });
    }
    setAdminRolesArrayFilter(roles);
    setRolesArrayFilter(roles);
    setRoutesList(
      roles
        .map((role) => {
          return totalRoutes.filter((route) => route.roleId.includes(role));
        })
        .flat()
    );
  }, [adminTestVar]);

  useEffect(() => {
    if (adminrolesArrayFilter.length <= 0) {
      let roles = [];
      const role = sessionStorage.getItem("roles")?.split(",");
      if (role?.length > 0) {
        role.forEach((role) => {
          roles.push(parseInt(role, 10));
        });
      }
      setAdminRolesArrayFilter(roles);
      setRolesArrayFilter(roles);
      setRoutesList(
        roles
          .map((role) => {
            return totalRoutes.filter((route) => route.roleId.includes(role));
          })
          .flat()
      );
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <RouteContext.Provider
          value={filterPlainArray([...routesList, ...routes], {
            roleId: rolesArrayFilter,
          })}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/Home" />} />
            <Route element={<Layout />}>
              {routes?.map((route, index) => {
                return (
                  <>
                    <Route
                      path={route?.path}
                      element={componentsregistry[route?.element]}
                    />
                  </>
                );
              })}
            </Route>
            <Route
              path="/userlogin"
              element={
                <UserLogin
                  adminTestVar={adminTestVar}
                  setAdminTestVar={setAdminTestVar}
                />
              }
            />

            <Route
              element={
                <PrivateRoute
                  roles={adminrolesArrayFilter}
                  routes={routesList}
                />
              }
            >
              <Route element={<AdminLayout />}>
                {routesList.map((route, index) => {
                  return (
                    <>
                      <Route
                        path={route?.path}
                        element={totalElements[route?.element]}
                      />
                    </>
                  );
                })}
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
            <Route path="/unauthorized" element={<UnAuthorized />} />
          </Routes>
        </RouteContext.Provider>
      </BrowserRouter>
      <ToastHelper />
    </div>
  );
}
