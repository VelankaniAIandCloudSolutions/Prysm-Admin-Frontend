import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import {
  getCrudShopApi,
  postCrudShopApi,
  updateCrudShopApi,
} from "../../webServices/webServices";
import "./Customer.css";
import { useLocation } from "react-router-dom";

const CustomerForms = ({ onClose, isModal }) => {
  const [customerType, setCustomerType] = useState("Business");
  const [primaryContact, setPrimaryContact] = useState({
    firstName: "",
    lastName: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [confirmEmailPassword, setConfirmEmailPassword] = useState("");
  const [selectedSection, setSelectedSection] = useState("general");
  const [currencies, setCurrencies] = useState("");
  const [regions, setRegions] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [countryId, setCountryId] = useState("");
  const [edit, setEdit] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [supervisorId, setSupervisorId] = useState(0);
  const [userIsStaff, setUserIsStaff] = useState(0);
  const [userIsActive, setUserIsActive] = useState(1);

  const [formData, setFormData] = useState({
    gstTreatment: "",
    gstinUIN: "",
    businessLegalName: "",
    businessTradeName: "",
    pan: "",
    currency: "",
    taxPreference: "Taxable",
    placeOfSupply: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    phoneNumber: "",
  });
  const [remarks, setRemarks] = useState("");
  const [showAllErrors, setShowAllErrors] = useState(false);

  const location = useLocation();
  const { selectedCustomer } = location.state || {};

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!selectedCustomer || !selectedCustomer.id) {
        return;
      }

      try {
        const response = await getCrudShopApi(
          `/accounts/get_customer_by_id/${selectedCustomer.id}`
        );
        console.log("Customer Data:", response);
        setCustomerData(response);
      } catch (error) {
        console.error("Error retrieving customer data:", error);
      }
    };

    fetchCustomerData();

    fetchAllList();
    prefillFormData();
  }, [selectedCustomer]);

  const showContent = (section) => {
    setSelectedSection(section);
  };

  const handleAddRow = () => {
    const emptyRow = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
      mobileNumber: "",
      skype: "",
      designation: "",
      department: "",
    };
    setRowData([...rowData, emptyRow]);
  };

  const prefillFormData = async () => {
    if (!customerData || !customerData.customer || !customerData.addresses) {
      return;
    }
    setPrimaryContact({
      firstName: customerData.customer.contact_persons[0].first_name,
      lastName: customerData.customer.contact_persons[0].last_name,
    });

    setFormData({
      gstTreatment: customerData.customer.gst_treatment,
      businessLegalName: customerData.customer.business_legal_name,
      businessTradeName: customerData.customer.business_trade_name,
      pan: customerData.customer?.pan,
      gstinUIN: customerData.customer.gstin_uin,
      taxPreference: customerData.customer.tax_preference,
      file: null,
    });

    setRemarks(customerData.customer.remarks);
    setCompanyName(customerData.customer.user.first_name);
    setCustomerEmail(customerData.customer.user.email);
    setCustomerPhoneNumber(customerData.customer.user.phone_number);
    setCustomerType(customerData.customer.customer_type);
    // setSelectedPaymentTerm(customerData.selectedPaymentTerm);
    // setAdvancePercentage(null);

    const formattedContactPersons = selectedCustomer.contact_persons.map(
      (person) => ({
        firstName: person.first_name || "",
        lastName: person.last_name || "",
        emailAddress: person.email_address || "",
        phoneNumber: person.phone_number || "",
        mobileNumber: person.mobile_number || "",
        skype: person.skype || "",
        designation: person.designation || "",
        department: person.department || "",
      })
    );

    setRowData(formattedContactPersons);

    let billingAddress = null;
    let shippingAddress = null;

    for (const address of customerData.addresses) {
      if (address.address_type === "billing") {
        billingAddress = address;
      } else if (address.address_type === "shipping") {
        shippingAddress = address;
      }
    }

    setShippingAddress({
      address: shippingAddress?.street_address_1 || "",
      city: shippingAddress?.city || "",
      zipcode: shippingAddress?.postal_code || "",
      phoneNumber: shippingAddress?.phone_number || "",
    });

    setBillingAddress({
      address: billingAddress?.street_address_1 || "",
      city: billingAddress?.city || "",
      zipcode: billingAddress?.postal_code || "",
      phoneNumber: billingAddress?.phone_number || "",
    });
  };

  const generateColumns = () => {
    return [
      {
        name: "firstName",
        label: "First Name",
        options: {
          filter: true,
          sort: true,
          width: 150,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].firstName}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "firstName", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "lastName",
        label: "Last Name",
        options: {
          filter: true,
          sort: true,
          width: 150,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].lastName}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "lastName", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "emailAddress",
        label: "Email Address",
        options: {
          filter: true,
          sort: true,
          width: 250,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].emailAddress}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "emailAddress", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        options: {
          filter: true,
          sort: true,
          width: 180,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].phoneNumber}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "phoneNumber", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        options: {
          filter: true,
          sort: true,
          width: 180,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].mobileNumber}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "mobileNumber", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "skype",
        label: "Skype Name/Number",
        options: {
          filter: true,
          sort: true,
          width: 200,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].skype}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "skype", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "designation",
        label: "Designation",
        options: {
          filter: true,
          sort: true,
          width: 180,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].designation}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "designation", e.target.value)
                }
              />
            );
          },
        },
      },
      {
        name: "department",
        label: "Department",
        options: {
          filter: true,
          sort: true,
          width: 180,
          customBodyRenderLite: (dataIndex, rowIndex, meta) => {
            return (
              <input
                type="text"
                value={rowData[rowIndex].department}
                className="custom-input"
                onChange={(e) =>
                  handleCellEdit(rowIndex, "department", e.target.value)
                }
              />
            );
          },
        },
      },
    ];
  };

  const handleCellEdit = (rowIndex, columnName, value) => {
    const updatedRowData = [...rowData];
    updatedRowData[rowIndex][columnName] = value;
    setRowData(updatedRowData);
  };

  const handleCurrencySelected = (currencyId) => {
    console.log("Selected Currency ID:", currencyId);
    setCountryId(currencyId);
    fetchAllList();
  };

  const filteredPlaceOfSupplyOptions = () => {
    if (formData.currency) {
      return regions.filter(
        (region) => region.country.country_id === parseInt(formData.currency)
      );
    } else {
      return regions;
    }
  };

  const filteredBillingStates = () => {
    if (billingAddress.country) {
      return regions.filter(
        (region) =>
          region.country.country_id === parseInt(billingAddress.country)
      );
    } else {
      return regions;
    }
  };

  const filteredShippingStates = () => {
    if (shippingAddress.country) {
      return regions.filter(
        (region) =>
          region.country.country_id === parseInt(shippingAddress.country)
      );
    } else {
      return regions;
    }
  };
  const placeOfSupplyOptions = filteredPlaceOfSupplyOptions();
  const billingStates = filteredBillingStates();
  const shippingStates = filteredShippingStates();

  const fetchAllList = async () => {
    try {
      const response = await getCrudShopApi("/accounts/get_lists/");
      console.log("Fetched all lists:", response);
      setPaymentTerms(response.payment_terms);
      setCurrencies(response.currencies);
      setRegions(response.regions);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const updateCustomer = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("primaryContact", JSON.stringify(primaryContact));
    formDataToSend.append("shippingAddress", JSON.stringify(shippingAddress));
    formDataToSend.append("billingAddress", JSON.stringify(billingAddress));
    formDataToSend.append("remarks", JSON.stringify(remarks));
    formDataToSend.append("formData", JSON.stringify(formData));
    formDataToSend.append("customerType", JSON.stringify(customerType));
    formDataToSend.append("companyName", JSON.stringify(companyName));
    formDataToSend.append("customerEmail", JSON.stringify(customerEmail));
    formDataToSend.append("emailPassword", emailPassword);
    formDataToSend.append("confirmEmailPassword", confirmEmailPassword);
    formDataToSend.append("customerPhoneNumber", customerPhoneNumber);
    formDataToSend.append("isSuperUser", supervisorId);
    formDataToSend.append("isStaff", userIsStaff);
    formDataToSend.append("isActive", userIsActive);

    formDataToSend.append("contactPerson", JSON.stringify(rowData));

    if (formData.formData && formData.formData.file) {
      formDataToSend.append("image[]", formData.formData.file);
    }

    try {
      const response = await updateCrudShopApi(
        `/accounts/update_customer/${selectedCustomer.id}/`,
        formDataToSend
      );
      console.log("Update successful:", response);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files });
  };

  const copyBillingToShipping = () => {
    setShippingAddress({ ...billingAddress });
  };
  const submitForm = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("primaryContact", JSON.stringify(primaryContact));
    formDataToSend.append("shippingAddress", JSON.stringify(shippingAddress));
    formDataToSend.append("billingAddress", JSON.stringify(billingAddress));
    formDataToSend.append("remarks", JSON.stringify(remarks));
    formDataToSend.append("formData", JSON.stringify(formData));
    formDataToSend.append("customerType", JSON.stringify(customerType));
    formDataToSend.append("companyName", JSON.stringify(companyName));
    formDataToSend.append("customerEmail", JSON.stringify(customerEmail));
    formDataToSend.append("emailPassword", emailPassword);
    formDataToSend.append("confirmEmailPassword", confirmEmailPassword);
    formDataToSend.append("customerPhoneNumber", customerPhoneNumber);

    formDataToSend.append("contactPerson", JSON.stringify(rowData));

    if (formData.formData && formData.formData.file) {
      formDataToSend.append("image[]", formData.formData.file);
    }
    try {
      const response = await postCrudShopApi(
        "/accounts/create_customer/",
        formDataToSend
      );
      console.log("Backend response:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container">
      {/* <h1 className={!isModal ? "d-block" : "d-none"}>
        {edit ? "Edit Customers" : "Add Customers"}
      </h1>

      <hr className={!isModal ? "d-block" : "d-none"} /> */}

      <div className="container-fluid">
        <div className="row">
          <div>
            <ul className="Tab-CustomerMangement">
              <li
                className={selectedSection === "general" ? "active" : ""}
                onClick={() => showContent("general")}
              >
                General
              </li>
              <li
                className={selectedSection === "content1" ? "active" : ""}
                onClick={() => showContent("content1")}
              >
                Others
              </li>
              <li
                className={selectedSection === "content2" ? "active" : ""}
                onClick={() => showContent("content2")}
              >
                Address
              </li>
              <li
                className={selectedSection === "content3" ? "active" : ""}
                onClick={() => showContent("content3")}
              >
                Contact Person
              </li>
              <li
                className={selectedSection === "content4" ? "active" : ""}
                onClick={() => showContent("content4")}
              >
                Remarks
              </li>
            </ul>
          </div>

          <div id="app">
            {selectedSection === "general" && (
              <form className="contactInputFields">
                <div className=" customer-inputfields">
                  <label className="customer-label-class">Customer Type</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="customerTypes"
                      id="businessType"
                      value="Business"
                      checked={customerType === "Business"}
                      onChange={() => setCustomerType("Business")}
                    />
                    <label
                      className="customer-label-class"
                      htmlFor="businessType"
                    >
                      Business
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="customerTypes"
                      id="consumerType"
                      value="Consumer"
                      checked={customerType === "Consumer"}
                      onChange={() => setCustomerType("Consumer")}
                    />
                    <label
                      className="customer-label-class"
                      htmlFor="consumerType"
                    >
                      Individual
                    </label>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label
                    htmlFor="primaryContactFirstName"
                    className="customer-label-class"
                  >
                    Primary Contact
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={primaryContact.firstName}
                      onChange={(e) =>
                        setPrimaryContact({
                          ...primaryContact,
                          firstName: e.target.value,
                        })
                      }
                      type="text"
                      className="form-control"
                      id="primaryContactFirstName"
                      placeholder="First Name"
                    />
                    <small className="text-danger">
                      {showAllErrors &&
                        !primaryContact.firstName &&
                        "First name is required."}
                    </small>
                  </div>
                  <div className="col-sm-8">
                    <input
                      value={primaryContact.lastName}
                      onChange={(e) =>
                        setPrimaryContact({
                          ...primaryContact,
                          lastName: e.target.value,
                        })
                      }
                      type="text"
                      className="form-control"
                      id="primaryContactLastName"
                      placeholder="Last Name"
                    />
                    <small className="text-danger">
                      {showAllErrors &&
                        !primaryContact.lastName &&
                        "Last name is required."}
                    </small>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label htmlFor="companyName" className="customer-label-class">
                    Customer Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      type="text"
                      className="form-control"
                      id="companyName"
                    />
                    <small className="text-danger">
                      {showAllErrors &&
                        !companyName &&
                        "Company name is required."}
                    </small>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label
                    htmlFor="customerPhoneNumber"
                    className="customer-label-class"
                  >
                    Customer Phone
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={customerPhoneNumber}
                      onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                      type="tel"
                      className="form-control"
                      id="customerPhoneNumber"
                    />
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label
                    htmlFor="customerEmail"
                    className="customer-label-class"
                  >
                    Customer Email
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      type="email"
                      className="form-control"
                      id="customerEmail"
                    />
                    <small className="text-danger">
                      {showAllErrors &&
                        !customerEmail &&
                        "Customer Email is required."}
                    </small>
                  </div>
                </div>

                <div
                  className="customer-inputfields"
                  style={{ display: !edit ? "block" : "none" }}
                >
                  <label
                    htmlFor="emailPassword"
                    className="customer-label-class"
                  >
                    Password
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      type="password"
                      className="form-control"
                      id="emailPassword"
                    />
                    <small className="text-danger">
                      {showAllErrors && !emailPassword && "Add the password."}
                    </small>
                  </div>
                </div>
                <div class="customer-inputfields">
                  <label
                    for="confirmEmailPassword"
                    class="customer-label-class"
                  >
                    Confirm Password
                  </label>
                  <div class="col-sm-8">
                    <input
                      value={confirmEmailPassword}
                      onChange={(e) => setConfirmEmailPassword(e.target.value)}
                      type="password"
                      className="form-control"
                      id="confirmEmailPassword"
                    />
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label
                    htmlFor="shippingPhoneNumber"
                    className="customer-label-class"
                  >
                    Phone Number
                  </label>
                  <div className="col-sm-8">
                    <input
                      value={shippingAddress.phoneNumber}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phoneNumber: e.target.value,
                        })
                      }
                      type="text"
                      className="form-control"
                      id="shippingPhoneNumber"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Additional form sections here based on selectedSection */}

            {/* Example: */}
            {selectedSection === "content1" && (
              <form className="contactInputFields" onSubmit={submitForm}>
                <div className="customer-inputfields">
                  <label className="customer-label-class">GST Treatment:</label>
                  <div className="col-sm-8">
                    <select
                      value={formData.gstTreatment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gstTreatment: e.target.value,
                        })
                      }
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select GST Treatment
                      </option>
                      <option value="Registered Business">
                        Registered Business
                      </option>
                      <option value="Unregistered Business">
                        Unregistered Business
                      </option>
                      <option value="Consumer">Consumer</option>
                    </select>
                    <small className="text-danger">
                      {showAllErrors &&
                        !formData.gstTreatment &&
                        "Select the Gst Treatment type."}
                    </small>
                  </div>
                </div>

                {formData.gstTreatment === "Registered Business" && (
                  <>
                    <div className="customer-inputfields">
                      <label className="customer-label-class">GSTIN/UIN:</label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          value={formData.gstinUIN}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gstinUIN: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                        <small className="text-danger">
                          {showAllErrors &&
                            !formData.gstinUIN &&
                            "GstinUIN is required."}
                        </small>
                      </div>
                    </div>
                    <div className="customer-inputfields">
                      <label className="customer-label-class">
                        Business Legal Name:
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          value={formData.businessLegalName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessLegalName: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                        <small className="text-danger">
                          {showAllErrors &&
                            !formData.businessLegalName &&
                            "Business Legal Name is required."}
                        </small>
                      </div>
                    </div>
                    <div className="customer-inputfields">
                      <label className="customer-label-class">
                        Business Trade Name:
                      </label>
                      <div className="col-sm-8">
                        <input
                          type="text"
                          value={formData.businessTradeName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessTradeName: e.target.value,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="customer-inputfields">
                  <label className="customer-label-class">PAN:</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) =>
                        setFormData({ ...formData, pan: e.target.value })
                      }
                      className="form-control"
                      required
                    />
                    <small className="text-danger">
                      {showAllErrors && !formData.pan && "Pan is required."}
                    </small>
                  </div>
                </div>
                <div className="customer-inputfields">
                  <label className="customer-label-class">Currency:</label>
                  <div className="col-sm-8">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="form-control"
                    >
                      {currencies.map((currency) => (
                        <option
                          key={currency.country_id}
                          value={currency.country_id}
                        >
                          {currency.name} - {currency.currency_code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label className="customer-label-class">
                    Tax Preference:
                  </label>
                  <div className="col-sm-2 form-check">
                    <input
                      type="radio"
                      value="Taxable"
                      checked={formData.taxPreference === "Taxable"}
                      onChange={() =>
                        setFormData({ ...formData, taxPreference: "Taxable" })
                      }
                      id="taxable"
                      name="taxPreference"
                      className="form-check-input"
                    />
                    <label htmlFor="taxable" className="form-check-label">
                      Taxable
                    </label>
                  </div>
                  <div className="col-sm-3 form-check">
                    <input
                      type="radio"
                      value="Tax Exempt"
                      checked={formData.taxPreference === "Tax Exempt"}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          taxPreference: "Tax Exempt",
                        })
                      }
                      id="taxExempt"
                      name="taxPreference"
                      className="form-check-input"
                    />
                    <label htmlFor="taxExempt" className="form-check-label">
                      Tax Exempt
                    </label>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label className="customer-label-class">
                    Place of Supply:
                  </label>
                  <div className="col-sm-8">
                    <select
                      value={formData.placeOfSupply}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placeOfSupply: e.target.value,
                        })
                      }
                      className="form-control"
                    >
                      {placeOfSupplyOptions.map((placeOfSupply) => (
                        <option
                          key={placeOfSupply.region_id}
                          value={placeOfSupply.region_id}
                        >
                          {placeOfSupply.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-danger">
                      {showAllErrors &&
                        !formData.placeOfSupply &&
                        "Select the Place of Supply."}
                    </small>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label className="customer-label-class">Payment Terms:</label>
                  <div className="col-sm-8">
                    <select
                      // value={selectedPaymentTerm}
                      // onChange={(e) => setSelectedPaymentTerm(e.target.value)}
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select Payment Terms
                      </option>
                      {paymentTerms.map((term) => (
                        <option key={term.id} value={term.id}>
                          {parseInt(term.percentage)}% {term.payment_type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="customer-inputfields">
                  <label className="customer-label-class">Attachments:</label>
                  <div className="col-sm-8">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </form>
            )}

            {selectedSection === "content2" && (
              <form onSubmit={submitForm}>
                <div className="contactInputFields ">
                  <div className="col-sm-8">
                    <h5 className="customer-model-title">Billing Address</h5>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingCountry"
                      >
                        Country/Region
                      </label>
                      <select
                        value={billingAddress.country}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            country: e.target.value,
                          })
                        }
                        className="form-control"
                        id="billingCountry"
                      >
                        {currencies.map((currency) => (
                          <option
                            key={currency.country_id}
                            value={currency.country_id}
                          >
                            {currency.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-danger">
                        {showAllErrors &&
                          !billingAddress.country &&
                          "Select the country."}
                      </small>
                    </div>
                    <div className="customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingAddress"
                      >
                        Address
                      </label>
                      <input
                        value={billingAddress.address}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            address: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="billingAddress"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !billingAddress.address &&
                          "Address is required."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingCity"
                      >
                        City
                      </label>
                      <input
                        value={billingAddress.city}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            city: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="billingCity"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !billingAddress.city &&
                          "City is required."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingState"
                      >
                        State
                      </label>
                      <select
                        value={billingAddress.state}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            state: e.target.value,
                          })
                        }
                        className="form-control"
                        id="billingState"
                      >
                        {billingStates.map((state) => (
                          <option key={state.region_id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-danger">
                        {showAllErrors &&
                          !billingAddress.state &&
                          "Select the state."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingZipcode"
                      >
                        Zipcode
                      </label>
                      <input
                        value={billingAddress.zipcode}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            zipcode: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="billingZipcode"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !billingAddress.zipcode &&
                          "Zipcode is required."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="billingPhoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        value={billingAddress.phoneNumber}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            phoneNumber: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="billingPhoneNumber"
                      />
                    </div>
                  </div>

                  <div className="col-sm-8">
                    <div className="row">
                      <h5 className="customer-model-title col-6">
                        Shipping Address
                      </h5>
                      <button
                        type="button"
                        className="btn btn-link btn-sm col-4"
                        onClick={copyBillingToShipping}
                        style={{ textDecoration: "none" }}
                      >
                        Copy Address
                      </button>
                    </div>
                    <div className="customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingCountry"
                      >
                        Country/Region
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            country: e.target.value,
                          })
                        }
                        className="form-control"
                        id="shippingCountry"
                      >
                        {currencies.map((currency) => (
                          <option
                            key={currency.country_id}
                            value={currency.country_id}
                          >
                            {currency.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-danger">
                        {showAllErrors &&
                          !shippingAddress.country &&
                          "Select the country."}
                      </small>
                    </div>
                    <div className="customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingAddress"
                      >
                        Address
                      </label>
                      <input
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="shippingAddress"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !shippingAddress.address &&
                          "Address is required."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingCity"
                      >
                        City
                      </label>
                      <input
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="shippingCity"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !shippingAddress.city &&
                          "City is required."}
                      </small>
                    </div>
                    <div className="customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingState"
                      >
                        State
                      </label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                        className="form-control"
                        id="shippingState"
                      >
                        {shippingStates.map((state) => (
                          <option key={state.region_id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-danger">
                        {showAllErrors &&
                          !shippingAddress.state &&
                          "State is required."}
                      </small>
                    </div>
                    <div className=" customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingZipcode"
                      >
                        Zipcode
                      </label>
                      <input
                        value={shippingAddress.zipcode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            zipcode: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="shippingZipcode"
                      />
                      <small className="text-danger">
                        {showAllErrors &&
                          !shippingAddress.zipcode &&
                          "Zipcode is required."}
                      </small>
                    </div>
                    <div className="customer-inputfields mb-3">
                      <label
                        className="customer-label-class"
                        htmlFor="shippingPhoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        value={shippingAddress.phoneNumber}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            phoneNumber: e.target.value,
                          })
                        }
                        type="text"
                        className="form-control"
                        id="shippingPhoneNumber"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {selectedSection === "content3" && (
              <div className="user-container">
                <div className="user-add-button-container">
                  <button
                    className="user-modal-open-btn"
                    onClick={handleAddRow}
                  >
                    Add
                  </button>
                </div>
                <div className="table-scroll">
                  <MUIDataTable
                    title={"Contact Person"}
                    data={rowData}
                    columns={generateColumns()}
                    options={{
                      responsive: "standard",
                      selectableRows: "none",
                      filter: false,
                      search: false,
                      print: false,
                      download: false,
                      viewColumns: false,
                      pagination: false,
                      rowsPerPageOptions: [5, 10, 20],
                    }}
                    className="muitable"
                  />
                </div>
              </div>
            )}

            {selectedSection === "content4" && (
              <div className="customer-inputfields">
                <label className="customer-label-class" htmlFor="remarks">
                  Remarks
                </label>
                <div className="col-sm-10">
                  <div className="border rounded p-3">
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="form-control border-0"
                      id="remarks"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
            <div className="checkboxDivContainer">
              <div className="CustomerMangement_checkboxDiv">
                <label className="customer-checkBox-label-class">
                  IsActive
                </label>
                <input
                  type="checkbox"
                  className="CustomerMangementCheckbox"
                  checked={userIsActive === 1}
                  onChange={() => setUserIsActive(userIsActive === 0 ? 1 : 0)}
                />
              </div>

              <div className="CustomerMangement_checkboxDiv">
                <label className="customer-checkBox-label-class">IsStaff</label>
                <input
                  className="CustomerMangementCheckbox"
                  type="checkbox"
                  checked={userIsStaff === 1}
                  onChange={() => setUserIsStaff(userIsStaff === 0 ? 1 : 0)}
                />
              </div>
              <div className="CustomerMangement_checkboxDiv">
                <label className="customer-checkBox-label-class">
                  IsSuperuser{" "}
                </label>
                <input
                  type="checkbox"
                  checked={supervisorId === 1}
                  onChange={() => setSupervisorId(supervisorId === 0 ? 1 : 0)}
                  className="CustomerMangementCheckbox"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-success submit-button-right mb-3 mt-3"
          onClick={selectedCustomer ? updateCustomer : submitForm}
        >
          {selectedCustomer ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default CustomerForms;
