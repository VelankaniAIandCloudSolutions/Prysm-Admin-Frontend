import React from "react";
import "./PageNotFound.css";
import error from "../assets/images/error.png";
import { Navigate } from "react-router-dom";
export default function PageNotFound() {
  const getAuth = () => {
    const user = sessionStorage.getItem("user");
    if (user !== null) {
      return true;
    } else {
      return false;
    }
  };
  let auth = getAuth();
  return (
    <>
      {auth ? (
        <>
          {" "}
          <section className="page_404">
            <div className="page_404-container">
              <div className="four_zero_four_bg">
                <img src={error} alt="Error" className="page_404-img" />
              </div>

              <div className="contant_box_404">
                <p className="four_zero_four_bg-h3"> Look like you're lost</p>
                <p>The page you are looking for not available!</p>
                <a href="/" className="link_404">
                  Go to Home
                </a>
              </div>
            </div>
          </section>
        </>
      ) : (
        <Navigate to="/userlogin" />
      )}
    </>
  );
}
