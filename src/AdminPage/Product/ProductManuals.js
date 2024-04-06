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

export default function ProductManuals({ productId }) {
  const [manualDetails, setManualDetails] = useState("");
  const [manualOptions, setManualOptions] = useState("");
  const [getManualDetails, setGetManualDetails] = useState([]);
  const [updateUI, setUpdateUI] = useState(true);
  const [oldRowsForManualsTable, setOldRowsForManualsTable] = useState([]);

  const [rowModesModelForManualTable, setRowModesModelForManualTable] =
    useState({});
  const [rowsForManualTable, setRowsForManualTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const manualsDetailsOptions = async () => {
    await getCrudApi("api/v1/manuals/", {}).then((data) => {
      setManualDetails(data);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await manualsDetailsOptions();
      await getManualsByProductId(productId);
    })();
    setIsLoading(false);
  }, [updateUI]);
  const getManualsByProductId = async (id) => {
    await getCrudApi("api/v1/product/manuals_by_prd/" + id, {}).then((data) => {
      if (data) {
        setManualOptions([]);
        setGetManualDetails(data);
        setRowsForManualTable(
          generateRowsForDataGridForIDandStatus(data, "manualsID")
        );
        setOldRowsForManualsTable(
          generateRowsForDataGridForIDandStatus(data, "manualsID")
        );
      }
    });
  };
  const onSelectManualsOptions = (selectedOption) => {
    setManualOptions(selectedOption);

    const showManualDetails = manualDetails.filter((item) =>
      selectedOption?.some((option) => option.value === item.manualsID)
    );
    if (oldRowsForManualsTable?.length > 0) {
      setRowsForManualTable([
        ...oldRowsForManualsTable,
        ...generateRowsForDataGridForIDandStatus(
          showManualDetails,
          "manualsID"
        ),
      ]);
    } else {
      setRowsForManualTable(
        generateRowsForDataGridForIDandStatus(showManualDetails, "manualsID")
      );
    }
    
  };
  const handleEditClickForManualTable = (id) => () => {
    setRowModesModelForManualTable({
      ...rowModesModelForManualTable,
      [id]: { mode: GridRowModes.Edit },
    });
  };
  const handleSaveClickForManualTable = (id) => () => {
    setRowModesModelForManualTable({
      ...rowModesModelForManualTable,
      [id]: { mode: GridRowModes.View },
    });
  };
  const handleCancelClickForManualTable = (id) => () => {
    setRowModesModelForManualTable({
      ...rowModesModelForManualTable,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdateForManual = (newRow) => {
    setIsLoading(true);
    const updatedRow = {
      ...newRow,
      isNew: false,
      status: newRow?.statusName === "Active" ? 1 : 2,
    };
    setRowsForManualTable(
      rowsForManualTable.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    putCrudApi(
      "api/v1/user/product/manuals/" + updatedRow?.productManualsID,
      updatedRow
    ).then((res) => {});
    setIsLoading(false);
    return updatedRow;
  };

  const handleRowModesModelChangeForManual = (newRowModesModel) => {
    setRowModesModelForManualTable(newRowModesModel);
  };

  const handleRowEditStopForManual = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const generateColumnsForManual = () => {
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
      field: "linkName",
      headerName: "Name",
      editable: false,
      minWidth: 250,
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
      minWidth: 150,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode =
          rowModesModelForManualTable[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FaSave size={20} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClickForManualTable(id)}
            />,
            <GridActionsCellItem
              icon={<GiCancel size={20} />}
              label="Cancel"
              sx={{
                color: "#ad2128",
              }}
              className="textPrimary"
              onClick={handleCancelClickForManualTable(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<GrEdit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClickForManualTable(id)}
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
      manualsId: idsStatusToArray(manualOptions, "value"),
    };
    await postCrudApi("api/v1/product/ins_manuals_by_prd", data)
      .then((data) => {
        setUpdateUI(!updateUI);
        if (data) toast.success("Added Successfully");
        else {
          toast.error("Operation was not performed");
        }
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
              <div className="">
                <label className="productLabelClass">Manual Name</label>
                <Select
                  onChange={onSelectManualsOptions}
                  styles={SelectStyle}
                  isMulti
                  value={manualOptions}
                  options={selectOptionsMap(
                    manualDetails !== ""
                      ? manualDetails?.filter((e) => e.status === 1)
                      : manualDetails,
                    "manualsID",
                    "linkName"
                  ).filter(
                    (option) =>
                      !getManualDetails?.some(
                        (manual) => manual.manualsID === option.value
                      )
                  )}
                  className="Drive-dropdown-input"
                />
              </div>

              {rowsForManualTable?.length > 0 ? (
                <div className="productDetailsThirdTable">
                  <DataGrid
                    editMode="row"
                    rowModesModel={rowModesModelForManualTable}
                    onRowModesModelChange={handleRowModesModelChangeForManual}
                    onRowEditStop={handleRowEditStopForManual}
                    processRowUpdate={processRowUpdateForManual}
                    columns={generateColumnsForManual()}
                    rows={rowsForManualTable}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 4 },
                      },
                    }}
                    className="productDetailsTable3"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          {manualOptions?.length > 0 ? (
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
