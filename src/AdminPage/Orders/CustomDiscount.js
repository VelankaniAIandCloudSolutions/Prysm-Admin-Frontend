import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import OrderItemCustomizations from "./OrderItemCustomizations";
import "./CustomDiscount.css";
import { getCrudApi, postCrudApi } from "../../webServices/webServices";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";

function CustomDiscount() {
  const [customDiscounts, setCustomDiscounts] = useState([]);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderModal, setOrderModal] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [actionStatus, setActionStatus] = useState("");

  const [pendingDiscounts, setPendingDiscounts] = useState([]);
  const [approvedDiscounts, setApprovedDiscounts] = useState([]);
  const [rejectedDiscounts, setRejectedDiscounts] = useState([]);

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    const fetchCustomDiscounts = async () => {
      try {
        const data = await getCrudApi("api/v1/orders/custom-discount", {});
        console.log(data);
        setCustomDiscounts(data);

        const pending = data.filter(
          (order) => order.approval_status === "Pending"
        );
        const approved = data.filter(
          (order) => order.approval_status === "Approved"
        );
        const rejected = data.filter(
          (order) => order.approval_status === "Rejected"
        );

        setPendingDiscounts(pending);
        setApprovedDiscounts(approved);
        setRejectedDiscounts(rejected);

        setPendingCount(pending.length);
        setApprovedCount(approved.length);
        setRejectedCount(rejected.length);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCustomDiscounts();
  }, []);

  useEffect(() => {
    const pending = customDiscounts.filter(
      (order) => order.approval_status === "Pending"
    );
    const approved = customDiscounts.filter(
      (order) => order.approval_status === "Approved"
    );
    const rejected = customDiscounts.filter(
      (order) => order.approval_status === "Rejected"
    );

    setPendingDiscounts(pending);
    setApprovedDiscounts(approved);
    setRejectedDiscounts(rejected);

    setPendingCount(pending.length);
    setApprovedCount(approved.length);
    setRejectedCount(rejected.length);
  }, [customDiscounts]);

  const handleUpdateDiscountStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await postCrudApi(
        "api/v1/orders/updateDiscountStatus",
        { discountId: selectedOrder.id, action: actionStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
    } catch (err) {
      setError(error.message);
    }
  };

  const handleActionClick = (action, order) => {
    setSelectedOrder(order);
    if (action === "Approve") {
      setActionStatus("Approve");
      setModalMessage("Are you sure you want to approve this order?");
      setOpenModal(true);
    } else if (action === "Reject") {
      setActionStatus("Reject");
      setModalMessage("Are you sure you want to reject this order?");
      setOpenModal(true);
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setModalMessage("");
    setSelectedOrder(null);
  };

  const handleApprove = async () => {
    console.log("Order approved:", selectedOrder);
    await handleUpdateDiscountStatus();
    onCloseModal();
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOrderModal(true);
  };

  const handlePendingClick = () => {
    setApprovalStatus("Pending");
  };

  const handleApproveClick = () => {
    setApprovalStatus("Approved");
  };

  const handleRejectClick = () => {
    setApprovalStatus("Rejected");
  };

  const generateColumns = () => {
    let columns = [
      {
        name: "amount",
        label: "Discount Amount",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            const formattedAmount = value.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            });
            return formattedAmount;
          },
        },
      },
      {
        name: "order_info",
        label: "Sales Person",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            const firstName = value[0].user_info.first_name;
            return firstName;
          },
        },
      },
      {
        name: "order",
        label: "Order",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            const order = customDiscounts[tableMeta.rowIndex];
            return (
              <button
                className="btn btn-secondary"
                onClick={() => handleOpenModal(order)}
              >
                View Order
              </button>
            );
          },
        },
      },

      {
        name: "actions",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const order = customDiscounts[tableMeta.rowIndex];
            return (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => handleActionClick("Approve", order)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleActionClick("Reject", order)}
                >
                  Reject
                </button>
              </>
            );
          },
        },
      },
    ];

    if (approvalStatus === "Approved" || approvalStatus === "Rejected") {
      columns = columns.filter((column) => column.name !== "actions");
    }

    return columns;
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

  return (
    <>
      <div className="Ticket_Div">
        <div className="filter_buttons_div">
          <div className="buttons_container">
            <div
              className={`All_NoFilter_Button ${
                approvalStatus === "Pending" ? "active" : ""
              }`}
              onClick={handlePendingClick}
            >
              <p>Pending ({pendingCount})</p>
              <div className="All_Button_count_div"></div>
            </div>
            <div
              className={`customDiv1 ${
                approvalStatus === "Approved" ? "active" : ""
              }`}
              onClick={handleApproveClick}
            >
              <p>Approved ({approvedCount})</p>

              <div className="In-process_count_div"></div>
            </div>
            <div
              className={`customDiv2 ${
                approvalStatus === "Rejected" ? "active" : ""
              }`}
              onClick={handleRejectClick}
            >
              <p>Rejected ({rejectedCount})</p>
              <div className="open_count_div"></div>
            </div>
            <p>({approvalStatus})</p>
          </div>
        </div>

        <div className="order-list-container">
          <div className="table-scroll">
            <MUIDataTable
              className="muitable"
              title={"Discount"}
              data={
                approvalStatus === "Pending"
                  ? pendingDiscounts
                  : approvalStatus === "Approved"
                  ? approvedDiscounts
                  : rejectedDiscounts
              }
              columns={generateColumns()}
              options={options}
            />
          </div>
        </div>
      </div>

      {orderModal && (
        <div className="productModalorder">
          <div className="modalContainerorder">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder?.order_info[0].order_items?.map(
                    (item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>
                          {item.product.product_image_path && (
                            <img
                              className="img-fluid rounded"
                              src={item.product.product_image_path}
                              alt={item.product.name}
                              width="50"
                              height="50"
                            />
                          )}
                          <a
                            href={`/products/${item.product.product_category_id}/${item.product_id}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            {item.product.name}
                          </a>
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {selectedOrder.order_info[0].total_amount.toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td>
                          {(
                            item.quantity *
                            selectedOrder.order_info[0].total_amount
                          ).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <div className="footerModalorder">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOrderModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && ( // Render general approval/rejection modal
        <div className="productModalorder">
          <div className="modalContainerorder">
            <p>{modalMessage}</p>
            <div className="footerModalorder">
              {actionStatus === "Approve" ? (
                <button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={handleApprove}
                >
                  Approve
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger mr-2"
                  onClick={handleApprove}
                >
                  Reject
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomDiscount;
