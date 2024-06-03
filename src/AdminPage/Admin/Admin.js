import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import ReviewTicketPic from "../../assets/images/img2.jpg";
import { GiBlackBook } from "react-icons/gi";
import {
  FaLanguage,
  FaUsers,
  FaUserCog,
  FaGlobe,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import {
  MdOutlineCategory,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import Collapsible from "react-collapsible";
import { BsChevronDown } from "react-icons/bs";
import { FiHardDrive } from "react-icons/fi";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { ImMakeGroup } from "react-icons/im";
import { MdOutlineSyncProblem } from "react-icons/md";
import { GrSystem } from "react-icons/gr";
import { HiMiniDocumentText } from "react-icons/hi2";
import { IoDocumentsSharp } from "react-icons/io5";
import { BiCreditCard } from "react-icons/bi";
import { FaHouseUser } from "react-icons/fa6";

export default function Admin() {
  const navigate = useNavigate();
  const handleLanguage = () => {
    navigate("/Admin/Language");
  };

  const HandleproductCustomizationCategory = () => {
    navigate("/Admin/productCustomizationCategory");
  };
  const HandleProduct = () => {
    navigate("/Admin/Product");
  };
  const handleProductTags = () => {
    navigate("/Admin/ProdctTags");
  };
  const handleProductCategory = () => {
    navigate("/Admin/ProductCategory");
  };
  const handleUserManagements = () => {
    navigate("/Admin/UserManagements");
  };
  const handleCustomerManagements = () => {
    navigate("/Admin/CustomerManagements");
  };
  const handleFooterConfiguration = () => {
    navigate("/Admin/FooterConfiguration");
  };
  const handleCountryConfiguration = () => {
    navigate("/Admin/CountryConfiguration");
  };
  const handleDrivers = () => {
    navigate("/Admin/Driver");
  };
  const handleOperatingSyatem = () => {
    navigate("/Admin/OperatingSystem");
  };
  const handleDriverGroup = () => {
    navigate("/Admin/DriverGroup");
  };
  const handleHowTo = () => {
    navigate("/Admin/HowtoPage");
  };
  const handleManuals = () => {
    navigate("/Admin/ManualsPage");
  };
  const handleAdminTax = () => {
    navigate("/Admin/AdminTax");
  };
  const handleDiscount = () => {
    navigate("/Admin/DiscountPage");
  };

  const handleProblem = () => {
    navigate("/Admin/Problem");
  };
  const handleProductDocument = () => {
    navigate("/Admin/ProductDocument");
  };

  const handleProductDocumentCategory = () => {
    navigate("/Admin/ProductDocumentCategory");
  };

  const handlePaymentTerm = () => {
    navigate("/Admin/PaymentTerm");
  };

  const handleHome = () => {
    navigate("/Admin/HomeImage");
  };

  const ProductElements = {
    name: "Products",
    open: true,
    groupElements: [
      {
        colorDiv: "colorDiv4 card-background-color-4",
        onclick: HandleproductCustomizationCategory,
        ImageURL: ReviewTicketPic,
        icon: <MdOutlineCategory />,
        heading: "Customization Category",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-4",
      },
      {
        colorDiv: "colorDiv2 card-background-color-6",
        onclick: HandleProduct,
        ImageURL: ReviewTicketPic,
        icon: <MdOutlineProductionQuantityLimits />,
        heading: "Product",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-6",
      },
      {
        colorDiv: "colorDiv4 card-background-color-8",
        onclick: handleProductTags,
        ImageURL: ReviewTicketPic,
        icon: <BsTags />,
        heading: "Tags",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-8",
      },
      {
        colorDiv: "colorDiv1 card-background-color-9",
        onclick: handleProductCategory,
        ImageURL: ReviewTicketPic,
        icon: <ImMakeGroup />,
        heading: "Category",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-9",
      },
      {
        colorDiv: "colorDiv1 card-background-color-5",
        onclick: handleHowTo,
        ImageURL: ReviewTicketPic,
        icon: <AiOutlineQuestionCircle />,
        heading: "How To",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-5",
      },
      {
        colorDiv: "colorDiv1 card-background-color-7",
        onclick: handleManuals,
        ImageURL: ReviewTicketPic,
        icon: <GiBlackBook />,
        heading: "Manuals",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-7",
      },
      {
        colorDiv: "colorDiv1 card-background-color-2",
        onclick: handleAdminTax,
        ImageURL: ReviewTicketPic,
        icon: <HiOutlineReceiptTax />,
        heading: "Tax",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-2",
      },

      {
        colorDiv: "colorDiv1 card-background-color-3",
        onclick: handleProductDocument,
        ImageURL: ReviewTicketPic,
        icon: <HiMiniDocumentText />,
        heading: "Product Document",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-3",
      },
      {
        colorDiv: "colorDiv4 card-background-color-4",
        onclick: handleProductDocumentCategory,
        ImageURL: ReviewTicketPic,
        icon: <IoDocumentsSharp />,
        heading: "Document Category",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-4",
      },
      {
        colorDiv: "colorDiv4 card-background-color-4",
        onclick: handlePaymentTerm,
        ImageURL: ReviewTicketPic,
        icon: <BiCreditCard />,
        heading: "Payment Term",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-4",
      },
    ],
  };
  const AdminUser = {
    name: "AdminUser",
    open: false,
    groupElements: [
      {
        colorDiv: "colorDiv2 card-background-color-10",
        onclick: handleUserManagements,
        ImageURL: ReviewTicketPic,
        icon: <FaUsers />,
        heading: "User Management",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-10",
      },
      {
        colorDiv: "colorDiv2 card-background-color-8",
        onclick: handleFooterConfiguration,
        ImageURL: ReviewTicketPic,
        icon: <FaUserCog />,
        heading: "Footer Configuration",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-8",
      },
      {
        colorDiv: "colorDiv2 card-background-color-5",
        onclick: handleCountryConfiguration,
        ImageURL: ReviewTicketPic,
        icon: <FaGlobe />,
        heading: "Country",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-5",
      },
      {
        colorDiv: "colorDiv2 card-background-color-7",
        onclick: handleDiscount,
        ImageURL: ReviewTicketPic,
        icon: <FaMoneyBillWave />,
        heading: "Discount",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-7",
      },
      {
        colorDiv: "colorDiv1 card-background-color-9",
        onclick: handleProblem,
        ImageURL: ReviewTicketPic,
        icon: <MdOutlineSyncProblem />,
        heading: "Problem",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-9",
      },
      {
        colorDiv: "colorDiv1 card-background-color-3",
        onclick: handleHome,
        ImageURL: ReviewTicketPic,
        icon: <FaHouseUser />,
        heading: "Home",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-3",
      },
      {
        colorDiv: "colorDiv2 card-background-color-10",
        onclick: handleCustomerManagements,
        ImageURL: ReviewTicketPic,
        icon: <FaUsers />,
        heading: "Customer Management",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-10",
      },
    ],
  };
  const LangElements = {
    name: "LangElements",
    open: false,
    groupElements: [
      {
        colorDiv: "colorDiv3 card-background-color-7",
        onclick: handleLanguage,
        ImageURL: ReviewTicketPic,
        icon: <FaLanguage />,
        heading: "Language",
        iconColor: "adminElementIcon card-icon-color-7",
      },
    ],
  };

  const DriverSoftwareElement = {
    name: "Drivers",
    open: false,
    groupElements: [
      {
        colorDiv: "colorDiv1 card-background-color-5",
        onclick: handleOperatingSyatem,
        ImageURL: ReviewTicketPic,
        icon: <GrSystem />,
        heading: "Operating System",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-5",
      },
      {
        colorDiv: "colorDiv2 card-background-color-10",
        onclick: handleDriverGroup,
        ImageURL: ReviewTicketPic,
        icon: <FiHardDrive />,
        heading: "Driver Group",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-10",
      },
      {
        colorDiv: "colorDiv3 card-background-color-7",
        onclick: handleDrivers,
        icon: <HiWrenchScrewdriver />,
        heading: "Driver",
        state: "active",
        iconColor: "adminElementIcon card-icon-color-7",
      },
    ],
  };

  const AllArrayElememts = [
    ProductElements,
    AdminUser,
    LangElements,
    DriverSoftwareElement,
  ];
  return (
    <div className="AdminContainer">
      <div className="Admin_Home">
        {AllArrayElememts.map((obj) => {
          return (
            <div className="Admin_collapsible_div">
              <Collapsible
                trigger={[obj.name, <BsChevronDown />]}
                open={obj.open}
                triggerTagName="div"
              >
                <div className="Admin_collapsible_container_div">
                  {obj.groupElements.map((e) => {
                    return (
                      <div className="Admin_collapsible_container">
                        <div className="adminElement" onClick={e?.onclick}>
                          <div className="icon-dept-card">
                            <div className={e?.iconColor}>{e?.icon}</div>
                          </div>
                          <div className="grid-label ">
                            {" "}
                            <div className="admin-label-text">{e?.heading}</div>
                          </div>
                          <div className={e?.colorDiv}>
                            <label className="admin-h4">{e?.heading}</label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
