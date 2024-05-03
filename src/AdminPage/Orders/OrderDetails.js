import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { getCrudApi } from "../../webServices/webServices";
import LoadingScreen from "../../Loading/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderDetails.css";
import OrderItemsList from "./OrderItemsList";
import OrderSumary from "./OrderSummary";

export default function OrderDetails() {
  const [order, setOrder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [tabvalue, setTabValue] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (location?.state) {
        await getOrderDetails();
      }
    })();
    setIsLoading(false);
  }, []);

  const getOrderDetails = async () => {
    if (location?.state) {
      await getCrudApi(`api/v1/orders/${location?.state}`, {})?.then((data) => {
        console.log(data);
        setOrder(data);
      });
    }
  };
  const handleTabs = (val) => {
    setTabValue(val);
  };
  const capitalize = (str) => {
    const words = str.split(" ");

    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(" ");
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="Tab-nav-product">
            {order ? (
              <>
                <div
                  className={
                    tabvalue === 0 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(0)}
                >
                  Order Items
                </div>
                <div
                  className={
                    tabvalue === 1 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(1)}
                >
                  Shipping Details
                </div>
                <div
                  className={
                    tabvalue === 2 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(2)}
                >
                  Payment Details
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="mx-2">
            <div className="">
              <div className="row">
                <div className="col-9">
                  <h4 className="d-flex justify-content-between align-items-center">
                    Order Details
                  </h4>
                  {order && <OrderItemsList order={order} />}
                  <div className="row">
                    <div className="col-6">
                      <h5>Shipping Info</h5>
                      <div>
                        <strong>
                          {order?.shipping_address?.first_name}{" "}
                          {order?.shipping_address?.last_name}
                        </strong>
                      </div>
                      <div>{order?.shipping_address?.email}</div>
                      <div>{order?.shipping_address?.phone_number}</div>
                      <div>{order?.shipping_address?.street_address_1}</div>
                      <div>{order?.shipping_address?.street_address_2}</div>
                      <div>{order?.shipping_address?.city}</div>
                      <div>{order?.shipping_address?.state}</div>
                      <div>{order?.shipping_address?.postal_code}</div>
                    </div>
                    <div className="col-6">
                      <h5>Billing Info</h5>
                      <div>
                        <strong>
                          {order?.billing_address?.first_name}{" "}
                          {order?.billing_address?.last_name}
                        </strong>
                      </div>
                      <div>{order?.billing_address?.email}</div>
                      <div>{order?.billing_address?.phone_number}</div>
                      <div>{order?.billing_address?.street_address_1}</div>
                      <div>{order?.billing_address?.street_address_2}</div>
                      <div>{order?.billing_address?.city}</div>
                      <div>{order?.billing_address?.state}</div>
                      <div>{order?.billing_address?.postal_code}</div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <h4 className="d-flex justify-content-between align-items-center">
                    <span>Order Summary</span>
                  </h4>
                  {order && <OrderSumary order={order} />}

                  <h4 className="d-flex justify-content-between align-items-center">
                    <span>Payment Information</span>
                  </h4>
                  <div>
                    {order?.payment_info?.method && (
                      <div>
                        Payment Method: {capitalize(order.payment_info.method)}
                      </div>
                    )}
                    {order?.payment_info?.card && (
                      <div>
                        {capitalize(order.payment_info.card.network)} card
                        ending in {order.payment_info.card.last4}
                      </div>
                    )}
                    {order?.payment_info?.vpa && (
                      <div>VPA: {order.payment_info.vpa}</div>
                    )}
                    {order?.payment_info?.wallet && (
                      <div>Wallet: {capitalize(order.payment_info.wallet)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
