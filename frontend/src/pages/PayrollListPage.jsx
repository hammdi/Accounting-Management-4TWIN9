import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PayrollListLayer from "../components/PayrollListLayer";


const PayrollListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <PayrollListLayer />

      </MasterLayout>

    </>
  );
};

export default PayrollListPage; 
