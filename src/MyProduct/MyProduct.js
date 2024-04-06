import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { getCrudApi } from "../webServices/webServices";
import { getDecodedToken } from "../Helpers/validateToken";
import "./MyProduct.css";

export default function MyProduct() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let decodedToken =
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
        ? getDecodedToken(sessionStorage.getItem("user"))
        : null;
    const userIdFromStorage = parseInt(decodedToken?.userId);
    getCrudApi(`api/v1/user_account/user_order/${userIdFromStorage}`, {}).then(
      (e) => {
        if (e) {
          const orderItems = e.flatMap((order) => order.orderItem);
          setOrders(orderItems);
        }
      }
    );
  }, []);

  const columns = [
    {
      name: "productID",
      label: "PRODUCT ID",
    },
    {
      name: "productImagePath",
      label: "IMAGE",
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="Product" className="myProductImage" />
        ),
      },
    },
    {
      name: "productName",
      label: "PRODUCT NAME",
    },
    {
      name: "productDescription",
      label: "PRODUCT DESCRIPTION",
    },
  ];

  const options = {
    filter: false,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    pagination: true,
    selectableRows: "none",
    rowsPerPage: 10,
  };

  const styles = {
    root: {
      border: "none",
    },
  };

  return (
    <div className="myProductContainer">
      <div>
        <MUIDataTable
          data={orders}
          title="My Products"
          columns={columns}
          options={options}
          styles={styles}
        />
      </div>
    </div>
  );
}
