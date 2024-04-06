import React from "react";
import "./RepairStatus.css";
import { GiAutoRepair } from "react-icons/gi";

export default function RepairStatus() {
  return (
    <div className="RepairStatus_div1">
      <div className="RepairStatus_top">
        <div className="RepairStatusImageHedding">
          <div className="RepairStatus_icon">
            <GiAutoRepair />
          </div>
          <h2>Repair Status</h2>
        </div>
      </div>
      <div className="RepairStatus_div2">
        <p>
          It looks like there are no historical repair cases under this serial
          number. You may search by a specific repair ticket or another serial
          number.
        </p>
        <input
          type="text"
          placeholder="Enter Serial Number"
          className="RepairStatus_div2_input textInput"
        ></input>
      </div>
    </div>
  );
}
