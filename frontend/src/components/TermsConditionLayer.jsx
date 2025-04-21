import React from 'react';

const TermsConditionLayer = () => {
    return (
        <div className="card terms-conditions radius-12 shadow-lg overflow-hidden">
            <div className="card-header bg-primary-600 text-white p-24">
                <h2 className="mb-0 text-center">Terms and Conditions</h2>
            </div>
            <div className="card-body p-40 bg-light">
                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">1. Introduction</h4>
                    <p className="text-secondary-light text-lg">
                        Welcome to our Accounting Management System. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">2. User Responsibilities</h4>
                    <p className="text-secondary-light text-lg">
                        As a user, you are responsible for maintaining the confidentiality of your account credentials and ensuring that all activities conducted under your account comply with these terms.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">3. Data Privacy</h4>
                    <p className="text-secondary-light text-lg">
                        We are committed to protecting your financial data. All information is encrypted and stored securely in compliance with industry standards. For more details, please refer to our Privacy Policy.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">4. Payment and Billing</h4>
                    <p className="text-secondary-light text-lg">
                        Payments for subscriptions or additional services must be made in accordance with the billing terms provided. Failure to pay may result in suspension or termination of your account.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">5. Limitations of Liability</h4>
                    <p className="text-secondary-light text-lg">
                        We are not liable for any indirect, incidental, or consequential damages arising from the use of our platform. Users are advised to ensure the accuracy of their financial data.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">6. Termination</h4>
                    <p className="text-secondary-light text-lg">
                        We reserve the right to terminate or suspend your account if you violate these terms or engage in activities that harm the platform or other users.
                    </p>
                </section>

                <section className="mb-32">
                    <h4 className="text-primary-600 mb-16">7. Modifications to Terms</h4>
                    <p className="text-secondary-light text-lg">
                        We may update these terms from time to time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of the updated terms.
                    </p>
                </section>

                <section>
                    <h4 className="text-primary-600 mb-16">8. Contact Us</h4>
                    <p className="text-secondary-light text-lg">
                        If you have any questions about these terms, please contact our support team at <a href="mailto:support@accountingmanagement.com" className="text-primary-600">support@accountingmanagement.com</a>.
                    </p>
                </section>
            </div>
            <div className="card-footer bg-base p-24 text-center">
                <button className="btn btn-primary px-40 py-12 radius-8">Accept</button>
                <button className="btn btn-secondary px-40 py-12 radius-8 ml-16">Decline</button>
            </div>
        </div>
    );
};

export default TermsConditionLayer;