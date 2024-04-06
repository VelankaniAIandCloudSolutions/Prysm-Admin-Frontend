import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import "./ProductTags.css";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import Select from "react-select";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import Error from "../../Error/Error";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../Loading/Loading";

export default function ProductTag() {
  const [addClicked, setAddClicked] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [name, setName] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isActive, setIsActive] = useState(1);
  const [NewOrUpdate, setNewOrUpdate] = useState("");
  const [productCategoryID, setProductCategoryID] = useState();
  const [productTagCategoryID, setProductTagCategoryID] = useState();
  const [updateUI, setUpdateUI] = useState(false);
  const [data, setData] = useState([]);
  const [prodCatdata, setProdCatdata] = useState();
  // Validation
  const [nameError, setNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getAllProductTags();
      await getAllProductCategory();
    })();
    setIsLoading(false);
  }, [updateUI]);

  const getAllProductTags = async () => {
    await getCrudApi("api/v1/product_tag", {}).then((dta) => {
      setData(dta);
    });
  };
  const getAllProductCategory = async () => {
    await getCrudApi("api/v1/product_category", {}).then((dta) => {
      setProdCatdata(dta);
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

  const onEditSave = async () => {
    setIsLoading(true);
    setNameError(false);
    if (validateInput()) {
      let ProdTagJson = {
        name: name,
        isActive: isActive === 1 ? 1 : 2,
        productTagCategoryID: productTagCategoryID?.value,
        productCategoryID: productCategoryID?.value,
      };

      if (selectedRowIndex !== null) {
        // Update existing product
        await putCrudApi(
          `api/v1/product_tag/${data[selectedRowIndex].productTagID}`,
          ProdTagJson
        )
          .then((data) => {
            if (data) {
              notifyProductCTags("update");
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
        setData((prevData) => [...prevData, ProdTagJson]);
        await postCrudApi("api/v1/product_tag", ProdTagJson)
          .then((data) => {
            if (data) {
              notifyProductCTags("add");
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
    setName(selectedProduct.name);
    setIsActive(selectedProduct.isActive);
    selectedProduct.productTagCategoryID
      ? setProductTagCategoryID({
          value: selectedProduct.productTagCategoryID,
          label: data?.find(
            (item) =>
              item?.productTagID === selectedProduct.productTagCategoryID
          )?.name,
        })
      : setProductTagCategoryID();
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
      name: "ProductTage ID",
      label: "ProductTage ID",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "name",
      label: "NAME",
    });
    columnsArray.push({
      name: "ParentTagID",
      label: "ParentTagID",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "productTagCategoryID",
      label: "PARENT TAG NAME",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const productTagName = data.find(
            (item) => item.productTagID === value
          )?.name;
          return productTagName || null;
        },
      },
    });

    columnsArray.push({
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    });
    columnsArray.push({
      name: "status_id",
      label: "Status ID",
      options: {
        display: false,
      },
    });
    return columnsArray;
  };

  const onAddNewClick = () => {
    setNewOrUpdate("New");
    setName("");
    setIsActive(1);
    setProductCategoryID();
    setProductTagCategoryID();
    setAddClicked(true);
  };
  const onCloseClick = () => {
    setAddClicked(false);
    setEditRow(false);
    setNameError(false);
  };

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const notifyProductCTags = (action) => {
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
        <div className="productTags-container">
          <div className="productTags-add-button-container">
            <button
              type="button"
              className="productTags-modal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <div>
            {addClicked ? (
              <div className="productTags-Modal ">
                <div className="productTags-modalContainer">
                  <div className="productTags-header-modal">
                    <h5 className="productTags-header-title">Product Tags</h5>
                    {editRow && (
                      <LanguageDropdown
                        onSelectLanguage={handleSelectLanguage}
                      />
                    )}
                  </div>
                  <div className="productTags-Inputsfields">
                    <label className="productTags-label-class">
                      Name
                      <i className="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="text"
                      onChange={HandleNameChange}
                      placeholder=" Name"
                      className="productTags-textbox-input"
                      value={name}
                    />
                    {nameError && <Error message={"Required*"} />}
                  </div>
                  <div className="productTags-Inputsfields">
                    <label className="productTags-label-class">
                      {" "}
                      Category Name{" "}
                    </label>

                    <Select
                      className="productTags-dropdown-input "
                      placeholder="Category Name"
                      onChange={(e) => setProductCategoryID(e)}
                      value={productCategoryID}
                      maxMenuHeight={150}
                      isClearable={true}
                      styles={SelectStyle}
                      options={
                        prodCatdata.length > 0
                          ? prodCatdata
                              ?.filter((e) => e.isActive === 1)
                              ?.map((e) => ({
                                label: e.name,
                                value: e.productCategoryID,
                              }))
                          : prodCatdata?.map((e) => ({
                              label: e.name,
                              value: e.productCategoryID,
                            }))
                      }
                    />
                  </div>

                  <div className="productTags-Inputsfields">
                    <label className="productTags-label-class">
                      Parent Name
                    </label>

                    <Select
                      className="productTags-dropdown-input "
                      placeholder="Parent Name"
                      onChange={(e) => setProductTagCategoryID(e)}
                      value={productTagCategoryID}
                      styles={SelectStyle}
                      isClearable={true}
                      maxMenuHeight={150}
                      options={data
                        ?.filter((e) => e.productTagCategoryID === null)
                        ?.filter((e) => e.isActive === 1)
                        ?.map((e) => ({
                          label: e.name,
                          value: e.productTagID,
                        }))}
                    />
                  </div>
                  <div className="productTags-Inputsfields">
                    <div className="productTags-modal-checkbox-div ">
                      <label className="checkBox_label-class">Status</label>
                      <input
                        className="productTags-modalCheckbox"
                        type="checkbox"
                        checked={isActive === 1}
                        onChange={() => setIsActive(isActive === 1 ? 2 : 1)}
                      />
                    </div>
                  </div>

                  <div className="productTags-footer-modal">
                    {NewOrUpdate === "New" ? (
                      <button
                        type="button"
                        className="productTags-Modal-btn"
                        onClick={onEditSave}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="productTags-Add-btn"
                        onClick={onEditSave}
                      >
                        Update
                      </button>
                    )}
                    <button
                      type="button"
                      className="productTags-close-btn"
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
                title={"Product Tags"}
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
