import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBase64FromFile } from "../../Helpers/Helpers";
import "./HomeImage.css";
import LoadingScreen from "../../Loading/Loading";

// const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;
const BASE_URL = "https://prysmsupport.xtractautomation.com/";

export default function HomeImage() {
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [addClicked, setAddClicked] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState(1);
  const [updateUI, setUpdateUI] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [data, setData] = useState([]);
  // Validation
  const [displayOrderError, setDisplayOrderError] = useState(false);
  const [imageUrlError, setImageUrlError] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getHomePageImageData();
      setIsLoading(false);
    })();
  }, [updateUI]);

  const getHomePageImageData = async () => {
    await getCrudApi("api/v1/homepg_img", {}).then((dta) => {
      setData(dta);
    });
  };

  const validateInput = () => {
    let isValid = true;
    const isNumeric = (input) => /^[0-9]+$/.test(input);
    const validateDisplayOrder = (Order) => {
      if (!Order || !isNumeric(Order)) {
        isValid = false;
        setDisplayOrderError(true);
      }
    };
    const validateImage = (fil) => {
      if (fil === "") {
        isValid = false;
        setImageUrlError(true);
      } else {
        setImageUrlError(false);
      }
    };

    validateDisplayOrder(displayOrder);
    validateImage(imageUrl);
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
    sortOrder: {
      name: "location_id",
      direction: "desc",
    },
  };

  const onEditClick = (rowIndex) => {
    setAddClicked(true);
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setDisplayOrder(selectedProduct.displayOrder);
    setStatus(selectedProduct.status);
    setImageUrl(
      selectedProduct.imageUrl !== null &&
        selectedProduct.imageUrl !== undefined &&
        BASE_URL + selectedProduct.imageUrl
    );
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
      name: "displayOrder",
      label: "DISPLAY ORDER",
    });

    columnsArray.push({
      name: "status",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    });

    return columnsArray;
  };

  const onEditSave = async () => {
    setIsLoading(true);
    setDisplayOrderError(false);
    setImageUrlError(false);
    if (validateInput()) {
      let ProdCatJson = {
        displayOrder: displayOrder,
        status: status === 1 ? 1 : 2,
        imageDetails: fileUploaded,
      };

      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/homepg_img/${data[selectedRowIndex].homepageImageID}`,
          ProdCatJson
        )
          .then((data) => {
            if (data) {
              notifyHomeImage("update");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      } else {
        await postCrudApi("api/v1/homepg_img", ProdCatJson)
          .then((data) => {
            if (data) {
              notifyHomeImage("add");
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
    setDisplayOrderError(false);
    setImageUrlError(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const imageFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length > 0) {
      setImageUrl(URL.createObjectURL(imageFiles[0]));
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
      setImageUrl(URL.createObjectURL(imageFiles[0]));
      let FileArray = await getBase64FromFile(imageFiles);
      setFileUploaded(FileArray);
    } else {
      setImageUrlError(true);
    }
  };

  const handleDeleteImage = () => {
    setImageUrl("");
    setImageUrlError(true);
  };

  const onAddNewClick = () => {
    setSelectedRowIndex(null);
    setNewOrUpdate("New");
    setDisplayOrder("");
    setImageUrl("");
    setStatus(1);
    setAddClicked(true);
  };

  const notifyHomeImage = (action) => {
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

  const HandleDisplayOrderChange = (e) => {
    const value = e.target.value;
    const isNumeric = (input) => /^[0-9]+$/.test(input);
    if (!value || !isNumeric(value)) {
      setDisplayOrderError(true);
    } else {
      setDisplayOrderError(false);
    }
    setDisplayOrder(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="HomeImage_-container">
          <div className="HomeImage_AddButtonDiv">
            <button
              type="button"
              className="HomeImage_ModalOpenBtn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <div>
            <div>
              <div>
                {addClicked ? (
                  <div className="HomeImage_ProductModal">
                    <div className="admin-all-modal">
                      <div className="HomeImage_Modal-content modalWidthClass">
                        <div className="HomeImage_Header-modal">
                          <h5 className="HomeImage_HeaderTitle">Home</h5>
                        </div>
                        <div className="imagesAndFields">
                          <div className="HomeImage_ImageUploaderDiv">
                            <h3 className="HomeImage_UploadImageHeading">
                              Image
                              <i className="fa fa-asterisk aster-risk-Icon"></i>
                            </h3>
                            <div
                              className="HomeImage_Image-uploader"
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              {imageUrl && imageUrl !== BASE_URL ? (
                                <div className="HomeImage_Dropped-files">
                                  <div className="HomeImage_File-info">
                                    <img
                                      className="HomeImage_File-info-image "
                                      src={imageUrl}
                                      alt="Selected-pic"
                                      width="260"
                                      height="175"
                                    />
                                    <div className="HomeImage_DeleteImageBtnDiv">
                                      <button
                                        onClick={handleDeleteImage}
                                        className="HomeImage_DeleteImageBtn"
                                      >
                                        Delete Image
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <label
                                  htmlFor="fileInput"
                                  className="HomeImage_File-input-label"
                                >
                                  <p>Drag and drop your Image</p>
                                  <p>Or</p>
                                  <h5 className="HomeImage_Image-uploader-heading">
                                    Browse Image
                                  </h5>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                    style={{ display: "none" }}
                                    id="fileInput"
                                  />
                                  {imageUrlError && (
                                    <Error message={"Required*"} />
                                  )}
                                </label>
                              )}
                            </div>
                          </div>
                          <div className="productCategoryInputFields">
                            <div className="HomeImage_DivDisplay">
                              <label className="HomeImage_LabelClass">
                                Display Order{" "}
                                <i className="fa fa-asterisk aster-risk-Icon"></i>
                              </label>

                              <input
                                type="text"
                                placeholder="Display Order"
                                onChange={HandleDisplayOrderChange}
                                value={displayOrder}
                                className="HomeImage_TextboxInput_1 HomeImage_TextInput"
                              />
                              {displayOrderError && (
                                <Error message={"Required*"} />
                              )}
                            </div>

                            <div className="HomeImage_DivDisplay">
                              <div className="HomeImage_ModalCheckboxDiv">
                                <label className="HomeImage_CheckBoxLabelClass">
                                  Status
                                </label>
                                <input
                                  type="checkbox"
                                  className="HomeImage_ModalCheckbox"
                                  onChange={() =>
                                    setStatus(status === 1 ? 2 : 1)
                                  }
                                  checked={status === 1}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="HomeImage_Footer-modal">
                          {NewOrUpdate === "New" ? (
                            <button
                              type="button"
                              className="HomeImage_Modal-btn"
                              onClick={onEditSave}
                            >
                              Add
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="HomeImage_Modal-btn"
                                onClick={onEditSave}
                              >
                                Update
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="HomeImage_Close-btn"
                            onClick={onCloseClick}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="HomeImage_Table-body">
              <div className="HomeImage_Table-scroll">
                <MUIDataTable
                  title={"Home"}
                  data={data}
                  columns={generateColumns()}
                  options={options}
                  className="muitable"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
