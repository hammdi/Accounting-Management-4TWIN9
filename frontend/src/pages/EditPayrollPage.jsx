import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditPayrollLayer from "../components/EditPayrollLayer";


const EditPayrollPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add User" />

        {/* AddUserLayer */}
        <EditPayrollLayer />


      </MasterLayout>
    </>
  );
};

export default EditPayrollPage;
