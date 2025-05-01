import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddTaxComplianceLayer from "../components/AddTaxComplianceLayer";


const AddTaxCompliancePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add User" />

        {/* AddUserLayer */}
        <AddTaxComplianceLayer />


      </MasterLayout>
    </>
  );
};

export default AddTaxCompliancePage;
