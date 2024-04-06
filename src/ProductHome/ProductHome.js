import React, { useState } from "react";
import "./ProductHome.css";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export default function ProductHome() {
  const [showSecondList, setShowSecondList] = useState(false);
  const [showSecondList1, setShowSecondList1] = useState(false);

  const toggleSecondList = () => {
    setShowSecondList(!showSecondList);
  };
  const toggleSecondList1 = () => {
    setShowSecondList1(!showSecondList1);
  };
  const navigate = useNavigate();
  return (
    <div className="productHome">
      <div className="productHomeTop">
        <div className="productHomeImageHedding">
          <FaHome size={25} style={{ padding: "0 2% 0 0" }} />
          <h2>Product Home</h2>
        </div>
        <button
          onClick={() => {
            navigate("/Home/DataCenter/Support/ServiceRequest");
          }}
          className="producthomeHelp_button globalButton"
        >
          Need Help?
        </button>
      </div>
      <div className="productHome_info">
        <div className="productHome_info_row1">
          <div>
            <h3>Product info </h3>
            <p>Serial Number:</p>
            <p>Machine Type:</p>
          </div>
        </div>
        <div className="productHomeWarranty">
          <h3 className="warranty_heading">Warranty Status Unknown Warranty</h3>
          <p>
            Enter your machine's serial number to the left to view warranty
            details
          </p>
        </div>
      </div>
      <div className="product_info_row2">
        <div className="referenceInfo">
          <h2>Reference Info</h2>
          <ul
            className={`referenceinfo_list ${showSecondList ? "hide" : "show"}`}
          >
            <li>Product Information</li>
            <li>How to find system Serial Number</li>
            <li>Velankani Press</li>
            <li>Configuration and Options Guide</li>
            <li>RAID Introduction</li>
          </ul>
          <ul
            className={`referenceinfo_list ${showSecondList ? "show" : "hide"}`}
          >
            <li>RAID Management Tools and Resources</li>
            <li>Feature On Demand Key</li>
            <li>Server OS Support Center</li>
          </ul>
          <div
            className={`show-button ${showSecondList ? "move-to-top" : ""}`}
            onClick={toggleSecondList}
            style={{ width: "100%" }}
          >
            {showSecondList ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
          </div>
        </div>
        <div className="productHomeTools">
          <h2>Tools & Resources</h2>
          <ul className={`Tools_list ${showSecondList1 ? "hide" : "show"}`}>
            <li>Firmware and Drivers</li>
            <li>XClarity Free Trial</li>
            <li>XClarity Administrator</li>
            <li>XClarity Essentials OneCLI</li>
            <li>XClarity Essentials Bootable Media Creator</li>
          </ul>
          <ul className={`Tools_list ${showSecondList1 ? "show" : "hide"}`}>
            <li>XClarity Essentials UpdateXpress</li>
            <li>Velankani Custom Images</li>
            <li>SUSE Linux Installation kits</li>
            <li>XClarity Administrator Registration</li>
          </ul>
          <div
            className={`show-button ${showSecondList1 ? "move-to-top" : ""}`}
            onClick={toggleSecondList1}
            style={{ width: "100%" }}
          >
            {showSecondList1 ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
          </div>
        </div>
      </div>
    </div>
  );
}
