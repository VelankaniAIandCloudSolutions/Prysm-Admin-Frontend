import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

import logo from "../../assets/images/Prysm-technology_icon.png";
export default function AdminHeader() {
  const navigate = useNavigate();
  const logoutClick = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/userLogin");
    window.location.reload();
  };
  return (
    <nav className="NavbarContainer-admin">
      <div>
        <ul className="Navbar_ul-admin">
          <li className="listitem-admin">
            <img className="company_logo-admin" src={logo} alt="pic"></img>
          </li>
        </ul>
      </div>
      <div className="NavbarRightdiv-admin">
        <ul className="Navbar_ul-admin">
          <li className="listitem-admin">
            <NavLink
              className="Navbar_anchor-admin"
              to={"/userlogin"}
              style={{ padding: 10 }}
            >
              <button className="logout-btn" onClick={logoutClick}>
                <i class="fa fa-sign-out"></i>
              </button>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
