import React, { useState } from "react";
import "./ContactUs.css";
import { useNavigate } from "react-router-dom";
import { FaHeadphones } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsClipboardCheckFill } from "react-icons/bs";
import { PiUserListFill } from "react-icons/pi";
import { GiAutoRepair } from "react-icons/gi";
import { BiSolidConversation } from "react-icons/bi";
import { FaYoutube } from "react-icons/fa";
import { BiSolidFileFind } from "react-icons/bi";
import { getDecodedToken } from "../Helpers/validateToken";
import MyAccountPopup from "../MyAccountPopup/MyAccountPopup";

export default function ContactUs() {
  const [isShow, setIsShow] = useState(false);
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const handleServiceRequest = () => {
    setPage("ContactUs");
    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length > 10
    ) {
      let decodedToken = getDecodedToken(sessionStorage.getItem("user"));
      if (parseInt(decodedToken?.isStaff) === (0 | 1))
        navigate("/Home/DataCenter/Support/ServiceRequest");
    } else {
      setIsShow(true);
    }
  };
  const Elements = [
    {
      onclick: handleServiceRequest,
      icon: <RiCustomerServiceFill />,
      name: "Submit A Service Request For Customers",
      paragraph:
        "Select this if you are a Customer who has basic warranty,Primier,...",
      label: "Submit Now >",
    },
    {
      icon: <BsClipboardCheckFill />,
      name: "Velankani Support Plans",
      paragraph: "Aguide to getting the best support possible",
      label: "Learn More >",
    },
    {
      icon: <PiUserListFill />,
      name: "Support Phone List",
      paragraph: "Access the worlswide Support Phone list",
      label: "Call Specialist >",
    },
    {
      icon: <GiAutoRepair />,
      name: "Check Repair Status",
      paragraph: "Check the status of your repair ticket",
      label: "View Repair Status",
    },
    {
      icon: <BiSolidConversation />,
      name: "Consult our Form",
      paragraph: "Get assistance of our community",
      label: "Visit The Form >",
    },
    {
      icon: <FaYoutube />,
      name: "Velankani Support on YouTube",
      paragraph: "Access instructional content about the product",
      label: "Learn More >",
    },
    {
      icon: <BiSolidFileFind />,
      name: "How do i find my Product information",
      paragraph: "Get help with product information",
      label: "Learn More >",
    },
  ];

  return (
    <div className="ContactUs">
      <div className="imageHedding">
        <div className="ContactUs_Icon">
          <FaHeadphones />
        </div>
        <h2>Contact Us</h2>
      </div>
      <div className="contactus_elements">
        {Elements.map((e) => {
          return (
            <div className="contactus_element" onClick={e.onclick}>
              <div className="ContactUs_Icons">{e.icon}</div>
              <h5 className="element_name">{e.name}</h5>
              <p className="element_details">{e.paragraph}</p>
              <label className="element_label">{e.label}</label>
            </div>
          );
        })}
      </div>
      {isShow ? (
        <MyAccountPopup page={page} setIsShow={setIsShow} setPage={setPage} />
      ) : (
        <></>
      )}
    </div>
  );
}
