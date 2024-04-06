import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import MUIDataTable from "mui-datatables";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBase64FromFile } from "../../Helpers/Helpers";
import "./DriverGroup.css";
import LoadingScreen from "../../Loading/Loading";

const BASE_URL = process.env.REACT_APP_AWS_S3_PUBLIC_URL;

export default function DriverGroup() {
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [addClicked, setAddClicked] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState(1);
  const [updateUI, setUpdateUI] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [data, setData] = useState([]);
  // Validation
  const [nameError, setNameError] = useState(false);
  const [imageUrlError, setImageUrlError] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getDriverGroupData();
      setIsLoading(false);
    })();
  }, [updateUI]);

  const getDriverGroupData = async () => {
    getCrudApi("api/v1/driver_group", {}).then((dta) => {
      setData(dta);
    });
  };

  const validateInput = () => {
    let isValid = true;
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
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

    validateName(name);
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
    onColumnSortChange: (changedColumn, direction) => {},
    onChangeRowsPerPage: (numberOfRows) => {},
  };

  const onEditClick = (rowIndex) => {
    setAddClicked(true);
    setEditRow(true);
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setName(selectedProduct.name);
    setDescription(selectedProduct.description);
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
      name: "name",
      label: "DRIVER NAME",
    });
    columnsArray.push({
      name: "description",
      label: "DESCRIPTION",
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
    setNameError(false);
    setImageUrlError(false);
    if (validateInput()) {
      setIsLoading(true);
      let ProdCatJson = {
        name: name,
        description: description,
        status: status === 1 ? 1 : 2,
        imageDetails: fileUploaded,
      };

      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/driver_group/${data[selectedRowIndex].id}`,
          ProdCatJson
        )
          .then((data) => {
            if (data) {
              notifyDriverGroup("update");
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
        await postCrudApi("api/v1/driver_group", ProdCatJson)
          .then((data) => {
            if (data) {
              notifyDriverGroup("add");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
      setIsLoading(false);
      setAddClicked(false);
    }
  };
  const onCloseClick = () => {
    setAddClicked(false);
    setEditRow(false);
    setNameError(false);
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
    setNewOrUpdate("New");
    setName("");
    setDescription("");
    setImageUrl("");
    setStatus(1);
    setAddClicked(true);
  };

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const notifyDriverGroup = (action) => {
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
    if (!value.trim() || !isAlphaNumeric(value)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setName(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="dGroup-container">
          <div className="dGroupAddButtonDiv">
            <button
              type="button"
              className="dGroupModalOpenBtn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <div>
            <div>
              <div>
                {addClicked ? (
                  <div className="dGroupProductModal">
                    <div className="admin-all-modal">
                      <div className="dGroupModal-content modalWidthClass">
                        <div className="dGroupHeader-modal">
                          <h5 className="dGroupHeaderTitle">Driver Group</h5>
                          {editRow && (
                            <LanguageDropdown
                              onSelectLanguage={handleSelectLanguage}
                            />
                          )}
                        </div>
                        <div className="imagesAndFields">
                          <div className="dGroupImageUploaderDiv">
                            <h3 className="dGroupUploadImageHeading">
                              Image
                              <i className="fa fa-asterisk aster-risk-Icon"></i>
                            </h3>
                            <div
                              className="dGroupImage-uploader"
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              {imageUrl && imageUrl !== BASE_URL ? (
                                <div className="dGroupDropped-files">
                                  <div className="dGroupFile-info">
                                    <img
                                      className="dGroupFile-info-image "
                                      src={imageUrl}
                                      alt="Selected-pic"
                                      height="175"
                                    />
                                    <div className="dGroupDeleteImageBtnDiv">
                                      <button
                                        onClick={handleDeleteImage}
                                        className="dGroupDeleteImageBtn"
                                      >
                                        Delete Image
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <label
                                  htmlFor="fileInput"
                                  className="dgroupFile-input-label"
                                >
                                  <p>Drag and drop your Image</p>
                                  <p>Or</p>
                                  <h5 className="dgroupImage-uploader-heading">
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
                            <div className="dGroupDivDisplay">
                              <label className="dGroupLabelClass">
                                Driver Group Name{" "}
                                <i className="fa fa-asterisk aster-risk-Icon"></i>
                              </label>

                              <input
                                type="text"
                                placeholder=" Driver Group Name"
                                onChange={HandleNameChange}
                                value={name}
                                className="dGroupTextboxInput_1 dGroupTextInput"
                              />
                              {nameError && <Error message={"Required*"} />}
                            </div>
                            <div className="dGroupDivDisplay">
                              <label className="dGroupLabelClass">
                                {" "}
                                Description
                              </label>
                              <input
                                type="text"
                                placeholder="Description"
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                                value={description}
                                className="dGroupTextboxInput_1 dGroupTextInput"
                              />
                            </div>

                            <div className="dGroupDivDisplay">
                              <div className="dGroupModalCheckboxDiv">
                                <label className="dGroupCheckBoxLabelClass">
                                  Status
                                </label>
                                <input
                                  type="checkbox"
                                  className="dGroupModalCheckbox"
                                  onChange={() =>
                                    setStatus(status === 1 ? 2 : 1)
                                  }
                                  checked={status === 1}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="dGroupFooter-modal">
                          {NewOrUpdate === "New" ? (
                            <button
                              type="button"
                              className="dGroupModal-btn"
                              onClick={onEditSave}
                            >
                              Add
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="dGroupModal-btn"
                                onClick={onEditSave}
                              >
                                Update
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="dGroupClose-btn"
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
            <div className="dGroupTable-body">
              <div className="dGroupTable-scroll">
                <MUIDataTable
                  title={"Driver Group"}
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
