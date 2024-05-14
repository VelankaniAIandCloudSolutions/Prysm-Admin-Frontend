import { React, useState } from "react";
import "./UserLogin.css";
import { Navigate, useNavigate } from "react-router-dom";
import loginPicVector2 from "../assets/images/login_page_support_2.jpg";
import logo from "../assets/images/Prysm-technology.png";
import { Login } from "../webServices/webServices";
import showPwdImg from "../assets/Icons/closedeye.png";
import hidePwdImg from "../assets/Icons/openeye.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDecodedToken } from "../Helpers/validateToken";
import LoadingScreen from "../Loading/Loading";

var CryptoJS = require("crypto-js");

export default function UserLogin(props) {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    setIsLoading(true);
    sessionStorage.setItem("userName", userName);
    e.preventDefault();
    if (userName !== "" && password !== "") {
      // let encryptdPassword = CryptoJS.AES.encrypt(
      //   password,
      //   "cipherAce"
      // ).toString();
      const userdetails = {
        username: userName,
        password: password,
      };
      Login(userdetails, "api/v1/login/").then((data) => {
        if (data) {
          let decodedToken = getDecodedToken(data);
          let roles = decodedToken?.role;
          sessionStorage.setItem("roles", roles);
          props?.setAdminTestVar(roles);
          if (roles === 1) {
            navigate("/Admin");
          } else if (roles === 7 || roles === 8 || roles === 6) {
            navigate("/Ticket");
          }

          notifyUserLogoin();
        } else {
          notifyUserLoginError();
        }
      });
    } else {
      notifyUserLoginError();
    }
    setIsLoading(false);
  }

  const notifyUserLogoin = () => {
    toast.success("LoggedIn Successfully");
  };

  const notifyUserLoginError = () => {
    toast.error("Invalid credentials");
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {sessionStorage.getItem("user") !== null &&
          sessionStorage.getItem("user").length > 10 ? (
            <>
              <Navigate to="/Admin" />
            </>
          ) : (
            <div className="login-background-div">
              <div className="login-sub-Main1">
                <div className="login-sub-main-img">
                  <div className="login-sub-main-imgdiv">
                    <img src={loginPicVector2} height={680} alt="test"></img>
                  </div>
                </div>
              </div>
              <div className="login-sub-Main">
                <div className="login-screen-2">
                  <div className="screen__content">
                    <div className="login__form__div">
                      <div className="login__field">
                        <input
                          class="login__input"
                          name="username"
                          type="username"
                          placeholder="UserName"
                          value={userName}
                          onChange={(e) => setuserName(e.target.value)}
                        />
                      </div>
                      <div className="login__field">
                        <input
                          class="login__input"
                          name="password"
                          placeholder="Password"
                          value={password}
                          type={passwordVisible ? "text" : "password"}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <img
                          className="pwd-container"
                          title={
                            passwordVisible ? "Hide password" : "Show password"
                          }
                          src={passwordVisible ? showPwdImg : hidePwdImg}
                          onClick={() =>
                            setPasswordVisible((prevState) => !prevState)
                          }
                          alt="Eye"
                        />
                      </div>
                      <div className="login-password-check"></div>
                      <button class="login__submit" onClick={handleSubmit}>
                        Login
                      </button>
                    </div>

                    <div>
                      <img
                        className="login-logo"
                        src={logo}
                        alt="Prysm"
                        width={70}
                        height={50}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
