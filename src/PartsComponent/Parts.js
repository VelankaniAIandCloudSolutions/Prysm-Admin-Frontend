import React from "react";
import "./Parts.css";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import { SiAmazonec2 } from "react-icons/si";

export default function Parts() {
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

  const commodityOptions = [
    { label: "All", value: "All" },
    { label: "Accessories", value: "Accessories" },
  ];

  return (
    <div className="parts_component_container">
      <div class="Parts_top">
        <div className="PartsImageHedding">
          <div className="Parts_Icon">
            <SiAmazonec2 />
          </div>
          <h2>Parts</h2>
        </div>
        <input
          type="text"
          placeholder="find parts for {element}"
          className="Parts_top_input textInput"
        ></input>
      </div>
      <div className="Parts_navbar">
        <div className="PartsNLeft">
          <NavLink to="" className="Parts_navbar_a">
            Machine Type
          </NavLink>
          <NavLink to="" className="Parts_navbar_a">
            Schematic
          </NavLink>
        </div>
        <div className="PartsNRight">
          <NavLink to="" className="Parts_navbar_a">
            Check Other Products
          </NavLink>
        </div>
      </div>

      <div className="PartsDdown">
        <label>Commodity Type:</label>
        <br />
        <Select
          options={commodityOptions}
          placeholder="Select Commodity..."
          className="PartsDdown_select"
          styles={SelectStyle}
        />
      </div>
      <div className="parts_item">
        <img
          src="https://download.lenovo.com/Images/Parts/42D8680/42D8680_A.jpg"
          alt="pic"
          className="parts_item_img"
        ></img>
        <div className="parts_item_div">
          <h3>WARNING LABEL</h3>
          <div className="product_innerDiv">
            <label>part name</label>
            <p> 42D8680</p>
          </div>
          <div className="product_innerDiv">
            <label>Commodity</label>
            <p>LABLES</p>
          </div>
        </div>
      </div>
      <div className="parts_item">
        <img
          src="https://download.lenovo.com/Images/Parts/46C7201/46C7201_2.jpg"
          alt="pic"
          className="parts_item_img"
        ></img>
        <div className="parts_item_div">
          <h3>Universal Top</h3>
          <div className="product_innerDiv">
            <label>part name</label>
            <p>46C7201</p>
          </div>
          <div className="product_innerDiv">
            <label>Commodity</label>
            <p>MECHANICAL - COVER</p>
          </div>
        </div>
      </div>
      <div className="parts_item">
        <img
          src="https://download.lenovo.com/Images/Parts/46C7201/46C7201_2.jpg"
          alt="pic"
          className="parts_item_img"
        ></img>
        <div className="parts_item_div">
          <h3>Universal kit</h3>
          <div className="product_innerDiv">
            <label>part name</label>
            <p>32R2451</p>
          </div>
          <div className="product_innerDiv">
            <label>Commodity</label>
            <p> MECHANICAL PART</p>
          </div>
        </div>
      </div>
    </div>
  );
}
