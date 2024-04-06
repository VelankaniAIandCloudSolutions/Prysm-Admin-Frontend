import React from "react";
import "./Footer.css";
import { FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="listsOfLinks">
        <div className="gridForLinks">
          {t("footer.links", { returnObjects: true }).map((link) => {
            return (
              <div className="innergrid">
                <grid item>
                  <item>
                    <h3 className="LinkTitle">{link.groupName}</h3>
                  </item>
                </grid>
                {link.groupItems.map((innerlink) => {
                  return (
                    <grid item className="grid_element">
                      <item>
                        <NavLink
                          className="gridForLinks_anchor"
                          to={innerlink.link}
                        >
                          {innerlink.linkName}
                        </NavLink>
                      </item>
                    </grid>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <br />
      <div className="footerLinks">
        <NavLink
          to="https://www.facebook.com/velankanigroup/"
          className="social_link"
        >
          <BsFacebook />
        </NavLink>
        &nbsp;&nbsp;
        <NavLink
          to="https://www.youtube.com/c/VelankaniGroup"
          className="social_link"
        >
          <FaYoutube />
        </NavLink>
        &nbsp;&nbsp;
        <NavLink
          to="https://www.linkedin.com/company/velankanigroup/?originalSubdomain=in"
          className="social_link"
        >
          <FaLinkedinIn />
        </NavLink>
      </div>
      <div className="powered_by"> ©  {new Date().getFullYear() }  Velankani. All rights reserved</div>
    </div>
  );
}
