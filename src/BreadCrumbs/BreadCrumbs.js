import React from "react";
import "./Breadcrumbs.css";
import { NavLink, useOutletContext } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
const Breadcrumbs = () => {
  const context = useOutletContext();
  const routing = context?.routes;

  const breadcrumbs = useBreadcrumbs(routing);
  return (
    <div className="breadcrumb-holder">
      <div className="angled-breadcrumbs">
        {breadcrumbs?.map(({ match, breadcrumb }, index) =>
          index !== 0 ? (
            <div className="bc" key={match.pathname}>
              <NavLink key={match.pathname} to={match.pathname || ""}>
                {breadcrumb}
              </NavLink>
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
};
export default Breadcrumbs;
