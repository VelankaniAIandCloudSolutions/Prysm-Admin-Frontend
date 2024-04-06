import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import Error from "../../Error/Error";
import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import Select from "react-select";
import { toast } from "react-toastify";
import "./AdminTax.css";
import LoadingScreen from "../../Loading/Loading";

export default function AdminTax() {
  const [data, setData] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isActive, setIsActive] = useState(1);
  const [taxName, setTaxName] = useState("");
  const [taxPercentage, setTaxPercentage] = useState();
  const [note, setNote] = useState("");
  const [countryID, setCountryID] = useState(null);
  const [regionID, setRegionID] = useState(null);
  const [NewOrUpdate, setNewOrUpdate] = useState("new");
  const [taxId, setTaxId] = useState(null);
  const [addClicked, setAddClicked] = useState(false);
  const [updateUI, setUpdateUI] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getCrudApi("api/v1/tax", {}).then((data) => {
        setData(data);
      });
    })();
    setIsLoading(false);
  }, [updateUI]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getCrudApi("api/v1/country").then((data) => {
        setCountryOptions(data);
      });
      await getCrudApi("api/v1/region").then((data) => {
        setRegionOptions(data);
      });
    })();
    setIsLoading(false);
  }, []);

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

  const validateInput = () => {
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    const validateName = (name) => {
      if (name?.trim() === "" || !isAlphaNumeric(name)) {
        isValid = false;
        setNameError(true);
      }
    };
    const validateCountry = (ctry) => {
      if (!ctry) {
        isValid = false;
        setCountryError(true);
      }
    };

    const validatePercentage = (pge) => {
      const isNumeric = (input) => /^[0-9.\s]+$/.test(input);
      if (!isNumeric(pge)) {
        isValid = false;
        setPercentageError(true);
      }
    };
    let isValid = true;
    validateName(taxName);
    validateCountry(countryID);
    validatePercentage(taxPercentage);
    return isValid;
  };

  const onEditSave = () => {
    setIsLoading(true);
    setPercentageError(false);
    setCountryError(false);
    setNameError(false);

    if (validateInput()) {
      const editedProduct = {
        taxName: taxName,
        note: note,
        taxPercentage: parseFloat(taxPercentage),
        isActive: isActive,
        countryID: countryID,
        regionID: regionID,
      };
      postCrudApi("api/v1/tax", editedProduct)
        .then((data) => {
          if (data) {
            setTaxId(data.taxID);
            notifyAddOrUpdateCountry("add");
            setNewOrUpdate("update");
            setUpdateUI(!updateUI);
          }
        })
        .catch((error) => {
          notifyError();
        });
      setAddClicked(false);
    }
    setIsLoading(false);
  };

  const onUpdate = async () => {
    setIsLoading(true);
    setPercentageError(false);
    setCountryError(false);
    setNameError(false);

    if (validateInput()) {
      const editedProduct = {
        taxName: taxName,
        note: note,
        taxPercentage: parseFloat(taxPercentage),
        isActive: isActive,
        countryID: countryID,
        regionID: regionID,
      };

      await putCrudApi("api/v1/tax/" + taxId, editedProduct)
        .then((data) => {
          if (data) {
            notifyAddOrUpdateCountry("update");
            setUpdateUI(!updateUI);
          }
        })
        .catch((error) => {
          notifyError();
        });
      setAddClicked(false);
    }
    setIsLoading(false);
  };

  const notifyAddOrUpdateCountry = (action) => {
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
  const notifyError = () => {
    let message = "Tax Name Exists";
    toast.error(message);
  };
  const getRegionOptions = () => {
    let abc = regionOptions
      ?.filter((e) => e.isActive === 1)
      ?.filter((e) => e.countryID === countryID);
    return abc.map((e) => ({
      label: e.regionName,
      value: e.regionID,
    }));
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
      name: "taxName",
      label: "TAX NAME",
    },
    {
      name: "taxPercentage",
      label: "TAX PERCENTAGE",
    },
    {
      name: "note",
      label: "NOTE",
    },
    {
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "countryID",
      label: "COUNTRY ID",
      options: {
        customBodyRender: (value) => {
          const ctryID = countryOptions.find(
            (item) => item.countryID === value
          )?.countryName;
          return ctryID || null;
        },
      },
    },
    {
      name: "regionID",
      label: "REGION ID",
      options: {
        customBodyRender: (value) => {
          const regID = regionOptions.find(
            (item) => item.regionID === value
          )?.regionName;
          return regID || null;
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
    setAddClicked(true);
    setNewOrUpdate("new");

    setNote("");
    setTaxName("");
    setCountryID(null);
    setRegionID(null);
    setTaxPercentage("");
    setIsActive(1);
  };
  const onEditClick = (rowIndex) => {
    setAddClicked(true);
    setNewOrUpdate("Update");
    const selectedProduct = data[rowIndex];
    setTaxId(selectedProduct.taxID);
    setNote(selectedProduct.note);
    setTaxName(selectedProduct.taxName);
    setCountryID(selectedProduct.countryID);
    setRegionID(selectedProduct.regionID);
    setTaxPercentage(selectedProduct.taxPercentage);
    setIsActive(selectedProduct.isActive);
  };

  const onCloseClick = () => {
    setAddClicked(false);
    setNameError(false);
    setPercentageError(false);
    setCountryError(false);
  };

  const HandleTaxNameChange = (e) => {
    const value = e.target.value;
    setTaxName(value);
  };

  const HandleTaxPercentageChange = (e) => {
    const value = e.target.value;
    const isNumeric = (input) => /^[0-9.\s]+$/.test(input);
    if (value?.trim() === "" || !isNumeric(value)) {
      setPercentageError(true);
    } else {
      setPercentageError(false);
    }
    setTaxPercentage(value);
  };

  const HandleNoteChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
    } else {
    }
    setNote(value);
  };

  const HandleCountryChange = (e) => {
    const ctry = e?.value;
    if (!ctry) {
      setCountryError(true);
    } else {
      setCountryError(false);
    }
    setCountryID(e?.value);
  };

  const HandleRegionChange = (e) => {
    if (e === null) {
      setRegionID(null);
    } else {
      setRegionID(e?.value);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="pccContainerAdminTax">
          <div className="addButtonContainerAdminTax">
            <button
              type="button"
              className="modalOpenBtnAdminTax"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          {addClicked ? (
            <div className="productTax-Modal ">
              <div className="productTax-modalContainer">
                <div className="productTax-header-modal">
                  <h5 className="productTax-header-title"> Tax</h5>
                </div>
                <div className="adminTaxInputs">
                  <div className="divDisplayAdminTax">
                    <label className="labelClassAdminTax">
                      Tax Name <i class="fa fa-asterisk aster-risk-Icon" />
                    </label>
                    <input
                      type="text"
                      onChange={HandleTaxNameChange}
                      placeholder="Tax Name"
                      className="textboxInputAdminTax_1 textInputAdminTax"
                      value={taxName}
                    />
                    {nameError && (
                      <Error className="AdminTaxError" message={"Required*"} />
                    )}
                  </div>

                  <div className="divDisplayAdminTax">
                    <label className="labelClassAdminTax">
                      Tax Percentage{" "}
                      <i class="fa fa-asterisk aster-risk-Icon" />
                    </label>
                    <input
                      type="text"
                      onChange={HandleTaxPercentageChange}
                      placeholder="Tax Percentage"
                      className="textboxInputAdminTax_1 textInputAdminTax"
                      value={taxPercentage}
                    />
                    {percentageError && (
                      <Error className="AdminTaxError" message={"Required*"} />
                    )}
                  </div>

                  <div className="divDisplayAdminTax">
                    <label className="labelClassAdminTax">Note</label>
                    <input
                      type="text"
                      onChange={HandleNoteChange}
                      placeholder="Note"
                      className="textboxInputAdminTax_1 textInputAdminTax"
                      value={note}
                    />
                  </div>

                  <div className="statusStockCheckBoxesAdminTax">
                    <div className="divDisplayCheckbox">
                      <label className="labelClassAdminTax">Status</label>
                      <input
                        type="checkbox"
                        onChange={() => setIsActive(isActive === 1 ? 2 : 1)}
                        checked={isActive === 1}
                        className="modalCheckboxAdminTax"
                      />
                    </div>
                  </div>
                  <div className="divDisplayAdminTax">
                    <label className="labelClassAdminTax">
                      {" "}
                      Country <i class="fa fa-asterisk aster-risk-Icon" />
                    </label>

                    <Select
                      className="dropdownInputAdminTax"
                      placeholder="Country Name"
                      onChange={HandleCountryChange}
                      maxMenuHeight={150}
                      value={countryOptions
                        ?.filter((e) => e.countryID === countryID)
                        ?.map((e) => ({
                          label: e.countryName,
                          value: e.countryID,
                        }))}
                      isClearable={true}
                      styles={SelectStyle}
                      options={countryOptions
                        ?.filter((e) => e.isActive === 1)
                        ?.map((e) => ({
                          label: e.countryName,
                          value: e.countryID,
                        }))}
                    />
                    {countryError && (
                      <Error className="AdminTaxError" message={"Required*"} />
                    )}
                  </div>

                  <div className="divDisplayAdminTax">
                    <label className="labelClassAdminTax"> Region </label>

                    <Select
                      className="dropdownInputAdminTax"
                      placeholder="Region Name"
                      onChange={(e) => HandleRegionChange(e)}
                      value={regionOptions
                        .filter((e) => e.regionID === regionID)
                        .map((e) => ({
                          label: e.regionName,
                          value: e.regionID,
                        }))}
                      isClearable={true}
                      styles={SelectStyle}
                      isDisabled={countryID ? false : true}
                      options={getRegionOptions()}
                    />
                  </div>
                  <div className="footerModalAdminTax">
                    {NewOrUpdate === "new" ? (
                      <button
                        type="button"
                        className="modalBtnAdminTax"
                        onClick={onEditSave}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="modalBtnAdminTax"
                        onClick={onUpdate}
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
            </div>
          ) : null}

          <div className="tableBodyAdminTax">
            <div className="tableScrollAdminTax">
              <MUIDataTable
                title={"Tax"}
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
