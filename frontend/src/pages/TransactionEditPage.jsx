import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TransactionEditLayer from "../components/TransactionEditLayer";




const TransactionEditPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Transaction - Edit" />

        {/* TransactionEditLayer */}
        <TransactionEditLayer />

      </MasterLayout>

    </>
  );
};

export default TransactionEditPage;
