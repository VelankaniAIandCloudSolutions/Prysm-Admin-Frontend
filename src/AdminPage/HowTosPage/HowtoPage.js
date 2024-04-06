import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
import "./HowtoPage.css";

export default function HowtoPage() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllHowTo();
  }, []);
  const getAllHowTo = async () => {
    await getCrudApi("api/v1/howto/", {}).then((data) => {
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
            onClick={() => onEditClick(tableMeta.currentTableData[tableMeta.rowIndex]?.index)}
            className="tableEditButton"
          >
            <GrEdit />
          </button>
        ),
      },
    },
    {
      name: "linkName",
      label: "LINK NAME",
    },
    {
      name: "status",
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
    rowsPerPage: 5,
    rowsPerPageOptions: [],
    onChangePage: (currentPage) => {},
  };
  const onAddNewClick = () => {
    navigate("/Admin/HowtoPage/HowtoInputFields", { state: { id: null } });
  };
  const onEditClick = (rowIndex) => {
    navigate("/Admin/HowtoPage/HowtoInputFields", {
      state: { id: data[rowIndex].howtoID },
    });
  };

  return (
    <div className="Howto-container">
      <div className="Howto-add-button-container">
        <button
          type="button"
          className="Howto-modal-open-btn"
          onClick={onAddNewClick}
        >
          Add
        </button>
      </div>

      <div className="howTo_Table-body">
        <div className="howTo_table-scroll">
          <MUIDataTable
            title={"How To"}
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
