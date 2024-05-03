import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import "./Orders.css";
import { getCrudApi } from "../../webServices/webServices";
import LoadingScreen from "../../Loading/Loading";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const generateColumns = () => {
    let columnsArray = [];
    columnsArray.push({
      name: "orderId",
      label: "id",
      options: {
        display: false,
        filter: false,
      },
    });

    columnsArray.push({
      name: "order_number",
      label: "Order Number",
    });

    columnsArray.push({
      name: "user_full_name",
      label: "Customer Name",
    });
    columnsArray.push({
      name: "user_email",
      label: "Customer Email",
    });
    columnsArray.push({
      name: "fulfillment_status",
      label: "Status",
      options: {
        filterType: "dropdown",
      },
    });
    columnsArray.push({
      name: "total_amount",
      label: "Total Amount",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const formattedAmount = value.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          });
          return formattedAmount;
        },
      },
    });
    columnsArray.push({
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const formattedDate = new Date(value).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          return formattedDate;
        },
        customSort: (data, dataIndex, sortOrder) => {
          const date1 = new Date(data[dataIndex[0]][dataIndex.column]);
          const date2 = new Date(data[dataIndex[1]][dataIndex.column]);

          if (sortOrder === "asc") {
            return date1 - date2;
          } else {
            return date2 - date1;
          }
        },
      },
    });
    columnsArray.push({
      name: "action",
      label: "Details",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => (
          <button
            className="action-cell"
            onClick={() =>
              onViewClick(tableMeta.currentTableData[tableMeta.rowIndex]?.index)
            }
          >
            <i className="fa fa-eye"></i>
          </button>
        ),
      },
    });

    return columnsArray;
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getOrders();
    })();
    setIsLoading(false);
  }, []);

  const getOrders = async () => {
    getCrudApi("api/v1/orders", {}).then((data) => {
      if (data) {
        console.log(data);
        setOrders(data);
      }
    });
  };

  const options = {
    filterType: "textField",
    download: false,
    print: false,
    viewColumns: false,
    filter: true,
    selectableRows: "none",
    textLabels: {
      filter: {
        title: "Filter Orders",
      },
    },
  };

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.fulfillment_status === status);
  };

  const confirmedOrdersCount = filterOrdersByStatus("Confirmed").length;
  const deliveredOrdersCount = filterOrdersByStatus("Delivered").length;
  const shippedOrdersCount = filterOrdersByStatus("Shipped").length;
  const processingOrdersCount = filterOrdersByStatus("Processing").length;

  const onViewClick = (rowIndex) => {
    navigate("/Orders/OrderDetails/", {
      state: orders[rowIndex].order_id,
    });
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ticketContainer">
          <div className="Ticket_Div">
            <div className="filter_buttons_div">
              <div className="buttons_container">
                <div className="All_NoFilter_Button">
                  <p>Confirmed</p>
                  <div className="All_Button_count_div">
                    {confirmedOrdersCount}
                  </div>
                </div>
                <div className={`customDiv1`}>
                  <p>Delivered</p>
                  <div className="In-process_count_div">
                    {deliveredOrdersCount}
                  </div>
                </div>
                <div className={`customDiv2`}>
                  <p>Shipped</p>
                  <div className="open_count_div">{shippedOrdersCount}</div>
                </div>
                <div className={`customDiv3`}>
                  <p>Processing</p>
                  <div className="Closed_count_div">
                    {processingOrdersCount}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-list-container">
              <div className="table-scroll">
                <MUIDataTable
                  className="muitable"
                  title={"Orders"}
                  data={orders}
                  columns={generateColumns()}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
