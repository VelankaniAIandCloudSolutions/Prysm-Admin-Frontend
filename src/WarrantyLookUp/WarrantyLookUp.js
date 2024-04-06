import React from "react";
import Select from "react-select";
import "./WarrantyLookUp.css";
import { PiFilesFill } from "react-icons/pi";
import { FaFileCirclePlus } from "react-icons/fa6";
import { BsFillFileEarmarkCodeFill } from "react-icons/bs";

export default function WarrantyLookUp() {
  const options = [
    { value: "serialNumber", label: "Serial Number" },
    { value: "contractID", label: "Contract ID" },
    { value: "customerID", label: "Customer ID " },
  ];
  return (
    <div className="Container-WarrantyLoohup">
      <h1>Warranty Lookup</h1>
      <h4>Search your entitlements by</h4>
      <div>
        <input type="radio" name="searchOption" />
        <label htmlFor="serialNumber">Serial Number</label>
        <input type="radio" name="searchOption" />
        <label htmlFor="contractID">Contract ID</label>
        <input type="radio" name="searchOption" />
        <label htmlFor="customerID">
          Customer ID (for software entitlement)
        </label>
        <br></br>
        <div className="Article">
          <div className="selectoption">
            <Select
              className="warrentyDropdown-input"
              options={options}
              isSearchable={true}
              placeholder="Select an Option"
            />
            <button className="submit-button" type="submit">
              Submit
            </button>
          </div>
          <div>
            <div>
              <a href="#">Article</a> How to check Warranty Information for your
              Data Center products
            </div>
            <br />
            <div>
              <a href="#">Article</a> How to find your serial number
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="box">
          <div class="box-icon">
            <PiFilesFill />
          </div>
          <div class="tile-item">
            <h2 className="box-title">View Warranty Policies</h2>
            <p className="box-Description">
              Know what is covered by your warranty
            </p>
          </div>
        </div>
        <div class="box">
          <div class="box-icon">
            <FaFileCirclePlus />
          </div>
          <div class="tile-item">
            <h2 className="box-title">Contact Us</h2>
            <p className="box-Description">Request service for your system</p>
          </div>
        </div>
        <div class="box">
          <div class="box-icon">
            <BsFillFileEarmarkCodeFill />
          </div>
          <div class="tile-item">
            <h2 className="box-title">Run Batch Query</h2>
            <p className="box-Description">
              Quickly find the entitlement status for several products at once
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
