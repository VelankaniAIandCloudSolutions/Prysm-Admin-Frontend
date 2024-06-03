import React, { useState, useEffect } from "react";
import "./PaymentTerm.css";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import LoadingScreen from "../../Loading/Loading";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { toast } from "react-toastify";

export default function PaymentTerm() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [error, setError] = useState(null);
  const [id, setId] = useState("");
  const [paymentTerm, setPaymentTerms] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Fetch data or perform any initial setup here
  }, []);

  const generateColumns = () => {
    let columnsArray = [];
    columnsArray.push({
      name: "EDIT",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <button
              className="tableEditButton"
              onClick={() =>
                handleEditClick(
                  tableMeta.currentTableData[tableMeta.rowIndex].index
                )
              }
            >
              <GrEdit />
            </button>
          );
        },
      },
    });
    columnsArray.push({
      name: "created_at",
      label: "Created At",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "payment_type",
      label: "Payment Type",
    });
    columnsArray.push({
      name: "percentage",
      label: "Percentage",
    });
    columnsArray.push({
      name: "is_active",
      label: "Is Active",
      options: {
        customBodyRender: (value) => {
          return value === 1 ? "Active" : "Inactive";
        },
      },
    });

    return columnsArray;
  };

  const options = {
    // Define MUI Datatable options here
  };

  const handleEditClick = (rowIndex) => {
    const selectedPaymentTerm = paymentTerm[rowIndex];
    console.log(selectedPaymentTerm);
    setId(selectedPaymentTerm.id);
    setPaymentType(selectedPaymentTerm.payment_type);
    setPercentage(selectedPaymentTerm.percentage);
    setIsActive(selectedPaymentTerm.is_active);
    setIsEditModalOpen(true);
  };

  const fetchPaymentTerm = async () => {
    try {
      const data = await getCrudApi("api/v1/payment_term/get-payment-term", {});
      console.log("Payment Term", data);
      setPaymentTerms(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPaymentTerm();
  }, []);

  const handleAddPaymentTerm = async () => {
    const percentageAsNumber = parseFloat(percentage);
    const paymentTermData = {
      payment_type: paymentType,
      percentage: percentageAsNumber,
      is_active: isActive,
    };

    try {
      const response = await postCrudApi(
        "api/v1/payment_term/payment-term",
        paymentTermData
      );

      if (response) {
        toast.success("Payment term added successfully");
      } else {
        toast.error("Operation was not performed");
      }
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding payment term:", error);
      toast.error("Operation was not performed");
    }
  };

  const handleUpdatePaymentTerm = async () => {
    try {
      const response = await putCrudApi(
        "api/v1/payment_term/update-payment-term",
        {
          id: id,
          payment_type: paymentType,
          percentage: percentage,
          is_active: isActive,
        }
      );

      if (response.status === 200) {
        toast.success("Payment term updated successfully.");
      }
      fetchPaymentTerm();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating payment term:", error);
      toast.error("Internal Server Error");
    }
  };

  const handleAddNewClick = () => {
    setId("");
    setPaymentType("");
    setPercentage("");
    setIsActive(false);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="paymentTerm-container">
        <div className="paymentTerm-add-button-container">
          <button
            type="button"
            className="paymentTerm-modal-open-btn"
            onClick={handleAddNewClick}
          >
            Add
          </button>
        </div>
        <div className="paymentTerm-body">
          <div className="table-scroll">
            <MUIDataTable
              title={"Payment Term"}
              data={paymentTerm}
              columns={generateColumns()}
              options={options}
              className="muitable"
            />
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="paymentTerm-Modal">
          <div className="paymentTerm-modal-content paymentTerm-modalWidthClass ">
            <div className="paymentTerm-header-modal">
              <h5 className="paymentTerm-header-title">Add Payment Term</h5>
            </div>
            <div className="paymentTerm-imagesAndFields">
              <div className="productCategory-Inputsfields">
                <label className="paymentTerm-label-class">
                  Payment Type:
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Payment Type
                    </option>
                    <option value="Credit">Credit</option>
                    <option value="Advance">Advance</option>
                  </select>
                </label>
              </div>
              <div className="productCategory-Inputsfields">
                <label className="paymentTerm-label-class">
                  Percentage:
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                </label>
              </div>
              <div className="paymentTerm-label-class">
                <label className="paymentTerm-Checkbox">
                  Active:
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </label>
              </div>
            </div>
            <div className="paymentTerm-footer-modal">
              <button
                type="button"
                className="paymentTerm-Modal-btn"
                onClick={handleAddPaymentTerm}
              >
                Add
              </button>
              <button
                type="button"
                className="paymentTerm-close-btn"
                onClick={handleCloseAddModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="paymentTerm-Modal">
          <div className="paymentTerm-modal-content paymentTerm-modalWidthClass ">
            <div className="paymentTerm-header-modal">
              <h5 className="paymentTerm-header-title">Edit Payment Term</h5>
            </div>
            <div className="paymentTerm-imagesAndFields">
              <div className="productCategory-Inputsfields">
                <label className="paymentTerm-label-class">
                  Payment Type:
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Payment Type
                    </option>
                    <option value="Credit">Credit</option>
                    <option value="Advance">Advance</option>
                  </select>
                </label>
              </div>
              <div className="productCategory-Inputsfields">
                <label className="paymentTerm-label-class">
                  Percentage:
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                </label>
              </div>
              <div className="paymentTerm-label-class">
                <label className="paymentTerm-Checkbox">
                  Active:
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </label>
              </div>
            </div>
            <div className="paymentTerm-footer-modal">
              <button
                type="button"
                className="paymentTerm-Modal-btn"
                onClick={handleUpdatePaymentTerm}
              >
                Update
              </button>
              <button
                type="button"
                className="paymentTerm-close-btn"
                onClick={handleCloseEditModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
