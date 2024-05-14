import React from "react";

const parsePriceToString = (price) => {
  const formattedAmount = price?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formattedAmount;
};

const CustomizationOptions = ({ options }) => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th>Specification</th>
        <th>Unit Price</th>
        <th>Quantity</th>
        <th>Net Price</th>
      </tr>
    </thead>
    <tbody>
      {options.map((option) => (
        <tr key={option.order_item_customization_option_id}>
          <td>{option.customization_option?.name}</td>
          <td>{parsePriceToString(option.customization_option?.price)}</td>
          <td>{option.quantity}</td>
          <td>{parsePriceToString(option.net_customization_price)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const OrderItemCustomizations = ({ orderItem }) => {
  return (
    <div className="container">
      {orderItem.order_item_customization_options.map((category) => (
        <div key={category.name} className="my-4">
          <h5 className="mb-3">{category.name}</h5>
          <CustomizationOptions
            options={category.order_item_customization_options}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderItemCustomizations;
