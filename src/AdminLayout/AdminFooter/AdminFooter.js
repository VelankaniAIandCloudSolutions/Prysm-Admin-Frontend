import React from "react";
import "./AdminFooter.css";

export default function AdminFooter() {
  return (
    <div className="adminFooter">
      <label> Copyright © {new Date().getFullYear()} </label>
    </div>
  );
}
