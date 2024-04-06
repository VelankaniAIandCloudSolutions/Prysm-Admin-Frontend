import Admin from "../AdminPage/Admin/Admin";
import ContactUs from "../ContactUsComponent/ContactUs";
import Datacenter from "../Datacenter/Datacenter";
import Home from "../Home";
import MyAccount from "../MyAccount";
import ProductHome from "../ProductHome/ProductHome";
import ServiceRequest from "../ServiceRequestComponent/ServiceRequest";
import Support from "../Support";
import ReviewTicket from "../AdminPage/AssignTickets/ReviewTicket";
import Ticket from "../AdminPage/AssignTickets/Ticket";
import ProductCustomizationCategory from "../AdminPage/productCustomizationCategory/ProductCustomizationCategory";
import Product from "../AdminPage/Product/Product";
import Language from "../AdminPage/Language/Language";
import ProdctTags from "../AdminPage/ProductTags/ProductTags";
import ProductCategory from "../AdminPage/ProductCategory/ProductCategory";
import UserManagements from "../AdminPage/UserManagements/UserManagements";
import SideBar from "../AdminLayout/SideBar/SideBar";
import TicketAssign from "../AdminPage/AssignTickets/TicketAssigning";
import FooterConfiguration from "../AdminPage/FooterConfiguration/FooterConfiguration";
import OperatingSystem from "../AdminPage/OperatingSystem/OperatingSystem";
import DriverGroup from "../AdminPage/DriverGroup/DriverGroup";
import ProductCustomizationCategoryDetails from "../AdminPage/productCustomizationCategory/ProductCustomizationCategoryDetails";
import WarrantyLookUp from "../WarrantyLookUp/WarrantyLookUp";
import PartsLookUp from "../PartsLookUp/PartsLookUp";
import Driver from "../AdminPage/Driver/Driver";
import AddOrUpdateDriver from "../AdminPage/Driver/AddOrUpdateDriver";
import HowtoPage from "../AdminPage/HowTosPage/HowtoPage";
import HowtoInputFields from "../AdminPage/HowTosPage/HowtoInputFields";
import ManualsPage from "../AdminPage/ManualsPage/ManualsPage";
import ManualsInputField from "../AdminPage/ManualsPage/ManualsInputFields";
import ProductDetails from "../AdminPage/Product/ProductDetails";
import UserModal from "../AdminPage/UserManagements/UserModal";
import MyOrders from "../MyOrders/MyOrders";
import MyProduct from "../MyProduct/MyProduct";
import CountryCurrency from "../AdminPage/CountryCurrency/CountryCurrency";
import CountryEdit from "../AdminPage/CountryCurrency/CountryEdit";
import AdminTax from "../AdminPage/AdminTax/AdminTax";
import AdminTaxDetails from "../AdminPage/AdminTax/AdminTaxDetails";
import DiscountPage from "../AdminPage/DiscountPage/DiscountPage";
import DiscountInputField from "../AdminPage/DiscountPage/DiscountInputField";
import RenderLinkPage from "../RenderLinkPage/RenderLinkPage";
import Problem from "../AdminPage/Problem/Problem";
import MyAccountPopup from "../MyAccountPopup/MyAccountPopup";
import ProductDocument from "../AdminPage/ProductDocument/ProductDocument";
import ProductDocumentCategory from "../AdminPage/ProductDocumentCategory/ProductDocumentCategory";
import AddOrUpdateProductDocument from "../AdminPage/ProductDocument/AddOrUpdateProductDocument";
import TicketStatus from "../AdminPage/TicketStatus/TicketStatus";
import HomeImage from "../AdminPage/HomeImage/HomeImage";
import { GrTicket } from "react-icons/gr";
import { FaUser } from "react-icons/fa6";

