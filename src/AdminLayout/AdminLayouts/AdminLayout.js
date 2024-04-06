import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar"
import "./AdminLayout.css"
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminFooter from "../AdminFooter/AdminFooter";
import Breadcrumbs from "../../BreadCrumbs/BreadCrumbs";

export default function AdminLayout(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let headerComponent = <AdminHeader sidebarOpen={sidebarOpen} />;
  let sidebarComponent = <SideBar routing={props?.routpaths} setSidebarOpen={setSidebarOpen} />;
  let footerComponent = <AdminFooter />;

  return (
    <div className="container-scroller">
      {sidebarComponent}
      <div className=" page-body-wrapper">
        {headerComponent}
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="admin-body-wrapper">
              <Breadcrumbs routing={props?.routpaths}/>
              <Outlet />
            </div>
            <div className="App_footer">
                {footerComponent}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}






