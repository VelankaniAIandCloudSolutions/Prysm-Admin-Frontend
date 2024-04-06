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

export default function ProductHowtos({ productId }) {
  const [howToDetails, setHowToDetails] = useState("");
  const [howToOptions, setHowToOptions] = useState("");
  const [getHowToDetails, setGetHowToDetails] = useState([]);
  const [updateUI, setUpdateUI] = useState(true);
  const [oldRowsForHowToTable, setOldRowsForHowToTable] = useState([]);
  const [rowModesModelForHowToTable, setRowModesModelForHowToTable] =
    React.useState({});
  const [rowsForHowToTable, setRowsForHowToTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const howTosDetailsOptions = async () => {
    await getCrudApi("api/v1/howto/", {}).then((data) => {
      setHowToDetails(data);
    });
  };

  const getHowTosByProductId = async (id) => {
    await getCrudApi("api/v1/product/howtos_by_prd/" + id, {}).then((data) => {
      if (data) {
        setHowToOptions([]);
        setGetHowToDetails(data);
        setRowsForHowToTable(
          generateRowsForDataGridForIDandStatus(data, "howtoID")
        );
        setOldRowsForHowToTable(
          generateRowsForDataGridForIDandStatus(data, "howtoID")
        );
      }
    });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await howTosDetailsOptions();
      await getHowTosByProductId(productId);
    })();
    setIsLoading(false);
  }, [updateUI]);
  const onSelectHowTosOptions = (selectedOption) => {
    setHowToOptions(selectedOption);

    const showHowToDetails = howToDetails.filter((item) =>
      selectedOption?.some((option) => option.value === item.howtoID)
    );
    if (oldRowsForHowToTable?.length > 0) {
      setRowsForHowToTable([
        ...oldRowsForHowToTable,
        ...generateRowsForDataGridForIDandStatus(showHowToDetails, "howtoID"),
      ]);
    } else {
      setRowsForHowToTable(
        generateRowsForDataGridForIDandStatus(showHowToDetails, "howtoID")
      );
    }
    
  };
  const handleEditClickForHowToTable = (id) => () => {
    setRowModesModelForHowToTable({
      ...rowModesModelForHowToTable,
      [id]: { mode: GridRowModes.Edit },
    });
  };
  const handleSaveClickForHowToTable = (id) => () => {
    setRowModesModelForHowToTable({
      ...rowModesModelForHowToTable,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClickForHowToTable = (id) => () => {
    setRowModesModelForHowToTable({
      ...rowModesModelForHowToTable,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdateForHowTo = (newRow) => {
    setIsLoading(true);
    let updatedRow = {
      ...newRow,
      isNew: false,
      status: newRow?.statusName === "Active" ? 1 : 2,
    };
    setRowsForHowToTable(
      rowsForHowToTable.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    putCrudApi(
      "api/v1/user/product/howto/" + updatedRow?.productHowtoID,
      updatedRow
    )
      .then((res) => {
        if (res) toast.success("Updated successfully");
        else {
          toast.error("Operation was not performed");
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
    return updatedRow;
  };

  const handleRowModesModelChangeForHowTo = (newRowModesModel) => {
    setRowModesModelForHowToTable(newRowModesModel);
  };

  const handleRowEditStopForHowTo = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const generateColumnsForHowTo = () => {
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
          rowModesModelForHowToTable[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FaSave size={20} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClickForHowToTable(id)}
            />,
            <GridActionsCellItem
              icon={<GiCancel size={20} />}
              label="Cancel"
              sx={{
                color: "#ad2128",
              }}
              className="textPrimary"
              onClick={handleCancelClickForHowToTable(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<GrEdit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClickForHowToTable(id)}
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
      howTosId: idsStatusToArray(howToOptions, "value"),
    };
    await postCrudApi("api/v1/product/ins_howtos_by_prd", data)
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
                <label className="productLabelClass">How To's Name</label>
                <Select
                  onChange={onSelectHowTosOptions}
                  styles={SelectStyle}
                  isMulti
                  value={howToOptions}
                  options={selectOptionsMap(
                    howToDetails !== ""
                      ? howToDetails?.filter((e) => e.status === 1)
                      : howToDetails,
                    "howtoID",
                    "linkName"
                  )?.filter(
                    (option) =>
                      !getHowToDetails?.some(
                        (howto) => howto.howtoID === option.value
                      )
                  )}
                  className="Drive-dropdown-input"
                />
              </div>
              {rowsForHowToTable?.length > 0 ? (
                <div className="productDetailsSecondTable">
                  <DataGrid
                    editMode="row"
                    rowModesModel={rowModesModelForHowToTable}
                    onRowModesModelChange={handleRowModesModelChangeForHowTo}
                    onRowEditStop={handleRowEditStopForHowTo}
                    processRowUpdate={processRowUpdateForHowTo}
                    columns={generateColumnsForHowTo()}
                    rows={rowsForHowToTable}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 4 },
                      },
                    }}
                    className="productDetailsTable2"
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            {howToOptions?.length > 0 ? (
              <button onClick={handleAdd} className="productDetailsModalBtn">
                Add
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
}
