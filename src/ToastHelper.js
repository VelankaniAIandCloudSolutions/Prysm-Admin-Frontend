
import React from "react";

import {ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

 

const ToastHelper = () => {

  return (

    <div>

      <ToastContainer

        position='top-center'

        autoClose={3000}

        hideProgressBar={false}

        containerId={1}

        rtl={false}

        theme="colored"

      />

    </div>

  )

}

export default ToastHelper
