import React, { useState, useEffect } from "react";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import Select from "react-select";
import { useLocation } from "react-router-dom/dist";
import { toast } from "react-toastify";
import "./AdminTax.css";
import Error from "../../Error/Error";
import LoadingScreen from "../../Loading/Loading";

export default function AdminTaxDetails() {
  const [isActive, setIsActive] = useState(2);
  const [taxName, setTaxName] = useState("");
  const [taxPercentage, setTaxPercentage] = useState();
  const [note, setNote] = useState("");
  const [countryID, setCountryID] = useState(null);
  const [regionID, setRegionID] = useState(null);
  const [NewOrUpdate, setNewOrUpdate] = useState("new");
  const [taxId, setTaxId] = useState(null);
  const location = useLocation();

  const [countryOptions, setCountryOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  //validations
  const [nameError, setNameError] = useState(false);
  const [noteError, setNoteError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getCrudApi("api/v1/country").then((data) => {
        setCountryOptions(data);
      });
      await getCrudApi("api/v1/region").then((data) => {
        setRegionOptions(data);
      });
      if (location?.state?.taxId) {
        setTaxId(location?.state?.taxId);
        await getCrudApi(`api/v1/tax/${location?.state?.taxId}`, {})?.then(
          (item) => {
            setNewOrUpdate("update");
            setNote(item[0].note);
            setTaxName(item[0].taxName);
            setCountryID(item[0].countryID);
            setRegionID(item[0].regionID);
            setTaxPercentage(item[0].taxPercentage);
            setIsActive(item[0].isActive);
          }
        );
      } else {
        setNewOrUpdate("new");
      }
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
      if (!name?.trim() || !name) {
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
    const validateState = (content) => {
      if (!content) {
        isValid = false;
        setStateError(true);
      }
    };
    const validateNote = (nte) => {
      if (!nte?.trim() || !isAlphaNumeric(nte)) {
        isValid = false;
        setNoteError(true);
      }
    };
    const validatePercentage = (pge) => {
      if (!pge) {
        isValid = false;
        setPercentageError(true);
      }
    };
    let isValid = true;
    validateName(taxName);
    validateState(regionID);
    validateNote(note);
    validateCountry(countryID);
    validatePercentage(taxPercentage);
    return isValid;
  };

  const onEditSave = () => {
    setIsLoading(true);
    setPercentageError(false);
    setNoteError(false);
    setStateError(false);
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
          }
        })
        .catch((error) => {
          notifyError();
        });
    }
    setIsLoading(false);
  };

  const onUpdate = async () => {
    setIsLoading(true);
    setPercentageError(false);
    setNoteError(false);
    setStateError(false);
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
          }
        })
        .catch((error) => {
          notifyError();
        });
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
    let message = "Error Occurred";
    toast.error(message);
  };
  const getRegionOptions = () => {
    let abc = regionOptions.filter((e) => e.countryID === countryID);
    return abc.map((e) => ({
      label: e.regionName,
      value: e.regionID,
    }));
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="adminTaxContainer">
          <div className="adminTaxInputs">
            <div className="divDisplayAdminTax">
              <label className="labelClassAdminTax">
                Tax Name <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={(e) => setTaxName(e.target.value)}
                placeholder="Tax Name"
                className="textboxInputAdminTax_1 textInputAdminTax"
                value={taxName}
              />
              {nameError && <Error message={"Required*"} />}
            </div>

            <div className="divDisplayAdminTax">
              <label className="labelClassAdminTax">
                Tax Percentage <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={(e) => setTaxPercentage(e.target.value)}
                placeholder="Tax Percentage"
                className="textboxInputAdminTax_1 textInputAdminTax"
                value={taxPercentage}
              />
              {percentageError && <Error message={"Required*"} />}
            </div>

            <div className="divDisplayAdminTax">
              <label className="labelClassAdminTax">
                Note <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                className="textboxInputAdminTax_1 textInputAdminTax"
                value={note}
              />
              {noteError && <Error message={"Required*"} />}
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
              <label className="labelClassAdminTax"> Country</label>

              <Select
                className="dropdownInputAdminTax"
                placeholder="Country Name"
                onChange={(e) => setCountryID(e?.value)}
                value={countryOptions
                  .filter((e) => e.countryID === countryID)
                  .map((e) => ({
                    label: e.countryName,
                    value: e.countryID,
                  }))}
                isClearable={true}
                styles={SelectStyle}
                options={countryOptions.map((e) => ({
                  label: e.countryName,
                  value: e.countryID,
                }))}
              />
              {countryError && <Error message={"Required*"} />}
            </div>

            <div className="divDisplayAdminTax">
              <label className="labelClassAdminTax"> Region</label>

              <Select
                className="dropdownInputAdminTax"
                placeholder="Region Name"
                onChange={(e) => setRegionID(e?.value)}
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
              {stateError && <Error message={"Required*"} />}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
