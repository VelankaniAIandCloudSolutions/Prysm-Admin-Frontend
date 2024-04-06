import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import "./Product.css";
import { GrEdit } from "react-icons/gr";
import { getCrudApi } from "../../webServices/webServices";
import LanguageDropdown from "../../Dropdown/LanguageDropdown";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../Loading/Loading";

export default function Product() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(false);
  const [productCategoryData, setProductCategoryData] = useState([]);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getAllProduct();
      await getAllProductCategory();
    })();
    setIsLoading(false);
  }, []);

  const getAllProduct = async () => {
    await getCrudApi("api/v1/product").then((data) => {
      setData(data);
    });
  };
  const getAllProductCategory = async () => {
    getCrudApi("api/v1/product_category").then((data) => {
      setProductCategoryData(data);
    });
  };

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
      name: "productDescription",
      label: "DESCRIPTION",
    },
    {
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "price",
      label: "PRICE",
    },
    {
      name: "stock",
      label: "STOCK",
      options: {
        customBodyRender: (value) => (value ? "InStock" : "NoStock"),
      },
    },
    {
      name: "productCategoryID",
      label: "PRODUCT CATEGORY",
      options: {
        customBodyRender: (value, tableMeta) => {
          const productCategoryName = productCategoryData.find(
            (item) => item.productCategoryID === value
          )?.name;
          return productCategoryName || null;
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
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [],
    onChangePage: (currentPage) => {},
  };

  const onAddNewClick = () => {
    navigate("/Admin/Product/ProductDetails");
  };

  const onEditClick = (rowIndex) => {
    setModalOpen(true);
    setEditRow(true);
    navigate("/Admin/Product/ProductDetails", {
      state: data[rowIndex].productID,
    });
  };
  const handleSelectLanguage = (language) => {
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="pcc_container">
          <div className="add_button_container">
            <button
              type="button"
              className="product-modal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>

          {modalOpen && (
            <div className="productModal">
              <div className="productModal-content">
                <div className="productHeader-modal">
                  <h5 className="productHeader-title">Product</h5>
                  {editRow && (
                    <LanguageDropdown onSelectLanguage={handleSelectLanguage} />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="productTable-body">
            <div className="product_table-scroll">
              <MUIDataTable
                title={"Product"}
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
