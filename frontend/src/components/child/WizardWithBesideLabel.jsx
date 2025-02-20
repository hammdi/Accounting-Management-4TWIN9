import React, { useState } from "react";
import axios from "axios";

const WizardWithBesideLabel = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
    cardNumber: "",
    cardExpiration: "",
    cvv: "",
    bankName: "",
    branchName: "",
    accountName: "",
    accountNumber: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://your-api-endpoint.com/signup", formData);
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
      <div className='col-md-6'>
        <div className='card'>
          <div className='card-body'>
            <h6 className='mb-4 text-xl'>Wizard with beside label</h6>
            <p className='text-neutral-500'>Fill up your details and proceed next steps.</p>
            <div className='form-wizard'>
              <form>
                {currentStep === 1 && (
                    <fieldset>
                      <h6 className='text-md text-neutral-500'>Personal Information</h6>
                      <input name='firstName' type='text' placeholder='First Name' onChange={handleChange} />
                      <input name='lastName' type='text' placeholder='Last Name' onChange={handleChange} />
                      <input name='email' type='email' placeholder='Email' onChange={handleChange} />
                      <input name='password' type='password' placeholder='Password' onChange={handleChange} />
                      <input name='confirmPassword' type='password' placeholder='Confirm Password' onChange={handleChange} />
                      <button onClick={nextStep} type='button'>Next</button>
                    </fieldset>
                )}
                {currentStep === 2 && (
                    <fieldset>
                      <h6>Account Information</h6>
                      <input name='userName' type='text' placeholder='User Name' onChange={handleChange} />
                      <input name='cardNumber' type='number' placeholder='Card Number' onChange={handleChange} />
                      <input name='cardExpiration' type='text' placeholder='MM/YY' onChange={handleChange} />
                      <input name='cvv' type='number' placeholder='CVV' onChange={handleChange} />
                      <button onClick={prevStep} type='button'>Back</button>
                      <button onClick={nextStep} type='button'>Next</button>
                    </fieldset>
                )}
                {currentStep === 3 && (
                    <fieldset>
                      <h6>Bank Information</h6>
                      <input name='bankName' type='text' placeholder='Bank Name' onChange={handleChange} />
                      <input name='branchName' type='text' placeholder='Branch Name' onChange={handleChange} />
                      <input name='accountName' type='text' placeholder='Account Name' onChange={handleChange} />
                      <input name='accountNumber' type='number' placeholder='Account Number' onChange={handleChange} />
                      <button onClick={prevStep} type='button'>Back</button>
                      <button onClick={nextStep} type='button'>Next</button>
                    </fieldset>
                )}
                {currentStep === 4 && (
                    <fieldset>
                      <h6>Completion</h6>
                      <p>Review your details and submit.</p>
                      <button onClick={prevStep} type='button'>Back</button>
                      <button onClick={handleSubmit} type='button'>Publish</button>
                    </fieldset>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default WizardWithBesideLabel;