export const componentsregistry = {
  Home: <Home />,
  Support: <Support />,
  MyAccount: <MyAccount />,
  Datacenter: <Datacenter />,
  ServiceRequest: <ServiceRequest />,
  ProductHome: <ProductHome />,
  ContactUs: <ContactUs />,
  WarrantyLookUp: <WarrantyLookUp />,
  PartsLookUp: <PartsLookUp />,
  MyOrders: <MyOrders />,
  MyProduct: <MyProduct />,
  MyAccountPopup: <MyAccountPopup />,
  Render: <RenderLinkPage />,
};
export const routes = [
  {
    path: "/Home",
    element: "Home",
    breadcrumb: "Home",
    icon: <i className="fa fa-pie-chart" />,
  },
  {
    path: "/Home/DataCenter/Support",
    element: "Support",
    breadcrumb: "Support",
    icon: <i className="	fa fa-file" />,
  },
  {
    path: "/Home/DataCenter",
    element: "Datacenter",
    breadcrumb: "Datacenter",
    icon: <i className="fa fa-edit" />,
  },
  {
    path: "/ContactUs",
    element: "ContactUs",
    breadcrumb: "ContactUs",
  },
  {
    path: "/Home/WarrantyLookUp",
    element: "WarrantyLookUp",
    breadcrumb: "WarrantyLookUp",
  },
  {
    path: "/Home/PartsLookUp",
    element: "PartsLookUp",
    breadcrumb: "PartsLookUp",
  },
  {
    path: "/Home/DataCenter/Support/RenderLink",
    element: "Render",
  },
  {
    path: "/MyOrders",
    element: "MyOrders",
    breadcrumb: "MyOrders",
  },

  {
    path: "/MyAccount",
    element: "MyAccount",
    breadcrumb: "MyAccount",
    icon: <i className="	fa fa-file-text" />,
  },
  {
    path: "/MyProduct",
    element: "MyProduct",
    breadcrumb: "MyProduct",
  },
  {
    path: "/Home/DataCenter/Support/ServiceRequest",
    element: "ServiceRequest",
    breadcrumb: "ServiceRequest",
    icon: <i className="fa fa-check-circle" />,
  },
  {
    path: "/MyAccountPopup",
    element: "MyAccountPopup",
    breadcrumb: "MyAccountPopup",
  },
];

export const totalRoutes = [
  {
    path: "/Admin",
    element: "Admin",
    roleId: [1],
    breadcrumb: "Admin",
    icon: <FaUser />,
  },
  {
    path: "/Ticket",
    element: "Ticket",
    breadcrumb: "Ticket",
    roleId: [0, 1, 6, 7, 8],
    icon: <GrTicket />,
  },
  {
    path: "/Ticket/TicketAssign",
    element: "TicketAssign",
    roleId: [1],
    breadcrumb: "TicketAssign",
  },

  {
    path: "/Admin/productCustomizationCategory",
    element: "ProductCustomizationCategory",
    roleId: [1],
    breadcrumb: "ProductCustomizationCategory",
  },
  {
    path: "/Admin/ProdctTags",
    element: "ProdctTags",
    roleId: [1],
    breadcrumb: "ProdctTags",
  },
  {
    path: "/Admin/ProductCategory",
    element: "ProductCategory",
    roleId: [1],
    breadcrumb: "ProductCategory",
  },

  {
    path: "/Ticket/ReviewTicket",
    element: "ReviewTicket",
    roleId: [1, 6, 7, 8],
    breadcrumb: "ReviewTicket",
  },
  {
    path: "/Admin/ProductHome",
    element: "ProductHome",
    roleId: [1],
    breadcrumb: "ProductHome",
  },

  {
    path: "/Admin/UserManagements",
    element: "UserManagements",
    roleId: [1],
    breadcrumb: "UserManagements",
  },
  {
    path: "/Admin/UserManagements/UserModal",
    element: "UserModal",
    roleId: [1],
    breadcrumb: "UserModal",
  },
  {
    path: "/Admin/Language",
    element: "Language",
    roleId: [1],
    breadcrumb: "Language",
  },
  {
    path: "/Admin/Product",
    element: "Product",
    roleId: [1],
    breadcrumb: "Product",
  },
  {
    path: "/Admin/Product/ProductDetails",
    element: "ProductDetails",
    roleId: [1],
    breadcrumb: "ProductDetails",
  },
  {
    path: "/Admin/FooterConfiguration",
    element: "FooterConfiguration",
    roleId: [1],
    breadcrumb: "FooterConfiguration",
  },
  {
    path: "/Admin/OperatingSystem",
    element: "OperatingSystem",
    roleId: [1],
    breadcrumb: "OperatingSystem",
  },
  {
    path: "/Admin/DriverGroup",
    element: "DriverGroup",
    roleId: [1],
    breadcrumb: "DriverGroup",
  },
  {
    path: "/Admin/productCustomizationCategory/ProductCustomizationCategoryDetails",
    element: "ProductCustomizationCategoryDetails",
    roleId: [1],
    breadcrumb: "ProductCustomizationCategoryDetails",
  },
  {
    path: "/Admin/Driver",
    element: "Driver",
    roleId: [1],
    breadcrumb: "Driver",
  },
  {
    path: "/Admin/Driver/AddOrUpdateDriver",
    element: "AddOrUpdateDriver",
    roleId: [1],
    breadcrumb: "AddOrUpdateDriver",
  },
  {
    path: "/Admin/HowtoPage",
    element: "HowtoPage",
    roleId: [1],
    breadcrumb: "HowtoPage",
  },
  {
    path: "/Admin/HowtoPage/HowtoInputFields",
    element: "HowtoInputFields",
    roleId: [1],
    breadcrumb: "HowtoInputFields",
  },
  {
    path: "/Admin/ManualsPage",
    element: "ManualsPage",
    roleId: [1],
    breadcrumb: "ManualsPage",
  },
  {
    path: "/Admin/ManualsPage/ManualsInputField",
    element: "ManualsInputField",
    roleId: [1],
    breadcrumb: "ManualsInputField",
  },
  {
    path: "/Admin/CountryConfiguration",
    element: "CountryConfiguration",
    roleId: [1],
    breadcrumb: "CountryConfiguration",
  },
  {
    path: "/Admin/CountryConfiguration/AddUpdateCountryConfiguration",
    element: "AddUpdateCountryConfiguration",
    roleId: [1],
    breadcrumb: "AddUpdateCountryConfiguration",
  },
  {
    path: "/Admin/AdminTax",
    element: "AdminTax",
    roleId: [1],
    breadcrumb: "AdminTax",
  },
  {
    path: "/Admin/AdminTax/AdminTaxDetails",
    element: "AdminTaxDetails",
    roleId: [1],
    breadcrumb: "AdminTaxDetails",
  },
  {
    path: "/Admin/DiscountPage",
    element: "DiscountPage",
    roleId: [1],
    breadcrumb: "DiscountPage",
  },
  {
    path: "/Admin/DiscountPage/DiscountInputField",
    element: "DiscountInputField",
    roleId: [1],
    breadcrumb: "DiscountInputField",
  },
  {
    path: "/Admin/Problem",
    element: "Problem",
    roleId: [1],
    breadcrumb: "Problem",
  },
  {
    path: "/Admin/TicketStatus",
    element: "TicketStatus",
    roleId: [1],
    breadcrumb: "TicketStatus",
  },
  {
    path: "/Admin/ProductDocumentCategory",
    element: "ProductDocumentCategory",
    roleId: [1],
    breadcrumb: "ProductDocumentCategory",
  },
  {
    path: "/Admin/ProductDocument",
    element: "ProductDocument",
    roleId: [1],
    breadcrumb: "ProductDocument",
  },
  {
    path: "/Admin/ProductDocument/AddOrUpdateProductDocument",
    element: "AddOrUpdateProductDocument",
    roleId: [1],
    breadcrumb: "AddOrUpdateProductDocument",
  },
  {
    path: "/Admin/HomeImage",
    element: "HomeImage",
    roleId: [1],
    breadcrumb: "HomeImage",
  },
];

