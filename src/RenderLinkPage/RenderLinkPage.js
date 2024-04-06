import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCrudApi } from "../webServices/webServices";
import "./RenderLinkPage.css";

export default function RenderLinkPage() {
  const location = useLocation();
  const [rawContent, setRawContent] = useState(null);
  const stateData = location?.state;
  const getHowToData = async (data) => {
    await getCrudApi("api/v1/howto/" + data?.howToId, {}).then((res) => {
      let html = JSON?.parse(res[0]?.rawContent)?.html;
      setRawContent(html);
    });
  };
  const getManualsData = async (data) => {
    await getCrudApi("api/v1/manuals/" + data?.manualsID, {}).then((res) => {
      let html = JSON?.parse(res[0]?.rawContent)?.html;
      setRawContent(html);
    });
  };
  useEffect(() => {
    if (stateData?.type === "howto" && stateData?.data) {
      getHowToData(stateData?.data);
    }
    if (stateData?.type === "manuals" && stateData?.data) {
      getManualsData(stateData?.data);
    }
  }, []);

  return (
    <>
      <div
        className="render-div-container"
        dangerouslySetInnerHTML={{ __html: rawContent }}
      ></div>
    </>
  );
}
