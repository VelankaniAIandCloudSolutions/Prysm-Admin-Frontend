import React, { useState, useEffect } from "react";
import Error from "../../Error/Error";
import { useNavigate } from "react-router-dom";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { useLocation } from "react-router-dom/dist";
import "./DiscountPage.css";
import Select from "react-select";
import { selectOptionsMap, idsToArray } from "../../Helpers/Helpers";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

export default function DiscountInputField() {
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState();
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [maxNumberOfApplicableProducts, setMaxNumberOfApplicableProducts] =
    useState();
  const [discountAmount, setDiscountAmount] = useState();
  const [maxUsagePerUser, setMaxUsagePerUser] = useState();
  const [minAmountForDiscount, setMinAmountForDiscount] = useState();
  const [maxDiscountAmount, setMaxDiscountAmount] = useState();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(1);
  const [data, setData] = useState([]);
  const [productName, setProductName] = useState([]);
  const [oldproductName, setOldProductName] = useState([]);
  const [discountID, setDiscountID] = useState(null);
  const [NewOrUpdate, setNewOrUpdate] = useState("new");

  //validation
  const [discountError, setDiscountError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [discountAmountError, setDiscountAmountError] = useState(false);
  const [maxUsageError, setMaxUsageError] = useState(false);
  const [minAmtError,setMinAmtError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllDiscount();
      await getAllProductTags();
      setIsLoading(false);
    })();
  }, []);

  const getAllProductTags = async () => {
    await getCrudApi("api/v1/product/", {}).then((e) => {
      setData(e);
    });
  };

  const getAllDiscount = async () => {
    if (location?.state?.id) {
      setDiscountID(location?.state?.id);
      let products = [];
      await getCrudApi(`api/v1/product/`, {}).then((data) => {
        if (data) {
          setData(data);
          products = data;
        }
      });
      await getCrudApi(`api/v1/discount_code/${location?.state?.id}`, {}).then(
        (item) => {
          if (item) {
            populateData(item[0], products);
          }
        }
      );
      setNewOrUpdate("update");
    } else {
      setNewOrUpdate("new");
    }
  };

  let populateData = (data, products) => {
    setDiscountCode(data?.discountCode);
    setDiscountPercentage(data?.discountPercentage);
    setExpirationDate(data?.expirationDate ? new Date(data?.expirationDate) : null);
    setMaxNumberOfApplicableProducts(data?.maxNumberOfApplicableProducts);
    setDiscountAmount(data?.discountAmount);
    setMaxUsagePerUser(data?.maxUsagePerUser);
    setMinAmountForDiscount(data?.minAmountForDiscount);
    setMaxDiscountAmount(data?.maxDiscountAmount);
    setNote(data?.note);
    setStatus(data?.isActive);
    let productIdList = getApplicableProductsList(
      data?.applicableProducts,
      products
    );
    setProductName(productIdList);
    setOldProductName(productIdList);
  };

  const getApplicableProductsList = (productList, products) => {
    if (productList.length > 0) {
      let productIdList = [];
      productList.map((e) => {
        productIdList.push(e.productID);
      });
      let applicableProductList = products
        .filter((e) => productIdList.includes(e.productID))
        .map((e) => ({
          label: e.name,
          value: e.productID,
        }));
      return applicableProductList;
    } else return [];
  };
  const getNewDiff = () => {
    let productsArray = idsToArray(productName, "value");
    let oldproductsArray = idsToArray(oldproductName, "value");
    let newProductName = [];
    productsArray.map((pro) => {
      if (!oldproductsArray.includes(pro)) {
        newProductName.push(pro);
      }
    });
    return newProductName;
  };
  const getDeletedDiff = () => {
    let productsArray = idsToArray(productName, "value");
    let oldproductsArray = idsToArray(oldproductName, "value");
    let deletedProductName = [];
    oldproductsArray.map((pro) => {
      if (!productsArray.includes(pro)) {
        deletedProductName.push(pro);
      }
    });
    return deletedProductName;
  };

  const validateInput = () => {
    const validateDiscount = (dist) => {
      if (!dist) {
        isValid = false;
        setDiscountError(true);
      }
    };
    const validatePercentage = (per) => {
      if (!per) {
        isValid = false;
        setPercentageError(true);
      }
    };

    const validatediscountAmount = (per) => {
      if (!per) {
        isValid = false;
        setDiscountAmountError(true);
      }
    };
    const validatemaxUsage = (content) => {
      if (!content) {
        isValid = false;
        setMaxUsageError(true);
      }
    };

    const validateminamt = (content) => {
if(!content || content.toString().trim() === ""){
  isValid = false;
  setMinAmtError(true);
}
    }

    let isValid = true;
    validateDiscount(discountCode);
    validatePercentage(discountPercentage);
    validatediscountAmount(discountAmount);
    validatemaxUsage(maxUsagePerUser);
    validateminamt(minAmountForDiscount);
    return isValid;
  };

  const onDiscountSubmit = async () => {
    setIsLoading(true);
    setDiscountError(false);
    setPercentageError(false);
    setDiscountAmountError(false);
    setMaxUsageError(false);
    setMinAmtError(false);

    if (validateInput()) {
      const editedDiscount = {
        discountCode: discountCode,
        discountPercentage: discountPercentage,
        expirationDate: expirationDate,
        maxNumberOfApplicableProducts: maxNumberOfApplicableProducts,
        discountAmount: discountAmount,
        maxUsagePerUser: maxUsagePerUser,
        minAmountForDiscount: minAmountForDiscount,
        maxDiscountAmount: maxDiscountAmount === "" ? 0 : maxDiscountAmount,
        note: note,
        isActive: status,
      };
      if (discountID !== null) {
        editedDiscount.addProduct = getNewDiff();
        editedDiscount.removeProduct = getDeletedDiff();
        await putCrudApi(`api/v1/discount_code/${discountID}`, editedDiscount)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateCountry("update");
              navigate("/Admin/DiscountPage");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      } else {
        editedDiscount.addProduct = idsToArray(productName, "value");
        editedDiscount.removeProduct = [];
        await postCrudApi("api/v1/discount_code/", editedDiscount)
          .then((data) => {
            if (data) {
              setDiscountID(data.discountCodeID);
              notifyAddOrUpdateCountry("add");
              navigate("/Admin/DiscountPage");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
    }
    setIsLoading(false);
  };
  const notifyAddOrUpdateCountry = (action) => {
    let message;

    if (action === "update") {
      message = "Updated successfully!";
    } else if (action === "add") {
      message = "Added successfully!";
    } else {
      return;
    }
    toast.success(message);
  };
  const notifyError = () => {
    let message = "Discount Code Exsits";
    toast.error(message);
  };
  const onSelectProductName = (selectedOption) => {
    setProductName(selectedOption);
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontWeight: "400",
      "&:hover": {
        border: "1px solid rgb(201, 200, 200)",
        boxShadow: "0 0 3px grey",
        cursor: "pointer",
      },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const HandleDiscountCodeChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setDiscountError(true);
    } else {
      setDiscountError(false);
    }
    setDiscountCode(value);
  };

  const HandlePercetageChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setPercentageError(true);
    } else {
      setPercentageError(false);
    }
    setDiscountPercentage(value);
  };

  const HandleProductChange = (e) => {
    const value = e.target.value;
    setMaxNumberOfApplicableProducts(value);
  };

  const HandleDiscountAmountChange = (e) => {
    const value = e.target.value;
    const isNumeric = (input) => /^[0-9\s%]+$/.test(input);
    if (!value?.trim() || !isNumeric(value)) {
      setDiscountAmountError(true);
    } else {
      setDiscountAmountError(false);
    }
    setDiscountAmount(value);
  };

  const HandleUsageChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setMaxUsageError(true);
    } else {
      setMaxUsageError(false);
    }
    setMaxUsagePerUser(value);
  };

  const HandleAmountDiscountChange = (e) => {
    const value = e.target.value;
    if(value.toString().trim() === ""){
      setMinAmtError(true);
    }
    else {
      setMinAmtError(false);
    }
    setMinAmountForDiscount(value);
  };

  const HandlemaxAmountDiscountChange = (e) => {
    const value = e.target.value;
    setMaxDiscountAmount(value);
  };

  const HandleNoteChange = (e) => {
    const value = e.target.value;
    setNote(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="howToPageContainer">
            <div className="DiscountPageContainer">
              <div className="DiscountRightInputField">
                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Discount Code <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="text"
                    onChange={HandleDiscountCodeChange}
                    placeholder="Discount Code"
                    className="textbox-input_3 textInputDiscountPage"
                    value={discountCode}
                  />
                  {discountError && <Error message={"Required*"} />}
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Discount Percentage{" "}
                    <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="text"
                    onChange={HandlePercetageChange}
                    placeholder="Discount Percentage"
                    className="textbox-input_3 textInputDiscountPage"
                    value={discountPercentage}
                  />
                  {percentageError && <Error message={"Required*"} />}
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">Expiry Date</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setExpirationDate(new Date(e.target.value))
                    }
                    placeholder="Expiry Date"
                    className="textbox-input_3 textInputDiscountPage"
                    value={expirationDate ? expirationDate.toLocaleDateString("en-CA"): expirationDate}
                  />
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Maximum Number Of Applicable Product{" "}
                  </label>
                  <input
                    type="text"
                    onChange={HandleProductChange}
                    placeholder="Maximum Number of Application Product"
                    className="textbox-input_3 textInputDiscountPage"
                    value={maxNumberOfApplicableProducts}
                  />
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">Product Name</label>
                  <Select
                    styles={SelectStyle}
                    options={selectOptionsMap(
                      data?.filter((e) => e.isActive === 1),
                      "productID",
                      "name"
                    )}
                    isMulti
                    value={productName}
                    maxMenuHeight={120}
                    onChange={onSelectProductName}
                  />
                </div>

                <div className="statusStockCheckBoxesDiscountPage">
                  <div className="divDisplayCheckboxDiscountPage">
                    <label className="labelClassDiscountPage">Status</label>
                    <input
                      type="checkbox"
                      onChange={() => setStatus(status === 1 ? 2 : 1)}
                      checked={status === 1}
                      className="modalCheckboxDiscountPage"
                    />
                  </div>
                </div>
              </div>

              <div className="DiscountLeftInputField">
                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Discount Amount <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="number"
                    onChange={HandleDiscountAmountChange}
                    placeholder="Discount Amount"
                    className="textbox-input_3 textInputDiscountPage"
                    value={discountAmount}
                  />
                  {discountAmountError && <Error message={"Required*"} />}
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Maximum usage per user{" "}
                    <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="number"
                    onChange={HandleUsageChange}
                    placeholder="maximum usage per user"
                    className="textbox-input_3 textInputDiscountPage"
                    value={maxUsagePerUser}
                  />
                  {maxUsageError && <Error message={"Required*"} />}
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Minimum Amount Per Discount{" "}
                    <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="number"
                    onChange={HandleAmountDiscountChange}
                    placeholder="Minimum amount per discount"
                    className="textbox-input_3 textInputDiscountPage"
                    value={minAmountForDiscount}
                  />
                  {minAmtError && <Error message={"Required*"} />}
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">
                    Maximum Discount Amount{" "}
                  </label>
                  <input
                    type="number"
                    onChange={HandlemaxAmountDiscountChange}
                    placeholder="Maximum Discount Amount"
                    className="textbox-input_3 textInputDiscountPage"
                    value={maxDiscountAmount}
                  />
                </div>

                <div className="divDisplayDiscountPage">
                  <label className="labelClassDiscountPage">Note</label>
                  <input
                    type="text"
                    onChange={HandleNoteChange}
                    placeholder="Enter Note"
                    className="textbox-input_3 textInputDiscountPage"
                    value={note}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="submitButtondiv">
            {NewOrUpdate === "new" ? (
              <button
                className="HowtoBtnDiscountPage"
                onClick={onDiscountSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                className="HowtoBtnDiscountPage"
                onClick={onDiscountSubmit}
              >
                Update
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
