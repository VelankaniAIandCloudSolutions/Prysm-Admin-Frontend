import React, { useEffect, useState } from "react";
import "./UserManagements.css";
import Select from "react-select";
import "./UserManagements.css";
import { selectOptionsMap } from "../../Helpers/Helpers";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { useLocation } from "react-router-dom";
import Error from "../../Error/Error";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";
import showPwdImg from "../../assets/Icons/closedeye.png";
import hidePwdImg from "../../assets/Icons/openeye.png";
import bcrypt from "bcryptjs";
var CryptoJS = require("crypto-js");

export default function UserModal() {
  const [allRoleId, setAllRoleId] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [supervisorId, setSupervisorId] = useState(0);
  const [userIsStaff, setUserIsStaff] = useState(0);
  const [userRoleId, setuserRoleId] = useState("");
  const [userIsActive, setUserIsActive] = useState(1);
  const [updateUI, setUpdateUI] = useState(false);
  const [NewOrUpdate, setNewOrUpdate] = useState("New");
  const [selectedTab, setSelectedTab] = useState(1);
  const [userId, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pwdDis, setPwdDis] = useState(false);
  const [showChangeBtn, setShowChangeBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currPwd, setCurrPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  //validation
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [userRoleIDError, setUserRoleIDError] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [currPwdError, setCurrPwdError] = useState(false);
  const [newPwdError, setNewPwdError] = useState(false);
  const [userAddressData, setUserAddressData] = useState([
    {
      isActive: 1,
      userAddressID: null,
      streetAddress1: null,
      streetAddress2: null,
      city: null,
      state: null,
      postalCode: null,
      addressType: null,
      email: null,
      phoneNumber: null,
      firstName: null,
      lastName: null,
    },
  ]);

  useEffect(() => {
    getAllRollId();
  }, []);

  useEffect(() => {
    getUserById();
  }, [allRoleId]);

  const location = useLocation();

  const getUserById = async () => {
    setIsLoading(true);
    if (location?.state) {
      setUserId(location?.state);
      await getCrudApi(
        `api/v1/user_account/user_acc_addr/${location?.state}`,
        {}
      )?.then((item) => {
        setNewOrUpdate("Update");
        setUserEmail(item[0].email);
        setUserFirstName(item[0].firstName);
        setUserLastName(item[0].lastName);
        setPhoneNo(item[0].phoneNumber);
        setSupervisorId(item[0].isSuperuser);
        setUserIsStaff(item[0].isStaff);
        setUserPassword(item[0].password);
        setUserIsActive(item[0].isActive);
        setUserAddressData(item[0].addressList);
        setuserRoleId(item[0].userRoleID);
        setPwdDis(true);
        setShowChangeBtn(true);
      });
    }

    setIsLoading(false);
  };
  const validateInput = () => {
    const isPhNumber = (input) => /^[+0-9]+$/.test(input);
    const isEmail = (input) => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(input);
    const validateFirstName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setFirstNameError(true);
      }
    };
    const validateState = (state) => {
      if (!state?.trim()) {
        isValid = false;
      }
    };
    const validateCity = (city) => {
      if (!city?.trim()) {
        isValid = false;
      }
    };
    const validatePostalCode = (Code) => {
      if (!Code?.trim()) {
        isValid = false;
      }
    };
    const validateAddressType = (AddressType) => {
      if (!AddressType?.trim()) {
        isValid = false;
      }
    };
    const validateAddressOne = (AddressOne) => {
      if (!AddressOne?.trim()) {
        isValid = false;
      }
    };

    const validateLastName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setLastNameError(true);
      }
    };
    const validatePhNumber = (num) => {
      if (!num?.trim() || !isPhNumber(num)) {
        isValid = false;
      }
    };
    const validateRole = (rol) => {
      if (!rol) {
        isValid = false;
        setUserRoleIDError(true);
      }
    };

    const validateMail = (mail) => {
      if (!mail?.trim() || !isEmail(mail)) {
        isValid = false;
        setMailError(true);
      }
    };
    const validatePassword = (pwd) => {
      if (!pwd?.trim()) {
        isValid = false;
        setPasswordError(true);
      }
    };
    let isValid = true;
    validateFirstName(userFirstName);
    validateLastName(userLastName);
    validateMail(userEmail);
    if (userRoleId === 2) {
      validatePhNumber(phoneNo);
    }
    validateRole(userRoleId);
    validatePassword(userPassword);
    userAddressData.map((index) => {
      validateState(index.state);
      validateCity(index.city);
      validatePostalCode(index.postalCode);
      validateAddressType(index.addressType);
      validateAddressOne(index.streetAddress1);
    });

    return isValid;
  };

  const ValidateChangePwd = () => {
    const validatechangePassword = (currpwd) => {
      if (!currpwd?.trim()) {
        setCurrPwdError(true);
      }
    };
    const validateNewchangePassword = (chpwd) => {
      if (!chpwd?.trim()) {
        setNewPwdError(true);
      }
    };
    let isValid = true;
    validatechangePassword(currPwd);
    validateNewchangePassword(newPwd);

    return isValid;
  };

  const decryptData = (password) => {
    return CryptoJS.AES.decrypt(password, "cipherAce").toString(
      CryptoJS.enc.Utf8
    );
  };

  const notifyUserDetails = (action) => {
    let message;
    let errorMessage;

    if (action === "update") {
      message = "Updated successfully!";
    } else if (action === "add") {
      message = "Added successfully!";
    } else if (action === "error") {
      errorMessage = " Enter Mandatory Fields!";
    } else if (action === "pwdSucc") {
      message = "Paswword Successfully changed!";
    } else if (action === "pwdFail") {
      errorMessage = "Incorrect Password!";
    } else {
      return;
    }
    if (message) toast.success(message);
    else if (errorMessage) toast.error(errorMessage);
  };

  const OnAddUserDetails = (e) => {
    e.preventDefault();
    const AddUserDetails = [...userAddressData];
    let UserDetails = {
      isActive: 1,
      userAddressID: null,
      streetAddress1: null,
      streetAddress2: null,
      city: null,
      state: null,
      postalCode: null,
      addressType: null,
      email: null,
      phoneNumber: null,
      firstName: null,
      lastName: null,
    };
    AddUserDetails.push(UserDetails);
    setUserAddressData(AddUserDetails);
  };

  const getAllRollId = async () => {
    setIsLoading(true);
    const data = await getCrudApi("api/v1/role");
    setAllRoleId(data);
    setIsLoading(false);
  };

  const handleTabClick = (id) => {
    setSelectedTab(id);
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
      fontSize: "14px",
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

  const onEditSave = async () => {
    setIsLoading(true);
    setMailError(false);
    setUserRoleIDError(false);
    setLastNameError(false);
    setFirstNameError(false);
    setPasswordError(false);
    if (validateInput()) {
      let userJson = {
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        phoneNumber: phoneNo,
        isSuperuser: supervisorId,
        isStaff: userIsStaff,
        userRoleID: userRoleId,
        isActive: userIsActive,
        addressList: userAddressData,
      };
      if (userId !== null) {
        await putCrudApi(
          `api/v1/user_account/user_acc_addr/${userId}`,
          userJson
        )
          .then((data) => {
            setUpdateUI(!updateUI);
            if (data) notifyUserDetails("update");
            else {
              toast.error("Operation was not performed");
            }
          })
          .catch((err) => {
            toast.error("Operation was not performed");
          });
      }
    } else {
      notifyUserDetails("pwdFail");
    }
    setIsLoading(false);
  };

  const AddUsers = async () => {
    setIsLoading(true);
    if (validateInput()) {
      let userJson = {
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        password: userPassword,
        phoneNumber: phoneNo,
        isSuperuser: supervisorId,
        isStaff: userIsStaff,
        userRoleID: userRoleId,
        isActive: userIsActive,
        addressList: userAddressData,
      };
      let result = postCrudApi("api/v1/user_account/user_acc_addr", userJson);
      await result
        .then(function (res) {
          if (res) toast.success("Successfully added");
          else {
            toast.error("Operation was not performed");
          }
        })
        .catch((err) => {
          toast.error("Operation was not performed");
        });
    }
    setIsLoading(false);
  };

  const handleInputChange = (value, index, field) => {
    setUserAddressData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  // const changePwdSubmitClick = async () => {
  //   setIsLoading(true);
  //   setCurrPwd("");
  //   setNewPwd("");

  //   console.log("user password", userPassword);

  //   // let x = decryptData(userPassword);
  //   // console.log("asasasas", x);

  //   let decryptpassword = decryptData(userPassword);
  //   console.log("decrypted password =", decryptpassword);

  //   if (ValidateChangePwd()) {
  //     console.log("current password value=", currPwd);
  //     if (decryptpassword === currPwd) {
  //       let pwdchange = {
  //         password: newPwd,
  //       };
  //       await putCrudApi(
  //         `api/v1/user_account/user_acc_psw/${userId}`,
  //         pwdchange
  //       ).then((data) => {
  //         if (data) {
  //           setUpdateUI(!updateUI);
  //           notifyUserDetails("pwdSucc");
  //           setModalOpen(false);
  //         } else {
  //           notifyUserDetails("error");
  //         }
  //       });
  //     } else {
  //       notifyUserDetails("pwdFail");
  //     }
  //   }
  //   setIsLoading(false);
  // };
  async function verifyPassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
  const changePwdSubmitClick = async () => {
    setIsLoading(true);
    setCurrPwd("");
    setNewPwd("");

    const isMatch = await verifyPassword(currPwd, userPassword);

    // let decryptpassword = decryptData(userPassword);
    console.log("si match value=", isMatch);
    if (ValidateChangePwd()) {
      if (isMatch) {
        let pwdchange = {
          password: newPwd,
        };
        await putCrudApi(
          `api/v1/user_account/user_acc_psw/${userId}`,
          pwdchange
        ).then((data) => {
          if (data) {
            setUpdateUI(!updateUI);
            notifyUserDetails("pwdSucc");
            setModalOpen(false);
            getUserById();
          } else {
            notifyUserDetails("error");
          }
        });
      } else {
        notifyUserDetails("pwdFail");
      }
    }
    setIsLoading(false);
  };

  const HandleNameChange = (e) => {
    const value = e.target.value;
    const isEmail = (input) => /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(input);
    if (!value?.trim() || !isEmail(value)) {
      setMailError(true);
    } else {
      setMailError(false);
    }
    setUserEmail(value);
  };

  const HandleFnameChange = (e) => {
    const value = e.target.value;
    if (!value?.trim()) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
    setUserFirstName(value);
  };
  const PasswordChange = (e) => {
    const value = e.target.value;
    if (!value?.trim()) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    setUserPassword(value);
  };
  const checkPwd = (e) => {
    const value = e.target.value;
    if (!value?.trim()) {
      setCurrPwdError(true);
    } else {
      setCurrPwdError(false);
    }
    setCurrPwd(value);
  };

  const checkNewPwd = (e) => {
    const value = e.target.value;
    if (!value?.trim()) {
      setNewPwdError(true);
    } else {
      setNewPwdError(false);
    }
    setNewPwd(value);
  };

  const HandleLnameChange = (e) => {
    const value = e.target.value;
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    if (!value?.trim() || !isAlphaNumeric(value)) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
    setUserLastName(value);
  };

  const HandlePhNoChange = (e) => {
    const value = e.target.value;
    setPhoneNo(value);
  };

  const HandleRoleIDChange = (e) => {
    const value = e?.value;
    if (!value) {
      setUserRoleIDError(true);
    } else {
      setUserRoleIDError(false);
    }
    setuserRoleId(value);
  };
  const onchangePwd = () => {
    setModalOpen(true);
  };
  const onClose = () => {
    setModalOpen(false);
    setNewPwd("");
    setCurrPwd("");
    setCurrPwdError("");
    setNewPwdError("");
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="user-add-update-div">
            {NewOrUpdate === "New" ? (
              <button
                type="button"
                className="user-Modal-btn"
                onClick={AddUsers}
              >
                Add
              </button>
            ) : (
              <button
                type="button"
                className="user-Modal-btn"
                onClick={onEditSave}
              >
                Update
              </button>
            )}
          </div>
          <ul className="Tab-UserMangement">
            <li
              className={selectedTab === 1 ? "active" : ""}
              onClick={() => handleTabClick(1)}
            >
              User-Details
            </li>
            <li
              className={selectedTab === 2 ? "active" : ""}
              onClick={() => handleTabClick(2)}
            >
              User-AddressDetails
            </li>
          </ul>

          <div>
            {selectedTab === 1 && (
              <div>
                <h2 className="user-modal-title">User-Details</h2>
                <div className="contactInputFields">
                  <div className="user-inputfields">
                    <label className="user-label-class">
                      User Name <i class="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="text"
                      placeholder="User Name"
                      value={userEmail}
                      className="user-textbox-input"
                      onChange={HandleNameChange}
                    />
                    {mailError && <Error message={"Required*"} />}
                  </div>
                  <div className="user-inputfields">
                    <div className="user-change-btn-container">
                      <button
                        className={
                          showChangeBtn
                            ? "user-Change-btn"
                            : "user-ShowChangebtn "
                        }
                        onClick={onchangePwd}
                      >
                        Change Password
                      </button>
                    </div>
                    {modalOpen ? (
                      <div className="productTags-Modal ">
                        <div className="productTags-modalContainer">
                          <div className="productTags-header-modal">
                            <h5 className="productTags-header-title">
                              Change Password
                            </h5>
                          </div>
                          <div className="user-pwd-Inputsfields">
                            <label className="productTags-label-class">
                              Current Password {""}
                              <i className="fa fa-asterisk aster-risk-Icon"></i>
                            </label>

                            <input
                              type="password"
                              onChange={checkPwd}
                              placeholder="Current Password"
                              className="productTags-textbox-input"
                              value={currPwd}
                            />
                            {currPwdError && <Error message={"Required*"} />}
                          </div>
                          <div className="user-pwd-Inputsfields">
                            <label className="productTags-label-class">
                              New Password {""}
                              <i className="fa fa-asterisk aster-risk-Icon"></i>
                            </label>

                            <input
                              type={passwordVisible ? "text" : "password"}
                              onChange={checkNewPwd}
                              placeholder="New Password"
                              className="productTags-textbox-input"
                              value={newPwd}
                            />

                            <img
                              className="user-pwd-container"
                              title={
                                passwordVisible
                                  ? "Hide password"
                                  : "Show password"
                              }
                              src={passwordVisible ? showPwdImg : hidePwdImg}
                              onClick={() =>
                                setPasswordVisible((prevState) => !prevState)
                              }
                              alt="Eye"
                            />
                            {newPwdError && <Error message={"Required*"} />}
                          </div>

                          <div className="productTags-footer-modal">
                            <button
                              type="button"
                              className="productTags-Add-btn"
                              onClick={changePwdSubmitClick}
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="productTags-Add-btn"
                              onClick={onClose}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <label className="user-label-class">
                      Password <i class="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="password"
                      placeholder="Password"
                      value={userPassword}
                      className="user-textbox-input"
                      onChange={PasswordChange}
                      disabled={pwdDis}
                    />
                    {passwordError && <Error message={"Required*"} />}
                  </div>
                  <div className="user-inputfields">
                    <label className="user-label-class">
                      First Name <i class="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="text"
                      placeholder="First Name"
                      value={userFirstName}
                      className="user-textbox-input"
                      onChange={HandleFnameChange}
                    />
                    {firstNameError && <Error message={"Required*"} />}
                  </div>
                  <div className="user-inputfields">
                    <label className="user-label-class">
                      Last Name <i class="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={userLastName}
                      className="user-textbox-input"
                      onChange={HandleLnameChange}
                    />
                    {lastNameError && <Error message={"Required*"} />}
                  </div>
                  <div className="user-inputfields">
                    <label className="user-label-class">
                      Phone Number{" "}
                      {userRoleId === 2 ? (
                        <i class="fa fa-asterisk aster-risk-Icon"></i>
                      ) : (
                        ""
                      )}
                    </label>

                    <input
                      type="text"
                      placeholder="PhoneNumber"
                      value={phoneNo}
                      className="user-textbox-input"
                      onChange={HandlePhNoChange}
                    />
                    {userRoleId === 2 && <Error message={"Required*"} />}
                  </div>
                  <div className="user-inputfields">
                    <label className="user-label-class">
                      Role ID <i class="fa fa-asterisk aster-risk-Icon"></i>
                    </label>

                    <Select
                      className="select-dropdown"
                      value={selectOptionsMap(
                        allRoleId,
                        "userRoleID",
                        "roleName"
                      ).filter((data) => data.value === userRoleId)}
                      onChange={HandleRoleIDChange}
                      options={selectOptionsMap(
                        allRoleId,
                        "userRoleID",
                        "roleName"
                      )}
                      styles={SelectStyle}
                    />
                    {userRoleIDError && <Error message={"Required*"} />}
                  </div>
                  <div className="checkboxDivContainer">
                    <div className="UserMangement_checkboxDiv">
                      <label className="user-checkBox-label-class">
                        IsActive
                      </label>
                      <input
                        type="checkbox"
                        className="userMangementCheckbox"
                        checked={userIsActive === 1}
                        onChange={() =>
                          setUserIsActive(userIsActive === 0 ? 1 : 0)
                        }
                      />
                    </div>

                    <div className="UserMangement_checkboxDiv">
                      <label className="user-checkBox-label-class">
                        IsStaff
                      </label>
                      <input
                        className="userMangementCheckbox"
                        type="checkbox"
                        checked={userIsStaff === 1}
                        onChange={() =>
                          setUserIsStaff(userIsStaff === 0 ? 1 : 0)
                        }
                      />
                    </div>
                    <div className="UserMangement_checkboxDiv">
                      <label className="user-checkBox-label-class">
                        IsSuperuser{" "}
                      </label>
                      <input
                        type="checkbox"
                        checked={supervisorId === 1}
                        onChange={() =>
                          setSupervisorId(supervisorId === 0 ? 1 : 0)
                        }
                        className="userMangementCheckbox"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 2 && (
              <>
                <div>
                  {userAddressData?.map((data, index) => (
                    <>
                      <h2 className="user-modal-title">User-AddressDetails</h2>
                      <div className="contactInputFields">
                        <div className="user-inputfields">
                          <label className="user-label-class">User Email</label>
                          <input
                            value={data.email}
                            onChange={(e) =>
                              handleInputChange(e.target.value, index, "email")
                            }
                            type="email"
                            placeholder=" UserName"
                            className="user-textbox-input"
                          />
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">First Name</label>
                          <input
                            value={data.firstName}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "firstName"
                              )
                            }
                            type="text"
                            placeholder="FirstName"
                            className="user-textbox-input"
                          />
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">Last Name</label>
                          <input
                            value={data.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "lastName"
                              )
                            }
                            type="text"
                            placeholder="LastName"
                            className="user-textbox-input"
                          />
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            Phone Number{" "}
                          </label>
                          <input
                            value={data.phoneNumber}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "phoneNumber"
                              )
                            }
                            type="text"
                            placeholder="PhoneNumber"
                            className="user-textbox-input"
                          />
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            Street Address 1{" "}
                            <i class="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            value={data.streetAddress1}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "streetAddress1"
                              )
                            }
                            type="text"
                            placeholder="Street Address 1"
                            className="user-textbox-input"
                          />
                          {data.streetAddress1 === "" && (
                            <Error message={"Required*"} />
                          )}
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            Street Address 2{" "}
                          </label>
                          <input
                            value={data.streetAddress2}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "streetAddress2"
                              )
                            }
                            type="text"
                            placeholder="Street Address 2"
                            className="user-textbox-input"
                          />
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            Address Type{" "}
                            <i class="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            value={data.addressType}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "addressType"
                              )
                            }
                            type="text"
                            placeholder="Address Type"
                            className="user-textbox-input"
                          />
                          {data.addressType === "" && (
                            <Error message={"Required*"} />
                          )}
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            City <i class="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            value={data.city}
                            onChange={(e) =>
                              handleInputChange(e.target.value, index, "city")
                            }
                            type="text"
                            placeholder="City"
                            className="user-textbox-input"
                          />
                          {data.city === "" && <Error message={"Required*"} />}
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            State <i class="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            value={data.state}
                            onChange={(e) =>
                              handleInputChange(e.target.value, index, "state")
                            }
                            type="text"
                            placeholder="State"
                            className="user-textbox-input"
                          />
                          {data.state === "" && <Error message={"Required*"} />}
                        </div>
                        <div className="user-inputfields">
                          <label className="user-label-class">
                            Postal Code{" "}
                            <i class="fa fa-asterisk aster-risk-Icon"></i>
                          </label>
                          <input
                            value={data.postalCode}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                index,
                                "postalCode"
                              )
                            }
                            type="text"
                            placeholder="Postal Code"
                            className="user-textbox-input"
                          />
                          {data.postalCode === "" && (
                            <Error message={"Required*"} />
                          )}
                        </div>
                        <div className="user-status-checkBoxes ">
                          <div className="user-checkbox">
                            <label className="user-label-class">Status</label>
                            <input
                              className="user-modalCheckbox"
                              checked={data.isActive === 1 ? true : false}
                              type="checkbox"
                              onChange={(e) => {
                                handleInputChange(
                                  e.target.checked ? 1 : 2,
                                  index,
                                  "isActive"
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="user-add-btn-div">
                  <button
                    onClick={OnAddUserDetails}
                    className="user-modal-open-btn"
                  >
                    <FaPlus />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
