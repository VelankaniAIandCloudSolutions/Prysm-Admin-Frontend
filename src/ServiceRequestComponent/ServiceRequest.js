import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./ServiceRequest.css";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import { GoCheckCircleFill } from "react-icons/go";
import { getCrudApi, postCrudApi } from "../webServices/webServices";
import { MdDelete } from "react-icons/md";
import Error from "../Error/Error";
import { toast } from "react-toastify";
import { FaFileAlt } from "react-icons/fa";

export default function ServiceRequest() {
  const [CurrentComponent, setCurrentComponent] = useState(0);
  const [countryOptions, setCountryOptions] = useState([]);
  const [ticketData, setTicketData] = useState({});
  const [problemTypes, setProblemTypes] = useState([]);
  //validation
  const [serialNumberError, setSerialNumberError] = useState(false);

  const [descriptionCheckError, setDescriptionCheckError] = useState(false);

  const [addressError, setAddressError] = useState(false);
  const [altMobNoError, setAltMobNoError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [fnameError, setFnameError] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [mAddressError, setMaddressError] = useState(false);
  const [mCityError, setMcityError] = useState(false);
  const [mCountryError, setmCountryError] = useState(false);
  const [mStateError, setmStateError] = useState(false);
  const [mZipError, setmZipError] = useState(false);
  const [mobNoError, setMobNoError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [stateError, setStateError] = useState(false);

  const renderCircles = () => {
    const circles = [
      "Discovery",
      "Aditional Info",
      "Contact Details",
      "Review Submission",
      "Submission Recived",
    ];
    return circles.map((circle, index) => (
      <div className="stepperFlexDiv">
        {index > 0 && index <= 4 ? (
          <div
            className="between_dev"
            key={index}
            style={{
              backgroundColor:
                index < CurrentComponent
                  ? "#e57430"
                  : index === CurrentComponent
                  ? "#e57430"
                  : "",
            }}
          ></div>
        ) : (
          <div>{""}</div>
        )}
        <div
          className="Number_in_circle"
          key={index}
          style={{
            backgroundColor:
              index < CurrentComponent
                ? "#e57430"
                : index === CurrentComponent
                ? "#e57430"
                : "",
          }}
        >
          <p className="Number_in_circle_p">{index + 1}</p>
        </div>
        {index < 4 && (
          <div
            className="between_dev"
            style={{
              backgroundColor: index < CurrentComponent ? "#e57430" : "",
            }}
          ></div>
        )}
      </div>
    ));
  };

  const handleNext = () => {
    let isAllValid = true;
    var isValid = false;
    const isNumaric = (input) => /^[0-9]+$/.test(input);
    const isAlphaNumeric = (input) => /^[a-zA-Z0-9\s]+$/.test(input);
    const isAlphabetic = (input) => /^[a-zA-Z\s]+$/.test(input);
    const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isPhoneNumber = (input) =>
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(input);

    const validateAlphaNumeric = (name) => {
      if (!name?.trim() || !isAlphaNumeric(name) || name === "") {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };
    const validateDescription = (Description) => {
      if (!Description) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };
    const validateNumaric = (number) => {
      if (!number?.trim() || !isNumaric(number)) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };
    const validatePhoneNumber = (number) => {
      if (!number?.trim() || !isPhoneNumber(number)) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };

    const validateEmail = (email) => {
      if (!email?.trim() || !isEmail(email)) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };

    const validateAlphabetic = (number) => {
      if (!number?.trim() || !isAlphabetic(number)) {
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    };
    switch (CurrentComponent) {
      case 0:
        if (discoveryRef.current !== null) {
          const checkData = discoveryRef.current.returnData();
          if (checkData?.serialNumber) {
            const numberCheck = validateAlphaNumeric(checkData?.serialNumber);
            if (numberCheck) {
              setSerialNumberError(false);
            } else {
              setSerialNumberError(true);
              isAllValid = false;
            }
          } else {
            setSerialNumberError(true);
            isAllValid = false;
          }

          let ticketJson = {
            ...ticketData,
            ...discoveryRef.current.returnData(),
          };
          setTicketData(ticketJson);
        }
        break;
      case 1:
        if (addInfoDetailsRef.current !== null) {
          const checkData1 = addInfoDetailsRef.current.returnData();

          checkData1?.issueDescription
            ? validateDescription(checkData1?.issueDescription)
              ? setDescriptionCheckError(false)
              : (() => {
                  setDescriptionCheckError(true);
                  isAllValid = false;
                })()
            : (() => {
                setDescriptionCheckError(true);
                isAllValid = false;
              })();

          let ticketJson = {
            ...ticketData,
            ...addInfoDetailsRef.current.returnData(),
          };
          setTicketData(ticketJson);
        }
        break;
      case 2:
        if (contactDetailsRef.current !== null) {
          const checkData2 = contactDetailsRef.current.returnData();

          checkData2?.address
            ? validateDescription(checkData2?.address)
              ? setAddressError(false)
              : (() => {
                  setAddressError(true);
                  isAllValid = false;
                })()
            : (() => {
                setAddressError(true);
                isAllValid = false;
              })();
          checkData2?.alternateMobileNumber
            ? validatePhoneNumber(checkData2?.alternateMobileNumber)
              ? setAltMobNoError(false)
              : (() => {
                  setAltMobNoError(true);
                  isAllValid = false;
                })()
            : (() => {
                setAltMobNoError(false);
              })();
          checkData2?.city
            ? validateAlphabetic(checkData2?.city)
              ? setCityError(false)
              : (() => {
                  setCityError(true);
                  isAllValid = false;
                })()
            : (() => {
                setCityError(true);
                isAllValid = false;
              })();
          checkData2?.companyName
            ? validateAlphabetic(checkData2?.companyName)
              ? setCompanyNameError(false)
              : (() => {
                  setCompanyNameError(true);
                  isAllValid = false;
                })()
            : (() => {
                setCompanyNameError(true);
                isAllValid = false;
              })();
          checkData2?.country
            ? validateAlphabetic(checkData2?.country)
              ? setCountryError(false)
              : (() => {
                  setCountryError(true);
                  isAllValid = false;
                })()
            : (() => {
                setCountryError(true);
                isAllValid = false;
              })();
          checkData2?.email
            ? validateEmail(checkData2?.email)
              ? setEmailError(false)
              : (() => {
                  setEmailError(true);
                  isAllValid = false;
                })()
            : (() => {
                setEmailError(true);
                isAllValid = false;
              })();
          checkData2?.firstName
            ? validateAlphabetic(checkData2?.firstName)
              ? setFnameError(false)
              : (() => {
                  setFnameError(true);
                  isAllValid = false;
                })()
            : (() => {
                setFnameError(true);
                isAllValid = false;
              })();
          checkData2?.lastName
            ? validateAlphabetic(checkData2?.lastName)
              ? setLnameError(false)
              : (() => {
                  setLnameError(true);
                  isAllValid = false;
                })()
            : (() => {
                setLnameError(true);
                isAllValid = false;
              })();
          !(checkData2.sameAsUserAddress === 1) &&
            (checkData2?.machineAddress
              ? validateAlphaNumeric(checkData2?.machineAddress)
                ? setMaddressError(false)
                : (() => {
                    setMaddressError(true);
                    isAllValid = false;
                  })()
              : (() => {
                  setMaddressError(true);
                  isAllValid = false;
                })());
          !(checkData2.sameAsUserAddress === 1) &&
            (checkData2?.machineCity
              ? validateAlphabetic(checkData2?.machineCity)
                ? setMcityError(false)
                : (() => {
                    setMcityError(true);
                    isAllValid = false;
                  })()
              : (() => {
                  setMcityError(true);
                  isAllValid = false;
                })());
          !(checkData2.sameAsUserAddress === 1) &&
            (checkData2?.machineCountry
              ? validateAlphabetic(checkData2?.machineCountry)
                ? setmCountryError(false)
                : (() => {
                    setmCountryError(true);
                    isAllValid = false;
                  })()
              : (() => {
                  setmCountryError(true);
                  isAllValid = false;
                })());
          !(checkData2.sameAsUserAddress === 1) &&
            (checkData2?.machineState
              ? validateAlphabetic(checkData2?.machineState)
                ? setmStateError(false)
                : (() => {
                    setmStateError(true);
                    isAllValid = false;
                  })()
              : (() => {
                  setmStateError(true);
                  isAllValid = false;
                })());
          !(checkData2.sameAsUserAddress === 1) &&
            (checkData2?.machinePostalCode
              ? validateNumaric(checkData2?.machinePostalCode)
                ? setmZipError(false)
                : (() => {
                    setmZipError(true);
                    isAllValid = false;
                  })()
              : (() => {
                  setmZipError(true);
                  isAllValid = false;
                })());
          checkData2?.mobileNumber
            ? validateNumaric(checkData2?.mobileNumber)
              ? setMobNoError(false)
              : (() => {
                  setMobNoError(true);
                  isAllValid = false;
                })()
            : (() => {
                setMobNoError(true);
                isAllValid = false;
              })();
          checkData2?.postalCode
            ? validateNumaric(checkData2?.postalCode)
              ? setZipCodeError(false)
              : (() => {
                  setZipCodeError(true);
                  isAllValid = false;
                })()
            : (() => {
                setZipCodeError(true);
                isAllValid = false;
              })();
          checkData2?.state
            ? validateAlphabetic(checkData2?.state)
              ? setStateError(false)
              : (() => {
                  setStateError(true);
                  isAllValid = false;
                })()
            : (() => {
                setStateError(true);
                isAllValid = false;
              })();

          let ticketJson = {
            ...ticketData,
            ...contactDetailsRef.current.returnData(),
          };
          setTicketData(ticketJson);
        }
        break;
      case 3:
        handleTicketSubmit();
        break;
      case 4:
        break;
      default:
        break;
    }
    if (CurrentComponent < 3) {
      if (isAllValid) {
        setCurrentComponent(CurrentComponent + 1);
        isAllValid = true;
      }
    }
  };

  const s3PostCall = async (path, specFile) => {
    await postCrudApi(path, specFile)
      .then((res) => {
        if (res) {
          specFile.path = res?.path;
          delete specFile["fileContent"];
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    return specFile;
  };

  const handleTicketSubmit = async () => {
    let ticketFiles = [];

    for (var j = 0; j < ticketData?.additionalFile?.length; j++) {
      let ticketFile = { ...ticketData?.additionalFile[j] };
      if (ticketFile.path === null) {
        ticketFile = await s3PostCall("api/v1/ticket_file_upd", ticketFile);
      }
      ticketFiles.push(ticketFile);
    }

    const finalTicketData = {
      additionalFile: ticketFiles,
      address: ticketData?.address,
      alternateEmail: ticketData?.alternateEmail,
      alternateMobileNumber: ticketData?.alternateMobileNumber,
      city: ticketData?.city,
      clientTicketRefNo: ticketData?.clientTicketRefNo,
      companyName: ticketData?.companyName,
      country: ticketData?.country,
      countryID: ticketData?.countryID,
      diagnosticCode: ticketData?.diagnosticCode,
      diagnosticDate: ticketData?.diagnosticDate,
      email: ticketData?.email,
      firstName: ticketData?.firstName,
      issueDescription: ticketData?.issueDescription,
      lastName: ticketData?.lastName,
      status: 2,
      machineAddress:
        ticketData?.sameAsUserAddress === 1
          ? ticketData?.address
          : ticketData?.machineAddress,
      machineCity:
        ticketData?.sameAsUserAddress === 1
          ? ticketData?.city
          : ticketData?.machineCity,
      machineCountry:
        ticketData?.sameAsUserAddress === 1
          ? ticketData?.country
          : ticketData?.machineCountry,
      machinePostalCode:
        ticketData?.sameAsUserAddress === 1
          ? ticketData?.postalCode
          : ticketData?.machinePostalCode,
      machineState:
        ticketData?.sameAsUserAddress === 1
          ? ticketData?.state
          : ticketData?.machineState,
      mobileNumber: ticketData?.mobileNumber,
      postalCode: ticketData?.postalCode,
      problemID: ticketData?.problemID,
      sameAsUserAddress: ticketData?.sameAsUserAddress,
      serialNumber: ticketData?.serialNumber,
      state: ticketData?.state,
    };

    await postCrudApi("api/v1/ticket", finalTicketData)
      .then((data) => {
        if (data) {
          setCurrentComponent(CurrentComponent + 1);
        } else {
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const notifyError = () => {
    let message = "Error Occurred";
    toast.error(message);
  };

  const handleBack = () => {
    if (CurrentComponent < 4 && CurrentComponent > 0) {
      setCurrentComponent(CurrentComponent - 1);
    }
  };

  const renderCurrentComponent = () => {
    switch (CurrentComponent) {
      case 0:
        return (
          <Discovery
            ref={discoveryRef}
            ticketData={ticketData}
            countryOptions={countryOptions}
            problemTypes={problemTypes}
            validate={{ serialNumberError }}
          />
        );
      case 1:
        return (
          <AdditionalInfo
            ref={addInfoDetailsRef}
            ticketData={ticketData}
            validate={{ descriptionCheckError }}
          />
        );
      case 2:
        return (
          <ContactDetails
            ref={contactDetailsRef}
            ticketData={ticketData}
            validate={{
              addressError,
              altMobNoError,
              cityError,
              companyNameError,
              countryError,
              emailError,
              fnameError,
              lnameError,
              mAddressError,
              mCityError,
              mCountryError,
              mStateError,
              mZipError,
              mobNoError,
              zipCodeError,
              stateError,
            }}
          />
        );
      case 3:
        return (
          <ReviewSubmission
            ref={reviewDetailsRef}
            ticketData={ticketData}
            countryOptions={countryOptions}
          />
        );
      case 4:
        return <SubmissionRecorded ref={submissionDetailsRef} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    (async () => {
      await getCrudApi("api/v1/country").then((data) => {
        setCountryOptions(data);
      });
      await getCrudApi("api/v1/problem").then((data) => {
        setProblemTypes(data);
      });
    })();
  }, []);

  const contactDetailsRef = React.useRef();
  const discoveryRef = React.useRef();
  const addInfoDetailsRef = React.useRef();
  const reviewDetailsRef = React.useRef();
  const submissionDetailsRef = React.useRef();

  return (
    <div className="ServiceRequest">
      <div className="ServiceRequest_inner_block">
        <div className="Submit_eTicket">
          <h1 className="Submit_eTicket_heading">Submit An eTicket</h1>
          <p className="Submit_eTicket_p">
            Check more details on how to submit an eTicket{" "}
            <NavLink to="">here</NavLink>
          </p>
        </div>
        <div className="TrackerLine">
          <div className="Tracker_line_div">
            <div className="Tracker_line">{renderCircles()}</div>
          </div>

          <div className="Tracker_Names">
            <p className="Tracker_Name_1">Discovery</p>
            <p className="Tracker_Name_2">Aditional Info</p>
            <p className="Tracker_Name_3">Contact Details</p>
            <p className="Tracker_Name_4">Review Submission</p>
            <p className="Tracker_Name_5">Submission Recived</p>
          </div>
        </div>

        {renderCurrentComponent()}

        <div className="ServiceRequest_bottom_Button">
          {CurrentComponent < 4 && (
            <div className="ServiceRequest_bottom_Label_Button_div">
              {CurrentComponent !== 0 ? (
                <button onClick={handleBack} className="bottomBackButton">
                  Back
                </button>
              ) : (
                <></>
              )}
              <button
                onClick={handleNext}
                className="bottom_Button globalButton"
              >
                {CurrentComponent < 3 ? "Next" : "Submit"}
              </button>
              <label className="ServiceRequest_label">
                <b>Please note:</b> Submitting this form will create a service
                request. If additional information is needed, you will receive a
                callback in accordance with your SLA. If you would rather speak
                to an agent now, please <NavLink to="">give us a call</NavLink>.
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Discovery = forwardRef((props, ref) => {
  const { serialNumberError } = props.validate;
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

  const [countryID, setCountryID] = useState("");
  const [problemTypeId, setProblemTypeId] = useState("");
  const [imeiNumber, setIMEINumber] = useState("");
  //validation

  useImperativeHandle(ref, () => ({
    returnData() {
      let discoveryData = {
        countryID: countryID,
        problemID: problemTypeId,
        serialNumber: imeiNumber,
      };
      return discoveryData;
    },
  }));

  useEffect(() => {
    setCountryID(props.ticketData.countryID);
    setProblemTypeId(props.ticketData.problemID);
    setIMEINumber(props.ticketData.serialNumber);
  }, []);

  const validateSerialNo = (e) => {
    console.log(e.target.value);
  };

  return (
    <div className="Discovery">
      <div className="Discovery_left">
        <div className="serviceRequestHeaderForPages">
          <h2>Discovery</h2>
          <span>Please provide the basic details below to get started.</span>
        </div>

        <div className="Discovery_Details">
          <div className="Discovery_Details_select1">
            <div className="input_lables_name">Problem Type</div>
            <Select
              maxMenuHeight={250}
              styles={SelectStyle}
              options={props.problemTypes
                ?.filter((e) => e.status === 1)
                .map((e) => ({
                  label: e.problemType,
                  value: e.problemId,
                }))}
              isClearable={true}
              onChange={(e) => setProblemTypeId(e?.value)}
              value={props.problemTypes
                ?.filter((e) => e.problemId === problemTypeId)
                ?.map((e) => ({
                  label: e.problemType,
                  value: e.problemId,
                }))}
            />
          </div>
          <div className="Discovery_Details_select2">
            <div className="input_lables_name">Country/Region of Service</div>
            <Select
              maxMenuHeight={150}
              onChange={(e) => setCountryID(e?.value)}
              value={props.countryOptions
                ?.filter((e) => e.countryID === countryID)
                .map((e) => ({
                  label: e.countryName,
                  value: e.countryID,
                }))}
              isClearable={true}
              styles={SelectStyle}
              options={props.countryOptions
                ?.filter((e) => e.isActive === 1)
                .map((e) => ({
                  label: e.countryName,
                  value: e.countryID,
                }))}
            />
          </div>
          <div className="input_lables_name">
            Serial Number <label style={{ color: "red" }}>*</label>
          </div>
          <input
            type="text"
            placeholder="Serial Number"
            className="Discovery_Details_input textInput"
            value={imeiNumber}
            onChange={(e) => setIMEINumber(e.target.value)}
            onBlur={(e) => validateSerialNo(e)}
          />
          {serialNumberError && <Error message={"Required*"} />}
          <NavLink to="" style={{ fontSize: "x-Small" }}>
            How to find Serial Number?
          </NavLink>
          <br />
        </div>
      </div>
    </div>
  );
});

const AdditionalInfo = forwardRef((props, ref) => {
  const [additionalFile, setAdditionalFile] = useState([]);
  const [description, setDescription] = useState("");
  const [diagonesticDate, setDiagonesticDate] = useState(new Date());
  const [diagonesticCode, setDiagonesticCode] = useState("");

  const { descriptionCheckError } = props.validate;

  useImperativeHandle(ref, () => ({
    returnData() {
      let discoveryData = {
        issueDescription: description,
        diagnosticCode: diagonesticCode,
        diagnosticDate: diagonesticDate,
        clientTicketRefNo: "",
        additionalFile: additionalFile,
      };
      return discoveryData;
    },
  }));

  useEffect(() => {
    setDescription(props.ticketData.issueDescription);
    setDiagonesticCode(props.ticketData.diagnosticCode);
    setAdditionalFile(props.ticketData.additionalFile);
  }, []);

  const handleDrop = async (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    let newFiles = [];
    let data = additionalFile ? [...additionalFile] : [];
    for (var i = 0; i < selectedFiles.length; i++) {
      let FileArray = await getBase64FromFileNotArray(selectedFiles[i]);
      newFiles.push(FileArray);
    }
    const pdfFiles = [...data, ...newFiles];
    if (pdfFiles.length > 0) {
      setAdditionalFile(pdfFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const getBase64FromFileNotArray = async (imageFiles) => {
    try {
      const temp = await convertToBase64(imageFiles);

      let fileJson = {
        fileName: imageFiles.name,
        fileContent: temp,
        fileExtension: imageFiles.type,
        fileSize: imageFiles.size.toString(),
        path: null,
      };

      return fileJson;
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  const handleFileInput = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    let newFiles = [];
    let data = additionalFile ? [...additionalFile] : [];
    for (var i = 0; i < selectedFiles.length; i++) {
      let FileArray = await getBase64FromFileNotArray(selectedFiles[i]);
      newFiles.push(FileArray);
    }
    const pdfFiles = [...data, ...newFiles];
    if (pdfFiles.length > 0) {
      setAdditionalFile(pdfFiles);
    }
  };

  const handleDeleteFile = (i) => {
    let deletedArray = [...additionalFile];
    deletedArray.splice(i, 1);
    setAdditionalFile(deletedArray);
  };

  return (
    <div>
      <div className="serviceRequestHeaderForPages">
        <h2>Additional Info</h2>
        <p>
          Please provide a few more details to make sure your ticket is handled
          appropriately.
        </p>
      </div>
      <div className="AdditionalInfo">
        <div className="AdditionalInfo_left">
          <div className="input_lables_name">Diagnostics Code</div>
          <input
            type="text"
            placeholder="Diagnostics Code"
            className="AdditionalInfo_input textInput"
            value={diagonesticCode}
            onChange={(e) => setDiagonesticCode(e.target.value)}
          ></input>
          <br />
          <div className="input_lables_name">Diagnostics date</div>
          <input
            type="date"
            onChange={(e) => setDiagonesticDate(new Date(e.target.value))}
            placeholder="Expiry Date"
            className="textbox-input3 textInput"
            max={new Date().toISOString().split("T")[0]}
            value={diagonesticDate.toLocaleDateString("en-CA")}
          />
          <br />
          <div className="input_lables_name">
            Description about the issue{" "}
            <label style={{ color: "red" }}>*</label>
          </div>
          <div className="required_input_field">
            <textarea
              type="text"
              placeholder="Please provide a detailed description of the machine issue."
              className="required_input_field_textarea textInput"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {descriptionCheckError && <Error message={"Required*"} />}
            <br />
          </div>
        </div>
        <div className="AdditionalInfo_right">
          <p>
            Please attach any relevant files (pictures, screenshots, service
            protocols, etc.) to your request, which will help us to manage your
            case. Thank you！
          </p>

          <div className="serviceImageUploaderDiv">
            <div
              className="image-uploader_serviceRequest "
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label className="file-input-label">
                <div>
                  <h5 className="image-uploader-heading">Choose File</h5>
                  <input
                    type="file"
                    accept="image/*, application/pdf"
                    onChange={(e) => handleFileInput(e)}
                    id="fileInput"
                    multiple
                    style={{
                      display: "none",
                    }}
                  />
                  Drop Your File Here
                </div>
              </label>
              {additionalFile?.length > 0 ? (
                <div className="filesFlexDiv_serveceRequest">
                  {additionalFile.map((file, i) => (
                    <div className="file_serveceRequest">
                      <FaFileAlt />
                      <p className="fileNames_serveceRequest">
                        {file?.fileName}
                      </p>
                      <MdDelete onClick={() => handleDeleteFile(i)} />
                    </div>
                  ))}{" "}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const ContactDetails = forwardRef((props, ref) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [alternateEmail, setSecondaryEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [altMobileNo, setAltMobileNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [machineAddress, setMachineAddress] = useState("");
  const [machineCountry, setMachineCountry] = useState("");
  const [machineState, setMachineState] = useState("");
  const [machineCity, setMachineCity] = useState("");
  const [machineZipcode, setMachineZipcode] = useState("");
  const [sameAsUserAddress, setSameAsUserAddress] = useState(2);

  const {
    addressError,
    altMobNoError,
    cityError,
    companyNameError,
    countryError,
    emailError,
    fnameError,
    lnameError,
    mAddressError,
    mCityError,
    mCountryError,
    mStateError,
    mZipError,
    mobNoError,
    zipCodeError,
    stateError,
  } = props.validate;

  useImperativeHandle(ref, () => ({
    returnData() {
      let contactDetailsData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        alternateEmail: alternateEmail,
        mobileNumber: mobileNo,
        alternateMobileNumber: altMobileNo,
        companyName: companyName,
        address: address,
        country: country,
        state: state,
        city: city,
        postalCode: zipCode,
        machineAddress: machineAddress,
        machineCountry: machineCountry,
        machineState: machineState,
        machineCity: machineCity,
        machinePostalCode: machineZipcode,
        sameAsUserAddress: sameAsUserAddress,
      };
      return contactDetailsData;
    },
  }));
  useEffect(() => {
    setFirstName(props.ticketData.firstName);
    setLastName(props.ticketData.lastName);
    setEmail(props.ticketData.email);
    setSecondaryEmail(props.ticketData.alternateEmail);
    setMobileNo(props.ticketData.mobileNumber);
    setAltMobileNo(props.ticketData.alternateMobileNumber);
    setCompanyName(props.ticketData.companyName);
    setAddress(props.ticketData.address);
    setCountry(props.ticketData.country);
    setState(props.ticketData.state);
    setCity(props.ticketData.city);
    setZipCode(props.ticketData.postalCode);
    setSameAsUserAddress(props.ticketData.sameAsUserAddress);

    setMachineAddress(props.ticketData.machineAddress);
    setMachineCountry(props.ticketData.machineCountry);
    setMachineState(props.ticketData.machineState);
    setMachineCity(props.ticketData.machineCity);
    setMachineZipcode(props.ticketData.machinePostalCode);
  }, []);

  return (
    <div className="ContactDetails">
      <div className="serviceRequestHeaderForPages">
        <h2>Contact Details</h2>
        <p>Please provide your contact information and machine location.</p>
      </div>
      <div className="contactDetailsflexDiv">
        <div className="contactDetailsfirstDiv">
          <h2>Enter Contact Information</h2>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                First Name <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="FirstName"
                className="ContactDetails_div1_input textInput"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              {fnameError && <Error message={"*Required*"} />}
            </div>
            <br />
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Last Name <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="LastName"
                className="ContactDetails_div1_input textInput"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              {lnameError && <Error message={"*Required*"} />}
            </div>
            <br />
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Email <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="Email"
                className="ContactDetails_div1_input textInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              {emailError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">Secondary Email</div>
              <input
                type="text"
                placeholder="Secondary Email"
                className="ContactDetails_div1_input textInput"
                value={alternateEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Mobile Number <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="Mobile Number"
                className="ContactDetails_div1_input textInput"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              ></input>
              {mobNoError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Alternate Mobile Number
              </div>
              <input
                type="text"
                placeholder="Alternate Mobile Number"
                className="ContactDetails_div1_input textInput"
                value={altMobileNo}
                onChange={(e) => setAltMobileNo(e.target.value)}
              ></input>
              {altMobNoError && <Error message={"Required*"} />}
            </div>
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Company Name <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="Company name"
                className="ContactDetails_div1_input textInput"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              ></input>
              {companyNameError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Address <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="address"
                className="ContactDetails_div1_input textInput"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></input>
              {addressError && <Error message={"Required*"} />}
            </div>
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Country <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="country"
                className="ContactDetails_div1_input textInput"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              ></input>
              {countryError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                State <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="state"
                className="ContactDetails_div1_input textInput"
                value={state}
                onChange={(e) => setState(e.target.value)}
              ></input>
              {stateError && <Error message={"Required*"} />}
            </div>
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                City <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="city"
                className="ContactDetails_div1_input textInput"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              ></input>
              {cityError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Zipcode <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="zipcode"
                className="ContactDetails_div1_input textInput"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              ></input>
              {zipCodeError && <Error message={"Required*"} />}
            </div>
          </div>
        </div>

        <div className="contactDetailssecondDiv">
          <h2>Select Address for Machine Location</h2>
          <div className="contactDetails_lables_name">
            Address <label style={{ color: "red" }}>*</label>
          </div>
          <input
            type="text"
            placeholder="Address"
            className="ContactDetails_div1_input textInput"
            value={sameAsUserAddress === 1 ? address : machineAddress}
            onChange={(e) => setMachineAddress(e.target.value)}
          ></input>
          {mAddressError && <Error message={"Required*"} />}
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Country <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="Country/ region"
                className="ContactDetails_div1_input textInput"
                value={sameAsUserAddress === 1 ? country : machineCountry}
                onChange={(e) => setMachineCountry(e.target.value)}
              ></input>
              {mCountryError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                State <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="State"
                className="ContactDetails_div1_input textInput"
                value={sameAsUserAddress === 1 ? state : machineState}
                onChange={(e) => setMachineState(e.target.value)}
              ></input>
              {mStateError && <Error message={"Required*"} />}
            </div>
          </div>
          <div className="ContactDetails_div1">
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                City <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="City"
                className="ContactDetails_div1_input textInput"
                value={sameAsUserAddress === 1 ? city : machineCity}
                onChange={(e) => setMachineCity(e.target.value)}
              ></input>
              {mCityError && <Error message={"Required*"} />}
            </div>
            <div className="ContactDetails_div1_InnerDiv">
              <div className="contactDetails_lables_name">
                Zipcode <label style={{ color: "red" }}>*</label>
              </div>
              <input
                type="text"
                placeholder="Zip Code"
                className="ContactDetails_div1_input textInput"
                value={sameAsUserAddress === 1 ? zipCode : machineZipcode}
                onChange={(e) => setMachineZipcode(e.target.value)}
              ></input>
              {mZipError && <Error message={"Required*"} />}
            </div>
          </div>
          <div className="ReviewSubmission_Checkbox">
            <div>
              <input
                type="checkbox"
                onChange={() =>
                  setSameAsUserAddress(sameAsUserAddress === 1 ? 2 : 1)
                }
                checked={sameAsUserAddress === 1}
              />
            </div>
            <label>same as User Address</label>
          </div>
        </div>
      </div>
    </div>
  );
});

function ReviewSubmission(props) {
  return (
    <div className="ReviewSubmission">
      <div className="ReviewSubmissionFlexDiv1">
        <div className="ReviewSubmission_left_container">
          <div className="HeadingFlexDiv">
            <h3 className="left_container_inner_div_paragraph">Ticket Info</h3>
          </div>
          <div className="contactnformation_RS">
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Serial Number</p>:
              <p>{props.ticketData.serialNumber}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Description</p>:
              <p>{props.ticketData.issueDescription}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Country/Region of Service</p>:
              <p>
                {props.ticketData.countryID
                  ? props.countryOptions?.filter(
                      (country) =>
                        country.countryID === props.ticketData.countryID
                    )[0].countryName
                  : ""}
              </p>
            </div>

            <div className="container7_div1">
              <p className="ReviewSubmission_p">Diagonestic Code</p>:
              <p>{props.ticketData.diagnosticCode}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Diagonestic Date</p>:
              <p>{props.ticketData?.diagnosticDate?.toLocaleDateString()}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">File attachment</p>:
              <p>{props.ticketData.additionalFile?.length} files</p>
            </div>
          </div>
        </div>
        <div className="right_container_div1">
          <div className="HeadingFlexDiv">
            <h3 className="ContactInfoRs">Contact Information</h3>
          </div>
          <div className="contactnformation_RS">
            <div className="container7_div1">
              <p className="ReviewSubmission_p">First Name</p>:
              <p>{props.ticketData.firstName}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Last Name</p>:
              <p>{props.ticketData.lastName}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Email</p>:
              <p>{props.ticketData.email}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Secondary Email</p>:
              <p>{props.ticketData.alternateEmail}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Mobile Number</p>:
              <p>{props.ticketData.mobileNumber}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Alternate Mobile Number</p>:
              <p>{props.ticketData.alternateMobileNumber}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Company Name</p>:
              <p>{props.ticketData.companyName}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="ReviewSubmissionFlexDiv2">
        <div className="ReviewSubmission_right_container_d2">
          <div className="ReviewSubmission_right_container_inner_div1">
            <h3 className="RsAdressMachine">Address for Machine Location</h3>
          </div>
          <div className="MachineLocationContaier">
            <div className="container7_address_div1">
              <p className="ReviewSubmission_p Address_Paragraph">Address </p>:
              <p className="Address_Paragraph">
                {props.ticketData.sameAsUserAddress === 1
                  ? props.ticketData.address
                  : props.ticketData.machineAddress}
              </p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Country/ Region </p>:
              <p>
                {props.ticketData.sameAsUserAddress === 1
                  ? props.ticketData.country
                  : props.ticketData.machineCountry}
              </p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">State </p>:
              <p>
                {props.ticketData.sameAsUserAddress === 1
                  ? props.ticketData.state
                  : props.ticketData.machineState}
              </p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">City </p>:
              <p>
                {props.ticketData.sameAsUserAddress === 1
                  ? props.ticketData.city
                  : props.ticketData.machineCity}
              </p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Zip code </p>:
              <p>
                {props.ticketData.sameAsUserAddress === 1
                  ? props.ticketData.postalCode
                  : props.ticketData.machinePostalCode}
              </p>
            </div>
          </div>
        </div>
        <div className="right_containerDiv1">
          <div className="HeadingFlexDiv">
            <h3 className="ContactInfoRs">Contact Address</h3>
          </div>
          <div className="contactnformation_RS">
            <div className="container7_address_div1">
              <p className="ReviewSubmission_p Address_Paragraph">Address</p>:
              <p className="Address_Paragraph">{props.ticketData.address}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Country</p>:
              <p>{props.ticketData.country}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">State</p>:
              <p>{props.ticketData.state}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">City</p>:
              <p>{props.ticketData.city}</p>
            </div>
            <div className="container7_div1">
              <p className="ReviewSubmission_p">Zip Code</p>:
              <p>{props.ticketData.postalCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionRecorded() {
  return (
    <div className="SubmissionRecorded">
      <div className="submittedIcon">
        <GoCheckCircleFill />
      </div>
      <h1>Your Submission Has Been Recorded</h1>
    </div>
  );
}
