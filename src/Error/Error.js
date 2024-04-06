import React from "react";
import "./Error.css";

const Error = (props) => {
  return (
      <p className="error-text">{props.message}</p>
  );
};

export default Error;
