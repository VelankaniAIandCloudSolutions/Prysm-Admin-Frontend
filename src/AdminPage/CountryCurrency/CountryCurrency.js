import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { getCrudApi } from "../../webServices/webServices";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import "./CountryEdit.css";
import LoadingScreen from "../../Loading/Loading";

export default function CountryCurrency() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getCrudApi("api/v1/country").then((data) => {
        setData(data);
      });
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
      name: "countryName",
      label: "NAME",
    },
    {
      name: "currencyCode",
      label: "CURRENCY CODE",
    },
    {
      name: "forexRate",
      label: "FOREX RATE",
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
    navigate("/Admin/CountryConfiguration/AddUpdateCountryConfiguration", {
      state: { countryId: null },
    });
  };
  const onEditClick = (index) => {
    sessionStorage.removeItem("countryID");
    navigate("/Admin/CountryConfiguration/AddUpdateCountryConfiguration", {
      state: { countryId: data[index].countryID },
    });
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="Country-Container">
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
                title={"Country"}
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
