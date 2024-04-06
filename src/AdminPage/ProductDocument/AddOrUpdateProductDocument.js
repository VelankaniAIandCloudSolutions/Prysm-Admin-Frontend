import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCrudApi,
  postCrudApi,
  putCrudApi,
} from "../../webServices/webServices";
import Select from "react-select";
import Error from "../../Error/Error";
import { useLocation } from "react-router-dom/dist";
import { selectOptionsMap } from "../../Helpers/Helpers";
import "./ProductDocument.css";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import LoadingScreen from "../../Loading/Loading";

export default function AddOrUpdateProductDocument() {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [isThumbnail, setIsThumbnail] = useState(2);
  const [NewOrUpdate, setNewOrUpdate] = useState("add");
  const [fileUploadedFormData, setFileUploadedFormData] = useState(null);
  const [documentCategoryID, setdocumentCategoryID] = useState();
  const [productID, setProductID] = useState();

  const navigate = useNavigate();
  const location = useLocation();
  const [fileName, setFileName] = useState("");

  const [categoryData, setCategoryData] = useState();
  const [productData, setProductData] = useState();

  //validation
  const [nameError, setNameError] = useState(false);
  const [documentCategoryError, setDocumentCategoryError] = useState(false);
  const [productIDError, setProductIDError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await GetAllDocumentCategory();
      await getAllProduct();
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await GetAllProductDocument();
      setIsLoading(false);
    })();
  }, [productData, categoryData]);

  const GetAllProductDocument = async () => {
    if (location?.state?.id) {
      await getCrudApi(
        `api/v1/product_document/${location?.state?.id}`,
        {}
      ).then((item) => {
        populateData(item[0]);
        setNewOrUpdate("update");
      });
    } else {
      setNewOrUpdate("add");
    }
  };

  const GetAllDocumentCategory = async () => {
    await getCrudApi("api/v1/product_document_category", {}).then((item) => {
      setCategoryData(item);
    });
  };

  const getAllProduct = async () => {
    await getCrudApi("api/v1/product").then((pdata) => {
      setProductData(pdata);
    });
  };

  let populateData = (data) => {
    setName(data?.name);
    setIsActive(data?.isActive);
    setIsThumbnail(data?.isThumbnail);
    setFileName(data?.fileName);
    setProductID({
      value: data?.productID,
      label: productData?.find((item) => item.productID === data?.productID)
        ?.name,
    });
    setdocumentCategoryID({
      value: data?.documentCategoryID,
      label: categoryData?.find(
        (item) => item.productDocumentCategoryID === data?.documentCategoryID
      )?.name,
    });
  };

  const validateInput = () => {
    const validateName = (name) => {
      if (!name) {
        isValid = false;
        setNameError(true);
      }
    };
    const validateDocCategory = (content) => {
      if (!content) {
        isValid = false;
        setDocumentCategoryError(true);
      }
    };
    const validateproductId = (content) => {
      if (!content) {
        isValid = false;
        setProductIDError(true);
      }
    };
    const validateFile = (content) => {
      if (!content) {
        if (fileName?.trim() === "") {
          isValid = false;
          setFileError(true);
        }
      }
    };

    let isValid = true;
    validateName(name);
    validateproductId(productID);
    validateDocCategory(documentCategoryID);
    validateFile(fileUploadedFormData);
    return isValid;
  };

  const onHowtoSubmit = async () => {
    setNameError(false);
    setDocumentCategoryError(false);
    setProductIDError(false);
    setFileError(false);
    if (validateInput()) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", fileUploadedFormData);
      formData.append("name", name);
      formData.append("isActive", isActive);
      formData.append("isThumbnail", isThumbnail);
      formData.append("documentCategoryID", documentCategoryID?.value);
      formData.append("productID", productID?.value);
      if (location?.state?.id !== null) {
        await putCrudApi(
          `api/v1/product_document/${location?.state?.id}`,
          formData
        )
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
        await postCrudApi("api/v1/product_document", formData)
          .then((data) => {
            if (data) {
              notifyAddOrUpdateManual("add");
            } else {
              notifyError();
            }
          })
          .catch((error) => {
            notifyError();
          });
      }
      setIsLoading(false);
      navigate("/Admin/ProductDocument");
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

    const pdfFiles = droppedFiles;
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
    const pdfFiles = selectedFiles;
    if (pdfFiles.length > 0) {
      setFileUploadedFormData(pdfFiles[0]);
      setFileName(pdfFiles[0]?.name);
      setFileError(false);
    } else {
      setFileError(true);
    }
    e.target.value = null;
  };

  const handleDeleteFile = () => {
    setFileUploadedFormData(null);
    setFileName("");
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

  const HandleNameChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    setName(value);
  };

  const HandleCategoryIDChange = (e) => {
    const value = e?.value;
    if (!value) {
      setDocumentCategoryError(true);
    } else {
      setDocumentCategoryError(false);
    }
    setdocumentCategoryID(e);
  };

  const HandleProductIDChange = (e) => {
    const value = e?.value;
    if (!value) {
      setProductIDError(true);
    } else {
      setProductIDError(false);
    }
    setProductID(e);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="productDoc-main-div">
            <div className="productDoc-submain-div">
              <div className="productDoc-Inputfields">
                <label className="productDoc-label-class">
                  Link Name <i class="fa fa-asterisk aster-risk-Icon" />
                </label>
                <input
                  type="text"
                  onChange={HandleNameChange}
                  placeholder="Name"
                  className="productDoc-textbox-input"
                  value={name}
                />
                {nameError && <Error message={"Required*"} />}
              </div>

              <div className="productDocCheckBox_label_container">
                <label className="productDocCheckBox_label-class ">
                  Product Document Category
                  <i className="fa fa-asterisk aster-risk-Icon"></i>
                </label>
                <Select
                  onChange={HandleCategoryIDChange}
                  value={documentCategoryID}
                  placeholder="Select"
                  styles={SelectStyle}
                  options={selectOptionsMap(
                    categoryData?.filter((e) => e.isActive === 1),
                    "productDocumentCategoryID",
                    "name"
                  )}
                  className="productDocDropdown-input add-update-productDoc-select"
                />
                {documentCategoryError && <Error message={"Required*"} />}
              </div>

              <div className="productDocCheckBox_label_container">
                <label className="productDocCheckBox_label-class ">
                  Product Name{" "}
                  <i className="fa fa-asterisk aster-risk-Icon"></i>
                </label>
                <Select
                  onChange={HandleProductIDChange}
                  value={productID}
                  placeholder="Select"
                  styles={SelectStyle}
                  options={selectOptionsMap(
                    productData?.filter((e) => e.isActive === 1),
                    "productID",
                    "name"
                  )}
                  className="productDocDropdown-input add-update-productDoc-select"
                />
                {productIDError && <Error message={"Required*"} />}
              </div>
              <div className="productDoc_checkboxes_container">
                <div className="productDoc-checkBoxes">
                  <label className="productDocstatus-label-class">Status</label>
                  <input
                    type="checkbox"
                    onChange={() => setIsActive(isActive === 1 ? 2 : 1)}
                    checked={isActive === 1}
                    className="productDoc-modalCheckbox"
                  />
                </div>
                <div className="productDoc-checkBoxes">
                  <label className="productDocstatus-label-class">
                    Thumbnail
                  </label>
                  <input
                    type="checkbox"
                    onChange={() => setIsThumbnail(isThumbnail === 1 ? 2 : 1)}
                    checked={isThumbnail === 1}
                    className="productDoc-modalCheckbox"
                  />
                </div>
              </div>
            </div>
            <div className="productDoc-Image-fields">
              <div className="productDoc-imageUploaderDiv ">
                <h3 className="productDoc-uploadImageHeading">
                  Upload The File
                </h3>
                <div
                  className="productDoc-image-uploader"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label
                    htmlFor="fileInput"
                    className="productDoc-file-input-label"
                  >
                    <h5 className="productDoc-image-uploader-heading">
                      Choose File
                    </h5>
                    <input
                      type="file"
                      accept="*/*"
                      onChange={handleFileInput}
                      style={{ display: "none" }}
                      id="fileInput"
                      name="file"
                    />
                    {fileError && <Error message={"Required*"} />}
                    Drop The File Here
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
          </div>
          <div className="productDoc-submitButtondiv">
            {NewOrUpdate === "add" ? (
              <button className="productDoc-btn " onClick={onHowtoSubmit}>
                Submit
              </button>
            ) : (
              <button className="productDoc-btn " onClick={onHowtoSubmit}>
                Update
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
