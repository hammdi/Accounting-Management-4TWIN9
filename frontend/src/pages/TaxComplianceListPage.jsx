import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TaxComplianceListLayer from "../components/TaxComplianceListLayer";


const TaxComplianceListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <TaxComplianceListLayer />

      </MasterLayout>

    </>
  );
};

export default TaxComplianceListPage; 
