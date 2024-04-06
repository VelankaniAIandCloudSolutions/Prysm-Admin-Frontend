import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import "./Ticket.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
import { getDecodedTokenDataTicket } from "../../Helpers/validateToken";
import { selectOptionsMap } from "../../Helpers/Helpers";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

function Ticket() {
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [allTicketData, setAllTicketData] = useState([]);
  const [openTicketData, setOpenTicketData] = useState([]);
  const [assignTicketData, setAssignTicketData] = useState([]);
  const [assignedToMeTicketData, setAssignedToMeTicketData] = useState([]);
  const [ticketTableData, setTicketTableData] = useState([]);
  const [data, setData] = useState([]);
  const [roleId, setRoleId] = useState([]);
  const [assignUserName, setAssignUserName] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [isUserRole, setIsUserRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState([]);
  const generateColumns = () => {
    let columnsArray = [];
    columnsArray.push({
      name: "eticketId",
      label: "id",
      options: {
        display: false,
      },
    });

    columnsArray.push({
      name: "serialNumber",
      label: "Serial Number",
    });
    columnsArray.push({
      name: "issueDescription",
      label: "Description",
    });
    columnsArray.push({
      name: "status",
      label: "status",
      options: {
        customBodyRender: (value, tableMeta) => {
          const Tstatus = statusData.find(
            (item) => item.statusID === value
          )?.statusName;
          return Tstatus || null;
        },
      },
    });
    columnsArray.push({
      name: "assignee",
      label: "Assined To",
      options: {
        customBodyRender: (value, tableMeta) => {
          const Tstatus = assignUserName.find(
            (item) => item.id === value
          )?.email;
          return Tstatus || null;
        },
      },
    });
    columnsArray.push({
      name: "priorityLevel",
      label: "Priority",
      options: {
        customBodyRender: (value, tableMeta) => {
          const Tstatus = priorityData.find(
            (item) => item.value === value
          )?.label;
          return Tstatus || null;
        },
      },
    });
    return columnsArray;
  };
  const priorityData = [
    {
      label: "High",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "Low",
      value: 3,
    },
  ];
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getTickets();
    })();
    setIsLoading(false);
  }, []);

  const getTickets = async () => {
    getCrudApi("api/v1/ticket", {}).then((data) => {
      if (data) {
        const decodedData = getDecodedTokenDataTicket();
        setData(data);
        if (
          decodedData?.role !== 1 &&
          (decodedData?.role === 6 ||
            decodedData?.role === 7 ||
            decodedData?.role === 8)
        ) {
          let dataBasedOnUserId = data?.filter(
            (dt) => dt?.assignee === decodedData.userId
          );
          setTicketTableData(dataBasedOnUserId);
          let assigned = dataBasedOnUserId?.filter(function (iterator) {
            if (iterator) return iterator.status === 6;
          });
          setAssignTicketData(assigned);

          let openTicketData = dataBasedOnUserId?.filter(function (iterator) {
            if (iterator) return iterator.status === 2;
          });
          setOpenTicketData(openTicketData);

          let assigned2Me = dataBasedOnUserId?.filter(function (iterator) {
            if (iterator) return iterator.assignee === decodedData.userId;
          });
          setAssignedToMeTicketData(assigned2Me);
          setAllTicketData(dataBasedOnUserId);
        } else {
          setTicketTableData(data);

          let assigned = data?.filter(function (iterator) {
            if (iterator) return iterator.status === 6;
          });
          setAssignTicketData(assigned);

          let openTicketData = data?.filter(function (iterator) {
            if (iterator) return iterator.status === 2;
          });
          setOpenTicketData(openTicketData);

          let assigned2Me = data?.filter(function (iterator) {
            if (iterator) return iterator.assignee === decodedData.userId;
          });
          setAssignedToMeTicketData(assigned2Me);

          setAllTicketData(data);
        }
      }
    });
  };

  const getStatus = async () => {
    const data = await getCrudApi("api/v1/ticket_status");
    setStatusData(data);
  };

  const getRoles = async (role) => {
    const data = await getCrudApi("api/v1/role");
    setRoleId(data.filter((data) => data?.userRoleID === role)[0]?.userRoleID);
    setIsUserRole(role === 1 ? true : false);
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const decodedData = getDecodedTokenDataTicket();
      await getRoles(decodedData.role);
      await getStatus();
    })();
    setIsLoading(false);
  }, []);

  let selectedRows = [];
  const navigate = useNavigate();
  function HandleRowClick(dataIndex) {
    const rowData = data.filter((item) => item.eticketId === dataIndex[0]);
    navigate("/Ticket/ReviewTicket", {
      state: { id: rowData[0]?.eticketId },
    });
  }

  const handleSelectedRow = (
    currentRowsSelected,
    allRowsSelected,
    rowsSelected
  ) => {
    selectedRows = [];
    allRowsSelected?.map((index) => {
      let rowData = ticketTableData[index.index];
      selectedRows.push(rowData?.eticketId);
    });
    selectedRows.toString(",");
  };

  const handleAssign = () => {
    if (selectedRows.length > 0) {
      navigate("/Ticket/TicketAssign", {
        state: { ids: [...new Set(selectedRows)].join(","), data },
      });
    } else {
      toast.error("Select the ticket to assign");
    }
  };

  const options = {
    filterType: "checkbox",
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    selectableRows: isUserRole ? "multiple" : "none",
    onRowClick: HandleRowClick,
    textLabels: {
      filter: {
        title: "Filter Table",
      },
    },
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      if (isUserRole) {
        handleSelectedRow(currentRowsSelected, allRowsSelected, rowsSelected);
      }
    },
  };
  const handle_all = (e) => {
    setTicketTableData(allTicketData);
  };
  const handle_assign = (e) => {
    setTicketTableData(assignTicketData);
  };
  const handle_assigned_2_me = (e) => {
    setTicketTableData(assignedToMeTicketData);
  };
  const handle_open = (e) => {
    setTicketTableData(openTicketData);
  };

  useEffect(() => {
    const getRoleId = (assignedToId) => {
      return assignUserName?.find((item) => item.id === assignedToId)
        ?.userRoleID;
    };
    const filteredData = data?.filter((row) => {
      const levelMatches =
        selectedLevels.length === 0 ||
        selectedLevels?.some(
          (level) => getRoleId(row.assignee) === level.value
        );

      const assignedToMatches =
        selectedAssignedTo.length === 0 ||
        selectedAssignedTo.some(
          (assignedTo) => row.assignee === assignedTo.value
        );

      const statusMatches =
        selectedStatus.length === 0 ||
        selectedStatus?.some((status) => row.status === status.value);

      const priorityMatches =
        priority.length === 0 ||
        priority?.some((p) => row.priorityLevel === p.value);

      return (
        levelMatches && assignedToMatches && statusMatches && priorityMatches
      );
    });

    setTicketTableData(filteredData);
  }, [selectedLevels, selectedAssignedTo, selectedStatus, priority]);

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

  const assignedToOptions = async () => {
    await getCrudApi("api/v1/user_account/", {}).then((data) => {
      setAssignUserName(data);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    assignedToOptions();
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ticketContainer">
          <div className="Ticket_Div">
            <div>
              <div className="filter_buttons_div">
                <div className="buttons_container">
                  <div className="All_NoFilter_Button" onClick={handle_all}>
                    <p>All</p>
                    <div className="All_Button_count_div">
                      {allTicketData.length}
                    </div>
                  </div>
                  <div
                    onClick={handle_open}
                    className={`customDiv1
                `}
                  >
                    <p>Open</p>
                    <div className="In-process_count_div">
                      {openTicketData.length}
                    </div>
                  </div>
                  {roleId === 1 ? (
                    <div
                      onClick={handle_assign}
                      className={`customDiv2
                `}
                    >
                      <p>Assigned</p>
                      <div className="open_count_div">
                        {assignTicketData.length}
                      </div>
                    </div>
                  ) : null}

                  {roleId === 1 ? (
                    <div
                      onClick={handle_assigned_2_me}
                      className={`customDiv3 
                `}
                    >
                      <p>Assigned to me</p>
                      <div className="Closed_count_div">
                        {assignedToMeTicketData.length}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="filterDropdownsContainer">
                {roleId === 1 ? (
                  <>
                    <div className="levelFilterContainer">
                      <label>
                        <b>Level :</b>
                      </label>
                      <Select
                        options={[
                          { label: "Tier 1", value: 6 },
                          { label: "Tier 2", value: 7 },
                          { label: "Tier 3", value: 8 },
                        ]}
                        isMulti
                        className="levelFilter"
                        styles={SelectStyle}
                        value={selectedLevels}
                        onChange={(e) => setSelectedLevels(e)}
                      />
                    </div>

                    <div className="AssigedToFilterContainer">
                      <label>
                        <b>Assigned to :</b>
                      </label>
                      <Select
                        options={selectOptionsMap(
                          assignUserName?.filter((e) => e.isActive === 1),
                          "id",
                          "email"
                        )}
                        isMulti
                        className="AssigedToFilter"
                        styles={SelectStyle}
                        value={selectedAssignedTo}
                        onChange={(e) => setSelectedAssignedTo(e)}
                      />
                    </div>
                  </>
                ) : null}
                <div className="statusFilterContainer">
                  <label>
                    <b>Status :</b>
                  </label>
                  <Select
                    options={selectOptionsMap(
                      statusData,
                      "statusID",
                      "statusName"
                    )}
                    isMulti
                    className="statusFilter"
                    styles={SelectStyle}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e)}
                  />
                </div>
                <div className="statusFilterContainer">
                  <label>
                    <b>Priority :</b>
                  </label>
                  <Select
                    options={priorityData}
                    isMulti
                    className="statusFilter"
                    styles={SelectStyle}
                    value={priority}
                    onChange={(e) => setPriority(e)}
                  />
                </div>
              </div>

              <div className="table-scroll">
                <MUIDataTable
                  className="muitable"
                  title={"Tickets"}
                  data={ticketTableData}
                  columns={generateColumns()}
                  options={options}
                />
              </div>
              {isUserRole && (
                <div className="Assign-add-button-container">
                  <button className="Assign-btn" onClick={handleAssign}>
                    Assign
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ticket;
