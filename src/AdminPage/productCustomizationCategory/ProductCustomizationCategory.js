import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import "./ProductCustomizationCategory.css";
import { getCrudApi } from "../../webServices/webServices";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../Loading/Loading";

export default function ProductCustomizationCategory() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getAllProductCustCat();
    })();
    setIsLoading(false);
  }, []);

  const getAllProductCustCat = async () => {
    await getCrudApi("api/v1/product_cust_cat", {}).then((data) => {
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
        customBodyRender: (_, tableMeta, e) => (
          <button
            onClick={() => {
              onEditClick(
                tableMeta.currentTableData[tableMeta.rowIndex]?.index
              );
            }}
            className="tableEditButton"
          >
            <GrEdit />
          </button>
        ),
      },
    },
    {
      name: "name",
      label: "CATEGORY NAME",
    },
    {
      name: "isMultiselect",
      label: "MULTISELECT",
      options: {
        customBodyRender: (value) => (value ? "True" : "False"),
      },
    },
    {
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "parentCustomizationCategoryID",
      label: "PARENT CATEGORY",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowIndex = tableMeta.rowIndex;
          const parentCategoryName = data.find(
            (item) => item.customizationCategoryID === value
          )?.name;
          return parentCategoryName || null;
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
    sessionStorage.removeItem("custCatId");
    navigate(
      "/Admin/productCustomizationCategory/ProductCustomizationCategoryDetails"
    );
  };
  const onEditClick = (rowIndex) => {
    sessionStorage.setItem("custCatId", data[rowIndex].customizationCategoryID);
    navigate(
      "/Admin/productCustomizationCategory/ProductCustomizationCategoryDetails",
      {
        state: data[rowIndex].customizationCategoryID,
      }
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ProductCat-container">
          <div className="ProductCat-add-button-container">
            <button
              type="button"
              className="ProductCat-modal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>

          <div className="customization-Table-body">
            <div className="customization-table-scroll">
              <MUIDataTable
                title={"Product Customization Category"}
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
