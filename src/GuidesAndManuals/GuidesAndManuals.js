import React, { useEffect, useState } from "react";
import "./GuidesAndManuals.css";
import { NavLink } from "react-router-dom";
import { RiContactsBookUploadFill } from "react-icons/ri";
import { getCrudApi } from "../webServices/webServices";
import MUIDataTable from "mui-datatables";

export default function GuidesAndManuals({ id }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [manualData, setManualData] = useState([]);
  const [filterManualData, setFilterManualData] = useState([]);
  const getAllManuals = async () => {
    await getCrudApi("api/v1/user/product/manuals/" + id, {}).then((data) => {
      let filterdata = data?.filter((manual) => manual.manualsID !== null);
      setManualData(filterdata);
      setFilterManualData(filterdata);
    });
  };
  useEffect(() => {
    getAllManuals();
  }, []);

  const filterDataBasedOnOsID = () => {
    let filterDataFromText = [];
    if (manualData.length > 0) {
      filterDataFromText = manualData?.filter((data) =>
        data?.linkName?.includes(searchKeyword)
      );
      setFilterManualData(filterDataFromText);
    } else {
      setFilterManualData(manualData);
    }
  };
  useEffect(() => {
    filterDataBasedOnOsID();
  }, [searchKeyword]);
  const columns = [
    {
      name: "linkName",
      label: "Guides and Manuals",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <NavLink
            to={{
              pathname: "/Home/DataCenter/Support/RenderLink",
            }}
            state={{
              data: filterManualData[tableMeta?.rowIndex],
              type: "manuals",
            }}
          >
            {value}
          </NavLink>
        ),
      },
    },
    {
      name: "modifiedDate",
      label: "Date Modified",
      options: {
        customBodyRender: (value) => {
          const tzDate = new Date(value);
          const day = tzDate?.getDate();
          const month = tzDate?.getMonth() + 1;
          const year = tzDate?.getFullYear();
          const hours = tzDate?.getHours();
          const minutes = tzDate?.getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 || 12;
          const formattedDate = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
          return formattedDate;
        },
      },
    },
  ];

  const options = {
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    pagination: true,
    selectableRows: "none",
    rowsPerPage: 10,
  };

  const styles = {
    root: {
      border: "none",
    },
  };

  return (
    <div className="GuidesAndManuals">
      <div className="GuidesAndManualsImageHedding">
        <div className="GuidesAndManuals_icon">
          <RiContactsBookUploadFill />
        </div>
        <h2>Guides & Manuals</h2>
      </div>

      <div className="GuidesAndManuals_div1">
        <input
          type="text"
          placeholder="Search By Keyword"
          className="GuidesAndManuals_div1_input textInput"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        ></input>
      </div>
      <div className="GuidesAndManuals_links">
        {filterManualData?.length > 0 ? (
          <>
            <MUIDataTable
              data={filterManualData.filter((data) => data.status === 1)}
              columns={columns}
              options={options}
              styles={styles}
            />
          </>
        ) : (
          <div className="guidesManauls-noshows">No data to show</div>
        )}
      </div>
    </div>
  );
}
