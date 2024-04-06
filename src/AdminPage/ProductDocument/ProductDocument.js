import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
import "./ProductDocument.css";

export default function ProductDocument() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await GetAllProductDocument();
    })();
  }, []);

  const GetAllProductDocument = async () => {
    await getCrudApi("api/v1/product_document", {}).then((data) => {
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
      name: "name",
      label: "NAME",
    },
    {
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "isThumbnail",
      label: "THUMBNAIL",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    },
    {
      name: "productDocumentPath",
      label: "PATH",
      options: {
        display: false,
      },
    },
    {
      name: "productID",
      label: "ID",
      options: {
        display: false,
      },
    },
    {
      name: "fileName",
      label: "FILE NAME",
      options: {
        display: false,
      },
    },
    {
      name: "fileSize",
      label: "FILE SIZE",
      options: {
        display: false,
      },
    },
    {
      name: "fileType",
      label: "FILE TYPE",
      options: {
        display: false,
      },
    },
    {
      name: "fileUUID",
      label: "UUID",
      options: {
        display: false,
      },
    },
    {
      name: "documentCategoryID",
      label: "Document Category ID",
      options: {
        display: false,
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
  };
  const onAddNewClick = () => {
    navigate("/Admin/ProductDocument/AddOrUpdateProductDocument", {
      state: { id: null },
    });
  };
  const onEditClick = (rowIndex) => {
    navigate("/Admin/ProductDocument/AddOrUpdateProductDocument", {
      state: { id: data[rowIndex].productDocumentID },
    });
  };
  return (
    <div className="productDoc-container">
      <div className="productDoc-add_button-container">
        <button
          type="button"
          className="productDoc-modal-open-btn "
          onClick={onAddNewClick}
        >
          Add
        </button>
      </div>

      <div className="productDoc_Table-body">
        <div className="productDoc_table-scroll">
          <MUIDataTable
            title={"Product Document"}
            data={data}
            columns={columns}
            options={options}
            className="muitable"
          />
        </div>
      </div>
    </div>
  );
}
