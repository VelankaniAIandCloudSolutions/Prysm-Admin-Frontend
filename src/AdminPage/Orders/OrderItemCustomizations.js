import React from "react";

const OrderItemCustomizations = ({ orderItem }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Option</th>
          <th scope="col">Selection</th>
          <th scope="col">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {orderItem.order_item_customization_options.map(
          (selectedCustom, index) => (
            <tr key={index}>
              <td>
                <span>
                  {selectedCustom.customization_option &&
                  selectedCustom.customization_option.customization_category &&
                  selectedCustom.customization_option.customization_category
                    .parent_customization_category &&
                  selectedCustom.customization_option.customization_category
                    .parent_customization_category.name !== "Components" ? (
                    <strong>
                      {
                        selectedCustom.customization_option
                          .customization_category.parent_customization_category
                          .name
                      }
                    </strong>
                  ) : null}
                  {selectedCustom.customization_option &&
                  selectedCustom.customization_option.customization_category ? (
                    <span>
                      {selectedCustom.customization_option
                        .customization_category.parent_customization_category &&
                      selectedCustom.customization_option.customization_category
                        .parent_customization_category.name !== "Components" ? (
                        <span>
                          {
                            selectedCustom.customization_option
                              .customization_category.name
                          }
                        </span>
                      ) : (
                        <span>{selectedCustom.customization_option.name}</span>
                      )}
                    </span>
                  ) : null}
                  {!selectedCustom.customization_option && (
                    <div>{selectedCustom.customization_option.name}</div>
                  )}
                </span>
              </td>
              <td>
                {selectedCustom.customization_option && (
                  <span>
                    {selectedCustom.customization_option
                      .customization_category &&
                    selectedCustom.customization_option.customization_category
                      .parent_customization_category &&
                    selectedCustom.customization_option.customization_category
                      .parent_customization_category.name !== "Components" ? (
                      <strong>
                        {
                          selectedCustom.customization_option
                            .customization_category.name
                        }
                      </strong>
                    ) : null}
                    <span>{selectedCustom.customization_option.name}</span>
                  </span>
                )}
                {!selectedCustom.customization_option && (
                  <div>{selectedCustom.customization_option.name}</div>
                )}
              </td>
              <td>{selectedCustom.quantity}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default OrderItemCustomizations;
