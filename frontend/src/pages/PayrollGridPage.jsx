import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PayrollGridLayer from "../components/PayrollGridLayer";


const PayrollGridPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersGridLayer */}
        <PayrollGridLayer />

      </MasterLayout>

    </>
  );
};

export default PayrollGridPage; 
