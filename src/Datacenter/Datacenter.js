import React, { useState, useEffect } from "react";
import { getCrudApi } from "../webServices/webServices";
import { useLocation, useNavigate } from "react-router-dom";
import "./Datacenter.css";
import Select from "react-select";

import { useTranslation } from "react-i18next";

export default function Datacenter() {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const [productFamilyInfo, setProductFamilyInfo] = useState([]);
  const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      await getAllproducts();
    })();
  }, []);

  const getAllproducts = async () => {
    await getCrudApi("api/v1/product/").then((searchOptions) => {
      if (searchOptions) {
        setData(searchOptions);
      }
    });
  };

  useEffect(() => {
    var productFamily = t("productFamily", { returnObjects: true }).filter(
      (productFam) => {
        let parentProductId = parseInt(
          sessionStorage.getItem("parentProductId")
        );
        if (productFam?.productFamilyId === parentProductId) return true;
      }
    );
    setProductFamilyInfo(productFamily);
  }, [t]);

  const handleDropdown1Change = (selected) => {
    if (selected) {
      sessionStorage.setItem("productId", selected?.productID);
      navigate("/Home/DataCenter/Support", {
        state: {
          productId: selected?.productID,
        },
      });
    }
  };

  const [isDropdownsVisible, setIsDropdownsVisible] = useState(false);

  const handleButtonClick = async (productCategoryId, active) => {
    if (active) {
      await getCrudApi("api/v1/product/active/" + productCategoryId).then(
        (pdata) => {
          setProductData(pdata);
        }
      );
      setIsDropdownsVisible(!isDropdownsVisible);
    }
  };

  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="searchDropdownDiv">
      <img
        src={BASE_URL + data.productImagePath}
        alt={label}
        className="searchDropdownImage"
      />
      <div className="searchDropdownName">{label}</div>
    </div>
  );

  const Navigate = (path) => {
    navigate(path);
  };

  const StyleSelect = {
    control: (base) => ({
      ...base,
      minHeight: "36px",
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
    menuList: (provided) => ({
      ...provided,
      maxHeight: 150,
      overflowY: "auto",
    }),
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      minHeight: "40px",
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

  const onChangeOfSearchDropDown = (e) => {
    sessionStorage.setItem("productId", e?.productID);
    navigate("/Home/DataCenter/Support", {
      state: {
        productId: e?.productID,
      },
    });
  };

  return (
    <>
      <div>
        <div className="datacenterdiv">
          {productFamilyInfo && productFamilyInfo?.length > 0 ? (
            <>
              <div className="datacentertop">
                <h1>{productFamilyInfo[0]?.support?.title}</h1>
                <label>{productFamilyInfo[0]?.support?.subHeading}</label>
                <br />
                <div className="datacenterSearchDiv">
                  <Select
                    options={data?.filter((option) => option.isActive === 1)}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.name}
                    placeholder={productFamilyInfo[0]?.support?.searchHint}
                    styles={SelectStyle}
                    components={{ Option: CustomOption }}
                    onChange={onChangeOfSearchDropDown}
                  />
                </div>
                <div className="datacenterbutton_container">
                  <label className="datacenterbutton">
                    {productFamilyInfo[0]?.support?.searchHelp}
                  </label>
                </div>
              </div>
              <div className="dataCenterProductcontainer">
                <div className="datacenterBottom">
                  <h2 className="datacenterBottom_Heading">
                    {t("browseProduct.title")}
                  </h2>
                  <div className="productContainer">
                    {t("browseProduct.products", { returnObjects: true })
                      ?.filter(
                        (a) =>
                          a.productFamilyId ===
                          productFamilyInfo[0]?.productFamilyId
                      )
                      .map((item, index) => {
                        return (
                          <>
                            {item.isActive !== 2 ? (
                              <div
                                key={index}
                                className={`product ${
                                  item.isActive !== 1 ? "inactive" : ""
                                }`}
                                onClick={() =>
                                  handleButtonClick(
                                    item.productId,
                                    item.isActive === 1
                                  )
                                }
                              >
                                <img
                                  src={
                                    process.env.REACT_APP_AWS_S3_PUBLIC_URL +
                                    item.imageURL
                                  }
                                  alt="pic"
                                  className="product_Image"
                                />
                                <p>{item.productTitle}</p>
                                {item.isActive === 3 && (
                                  <p class="dataCenter_ribbon3">Coming Soon</p>
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}
                  </div>
                </div>

                <div className="dropdown-container">
                  {isDropdownsVisible && (
                    <div className="datacenter_dropdowns">
                      <div className="dataCenterDropdown">
                        <Select
                          classname="React_select_dropdown"
                          options={
                            productData
                              ? productData.filter((e) => e.isActive === 1)
                              : []
                          }
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.name}
                          onChange={handleDropdown1Change}
                          components={{ Option: CustomOption }}
                          placeholder="Select..."
                          styles={StyleSelect}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="datacenterbottom">
                  <h2 className="datacenterBottom_Heading">
                    {t("popularResources.title")}
                  </h2>
                  <div className="ResourceContainer">
                    {t("popularResources.resources", {
                      returnObjects: true,
                    })?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`resource ${
                            item.isActive === false ? "inactive" : ""
                          }`}
                          onClick={() =>
                            Navigate(
                              item.isActive === true ? item.navigatePath : ""
                            )
                          }
                        >
                          <img
                            src={item.imageURL}
                            alt="pic"
                            className="resource_Image"
                          />
                          <p className="resource_title">{item.title}</p>
                          <p className="resource_dull_paragraph">
                            {item.description}
                          </p>
                          <p className="button_In_Resource">
                            {item.buttonTitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="datacenterbottom">
                  <h2 className="datacenterBottom_Heading">
                    {t("contactUs.title")}
                  </h2>
                  <div className="ResourceContainer">
                    {t("contactUs.resources", { returnObjects: true })?.map(
                      (item, index) => {
                        return (
                          <div
                            key={index}
                            className={`resource ${
                              item.isActive === false ? "inactive" : ""
                            }`}
                            onClick={() =>
                              Navigate(
                                item.isActive === false ? "" : item.navigatePath
                              )
                            }
                          >
                            <img
                              src={item.imageURL}
                              alt="pic"
                              className="resource_Image"
                            />
                            <p className="resource_title">{item.title}</p>
                            <p className="resource_dull_paragraph">
                              {item.description}
                            </p>
                            <p className="button_In_Resource">
                              {item.buttonTitle}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
