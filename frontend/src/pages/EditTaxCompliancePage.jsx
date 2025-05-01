import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditTaxComplianceLayer from "../components/EditTaxComplianceLayer";


const EditTaxCompliancePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add User" />

        {/* AddUserLayer */}
        <EditTaxComplianceLayer />


      </MasterLayout>
    </>
  );
};

export default EditTaxCompliancePage;
