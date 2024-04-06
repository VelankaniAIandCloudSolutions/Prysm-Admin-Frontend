import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Language.css";

export default function Language() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [langName, setLangName] = useState("");
  const [langCode, setLangCode] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(2);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [updateUI, setUpdateUI] = useState(false);
  const [data, setData] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    getAllLang();
  }, [updateUI]);
  const getAllLang = async () => {
    await getCrudApi("api/v1/lang", {}).then((data) => {
      setData(data);
    });
  };

  const validateInput = () => {
    const isLanguageCodePattern = (input) =>
      /^[a-zA-Z]{2,3}(-[a-zA-Z]{4}(-[a-zA-Z]{2,8})?)?$/.test(input);
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };

    const validateLangCode = (langCode) => {
      if (!langCode.trim() || !isLanguageCodePattern(langCode.trim())) {
        isValid = false;
        setCodeError(true);
      }
    };

    let isValid = true;

    validateName(langName);
    validateLangCode(langCode);

    return isValid;
  };

  const columns = [
    {
      name: "EDIT",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => (
          <button
            onClick={() => onEditClick(tableMeta.rowIndex)}
            className="tableEditButton"
          >
            <GrEdit />
          </button>
        ),
      },
    },
    {
      name: "langName",
      label: "LANGUAGE NAME",
    },
    {
      name: "langCode",
      label: "LANGUAGE CODE",
    },
    {
      name: "description",
      label: "DESCRIPTION",
    },
    {
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
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
    page: 0,
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
    setSelectedRowIndex(rowIndex);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setLangName(selectedProduct.langName);
    setLangCode(selectedProduct.langCode);
    setDescription(selectedProduct.description);
    setIsActive(selectedProduct.isActive);
  };

  const onEditSave = async () => {
    setNameError(false);
    setCodeError(false);
    if (validateInput()) {
      const editedProduct = {
        langName: langName,
        langCode: langCode,
        isActive: isActive === 1 ? 1 : 2,
        description: description,
      };

      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/lang/${data[selectedRowIndex].langId}`,
          editedProduct
        )
          .then((data) => {
            if (data) {
              notifyLanguage("update");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      } else {
        await postCrudApi("api/v1/lang/", editedProduct)
          .then((data) => {
            if (data) {
              notifyLanguage("add");
            } else {
              toast.error("Operation was not performed");
            }
            setUpdateUI(!updateUI);
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }

      setModalOpen(false);
      resetForm();
    }
  };

  const onCloseClick = () => {
    setModalOpen(false);
    resetForm();
    setNameError(false);
    setCodeError(false);
  };

  const resetForm = () => {
    setLangName("");
    setLangCode("");
    setDescription("");
    setIsActive(2);
  };

  const notifyLanguage = (action) => {
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
    setLangName(value);
  };

  const HandleCodeChange = (e) => {
    const value = e.target.value;
    const isLanguageCodePattern = (input) =>
      /^[a-zA-Z]{2,3}(-[a-zA-Z]{4}(-[a-zA-Z]{2,8})?)?$/.test(input);
    if (!value.trim() || !isLanguageCodePattern(value)) {
      setCodeError(true);
    } else {
      setCodeError(false);
    }
    setLangCode(value);
  };

  return (
    <div className="pccContainerlanguage">
      <div className="AddButtonContainerLanguage">
        <button
          type="button"
          className="modalOpenBtnLanguage"
          onClick={onAddNewClick}
        >
          Add
        </button>
      </div>
      {modalOpen && (
        <div className="productModalLanguage">
          <div className="modalContainerLanguage">
            <div className="headerModalLanguage">
              <h5 className="headerTitleLanguage">Language</h5>
            </div>
            <div className="divDisplayLanguage">
              <label className="labelClassLanguage">
                Language Name <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>
              <input
                type="text"
                onChange={HandleNameChange}
                placeholder="Language Name"
                className="textboxInputLanguage_1 textInputLanguage"
                value={langName}
              />
              {nameError && <Error message={"Required*"} />}
            </div>

            <div className="divDisplayLanguage">
              <label className="labelClassLanguage">Language Description</label>
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Language Description"
                className="textboxInputLanguage_1 textInputLanguage"
                value={description}
              />
            </div>

            <div className="divDisplayLanguage">
              <label className="labelClassLanguage">
                Language Code <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>
              <input
                type="text"
                onChange={HandleCodeChange}
                placeholder="Language Code"
                className="textboxInputLanguage_1 textInputLanguage"
                value={langCode}
              />
              {codeError && <Error message={"Required*"} />}
            </div>

            <div className="status_stock_checkBoxes">
              <div className="languageDiv_checkbox">
                <label className="labelClassLanguage">Status</label>
                <input
                  type="checkbox"
                  onChange={() => setIsActive(isActive === 1 ? 2 : 1)}
                  checked={isActive === 1}
                  className="modalCheckbox"
                />
              </div>
            </div>

            <div className="footerModalLanguage">
              {NewOrUpdate === "New" ? (
                <button
                  type="button"
                  className="Modal-btnLanguage"
                  onClick={onEditSave}
                >
                  Add
                </button>
              ) : (
                <button
                  type="button"
                  className="Modal-btnLanguage"
                  onClick={onEditSave}
                >
                  Update
                </button>
              )}
              <button
                type="button"
                className="closeBtnLanguage"
                onClick={onCloseClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="TableBodyLanguage">
        <div className="tableScrollLanguage">
          <MUIDataTable
            title={"Language"}
            data={data}
            columns={columns}
            options={options}
            className="muitable"
          />
        </div>
      </div>
    </div>
  );
}
