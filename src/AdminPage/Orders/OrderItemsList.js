import React, { useState } from "react";
import OrderItemCustomizations from "./OrderItemCustomizations";
import axios from "axios";
const OrderItemsList = ({ order }) => {
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const parsePriceToString = (price) => {
    const formattedAmount = price?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return formattedAmount;
  };
  const onOpenModal = () => {
    setOpenModal(true);
  };
  const onCloseClick = () => {
    setOpenModal(false);
  };

  const handleViewSpecs = async (orderItemId) => {
    try {
      const response = await axios.get(`/api/products/${orderItemId}/specs`);
      setSelectedOrderItem(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching product specs:", error);
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h4 className="mb-0">Order #{order.order_number}</h4>
              <p className="mb-0">
                Status: <strong>{order.fulfillment_status}</strong>
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">Total Amount</p>
              <strong>
                <p> {parsePriceToString(order.total_amount)}</p>
              </strong>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  <th>Specifications</th>
                </tr>
              </thead>
              <tbody>
                {order?.order_items?.map((item, itemIndex) => (
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
                        href={`/products/${item.product.product_category_id}/${item.product.product_id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        {item.product.name}
                      </a>
                    </td>
                    <td>{item.fulfillment_status}</td>
                    <td>{item.quantity}</td>
                    <td>{parsePriceToString(item.price)}</td>
                    <td>{parsePriceToString(item.quantity * item.price)}</td>
                    <td>
                      {" "}
                      <button
                        className="btn btn-sm"
                        onClick={handleViewSpecs}
                        disabled={
                          order?.order_items?.order_item_customization_options
                            ?.length === 0
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {openModal ? (
        <div className="productModalorder">
          <div className="modalContainerorder">
            <OrderItemCustomizations order_item={order.order_item} />
            <div className="footerModalorder">
              <button
                type="button"
                className="closeBtnorder"
                onClick={onCloseClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrderItemsList;
