import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import "./ProductCategory.css";
import MUIDataTable from "mui-datatables";
import Select from "react-select";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import { getBase64FromFile } from "../../Helpers/Helpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function ProductCategory() {
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [addClicked, setAddClicked] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [prodCatName, setProdCatName] = useState("");
  const [prodCatDesc, setProdCatDesc] = useState("");
  const [prodCatStatus, setProdCatStatus] = useState({
    value: 1,
    label: "Active",
  });
  const [productImages, setProductImages] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [parentProductCategoryID, setParentProductCategoryID] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [data, setData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;

  // Validation
  const [nameError, setNameError] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getCrudApi("api/v1/product_category", {}).then((data) => {
        setData(data);
      });
    })();
    setIsLoading(false);
  }, [updateUI]);

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: 2, label: "InActive" },
    { value: 3, label: "Disable" },
  ];

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };

    const validateFile = (fil) => {
      if (fil === "") {
        setFileError(true);
        isValid = false;
      } else {
        setFileError(false);
      }
    };
    let isValid = true;
    validateName(prodCatName);
    validateFile(productImages);
    return isValid;
  };

  const options = {
    filter: false,
    download: false,
    print: false,
    selectableRows: "none",
    viewColumns: false,
    search: true,
    filterType: "dropdown",
    rowsPerPage: 5,
    rowsPerPageOptions: [],
  };

  const onEditClick = (rowIndex) => {
    setAddClicked(true);
    setEditRow(true);
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setProdCatName(selectedProduct.name);
    setProdCatDesc(selectedProduct.description);
    setProdCatStatus(
      selectedProduct.isActive === 1
        ? { value: 1, label: "Active" }
        : selectedProduct.isActive === 2
        ? { value: 2, label: "InActive" }
        : selectedProduct.isActive === 3
        ? { value: 3, label: "Disable" }
        : null
    );
    
    if (
      selectedProduct.productCategoryImagePath !== "" &&
      selectedProduct.productCategoryImagePath !== undefined &&
      selectedProduct.productCategoryImagePath !== null
    ) {
      setProductImages(BASE_URL + selectedProduct.productCategoryImagePath);
    } else {
      setProductImages("");
    }

    selectedProduct.parentProductCategoryID
      ? setParentProductCategoryID({
          value: selectedProduct.parentProductCategoryID,
          label: data.find(
            (item) =>
              item.productCategoryID === selectedProduct.parentProductCategoryID
          )?.name,
        })
      : setParentProductCategoryID([]);
  };

  const generateColumns = () => {
    let columnsArray = [];
    let firstCol = {
      name: "EDIT",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <>
              <button
                className="tableEditButton"
                onClick={() => {
                  onEditClick(
                    tableMeta.currentTableData[tableMeta.rowIndex].index
                  );
                }}
              >
                <GrEdit />
              </button>
            </>
          );
        },
      },
    };
    columnsArray.push(firstCol);
    columnsArray.push({
      name: "ProductCategory ID",
      label: "ProductCategory ID",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "name",
      label: "Name",
    });
    columnsArray.push({
      name: "description",
      label: "Description",
    });
    columnsArray.push({
      name: "parentProductCategoryID",
      label: "PARENT CATEGORY",
      options: {
        customBodyRender: (value) => {
          const parentCategoryName = data.find(
            (item) => item.productCategoryID === value
          )?.name;
          return parentCategoryName || null;
        },
      },
    });

    columnsArray.push({
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) =>
          value === 1
            ? "Active"
            : value === 2
            ? "InActive"
            : value === 3
            ? "Disabled"
            : "",
      },
    });

    return columnsArray;
  };

  const onEditSave = async () => {
    setIsLoading(true);
    setNameError(false);
    if (validateInput()) {
      let ProdCatJson = {
        name: prodCatName,
        description: prodCatDesc,
        parentProductCategoryID: parentProductCategoryID
          ? parentProductCategoryID.value
          : null,
        isActive: prodCatStatus?.value,
        imageDetails: fileUploaded,
      };

      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/product_category/${data[selectedRowIndex].productCategoryID}`,
          ProdCatJson
        )
          .then((data) => {
            if (data) {
              notifyProductCategory("update");
              data["lng"] = selectedLanguage;
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
            setSelectedLanguage("en");
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      } else {
        await postCrudApi("api/v1/product_category", ProdCatJson)
          .then((data) => {
            if (data) {
              notifyProductCategory("add");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
      setAddClicked(false);
    }
    setIsLoading(false);
  };
  const onCloseClick = () => {
    setAddClicked(false);
    setEditRow(false);
    setNameError(false);
    setFileError(false);
  };

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
    } else {
      setFileError(true);
    }
  };

  const handleDeleteImage = () => {
    setProductImages("");
    setFileError(true);
  };

  const onAddNewClick = () => {
    setNewOrUpdate("New");
    setProdCatName("");
    setProdCatDesc("");
    setProductImages("");
    setProdCatStatus({
      value: 1,
      label: "Active",
    });
    setParentProductCategoryID();
    setAddClicked(true);
    setSelectedRowIndex(null);
  };

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const handleParentProductCategoryID = (e) => {
    setParentProductCategoryID(e);
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

  const notifyProductCategory = (action) => {
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
    if (!value?.trim() || !value) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setProdCatName(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="productCategory-container">
          <div className="productCategory-add-button-container">
            <button
              type="button"
              className="productCategory-modal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <>
            {addClicked ? (
              <div className="productCategory-Modal">
                <div className="productCategory-modal-content productCategory-modalWidthClass ">
                  <div className="productCategory-header-modal">
                    <h5 className="productCategory-header-title">
                      Product Category
                    </h5>
                    {editRow && (
                      <LanguageDropdown
                        onSelectLanguage={handleSelectLanguage}
                      />
                    )}
                  </div>
                  <div className="productCategory-imagesAndFields ">
                    <div className="productCategory-imageUploaderDiv ">
                      <h3 className="productCategory-uploadImageHeading ">
                        Image
                      </h3>
                      <div
                        className="productCategory-image-uploader"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {productImages && productImages !== BASE_URL ? (
                          <div className="productCategory-dropped-files ">
                            <div className="productCategory-file-info ">
                              <img
                                className="productCategory-file-info-image "
                                src={productImages}
                                alt="Selected-pic"
                                height="175"
                                width="200"
                              />
                              <div className="productCategory-delete-image-button-container">
                                <button
                                  onClick={handleDeleteImage}
                                  className="productCategory-delete-image-button  "
                                >
                                  Delete Image
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="fileInput"
                            className="productCategory-file-input-label "
                          >
                            <p>Drag and drop your Image</p>
                            <p>Or</p>
                            <h5 className="productCategory-image-uploader-heading">
                              Browse Image
                            </h5>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileInput}
                              style={{ display: "none" }}
                              id="fileInput"
                            />
                            {fileError && <Error message={"Required*"} />}
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="productCategoryInputFields">
                      <div className="productCategory-Inputsfields">
                        <label className="productCategory-label-class">
                          Name{" "}
                          <i className="fa fa-asterisk aster-risk-Icon"></i>
                        </label>

                        <input
                          type="text"
                          placeholder="Name"
                          onChange={HandleNameChange}
                          value={prodCatName}
                          className="productCategory-textbox-input"
                        />
                        {nameError && <Error message={"Required*"} />}
                      </div>
                      <div className="productCategory-Inputsfields">
                        <label className="productCategory-label-class">
                          {" "}
                          Description{" "}
                        </label>
                        <input
                          type="text"
                          placeholder="Description"
                          onChange={(e) => setProdCatDesc(e.target.value)}
                          value={prodCatDesc}
                          className="productCategory-textbox-input"
                        />
                      </div>
                      <div className="productCategory-Inputsfields">
                        <label className="productCategory-label-class">
                          Parent Name
                        </label>
                        <Select
                          onChange={handleParentProductCategoryID}
                          value={parentProductCategoryID}
                          placeholder="Select"
                          isClearable={true}
                          styles={SelectStyle}
                          maxMenuHeight={150}
                          className="productcategory-dropdown-input"
                          options={data
                            ?.filter((e) => e.isActive === 1)
                            ?.map((e) => ({
                              label: e.name,
                              value: e.productCategoryID,
                            }))}
                        />
                      </div>

                      <div className="productCategory-Inputsfields">
                        <label className="productCategory-label-class">
                          Status
                        </label>
                        <Select
                          defaultValue={prodCatStatus}
                          onChange={(e) => setProdCatStatus(e)}
                          options={statusOptions}
                          styles={SelectStyle}
                          className="productcategory-dropdown-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="productCategory-footer-modal">
                    {NewOrUpdate === "New" ? (
                      <button
                        type="button"
                        className="productCategory-Modal-btn"
                        onClick={onEditSave}
                      >
                        Add
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="productCategory-Modal-btn"
                          onClick={onEditSave}
                        >
                          Update
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="productCategory-close-btn"
                      onClick={onCloseClick}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
          <div className="productTable-body ">
            <div className="table-scroll">
              <MUIDataTable
                title={"Product Category"}
                data={data}
                columns={generateColumns()}
                options={options}
                className="muitable"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
