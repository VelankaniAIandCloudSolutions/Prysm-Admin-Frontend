import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
import LoadingScreen from "../../Loading/Loading";
export default function DiscountPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllDiscount();
      setIsLoading(false);
    })();
  }, []);
  const getAllDiscount = async () => {
    await getCrudApi("api/v1/discount_code/", {}).then((data) => {
      setData(data);
    });
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
      name: "discountCode",
      label: "Discount Code",
    },
    {
      name: "discountPercentage",
      label: "Discount Percentage",
    },
    {
      name: "expirationDate",
      label: "Expiry Date",
    },
    {
      name: "maxNumberOfApplicableProducts",
      label: "Max Number Of Applicable Product",
    },
    {
      name: "discountAmount",
      label: "Discount Amount",
    },
    {
      name: "maxUsagePerUser",
      label: "Max Usage Per User",
    },
    {
      name: "minAmountForDiscount",
      label: "Max Amount Per Discount",
    },
    {
      name: "maxDiscountAmount",
      label: "Max Discount Amount",
    },
    {
      name: "note",
      label: "Note",
    },

    {
      name: "isActive",
      label: "Status",
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
    navigate("/Admin/DiscountPage/DiscountInputField", {
      state: { id: null, status: "add" },
    });
  };
  const onEditClick = (rowIndex) => {
    navigate("/Admin/DiscountPage/DiscountInputField", {
      state: { id: data[rowIndex].discountCodeID, status: "update" },
    });
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="pccContainerDiscountPage">
          <div className="addButtonContainerDiscountPage">
            <button
              type="button"
              className="modalOpenBtnDiscountPage"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>

          <div className="tableBodyDiscountPage">
            <div className="tableScrollDiscountPage">
              <MUIDataTable
                title={"Discount"}
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
