import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDocumentCategory.css";
import LoadingScreen from "../../Loading/Loading";

export default function ProductDocumentCategory() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [updateUI, setUpdateUI] = useState(false);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const [nameError, setNameError] = useState(false);

  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllDocumentCategory();
      setIsLoading(false);
    })();
  }, [updateUI]);

  const getAllDocumentCategory = async () => {
    await getCrudApi("api/v1/product_document_category", {}).then((data) => {
      setData(data);
    });
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name.trim() || !name) {
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
              onEditClick(tableMeta.currentTableData[tableMeta.rowIndex]?.index)
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
      label: "NAME",
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
    setIsActive(selectedProduct.isActive);
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
        isActive: isActive === 1 ? 1 : 2,
      };

      if (selectedRowIndex !== null) {
        await putCrudApi(
          `api/v1/product_document_category/
          ${data[selectedRowIndex].productDocumentCategoryID}`,
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
        await postCrudApi("api/v1/product_document_category", editedProduct)
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
    setIsActive(1);
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
    if (!value?.trim() || !isAlphaNumeric(value)) {
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
        <div className="ContainerDocCategory">
          <div className="addButtonContainerDocCategory">
            <button
              type="button"
              className="modalOpenBtnDocCategory"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          {modalOpen && (
            <div className="productModalDocCategory">
              <div className="modalContainerDocCategory">
                <div className="headerModalDocCategory">
                  <h5 className="headerTitleDocCategory">
                    Product Document Category
                  </h5>
                  {editRow && (
                    <LanguageDropdown onSelectLanguage={handleSelectLanguage} />
                  )}
                </div>
                <div className="divDisplayDocCategory">
                  <label className="labelClassDocCategory">
                    Name
                    <i class="fa fa-asterisk aster-risk-Icon" />
                  </label>
                  <input
                    type="text"
                    onChange={HandleNameChange}
                    placeholder="Name"
                    className="textboxInputDocCategory_1 textInputDocCategory"
                    value={name}
                  />
                  {nameError && <Error message={"Required*"} />}
                </div>
                <div className="statusStockCheckBoxesDocCategory">
                  <div className="divDisplayCheckboxDocCategory">
                    <label className="labelClassDocCategory">Status</label>
                    <input
                      type="checkbox"
                      onChange={() => setIsActive(isActive === 1 ? 2 : 1)}
                      checked={isActive === 1}
                      className="modalCheckboxDocCategory"
                    />
                  </div>
                </div>
                <div className="footerModalDocCategory">
                  {NewOrUpdate === "New" ? (
                    <button
                      type="button"
                      className="modalBtnDocCategory"
                      onClick={onEditSave}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="modalBtnDocCategory"
                      onClick={onEditSave}
                    >
                      Update
                    </button>
                  )}
                  <button
                    type="button"
                    className="closeBtnDocCategory"
                    onClick={onCloseClick}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="tableBodyDocCategory">
            <div className="tableScrollBodyDocCategory">
              <MUIDataTable
                title={"Product Document Category"}
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
