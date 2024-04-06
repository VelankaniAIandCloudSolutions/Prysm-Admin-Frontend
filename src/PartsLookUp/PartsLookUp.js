import React from "react";
import Select from "react-select";
import "./PartsLookUp.css";
import { HiMiniCpuChip } from "react-icons/hi2";
import { PiShieldCheck } from "react-icons/pi";
import { BsCart } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { TbMathGreater } from "react-icons/tb";
export default function PartsLookUp() {
  const options = [
    { value: "MachineInfo", label: "Machine Info" },
    { value: "PartNumber", label: "Part Number" },
  ];

  const faqData = [
    {
      question: "1. What is Lenovo Parts Lookup?",
      answer:
        "Lenovo Parts Lookup is an online tool provided by Lenovo that allows users to search for specific parts and accessories related to Lenovo products. It helps users identify and locate the correct parts they need for their Lenovo devices, such as laptops, desktops, tablets, and accessories.",
    },
    {
      question: "2. What information do I need to use Lenovo Parts Lookup?",
      answer:
        "You need the serial number, machine type, or model number of your Lenovo deviceTo use Lenovo Parts Lookup, you will need to have the serial number, machine type, or product/part /model number of your Lenovo device. This information can usually be found on the product label or sticker attached to your device. It is important to enter the correct information to ensure accurate search results.",
    },
    {
      question:
        "3. Where can I find the serial number, machine type, or model number of my Lenovo device?",
      answer:
        "The location of the serial number, machine type, or model number may vary depending on the type of Lenovo device you have. Generally, you can find this information on the product label or sticker attached to your device. For laptops, it is often located on the bottom case or inside the battery compartment. Desktops may have it on the back or side panel. Tablets may have it on the back cover. If youre having trouble locating the information, you can refer to the user manual or contact Lenovo support.",
    },
    {
      question:
        "4. What types of parts can I look up using Lenovo Parts Lookup?",
      answer:
        "Lenovo Parts Lookup allows you to search for a wide range of parts and accessories related to Lenovo devices. This includes components such as batteries, power adapters, keyboards, memory modules, hard drives, solid-state drives (SSDs), display panels, cables, and various other parts that may need replacement or upgrade.",
    },
    {
      question: "5. Can I purchase parts directly through Lenovo Parts Lookup?",
      answer:
        "Yes, you can purchase parts directly through Lenovo Parts Lookup. Lenovo Parts Lookup is primarily designed to help users identify the correct parts and accessories for their Lenovo devices. Once you have identified the specific part you need, you can then proceed to purchase it through Lenovo Parts Lookup.",
    },
  ];

  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="Container-head">
      <div className="header-mask">
        <div className="partlookup-header-title">Genuine Lenovo Parts</div>
        <div className="header-description">
          Provide your Serial Number and we’ll find you the best solution
        </div>
      </div>
      <div>
        <div className="Box-header">
          <h1>Find Parts</h1>
        </div>
        <div className="partlookup-ContactUs_top">
          <div className="ContactUs">
            <h3>Search By</h3>
            <div>
              <input type="radio" name="searchOption" />
              <label htmlFor="MachineInfo">Machine Info</label>
              <input type="radio" name="searchOption" />
              <label htmlFor="PartNumber">Part Number</label>
            </div>
            <br></br>

            <div className="partlookup-searchbar">
              <Select
                className="partaLookupDropdown-input"
                options={options}
                isSearchable={true}
                placeholder="Search partsLookup...."
              />
              <button className="submit" type="submit">
                Submit
              </button>
              <br />
            </div>
            <br />
          </div>
          <div className="inline-divider-or">OR</div>
          <div>
            <p className="intro_text">
              Save time by letting Lenovo Service Bridge automatically scan your
              product to <br />
              find its name and serial number.
            </p>
            <br />
            <div>
              <button className="partlookup_searchbar_button">
                <div className="Lap-icon">
                  <FaLaptopCode />
                </div>
                <div>
                  <h4>Detect My Device</h4>
                </div>
              </button>
            </div>
            <br />
          </div>
        </div>
      </div>
      <div>
        <h1 className="Box-header">Other Options</h1>
        <div class="Content-Lookup">
          <div class="box-lookup">
            <div class="parts-box-content">
              <div class="icon-lookup">
                <HiMiniCpuChip />
              </div>
              <h3>Parts Batch Query</h3>
              <p>Search multiple part numbers to find details</p>
              <div className="icon-math">
                <h3>
                  <TbMathGreater className="icon-math" />
                </h3>
              </div>
            </div>
          </div>
          <div class="box-lookup">
            <div class="parts-box-content">
              <div class="icon-lookup">
                <PiShieldCheck />
              </div>
              <h3>Check Warranty Status</h3>
              <p>Make Sure your product is covered or Check Status</p>
              <div className="icon-math">
                <h3>
                  <TbMathGreater className="icon-math" />
                </h3>
              </div>
            </div>
          </div>
          <div class="box-lookup">
            <div class="parts-box-content">
              <div class="icon-lookup">
                <BsCart />
              </div>
              <h3>Order Parts</h3>
              <p>Purchase Parts from authorized outlets. </p>
              <h3>
                <TbMathGreater className="icon-math" />
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="content-intruduce">
        <p>
          Lenovo parts lookup is a great way to find the right Lenovo parts for
          your computer, quickly and easily. Whether you are replacing or
          upgrading hardware, Lenovo parts lookup can<br></br>
          provide you with detailed product information such as compatibility
          and specs. You can even filter by type, so you find just the Lenovo
          part that fits your needs. With Lenovo parts<br></br>
          lookup, finding the rightLenovo part has never been easier!{" "}
        </p>
        <div>
          <h3>Standard benefits:</h3>
          <p>
            {" "}
            - Genuine Lenovo Parts - Order the correct replacement part for your
            Lenovo product.
          </p>
          <p>
            {" "}
            - High Performance Replacement Parts - Data Center Parts, Laptop
            Parts, PC Parts.
          </p>
          <p>
            {" "}
            - Get your device repaired and back to working order as quickly as
            possible.
          </p>
        </div>
      </div>
      <div className="seo-content_question">
        <h3>Lenovo Parts Lookup FAQs :</h3>
        <div>
          <ul className="item-list">
            {faqData.map((item, index) => (
              <li
                key={index}
                className={`faq-item ${
                  activeQuestion === index ? "active" : ""
                }`}
              >
                <div onClick={() => toggleAccordion(index)}>
                  <BsChevronDown
                    className={`chevron-icon ${
                      activeQuestion === index ? "active" : ""
                    }`}
                  />
                  <h4>{item.question}</h4>
                </div>
                {activeQuestion === index && <p>{item.answer}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
