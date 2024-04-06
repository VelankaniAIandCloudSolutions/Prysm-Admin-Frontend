import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import { GrEdit } from "react-icons/gr";
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import {
  generateRowsForDataGridForIDandStatus,
  idsStatusToArray,
  selectOptionsMap,
} from "../../Helpers/Helpers";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

export default function ProductDriver({ productId }) {
  const [driveDetails, setDriveDetails] = useState("");
  const [driveOptions, setDriveOptions] = useState("");
  const [getDriverDetails, setGetDriverDetails] = useState([]);
  const [rowModesModelForDriverTable, setRowModesModelForDriverTable] =
    useState({});
  const [rowsForDriverTable, setRowsForDriverTable] = useState([]);
  const [oldRowsForDriverTable, setOldRowsForDriverTable] = useState([]);
  const [updateUI, setUpdateUI] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const driverDetailsOptions = async () => {
    await getCrudApi("api/v1/driver", {}).then((data) => {
      setDriveDetails(data);
    });
  };
 
  const getDriversByProductId = async (id) => {
    await getCrudApi("api/v1/product/drivers_by_prd/" + id, {}).then((data) => {
      if (data) {
        setDriveOptions([]);
        setGetDriverDetails(data);
        setRowsForDriverTable(
          generateRowsForDataGridForIDandStatus(data, "driverID")
        );
        setOldRowsForDriverTable(
          generateRowsForDataGridForIDandStatus(data, "driverID")
        );
      }
    });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await driverDetailsOptions();
      await getDriversByProductId(productId);
    })();
    setIsLoading(false);
  }, [updateUI]);
  const onSelectdriveOptions = (selectedOption) => {
    setDriveOptions(selectedOption);

    const showDriverDetails = driveDetails.filter((item) =>
      selectedOption?.some((option) => option.value === item.id)
    );
    if (oldRowsForDriverTable?.length > 0) {
      setRowsForDriverTable([
        ...oldRowsForDriverTable,
        ...generateRowsForDataGridForIDandStatus(showDriverDetails, "id"),
      ]);
    } else {
      setRowsForDriverTable(
        generateRowsForDataGridForIDandStatus(showDriverDetails, "id")
      );
    }
    
  };
  const handleEditClickForDriverTable = (id) => () => {
    setRowModesModelForDriverTable({
      ...rowModesModelForDriverTable,
      [id]: { mode: GridRowModes.Edit },
    });
  };
  const handleSaveClickForDriverTable = (id) => () => {
    setRowModesModelForDriverTable({
      ...rowModesModelForDriverTable,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClickForDriverTable = (id) => () => {
    setRowModesModelForDriverTable({
      ...rowModesModelForDriverTable,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdateForDriver = (newRow) => {
    setIsLoading(true);
    const updatedRow = {
      ...newRow,
      isNew: false,
      status: newRow?.statusName === "Active" ? 1 : 2,
    };
    setRowsForDriverTable(
      rowsForDriverTable.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    putCrudApi(
      "api/v1/user/product/driver/" + updatedRow?.productDriverID,
      updatedRow
    )
      .then((res) => {
        if (res) {
          toast.success("Updated");
        } else {
          toast.error("Operation was not performed");
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
    return updatedRow;
  };

  const handleRowModesModelChangeForDriver = (newRowModesModel) => {
    setRowModesModelForDriverTable(newRowModesModel);
  };

  const handleRowEditStopForDriver = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const generateColumnsForDrivers = () => {
    let columnsArray = [];

    columnsArray.push({
      field: "id",
      headerName: "ID",
      minWidth: 50,
      hideable: false,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
    });
    columnsArray.push({
      field: "name",
      headerName: "Name",
      editable: false,
      minWidth: 150,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
    });
    columnsArray.push({
      field: "description",
      headerName: "Description",
      editable: false,
      minWidth: 150,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
    });
    columnsArray.push({
      field: "statusName",
      headerName: "Status",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Inactive", "Active"],
      minWidth: 100,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
    });

    columnsArray.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      minWidth: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode =
          rowModesModelForDriverTable[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FaSave size={20} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClickForDriverTable(id)}
            />,
            <GridActionsCellItem
              icon={<GiCancel size={20} />}
              label="Cancel"
              sx={{
                color: "#ad2128",
              }}
              className="textPrimary"
              onClick={handleCancelClickForDriverTable(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<GrEdit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClickForDriverTable(id)}
            color="inherit"
          />,
        ];
      },
    });

    return columnsArray;
  };
  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontSize: "14px",
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
  const handleAdd = async (e) => {
    setIsLoading(true);
    let data = {
      productID: productId,
      driverId: idsStatusToArray(driveOptions, "value"),
    };
    await postCrudApi("api/v1/product/ins_drivers_by_prd", data)
      .then((data) => {
        if (data) {
          toast.success("Added Successfully");
        } else {
          toast.error("Operation was not performed");
        }
        setUpdateUI(!updateUI);
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ProductDetails">
          <div className="productDetailsFirstDiv">
            <div className="Productdetail-header">
              <div className="attachDriversDiv">
                <div className="">
                  <label className="productLabelClass">Driver Name</label>
                  <Select
                    onChange={onSelectdriveOptions}
                    isMulti
                    styles={SelectStyle}
                    value={driveOptions}
                    options={selectOptionsMap(
                      driveDetails !== ""
                        ? driveDetails?.filter((e) => e.status === 1)
                        : driveDetails,
                      "id",
                      "name"
                    )?.filter(
                      (option) =>
                        !getDriverDetails?.some(
                          (driver) => driver.driverID === option.value
                        )
                    )}
                    className="Drive-dropdown-input"
                  />
                </div>

                {rowsForDriverTable?.length > 0 ? (
                  <div className="productDetailsFirstTable">
                    <DataGrid
                      editMode="row"
                      rowModesModel={rowModesModelForDriverTable}
                      onRowModesModelChange={handleRowModesModelChangeForDriver}
                      onRowEditStop={handleRowEditStopForDriver}
                      processRowUpdate={processRowUpdateForDriver}
                      columns={generateColumnsForDrivers()}
                      rows={rowsForDriverTable}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 4 },
                        },
                      }}
                      className="productDetailsTable1"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          {driveOptions?.length > 0 ? (
            <button onClick={handleAdd} className="productDetailsModalBtn">
              Add
            </button>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
