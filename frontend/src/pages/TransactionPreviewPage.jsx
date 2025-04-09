import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TransactionPreviewLayer from "../components/TransactionPreviewLayer";




const TransactionPreviewPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Transaction - Preview" />

        {/* TransactionPreviewLayer */}
        <TransactionPreviewLayer />

      </MasterLayout>

    </>
  );
};

export default TransactionPreviewPage;
