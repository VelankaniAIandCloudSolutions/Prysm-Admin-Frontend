import React, { useState, useEffect } from "react";
import axios from "axios";
import MUIDataTable from "mui-datatables"; // Make sure to import MUIDataTable
import CustomerForms from "./CustomerForms"; // Adjust path as per your actual structure
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";

import { getCrudShopApi, postCrudShopApi } from "../../webServices/webServices";

const Customer = ({ isModal }) => {
  const [showForm, setShowForm] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigate = useNavigate();

  const OnAddnewclick = () => {
    navigate("/Admin/CustomerManagements/CustomerForms");
    // setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };
  const onEditClick = (rowIndex) => {
    const selectedRow = customers[rowIndex];
    setSelectedCustomer(selectedRow);
    console.log(selectedRow);
    navigate("/Admin/CustomerManagements/CustomerForms", {
      state: { selectedCustomer: selectedRow },
    });
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCrudShopApi("/accounts/get_all_customers/");
        setCustomers(data.customers);
        setPaymentTerms(data.payment_terms);
        console.log("All-Customer", data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCustomers();
  }, []);

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
      name: "company_name",
      label: "Customer Name",
    });
    columnsArray.push({
      name: "user.email",
      label: "Customer Email",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "customer_type",
      label: "Customer Type",
    });
    columnsArray.push({
      name: "tax_preference",
      label: "Tax Prefrence",
      options: {
        display: false,
      },
    });

    columnsArray.push({
      name: "gst_treatment",
      label: "GST Treatment",
    });
    columnsArray.push({
      name: "currency",
      label: "Currency",
      options: {
        customBodyRender: (value, tableMeta) => {
          if (value) {
            const currencyCode = value.currency_code;
            const country = value.name;
            return `${country} - ${currencyCode}`;
          } else {
            return " ";
          }
        },
      },
    });
    columnsArray.push({
      name: "payment_term",
      label: "Payment Terms",
      options: {
        customBodyRender: (value, tableMeta) => {
          if (value) {
            const percentage = value.percentage;
            const type = value.payment_type;
            return `${parseInt(percentage, 10)}% ${type}`;
          } else {
            return "null";
          }
        },
      },
    });

    // columnsArray.push({
    //   name: "isStaff",
    //   label: "Delete",
    //   options: {
    //     customBodyRender: (value) => (value ? "True" : "False"),
    //   },
    // });

    return columnsArray;
  };

  return (
    <>
      {showForm ? (
        <CustomerForms onClose={handleFormClose} isModal={isModal} />
      ) : (
        <div className="user-container">
          <div className="user-add-button-container">
            <button className="user-modal-open-btn" onClick={OnAddnewclick}>
              Add
            </button>
          </div>

          <div className="table-scroll">
            <MUIDataTable
              title={"Customer Management"}
              data={customers}
              columns={generateColumns()}
              options={{}}
              className="muitable"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Customer;
