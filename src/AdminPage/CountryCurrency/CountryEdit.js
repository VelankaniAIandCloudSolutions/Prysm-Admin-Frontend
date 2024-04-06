import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { GrEdit } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import "./CountryEdit.css";
import { toast } from "react-toastify";
import Error from "../../Error/Error";
import LoadingScreen from "../../Loading/Loading";

export default function CountryEdit() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [forexRate, setForexRate] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [addRegion, setaddRegion] = useState(false);
  const [regionStatus, setRegionStatus] = useState(1);
  const [regionName, setRegionName] = useState("");
  const [NewOrUpdate, setNewOrUpdate] = useState("new");
  const [NewOrUpdateCountry, setNewOrUpdateCountry] = useState("new");
  const [countryId, setCountryId] = useState(
    sessionStorage.getItem("countryID")
      ? parseInt(sessionStorage.getItem("countryID"))
      : null
  );
  const [regionId, setRegionId] = useState(null);

  //validation
  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [forExError, setForExError] = useState(false);
  const [regionError, setRegionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (location?.state?.countryId !== null || countryId !== null) {
        const id = location?.state?.countryId
          ? location?.state?.countryId
          : countryId;
        setCountryId(id);
        await getCrudApi(`api/v1/country/${id}`).then((data) => {
          setData(data[0]?.region?.filter((reg) => reg.regionID !== null));
          setName(data[0].countryName);
          setStatus(data[0].isActive);
          setForexRate(data[0].forexRate);
          setCurrencyCode(data[0].currencyCode);
        });
        setNewOrUpdateCountry("update");
      } else {
        setNewOrUpdateCountry("new");
      }
      setIsLoading(false);
    })();
  }, []);

  const columns = [
    {
      name: "EDIT",
      options: {
        filter: false,
        sort: false,
        empty: true,
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
      name: "regionName",
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
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [],
    onChangePage: (currentPage) => {},
  };

  const onAddNewClick = () => {
    setNewOrUpdate("new");
    setaddRegion(true);
    setRegionId(null);
    setRegionName("");
    setRegionStatus(1);
  };
  const onEditClick = (index) => {
    setNewOrUpdate("update");
    setaddRegion(true);
    setRegionId(data[index].regionID);
    setRegionName(data[index].regionName);
    setRegionStatus(data[index].isActive);
  };
  const onCloseClick = () => {
    setaddRegion(false);
    setRegionId(null);
  };

  const validateInput = () => {
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };
    const validateCode = (code) => {
      if (!code?.trim() || !isAlphaNumeric(code)) {
        isValid = false;
        setCodeError(true);
      }
    };
    const validateFoEx = (content) => {
      if (!content) {
        isValid = false;
        setForExError(true);
      }
    };
    let isValid = true;
    validateName(name);
    validateCode(currencyCode);
    validateFoEx(forexRate);
    return isValid;
  };

  const onEditSave = async () => {
    setIsLoading(true);
    setNameError(false);
    setCodeError(false);
    setForExError(false);
    if (validateInput()) {
      let country = {
        isActive: status,
        countryName: name,
        currencyCode: currencyCode,
        forexRate: parseFloat(forexRate),
      };
      if (countryId === null) {
        await postCrudApi("api/v1/country", country)
          .then((res) => {
            if (res) {
              setCountryId(res?.countryID);
              sessionStorage.setItem("countryID", res?.countryID);
              notifyAddOrUpdateCountry("add");
              setNewOrUpdateCountry("update");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      } else {
        await putCrudApi(`api/v1/country/${countryId}`, country)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateCountry("update");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
    }
    setIsLoading(false);
  };

  const validateRegionInput = () => {
    const validateregion = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setRegionError(true);
      }
    };

    let isValid = true;
    validateregion(regionName);
    return isValid;
  };

  const onEditSaveRegion = async () => {
    setIsLoading(true);
    setRegionError(false);
    if (validateRegionInput()) {
      let region = {
        isActive: regionStatus,
        regionName: regionName,
        countryID: countryId,
      };
      if (regionId === null) {
        await postCrudApi("api/v1/region", region)
          .then((res) => {
            if (res) {
              notifyAddOrUpdateCountry("add");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      } else {
        await putCrudApi("api/v1/region/" + regionId, region)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateCountry("update");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
      if (countryId) {
        await getCrudApi("api/v1/country/" + countryId)
          .then((data) => {
            if (data)
              setData(data[0]?.region?.filter((reg) => reg.regionID !== null));
          })
          .catch((error) => {
            notifyError();
          });
      }
      setaddRegion(false);
      setRegionId(null);
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
    let message = "Name  Exists";
    toast.error(message);
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
  const HandleCodeChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setCodeError(true);
    } else {
      setCodeError(false);
    }
    setCurrencyCode(value);
  };

  const HandleFEChange = (e) => {
    const value = e.target.value;
    const isNumeric = (input) => /^[0-9.]+$/.test(input);
    if (!value?.trim() || !isNumeric(value)) {
      setForExError(true);
    } else {
      setForExError(false);
    }
    setForexRate(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="pccContainerCountryEdit">
          <div className="country_inputfields">
            <div className="divDisplayCountry">
              <label className="labelClassCountry">
                Name <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>

              <input
                type="text"
                placeholder="Name"
                onChange={HandleNameChange}
                value={name}
                className="textboxInputCountry_1 textInputCountry"
              />
              {nameError && <Error message={"Required*"} />}
            </div>
            <div className="divDisplayCountry">
              <label className="labelClassCountry">
                Currency Code <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>
              <input
                type="text"
                placeholder="Code"
                onChange={HandleCodeChange}
                value={currencyCode}
                className="textboxInputCountry_1 textInputCountry"
              />
              {codeError && <Error message={"Required*"} />}
            </div>

            <div className="divDisplayCountry">
              <label className="labelClassCountry">
                Foreign Exchange Rate{" "}
                <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>

              <input
                type="text"
                placeholder="Exchange Rate"
                onChange={HandleFEChange}
                value={forexRate}
                className="textboxInputCountry_1 textInputCountry"
              />
              {forExError && <Error message={"Required*"} />}
            </div>
            <div>
              <label className="labelClassCountryStatus">Status</label>

              <input
                type="checkbox"
                onChange={() => setStatus(status === 1 ? 2 : 1)}
                checked={status === 1}
                className="modalCheckboxCountry"
              />
            </div>
            <div className="footerModalCountry">
              {NewOrUpdateCountry === "new" ? (
                <button
                  type="button"
                  className="ModalBtnAddCountry"
                  onClick={onEditSave}
                >
                  Add
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="ModalBtnAddCountry"
                    onClick={onEditSave}
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
          {countryId !== null ? (
            <div className="region-header">
              <div className="region-title">
                <h2>Regions</h2>
              </div>
              <div className="addButtonContainerCountry">
                <button
                  type="button"
                  className="modalOpenBtnCountry"
                  onClick={onAddNewClick}
                >
                  Add
                </button>
              </div>
              <div className="tableBodyCountry">
                <div className="tableSrollCountry">
                  <MUIDataTable
                    title={"Region"}
                    data={data}
                    columns={columns}
                    options={options}
                    className="muitable"
                  />
                </div>
              </div>
              <div>
                {addRegion ? (
                  <div className="productModalCountry">
                    <div className="admin-all-modal">
                      <div className="modalContentCountry regionModalWidthClassCountry">
                        <div className="headerModalCountry">
                          <h5 className="headerTitleCountry">Region</h5>
                        </div>
                        <div className="imagesAndFieldsCountry">
                          <div className="regionInputFields">
                            <div className="divDisplayCountryModal">
                              <label className="labelClassCountry">
                                Region Name {""}
                                <i className="fa fa-asterisk aster-risk-Icon"></i>
                              </label>
                              <input
                                type="text"
                                placeholder="Region Name"
                                onChange={(e) => {
                                  setRegionName(e.target.value);
                                }}
                                value={regionName}
                                className="textboxInputCountryAdd_1 textInputCountry"
                              />
                              {regionError && <Error message={"Required*"} />}
                            </div>
                            <div className="divDisplayCountryStatus">
                              <div className="modalCheckboxDivCountry">
                                <label className="checkBoxLabelClassCountry">
                                  Status
                                </label>
                                <input
                                  type="checkbox"
                                  className="modalCheckboxCountry"
                                  onChange={() =>
                                    setRegionStatus(regionStatus === 1 ? 2 : 1)
                                  }
                                  checked={regionStatus === 1}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="footerModalCountry">
                          {NewOrUpdate === "new" ? (
                            <button
                              type="button"
                              className="ModalBtnAddCountry"
                              onClick={onEditSaveRegion}
                            >
                              Add
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="ModalBtnAddCountry"
                                onClick={onEditSaveRegion}
                              >
                                Update
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="CloseBtnCountry"
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
          ) : null}
        </div>
      )}
    </>
  );
}
