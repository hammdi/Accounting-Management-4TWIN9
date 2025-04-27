import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddPayrollLayer from "../components/AddPayrollLayer";


const AddPayrollPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add User" />

        {/* AddUserLayer */}
        <AddPayrollLayer />


      </MasterLayout>
    </>
  );
};

export default AddPayrollPage;
