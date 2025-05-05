import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProjectLayer from "../components/ProjectLayer";


const TransactionAddPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>


        {/* Breadcrumb */}
        <Breadcrumb title="Accounting Projects" />
        <ProjectLayer />


      </MasterLayout>

    </>
  );
};

export default TransactionAddPage;
