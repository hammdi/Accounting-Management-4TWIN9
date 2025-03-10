import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CompanyListLayer from "../components/CompanyListLayer";

const CompanyListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Companies" />
        {/* CompanyListLayer */}
        <CompanyListLayer />
      </MasterLayout>
    </>
  );
};

export default CompanyListPage;
