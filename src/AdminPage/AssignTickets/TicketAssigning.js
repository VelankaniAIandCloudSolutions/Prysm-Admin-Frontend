import React, { useEffect, useState } from "react";
import "./AssignTickets.css";
import { useLocation } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import Select from "react-select";
import { getCrudApi, postCrudApi } from "../../webServices/webServices";
import { selectOptionsMap } from "../../Helpers/Helpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../Loading/Loading";

export default function TicketAssign() {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [usernameData, setUsernameData] = useState([]);
  const [filtereId, setFilteredId] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState("");
  const passedData = location.state?.data;
  const selectedId = location.state.ids;
  const rowId = selectedId.split(",");
  const navigate = useNavigate();
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

  const ticketsData = [
    {
      id: "1",
      ticketNumber: "128573",
      title: "Ticket1",
    },
    {
      id: "2",
      ticketNumber: "133942",
      title: "Ticket2",
    },
    {
      id: "3",
      ticketNumber: "144839",
      title: "Ticket3",
    },
    {
      id: "4",
      ticketNumber: "144839",
      title: "Ticket3",
    },
    {
      id: "5",
      ticketNumber: "144839",
      title: "Ticket3",
    },
  ];

  const usernameOptions = async () => {
    await getCrudApi("api/v1/user_account/", {}).then((data) => {
      const filteredUsernames = data;
      setUsernameData(filteredUsernames);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await usernameOptions();
      await getStatus();
    })();
    setIsLoading(false);
  }, []);

  const submitTickets = async () => {
    setIsLoading(true);
    const AssignTicketsData = {
      eTicketIDs: rowId,
      assignedTo: userEmail.value,
      status: 6,
      priorityLevel: priority?.value,
    };
    await postCrudApi("api/v1/ticket/assign_ticket", AssignTicketsData)
      .then((data) => {
        if (data) {
          toast.success(data.message);
          navigate("/Ticket");
        } else {
          toast.error("Unsuccessful");
        }
      })
      .catch((err) => {
        toast.error("Unsuccessful");
      });
    setIsLoading(false);
  };

  useEffect(() => {
    const filtereId = passedData?.filter((item) =>
      rowId.includes(item.eticketId.toString())
    );
    setFilteredId(filtereId);
  }, []);

  const generateColumns = () => {
    let columnsArray = [];
    columnsArray.push({
      name: "id",
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

    return columnsArray;
  };

  const options = {
    filterType: "checkbox",
    download: false,
    print: false,
    viewColumns: false,
    filter: false,
    selectableRows: "none",
    textLabels: {
      filter: {
        title: "Filter Table",
      },
    },
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      handleSelectedRow(currentRowsSelected, allRowsSelected);
    },
  };

  let selectedRows = [];

  const handleSelectedRow = (currentRowsSelected, allRowsSelected) => {
    allRowsSelected?.map((index) => {
      const rowData = ticketsData[index.index];
      selectedRows.push(rowData.id);
    });
    selectedRows.toString(",");
  };
  const getStatus = async () => {
    const data = await getCrudApi("api/v1/ticket_status");
    setStatusData(data);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="ReviewTicket-container">
          <div className="assign-div">
            <div className="assignto-div">
              <label>
                <b>AssignTo :</b>
              </label>
              <Select
                options={selectOptionsMap(usernameData, "id", "email")}
                value={userEmail}
                className="levelFilter"
                onChange={(e) => setUserEmail(e)}
              />
            </div>
            <div className="assignto-div">
              <label>
                <b>Priority Level :</b>
              </label>
              <Select
                options={priorityData}
                value={priority}
                className="levelFilter"
                onChange={(e) => setPriority(e)}
              />
            </div>
          </div>
          <div className="Assign-Ticket-table">
            <MUIDataTable
              columns={generateColumns()}
              data={filtereId}
              className="muitable"
              options={options}
            />
          </div>
          <div className="Assign-submit-button-container">
            {userEmail !== "" && (
              <button className="Assign-submit-btn" onClick={submitTickets}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
