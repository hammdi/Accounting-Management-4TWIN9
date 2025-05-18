import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CodeGeneratorLayer from "../components/CodeGeneratorLayer";


const CodeGeneratorPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="AI accounting assistant" />

        {/* CodeGeneratorLayer */}
        <CodeGeneratorLayer />


      </MasterLayout>
    </>
  );
};

export default CodeGeneratorPage;
