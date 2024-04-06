import React, { useState, useEffect } from "react";
import Handlebars from "handlebars";
import { useLocation } from "react-router-dom";
import "./ReviewTicket.css";
import QuillEditor from "../../Editor/QuillEditor";
import Error from "../../Error/Error";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { toast } from "react-toastify";
import Select from "react-select";
import { selectOptionsMap } from "../../Helpers/Helpers";
import LoadingScreen from "../../Loading/Loading";
function ReviewTicket() {
  const location = useLocation();
  const [activeDiv, setActiveDiv] = useState(1);
  const [editorContent, setEditorContent] = useState("");
  //validation
  const [editorError, setEditorError] = useState(false);
  const [data, setData] = useState([]);
  const [problemType, setProblemType] = useState([]);
  const [ticketResponse, setTicketResponse] = useState([]);
  const [ticketStatusData, setTicketStatusData] = useState([]);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [eta, setEta] = useState(new Date());

  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getTicketByID();
      await getAllTicketStatus();
      await ticketData();
    })();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await getProblemTypeByID();
    })();
    setIsLoading(false);
  }, [data]);

  const ticketData = async () => {
    getCrudApi("api/v1/ticket_response", {}).then((TicketData) => {
      setTicketResponse(
        TicketData?.filter((item) => item?.eTicketID === location?.state?.id)
      );
    });
  };

  const getTicketByID = async () => {
    await getCrudApi(`api/v1/ticket/${location?.state?.id}`, {}).then((dta) => {
      setTicketStatus(dta[0]?.status);
      setEta(dta[0].eta ? new Date(dta[0].eta) : new Date());
      setData(dta);
    });
  };

  const getAllTicketStatus = async () => {
    await getCrudApi("api/v1/ticket_status").then((data) => {
      setTicketStatusData(data);
    });
  };

  const getProblemTypeByID = async () => {
    data[0]?.problemID &&
      getCrudApi(`api/v1/problem/${data[0]?.problemID}`, {}).then(
        (problemData) => {
          setProblemType(problemData[0]?.problemType);
        }
      );
  };
  const handleTicketStatusChange = async (e) => {
    setIsLoading(true);
    setTicketStatus(e?.value);
    const ticketData = {
      status: e?.value,
      eta: eta,
    };
    await putCrudApi(`api/v1/ticket/${location?.state?.id}`, ticketData)
      .then((data) => {
        if (data) toast.success("Updated Successfully");
        else {
          toast.error("Operation was not performed");
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name) {
        isValid = false;
        setEditorError(true);
      }
    };
    let isValid = true;
    validateName(editorContent);
    return isValid;
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    let commentData = null;

    if (ticketStatus === 4) {
      commentData = {
        eta: eta,
        comment: comment,
        status: ticketStatus,
      };
    } else {
      commentData = {
        status: ticketStatus,
        eta: eta,
      };
    }

    await putCrudApi(`api/v1/ticket/${location?.state?.id}`, commentData)
      .then((data) => {
        if (data) toast.success("Updated successfully");
        else {
          toast.error("Operation was not performed");
        }
      })
      .catch((err) => {
        toast.error("Operation was not performed");
      });
    setIsLoading(false);
  };

  const handleSendMail = async () => {
    setIsLoading(true);
    setEditorError(false);
    if (validateInput()) {
      const mailData = {
        receiverEmailID: data[0]?.email,
        subject: data[0]?.serialNumber + " " + problemType,
        body: editorContent,
        eTicketID: data[0]?.eticketId,
        responseReceivedFrom: 1,
      };
      await postCrudApi("api/v1/ticket_response", mailData)
        .then((data) => {
          if (data) {
            notifySendMail("sent");
          }
        })
        .catch((error) => {
          notifyError();
        });

      if (ticketStatus === 4 && comment !== null) {
        const ticketCommentData = {
          comment: comment,
        };
        await putCrudApi(
          `api/v1/ticket/${location?.state?.id}`,
          ticketCommentData
        )
          .then((data) => {})
          .catch((error) => {
            notifyError();
          });
      }
    }
    setIsLoading(false);
  };

  const handleDivChange = (DivNo) => {
    setActiveDiv(DivNo);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const notifySendMail = (action) => {
    let message;

    if (action === "sent") {
      message = "sent mail";
    }
    toast.success(message);
  };

  const notifyError = () => {
    let message = "Unable to send mail";
    toast.error(message);
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

  const findStatus = (value) => {
    const Tstatus = ticketStatusData.find(
      (item) => item.statusID === value
    )?.statusName;
    return Tstatus || "no status";
  };

  return (
    <>
      {isLoading ? (
        <>
          <LoadingScreen />
        </>
      ) : (
        <div className="ReviewTicket-container">
          <div className="NameStatus_div">
            <div className="Label_value">
              <h3>Ticket Number :</h3>&nbsp;<h3># {data[0]?.eticketId}</h3>
            </div>
            <div className="Label_value">
              <h3 className="ReviewTicket-container_heading">Status :</h3>&nbsp;
              <div>{findStatus(data[0]?.status)}</div>
            </div>
          </div>
          <div className="ReviewTicket_container_div">
            <div className="ReviewTicket">
              <div className="informationContainerDiv">
                <div className="infoButtonsContainer">
                  <button
                    className="reviewTicketInfoButton"
                    onClick={() => handleDivChange(1)}
                    style={{
                      background: activeDiv === 1 ? "white" : "#e57430",
                    }}
                  >
                    Machine Details
                  </button>
                  <button
                    className="reviewTicketInfoButton"
                    onClick={() => handleDivChange(2)}
                    style={{
                      background: activeDiv === 2 ? "white" : "#e57430",
                    }}
                  >
                    Customer details
                  </button>
                  <button
                    className="reviewTicketInfoButton"
                    onClick={() => handleDivChange(3)}
                    style={{
                      background: activeDiv === 3 ? "white" : "#e57430",
                    }}
                  >
                    Machine Location
                  </button>
                </div>
                <div className="infoContainerDiv">
                  {activeDiv === 1 && (
                    <div className="reviewTicketInfoDiv1">
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Serial Number{" "}
                        </span>
                        :<span>{data[0]?.serialNumber}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Country/ Region{" "}
                        </span>
                        :<span>{data[0]?.machineCountry}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Address</span>:
                        <span>{data[0]?.machineAddress}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">State</span>:
                        <span>{data[0]?.machineState}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">City</span>:
                        <span>{data[0]?.machineCity}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Zip-Code</span>:
                        <span>{data[0]?.machinePostalCode}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Ticket Number{" "}
                        </span>
                        :<span>{data[0]?.eticketId}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Diagonestic Code{" "}
                        </span>
                        :<span>{data[0]?.diagnosticCode}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          File attachment{" "}
                        </span>
                        :<span>abc.jpg</span>
                      </div>
                    </div>
                  )}
                  {activeDiv === 2 && (
                    <div className="reviewTicketInfoDiv2">
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">First Name </span>:
                        <span>{data[0]?.firstName}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Last Name </span>:
                        <span>{data[0]?.lastName}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Email </span>:
                        <span>
                          <b>{data[0]?.email}</b> is used for further
                          conversations
                        </span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Secondary Email{" "}
                        </span>
                        :<span>{data[0]?.alternateEmail}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Mobile Number{" "}
                        </span>
                        :<span>{data[0]?.mobileNumber}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Alternate Mobile Number{" "}
                        </span>
                        :<span>{data[0]?.alternateMobileNumber}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">CompanyName </span>:
                        <span>{data[0]?.companyName}</span>
                      </div>
                    </div>
                  )}
                  {activeDiv === 3 && (
                    <div className="reviewTicketInfoDiv3">
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">
                          Country/ Region{" "}
                        </span>
                        :<span>{data[0]?.country}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Address </span>:
                        <span>{data[0]?.address}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">State </span>:
                        <span>{data[0]?.state}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">City </span>:
                        <span>{data[0]?.city}</span>
                      </div>
                      <div className="infoInnerDiv">
                        <span className="infoInnerDivLabel">Postal code </span>:
                        <span>{data[0]?.postalCode}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <label className="commentArea_label etiLableReviewTicket">
                ETA
              </label>
              <input
                type="date"
                placeholder="ETA"
                onChange={(e) => setEta(new Date(e.target.value))}
                value={eta?.toLocaleDateString("en-CA")}
                className="textInputReviewTicket"
              />

              <label className="commentArea_label statusLabelCommentArea">
                Status
              </label>
              <div className="Dropdown_ReviewTicket">
                <Select
                  className=""
                  placeholder="Ticket Status"
                  onChange={handleTicketStatusChange}
                  maxMenuHeight={150}
                  value={ticketStatusData
                    ?.filter((item) => item.statusID === ticketStatus)
                    ?.map((item) => ({
                      label: item.statusName,
                      value: item.statusID,
                    }))}
                  isClearable={true}
                  styles={SelectStyle}
                  options={selectOptionsMap(
                    ticketStatusData,
                    "statusID",
                    "statusName"
                  )}
                />
                <div>
                  {ticketStatus === 4 ? (
                    <div className="commentReviewTicketArea">
                      <label className="commentArea_label">Comment:</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        cols={50}
                        className="ReviewTicketTextarea"
                        placeholder="Enter comment here..."
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="QuillEditor-Div">
                <QuillEditor onEditorChange={handleEditorChange} />
                {editorError && <Error message={"Required*"} />}
              </div>

              <div className="Comments_submit_Button">
                <button
                  className="Submit_button modal-open-btn"
                  onClick={handleSendMail}
                >
                  Send Mail
                </button>
              </div>
            </div>
            <div className="ReviewTicket_Email_div">
              <div className="Email_Header_And_button_div">
                <h2 style={{ margin: "0%" }}>Emails And Attachments</h2>
              </div>
              <div className="reviewTicketChatContainer">
                {ticketResponse?.map((item, index) => {
                  let html = item?.body;
                  var template = Handlebars.compile(html);
                  var result = template();
                  let clsName =
                    data[0]?.email === item?.receiverEmailID
                      ? "reviewTicketComment"
                      : "reviewTicketMail";
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{ __html: result }}
                      className={clsName}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="ReviewTicket-button-div">
            <button className="modal-open-btn" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewTicket;