export const totalElements = {
  Home: <Home />,
  Support: <Support />,
  MyAccount: <MyAccount />,
  Datacenter: <Datacenter />,
  ServiceRequest: <ServiceRequest />,
  Ticket: <Ticket />,
  ProductHome: <ProductHome />,
  ContactUs: <ContactUs />,
  WarrantyLookUp: <WarrantyLookUp />,
  PartsLookUp: <PartsLookUp />,
  MyOrders: <MyOrders />,
  MyProduct: <MyProduct />,
  MyAccountPopup: <MyAccountPopup />,
  Render: <RenderLinkPage />,
  Admin: <Admin />,
  ReviewTicket: <ReviewTicket />,
  ProdctTags: <ProdctTags />,
  ProductCategory: <ProductCategory />,
  ProductCustomizationCategory: <ProductCustomizationCategory />,
  Product: <Product />,
  ProductDetails: <ProductDetails />,
  Language: <Language />,
  UserManagements: <UserManagements />,
  SideBar: <SideBar />,
  FooterConfiguration: <FooterConfiguration />,
  TicketAssign: <TicketAssign />,
  OperatingSystem: <OperatingSystem />,
  DriverGroup: <DriverGroup />,
  ProductCustomizationCategoryDetails: <ProductCustomizationCategoryDetails />,
  Driver: <Driver />,
  AddOrUpdateDriver: <AddOrUpdateDriver />,
  HowtoPage: <HowtoPage />,
  HowtoInputFields: <HowtoInputFields />,
  ManualsPage: <ManualsPage />,
  ManualsInputField: <ManualsInputField />,
  UserModal: <UserModal />,
  CountryConfiguration: <CountryCurrency />,
  AddUpdateCountryConfiguration: <CountryEdit />,
  AdminTax: <AdminTax />,
  AdminTaxDetails: <AdminTaxDetails />,
  DiscountPage: <DiscountPage />,
  DiscountInputField: <DiscountInputField />,
  Problem: <Problem />,
  TicketStatus: <TicketStatus />,
  ProductDocumentCategory: <ProductDocumentCategory />,
  ProductDocument: <ProductDocument />,
  AddOrUpdateProductDocument: <AddOrUpdateProductDocument />,
  HomeImage: <HomeImage />,
};
