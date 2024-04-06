import React, { useState, useEffect } from "react";
import "./Product.css";
import Error from "../../Error/Error";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import {
  selectOptionsMap,
  getBase64FromFile,
} from "../../Helpers/Helpers";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductHowtos from "./ProductHowTos";
import ProductManuals from "./ProductManuals";
import ProductDriver from "./ProductDrivers";
import ProductCustomizationOption from "./ProductCustomizationOption";
import ProductTag from "./ProductTags";
import Handlebars from "handlebars";
import LoadingScreen from "../../Loading/Loading";

export default function ProductDetails() {
  const [name, setName] = useState("");
  const [productDescription, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [productImages, setProductImages] = useState("");
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [productCategoryError, setProductCategoryError] = useState(false);
  const [fileError, setFileError] = useState(false);

  const [productCategoryID, setProductCategory] = useState("");
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [NewOrUpdate, setNewOrUpdate] = useState("New");
  const [updateUI, setUpdateUI] = useState(false);

  const [allData, setAllData] = useState(null);

  const [fileUploaded, setFileUploaded] = useState([]);
  const [htmlInput, setHtmlInput] = useState(null);
  const [rawContent, setrawContent] = useState("");
  const [tabvalue, setValue] = React.useState(0);
  const [productId, setProductId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;
  const navigate = useNavigate();

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const imageFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length > 0) {
      setProductImages(URL.createObjectURL(imageFiles[0]));
      let FileArray = await getBase64FromFile(imageFiles);
      setFileUploaded(FileArray);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length > 0) {
      setProductImages(URL.createObjectURL(imageFiles[0]));
      let FileArray = await getBase64FromFile(imageFiles);
      setFileUploaded(FileArray);
      setFileError(false);
    } else {
      setFileError(true);
    }
  };

  const handleDeleteImage = () => {
    setProductImages("");
    setFileUploaded(null);
    setFileError(true);
  };

  const notifyProduct = (action) => {
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

  const onEditSave = async () => {
    setNameError(false);
    setPriceError(false);
    setProductCategoryError(false);
    setFileError(false);
    if (validateInput()) {
      const editedProduct = {
        product: {
          name: name,
          productDescription: productDescription,
          isActive: status,
          price: price,
          stock: stock,
          productCategoryID: productCategoryID?.value,
          imageDetails: fileUploaded,
          productFeature: JSON.stringify({ html: rawContent }),
        },
      };

      if (allData?.productID !== null && location?.state !== null) {
        await putCrudApi(`api/v1/product/${allData?.productID}`, editedProduct)
          .then((data) => {
            if (data) {
              notifyProduct("update");
              navigate("/Admin/Product");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            resetForm();
            toast.error("Unable to Add the product", err);
          });
      } else {
        await postCrudApi("api/v1/product", editedProduct)
          .then((data) => {
            if (data) {
              notifyProduct("add");
              navigate("/Admin/Product");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            resetForm();
            toast.error("Unable to Add the product", err);
          });
      }
      resetForm();
    } else {
      toast.error("Please fill the required fields");
    }
  };
  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus(1);
    setPrice("");
    setStock("");
    setProductCategory("");
    setProductImages("");
  };

  const getproductCategory = async () => {
    await getCrudApi("api/v1/product_category").then((data) => {
      setProductCategoryData(data);
    });
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (name) {
        if (name.trim() === "") {
          isValid = false;
          setNameError(true);
        }
      } else {
        isValid = false;
        setNameError(true);
      }
    };

    const validateFile = (fil) => {
      if (!fil) {
        setFileError(true);
        isValid = false;
      } else {
        setFileError(false);
      }
    };

    let isValid = true;

    validateName(name);
    if (isNaN(price) || price === null || price === "") {
      setPriceError(true);
      isValid = false;
    }

    if (!productCategoryID) {
      setProductCategoryError(true);
      isValid = false;
    }

    validateFile(productImages);
     if(!htmlInput || htmlInput.toString().trim() === ""){
      isValid = false
     }

    return isValid;
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getproductCategory();
      if (location?.state) {
        await getByIdProductDetails();
      }
      setProductId(location?.state);
    })();
    setIsLoading(false);
  }, []);

  const getByIdProductDetails = async () => {
    if (location?.state) {
      await getCrudApi(`api/v1/product/${location?.state}`, {})?.then(
        (item) => {
          setAllData(item[0]);
          setUpdateUI(!updateUI);
          setNewOrUpdate("Update");
        }
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
       populateData();
    setIsLoading(false);
  }, [allData, updateUI]);

  const getAllProductCategory = async () => {
    setProductCategory(
      selectOptionsMap(
        productCategoryData.filter(
          (item) => item.productCategoryID === allData.productCategoryID
        ),
        "productCategoryID",
        "name"
      )[0]
    );
  };

  let populateData = () => {
    if (allData) {
      setName(allData.name);
      setStatus(allData.isActive);
      setDescription(allData.productDescription);
      setPrice(allData.price);
      setStock(allData.stock);
      if (allData?.productFeature && allData?.productFeature != null) {
        let html = JSON?.parse(allData?.productFeature)?.html;
        if (html && html !== null) {
          setHtmlInput(html);
        }
      }

      setProductImages(
        allData.productImagePath === null ||
          allData.productImagePath === "" ||
          allData.productImagePath === undefined
          ? null
          : BASE_URL + allData.productImagePath
      );
      getAllProductCategory();
    }
  };

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

  const HandleNameChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setName(value);
  };

  const HandleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
  };

  const HandlePriceChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value === null || value === "") {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
    setPrice(value);
  };

  const HandleProductCategoryChange = (e) => {
    const value = e?.value;
    if (!value) {
      setProductCategoryError(true);
    } else {
      setProductCategoryError(false);
    }
    setProductCategory(e);
  };
  const handleTabs = (val) => {
    setValue(val);
  };
  useEffect(() => {
    if (htmlInput) {
      let html = htmlInput;
      var template = Handlebars.compile(html);
      var result = template();
      setrawContent(result);
    }
  }, [htmlInput]);
  const handleInputHtml = (e) => {
    setHtmlInput(e.target.value);
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="Tab-nav-product">
            <div
              className={
                tabvalue === 0 ? "tabs-active-product" : "tab-div-product"
              }
              onClick={() => handleTabs(0)}
            >
              Product
            </div>
            {productId > 0 ? (
              <>
                <div
                  className={
                    tabvalue === 1 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(1)}
                >
                  HowTo
                </div>
                <div
                  className={
                    tabvalue === 2 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(2)}
                >
                  Manuals
                </div>
                <div
                  className={
                    tabvalue === 3 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(3)}
                >
                  Drivers
                </div>
                <div
                  className={
                    tabvalue === 4 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(4)}
                >
                  Options
                </div>
                <div
                  className={
                    tabvalue === 5 ? "tabs-active-product" : "tab-div-product"
                  }
                  onClick={() => handleTabs(5)}
                >
                  Tags
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {tabvalue === 0 ? (
            <div className="ProductDetails">
              <div className="productDetailsFirstDiv">
                <div className="productFlexAlignDiv">
                  <div className="productDetailsInnerDiv">
                    <div className="productInputFields">
                      <div className="productInputHolderDiv">
                        <label className="productLabelClass">
                          Name <i class="fa fa-asterisk aster-risk-Icon"></i>
                        </label>
                        <input
                          type="text"
                          onChange={HandleNameChange}
                          placeholder="Name"
                          className="productTextbox-input_1 productTextInput"
                          value={name}
                        />
                        {nameError && <Error message={"*required"} />}
                      </div>

                      <div className="productInputHolderDiv">
                        <label className="productLabelClass">
                          Description{" "}
                        </label>
                        <input
                          type="text"
                          onChange={HandleDescriptionChange}
                          placeholder="Description"
                          className="productTextbox-input_1 productTextInput"
                          value={productDescription}
                        />
                      </div>

                      <div className="productInputHolderDiv">
                        <label className="productLabelClass">
                          Price <i class="fa fa-asterisk aster-risk-Icon"></i>
                        </label>
                        <input
                          type="text"
                          onChange={HandlePriceChange}
                          placeholder="Price"
                          className="productTextbox-input_1 productTextInput"
                          value={price}
                        />
                        {priceError && <Error message={"*required"} />}
                      </div>

                      <div className="productInputHolderDiv">
                        <label className="productLabelClass">
                          Stock <i class="fa fa-asterisk aster-risk-Icon"></i>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="Stock"
                          className="productTextbox-input_1 productTextInput"
                          value={stock}
                        />
                      </div>

                      <div className="productInputDDiv">
                        <label className="productLabelClass">
                          Product Category{" "}
                          <i class="fa fa-asterisk aster-risk-Icon"></i>
                        </label>
                        <Select
                          onChange={HandleProductCategoryChange}
                          styles={SelectStyle}
                          isClearable
                          value={productCategoryID}
                          maxMenuHeight={150}
                          options={productCategoryData
                            ?.filter((e) => e.parentProductCategoryID !== null)
                            ?.filter((e) => e.isActive === 1)
                            ?.map((e) => ({
                              label: e.name,
                              value: e.productCategoryID,
                            }))}
                          className="Drive-dropdown-input"
                        />
                        {productCategoryError && (
                          <Error message={"*required"} />
                        )}
                      </div>
                      <div className="status_stock_checkBoxes">
                        <div className="productInputHolderDiv_checkbox">
                          <label className="productLabelClass">Status</label>
                          <input
                            className="modalCheckbox"
                            type="checkbox"
                            onChange={() => setStatus(status === 1 ? 2 : 1)}
                            checked={status === 1}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="productImagecontainer">
                      <div className="productImageUploadDiv">
                        <h3 className="productImageUploadDivHeading">
                          Upload The Image{" "}
                          <i class="fa fa-asterisk aster-risk-Icon"></i>
                        </h3>

                        {productImages ? (
                          <div className="droppedFilesDiv">
                            <div className="productDropped-files">
                              <div className="productDelete-image-button-container">
                                <button
                                  onClick={handleDeleteImage}
                                  className="productDelete-image-button "
                                >
                                  X
                                </button>
                              </div>
                              <div className="productFile-info">
                                <img
                                  className="productFile-info-image "
                                  src={productImages}
                                  alt="Selected-pic"
                                  height="300"
                                  width="400"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="product-image-uploader"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                          >
                            <label
                              htmlFor="fileInput"
                              className="productFile-input-label"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: "none" }}
                                id="fileInput"
                                className="product_ImageInput"
                              />
                              {fileError && <Error message={"*required"} />}

                              <h5 className="productImage-uploader-heading">
                                Browse Image
                              </h5>
                              <p>Or</p>
                              <p>Drag and drop your Image</p>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="productDetailsFirstDiv">
                <div className="productFlexAlignDiv">
                  <div className="feature-content-div">
                    <div className="feature-content">
                      <label className="manual-label-class">
                        Feature <i class="fa fa-asterisk aster-risk-Icon" />
                      </label>
                      <textarea
                        type="text"
                        onChange={handleInputHtml}
                        placeholder="Raw Content"
                        className="feature-content-input"
                        value={htmlInput}
                      ></textarea>
                    </div>
                    <div className="feature-content">
                      <label className="manual-label-class">
                        Content <i class="fa fa-asterisk aster-risk-Icon" />
                      </label>
                      <div
                        dangerouslySetInnerHTML={{ __html: rawContent }}
                        className="feature-content-input"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="productDetailsFooter-modal">
                {NewOrUpdate === "New" ? (
                  <button
                    type="button"
                    className="productDetailsModalBtn"
                    onClick={onEditSave}
                  >
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    className="productDetailsModalBtn"
                    onClick={onEditSave}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {tabvalue === 1 ? (
            <>
              <ProductHowtos productId={productId} />
            </>
          ) : (
            <></>
          )}
          {tabvalue === 2 ? (
            <>
              <ProductManuals productId={productId} />
            </>
          ) : (
            <></>
          )}
          {tabvalue === 3 ? (
            <>
              <ProductDriver productId={productId} />
            </>
          ) : (
            <></>
          )}
          {tabvalue === 4 ? (
            <>
              <ProductCustomizationOption productId={productId} />
            </>
          ) : (
            <></>
          )}
          {tabvalue === 5 ? (
            <>
              <ProductTag productId={productId} />
            </>
          ) : (
            <></>
          )}

          <TabPanel value={tabvalue} index={1}></TabPanel>
        </>
      )}
    </>
  );
}
function TabPanel(props) {
  const { children, value, index } = props;
  return <div>{value === index && <h1>{children}</h1>}</div>;
}
