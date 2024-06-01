import React from "react";
import "./PageLoader.scss";

const PageLoader = () => {
  return (
    <div className="page_loader_container">
      <div className="page_loader">
        <div className="loader">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
