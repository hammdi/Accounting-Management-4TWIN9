import React from 'react';

const FaqLayer = () => {
    return (
        <div className="card basic-data-table">
            <div className="card-header p-0 border-0">
                <div className="responsive-padding-40-150 bg-light-pink">
                    <div className="row gy-4 align-items-center">
                        <div className="col-xl-7">
                            <h4 className="mb-20">Frequently Asked Questions</h4>
                            <p className="mb-0 text-secondary-light max-w-634-px text-xl">
                                Find answers to the most common questions about our accounting management system.
                            </p>
                        </div>
                        <div className="col-xl-5 d-xl-block d-none">
                            <img src="assets/images/faq-img.png" alt="FAQ Illustration" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body bg-base responsive-padding-40-150">
                <div className="row gy-4">
                    <div className="col-lg-4">
                        <div
                            className="active-text-tab nav flex-column nav-pills bg-base shadow py-0 px-24 radius-12 border"
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                        >
                            <button
                                className="nav-link text-secondary-light fw-semibold text-xl px-0 py-16 border-bottom active"
                                id="v-pills-general-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-general"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-general"
                                aria-selected="true"
                            >
                                General
                            </button>
                            <button
                                className="nav-link text-secondary-light fw-semibold text-xl px-0 py-16 border-bottom"
                                id="v-pills-invoices-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-invoices"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-invoices"
                                aria-selected="false"
                            >
                                Invoices
                            </button>
                            <button
                                className="nav-link text-secondary-light fw-semibold text-xl px-0 py-16 border-bottom"
                                id="v-pills-reports-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-reports"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-reports"
                                aria-selected="false"
                            >
                                Reports
                            </button>
                            <button
                                className="nav-link text-secondary-light fw-semibold text-xl px-0 py-16"
                                id="v-pills-security-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-security"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-security"
                                aria-selected="false"
                            >
                                Security
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="tab-content" id="v-pills-tabContent">
                            {/* General Tab */}
                            <div
                                className="tab-pane fade show active"
                                id="v-pills-general"
                                role="tabpanel"
                                aria-labelledby="v-pills-general-tab"
                                tabIndex={0}
                            >
                                <div className="accordion" id="accordionGeneral">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#general-collapseOne"
                                                aria-expanded="true"
                                                aria-controls="general-collapseOne"
                                            >
                                                What is an accounting management system?
                                            </button>
                                        </h2>
                                        <div
                                            id="general-collapseOne"
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#accordionGeneral"
                                        >
                                            <div className="accordion-body">
                                                An accounting management system is a software solution designed to help businesses manage their financial transactions, generate reports, and ensure compliance with accounting standards.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#general-collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="general-collapseTwo"
                                            >
                                                Can I customize the system for my business needs?
                                            </button>
                                        </h2>
                                        <div
                                            id="general-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionGeneral"
                                        >
                                            <div className="accordion-body">
                                                Yes, our system is highly customizable to fit the unique requirements of your business, including custom reports, workflows, and integrations.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoices Tab */}
                            <div
                                className="tab-pane fade"
                                id="v-pills-invoices"
                                role="tabpanel"
                                aria-labelledby="v-pills-invoices-tab"
                                tabIndex={0}
                            >
                                <div className="accordion" id="accordionInvoices">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#invoices-collapseOne"
                                                aria-expanded="true"
                                                aria-controls="invoices-collapseOne"
                                            >
                                                How do I create an invoice?
                                            </button>
                                        </h2>
                                        <div
                                            id="invoices-collapseOne"
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#accordionInvoices"
                                        >
                                            <div className="accordion-body">
                                                You can create an invoice by navigating to the "Invoices" section, clicking "Create New Invoice," and filling in the required details such as client information, items, and amounts.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#invoices-collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="invoices-collapseTwo"
                                            >
                                                Can I track unpaid invoices?
                                            </button>
                                        </h2>
                                        <div
                                            id="invoices-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionInvoices"
                                        >
                                            <div className="accordion-body">
                                                Yes, the system provides a dashboard to track unpaid invoices, their due dates, and send reminders to clients.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reports Tab */}
                            <div
                                className="tab-pane fade"
                                id="v-pills-reports"
                                role="tabpanel"
                                aria-labelledby="v-pills-reports-tab"
                                tabIndex={0}
                            >
                                <div className="accordion" id="accordionReports">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#reports-collapseOne"
                                                aria-expanded="true"
                                                aria-controls="reports-collapseOne"
                                            >
                                                What types of reports can I generate?
                                            </button>
                                        </h2>
                                        <div
                                            id="reports-collapseOne"
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#accordionReports"
                                        >
                                            <div className="accordion-body">
                                                You can generate various reports, including profit and loss statements, balance sheets, cash flow statements, and tax reports.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#reports-collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="reports-collapseTwo"
                                            >
                                                Can I export reports to Excel or PDF?
                                            </button>
                                        </h2>
                                        <div
                                            id="reports-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionReports"
                                        >
                                            <div className="accordion-body">
                                                Yes, all reports can be exported to Excel or PDF formats for easy sharing and analysis.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Tab */}
                            <div
                                className="tab-pane fade"
                                id="v-pills-security"
                                role="tabpanel"
                                aria-labelledby="v-pills-security-tab"
                                tabIndex={0}
                            >
                                <div className="accordion" id="accordionSecurity">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#security-collapseOne"
                                                aria-expanded="true"
                                                aria-controls="security-collapseOne"
                                            >
                                                How secure is my financial data?
                                            </button>
                                        </h2>
                                        <div
                                            id="security-collapseOne"
                                            className="accordion-collapse collapse show"
                                            data-bs-parent="#accordionSecurity"
                                        >
                                            <div className="accordion-body">
                                                Your financial data is encrypted and stored securely on our servers, ensuring compliance with industry standards.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button
                                                className="accordion-button text-primary-light text-xl collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#security-collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="security-collapseTwo"
                                            >
                                                Can I control user access to sensitive data?
                                            </button>
                                        </h2>
                                        <div
                                            id="security-collapseTwo"
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionSecurity"
                                        >
                                            <div className="accordion-body">
                                                Yes, you can set user roles and permissions to control access to sensitive financial data.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqLayer;