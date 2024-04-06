import React, { useEffect, useState } from "react";
import Select from "react-select";
import { selectOptionsMap } from "../../Helpers/Helpers";
import { getCrudApi, postCrudApi } from "../../webServices/webServices";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

export default function ProductCustomizationOption({ productId }) {
  const [productCustomizationCategory, setProductCustomizationCategory] =
    useState([]);
  const [
    selectedProductCustomizationCategory,
    setSelectedProductCustomizationCategory,
  ] = useState([]);
  const [
    tabsProductCustomizationCategory,
    setTabsProductCustomizationCategory,
  ] = useState([]);
  const [
    filteredTabsProductCustomizationCategory,
    setfilteredTabsProductCustomizationCategory,
  ] = useState([]);
  const [
    activeTabIndexProductCustomizationCategory,
    setActiveTabIndexProductCustomizationCategory,
  ] = useState(0);
  const [
    productCustomizationCategoryOptions,
    setProductCustomizationCategoryOptions,
  ] = useState([]);
  const [
    selectedProductCustomizationCategoryOptions,
    setSelectedProductCustomizationCategoryOptions,
  ] = useState([]);
  const [addClicked, setAddClicked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontSize: "14px",
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
  const handleProCusCategory = (e) => {
    setSelectedProductCustomizationCategory(e);
  };
  const handleModalClick = (e, index, tab) => {
    setTabIndex(index);
    setAddClicked(true);
  };

  const handleCloseBtnOfModal = () => {
    setAddClicked(false);
  };

  const handleSubmitBtnOfModal = (index) => {
    setAddClicked(false);
    onAddCardProCustOptCat(index);
  };
  const updateOptionProCustOptCat = (e, value, catIndex, optIndex) => {
    let allCategorys = JSON.parse(
      JSON.stringify(tabsProductCustomizationCategory)
    );
    let selectedOptions = JSON.parse(
      JSON.stringify(allCategorys[catIndex]?.options)
    );
    selectedOptions[optIndex][e.target.name] = value;
    allCategorys[catIndex].options = selectedOptions;
    setTabsProductCustomizationCategory(allCategorys);
  };
  const updateDefault = (e, value, catIndex, optIndex) => {
    let allCategorys = JSON.parse(
      JSON.stringify(tabsProductCustomizationCategory)
    );
    let selectedOptions = JSON.parse(
      JSON.stringify(allCategorys[catIndex]?.options)
    );
    selectedOptions.map((opt, ind) => {
      selectedOptions[ind][e.target.name] = 2;
    });
    selectedOptions[optIndex][e.target.name] = value;
    allCategorys[catIndex].options = selectedOptions;
    setTabsProductCustomizationCategory(allCategorys);
  };
  const onAddCardProCustOptCat = (index) => {
    let custCategorys = [...tabsProductCustomizationCategory];
    let custCat = { ...custCategorys[index] };
    let custCatOption = [...custCat.options];
    if (selectedProductCustomizationCategoryOptions?.label !== null) {
      let newCustCatOption = {
        customizationOptionID:
          selectedProductCustomizationCategoryOptions?.value,
        isDefault: 2,
        customizationOptionName:
          selectedProductCustomizationCategoryOptions?.label,
        defaultQuantity: null,
        minQuantity: null,
        maxQuantity: null,
        isActive: 1,
      };
      custCatOption.push(newCustCatOption);
      custCat.options = custCatOption;
      custCategorys[index] = custCat;
      setTabsProductCustomizationCategory(custCategorys);
      setSelectedProductCustomizationCategoryOptions("");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (productId) {
        await getAllProductCustCatById(productId);
      }
    })();
    setIsLoading(false);
  }, []);

  const onChangeOfOption = (e, index) => {
    setSelectedProductCustomizationCategoryOptions(e);
  };
  const getFilteredCustOptions = (custOptions) => {
    let cusFilter = custOptions?.filter((data) => data?.value !== null);
    const selectedCat = tabsProductCustomizationCategory?.filter(
      (cat) => cat.categoryId === tabIndex
    );
    let optIds = [];
    if (selectedCat.length > 0) {
      const optArr = selectedCat[0]?.options;
      if (optArr.length > 0) {
        optArr.map((o) => {
          optIds.push(o?.customizationOptionID);
        });
      }
    }
    if (optIds.length > 0) {
      cusFilter = cusFilter.filter((a) => !optIds.includes(a.value));
    }
    return cusFilter;
  };

  const removeCardProCustOptCat = (e, index, indexOpt) => {
    let allCategorys = JSON.parse(
      JSON.stringify(tabsProductCustomizationCategory)
    );
    const removeCardList = JSON.parse(
      JSON.stringify(allCategorys[index]?.options)
    );
    removeCardList.splice(indexOpt, 1);
    allCategorys[index].options = removeCardList;
    setTabsProductCustomizationCategory(allCategorys);
  };

  const getAllProductCustCatById = async (id) => {
    let catIds = [];
    await getCrudApi("api/v1/product/custopt_by_prd/" + id, {}).then(
      (dataTabs) => {
        if (dataTabs) {
          setTabsProductCustomizationCategory(dataTabs);
          setfilteredTabsProductCustomizationCategory(dataTabs);
          dataTabs.map((dt) => {
            catIds.push(dt?.categoryId);
          });
        }
      }
    );
    await getCrudApi("api/v1/product_cust_cat", {}).then((data) => {
      if (data) {
        setProductCustomizationCategory(
          selectOptionsMap(
            data !== ""
              ? data.filter(
                  (el) =>
                    el.isActive === 1 &&
                    !catIds.includes(el.customizationCategoryID)
                )
              : data,
            "customizationCategoryID",
            "name"
          )
        );
      }
    });
  };

  function getDifference(array1, array2, array1Id, array2Id) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1[array1Id] === object2[array2Id];
      });
    });
  }

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getbyIdProductCustCat();
    })();
    setIsLoading(false);
  }, [tabIndex]);

  const getbyIdProductCustCat = async () => {
    if (tabIndex > 0) {
      await getCrudApi(`api/v1/product_cust_cat/` + tabIndex, {})?.then(
        (item) => {
          if (item && item?.length > 0)
            setProductCustomizationCategoryOptions(
              Object?.assign([], item[0]?.options)
            );
        }
      );
    }
  };

  useEffect(() => {
    let TabsCategory = [...tabsProductCustomizationCategory];
    let removedDiff = getDifference(
      TabsCategory,
      selectedProductCustomizationCategory,
      "categoryId",
      "value"
    );
    let addedDiff = getDifference(
      selectedProductCustomizationCategory,
      TabsCategory,
      "value",
      "categoryId"
    );
    addedDiff.map((newCat) => {
      let newTabCategory = {
        categoryId: newCat.value,
        categoryName: newCat.label,
        options: [],
      };
      TabsCategory.push(newTabCategory);
    });
    TabsCategory = getDifference(
      TabsCategory,
      removedDiff,
      "categoryId",
      "categoryId"
    );
    TabsCategory = [
      ...filteredTabsProductCustomizationCategory,
      ...TabsCategory,
    ];
    setTabsProductCustomizationCategory(TabsCategory);
  }, [selectedProductCustomizationCategory]);

  const handlePostOptions = async (e) => {
    setIsLoading(true);
    let cusOptions = [];
    tabsProductCustomizationCategory?.map((data) => {
      cusOptions = [...cusOptions, ...data?.options];
    });
    let data = {
      productID: productId,
      prdCustDftQtyId: cusOptions,
    };
    await postCrudApi("api/v1/product/ins_prdCustDftQty_by_prd", data)
      .then((data) => {
        if (data) toast.success("Added Successfully");
        else {
          toast.error("Operation was not performed");
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
  };
  const handleUpdateOptions = async (e) => {
    setIsLoading(true);
    let newData = JSON.parse(JSON.stringify(tabsProductCustomizationCategory));
    let updateOpt = [];
    let addedOpt = [];
    let success = true;
    newData.map((prodCust) => {
      prodCust?.options.map((eachOpt) => {
        if (eachOpt.productCustomizationDefaultQuantityID) {
          updateOpt.push(eachOpt);
        } else {
          addedOpt.push(eachOpt);
        }
      });
    });
    let dataAdd = {
      productID: productId,
      prdCustDftQtyId: addedOpt,
    };
    let updAdd = {
      productID: productId,
      prdCustDftQtyId: updateOpt,
    };
    if (dataAdd.prdCustDftQtyId.length > 0) {
      await postCrudApi("api/v1/product/ins_prdCustDftQty_by_prd", dataAdd)
        .then((data) => {
          success = true;
        })
        .catch((err) => {
          success = false;
        });
    }
    if (updAdd.prdCustDftQtyId.length > 0) {
      await postCrudApi("api/v1/product/upd_prdCustDftQty_by_prd", updAdd)
        .then((data) => {
          success = true;
        })
        .catch((err) => {
          success = false;
        });
    }
    if (success) {
      toast.success("Successfully done");
    } else {
      toast.error("Not able to perform the operation");
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ProductDetails">
          <div className="productDetailsFirstDiv">
            <div className="Productdetail-header">
              <Select
                onChange={handleProCusCategory}
                styles={SelectStyle}
                isMulti
                isSearchable
                value={selectedProductCustomizationCategory}
                options={productCustomizationCategory}
                className="dropdown-input"
              />
              {tabsProductCustomizationCategory.length > 0 ? (
                <div className="tab-header">
                  {tabsProductCustomizationCategory?.map((tab, index) => (
                    <button
                      key={index}
                      className={
                        activeTabIndexProductCustomizationCategory === index
                          ? "active-tab tab-header_button"
                          : "tab-header_button"
                      }
                      onClick={() =>
                        setActiveTabIndexProductCustomizationCategory(index)
                      }
                    >
                      {tab?.categoryName}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="tab-body">
                {tabsProductCustomizationCategory?.map((tab, index) => (
                  <div
                    className="tab"
                    key={index}
                    style={{
                      display:
                        activeTabIndexProductCustomizationCategory === index
                          ? "block"
                          : "none",
                    }}
                  >
                    <div className="product-cust-options-product">
                      <div className="product-cust-options-product-cards-tabs-add-btn-div">
                        <div>
                          {addClicked ? (
                            <div className="productTags-Modal ">
                              <div className="productTags-modalContainer">
                                <div className="productTags-header-modal"></div>

                                <div className="productTags-Inputsfields">
                                  <label className="productTags-label-class">
                                    {" "}
                                    Customization Name{" "}
                                  </label>
                                  <Select
                                    className="productTags-dropdown-input "
                                    placeholder="Customization Name"
                                    onChange={(e) => {
                                      onChangeOfOption(e, index);
                                    }}
                                    value={
                                      selectedProductCustomizationCategoryOptions
                                    }
                                    isClearable={true}
                                    styles={SelectStyle}
                                    options={getFilteredCustOptions(
                                      selectOptionsMap(
                                        productCustomizationCategoryOptions,
                                        "customizationOptionID",
                                        "name"
                                      )
                                    )}
                                  />
                                  <div className="closeSubmitDiv">
                                    <button
                                      onClick={handleCloseBtnOfModal}
                                      className="UpdateButtonCustomisationOption"
                                    >
                                      Close
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSubmitBtnOfModal(index)
                                      }
                                      className="UpdateButtonCustomisationOption"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="cardAddButton">
                          <button
                            className="product-cust-options-product-cards-tabs-add-btn"
                            onClick={(e) =>
                              handleModalClick(e, tab?.categoryId, tab)
                            }
                            style={{ fontSize: "large" }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="product-cust-options-product-cards-tabs-input-div">
                        {tab?.options?.map((obj, indexOpt) => {
                          return (
                            <>
                              {obj?.customizationOptionName &&
                              obj?.customizationOptionName !== null &&
                              obj?.customizationOptionName !== "" ? (
                                <div className="CustomizationOptions_container">
                                  <div className="CustomizationOptions">
                                    {!obj.productCustomizationDefaultQuantityID ? (
                                      <div className="cardCloseButtonDiv">
                                        <button
                                          type="button"
                                          className="cardCloseButton"
                                          onClick={(e) =>
                                            removeCardProCustOptCat(
                                              e,
                                              index,
                                              indexOpt
                                            )
                                          }
                                        >
                                          X
                                        </button>
                                      </div>
                                    ) : (
                                      <></>
                                    )}

                                    <div>
                                      <div className="ProductCat-Inputfields">
                                        <label className="ProductCat-label-class">
                                          Name{" "}
                                          <i class="fa fa-asterisk aster-risk-Icon" />
                                        </label>
                                        <input
                                          type="text"
                                          onChange={(e) =>
                                            updateOptionProCustOptCat(
                                              e,
                                              e.target.value,
                                              index,
                                              indexOpt
                                            )
                                          }
                                          name="customizationOptionName"
                                          placeholder="Name"
                                          readonly="readonly"
                                          className="ProductCat-textbox-input"
                                          value={obj?.customizationOptionName}
                                        />
                                      </div>

                                      <div className="ProductCat-Inputfields">
                                        <label className="ProductCat-label-class">
                                          Default Quantity{" "}
                                          <i class="fa fa-asterisk aster-risk-Icon" />
                                        </label>
                                        <input
                                          type="text"
                                          name="defaultQuantity"
                                          onChange={(e) =>
                                            updateOptionProCustOptCat(
                                              e,
                                              e.target.value,
                                              index,
                                              indexOpt
                                            )
                                          }
                                          placeholder="Default Quantity"
                                          className="ProductCat-textbox-input"
                                          value={obj?.defaultQuantity || 0}
                                        />
                                      </div>

                                      <div className="ProductCat-Inputfields">
                                        <label className="ProductCat-label-class">
                                          Min Quantity{" "}
                                        </label>
                                        <input
                                          type="text"
                                          name="minQuantity"
                                          onChange={(e) =>
                                            updateOptionProCustOptCat(
                                              e,
                                              e.target.value,
                                              index,
                                              indexOpt
                                            )
                                          }
                                          placeholder="Min Quantity"
                                          className="ProductCat-textbox-input"
                                          value={obj?.minQuantity || ""}
                                        />
                                      </div>

                                      <div className="ProductCat-Inputfields">
                                        <label className="ProductCat-label-class">
                                          Max Quantity{" "}
                                        </label>
                                        <input
                                          type="text"
                                          name="maxQuantity"
                                          onChange={(e) =>
                                            updateOptionProCustOptCat(
                                              e,
                                              e.target.value,
                                              index,
                                              indexOpt
                                            )
                                          }
                                          placeholder="Max Quantity"
                                          className="ProductCat-textbox-input"
                                          value={obj?.maxQuantity || ""}
                                        />
                                      </div>
                                      <div className="CheckboxFlexDiv">
                                        <div className="div-ProductC-checkbox ">
                                          <label className="checkBox_label-class">
                                            Status
                                          </label>
                                          <input
                                            name="isActive"
                                            type="checkbox"
                                            onChange={(e) =>
                                              updateOptionProCustOptCat(
                                                e,
                                                obj.isActive === 1 ? 2 : 1,
                                                index,
                                                indexOpt
                                              )
                                            }
                                            checked={obj.isActive === 1}
                                            className="ProductCat-modalCheckbox"
                                          />
                                        </div>
                                        <div className="div-ProductC-checkbox ">
                                          <label className="checkBox_label-class">
                                            Default
                                          </label>
                                          <input
                                            id={"isDefault_" + indexOpt}
                                            name="isDefault"
                                            type="checkbox"
                                            onChange={(e) =>
                                              updateDefault(
                                                e,
                                                obj?.isDefault === 1 ? 2 : 1,
                                                index,
                                                indexOpt
                                              )
                                            }
                                            checked={obj?.isDefault === 1}
                                            className="ProductCat-modalCheckbox"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {productId &&
                productId > 0 &&
                filteredTabsProductCustomizationCategory?.length > 0 ? (
                  <div className="updateButtonDiv">
                    <button
                      onClick={handleUpdateOptions}
                      className="UpdateButtonCustomisationOption"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handlePostOptions}
                    className="UpdateButtonCustomisationOption"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
