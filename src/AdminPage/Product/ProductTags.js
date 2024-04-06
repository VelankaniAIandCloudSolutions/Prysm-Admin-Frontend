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
  generateRowsForDataGridForIDandIsActive,
  idsStatusToArray,
  selectOptionsMap,
} from "../../Helpers/Helpers";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

export default function ProductTag({ productId }) {
  const [tagDetails, setTagDetails] = useState([]);
  const [tagOptions, setTagOptions] = useState("");
  const [getTagDetails, setGetTagDetails] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [updateUI, setUpdateUI] = useState(true);

  const [oldRowsForTagsTable, setOldRowsForTagsTable] = useState([]);

  const [rowModesModelForTagTable, setRowModesModelForTagTable] = useState({});
  const [rowsForTagTable, setRowsForTagTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tagsDetailsOptions = async () => {
    await getCrudApi("api/v1/product_tag", {}).then((data) => {
      setTagDetails(data);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await tagsDetailsOptions();
      await getTagsByProductId(productId);
      await getAllProductCategory();
    })();
    setIsLoading(false);
  }, [updateUI]);
  const getTagsByProductId = async (id) => {
    await getCrudApi("api/v1/product/tags_by_prd/" + id, {}).then((data) => {
      if (data) {
        setTagOptions([]);
        setGetTagDetails(data);
        setRowsForTagTable(
          generateRowsForDataGridForIDandIsActive(data, "productTagID")
        );
        setOldRowsForTagsTable(
          generateRowsForDataGridForIDandIsActive(data, "productTagID")
        );
      }
    });
  };
  const getAllProductCategory = async () => {
    getCrudApi("api/v1/product_category").then((data) => {
      setProductCategoryData(data);
    });
  };
  const onSelectTagsOptions = (selectedOption) => {
    setTagOptions(selectedOption);

    const showTagDetails = tagDetails?.filter((item) =>
      selectedOption?.some((option) => option.value === item.productTagID)
    );
    if (oldRowsForTagsTable?.length > 0) {
      setRowsForTagTable([
        ...oldRowsForTagsTable,
        ...generateRowsForDataGridForIDandIsActive(
          showTagDetails,
          "productTagID"
        ),
      ]);
    } else {
      setRowsForTagTable(
        generateRowsForDataGridForIDandIsActive(showTagDetails, "productTagID")
      );
    }
   
  };
  const handleEditClickForTagTable = (id) => () => {
    setRowModesModelForTagTable({
      ...rowModesModelForTagTable,
      [id]: { mode: GridRowModes.Edit },
    });
  };
  const handleSaveClickForTagTable = (id) => () => {
    setRowModesModelForTagTable({
      ...rowModesModelForTagTable,
      [id]: { mode: GridRowModes.View },
    });
  };
  const handleCancelClickForTagTable = (id) => () => {
    setRowModesModelForTagTable({
      ...rowModesModelForTagTable,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdateForTag = (newRow) => {
    setIsLoading(true);
    const updatedRow = {
      ...newRow,
      productID: productId,
      isNew: false,
      isActive: newRow?.statusName === "Active" ? 1 : 2,
    };
    setRowsForTagTable(
      rowsForTagTable.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    putCrudApi(
      "api/v1/product/upd_tags/" + updatedRow?.productTagID,
      updatedRow
    )
      .then((res) => {
        if (res) toast.success("Successfully updated");
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

  const handleRowModesModelChangeForTag = (newRowModesModel) => {
    setRowModesModelForTagTable(newRowModesModel);
  };

  const handleRowEditStopForTag = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const generateColumnsForTag = () => {
    let columnsArray = [];

    columnsArray.push({
      field: "productTagID",
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
      minWidth: 250,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
    });
    columnsArray.push({
      field: "productCategoryID",
      headerName: "Product Category",
      editable: false,
      minWidth: 250,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
      renderCell: (params) => {
        const category = productCategoryData?.find(
          (cat) => cat.productCategoryID === params.row.productCategoryID
        );
        return category ? <span>{category.name}</span> : null;
      },
    });
    columnsArray.push({
      field: "productTagCategoryID",
      headerName: "Parent Product Tag",
      editable: false,
      minWidth: 250,
      disableColumnMenu: true,
      disableColumnFilter: true,
      disableColumnSelector: true,
      sortable: false,
      renderCell: (params) => {
        const tagCategory = tagDetails?.find(
          (cat) => cat.productTagID === params.row.productTagCategoryID
        );
        return tagCategory ? <span>{tagCategory.name}</span> : null;
      },
    });
    columnsArray.push({
      field: "statusName",
      headerName: "Status",
      editable: true,
      type: "singleSelect",
      valueOptions: ["Active", "Inactive"],
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
          rowModesModelForTagTable[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<FaSave size={20} />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClickForTagTable(id)}
            />,
            <GridActionsCellItem
              icon={<GiCancel size={20} />}
              label="Cancel"
              sx={{
                color: "#ad2128",
              }}
              className="textPrimary"
              onClick={handleCancelClickForTagTable(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<GrEdit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClickForTagTable(id)}
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
      tagsIds: idsStatusToArray(tagOptions, "value"),
    };
    await postCrudApi("api/v1/product/ins_tags_by_prd", data)
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
                <label className="productLabelClass">Tag Name</label>
                <Select
                  onChange={onSelectTagsOptions}
                  styles={SelectStyle}
                  isMulti
                  value={tagOptions}
                  options={selectOptionsMap(
                    tagDetails !== ""
                      ? tagDetails?.filter((e) => e.isActive === 1)
                      : tagDetails,
                    "productTagID",
                    "name"
                  )?.filter(
                    (tag) =>
                      !getTagDetails?.some(
                        (opt) => opt.productTagID === tag.value
                      )
                  )}
                  className="Drive-dropdown-input"
                />
              </div>

              {rowsForTagTable?.length > 0 ? (
                <div className="productDetailsThirdTable">
                  <DataGrid
                    editMode="row"
                    rowModesModel={rowModesModelForTagTable}
                    onRowModesModelChange={handleRowModesModelChangeForTag}
                    onRowEditStop={handleRowEditStopForTag}
                    processRowUpdate={processRowUpdateForTag}
                    columns={generateColumnsForTag()}
                    rows={rowsForTagTable}
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
          {tagOptions?.length > 0 ? (
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
