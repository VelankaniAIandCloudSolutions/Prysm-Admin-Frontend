import React, { useState, useEffect } from "react";
import Error from "../../Error/Error";
import "./HowtoPage.css";
import { useNavigate } from "react-router-dom";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { useLocation } from "react-router-dom/dist";
import Select from "react-select";
import { selectOptionsMap } from "../../Helpers/Helpers";

import Handlebars from "handlebars";
import { toast } from "react-toastify";
import LoadingScreen from "../../Loading/Loading";

export default function HowtoInputFields() {
  const [linkName, setLinkName] = useState("");
  const [status, setStatus] = useState(1);
  const [rawContent, setrawContent] = useState("");
  const [osIds, setOsIds] = useState([]);
  const [osData, setOsData] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [buttonStatus, setButtonStatus] = useState("add");
  const [howtoID, setHowToID] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [rawContentError, setRawContentError] = useState(false);
  const [parentOsError, setParentOsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      await getById();
      setIsLoading(false);
    })();
  }, []);

  const getById = async () => {
    if (location?.state?.id) {
      await getCrudApi(`api/v1/howto/${location?.state?.id}`, {})
        .then(async (item) => {
          setHowToID(location?.state?.id);
          let oddata = [];
          await getCrudApi("api/v1/os", {})
            .then((data) => {
              oddata = [...data];
              setOsData(data);
            })
            .catch((error) => {
              notifyError();
            });
          populateData(item[0]);
          osDataMApping(item[0].osIds, oddata);
        })
        .catch((error) => {
          notifyError();
        });
      setButtonStatus("update");
    } else {
      setButtonStatus("add");
    }
  };

  let osDataMApping = (osIds, osData) => {
    if (osIds != null) {
      if (osIds?.includes(",")) {
        let arrayOs = osIds?.split(",");

        let selectedOsId = [];

        arrayOs?.map((data) => {
          let osId = osData?.find((item) => {
            return item?.id === parseInt(data, 10);
          });
          if (osId) {
            selectedOsId?.push(osId);
          }
        });

        setOsIds(selectOptionsMap(selectedOsId, "id", "name"));
      } else {
        let osId = osData?.find((item) => item?.id === parseInt(osIds, 10));
        if (osId != null) {
          setOsIds(selectOptionsMap([osId], "id", "name"));
        }
      }
    }
  };

  let populateData = (data) => {
    setLinkName(data?.linkName);
    setStatus(data?.status);
    let html = JSON?.parse(
      data.rawContent !== "" ? data.rawContent : '{"html":""}'
    )?.html;
    setrawContent(html);
  };

  useEffect(() => {
    if (rawContent) {
      let html = rawContent;
      var template = Handlebars.compile(html);
      var result = template();
      setContentHtml(result);
    }
  }, [rawContent]);

  const notifyAddOrUpdate = (action) => {
    let message;

    if (action === "update") {
      message = "Updated successfully!";
    } else if (action === "add") {
      message = "Added successfully!";
    } else {
      return;
    }
    toast.success(message);
  };
  const notifyError = () => {
    let message = "Link Name Exists";
    toast.error(message);
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };
    const validateHtml = (content) => {
      if (!content) {
        isValid = false;
        setRawContentError(true);
      }
    };
    const validateParentos = (content) => {
      if (!content.length) {
        isValid = false;
        setParentOsError(true);
      }
    };

    let isValid = true;
    validateName(linkName);
    validateHtml(rawContent);
    validateParentos(osIds);
    return isValid;
  };

  const onHowtoSubmit = async () => {
    setNameError(false);
    setRawContentError(false);
    setParentOsError(false);
    if (validateInput()) {
      setIsLoading(true);
      const editedProduct = {
        linkName: linkName,
        status: status,
        rawContent: JSON.stringify({ html: rawContent }),
        osIds:
          osIds.length > 0 ? osIds?.map((item) => item.value).join(",") : [],
      };
      if (howtoID !== null) {
        await putCrudApi(`api/v1/howto/${howtoID}`, editedProduct)
          .then((data) => {
            if (data) {
              notifyAddOrUpdate("update");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      } else if (howtoID === null) {
        await postCrudApi("api/v1/howto/", editedProduct)
          .then((data) => {
            if (data) {
              notifyAddOrUpdate("add");
              setHowToID(data?.howtoID);
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
      setIsLoading(false);
      navigate("/Admin/HowtoPage");
    }
  };

  const SelectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid rgb(201, 200, 200)",
      boxShadow: "none",
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

  const HandleNameChange = (e) => {
    const value = e.target.value;
    if (!value?.trim() || !value) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setLinkName(value);
  };

  const HandleOSChange = (e) => {
    const val = e.length;
    if (!val) {
      setParentOsError(true);
    } else {
      setParentOsError(false);
    }
    setOsIds(e);
  };

  const HandleRawContentChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setRawContentError(true);
    } else {
      setRawContentError(false);
    }
    setrawContent(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="howTo-InputFields">
            <div className="Howto-textfields">
              <label className="Howto-label-class">
                Link Name <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={HandleNameChange}
                placeholder="Link Name"
                className="howTo-textbox-input"
                value={linkName}
              />
              {nameError && <Error message={"Required*"} />}
            </div>
            <div className="Howto-textfields">
              <label className="Howto-checkBox-label-class">
                Operating System{" "}
                <i className="fa fa-asterisk aster-risk-Icon"></i>
              </label>

              <Select
                onChange={HandleOSChange}
                value={osIds}
                placeholder="Select"
                styles={SelectStyle}
                isMulti={true}
                options={selectOptionsMap(
                  osData?.filter((e) => e.status === 1),
                  "id",
                  "name"
                )}
              />
              {parentOsError && <Error message={"Required*"} />}
            </div>
            <div className="Howto-checkBoxes">
              <label className="Howto-label-class">Status</label>
              <input
                type="checkbox"
                onChange={() => setStatus(status === 1 ? 2 : 1)}
                checked={status === 1}
                className="Howto-modalCheckbox"
              />
            </div>
          </div>
          <div className="Howto-Content-div">
            <div className="Howto-Content">
              <label className="Howto-label-class">
                Raw Content <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <textarea
                type="text"
                onChange={HandleRawContentChange}
                placeholder="Raw Content"
                className="howTo-content-input"
                value={rawContent}
              ></textarea>
              {rawContentError && <Error message={"Required*"} />}
            </div>
            <div className="Howto-Content">
              <label className="Howto-label-class">
                Content <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <div
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                className="howTo-content-input"
              ></div>
            </div>
          </div>
          <div className="howTo-submitButtondiv">
            {buttonStatus === "add" ? (
              <button className="Howto-btn" onClick={onHowtoSubmit}>
                Submit
              </button>
            ) : (
              <button className="Howto-btn" onClick={onHowtoSubmit}>
                Update
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
