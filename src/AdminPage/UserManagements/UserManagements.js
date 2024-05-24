import React, { useState, useEffect } from "react";
import "./UserManagements.css";
import { GrEdit } from "react-icons/gr";
import MUIDataTable from "mui-datatables";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getCrudApi } from "../../webServices/webServices";
import LoadingScreen from "../../Loading/Loading";

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
    getAllrole();
  }, []);

  const getAllUsers = async () => {
    setIsLoading(true);
    await getCrudApi("api/v1/user_account/", {}).then((data) => {
      setData(data);
    });
    setIsLoading(false);
  };

  const getAllrole = async () => {
    setIsLoading(true);
    await getCrudApi("api/v1/role", {}).then((role) => {
      setRoleData(role);
    });
    setIsLoading(false);
  };

  const OnAddnewclick = () => {
    navigate("/Admin/UserManagements/UserModal");
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
  };

  const onEditClick = (rowIndex) => {
    navigate("/Admin/UserManagements/UserModal", {
      state: data[rowIndex].id,
    });
  };

  const generateColumns = () => {
    let columnsArray = [];
    let firstCol = {
      name: "EDIT",
      options: {
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
      name: "email",
      label: "EMAIL",
    });
    columnsArray.push({
      name: "password",
      label: "PASSWORD",
      options: {
        display: false,
      },
    });
    columnsArray.push({
      name: "firstName",
      label: "FIRST NAME",
    });
    columnsArray.push({
      name: "lastName",
      label: "LAST NAME",
      options: {
        display: false,
      },
    });

    columnsArray.push({
      name: "isActive",
      label: "STATUS",
      options: {
        customBodyRender: (value) => (value === 1 ? "Active" : "Inactive"),
      },
    });
    columnsArray.push({
      name: "phoneNumber",
      label: "PHONE NO",
    });
    columnsArray.push({
      name: "userRoleID",
      label: "USER ROLE",
      options: {
        customBodyRender: (value, tableMeta) => {
          const userRoleName = roleData.find(
            (item) => item.userRoleID === value
          )?.roleName;
          return userRoleName || null;
        },
      },
    });
    // test

    columnsArray.push({
      name: "isStaff",
      label: "IS STAFF",
      options: {
        customBodyRender: (value) => (value ? "True" : "False"),
      },
    });
    columnsArray.push({
      name: "isSuperuser",
      label: "SUPER USER",
      options: {
        customBodyRender: (value) => (value ? "True" : "False"),
      },
    });

    return columnsArray;
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="user-container">
          <div className="user-add-button-container">
            <button className="user-modal-open-btn" onClick={OnAddnewclick}>
              Add
            </button>
          </div>

          <div className="table-scroll">
            <MUIDataTable
              title={"User Manegements"}
              data={data}
              columns={generateColumns()}
              options={options}
              className="muitable"
            />
          </div>
        </div>
      )}
    </>
  );
}
