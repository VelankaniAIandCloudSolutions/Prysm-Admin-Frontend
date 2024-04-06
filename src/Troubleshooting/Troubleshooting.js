import React from "react";
import "./Troubleshooting.css";

import { AiOutlineShareAlt } from "react-icons/ai";
import { BiSolidBook, BiSupport } from "react-icons/bi";
import { BsTools } from "react-icons/bs";
import { LuBookUp2 } from "react-icons/lu";
import { SiOpensourcehardware } from "react-icons/si";
import { MdSupportAgent } from "react-icons/md";

const Elements = [
  {
    icon: <BiSolidBook />,
    title: "Popular Help Topic",
  },
  {
    icon: <MdSupportAgent />,
    title: "OS Support",
  },
  {
    icon: <BsTools />,
    title: "Tools Center",
  },
  {
    icon: <LuBookUp2 />,
    title: "OS Interoperability Guide",
  },
  {
    icon: <SiOpensourcehardware />,
    title: "Hardware Compatibility Check",
  },
  {
    icon: <BiSupport />,
    title: "Contact Us",
  },
];

export default function Troubleshooting() {
  return (
    <div>
      <div className="TroubleshootingTop">
        <div className="troubleShootingImageHeading">
          <div className="trubleShootIcon">
            <AiOutlineShareAlt />
          </div>
          <h2>Troubleshooting</h2>
        </div>

        <p>
          Many problems can be resolved with a driver and software update,
          followed by a reboot. If that doesn't work, we have a wealth of help
          articles you can consult. You can also reach out to us directly.
        </p>
      </div>
      <div className="Troubleshooting_elements">
        {Elements.map((e) => {
          return (
            <div className="Troubleshooting_element">
              <div className="TrubleShooting_Icon">{e.icon}</div>
              <p className="Troubleshooting_element_p">{e.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
