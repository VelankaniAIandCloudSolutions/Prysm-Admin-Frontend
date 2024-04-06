import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import "./TicketStatus.css";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TicketStatus() {
  const [addClicked, setAddClicked] = useState(false);
  const [statusName, setStatusName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [status, setStatus] = useState(1);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [statusData, setStatusData] = useState([]);
  // Validation
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    getAllTicketStatus();
  }, [updateUI]);

  const getAllTicketStatus = async () => {
    await getCrudApi("api/v1/ticket_status", {}).then((data) => {
      setStatusData(data);
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

    validateName(statusName);

    return isValid;
  };

  const onEditSave = async () => {
    setNameError(false);
    if (validateInput()) {
      let ticketStatus = {
        statusName: statusName,
        description: description,
        isActive: status === 1 ? 1 : 2,
      };
      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/ticket_status/${statusData[selectedRowIndex]?.statusID}`,
          ticketStatus
        )
          .then((data) => {
            if (data) {
              notifyTicketStatus("update");
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
        setStatusData((prevData) => [...prevData, ticketStatus]);
        await postCrudApi("api/v1/ticket_status", ticketStatus)
          .then((data) => {
            if (data) {
              notifyTicketStatus("add");
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
    const selectedProduct = statusData[rowIndex];
    setStatusName(selectedProduct?.statusName);
    setDescription(selectedProduct?.description);
    setStatus(selectedProduct?.isActive);
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
                  onEditClick(tableMeta.rowIndex);
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
      name: "statusID",
      label: "Status ID",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "statusName",
      label: "STATUS NAME",
    });
    columnsArray.push({
      name: "description",
      label: "DESCRIPTION",
    });

    columnsArray.push({
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    });
    return columnsArray;
  };

  const onAddNewClick = () => {
    setNewOrUpdate("New");
    setStatusName("");
    setDescription("");
    setStatus(1);
    setAddClicked(true);
    setSelectedRowIndex(null);
  };
  const onCloseClick = () => {
    setAddClicked(false);
    setNameError(false);
  };

  const notifyTicketStatus = (action) => {
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
    setStatusName(value);
  };

  return (
    <>
      <div className="statusName-container">
        <div className="statusName-add-button-container">
          <button
            type="button"
            className="statusName-modal-open-btn"
            onClick={onAddNewClick}
          >
            Add
          </button>
        </div>
        <div>
          {addClicked ? (
            <div className="statusName-Modal ">
              <div className="statusName-modalContainer">
                <div className="statusName-header-modal">
                  <h5 className="statusName-header-title">Ticket Status</h5>
                </div>
                <div className="statusName-Inputsfields">
                  <label className="statusName-label-class">
                    Status Name {""}
                    <i className="fa fa-asterisk aster-risk-Icon"></i>
                  </label>

                  <input
                    type="text"
                    onChange={HandleNameChange}
                    placeholder="Status Name"
                    className="statusName-textbox-input"
                    value={statusName}
                  />
                  {nameError && <Error message={"Required*"} />}
                </div>
                <div className="statusName-Inputsfields">
                  <label className="statusName-label-class">Description</label>

                  <input
                    type="text"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    placeholder="Description"
                    className="statusName-textbox-input"
                    value={description}
                  />
                </div>
                <div className="statusName-Inputsfields">
                  <div className="statusName-modal-checkbox-div ">
                    <label className="checkBox_label-class">Status</label>
                    <input
                      className="statusName-modalCheckbox"
                      type="checkbox"
                      checked={status === 1}
                      onChange={() => setStatus(status === 1 ? 2 : 1)}
                    />
                  </div>
                </div>

                <div className="statusName-footer-modal">
                  {NewOrUpdate === "New" ? (
                    <button
                      type="button"
                      className="statusName-Modal-btn"
                      onClick={onEditSave}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="statusName-Add-btn"
                      onClick={onEditSave}
                    >
                      Update
                    </button>
                  )}
                  <button
                    type="button"
                    className="statusName-close-btn"
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
              title={"Ticket Status"}
              data={statusData}
              columns={generateColumns()}
              options={options}
              className="muitable"
            />
          </div>
        </div>
      </div>
    </>
  );
}
