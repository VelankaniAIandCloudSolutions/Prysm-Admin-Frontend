import React, { useEffect, useState } from "react";
import "./Support.css";
import ProductHome from "./ProductHome/ProductHome";
import DriversAndSoftware from "./DriversAndSoftware/DriversAndSoftware";
import Troubleshooting from "./Troubleshooting/Troubleshooting";
import HowTo from "./HowToComponent/HowToComponent";
import GuidesAndManuals from "./GuidesAndManuals/GuidesAndManuals";
import WarrantyAndServices from "./WarrantyAndServices/WarrantyAndServices";
import RepairStatus from "./RepairStatus/RepairStatus";
import Parts from "./PartsComponent/Parts";
import ContactUs from "./ContactUsComponent/ContactUs";
import {
  FaHome,
  FaDownload,
  FaBook,
  FaDirections,
  FaHeadphones,
} from "react-icons/fa";
import { AiOutlineShareAlt } from "react-icons/ai";
import { GrShieldSecurity } from "react-icons/gr";
import { GiAutoRepair } from "react-icons/gi";
import { getCrudApi } from "./webServices/webServices";
export default function Support() {
  const [ActiveComponent, setActiveComponent] = useState("ProductHome");
  const [productData, setProductData] = useState({});
  // const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;
  const BASE_URL = "https://prysmsupport.xtractautomation.com/";
  useEffect(() => {
    let productId = parseInt(sessionStorage.getItem("productId"));
    getProductById(productId);
  }, []);

  const getProductById = async (id) => {
    await getCrudApi("api/v1/product/" + id, {}).then((res) => {
      if (res) {
        setProductData(res[0]);
      }
    });
  };

  const renderActiveComponent = (currentComponent) => {
    setActiveComponent(currentComponent);
  };

  return (
    <div className="SUPPORT">
      <div className="SupportleftContainer">
        <div className="support-Img-Div">
          <img
            className="SupportleftContainer-img"
            src={BASE_URL + productData?.productImagePath}
            alt="pic"
          ></img>
        </div>
        <p className="Supportleft_paragraph">{productData?.name}</p>
        <input
          type="text"
          placeholder="Enter Serial Number"
          className="LeftSupportInput textInput"
        ></input>
        <div className="LeftNavigation_Buttons">
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "ProductHome" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("ProductHome")}
            >
              <div className="LeftNavigation_button_Icon"></div>
              <FaHome /> Product Home
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "DriversAndSoftware" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("DriversAndSoftware")}
            >
              <FaDownload /> Drivers & Software
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "Troubleshooting" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("Troubleshooting")}
            >
              <AiOutlineShareAlt /> Troubleshooting
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "HowTo" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("HowTo")}
            >
              <FaBook /> How To's
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "GuidesAndManuals" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("GuidesAndManuals")}
            >
              <FaDirections /> Guides & Manuals
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "WarrantyAndServices" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("WarrantyAndServices")}
            >
              <GrShieldSecurity /> Warranty & Services
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div
              className={`LeftNavigation_button ${
                ActiveComponent === "RepairStatus" ? "active" : ""
              }`}
              onClick={() => renderActiveComponent("RepairStatus")}
            >
              <GiAutoRepair /> Repair Status
            </div>
          </div>
          <div className="LeftNavigationButton">
            <div className="LeftNavigationButtonBorderDiv">
              <div
                className={`LeftNavigation_button ${
                  ActiveComponent === "ContactUs" ? "active" : ""
                }`}
                onClick={() => renderActiveComponent("ContactUs")}
              >
                <FaHeadphones /> Contact Us
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Supportright_Container">
        {ActiveComponent === "ProductHome" ? (
          <ProductHome />
        ) : ActiveComponent === "DriversAndSoftware" ? (
          <DriversAndSoftware id={productData?.productID} />
        ) : ActiveComponent === "Troubleshooting" ? (
          <Troubleshooting />
        ) : ActiveComponent === "HowTo" ? (
          <HowTo id={productData?.productID} />
        ) : ActiveComponent === "GuidesAndManuals" ? (
          <GuidesAndManuals id={productData?.productID} />
        ) : ActiveComponent === "WarrantyAndServices" ? (
          <WarrantyAndServices />
        ) : ActiveComponent === "RepairStatus" ? (
          <RepairStatus />
        ) : ActiveComponent === "Parts" ? (
          <Parts />
        ) : ActiveComponent === "ContactUs" ? (
          <ContactUs />
        ) : null}
      </div>
    </div>
  );
}
