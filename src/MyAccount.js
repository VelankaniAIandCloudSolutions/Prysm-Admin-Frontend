import React, { useState } from "react";
import "./MyAccount.css";
import { useNavigate } from "react-router-dom";
import { Login } from "./webServices/webServices";
import { toast } from "react-toastify";
import { getDecodedToken } from "./Helpers/validateToken";
import showPwdImg from "./assets/Icons/closedeye.png";
import hidePwdImg from "./assets/Icons/openeye.png";

export default function MyAccount() {
  return (
    <div className="userAccount">
      <LeftText />
      <UserLogin />
    </div>
  );
}

function LeftText() {
  return (
    <div className="left_Container">
      <h1>Welcome to Velankani!</h1>
    </div>
  );
}

function UserLogin(props) {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  var CryptoJS = require("crypto-js");
  const handleLogin = (e) => {
    sessionStorage.setItem("userName", userName);
    e.preventDefault();
    if (userName !== "" && userPassword !== "") {
      let encryptdPassword = CryptoJS.AES.encrypt(
        userPassword,
        "cipherAce"
      ).toString();
      const userdetails = {
        username: userName,
        password: encryptdPassword,
      };
      Login(userdetails, "api/v1/login/").then((data) => {
        if (data) {
          let decodedToken = getDecodedToken(data);
          let roles = decodedToken?.role;
          sessionStorage.setItem("roles", roles);
          props?.setAdminTestVar(roles);
          navigate("/Admin");
          notifyUserLogoin();
        } else {
          notifyUserLoginError();
        }
      });
    } else {
      alert("Invalid Credentials");
      notifyUserLoginError();
    }
  };

  const notifyUserLogoin = () => {
    toast.success("LoggedIn Successfully");
  };

  const notifyUserLoginError = () => {
    toast.error("Invalid credentials");
  };

  return (
    <div className="login_Form">
      <h2 className="login_Heading">SignIn</h2>
      <form className="login_form">
        <label className="Loginlabel">Username</label>
        <input
          type="text"
          placeholder="Username"
          className="login_input textInput"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label className="Loginlabel">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="login_input textInput"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <img
          className="pwd-container"
          title={passwordVisible ? "Hide password" : "Show password"}
          src={passwordVisible ? showPwdImg : hidePwdImg}
          onClick={() => setPasswordVisible((prevState) => !prevState)}
          alt="Eye"
        />
        <div className="button1">
          <button
            type="submit"
            onClick={handleLogin}
            className="login_button globalButton"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
