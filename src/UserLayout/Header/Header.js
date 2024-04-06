import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Header.css";
import logo from "../../assets/images/Prysm-technology.png";
import { useTranslation } from "react-i18next";
import { getDecodedToken } from "../../Helpers/validateToken";
import MyAccountPopup from "../../MyAccountPopup/MyAccountPopup";
import { getCrudApi } from "../../webServices/webServices";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [country, setCountry] = useState("IND");
  const [language, setLanguage] = useState("en");
  const [isHovered, setHovered] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [page, setPage] = useState("");
  const [name, setName] = useState("");
  const nation = [
    { value: "IND", label: "IND" },
    { value: "ENG", label: "ENG" },
    { value: "BNG", label: "BNG" },
    { value: "SRI", label: "SRI" },
    { value: "PAK", label: "PAK" },
    { value: "CNA", label: "CNA" },
  ];
  const Loptions = [
    { value: "en", label: "Eng" },
    { value: "ko", label: "KO" },
  ];
  const handleSelectLangauge = (e) => {
    setLanguage(e?.value);
    i18n.changeLanguage(e?.value);
  };
  const handleselectcountry = (e) => {
    setCountry(e?.value);
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontWeight: "400",
      "&:hover": {
        border: "1px solid rgb(201, 200, 200)",
        boxShadow: "0 0 3px grey",
        cursor: "pointer",
      },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPage("/Home");
    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
    ) {
      let decodedToken = getDecodedToken(sessionStorage.getItem("user"));
      if (parseInt(decodedToken?.isStaff) === (0 | 1)) {
      }
    } else {
      setIsShow(true);
    }
  };

  const handleMyOrders = (e) => {
    e.preventDefault();
    setPage("MyOrders");
    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
    ) {
      let decodedToken = getDecodedToken(sessionStorage.getItem("user"));
      if (parseInt(decodedToken?.isStaff) === (0 | 1)) navigate("/MyOrders");
    } else {
      setIsShow(true);
    }
  };

  const handleMyProducts = (e) => {
    e.preventDefault();
    setPage("MyProducts");
    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
    ) {
      let decodedToken = getDecodedToken(sessionStorage.getItem("user"));
      if (parseInt(decodedToken?.isStaff) === (0 | 1)) navigate("/MyProduct");
    } else {
      setIsShow(true);
    }
  };
  useEffect(() => {
    (async () => {
      await getUserData();
    })();
  }, []);
  const logoutClick = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/Home");
    window.location.reload();
  };

  const getUserData = async () => {
    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
    ) {
      let decodedToken = getDecodedToken(sessionStorage.getItem("user"));
      await getCrudApi(
        "api/v1/user_account/user_acc_addr/" + decodedToken?.userId,
        {}
      ).then((data) => {
        setName(
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
    }
  };
  return (
    <nav className="NavbarContainer">
      <div className="NavbarLeftdiv">
        <div className="listitem">
          <img className="company_logo" src={logo} alt="pic"></img>
        </div>
        <div className="listitem">
          <NavLink className="Navbar_anchor" to={"/Home"}>
            {t("header.home")}
          </NavLink>
        </div>
      </div>
      <div className="NavbarRightdiv">
        <div className="listitem">
          <div
            className="Navbar_anchor"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {name ? name : t("header.myaccount")}
            <>
              {" "}
              {isHovered && (
                <div
                  className={
                    sessionStorage.getItem("user")
                      ? "myaccount_dropdown-height"
                      : "myaccount_dropdown"
                  }
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {sessionStorage.getItem("user") ? (
                    ""
                  ) : (
                    <div className="myaccount-dropdown">
                      <button onClick={handleLogin} className="myAccountLinks">
                        Log-In
                      </button>
                    </div>
                  )}
                  <div className="myOrdersDiv">
                    <button onClick={handleMyOrders} className="myAccountLinks">
                      My Orders
                    </button>
                  </div>
                  <div className="myOrdersDiv">
                    <button
                      onClick={handleMyProducts}
                      className="myAccountLinks"
                    >
                      My Products
                    </button>
                  </div>
                  <button
                    className="Homelogout-btn myAccountLinks"
                    onClick={logoutClick}
                  >
                    Log Out <i class="fa fa-sign-out"></i>
                  </button>
                </div>
              )}
            </>
          </div>
        </div>
        <div className="listitem">
          <Select
            className="NavbarRightdiv_select"
            value={nation.find((option) => option.value === country)}
            styles={SelectStyle}
            onChange={handleselectcountry}
            options={nation}
          />
        </div>
        <div className="listitem">
          <Select
            className="NavbarRightdiv_select"
            value={Loptions.find((option) => option.value === language)}
            styles={SelectStyle}
            onChange={handleSelectLangauge}
            options={Loptions}
          />
        </div>
      </div>
      <>
        {isShow && page !== "" ? (
          <MyAccountPopup
            page={page}
            setPage={setPage}
            setIsShow={setIsShow}
            setName={setName}
          />
        ) : (
          <></>
        )}
      </>
    </nav>
  );
}
