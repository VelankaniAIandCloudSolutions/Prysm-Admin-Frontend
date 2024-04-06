import React, { useEffect, useState } from "react";
import "./DriversAndSoftware.css";
import Select from "react-select";
import { FaDownload } from "react-icons/fa";
import { selectOptionsMap } from "../Helpers/Helpers";
import { DownloadFile, getCrudApi } from "../webServices/webServices";
import MUIDataTable from "mui-datatables";
import { GrDownload } from "react-icons/gr";
import { toast } from "react-toastify";
export default function DriversAndSoftware({ id }) {
  const [driversData, setDriversData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [filterDriversData, setFilterDriversData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [osId, setOsId] = useState();
  const [selectedReleaseDate, setSelectedReleaseDate] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [versionData, setVersionData] = useState([]);
  let releaseDateOptions = [
    {
      label: "Last 30 Days",
      value: 1,
    },
    {
      label: "Last 60 Days",
      value: 2,
    },
    {
      label: "Last 90 Days",
      value: 90,
    },
    {
      label: "Last 180 Days",
      value: 180,
    },
    {
      label: "Last Year",
      value: 365,
    },
    {
      label: "All",
      value: 367,
    },
  ];
  const getAllOsData = async () => {
    await getCrudApi("api/v1/os", {}).then((data) => {
      setOsData(data);
    });
  };
  const getAllDrivers = async () => {
    await getCrudApi("api/v1/user/product/driver/" + id, {}).then((data) => {
      setDriversData(data);
      setFilterDriversData(data);
    });
  };

  const getDriverById = async (id) => {
    if (id != null) {
      await getCrudApi("api/v1/driver/" + id, {}).then((res) => {
        let filterdata = res[0]?.diVersion?.filter(
          (diV) => diV.versionId !== null
        );
        setVersionData(filterdata);
      });
    }
  };
  useEffect(() => {
    getAllOsData();
    getAllDrivers();
  }, []);

  useEffect(() => {
    getDriverById(driverId);
  }, [driverId]);

  const filterDataByDays = (data, days) => {
    const currentDate = new Date();

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item?.modifiedDate);
      const timeDifference = Math.abs(currentDate - itemDate);
      const differenceInDays = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
      );
      return differenceInDays <= days;
    });

    return filteredData;
  };

  const filterDataBasedOnOsID = () => {
    let filterDataOnlyOS = JSON.parse(JSON.stringify(driversData));
    let arrayOs = [];

    if (osId?.length > 0) {
      osId?.map((os) => {
        arrayOs.push(os?.value);
      });

      filterDataOnlyOS = driversData?.filter((driver) => {
        let itemIds = driver?.osIDs?.split(",").map(Number);
        let condition = arrayOs.some((data) => itemIds?.includes(data));
        if (condition) {
          return true;
        } else return false;
      });
    }
    if (searchKeyword && searchKeyword.trim() !== "") {
      filterDataOnlyOS = filterDataOnlyOS?.filter((data) =>
        data?.name?.toLowerCase()?.includes(searchKeyword?.toLowerCase())
      );
    }
    if (
      selectedReleaseDate &&
      selectedReleaseDate !== null &&
      selectedReleaseDate?.value
    ) {
      filterDataOnlyOS = filterDataByDays(
        filterDataOnlyOS,
        selectedReleaseDate?.value
      );
    }
    setFilterDriversData(filterDataOnlyOS);
  };
  useEffect(() => {
    filterDataBasedOnOsID();
  }, [osId, searchKeyword, selectedReleaseDate]);

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

  const handleClickCard = (e, driver) => {
    setIsTableVisible(true);
    setDriverId(driver?.driverId);
  };

  const handleBackButton = () => {
    setIsTableVisible(false);
  };

  const onDownloadClick = async (id) => {
    let data = {
      fileName: versionData[id]?.filePath,
    };
    await DownloadFile("api/v1/download", data, versionData[id]?.fileName)
      .then((res) => {
        if (res) toast.success("Successfully Downloaded");
        else toast.error("Operation was not performed");
      })
      .catch((error) => {
        toast.error("Operation was not performed");
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
            onClick={() => onDownloadClick(tableMeta?.rowIndex)}
            className="tableEditButton"
          >
            <GrDownload />
          </button>
        ),
      },
    },

    {
      name: "version",
      label: "Version",
    },
    {
      name: "changeHistory",
      label: "History",
    },
    {
      name: "releaseDate",
      label: "Release Date",
      options: {
        customBodyRender: (value) => {
          const releaseDate = new Date(value);
          const day = releaseDate?.getDate();
          const month = releaseDate?.getMonth() + 1;
          const year = releaseDate?.getFullYear();
          const hours = releaseDate?.getHours();
          const minutes = releaseDate?.getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 || 12;
          const formattedDate = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
          return formattedDate;
        },
      },
    },
    {
      name: "versionStatus",
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
  return (
    <div>
      {!isTableVisible ? (
        <>
          {" "}
          <div className="DriversAndSoftwareTop">
            <div className="DriverAndSoftwareImageHedding">
              <div className="DriverAndSoftware_icon">
                <FaDownload />
              </div>
              <h1>Drivers And Software</h1>
            </div>
            <p className="DriversAndSoftwareTop_p">
              Select a tile or filter option to refine the results.
            </p>
          </div>
          <div className="driversAndSoftware_searchbar1">
            <input
              type="text"
              placeholder="Search By Keywords"
              className="driversAndSoftware_searchbar1_input textInput"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
            ></input>
            <Select
              options={selectOptionsMap(
                osData?.filter((e) => e.status === 1),
                "id",
                "name"
              )}
              className="driversAndSoftware_searchbar1_select"
              placeholder="Operating Systems"
              isMulti={true}
              styles={SelectStyle}
              onChange={(e) => setOsId(e)}
            />
            <Select
              options={releaseDateOptions}
              className="driversAndSoftware_searchbar1_select"
              placeholder="Release Date"
              styles={SelectStyle}
              onChange={setSelectedReleaseDate}
              value={selectedReleaseDate}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      <>
        {isTableVisible ? (
          <>
            <button
              onClick={handleBackButton}
              class="btn btn-primary"
              className="additional_button globalButton"
            >
              Back
            </button>
            {versionData ? (
              <MUIDataTable
                title={"Versions"}
                data={versionData?.filter((data) => data?.versionStatus === 1)}
                columns={columns}
                options={options}
                className="muitable"
              />
            ) : (
              <div>No ata to show</div>
            )}
          </>
        ) : (
          <>
            {filterDriversData.filter((data) => data.status === 1).length >
            0 ? (
              <div className="DriverAndSoftwareElements">
                {filterDriversData
                  .filter((data) => data.status === 1)
                  ?.map((driver) => {
                    return (
                      <div
                        className="DriverAndSoftware_element"
                        onClick={(e) => handleClickCard(e, driver)}
                      >
                        <p className="DriverAndSoftware_elementHeading">
                          {driver?.name}
                        </p>
                        <p className="DriverAndSoftware_element_p">
                          {driver?.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="driver-noData">No Data to Show</div>
            )}
          </>
        )}
      </>
    </div>
  );
}
