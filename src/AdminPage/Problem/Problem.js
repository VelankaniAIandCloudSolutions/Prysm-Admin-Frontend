import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import "./Problem.css";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function Problem() {
  const [addClicked, setAddClicked] = useState(false);
  const [problemType, setProblemType] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [problemTypeStatus, setProblemTypeStatus] = useState(1);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [allProblemData, setAllProblemsData] = useState([]);
  // Validation
  const [nameError, setNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllProblem();
      setIsLoading(false);
    })();
  }, [updateUI]);

  const getAllProblem = async () => {
    await getCrudApi("api/v1/problem", {}).then((data) => {
      setAllProblemsData(data);
    });
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };

    let isValid = true;

    validateName(problemType);

    return isValid;
  };

  const onEditSave = async () => {
    setIsLoading(true);
    setNameError(false);
    if (validateInput()) {
      let problemJson = {
        problemType: problemType,
        problemDescription: problemDescription,
        status: problemTypeStatus === 1 ? 1 : 2,
      };
      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/problem/${allProblemData[selectedRowIndex].problemId}`,
          problemJson
        )
          .then((data) => {
            if (data) {
              notifyProblemType("update");
              setAddClicked(false);
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      } else {
        setAllProblemsData((prevData) => [...prevData, problemJson]);
        await postCrudApi("api/v1/problem", problemJson)
          .then((data) => {
            if (data) {
              notifyProblemType("add");
              setAddClicked(false);
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
    }
    setIsLoading(false);
  };

  const options = {
    filter: false,
    download: false,
    print: false,
    selectableRows: "none",
    viewColumns: false,
    search: true,
    filterType: "dropdown",
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [],
  };

  const onEditClick = (rowIndex) => {
    setAddClicked(true);
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = allProblemData[rowIndex];
    setProblemType(selectedProduct?.problemType);
    setProblemDescription(selectedProduct?.problemDescription);
    setProblemTypeStatus(selectedProduct?.status);
  };

  const generateColumns = () => {
    let columnsArray = [];
    let firstCol = {
      name: "EDIT",
      options: {
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
      name: "problemId",
      label: "problemId",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "problemType",
      label: "NAME",
    });
    columnsArray.push({
      name: "problemDescription",
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

  const onAddNewClick = () => {
    setNewOrUpdate("New");
    setProblemType("");
    setProblemDescription("");
    setProblemTypeStatus(1);
    setAddClicked(true);
    setSelectedRowIndex(null);
  };
  const onCloseClick = () => {
    setAddClicked(false);
    setNameError(false);
  };

  const notifyProblemType = (action) => {
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
    setProblemType(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="problemType-container">
          <div className="problemType-add-button-container">
            <button
              type="button"
              className="problemType-modal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <div>
            {addClicked ? (
              <div className="problemType-Modal ">
                <div className="problemType-modalContainer">
                  <div className="problemType-header-modal">
                    <h5 className="problemType-header-title">Problem Type</h5>
                  </div>
                  <div className="problemType-Inputsfields">
                    <label className="problemType-label-class">
                      Problem Type {""}
                      <i className="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="text"
                      onChange={HandleNameChange}
                      placeholder="Problem Type"
                      className="problemType-textbox-input"
                      value={problemType}
                    />
                    {nameError && <Error message={"Required*"} />}
                  </div>
                  <div className="problemType-Inputsfields">
                    <label className="problemType-label-class">
                      Description
                    </label>

                    <input
                      type="text"
                      onChange={(e) => {
                        setProblemDescription(e.target.value);
                      }}
                      placeholder="Description"
                      className="problemType-textbox-input"
                      value={problemDescription}
                    />
                  </div>
                  <div className="problemType-Inputsfields">
                    <div className="problemType-modal-checkbox-div ">
                      <label className="checkBox_label-class">Status</label>
                      <input
                        className="problemType-modalCheckbox"
                        type="checkbox"
                        checked={problemTypeStatus === 1}
                        onChange={() =>
                          setProblemTypeStatus(problemTypeStatus === 1 ? 2 : 1)
                        }
                      />
                    </div>
                  </div>

                  <div className="problemType-footer-modal">
                    {NewOrUpdate === "New" ? (
                      <button
                        type="button"
                        className="problemType-Modal-btn"
                        onClick={onEditSave}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="problemType-Add-btn"
                        onClick={onEditSave}
                      >
                        Update
                      </button>
                    )}
                    <button
                      type="button"
                      className="problemType-close-btn"
                      onClick={onCloseClick}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="Table-body">
            <div className="table-scroll">
              <MUIDataTable
                title={"Problem"}
                data={allProblemData}
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
