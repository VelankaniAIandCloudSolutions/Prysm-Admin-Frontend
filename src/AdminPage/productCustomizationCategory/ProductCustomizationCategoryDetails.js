import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import Error from "../../Error/Error";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./ProductCustomizationCategory.css";
import { selectOptionsMap } from "../../Helpers/Helpers";
import { ImCross } from "react-icons/im";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function ProductCustomizationCategoryDetails() {
  const [productName, setProductName] = useState("");
  const [isMultiSelect, setIsMultiSelect] = useState(0);
  const [status, setStatus] = useState(1);
  const [NewOrUpdate, setNewOrUpdate] = useState("New");
  const [parentCustomizationCategoryID, setParentCategory] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [maxQty, setMaxQty] = useState(0);
  const [minQty, setMinQty] = useState(0);
  const [maxQtyError, setMaxQtyError] = useState(false);
  const [minQtyError, setMinQtyError] = useState(false);
  const [addCustomCard, setAddCustomCard] = useState([
    {
      hasQuantity: 2,
      isActive: 2,
      name: null,
      price: null,
      stock: null,
    },
  ]);
  const [oldOptionsCard, setOldOptionsCard] = useState([]);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      let custCatId = sessionStorage.getItem("custCatId");
      if (custCatId) {
        custCatId = parseInt(custCatId);
        setCategoryID(custCatId);
        await getbyIdProductCustCat(custCatId);
      } else {
        await getproductCustCat();
      }
    })();
    setIsLoading(false);
  }, []);

  const getbyIdProductCustCat = async (id) => {
    await getCrudApi(`api/v1/product_cust_cat/${id}`, {})?.then(
      async (item) => {
        const custData = await getproductCustCat();
        populateData(item[0], custData);
        if (item[0] && item[0]?.parentCustomizationCategoryID) {
          setShowOptions(true);
          let custOpt = [...Object.assign([], item[0]?.options)];
          if (custOpt?.length === 1) {
            let opt = { ...custOpt[0] };
            opt.stock = opt.stock === null ? 0 : opt.stock;
            opt.isActive = opt.isActive === null ? 2 : opt.isActive;
            opt.hasQuantity = opt.hasQuantity === null ? 2 : opt.hasQuantity;
            custOpt = [{ ...opt }];
          }
          setAddCustomCard([...custOpt]);
          setOldOptionsCard([...custOpt]);
        }
        setNewOrUpdate("Update");
      }
    );
  };
  let populateData = (dataP, custData) => {
    if (custData) {
      setParentCategory(
        selectOptionsMap(
          custData.filter(
            (item) =>
              item.customizationCategoryID ===
              dataP.parentCustomizationCategoryID
          ),
          "customizationCategoryID",
          "name"
        )[0]
      );
    }
    setProductName(dataP.name);
    setIsMultiSelect(dataP.isMultiselect);
    setStatus(dataP.isActive);
    setMaxQty(dataP.maxQuantity);
    setMinQty(dataP.minQuantity);
  };

  const getproductCustCat = async () => {
    let custData = [];
    await getCrudApi("api/v1/product_cust_cat", {}).then((data) => {
      if (data) {
        custData = data;
        setData(data);
      }
    });
    return custData;
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };
    let isValid = true;
    validateName(productName);
    return isValid;
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontSize: "14px",
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

  const onEditSave = async () => {
    setIsLoading(true);
    setNameError(false);
    if (validateInput()) {
      const editedProduct = {
        name: productName,
        isMultiselect: isMultiSelect === 1 ? 1 : 0,
        isActive: status ? 1 : 0,
        parentCustomizationCategoryID: parentCustomizationCategoryID?.value,
        minQty: !minQtyError ? parseInt(minQty, 10) : 0,
        maxQty: !maxQtyError ? parseInt(maxQty, 10) : 0,
      };

      postCrudApi("api/v1/product_cust_cat", editedProduct)
        .then((data) => {
          if (data) {
            notifyProductCustomizationCategory("add");
            if (data?.categoryID !== null && parentCustomizationCategoryID) {
              sessionStorage.setItem("custCatId", data?.categoryID);
              setCategoryID(data?.categoryID);
              setShowOptions(true);
              setNewOrUpdate("Update");
            }
          } else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
    }
    setIsLoading(false);
  };

  const handleOptionsupdated = (oldData, newData) => {
    const updatetedObjects = [];
    for (let i = 0; i < newData?.length; i++) {
      const obj1 = oldData[i];
      const obj2 = newData[i];
      if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
        updatetedObjects.push(obj2);
      }
    }

    return [updatetedObjects];
  };

  const onUpdate = async () => {
    setIsLoading(true);
    setNameError(false);

    if (validateInput()) {
      const editedProduct = {
        name: productName,
        isMultiselect: isMultiSelect,
        isActive: status ? 1 : 0,
        parentCustomizationCategoryID: parentCustomizationCategoryID?.value,
        minQty: !minQtyError ? parseInt(minQty, 10) : 0,
        maxQty: !maxQtyError ? parseInt(maxQty, 10) : 0,
      };

      await putCrudApi("api/v1/product_cust_cat/" + categoryID, editedProduct)
        .then((data) => {
          if (data) {
            getbyIdProductCustCat(categoryID);
            notifyProductCustomizationCategory("update");
          } else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
    }
    setIsLoading(false);
  };

  const onUpdateCard = async () => {
    setIsLoading(true);
    let valid = true;
    addCustomCard.map((each) => {
      if (!each?.name || each?.name?.trim() === "" || !each?.price)
        valid = false;
    });
    if (valid) {
      let [updatetedObjects] = handleOptionsupdated(
        oldOptionsCard,
        addCustomCard
      );
      let dataToUpdate = [];
      let dataToAdd = [];
      if (updatetedObjects) {
        updatetedObjects.map((data) => {
          if (data?.customizationOptionID) {
            dataToUpdate.push(data);
          } else if (!data?.customizationOptionID) {
            dataToAdd.push(data);
          }
        });
      }
      let success = true;
      if (dataToUpdate.length > 0) {
        await putCrudApi("api/v1/product_cust_opt/update", dataToUpdate)
          .then((res) => {
            if (res) {
              success = true;
            } else {
              success = false;
            }
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
      if (dataToAdd.length > 0) {
        let customOptions = {
          customizationCategoryID: categoryID,
          options: dataToAdd,
        };
        await postCrudApi("api/v1/product_cust_opt", customOptions)
          .then((data) => {
            if (data) {
              success = true;
            } else {
              success = false;
            }
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
      getbyIdProductCustCat(categoryID);
      if (success) {
        notifyProductCustomizationCategory("update");
        navigate("/Admin/productCustomizationCategory");
      } else {
        toast.error("Unsuccessful");
      }
    } else {
      toast.error("Please fill all the required fields");
    }
    setIsLoading(false);
  };

  const onAddCard = (e) => {
    e.preventDefault();
    const logicAJ = JSON.parse(JSON.stringify(addCustomCard));
    let logicA = {
      name: null,
      isActive: 2,
      price: null,
      stock: null,
      hasQuantity: 2,
    };
    logicAJ.push(logicA);
    setAddCustomCard(logicAJ);
  };

  const removeCard = (e, index) => {
    const removeCardList = JSON.parse(JSON.stringify(addCustomCard));
    removeCardList.splice(index, 1);
    setAddCustomCard(removeCardList);
  };

  const updateOption = (index, e, value) => {
    let oldOptions = JSON.parse(JSON.stringify(addCustomCard));
    oldOptions[index][e.target.name] = value;
    setAddCustomCard(oldOptions);
  };

  const OnSubmitCard = async () => {
    setIsLoading(true);
    let valid = true;
    addCustomCard.map((each) => {
      if (each?.name?.trim() === "" || !each?.price) valid = false;
    });
    if (valid) {
      let customOptions = {
        customizationCategoryID: categoryID,
        options: addCustomCard,
      };
      await postCrudApi("api/v1/product_cust_opt", customOptions)
        .then((data) => {
          if (data) {
            notifyProductCustomizationCategory("add");
          } else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
      navigate("/Admin/productCustomizationCategory");
    } else {
      toast.error("Please fill all the required fields");
    }
    setIsLoading(false);
  };

  const handleParentCategoryChange = (e, { action }) => {
    if (action === "clear") {
      setParentCategory(null);
      setShowOptions(false);
      setMaxQty(0);
      setMinQty(0);
      setMaxQtyError(false);
      setMinQtyError(false);
    } else {
      setParentCategory(e);
    }
  };

  const notifyProductCustomizationCategory = (action) => {
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

  const HandleNameChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setProductName(value);
  };
  const HandleMaxQtyChange = (e) => {
    const value = e.target.value;

    setMaxQty(value);
  };
  const HandleMinQtyChange = (e) => {
    const value = e.target.value;

    setMinQty(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="customizationCategoryContainer">
          <div className="customizationCategoryInputs">
            <div className="headercategogrytitle">
              <h2>Customization Category</h2>
            </div>
            <div className="ProductCat-Inputfields">
              <label className="ProductCat-label-class">
                Category Name <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={HandleNameChange}
                placeholder="Category Name"
                className="ProductCat-textbox-input"
                value={productName}
              />
              {nameError && <Error message={"Required*"} />}
            </div>
            <div className="ProductCat-checkBoxes">
              <div className="div-ProductCat-checkbox ">
                <label className="ProductCat-label-class">Status</label>
                <input
                  type="checkbox"
                  onChange={() => setStatus(status === 1 ? 2 : 1)}
                  checked={status === 1}
                  className="ProductCat-modalCheckbox"
                />
              </div>
            </div>
            <div className="ProductCat-Inputfields">
              <label className="ProductCat-label-class">
                Parent Customization Category
              </label>
              <Select
                onChange={handleParentCategoryChange}
                value={parentCustomizationCategoryID}
                placeholder="Select"
                styles={SelectStyle}
                maxMenuHeight={150}
                isClearable
                options={data
                  ?.filter((e) => e.isActive === 1)
                  ?.map((e) => ({
                    label: e.name,
                    value: e.customizationCategoryID,
                  }))}
                className="ProductCat-dropdown-input"
              />
            </div>
            {parentCustomizationCategoryID && (
              <>
                <div className="ProductCat-checkBoxes">
                  <div className="div-ProductCat-checkbox ">
                    <label className="ProductCat-label-class">
                      MultiSelect
                    </label>
                    <input
                      type="checkbox"
                      onChange={() =>
                        setIsMultiSelect(isMultiSelect === 1 ? 0 : 1)
                      }
                      checked={isMultiSelect === 1}
                      className="ProductCat-modalCheckbox"
                    />
                  </div>
                </div>
                <div className="ProductCat-Inputfields">
                  <label className="ProductCat-label-class">Max Quantity</label>
                  <input
                    type="number"
                    onChange={HandleMaxQtyChange}
                    placeholder="Max Quantity"
                    className="ProductCat-textbox-input"
                    value={maxQty}
                  />
                </div>
                <div className="ProductCat-Inputfields">
                  <label className="ProductCat-label-class">Min Quantity</label>
                  <input
                    type="number"
                    onChange={HandleMinQtyChange}
                    placeholder="Min Quantity"
                    className="ProductCat-textbox-input"
                    value={minQty}
                  />
                </div>
              </>
            )}
            <div className="buttonplaceholder">
              {NewOrUpdate === "New" ? (
                <button
                  type="button"
                  className="ProductCat-Modal-btn"
                  onClick={onEditSave}
                >
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  className="ProductCat-Modal-btn"
                  onClick={onUpdate}
                >
                  Update
                </button>
              )}
            </div>
          </div>

          {showOptions ? (
            <>
              <div className="optionsInputs">
                <div className="formheadertitle">
                  <div className="titleoption">
                    <h2 className="cardsHeading">Customization Options</h2>
                  </div>
                  <div className="cardAddButton">
                    <button
                      className="ProductCat-Modal-btn"
                      onClick={onAddCard}
                    >
                      Add card
                    </button>
                  </div>
                </div>

                <div className="Custoptioncards">
                  {addCustomCard.map((obj, index) => {
                    return (
                      <div className="CustomizationOptions_container">
                        <div className="CustomizationOptions">
                          <div className="ProductCat-Inputfields">
                            <div className="cardCloseButtonDiv">
                              <label className="ProductCat-label-class">
                                Name{" "}
                                <i class="fa fa-asterisk aster-risk-Icon" />
                              </label>
                              {obj.customizationOptionID ? (
                                <></>
                              ) : (
                                <button
                                  type="button"
                                  className="cardCloseButton"
                                  onClick={(e) => removeCard(e, index)}
                                >
                                  <ImCross />
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              onChange={(e) =>
                                updateOption(index, e, e.target.value)
                              }
                              name="name"
                              placeholder="Name"
                              className="ProductCat-textbox-input"
                              value={obj.name}
                            />
                            {(!obj?.name || obj?.name?.trim() === "") && (
                              <Error message={"Required*"} />
                            )}
                          </div>

                          <div className="ProductCat-Inputfields">
                            <label className="ProductCat-label-class">
                              Price <i class="fa fa-asterisk aster-risk-Icon" />
                            </label>
                            <input
                              type="text"
                              name="price"
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  e,
                                  parseFloat(e.target.value)
                                )
                              }
                              placeholder="Price"
                              className="ProductCat-textbox-input"
                              value={obj.price || ""}
                            />
                            {!obj?.price && <Error message={"Required*"} />}
                          </div>

                          <div className="ProductCat-Inputfields">
                            <label className="ProductCat-label-class">
                              Stock <i class="fa fa-asterisk aster-risk-Icon" />
                            </label>
                            <input
                              type="text"
                              name="stock"
                              onChange={(e) =>
                                updateOption(index, e, parseInt(e.target.value))
                              }
                              placeholder="Stock"
                              className="ProductCat-textbox-input"
                              value={obj.stock || 0}
                            />
                          </div>

                          <div className="ProductCat-checkBoxes">
                            <div className="div-ProductCat-checkbox ">
                              <label className="checkBox_label-class">
                                Status
                              </label>
                              <input
                                name="isActive"
                                type="checkbox"
                                onChange={(e) =>
                                  updateOption(
                                    index,
                                    e,
                                    obj.isActive === 1 ? 2 : 1
                                  )
                                }
                                checked={obj.isActive === 1}
                                className="ProductCat-modalCheckbox"
                              />
                            </div>

                            <div className="div-ProductCat-checkbox ">
                              <label className="checkBox_label-class">
                                Has Quantity
                              </label>
                              <input
                                name="hasQuantity"
                                type="checkbox"
                                onChange={(e) =>
                                  updateOption(
                                    index,
                                    e,
                                    obj.hasQuantity === 1 ? 2 : 1
                                  )
                                }
                                checked={obj.hasQuantity === 1}
                                className="ProductCat-modalCheckbox"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="submitButtonDiv">
                  {NewOrUpdate === "New" ? (
                    <button
                      type="button"
                      className="ProductCat-Modal-btn"
                      onClick={OnSubmitCard}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ProductCat-Modal-btn"
                      onClick={onUpdateCard}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
