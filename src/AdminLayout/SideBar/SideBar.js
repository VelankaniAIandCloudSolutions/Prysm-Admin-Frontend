import React, { useState } from "react";
import "./SideBar.css";
import {
  NavLink,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { getDecodedToken } from "../../Helpers/validateToken";

export default function MiniDrawer(props) {
  const [show, setShow] = useState(false);
  const [actions, setActions] = React.useState([]);
  const context = useOutletContext();
  React.useEffect(() => {
    var decoded = getDecodedToken();
    if (decoded !== null) {
      let routes = context?.routes;
      setActions(routes);
    }
  });
 
  const location = useLocation();

  return (
    <>
      <div className={show ? "sidebar" : " sidebar1"}>
        <ul className="sidebar-ul">
          <div
            className="toggle-menu "
            onClick={() => {
              setShow(!show);
              props.setSidebarOpen(!show);
            }}
          >
            <i class="fa fa-bars toggle-menu-icon"></i>
          </div>
          {actions?.map((text, index) => {
            const isActive = location && location?.pathname === text?.path;

            return text?.icon ? (
              <NavLink to={text?.path} key={index}>
                <div className="menu-tooltip">
                  <span
                    className={
                      show
                        ? "menu-tooltip-span-opensidebar"
                        : "menu-tooltip-span"
                    }
                  >
                    {text?.breadcrumb}
                  </span>

                  <li key={text?.breadcrumb} className="sidebar-li">
                    <div
                      className={`side-nav-bar-icon ${
                        isActive ? "active-link" : ""
                      }`}
                    >
                      {text?.icon}
                    </div>
                    <div
                      className={`sidebar-breadcrumb ${
                        !show ? "nav-text-color" : ""
                      }`}
                    >
                      {text?.breadcrumb}
                    </div>
                  </li>
                </div>
              </NavLink>
            ) : (
              <></>
            );
          })}
        </ul>
      </div>
    </>
  );
}
