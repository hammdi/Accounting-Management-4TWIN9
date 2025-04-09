import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CompanyFormLayer from "../components/CompanyFormLayer";

const CompanyFormPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Company - Add" />
        {/* CompanyFormLayer */}
        <CompanyFormLayer />
      </MasterLayout>
    </>
  );
};

export default CompanyFormPage;
