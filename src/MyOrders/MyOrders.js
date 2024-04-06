import React, { useState, useEffect } from "react";
import "./MyOrders.css";
import { getPrysmApi } from "../webServices/webServices";
import LoadingScreen from "../Loading/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { getDecodedToken } from "../Helpers/validateToken";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export default function MyOrders() {
  const [openedOrder, setOpenedOrder] = useState(null);
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    let decodedToken =
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
        ? getDecodedToken(sessionStorage.getItem("user"))
        : null;

    const userIdFromStorage = parseInt(decodedToken?.userId);

    getPrysmApi(
      `https://prysmdev.xtractautomation.com/api/v1/orders/get-user-orders/${userIdFromStorage}`
    ).then((e) => {
      if (e) {
        setData(e);
      }
      setIsLoading(false);
    });
  }, []);

  const toggleOrder = (index) => {
    setOpenedOrder(openedOrder === index ? null : index);
  };

  const onOpenModal = () => {
    setOpenModal(true);
  };
  const onCloseClick = () => {
    setOpenModal(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="MyOrderTableContainer">
          <h2 className="myOrdersHeading">My Orders</h2>
          {data?.length === 0 ? (
            <div className="noOrdersDiv">
              <h2 className="NoOrderHeading">No Orders Yet</h2>
            </div>
          ) : (
            <div className="collapsableTableContainer">
              <TableContainer component={Paper}>
                <Table className="myOrdersTable" style={{ width: "94%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <h2>Order Number</h2>
                      </TableCell>
                      <TableCell>
                        <h2>Total Amount</h2>
                      </TableCell>
                      <TableCell>
                        <h2>Status</h2>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((order, index) => (
                      <React.Fragment key={order.order_item_id}>
                        <TableRow
                          onClick={() => toggleOrder(index)}
                          style={{ background: "#f9cbb5" }}
                        >
                          <TableCell>
                            <b>{order.order_number}</b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {Intl.NumberFormat("en-US").format(
                                order.total_amount
                              )}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>{order.fulfillment_status}</b>
                          </TableCell>

                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleOrder(index)}
                            >
                              {openedOrder === index ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Collapse
                              in={openedOrder === index}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={1}>
                                <Typography>
                                  <h3>Products</h3>
                                </Typography>
                                <Table>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        <b>Product Image</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Product Name</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Product Price</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Quantity</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Status</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>View Details</b>
                                      </TableCell>
                                    </TableRow>
                                    {order?.order_items?.map((productItems) => (
                                      <>
                                        <TableRow
                                          key={productItems.product.product_id}
                                        >
                                          <TableCell>
                                            <img
                                              className="orderImage"
                                              src={
                                                productItems.product
                                                  .product_image_path
                                              }
                                              alt="product Image"
                                            ></img>
                                          </TableCell>
                                          <TableCell>
                                            {productItems.product.name}
                                          </TableCell>
                                          <TableCell>
                                            {productItems.product.price_with_tax.toLocaleString()}
                                          </TableCell>
                                          <TableCell>
                                            {productItems.quantity}
                                          </TableCell>
                                          <TableCell>
                                            {productItems.fulfillment_status}
                                          </TableCell>

                                          <TableCell>
                                            <button
                                              className="my-orders-view"
                                              onClick={onOpenModal}
                                              disabled={
                                                productItems
                                                  ?.order_item_customization_options
                                                  ?.length === 0
                                              }
                                            >
                                              View Details
                                            </button>
                                          </TableCell>
                                          {openModal ? (
                                            <div className="productModalorder">
                                              <div className="modalContainerorder">
                                                <Box margin={1}>
                                                  <Typography>
                                                    <h3>
                                                      Product Customizations
                                                    </h3>
                                                  </Typography>
                                                  <Table>
                                                    <TableBody>
                                                      <TableCell>
                                                        Parent Customization
                                                        Category
                                                      </TableCell>
                                                      <TableCell>
                                                        Customization Category
                                                      </TableCell>
                                                      <TableCell>
                                                        Customization Options
                                                      </TableCell>

                                                      {productItems?.order_item_customization_options?.map(
                                                        (
                                                          prdcustOpts,
                                                          index
                                                        ) => {
                                                          return (
                                                            <>
                                                              <TableRow>
                                                                <TableCell>
                                                                  {
                                                                    prdcustOpts
                                                                      .customization_option
                                                                      ?.customization_category
                                                                      ?.parent_customization_category
                                                                      ?.name
                                                                  }
                                                                </TableCell>
                                                                <TableCell>
                                                                  {
                                                                    prdcustOpts
                                                                      .customization_option
                                                                      ?.customization_category
                                                                      ?.name
                                                                  }
                                                                </TableCell>
                                                                <TableCell>
                                                                  {
                                                                    prdcustOpts
                                                                      ?.customization_option
                                                                      ?.name
                                                                  }
                                                                </TableCell>
                                                              </TableRow>
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    </TableBody>
                                                  </Table>
                                                </Box>
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
                                        </TableRow>
                                      </>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      )}
    </>
  );
}
