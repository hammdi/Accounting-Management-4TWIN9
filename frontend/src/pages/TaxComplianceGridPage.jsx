import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TaxComplianceGridLayer from "../components/TaxComplianceGridLayer";


const TaxComplianceGridPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersGridLayer */}
        <TaxComplianceGridLayer />

      </MasterLayout>

    </>
  );
};

export default TaxComplianceGridPage; 
