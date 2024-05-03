import React from "react";

const OrderSumary = ({ order }) => {
  const parsePriceToString = (price) => {
    const formattedAmount = price?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return formattedAmount;
  };
  return (
    <ul className="list-group mb-3">
      {order && order.order_bills && order.order_bills.length !== 0 && (
        <>
          <li className="list-group-item d-flex justify-content-between">
            <span>Sub Total</span>
            {parsePriceToString(order.order_bills[0].sub_total)}
          </li>
          {order.discount_code && (
            <li className="list-group-item d-flex justify-content-between bg-light">
              <div className="text-success">
                <h6 className="my-0">Discount code</h6>
                <small>{order.discount_code.discount_code}</small>
              </div>
              <span className="text-success">
                - {parsePriceToString(order.order_bills[0].discount_amount)}
              </span>
            </li>
          )}
          <li className="list-group-item d-flex justify-content-between">
            <span>Total</span>
            <strong> {parsePriceToString(order.order_bills[0].total)}</strong>
          </li>
        </>
      )}
    </ul>
  );
};

export default OrderSumary;
