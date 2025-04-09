import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TransactionAddLayer from "../components/TransactionAddLayer";




const TransactionAddPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Transaction - Add" />

        {/* TransactionAddLayer */}
        <TransactionAddLayer />

      </MasterLayout>

    </>
  );
};

export default TransactionAddPage;
