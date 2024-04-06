import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Select from "react-select";
import { GrEdit } from "react-icons/gr";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import Error from "../../Error/Error";
import "./OperatingSystem.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function OperatingSystem() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [updateUI, setUpdateUI] = useState(false);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [parentOsID, setParentOsID] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [nameError, setNameError] = useState(false);

  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllOs();
      setIsLoading(false);
    })();
  }, [updateUI]);

  const getAllOs = async () => {
    await getCrudApi("api/v1/os", {}).then((data) => {
      setData(data);
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
    validateName(name);
    return isValid;
  };

  const columns = [
    {
      name: "EDIT",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        print: false,
        selectableRows: "none",
        viewColumns: false,
        search: true,
        filterType: "dropdown",
        rowsPerPage: 5,
        rowsPerPageOptions: [],
        customBodyRender: (_, tableMeta) => (
          <button
            onClick={() =>
              onEditClick(tableMeta.currentTableData[tableMeta.rowIndex].index)
            }
            className="tableEditButton"
          >
            <GrEdit />
          </button>
        ),
      },
    },
    {
      name: "name",
      label: "OPERATING SYSTEM NAME",
    },
    {
      name: "status",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "parentOsID",
      label: "PARENT OPERATING SYSTEM",
      options: {
        customBodyRender: (value, tableMeta) => {
          const parentname = data.find((item) => item.id === value)?.name;
          return parentname || null;
        },
      },
    },
  ];

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
    onChangePage: (currentPage) => {},
  };

  const onAddNewClick = () => {
    setNewOrUpdate("New");
    setModalOpen(true);
    setSelectedRowIndex(null);
  };

  const onEditClick = (rowIndex) => {
    setModalOpen(true);
    setEditRow(true);
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setName(selectedProduct.name);
    setStatus(selectedProduct.status);
    setParentOsID(
      selectedProduct.parentOsID
        ? {
            value: selectedProduct.parentOsID,
            label: data?.find((item) => item?.id === selectedProduct.parentOsID)
              ?.name,
          }
        : null
    );
  };

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const onEditSave = async () => {
    setNameError(false);

    if (validateInput()) {
      setIsLoading(true);
      const editedProduct = {
        name: name,
        status: status === 1 ? 1 : 2,
        parentOsID: parentOsID ? parentOsID.value : null,
      };

      if (selectedRowIndex !== null) {
        // Update existing product
        await putCrudApi(
          `api/v1/os/${data[selectedRowIndex].id}`,
          editedProduct
        )
          .then((data) => {
            if (data) {
              notifyOperatingSystem("update");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
            data["lng"] = selectedLanguage;
            setSelectedLanguage("en");
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      } else {
        // Add new product at the bottom
        await postCrudApi("api/v1/os", editedProduct)
          .then((data) => {
            if (data) {
              notifyOperatingSystem("add");
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
      setModalOpen(false);
      setEditRow(false);
      resetForm();
    }
  };

  const onCloseClick = () => {
    setModalOpen(false);
    setEditRow(false);
    resetForm();
    setNameError(false);
  };

  const resetForm = () => {
    setName("");
    setStatus(1);
    setParentOsID();
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

  const notifyOperatingSystem = (action) => {
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
  const onParentOSName = (e, { action }) => {
    if (action === "clear") {
      setParentOsID(null);
    } else {
      setParentOsID(e);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="pccContainerOperating">
          <div className="addButtonContainerOperating">
            <button
              type="button"
              className="modalOpenBtnOperating"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          {modalOpen && (
            <div className="productModalOs">
              <div className="modalContainerOs">
                <div className="headerModalOs">
                  <h5 className="headerTitleOs">Operating System</h5>
                  {editRow && (
                    <LanguageDropdown onSelectLanguage={handleSelectLanguage} />
                  )}
                </div>
                <div className="divDisplayOs">
                  <label className="labelClassOs">
                    Operating System Name{" "}
                    <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="text"
                    onChange={HandleNameChange}
                    placeholder="Operating System Name"
                    className="textboxInputOs_1 textInputOs"
                    value={name}
                  />
                  {nameError && <Error message={"Required*"} />}
                </div>
                <div className="statusStockCheckBoxesOs">
                  <div className="divDisplayCheckbox">
                    <label className="labelClassOs">Status</label>
                    <input
                      type="checkbox"
                      onChange={() => setStatus(status === 1 ? 2 : 1)}
                      checked={status === 1}
                      className="modalCheckboxOs"
                    />
                  </div>
                </div>

                <div className="divDisplayOs">
                  <label className="labelClassOs">
                    Parent Operating System
                  </label>
                  <Select
                    onChange={onParentOSName}
                    value={parentOsID}
                    placeholder="Select"
                    maxMenuHeight={150}
                    styles={SelectStyle}
                    isClearable
                    options={data
                      .filter((e) => e.parentOsID === null)
                      .filter((e) => e.status === 1)
                      .filter((e) => e.name !== name)
                      .map((e) => ({
                        label: e.name,
                        value: e.id,
                      }))}
                    className="dropdownInputOs"
                  />
                </div>
                <div className="footerModalOs">
                  {NewOrUpdate === "New" ? (
                    <button
                      type="button"
                      className="modalBtnOperating"
                      onClick={onEditSave}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="modalBtnOperating"
                      onClick={onEditSave}
                    >
                      Update
                    </button>
                  )}
                  <button
                    type="button"
                    className="closeBtnOperating"
                    onClick={onCloseClick}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="tableBodyOperating">
            <div className="tableScrollBodyOs">
              <MUIDataTable
                title={"Operating System"}
                data={data}
                columns={columns}
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
