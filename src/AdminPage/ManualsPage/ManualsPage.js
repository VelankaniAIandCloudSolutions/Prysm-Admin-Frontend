import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
export default function ManualsPage() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    AllGetmanuals();
  }, []);
  const AllGetmanuals = async () => {
    await getCrudApi("api/v1/manuals/", {}).then((data) => {
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
            onClick={() => onEditClick(tableMeta.currentTableData[tableMeta.rowIndex].index)}
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
    navigate("/Admin/ManualsPage/ManualsInputField", {
      state: { id: null },
    });
  };
  const onEditClick = (rowIndex) => {
    navigate("/Admin/ManualsPage/ManualsInputField", {
      state: { id: data[rowIndex].manualsID },
    });
  };
  return (
    <div className="manual-container">
      <div className="manual-add_button-container">
        <button
          type="button"
          className="manual-modal-open-btn "
          onClick={onAddNewClick}
        >
          Add
        </button>
      </div>

      <div className="manuals_Table-body">
        <div className="manuals_table-scroll">
          <MUIDataTable
            title={"Manuals"}
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
