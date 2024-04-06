import React from "react";
import "./WarrantyAndServices.css";
import { GrShieldSecurity } from "react-icons/gr";

export default function WarrantyAndServices() {
  return (
    <div className="warrentyAndStatus_div1">
      <div className="WarrantyAndServices_top">
        <div className="WarrantyAndServicesImageHedding">
          <div className="WarrentyAndServices_icon">
            <GrShieldSecurity />
          </div>
          <h2>Warranty & Services</h2>
        </div>
      </div>
      <div className="warrentyAndStatus_div2">
        <p>Warranty Status: Serial number Required</p>
        <p>
          Log in or enter your machine's serial number below to view your
          warranty status
        </p>
        <input
          type="text"
          placeholder="Enter Serial Number"
          className="warrentyAndStatus_input textInput"
        ></input>
      </div>
    </div>
  );
}
