import React, { useState } from "react";
import "./MyAccountPopup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login, getCrudApi } from "../webServices/webServices";
import { getDecodedToken } from "../Helpers/validateToken";
import showPwdImg from "../assets/Icons/closedeye.png";
import hidePwdImg from "../assets/Icons/openeye.png";

export default function MyAccountPopup(props) {
  return (
    <div className="popupUserLogin">
      <div className="userLoginPopupInnerDiv">
        <div className="popupUserAccount">
          <LeftText />
          <UserLogin {...props} />
        </div>
      </div>
    </div>
  );
}

function LeftText() {
  return (
    <div className="popupLeft_Container">
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
  const handleLogin = async (e) => {
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
      Login(userdetails, "api/v1/login/").then(async (data) => {
        if (data) {
          let decodedToken = getDecodedToken(data);
          let roles = decodedToken?.role;
          sessionStorage.setItem("roles", roles);

          if (props?.page === "ContactUs") {
            navigate("/Home/DataCenter/Support/ServiceRequest");
          } else if (props?.page === "MyOrders") {
            navigate("/MyOrders");
          } else if (props?.page === "MyProducts") {
            navigate("/MyProduct");
          }
          await getCrudApi(
            "api/v1/user_account/user_acc_addr/" + decodedToken?.userId,
            {}
          ).then((data) => {
            props?.setName(
              data[0]
                ? (data[0]?.firstName !== null ? data[0]?.firstName : "") +
                    " " +
                    (data[0]?.lastName !== null && data[0]?.firstName !== null
                      ? data[0]?.lastName
                      : "")
                : sessionStorage.getItem("userName")
                ? sessionStorage.getItem("userName")
                : ""
            );
          });
          notifyUserLogoin();
          props?.setIsShow(false);
          props?.setPage("");
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
    <div className="popupLogin_Form">
      <h2 className="popupLogin_Heading">SignIn</h2>
      <form className="popupLogin_form">
        <label className="popupLoginlabel">Username</label>
        <input
          type="text"
          placeholder="Username"
          className="popupLogin_input textInput"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        ></input>
        <div className="popup-acc-input-pwd">
          <label className="popupLoginlabel">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="popupLogin_input textInput"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <img
            className="pwd-container-accountpopup"
            title={passwordVisible ? "Hide password" : "Show password"}
            src={passwordVisible ? showPwdImg : hidePwdImg}
            onClick={() => setPasswordVisible((prevState) => !prevState)}
            alt="Eye"
          />
        </div>

        <div className="popupButton1">
          <button
            type="submit"
            onClick={handleLogin}
            className="popupLogin_button globalButton"
          >
            Sign in
          </button>
          <button className="popupLogin_button globalButton">Close</button>
        </div>
      </form>
    </div>
  );
}
