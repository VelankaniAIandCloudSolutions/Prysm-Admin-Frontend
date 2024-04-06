import React, { useState, useEffect } from "react";
import { getCrudApi } from "../../webServices/webServices";
import "./Driver.css";
import MUIDataTable from "mui-datatables";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../Loading/Loading";

export default function Driver() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [driverGroupData, setDriverGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getAllDataDriver();
      await getAllDataGroup();
      setIsLoading(false);
    })();
  }, []);

  const getAllDataDriver = async () => {
    await getCrudApi("api/v1/driver", {}).then((data) => {
      setData(data);
    });
  };

  const getAllDataGroup = async () => {
    await getCrudApi("api/v1/driver_group", {}).then((data) => {
      setDriverGroupData(data);
    });
  };

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
    sortOrder: {
      name: "location_id",
      direction: "desc",
    },
    onRowsDelete: (rowsDeleted) => {
    },
    onColumnSortChange: (changedColumn, direction) => {},
    onChangeRowsPerPage: (numberOfRows) => {},
  };

  const generateColumns = () => {
    let columnsArray = [];
    let firstCol = {
      name: "EDIT",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (_, tableMeta) => {
          return (
            <>
              <button
                className="tableEditButton"
                onClick={() => {
                  onEditClick(
                    tableMeta.currentTableData[tableMeta.rowIndex].index
                  );
                }}
              >
                <GrEdit />
              </button>
            </>
          );
        },
      },
    };
    columnsArray.push(firstCol);
    columnsArray.push({
      name: "id",
      label: "ID",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "name",
      label: "NAME",
    });
    columnsArray.push({
      name: "description",
      label: "DESCRIPTION",
    });
    columnsArray.push({
      name: "driverGrpId",
      label: "DRIVER GROUP",
      options: {
        customBodyRender: (value, tableMeta) => {
          const driverGroupName = driverGroupData?.find(
            (item) => item.id === value
          )?.name;
          return driverGroupName || null;
        },
      },
    });
    columnsArray.push({
      name: "osId",
      label: "Operating System",
      options: {
        display: false,
      },
    });

    columnsArray.push({
      name: "status",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    });

    return columnsArray;
  };

  const onAddNewClick = () => {
    navigate("/Admin/Driver/AddOrUpdateDriver");
  };

  const onEditClick = (index) => {
    navigate("/Admin/Driver/AddOrUpdateDriver", {
      state: {
        data: data[index],
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="driver-container">
          <div className="driverAdd_button_container">
            <button
              type="button"
              className="driverModal-open-btn"
              onClick={onAddNewClick}
            >
              Add
            </button>
          </div>
          <div>
            <div className="driverTable-body">
              <div className="driverTable-scroll">
                <MUIDataTable
                  title={"Driver"}
                  data={data ? data : []}
                  columns={generateColumns()}
                  options={options}
                  className="muitable"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
