import React, { useState, useEffect } from "react";
import "./HowTo.css";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import { BiSolidBookBookmark } from "react-icons/bi";
import MUIDataTable from "mui-datatables";
import { selectOptionsMap } from "../Helpers/Helpers";
import { getCrudApi } from "../webServices/webServices";
export default function HowTo({ id }) {
  const [osData, setOsData] = useState([]);
  const [howToData, setHowToData] = useState([]);
  const [filteredHowToData, setFilteredHowToData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [osId, setOsId] = useState();
  const getAllOsData = async () => {
    await getCrudApi("api/v1/os", {}).then((data) => {
      setOsData(data);
    });
  };

  const getAllHowTos = async () => {
    await getCrudApi("api/v1/user/product/howto/" + id, {}).then((data) => {
      let filterdata = data?.filter((mhwt) => mhwt.howToId !== null);
      setHowToData(filterdata);
      setFilteredHowToData(filterdata);
    });
  };

  const filterDataBasedOnOsID = () => {
    if (osId?.length > 0 || (searchKeyword && searchKeyword.trim() !== "")) {
      let arrayOs = [];
      osId?.map((os) => {
        arrayOs.push(os?.value);
      });
      let filterData = [...howToData];
      if (arrayOs.length > 0) {
        filterData = howToData?.filter((howTo) => {
          let itemIds = howTo?.osIDs?.split(",").map(Number);
          let condition = arrayOs.some((data) => itemIds?.includes(data));
          if (condition) {
            return true;
          } else return false;
        });
      }
      let filterDataFromText = [];
      if (searchKeyword.toString().trim() !== "") {
        filterDataFromText = filterData?.filter((data) =>
          data?.name?.includes(searchKeyword)
        );
      } else {
        filterDataFromText = [...filterData];
      }

      setFilteredHowToData(filterDataFromText);
    } else {
      setFilteredHowToData(howToData);
    }
  };
  useEffect(() => {
    filterDataBasedOnOsID();
  }, [osId, searchKeyword]);

  useEffect(() => {
    getAllOsData();
    getAllHowTos();
  }, []);
  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontWeight: "400",
      "&:hover": {
        border: "1px solid rgb(201, 200, 200)",
        boxShadow: "0 0 3px grey",
        cursor: "pointer",
      },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const columns = [
    {
      name: "name",
      label: "Article Name",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <NavLink
            to={{
              pathname: "/Home/DataCenter/Support/RenderLink",
            }}
            state={{
              data: filteredHowToData[tableMeta.rowIndex],
              type: "howto",
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
    <div>
      <div className="howToImageHedding">
        <div className="driverSoftware_icon">
          <BiSolidBookBookmark />
        </div>
        <h2>How To's</h2>
      </div>
      <div className="HowTo_searchbar1">
        <input
          placeholder="Search By Keywords"
          className="HowTo_searchbar1_input textInput"
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
        ></input>
        <Select
          options={selectOptionsMap(
            osData?.filter((e) => e.status === 1),
            "id",
            "name"
          )}
          className="HowTo_searchbar1_select"
          placeholder="Operating system"
          isMulti={true}
          styles={SelectStyle}
          onChange={(e) => setOsId(e)}
        />
      </div>

      <div className="HowTo_links">
        {filteredHowToData?.length > 0 ? (
          <>
            <MUIDataTable
              data={filteredHowToData?.filter((data) => data?.status === 1)}
              columns={columns}
              options={options}
              styles={styles}
            />
          </>
        ) : (
          <div className="howTo-noshow">No data to show</div>
        )}
      </div>
    </div>
  );
}
