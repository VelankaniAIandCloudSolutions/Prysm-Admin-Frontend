import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import { useLocation } from "react-router-dom/dist";
import "./ManualPage.css";
import Handlebars from "handlebars";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import Error from "../../Error/Error";
import LoadingScreen from "../../Loading/Loading";


export default function ManualsInputField() {
  const [linkName, setLinkName] = useState("");
  const [status, setStatus] = useState(1);
  const [rawContent, setrawContent] = useState("");
  const [NewOrUpdate, setNewOrUpdate] = useState("add");
  const [contentHtml, setContentHtml] = useState("");
  const [fileUploadedFormData, setFileUploadedFormData] = useState(null);
  const [manualsID, setManualsID] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [fileName, setFileName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    (async () => {
    setIsLoading(true)
    await getAllManuals();
    setIsLoading(false)
    })();
  }, []);

  const getAllManuals = async () => {
    if (location?.state?.id) {
      setManualsID(location.state.id);
      await getCrudApi(`api/v1/manuals/${location?.state?.id}`, {}).then(
        (item) => {
          populateData(item[0]);
          setNewOrUpdate("update");
        }
      );
    } else {
      setNewOrUpdate("add");
    }
  };

  let populateData = (data) => {
    setLinkName(data?.linkName);
    setStatus(data?.status);
    let html = JSON?.parse(data?.rawContent)?.html;
    setrawContent(html);
    setFileName(data?.fileName);
  };
  useEffect(() => {
    if (rawContent) {
      let html = rawContent;
      var template = Handlebars.compile(html);
      var result = template();
      setContentHtml(result);
    }
  }, [rawContent]);

  const validateInput = () => {
    const validateName = (name) => {
      if (!name?.trim() || !name) {
        isValid = false;
        setNameError(true);
      }
    };
    const validatefile = (content) => {
      if (!content) {
        isValid = false;
        setFileError(true);
      }
    };
    const validateContent = (content) => {
      if (!content) {
        isValid = false;
        setContentError(true);
      }
    };
    let isValid = true;
    validateName(linkName);
    validateContent(rawContent);
    validatefile(fileUploadedFormData || fileName);
    return isValid;
  };

  const onHowtoSubmit = async () => {
    setNameError(false);
    setContentError(false);
    setFileError(false);
    if (validateInput()) {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("file", fileUploadedFormData);
      formData.append("linkName", linkName);
      formData.append("status", status);
      formData.append("rawContent", JSON.stringify({ html: rawContent }));
      if (manualsID !== null) {
        await putCrudApi(`api/v1/manuals/${manualsID}`, formData)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateManual("update");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      } else {
        await postCrudApi("api/v1/manuals/", formData)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateManual("add");
              setManualsID(data.manualId);
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
      setIsLoading(false)
      navigate("/Admin/ManualsPage");
    }
  };

  const notifyAddOrUpdateManual = (action) => {
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

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const pdfFiles = droppedFiles.filter((file) =>
      file.type.startsWith("application/pdf")
    );
    if (pdfFiles.length > 0) {
      setFileUploadedFormData(pdfFiles[0]);
      setFileName(pdfFiles[0]?.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter((file) =>
      file.type.startsWith("application/pdf")
    );
    if (pdfFiles.length > 0) {
      setFileUploadedFormData(pdfFiles[0]);
      setFileName(pdfFiles[0]?.name);
      setFileError(false);
    } else {
      setFileError(true);
    }
  };

  const handleDeleteFile = () => {
    setFileUploadedFormData(null);
    setFileName("");
    setFileError(true);
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

  const HandleRawContentChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setContentError(true);
    } else {
      setContentError(false);
    }
    setrawContent(value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
    <>
      <div className="ManualsFlexDiv">
        <div className="manual-main-div">
          <div className="manual-submain-div">
            <div className="manual-Inputfields">
              <label className="manual-label-class">
                Link Name <i class="fa fa-asterisk aster-risk-Icon" />
              </label>
              <input
                type="text"
                onChange={HandleNameChange}
                placeholder="Link Name"
                className="manual-textbox-input"
                value={linkName}
              />
              {nameError && <Error message={"Required*"} />}
            </div>
            <div className="manual-checkBoxes">
              <label className="manualstatus-label-class">Status</label>
              <input
                type="checkbox"
                onChange={() => setStatus(status === 1 ? 2 : 1)}
                checked={status === 1}
                className="manual-modalCheckbox"
              />
            </div>
          </div>
          <div className="manual-Image-fields">
            <div className="manual-imageUploaderDiv ">
              <h3 className="manual-uploadImageHeading">Upload The PDF</h3>
              <div
                className="manual-image-uploader"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <label htmlFor="fileInput" className="manual-file-input-label">
                  <h5 className="manual-image-uploader-heading">Choose PDF</h5>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInput}
                    style={{ display: "none" }}
                    id="fileInput"
                    name="file"
                  />
                  {fileError && <Error message={"Required*"} />}
                  Drop the PDF here
                </label>
                {fileName !== null && fileName !== "" ? (
                  <div>
                    <p>{fileName}</p>
                    <MdDelete onClick={handleDeleteFile} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="manual-Raw-Content">
            <label className="manual-label-class">
              Raw Content <i class="fa fa-asterisk aster-risk-Icon" />
            </label>
            <textarea
              type="text"
              onChange={HandleRawContentChange}
              placeholder="Raw Content"
              className="manual-Raw-content-input"
              value={rawContent}
            ></textarea>
            {contentError && <Error message={"Required*"} />}
          </div>
        </div>
        <div className="manual-Content">
          <label className="manual-label-class">
            Content <i class="fa fa-asterisk aster-risk-Icon" />
          </label>
          <div
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            className="manual-content-input"
          ></div>
        </div>
      </div>

      <div className="manual-submitButtondiv">
        {NewOrUpdate === "add" ? (
          <button className="manual-btn " onClick={onHowtoSubmit}>
            Submit
          </button>
        ) : (
          <button className="manual-btn " onClick={onHowtoSubmit}>
            Update
          </button>
        )}
      </div>
    </>
      )
        }
        </>
  );
}
