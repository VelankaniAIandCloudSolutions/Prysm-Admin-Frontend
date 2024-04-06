import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleClick = (id,active) => {
    if(active){
      sessionStorage.setItem("parentProductId",id);
    navigate("/Home/DataCenter", { state: { parentProductId : id} });
    }
  };

  return (
    <div className="main-container">
      <div className="parenthome">
        <p className="parenthome_Header">{t("homePage.pageTitle")}</p>
        <span className="parenthome_sub_heading">
          {t("homePage.titleDescription")}
        </span>
        <h2 className="parenthome_Header_2"> {t("homePage.groupHeading")}</h2>
        <div className="Home">
          {t("productFamily", { returnObjects: true }).map((e) => {
           return (
            <>
            {e.isActive !== 2?
            <div className="element-container">
              <div onClick={()=>handleClick(e.productFamilyId,e.isActive === 1)} >
                <div className="productFamilyCard">
                  {e.isActive === 3 && (
                    <div class="home_ribbon">
                      <span class="home_ribbon3">Coming Soon</span>
                    </div>
                  )}
                  <img
                    className="elementImage"
                    alt="pic"
                    src={process.env.REACT_APP_AWS_S3_PUBLIC_URL+e.imageURL}
                  />
                  <br />
                  <h3>{e.productFamilyTitle}</h3>
                  <p>{e.productDescription}</p>
                </div>
              </div>
            </div>
          :<></>}
            </>
          );
          })}
        </div>
      </div>
    </div>
  );
}
