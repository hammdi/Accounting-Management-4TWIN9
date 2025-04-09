import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CompanyDetailsLayer from "../components/CompanyDetailsLayer";

const CompanyDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Company - Details" />
        {/* CompanyDetailsLayer */}
        <CompanyDetailsLayer />
      </MasterLayout>
    </>
  );
};

export default CompanyDetailsPage;
