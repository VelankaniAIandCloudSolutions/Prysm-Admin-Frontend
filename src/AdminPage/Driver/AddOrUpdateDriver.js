import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import "./AddOrUpdateDriver.css";
import Select from "react-select";
import { GrEdit } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import { selectOptionsMap } from "../../Helpers/Helpers";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import LoadingScreen from "../../Loading/Loading";

export default function AddOrUpdateDriver({ data }) {
  const [driverGrpId, setDriverGrpId] = useState("");
  const [osId, setOsId] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [versionStatus, setVersionStatus] = useState(2);
  const [driverId, setDriverId] = useState(0);
  const [isTableDisplay, setIsTableDisplay] = useState(false);
  const [versionNo, setVersionNo] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const [changeHistory, setChangeHistory] = useState("");
  const [versionData, setVersionData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [driverGroupData, setDriverGroupData] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const { state } = useLocation();
  const [updateUI, setUpdateUI] = useState(false);
  const [enableUpdate, setEnableUpdate] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [driverGrpIdError, setDriverGrpIdError] = useState(false);
  const [osIdError, setOsIdError] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [changeHistoryError, setChangeHistoryError] = useState(false);
  const [releaseDateError, setReleaseDateError] = useState(false);
  const [fileUploadedFormData, setFileUploadedFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllOsData();
      await getAllDriverGroup();
      setIsLoading(false);
    })();
  }, [updateUI]);
  useEffect(() => {
    if (state?.data) {
      setDescription(state?.data?.description);
      setName(state?.data?.name);
      setStatus(state?.data?.status);
      setDriverId(state?.data?.id);

      if (state?.data) {
        setUpdateData(state?.data);
      }

      setEnableUpdate(true);
    }
    if (driverId > 0) {
      setUpdateData({ id: driverId });
    }
  }, [updateUI]);
  useEffect(() => {
    setRows(generateRows());
  }, [versionData]);
  useEffect(() => {
    if (state?.data) {
      let selectedGrpId = driverGroupData?.find(
        (item) => item?.id === state?.data?.driverGrpId
      );
      if (selectedGrpId) {
        setDriverGrpId(selectOptionsMap([selectedGrpId], "id", "name"));
      }
    }
  }, [driverGroupData]);

  useEffect(() => {
    if (state?.data && osData.length > 0) {
      if (state?.data?.osId?.includes(",")) {
        let arrayOs = state?.data?.osId?.split(",");
        let selectedOsId = [];

        arrayOs?.map((data) => {
          let osId = osData?.find((item) => {
            return item?.id === parseInt(data, 10);
          });
          selectedOsId?.push(osId);
        });
        setOsId(selectOptionsMap(selectedOsId, "id", "name"));
      } else {
        let osId = osData?.find(
          (item) => item?.id === parseInt(state?.data?.osId, 10)
        );
        osId ? setOsId(selectOptionsMap([osId], "id", "name")) : setOsId();
      }
    }
  }, [osData]);

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };

    let isValid = true;

    validateName(name);

    if (!driverGrpId) {
      isValid = false;
      setDriverGrpIdError(true);
    }

    if (!osId) {
      isValid = false;
      setOsIdError(true);
    }

    return isValid;
  };

  const versionValidate = () => {
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    const versionRegexPattern = (input) => /^(?!.*\.{2})[0-9.]+$/.test(input);

    const checkVersionValidity = (ver) => {
      if (!ver.trim() || !versionRegexPattern(ver.trim())) {
        isVersionValid = false;
        setVersionError(true);
      }
    };
    const validateChangeHistory = (history) => {
      if (!history.trim() || !isAlphaNumeric(history)) {
        isVersionValid = false;
        setChangeHistoryError(true);
      }
    };

    const validatefile = (content) => {
      if (!content) {
        isVersionValid = false;
        setFileError(true);
      }
    };

    let isVersionValid = true;

    checkVersionValidity(versionNo);
    validateChangeHistory(changeHistory);

    if (!releaseDate) {
      isVersionValid = false;
      setReleaseDateError(true);
    }

    validatefile(fileUploadedFormData);

    return isVersionValid;
  };

  const setUpdateData = async (data) => {
    if (data != null) {
      await getCrudApi("api/v1/driver/" + data?.id, {}).then((res) => {
        setName(res[0]?.name);
        setDescription(res[0]?.description);
        setStatus(res[0]?.status);
        setDriverGrpId(res[0].driverGrpId);
        setVersionData(res[0]?.diVersion);
        if (res[0] && osData.length > 0) {
          if (res[0]?.osId?.includes(",")) {
            let arrayOs = res[0]?.osId?.split(",");
            let selectedOsId = [];

            arrayOs?.map((data) => {
              let osId = osData?.find((item) => {
                return item?.id === parseInt(data, 10);
              });
              selectedOsId?.push(osId);
            });
            setOsId(selectOptionsMap(selectedOsId, "id", "name"));
          } else {
            let osId = osData?.find(
              (item) => item?.id === parseInt(res[0]?.osId, 10)
            );
            osId ? setOsId(selectOptionsMap([osId], "id", "name")) : setOsId();
          }
        }
        setRows(generateRows());
      });
    }
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

  const handleDropVersion = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const pdfFiles = droppedFiles;
    if (pdfFiles.length > 0) {
      setFileUploadedFormData(pdfFiles[0]);
    }
  };

  const handleDragOverVersion = (e) => {
    e.preventDefault();
  };

  const handleFileInputVersion = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles;
    if (pdfFiles.length > 0) {
      setFileUploadedFormData(pdfFiles[0]);
      setFileError(false);
    } else {
      setFileError(true);
    }
  };

  const handleDeleteFile = () => {
    setFileUploadedFormData(null);
    setFileError(true);
  };

  const addDriverClick = async (e) => {
    e.preventDefault();
    setNameError(false);
    setDriverGrpIdError(false);
    setOsIdError(false);
    if (validateInput()) {
      setIsLoading(true);
      let data = {
        name: name,
        description: description,
        status: status,
        driverGrpId: driverGrpId?.value,
        osId: osId.map((item) => item.value).join(","),
      };
      await postCrudApi("api/v1/driver", data)
        .then((res) => {
          setDriverId(res?.driverID);
          if (updateUI) {
            setUpdateUI(false);
          } else {
            setUpdateUI(true);
          }
        })
        .catch((error) => {
          toast.error("Operation was not performed");
        });
      setEnableUpdate(true);
      setIsTableDisplay(false);
      setIsLoading(false);
    }
  };

  const updateDriverClick = async (e) => {
    setNameError(false);
    setDriverGrpIdError(false);
    setOsIdError(false);
    e.preventDefault();
    if (validateInput()) {
      setIsLoading(true);
      let data = {
        name: name,
        description: description,
        status: status,
        driverGrpId: driverGrpId?.value,
        osId: osId.map((item) => item.value).join(","),
      };
      await putCrudApi("api/v1/driver/" + driverId, data)
        .then((data) => {
          if (data) {
            notifyAddOrUpdateDriver("update");
            setUpdateUI(!updateUI);
          } else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
      setIsLoading(false);
    }
  };

  const addVersionClick = async (e) => {
    e.preventDefault();
    setVersionError(false);
    setChangeHistoryError(false);
    setReleaseDateError(false);
    setFileError(false);
    if (versionValidate()) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", fileUploadedFormData);
      formData.append("version", versionNo);
      formData.append("releaseDate", releaseDate);
      formData.append("status", versionStatus);
      formData.append("driverId", driverId);
      formData.append("changeHistory", changeHistory);
      await postCrudApi("api/v1/driverVersion", formData)
        .then((res) => {
          if (formData) {
            notifyAddOrUpdateDriver("add");
          }
          setIsTableDisplay(false);
          setUpdateUI(!updateUI);
        })
        .catch((error) => {
          toast.error("Operation was not performed");
        });
      setIsLoading(false);
    }
  };

  const addNewClickVersion = (e) => {
    e.preventDefault();
    setVersionNo("");
    setVersionStatus(2);
    setChangeHistory("");
    setReleaseDate();
    setFileUploadedFormData(null);
    setIsTableDisplay(true);
    setVersionError(false);
    setChangeHistoryError(false);
    setReleaseDateError(false);
  };

  const generateColumns = () => {
    let columnsArray = [];
    columnsArray.push({
      field: "versionId",
      headerName: "ID",
      width: 100,
      hideable: false,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
    });
    columnsArray.push({
      field: "version",
      headerName: "VERSION NO",
      editable: false,
      width: 200,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
    });
    columnsArray.push({
      field: "releaseDate",
      headerName: "RELEASE DATE",
      editable: false,
      width: 300,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      renderCell: (params) => {
        const releaseDate = new Date(params.value);
        const day = releaseDate.getDate();
        const month = releaseDate.getMonth() + 1;
        const year = releaseDate.getFullYear();
        const hours = releaseDate.getHours();
        const minutes = releaseDate.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedDate = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
        return formattedDate;
      },
    });
    columnsArray.push({
      field: "status",
      headerName: "STATUS",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Inactive", "Active"],
      width: 200,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
    });
    columnsArray.push({
      field: "actions",
      type: "actions",
      headerName: "EDIT",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FaSave size={20} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<GiCancel size={20} />}
              label="Cancel"
              sx={{
                color: "#ad2128",
              }}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<GrEdit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    });

    return columnsArray;
  };

  const generateRows = () => {
    let rowsArrays = versionData?.filter((obj) => {
      if (obj.versionId === null) {
        return false;
      } else {
        return true;
      }
    });
    rowsArrays = rowsArrays?.map((object) => ({
      ...object,
      id: object?.versionId,
      status: object?.versionStatus === 1 ? "Active" : "Inactive",
    }));

    return rowsArrays;
  };

  const getAllOsData = async () => {
    await getCrudApi("api/v1/os", {}).then((data) => {
      setOsData(data);
    });
  };

  const getAllDriverGroup = async () => {
    await getCrudApi("api/v1/driver_group", {}).then((data) => {
      setDriverGroupData(data);
    });
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow) => {
    setIsLoading(true);
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    let updatedRowForAPI = {
      id: updatedRow?.versionId,
      filePath: updatedRow?.filePath,
      changeHistory: updatedRow?.changeHistory,
      status: updatedRow.status === "Active" ? 1 : 2,
      version: updatedRow?.version,
      releaseDate: updatedRow?.releaseDate,
      driverId: driverId,
    };
    putCrudApi(
      "api/v1/driverVersion/" + updatedRow?.versionId,
      updatedRowForAPI
    )
      .then((res) => {
        if (res) {
          toast.error("Operation was successful");
        } else {
          toast.error("Operation was not performed");
        }
        setIsTableDisplay(false);
        setUpdateUI(!updateUI);
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const notifyAddOrUpdateDriver = (action) => {
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

  const HandleGroupChange = (e) => {
    const value = e?.value;
    if (!value) {
      setDriverGrpIdError(true);
    } else {
      setDriverGrpIdError(false);
    }
    setDriverGrpId(e);
  };

  const HandleOSChange = (e) => {
    const value = e.length;
    if (!value) {
      setOsIdError(true);
    } else {
      setOsIdError(false);
    }
    setOsId(e);
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

  const HandleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const HandleHistoryChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9:-;!\s]+$/.test(input);
    if (!value.trim() || !isAlphaNumeric(value)) {
      setChangeHistoryError(true);
    } else {
      setChangeHistoryError(false);
    }
    setChangeHistory(value);
  };

  const HandleVersionChange = (e) => {
    const value = e.target.value;
    const isNumeric = (input) => /^[0-9]*\.?[0-9]*$/.test(input);
    if (!value.trim() || !isNumeric(value)) {
      setVersionError(true);
    } else {
      setVersionError(false);
    }
    setVersionNo(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <div className="add-update-driver-container">
            <div className="add-update-driver-main-div1">
              <div className="add-update-driver-sub-div">
                <div className="add-update-driver-sub-div">
                  <div>
                    <label className="driverCheckBox_label-class ">
                      Driver Name{" "}
                      <i className="fa fa-asterisk aster-risk-Icon"></i>
                    </label>
                    <input
                      type="text"
                      placeholder="Name"
                      onChange={HandleNameChange}
                      value={name}
                      className="drivertextbox-input_1 driverTextInput add-update-driver-input-des"
                    />
                    {nameError && <Error message={"Required*"} />}
                  </div>
                </div>

                <div>
                  <label className="driverCheckBox_label-class ">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Description"
                    onChange={HandleDescriptionChange}
                    value={description}
                    className="drivertextbox-input_1 driverTextInput add-update-driver-input-des"
                  />
                </div>

                <div className="add-update-driver-check-box-div">
                  <label className="driverCheckBox_label-class">Status</label>
                  <input
                    type="checkbox"
                    onChange={() => setStatus(status === 1 ? 2 : 1)}
                    checked={status === 1}
                    className="modalCheckbox"
                  />
                </div>
                <div>
                  <label className="driverCheckBox_label-class ">
                    Driver Group{" "}
                    <i className="fa fa-asterisk aster-risk-Icon"></i>
                  </label>
                  <Select
                    onChange={HandleGroupChange}
                    value={driverGrpId}
                    placeholder="Select"
                    styles={SelectStyle}
                    options={selectOptionsMap(
                      driverGroupData?.filter((e) => e.status === 1),
                      "id",
                      "name"
                    )}
                    className="driverDropdown-input add-update-driver-select"
                  />
                  {driverGrpIdError && <Error message={"Required*"} />}
                </div>
                <div>
                  <label className="driverCheckBox_label-class ">
                    Operating System{" "}
                    <i className="fa fa-asterisk aster-risk-Icon"></i>
                  </label>
                  <Select
                    onChange={HandleOSChange}
                    value={osId}
                    placeholder="Select"
                    styles={SelectStyle}
                    isMulti={true}
                    options={selectOptionsMap(
                      osData?.filter((e) => e.status === 1),
                      "id",
                      "name"
                    )}
                    className="driverDropdown-input add-update-driver-select"
                  />
                  {osIdError && <Error message={"Required*"} />}
                </div>
              </div>

              <div className="ModalOpenButtonContainer">
                {!enableUpdate ? (
                  <button
                    className="driverModal-open-btn"
                    onClick={addDriverClick}
                  >
                    Add
                  </button>
                ) : (
                  <button
                    className="driverModal-open-btn"
                    onClick={updateDriverClick}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            {driverId != null && driverId > 0 ? (
              <>
                {isTableDisplay ? (
                  <div className="add-update-driver-main-div2">
                    <h2>Version</h2>
                    <div className="add-update-driver-sub-div">
                      <div>
                        <div>
                          <label className="driverCheckBox_label-class ">
                            Version No{" "}
                            <i className="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            type="text"
                            placeholder="Version Number"
                            onChange={HandleVersionChange}
                            value={versionNo}
                            className="drivertextbox-input_1 driverTextInput add-update-driver-input"
                          />
                          {versionError && <Error message={"Required*"} />}
                        </div>
                        <label className="driverCheckBox_label-class ">
                          Release Date{" "}
                          <i className="fa fa-asterisk aster-risk-Icon"></i>
                        </label>
                        <input
                          type="date"
                          placeholder="YYYY-MM-DD"
                          onChange={(e) => {
                            setReleaseDate(e.target.value);
                            setReleaseDateError(false);
                          }}
                          value={releaseDate}
                          className="drivertextbox-input_1 driverTextInput add-update-driver-input"
                        />
                        {releaseDateError && <Error message={"Required*"} />}
                        <div className="add-update-driver-check-box-div">
                          <label className="driverCheckBox_label-class">
                            Status
                          </label>
                          <input
                            type="checkbox"
                            onChange={() =>
                              setVersionStatus(versionStatus === 1 ? 2 : 1)
                            }
                            checked={versionStatus === 1}
                            className="driverModalCheckbox"
                          />
                        </div>

                        <div>
                          <label className="driverCheckBox_label-class ">
                            Change History{" "}
                            <i className="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <textarea
                            placeholder="Change History"
                            onChange={HandleHistoryChange}
                            value={changeHistory}
                            className="drivertextbox-input_1 driverTextInput add-update-driver-text-area"
                          />
                          {changeHistoryError && (
                            <Error message={"Required*"} />
                          )}
                        </div>

                        <div className="driverImageUploader">
                          <div className="driverImageUploaderInnerDiv">
                            <label className="driverCheckBox_label-class ">
                              Upload The File{" "}
                              <i className="fa fa-asterisk aster-risk-Icon"></i>
                            </label>
                            <div className="add-update-driver-upload">
                              <div
                                onDrop={handleDropVersion}
                                onDragOver={handleDragOverVersion}
                                className="fileDropDiv-Driver"
                              >
                                <label htmlFor="fileInput">
                                  <input
                                    type="file"
                                    accept="*/*"
                                    onChange={handleFileInputVersion}
                                    style={{ display: "none" }}
                                    id="fileInput"
                                    className="driverCheckBox_label-class"
                                    name="file"
                                  />
                                  <h5 className="image-uploader-heading">
                                    Choose File
                                  </h5>
                                  {fileError && <Error message={"Required*"} />}
                                  Drop The File Here
                                </label>
                                {fileUploadedFormData ? (
                                  <div>
                                    <p>{fileUploadedFormData?.name}</p>
                                    <MdDelete onClick={handleDeleteFile} />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ModalOpenButtonContainer">
                      <div className="">
                        <button
                          className="driverModal-open-btn"
                          onClick={addVersionClick}
                        >
                          Add
                        </button>
                        <button
                          className="driverModal-close-btn"
                          onClick={() => {
                            setIsTableDisplay(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="add-update-driver-main-div2">
                    <div className="add_button_container">
                      <button
                        type="button"
                        className="driverModal-open-btn"
                        onClick={addNewClickVersion}
                      >
                        Add
                      </button>
                    </div>
                    <div className="driverTable-body">
                      <div className="driverAdd_table-scroll">
                        {rows?.length > 0 ? (
                          <DataGrid
                            editMode="row"
                            rowModesModel={rowModesModel}
                            onRowModesModelChange={handleRowModesModelChange}
                            onRowEditStop={handleRowEditStop}
                            processRowUpdate={processRowUpdate}
                            rows={rows}
                            columns={generateColumns()}
                            className="muitable"
                          />
                        ) : (
                          <p>No versions to show</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
