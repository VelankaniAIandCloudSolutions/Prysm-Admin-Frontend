import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../UserLayout/Header/Header";
import Footer from "../UserLayout/Footer/Footer";
import "./Layout.css";
import Breadcrumbs from "../BreadCrumbs/BreadCrumbs";

export default function Layout(props) {
  return (
    <div>
      <div className="App_NavigationBar">
        <Header />
      </div>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="body-wrapper">
            <Breadcrumbs routing={props?.routpaths} />
            <Outlet />
          </div>
        </div>
      </div>
      <div className="App_footer">
        <Footer />
      </div>
    </div>
  );
}
