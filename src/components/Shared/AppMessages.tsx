import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { currencyFormatter, dateFormatter, dateFormatter2 } from "../../HelperMethods";

export const RESET_PASSWORD_SENT_MSG = "If a username in our system matches the username entered, an email will be sent to the corresponding email!";
export const RESET_PASSWORD_SUCCESS_MSG = "Password reset successfully!";
export const ERROR_MSG = "Something went wrong! Please contact admin!";
export const REGISTRATION_SUCCESS_MSG = "Registration completed successfully!";
export const REGISTRATION_LINK_SENT = "Registration link sent successfully!";
export const CHANGE_PASSWORD = "Password changed successfully!";
export const CLOSE_MSG = "Are you sure you want to close?";
export const SUBMIT_ORDER = "Are you sure you want to submit the requisition?";
export const DELETE_POSITION = "Are you sure you want to delete this position?";
export const SAVED_ORDER_SUCCESS_MSG = "Requisition saved successfully!";
export const SUBMIT_ORDER_SUCCESS_MSG = "Requisition submitted successfully!";
export const REMOVE_ORDER_CONFIRM_MSG = "Are you sure you want to remove this requisition?";
export const APPROVE_ORDER_CONFIRM_MSG = "Are you sure you want to approve the requisition?";
export const REJECT_ORDER_CONFIRM_MSG = "Are you sure you want to reject the requisition?";
export const HOLD_ORDER_CONFIRM_MSG = "Are you sure you want to hold the requisition?";
export const REMOVE_HOLD_ORDER_CONFIRM_MSG = "Are you sure you want to remove hold from requisition?";
export const OFF_HOLD_ORDER_CONFIRM_MSG =
    "Are you sure you want to off hold the requisition?";
export const PENDING_APPROVAL_STATUS = "Pending Approval";
export const HOLD_APPROVAL_STATUS = "On Hold";
export const REJECT_APPROVAL_STATUS = "Rejected";
export const APPROVE_ORDER_CONFIRM_MSG_MULTIPLE = "Are you sure you want to approve the selected requisitions?";
export const REJECT_ORDER_CONFIRM_MSG_MULTIPLE = "Are you sure you want to reject the selected requisitions?";
export const HOLD_ORDER_CONFIRM_MSG_MULTIPLE = "Are you sure you want to hold the selected requisitions?";
export const REMOVE_HOLD_ORDER_CONFIRM_MSG_MULTIPLE = "Are you sure you want to remove hold from selected requisitions?";
export const APPROVE_ORDER_ACTION = "Approve";
export const REJECT_ORDER_ACTION = "Reject";
export const HOLD_ORDER_ACTION = "Hold";
export const REMOVE_HOLD_ORDER_ACTION = "Remove Hold";
export const CANCEL_ACTION = "Cancel";
export const APPROVE_ORDER_SUCCESS_MSG = "Requisition approved successfully!";
export const REJECT_ORDER_SUCCESS_MSG = "Requisition rejected successfully!";
export const HOLD_ORDER_SUCCESS_MSG = "Requisition put on hold successfully!";
export const REMOVE_HOLD_ORDER_SUCCESS_MSG = "Requisition removed from hold successfully!";
export const CANCEL_ORDER_SUCCESS_MSG = "Requisition cancelled successfully!";
export const CLOSE_REQ_SUCCESS_MSG = "Requisition closed successfully!";
export const APPROVE_ORDER_SUCCESS_MSG_M = "Selected requisition(s) approved successfully!";
export const REJECT_ORDER_SUCCESS_MSG_M = "Selected requisition(s) rejected successfully!";
export const HOLD_ORDER_SUCCESS_MSG_M = "Selected requisition(s) put on hold successfully!";
export const REMOVE_HOLD_ORDER_SUCCESS_MSG_M = "Selected requisition(s) removed from hold successfully!";
export const ORDER_NOT_ASSIGNED_MSG = "Sorry! This requisition is not assigned to you at this moment.";
export const SUBMIT_RELEASE_SUCCESS_MSG = "Requisition released successfully!";
export const ADD_BILL_RATE_SUCCESS_MSG = "Bill rate added successfully!";
export const UPDATE_BILL_RATE_SUCCESS_MSG = "Bill rate updated successfully!";
export const RELEASE_UPDATED_SUCCESS_MSG = "Release(s) updated successfully!";
export const REQ_APPROVERS_WARNING_MSG = "Please save all level(s) in Requisition Approvers section";
export const TS_APPROVERS_WARNING_MSG = "Please save all level(s) in Timesheet Approvers section";
export const TS_APPROVERS_REQUIRED_WARNING_MSG = "Approvers are required in Timesheet Approvers section";

// candidate submission messages
export const SAVED_CANDIDATE_SUCCESS_MSG = "Candidate saved successfully!";
export const SUBMIT_CANDIDATE_SUCCESS_MSG = "Candidate submitted successfully!";
export const NAME_CLEARED_CANDIDATE_SUCCESS_MSG = "Candidate name cleared successfully!";
export const NAME_NOT_CLEARED_CANDIDATE_SUCCESS_MSG = "Candidate name not cleared successfully!";
export const DELEGATE_CANDIDATE_SUCCESS_MSG = "Candidate delegated successfully!";
export const DELETED_CANDIDATE_SUCCESS_MSG = "Candidate submission deleted successfully!";
export const WITHDRAW_CANDIDATE_SUCCESS_MSG = "Candidate submission withdrawn successfully!";
export const REJECT_CANDIDATE_SUCCESS_MSG = "Candidate rejected successfully!";
export const SELECTED_SUBMITTED_CANDIDATE_SUCCESS_MSG = "Selected candidate(s) submitted successfully!";
export const PRESENTATION_SENT_SUCCESS_MSG = "Presentation sent successfully!";

export const BILLRATE_REJECTED_SUCCESS_MSG = "Bill rate rejected successfully!";
export const BILLRATE_SENT_NEGOTIATION_SUCCESS_MSG = "Bill rate sent for negotiation!";
export const BILLRATE_APPROVE_CONFIRMATION_MSG = "Are you sure you want to approve the bill rate?";
export const BILLRATE_APPROVE_SUCCESS_MSG = "Bill rate approved successfully!";
export const REJECT_ASSIGNMENT_SUCCESS_MSG = "Candidate Assignment rejected successfully!"
export const DELGATE_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Delegate Name Clear' </span> ?
    </span>
);

export const PENDING_RISK_SAVE_SUCCESS_MSG = "Candidate risk attestation saved successfully!";
export const PENDING_RISK_SUBMIT_SUCCESS_MSG = "Candidate risk attestation submitted successfully!";

export const RISK_CLEARED_SUCCESS_MSG = "Candidate risk cleared successfully!";
export const RISK_REJECTED_SUCCESS_MSG = "Candidate risk rejected!";

export const CLEAR_RISK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Risk Clear' </span> ?
    </span>
);

export const PRESENTATION_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Submit Presentation' </span>?
    </span>
);
export const PRESENTATION_SAVE_SUCCESS_MSG = "Candidate presentation saved successfully!";
export const PRESENTATION_SUBMIT_SUCCESS_MSG = "Candidate presentation submitted successfully!";
export const PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG = "Candidate presentation submitted to hiring manager successfully!";
export const PRESENTATION_REJECTED_SUCCESS_MSG = "Candidate presentation rejected!";

export const REQUEST_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Request An Interview' </span> ?
    </span>
);
export const REQUEST_AN_OFFER_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to continue with
        <span className="font-weight-extra-bold"> 'Ready for Offer' </span> ?
    </span>
);
export const SUBMIT_AN_OFFER_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to continue with
        <span className="font-weight-extra-bold"> 'Ready for Offer' </span> ?
    </span>
);
export const REQUEST_INTERVIEW_SUCCESS_MSG = "Candidate interview requested successfully!";
export const REQUEST_AN_OFFER_SUCCESS_MSG = "Candidate offer requested successfully!";
export const SUBMIT_AN_OFFER_SUCCESS_MSG = "Candidate offer submitted successfully!";

export const WITHDRAW_CANDIDATE = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-bold pl-1 pr1-"> 'Withdraw' </span> the
            candidate
            <span className="font-weight-bold"> {props || " "} </span>?
        </span>
    );
};

export const REJECT_CANDIDATE = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Reject' </span> the candidate
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};
export const REJECT_OFFER = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Reject' </span> the Offer
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};
export const REJECT_ASSIGNMENT = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Reject' </span> the Assignment
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};
//Candidate Risk
export const RISK_FACTOR_TITLE = "Does this candidate have Risk Factor?";
export const RISK_DISCLAMER =
    "Please disclose any and all risk factors of which you are aware of in regards to this provider's malpractice, background check, credentials and medical professional license. Please email (napateam@goringo.com) with any questions.";

export const SUBMIT_RISK_CONFIRMATION_MSG_ONE = (
    <>
        <p className="mb-2 mb-lg-3 col-12 font-weight-extra-bold">
            I attest that I have disclosed any and all risk factors of which I am aware of in regards to this provider’s malpractice, background
            check, credentials and medical professional license.
        </p>
        <p className="mb-2 mb-lg-3 col-12 font-weight-extra-bold">
            Even if risk factor is resolved (i.e. malpractice had no payout, provider cleared, criminal charges dismissed, license issue cleared,
            license revoked in any state), I understand I must disclose these factors along with any and all risk factors and attest “YES”. Any risk
            attested with “Yes” will not proceed until provider has cleared Risk by Client Action. Any risk factors of which come to light AFTER Risk
            Attestation, I will immediately alert Ringo <a href="mailto:Support@goringo.com">(Support@goringo.com)</a>
            and will not proceed with candidacy until new risk factor is added and cleared through Client Risk Attestation. If I fail to disclose any
            risk factor I am aware of or fail to do due diligence on provider’s malpractice, background, credentials and license, I will assume all
            financial responsibility and any penalties if applicable. If there are any questions, please email{" "}
            <a href="mailto:Support@goringo.com">Support@goringo.com</a> immediately and do not continue with this Provider.
        </p>
        <p className="mb-2 mb-lg-3 col-12 font-weight-extra-bold">
            If you have answered the Risk Attestation correctly, click Yes to proceed, or cancel to go back and edit your answer.
        </p>
    </>
);

export const SUBMIT_RISK_CONFIRMATION_MSG_TWO = (
    <span className="ml-1 font-weight-extra-bold">
        I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake the
        responsibility to inform you of any changes therein, immediately.
    </span>
);

// Candidate Workflow grid
export const REQUEST_BATCH_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Request Batch Interviews' </span> for selected candidates?
    </span>
);

export const REQUEST_SUBMIT_SELECTED_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Submit' </span> selected candidates?
    </span>
);

export const REMOVE_CANDIDATE_SUBMISSION = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Remove' </span> this candidate submission?
    </span>
);

// Name Clear Form
export const NAME_CLEAR_CONFIRMATION_MSG = (
    <span>
        Please select <span className="font-weight-extra-bold"> 'Name Clearance' </span>
        option to proceed.
    </span>
);

export const NAME_NOT_CLEAR_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Name Not Clear' </span> the candidate
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};

// Risk Clearance Form
export const REJECT_RISK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Reject Risk' </span> of the candidate?
    </span>
);

// Client Presentation Form
export const REJECT_PRESENTATION_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reject Presentation' </span> of the candidate
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};

export const REJECT_BILLRATE_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reject' </span> bill rate
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};

export const NEGOTIATE_BILLRATE_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Negotiate' </span> bill rate
            <span className="font-weight-extra-bold"> {props || " "} </span>?
        </span>
    );
};

export const SUBMIT_PRESENTATION_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Submit' </span> the candidate
            <span className="font-weight-extra-bold"> {props || " "} </span>
            to the Hiring Manager?
        </span>
    );
};

export const SCHEDULE_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Schedule Interview' </span>?
    </span>
);

//Interview
export const USER_CALENDAR_SUCCESS_MSG = "User schedule added successfully!";

export const INTERVIEW_REQUESTED_SUCCESS_MSG = "Interview requested successfully!";

export const BOOK_INTERVIEW_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            You have selected below time slot :<br />
            <span className="font-weight-extra-bold"> {props || " "} </span>
            <br />
            Once you confirm, calendar invite will be mailed & added to your calendar.
        </span>
    );
};

export const INTERVIEW_SCHEDULED_SUCCESS_MSG = "Interview scheduled successfully!";

export const CANCEL_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Cancel Interview' </span> ?
    </span>
);

export const INTERVIEW_CANCELLED_SUCCESS_MSG = "Interview cancelled successfully!";

export const REMOVE_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Remove' </span> this round?
    </span>
);

export const RESEND_TO_VENDOR_INTERVIEW_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Resend To Vendor' </span> ?
    </span>
);

export const INTERVIEW_REMOVED_SUCCESS_MSG = "Interview round deleted!";

export const INTERVIEW_RESEND_TO_VENDOR_SUCCESS_MSG = "Interview resent to vendor successfully!";

export const CAPTURE_ROOUND_STATUS = (props) => {
    return (
        <span>
            {" "}
            Interview Round : <span className="font-weight-extra-bold mr-2">{props}</span>
        </span>
    );
};

export const NEXT_ROUND_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Proceed to Next Round' </span>?
    </span>
);

export const SUBMIT_TO_VENDOR_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Submit Offer' </span>?
    </span>
);

export const SUBMIT_TO_VENDOR_SUCCESS_MSG = "Offer submitted to vendor successfully!";

export const NEXT_ROUND_SUCCESS_MSG = "Proceed to next round successfully!";

export const MAKE_AN_OFFER_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to continue with
        <span className="font-weight-extra-bold"> 'Ready for Offer' </span>?
    </span>
);

export const ACCEPT_OFFER_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Accept' </span>the offer for the candidate?
    </span>
);

export const ACCEPT_OFFER_SUCCESS_MSG = "Offer accepted successfully!";

export const REJECT_OFFER_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Reject' </span>the offer for the candidate?
    </span>
);
export const REJECT_OFFER_SUCCESS_MSG = "Offer rejected successfully.";

export const MAKE_AN_OFFER_SUCCESS_MSG = "Offer submitted successfully!";

export const USER_SCHEDULE_CREATED_SUCCESS_MSG = "Schedule saved successfully!";
export const USER_SCHEDULE_UPDATED_SUCCESS_MSG = "Schedule updated successfully!";
export const USER_SCHEDULE_REMOVED_SUCCESS_MSG = "Schedule removed successfully!";

export const SUBMIT_ONBOARD_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Submit' </span> candidate onboarding task?
    </span>
);

export const SUBMIT_ONBOARD_SUCCESS_MSG = "Candidate onboarding task submitted successfully!";
export const FULLY_CRED_ONBOARD_SUCCESS_MSG = "Candidate fully credentialed successfully!";
export const TEMP_CRED_ONBOARD_SUCCESS_MSG = "Candidate temporary credentialed successfully!";

export const SEND_CREDENTIAL_SUCCESS_MSG = "Credentials sent for review successfully!";

export const FULLY_CREDENTIALS_ONBOARD_MSG = (props) => (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Fully Credential' </span>the candidate
        <span className="font-weight-extra-bold"> {props || " "} </span>?
    </span>
);

export const ASSIGN_CANDIDATE_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Assign' </span>?
    </span>
);

export const ASSIGNMENT_CREATED_SUCCESS_MSG = "Assignment created successfully!";

export const SEND_BACK_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Send Back' </span>the selected Tasks?
    </span>
);

export const TEMP_CRED_MSG = (props) => (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Temporary Credential' </span>for candidate
        <span className="font-weight-extra-bold"> {props || " "} </span>?
    </span>
);

export const AUTHORIZE_INVOICE_MESSAGE = (InvoiceNo, payPeriod) => (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> ' Authorize' </span>the
        <span className="font-weight-extra-bold"> Invoice#:{InvoiceNo || " "} </span>for Billing Period?
        <p>
            <FontAwesomeIcon icon={faDotCircle} className="mr-2" />
            {payPeriod.startDate && dateFormatter(new Date(payPeriod.startDate))}
        </p>
    </span>
);

export const TIMESHEET_WEEK_SUBMIT_CONFIRMATION_MSG = (startDate, endDate) => {
    return (
        <span>
            Are you sure you want to submit the
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Timesheet' </span> for selected period?
            <span className="font-weight-extra-bold"> {startDate && dateFormatter(new Date(startDate)) + " - " + dateFormatter(new Date(endDate))} </span>
        </span>
    );
};

export const TIMESHEET_WEEK_RESUBMIT_CONFIRMATION_MSG = (startDate, endDate) => {
    return (
        <span>
            Are you sure you want to resubmit the
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Timesheet' </span> for selected period?
            <span className="font-weight-extra-bold"> {startDate && dateFormatter(new Date(startDate)) + " - " + dateFormatter(new Date(endDate))} </span>
        </span>
    );
};

export const TIMESHEET_BULK_SUBMIT_CONFIRMATION_MSG = (payPeriods) => {
    return (
        <span>
            Are you sure you want to submit the
            <span className="font-weight-extra-bold pl-1 pr1-"> 'Timesheets' </span> for selected period?
            {payPeriods.map((payPeriod) => (
                <span className="font-weight-extra-bold display-block">
                    {" "}
                    {payPeriod.startDate && dateFormatter(new Date(payPeriod.startDate)) + " - " + dateFormatter(new Date(payPeriod.endDate))}{" "}
                </span>
            ))}
        </span>
    );
};

export const SEND_BACK_SUCCESS_MSG = "Task(s) sent back to vendor successfully!";
export const TASK_DOCUMENT_DELETED_SUCCESS_MSG = "Document(s) deleted successfully!";
export const TASK_DOCUMENT_UPLOADED_SUCCESS_MSG = "Document(s) uploaded successfully!";
export const COMPLETE_ALL_MAND_TASK_VALIDATION_MSG = "*Please complete all mandatory tasks ";
export const REPLACE_OLD_DOC_MSG = "This will replace the old document";
export const APPROVED_TASK_MSG = "Task approved successfully!";
export const SUBMIT_TASK_MSG = "Task submitted successfully!";
export const UNDER_REVIEW_TASK_MSG = "Task is under review!";

export const APPROVED_TASK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Approve' </span>this task?
    </span>
);

export const SUBMIT_TASK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Submit' </span>this task?
    </span>
);

export const UNDER_REVIEW_TASK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Under Review' </span>this task?
    </span>
);

export const REMOVE_TASK_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Remove' </span>this task?
    </span>
);

export const REMOVE_DOCUMENT_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Remove' </span>this document?
    </span>
);

export const PLEASE_UPLOAD_FILE = "Please upload a file.";
export const PLEASE_UPLOAD_VALID_FILE = "Please upload a valid file.";
export const PLEASE_UPLOAD_FILE_OF_SIZE = "Please upload a file of size less than ";
export const FILE_ALREADY_UPLOADED = "File is already uploaded";
export const NOT_DOWNLOADABLE = "You cannot download this file";
export const SELECT_ATLEAST_ONE_TASK = "Please select atleast one task";
export const SELECT_SUBMITTED_TASK = "Please select only 'Under Review/Submitted/Pending Submission' tasks";
export const SELECT_ONLY_SUBMITTED_TASK = "Please select only 'Submitted' tasks";
export const SELECT_ATLEAST_ONE_SUBMITTED = "Please select at least one task.";
export const SELECT_ONE_TASK_TO_SEND = "Please select atleast one task to send";
export const NO_DOC_FOR_CREDENTIALING = "There is no document attached for credentialing";

export const DRAFT = "Draft";
export const SAVE_ANOTHER = "Save & Add Another";
export const SAVE_CLOSE = "Save & Close";
export const BILLRATE_SUBMIT = "Submit";
export const TITLE_TEXT = "Interview Slot";

//  Client Invoice
export const CLIENT_INVOICE_AUTHORIZE_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Authorize' </span>the Client Invoice#
            <span className="font-weight-extra-bold"> {data && data.clientInvoiceNumber} </span>?
            {/* <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && dateFormatter(data.cbiRunDate)} </span>
            </div> */}
        </span>
    );
}

export const CLIENT_INVOICE_AUTHORIZE_SUCCESS_MSG = "Client invoice authorized successfully!";

export const CLIENT_RUN_CBI_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            CBI will be generated! Do you wish to continue?
        </span>
    );
}

//Vendor Invoicing 
export const VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Authorize' </span>the invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
}

export const VENDOR_INVOICE_MOVETS_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Move Timesheet' </span>#
            <span className="font-weight-extra-bold"> {data && data.payPeriod} </span>to another Vendor Invoice?
        </span>
    );
}

export const CLIENT_INVOICE_MAKEPAYMENT_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Receive Payment' </span>for the Client invoice?
            {/* <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && dateFormatter(data.cbiRunDate)} </span>
            </div> */}
        </span>
    );
}

export const VENDOR_INVOICE_DUPLICATE_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            This expense seems to be a
            <span className="font-weight-extra-bold"> 'Duplicate' </span> record!
            <p>Are you sure you want to add this expense?</p>

            <div className="mt-3">
                <span className="font-weight-extra-bold"> Associate Name: </span> {data && data.associateName}<br />
                <span className="font-weight-extra-bold"> Pay Period: </span> {data && data.payPeriod}<br />
                <span className="font-weight-extra-bold"> Service Type: </span> {data && data.serviceType}<br />
                <span className="font-weight-extra-bold"> Date: </span> {data && dateFormatter(data.date)}<br />
                <span className="font-weight-extra-bold"> Amount: </span> {currencyFormatter(data && data.amount)}

            </div>
        </span>
    );
}

export const VENDOR_INVOICE_UNDER_AUDIT_REVIEW_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to mark the Invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>
            <span className="font-weight-extra-bold"> 'Under Audit Review' </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
};

export const VENDOR_INVOICE_REJECT_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reject' </span>the invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative">  {data && data.billingPeriod}   </span>
            </div>
        </span>
    );
};

export const VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG = "Vendor invoice authorized successfully!";
export const VENDOR_INVOICE_UNDER_AUDIT_REVIEW_SUCCESS_MSG = "Vendor invoice marked for audit review!";
export const VENDOR_INVOICE_REJECTION_MSG = "Vendor invoice rejected successfully!";

export const RESET_TIMESHEET_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reset Timesheet' </span>for Pay Period?

            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && `${dateFormatter2(data.startDate)} - ${dateFormatter2(data.endDate)}`}  </span>
            </div>
            {/* <span className="font-weight-extra-bold display-block"> {data && `${dateFormatter2(data.startDate)} - ${dateFormatter2(data.endDate)}`} </span> */}
        </span>
    );
};

export const RESET_TIMESEET_SUCCESS = "Timesheet reset successfully!";
export const MOVE_TIMESEET_SUCCESS = "Timesheet moved successfully!";

export const BILL_RATE_EXPENSE_PENDING = "Bill Rates & Expenses are pending approval or negotiation.";

export const CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Receive Payment' </span>for Client Invoice#
            <span className="font-weight-extra-bold"> {data && data.clientInvoiceNumber} </span>?
            {/* <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && dateFormatter(data.cbiRunDate)} </span>
            </div> */}
        </span>
    );
}

export const RESET_CBI_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reset CBI' </span>for Client Invoice#
            <span className="font-weight-extra-bold"> {data && data.clientInvoiceNumber} </span>?
            {/* <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && dateFormatter(data.cbiRunDate)} </span>
            </div> */}
        </span>
    );
}
export const VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Remit Payment' </span>for Vendor Invoice #
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span> for
            Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
}

export const VENDOR_INVOICE_MAKE_GLOBAL_REMITTANCE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Remit Payment' </span>for all Vendor Invoices?
        </span>
    );
}

export const CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG = "Payment Received successfully!";

export const CLIENT_CBI_RESET_SUCCESS_MSG = "CBI reset successfully!";

export const VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG = "Payment Remitted/Scheduled successfully!";

//candidate 
export const VENDOR_NOT_ASSOCIATED = "No vendor is associated to this user.";


// Delete Save searches modal


export const DELETE_SEARCH_CONFIRMATION_MSG = (searchName) => {
    return (
        <span>
            Are you sure you want to delete your
            <span className="font-weight-extra-bold"> "{searchName}" </span>
            Saved Search?

        </span>
    );
}

// Admin
export const LOB_ERROR_MSG = "Please enter atleast one LOB in the Line of Business section";
export const DELETE_LOB_ERROR_MSG = "Atleast one LOB is required in the Line of Business section";
export const CLIENT_LOB_WARNING_MSG = "Please save all LOB(s) in Line of Business section";
export const CLIENT_REGION_WARNING_MSG = "Please save all region(s) in Regions section";
export const CLIENT_ZONE_WARNING_MSG = "Please save all zone(s) in Zones section";
export const CLIENT_ASS_VENDOR_WARNING_MSG = "Please save all vendor(s) in Associated Vendors section";
export const CRITERIA_WARNING_MSG = "Please save all criteria in Criteria section";
export const CRITERIA_ERROR_MSG = "Please enter atleast one criteria in Criteria section";
export const TASK_ERROR_MSG = "Please enter atleast one task in the Tasks section";
export const APPROVER_WARNING_MSG = "Please save all approver(s) in Approvers section";
export const APPROVER_ERROR_MSG = "Please enter atleast one approver in the Approvers Section";


// edit req

export const UPDATE_REQ_SUCCESSFULL_MSG = "Requisition updated successfully!"

//Admin
export const CANDIDATE_REMOVE_SUCCESS_MSG = "Candidate deleted successfully!";
export const CANDIDATE_CREATE_SUCCESS_MSG = "Candidate created successfully!";
export const CANDIDATE_UPDATE_SUCCESS_MSG = "Candidate updated successfully!";
export const CLIENT_ACTIVE_SUCCESS_MSG = "Client activated successfully!";
export const CLIENT_INACTIVE_SUCCESS_MSG = "Client inactivated successfully!";
export const CLIENT_REMOVE_SUCCESS_MSG = "Client deleted successfully!";
export const CLIENT_DIV_ACTIVE_SUCCESS_MSG = "Division activated successfully!";
export const CLIENT_DIV_INACTIVE_SUCCESS_MSG = "Division inactivated successfully!";
export const CLIENT_DIV_REMOVE_SUCCESS_MSG = "Division deleted successfully!";
export const DIVISION_LOC_ACTIVE_SUCCESS_MSG = "Location activated successfully!";
export const DIVISION_LOC_INACTIVE_SUCCESS_MSG = "Location inactivated successfully!";
export const DIVISION_LOC_REMOVE_SUCCESS_MSG = "Location deleted successfully!";
export const DIVISION_LOC_CREATE_SUCCESS_MSG = "Location created successfully!";
export const DIVISION_LOC_UPDATE_SUCCESS_MSG = "Location updated successfully!";
export const VENDOR_ACTIVE_SUCCESS_MSG = "Vendor activated successfully!";
export const VENDOR_INACTIVE_SUCCESS_MSG = "Vendor inactivated successfully!";
export const VENDOR_REMOVE_SUCCESS_MSG = "Vendor deleted successfully!";
export const VENDOR_TIER_REMOVE_SUCCESS_MSG = "Vendor Tier deleted successfully!";
export const GLOBAL_JOB_CATALOG_REMOVE_SUCCESS_MSG = "Global Job Catalog deleted successfully!";
export const GLOBAL_JOB_CATALOG_CREATE_SUCCESS_MSG = "Global Job Catalog created successfully!";
export const GLOBAL_JOB_CATALOG_UPDATE_SUCCESS_MSG = "Global Job Catalog updated successfully!";
export const CLIENT_RATE_CARD_REMOVE_SUCCESS_MSG = "Client Rate Card deleted successfully!";
export const CLIENT_RATE_CARD_CREATE_SUCCESS_MSG = "Client Rate Card created successfully!";
export const CLIENT_RATE_CARD_UPDATE_SUCCESS_MSG = "Client Rate Card updated successfully!";
export const INTERVIEW_CRITERIA_ACTIVE_SUCCESS_MSG = "Interview Criteria activated successfully!";
export const INTERVIEW_CRITERIA_INACTIVE_SUCCESS_MSG = "Interview Criteria inactivated successfully!";
export const INTERVIEW_CRITERIA_REMOVE_SUCCESS_MSG = "Interview Criteria deleted successfully!";
export const INTERVIEW_CRITERIA_CREATE_SUCCESS_MSG = "Interview Criteria created successfully!";
export const INTERVIEW_CRITERIA_UPDATE_SUCCESS_MSG = "Interview Criteria updated successfully!";
export const CLIENT_JOB_CATALOG_REMOVE_SUCCESS_MSG = "Client Job Catalog deleted successfully!";
export const CLIENT_JOB_CATALOG_MAP_SUCCESS_MSG = "Client Job Catalog mapped successfully!";
export const CLIENT_JOB_CATALOG_UPDATE_SUCCESS_MSG = "Client Job Catalog updated successfully!";
export const ONBOARDING_CONFIGURATION_REMOVE_SUCCESS_MSG = "Onboarding Configuration deleted successfully!";
export const ONBOARDING_CONFIGURATION_CREATE_SUCCESS_MSG = "Onboarding Configuration created successfully!";
export const ONBOARDING_CONFIGURATION_UPDATE_SUCCESS_MSG = "Onboarding Configuration updated successfully!";
export const REQ_APPROVER_CONFIGURATION_REMOVE_SUCCESS_MSG = "Approver Configuration deleted successfully!";
export const REQ_APPROVER_CONFIGURATION_CREATE_SUCCESS_MSG = "Approver Configuration created successfully!";
export const REQ_APPROVER_CONFIGURATION_UPDATE_SUCCESS_MSG = "Approver Configuration updated successfully!";
export const TS_APPROVER_CONFIGURATION_REMOVE_SUCCESS_MSG = "Timesheet Approver Configuration deleted successfully!";
export const TS_APPROVER_CONFIGURATION_CREATE_SUCCESS_MSG = "Timesheet Approver Configuration created successfully!";
export const TS_APPROVER_CONFIGURATION_UPDATE_SUCCESS_MSG = "Timesheet Approver Configuration updated successfully!";
export const TASK_WARNING_MSG = "Please complete all Task(s) in Task section";
export const MAKE_OFFER_CONTRACT_VALIDATION_MSG = "Atleast one service type of 'Time' in 'Approved' status is required!";
export const NOTIFICATION_SETTINGS_UPDATE_SUCCESS_MSG = "Notification Settings saved successfully!";
export const GLOBAL_SETTINGS_UPDATE_SUCCESS_MSG = "Global Settings saved successfully!";
export const CLIENT_ASSINMENT_TYPES_MAP_SUCCESS_MSG = "Client Assignment Types mapped successfully!";
export const CLIENT_REQUISITION_REASONS_MAP_SUCCESS_MSG = "Client Requisition Reasons mapped successfully!";
export const CLIENT_REQ_REASON_UNMAP_SUCCESS_MSG = "Client Requisition Reason unmapped successfully!";
export const CLIENT_ASSIGN_TYPE_REMOVE_SUCCESS_MSG = "Client Assignment Type unmapped successfully!";
export const RELEASE_CONFIG_REMOVE_SUCCESS_MSG = "Release Configuration deleted successfully!";
export const CLIENT_ZONE_REMOVE_SUCCESS_MSG = "Zone deleted successfully!";
export const CLIENT_ZONE_ACTIVE_SUCCESS_MSG = "Zone activated successfully!";
export const CLIENT_ZONE_INACTIVE_SUCCESS_MSG = "Zone inactivated successfully!";
export const CLIENT_REGION_REMOVE_SUCCESS_MSG = "Region deleted successfully!";
export const CLIENT_REGION_ACTIVE_SUCCESS_MSG = "Region activated successfully!";
export const CLIENT_REGION_INACTIVE_SUCCESS_MSG = "Region inactivated successfully!";
export const CLIENT_LOB_REMOVE_SUCCESS_MSG = "LOB deleted successfully!";
export const CLIENT_LOB_ACTIVE_SUCCESS_MSG = "LOB activated successfully!";
export const CLIENT_LOB_INACTIVE_SUCCESS_MSG = "LOB inactivated successfully!";
export const CLIENT_ASSOCIATED_VENDOR_REMOVE_SUCCESS_MSG = "Associated Vendor deleted successfully!";
export const CLIENT_ASSOCIATED_VENDOR_ACTIVE_SUCCESS_MSG = "Associated Vendor activated successfully!";
export const CLIENT_ASSOCIATED_VENDOR_INACTIVE_SUCCESS_MSG = "Associated Vendor inactivated successfully!";
export const CANDIDATE_EMAIL_VALIDATION = "No valid email/phone number found for the candidate. Please go to Manage Candidates and update candidate information to proceed.";
export const USER_AUTO_REGISTER_SUCCESS_MSG = "User registered successfully!";
export const SERVICE_TYPE_REMOVE_SUCCESS_MSG = "Service Type deleted successfully!";
export const SERVICE_TYPE_ACTIVE_SUCCESS_MSG = "Service Type activated successfully!";
export const SERVICE_TYPE_INACTIVE_SUCCESS_MSG = "Service Type Deactivated successfully!";
export const TS_UPDATED_SUCCESS_MSG = "Selected Timesheet(s) updated successfully!";
export const GLOBAL_NOTIFICATION_REMOVE_SUCCESS_MSG = "Notification deleted successfully!";
export const GLOBAL_NOTIFICATION_ACTIVE_SUCCESS_MSG = "Notification activated successfully!";
export const GLOBAL_NOTIFICATION_INACTIVE_SUCCESS_MSG = "Notification inactivated successfully!";
export const GLOBAL_NOTIFICATION_CREATE_SUCCESS_MSG = "Notification created successfully!";
export const GLOBAL_NOTIFICATION_UPDATE_SUCCESS_MSG = "Notification updated successfully!";
export const REASON_ACTION_SUCCESS_MSG = "Reason created successfully";
export const REASON_ACTION_UPDATE_SUCCESS_MSG = "Reason Updated successfully";
export const COMM_CENTER_CREATE_SUCCESS_MSG ="Message created successfully";
export const COMM_CENTER_UPDATE_SUCCESS_MSG ="Message updated successfully";
export const MSG_DELETE_SUCCESS_MSG ="Message deleted successfully!";
export const MESSAGE_ACTIVE_SUCCESS_MSG = "Message activated successfully!";
export const MESSAGE_DEATCIVATE_SUCCESS_MSG= "Message deativated successfully!";
export const MESSAGE_PUBLISH_SUCCESS_MSG = "Message publish successfully!";
export const MESSAGE_ARCHIVED_SUCCESS_MSG = "Message archived successfully!";
export const CONTENT_LIB_REMOVE_SUCCESS_MSG = "Content deleted successfully!";
export const CONTENT_LIB_PUBLISH_SUCCESS_MSG = "Content published successfully!";
export const CONTENT_LIB_ARCHIVE_SUCCESS_MSG = "Content archived successfully!";
export const CONTENT_LIB_CREATED_SUCCESS_MSG = "Content created successfully";
export const CONTENT_LIB_UPDATED_SUCCESS_MSG = "Content updated successfully";
export const DOC_ERROR_MSG = "Please upload atleast one document";
export const DOC_LENGTH_ERROR_MSG = "More than one document is not allowed";


export const REMOVE_CANDIDATE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this candidate?
        </span>
    );
}

export const INACTIVE_CLIENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this client?
        </span>
    );
}

export const ACTIVE_CLIENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this client?
        </span>
    );
}

export const REMOVE_CLIENT_LOB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this LOB?
        </span>
    );
}

export const INACTIVE_CLIENT_LOB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this LOB?
        </span>
    );
}

export const ACTIVE_CLIENT_LOB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this LOB?
        </span>
    );
}

export const REMOVE_CLIENT_ZONE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this zone?
        </span>
    );
}

export const INACTIVE_CLIENT_ZONE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this zone?
        </span>
    );
}

export const ACTIVE_CLIENT_ZONE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this zone?
        </span>
    );
}

export const REMOVE_CLIENT_REGION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this region?
        </span>
    );
}

export const INACTIVE_CLIENT_REGION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this region?
        </span>
    );
}

export const ACTIVE_CLIENT_REGION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this region?
        </span>
    );
}

export const REMOVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this Associated Vendor?
        </span>
    );
}

export const INACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this Associated Vendor?
        </span>
    );
}

export const ACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this Associated Vendor?
        </span>
    );
}

export const REMOVE_CLIENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this client?
        </span>
    );
}

export const INACTIVE_CLIENT_DIVISION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this division?
        </span>
    );
}

export const ACTIVE__CLIENT_DIVISION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this division?
        </span>
    );
}

export const REMOVE_CLIENT_DIVISION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this division?
        </span>
    );
}

export const INACTIVE_DIVISION_LOC_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this location?
        </span>
    );
}

export const ACTIVE__DIVISION_LOC_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate " </span>
            this location?
        </span>
    );
}

export const REMOVE_DIVISION_LOC_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this location?
        </span>
    );
}

export const INACTIVE_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this vendor?
        </span>
    );
}

export const ACTIVE_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate " </span>
            this vendor?
        </span>
    );
}

export const REMOVE_VENDOR_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this vendor?
        </span>
    );
}

export const REMOVE_VENDOR_TIER_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this vendor tier?
        </span>
    );
}

export const UPDATE_REQ_RELEASE_TIER_CONFIRMATION_MSG = () => {
    return (
        <span>
            This vendor exists in one or more unreleased requisitions. Are you sure you want to 
            <span className="font-weight-extra-bold"> "Update" </span>
            this vendor tier in those requisitions as well?
        </span>
    );
}

export const REMOVE_GLOBAL_JOB_CATALOG_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this global job catalog?
        </span>
    );
}

export const REMOVE_CLIENT_RATE_CARD_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this client rate card?
        </span>
    );
}

export const INACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Inactivate" </span>
            this interview criteria?
        </span>
    );
}

export const ACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate " </span>
            this interview criteria?
        </span>
    );
}

export const REMOVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this interview criteria?
        </span>
    );
}

export const REMOVE_CRITERIA_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this Criteria?
        </span>
    );
}

export const CREATE_CRITERIA_CONFIRMATION = "Please create atleast one criteria.";

export const REMOVE_ROUND_RESULT_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> "Remove" </span>
        this Round Result?
    </span>
)
// On Boarding Configuration

export const REMOVE_ONBOARDING_CONFIGURATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this onboarding configuration?
        </span>
    );
}

export const REMOVE_TASKS_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this Task?
        </span>
    );
}

export const SAVE_UNSAVED_INTERVIEW_RESULT = (
    <span>
        Are you sure you want to save all the
        <span className="font-weight-extra-bold"> 'Unsaved Changes' </span>?
    </span>
);

// Req Approver Configuration

export const REMOVE_REQ_APPROVER_CONFIGURATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this approver configuration?
        </span>
    );
}

// Timesheet Approver Configuration

export const REMOVE_TIMESHEET_APPROVER_CONFIGURATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this timesheet approver configuration?
        </span>
    );
}

// Client Settings
export const SAVE_CLIENT_SETTING_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Save" </span>
            new changes to the setting?
        </span>
    );
}


export const REMOVE_CLIENT_JOB_CATALOG_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this client job catalog?
        </span>
    );
}

export const UNMAP_REQ_REASON_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Unmap" </span>
            this client requisition reason?
        </span>
    );
}

export const UNMAP_ASSIGN_TYPE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Unmap" </span>
            this client assignment type?
        </span>
    );
}

export const REMOVE_RELEASE_CONFIG_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this release configuration?
        </span>
    );
}

export const REMOVE_TS_DOCUMENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this document permanently?
        </span>
    );
}

export const BATCH_RELEASE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Release" </span>
            all selected requisitions?
        </span>
    );
}

export const FILE_DOWNLOAD_WAIT = "Your file will be downloaded shortly.";
export const TWO_COLUMNS_GROUPED = "Only two columns can be grouped at once!";

export const REMOVE_EXPENSE_CONFIRMATION_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> "Delete" </span>
        Expense row?
    </span>
);

export const SELECT_REQUIRED_FIELDS_ROUND_RESULT = "Please enter/select the required fields for round results.";

// Assignment
export const ASSIGN_START_DATE_LESS_THAN_REQ_END_DATE = "Start date should be less than or equal to requisition end date.";
export const ASSIGN_REQ_DATE_GREATER_THAN_START_DATE = "Start date should be greater than or equal to requisition start date.";

export const ASSIGN_END_DATE_LESS_THAN_REQ_END_DATE = "End date should be less than or equal to requisition end date.";
export const ASSIGN_REQ_DATE_GREATER_THAN_END_DATE = "End date should be greater than or equal to requisition start date.";

export const ASSIGN_START_DATE_LESS_THAN_END_DATE = "Start date should be less than end date.";
export const ASSIGN_END_DATE_GREATER_THAN_START_DATE = "End date should be greater than start date.";

export const UPDATE_ASSIGN_CANDIDATE_MSG = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Update Assignment' </span>?
    </span>
);

export const ASSIGNMENT_UPDATED_SUCCESS_MSG = "Assignment updated successfully!";

export const VENDOR_INVOICE_RESET_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'RESET' </span>the invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
}

export const VENDOR_INVOICE_RESET_SUCCESS_MSG = "Vendor invoice reset successfully!";

export const EXP_CRED_SEND_REMINDER_VENDOR = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Send Reminder' </span> for this provider?
    </span>
);

export const EXP_CRED_SEND_REMINDER_SELECTED_VENDOR = (
    <span>
        Are you sure you want to
        <span className="font-weight-extra-bold"> 'Send Reminder' </span> to the selected provider?
    </span>
);

export const REMINDER_SENT_SUCCESSFULLY = "Reminder sent successfully!";

export const SINGE_GHRS_ERR_MSG = "Guaranteed hours can be added to only one service type per contract. Please update guaranteed hours to zero for other service type in contract.";

export const VENDOR_INVOICE_UNDER_VENDOR_REVIEW_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to mark the Invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>
            <span className="font-weight-extra-bold"> 'Under Vendor Review' </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
};

export const VENDOR_INVOICE_UNDER_VENDOR_REVIEW_SUCCESS_MSG = "Vendor invoice marked under review successfully!";

export const VENDOR_INVOICE_CLOSE_VI_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to mark the Invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>
            <span className="font-weight-extra-bold"> 'Close' </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
};

export const VENDOR_INVOICE_CLOSE_VI_SUCCESS_MSG = "Vendor invoice closed successfully!";

export const VENDOR_INVOICE_RE_AUTHORIZE_CONFIRMATION_MSG = (data) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reauthorize' </span>the invoice#
            <span className="font-weight-extra-bold"> {data && data.vendorInvoiceNumber} </span>for Billing Period?
            <div className="mt-3">
                <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {data && data.billingPeriod} </span>
            </div>
        </span>
    );
}

export const VENDOR_INVOICE_RE_AUTHORIZE_SUCCESS_MSG = "Vendor invoice reauthorized successfully!";


// new are below here
export const OFF_HOLD_ORDER_CONFIRM_MSG_MULTIPLE =
    "Are you sure you want to off hold the selected requisitions?";

export const OFF_HOLD_ORDER_ACTION = "Off Hold";

export const OFF_HOLD_ORDER_SUCCESS_MSG =
    "This requisition has been put off hold successfully.";

export const OFF_HOLD_ORDER_SUCCESS_MSG_M =
    "This selected requisition(s) have been put off hold successfully.";

export const RELEASE_SAVE_SUCCESS_MSG = "Release configuration successfully";
export const APPROVERS_WARNING_MSG =
    "Please save all the levels in Requisitions Approvers";

// candidate submission messages
export const CAND_SHARE_REJECTED_SUCCESS_MSG = "Candidate share request rejected successfully.";

export const CAND_SHARE_RESET_SUCCESS_MSG = "Candidate share request reset successfully.";

export const CAND_SHARE_APPROVE_CONFIRMATION_MSG =
    "Are you sure you want to approve candidate share request?";
export const CAND_SHARE_APPROVE_SUCCESS_MSG = "Candidate share request approved successfully.";
export const NO_VENDOR_CONFIGURED = "No vendor is configured for this Client, Division and Location. Please add configuration in Admin.";

export const REJECT_CAND_SHARE_CONFIRMATION_MSG = (props) => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-bold"> 'Reject' </span> candidate share request
            <span className="font-weight-bold"> {props || " "} </span>?
        </span>
    );
};
export const CAND_SHARE_RESET_CONFIRMATION_MSG = "Are you sure you want to reset candidate share request?";
export const ADD_EXPENSE_SUCCESS_MSG = "Expense added successfully.";
export const UPDATE_EXPENSE_SUCCESS_MSG = "Expense updated successfully.";
export const DELETED_EXPENSE_SUCCESS_MSG = "Expense removed successfully.";

export const CANCEL_MSG = "Are you sure you want to cancel?";

export const PROFILE_ALREADY_EXISTS =
    "Following profiles already exist for the selected division, location and position. Are you sure you want to remove existing profiles and save the current one?";

export const CONTRACT_SUBMITTED_TIMESHEET_MSG = (payPeriods) => {
    return (
        <span>
            Timesheet for the pay period 
            {payPeriods.map((x) => (
                <div className="mt-2 mb-2">
                    <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {x.payPeriod} </span>
                </div>
            ))}
            has already been submitted. Please enter start date/end date accordingly.
        </span>
    );
};

export const CONTRACT_SUBMITTED_TIMESHEET_WITH_NOTE_MSG = (payPeriods) => {
    return (        
        <span>
            Timesheet exists for pay period 
            {payPeriods.map((x) => (
                        <div className="mt-2 mb-2">
                            <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {x.payPeriod} </span>
                        </div>
            ))}
            Please add a contract for the duration:
            {payPeriods[0].duration.map((x) => (
                        <div className="mt-2 mb-2">
                            <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {x} </span>
                        </div>
                ))
            }
            <span className="font-weight-bold"> Note: </span> Provider will not able to submit timesheet without a contract for this duration.
        </span>
    );
};

export const MULTIPLE_CONTRACT_SAME_SERVICE_MSG = (contracts) => {
    return (
        <span>
            More than one contract available for the following Service Types. Please update end date manually for them:
            {contracts.map((x) => (
                <div className="mt-2 mb-2">
                    <span className="font-weight-extra-bold display-block Ul_Li_dot position-relative"> {x} </span>
                </div>
            ))}
        </span>
    );
};

export const USER_AUTO_REGISTER_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Auto Register" </span>
            this user?
        </span>
    );
}

export const CREATE_ROLE_CONFIRMATION_MSG = (role) => {
    return (
        <span>
            Are you sure you want to create
            <span className="font-weight-extra-bold">"{role || "-"}"</span>
            role?
        </span>
    );
}

export const UPDATE_ROLE_CONFIRMATION_MSG = (role) => {
    return (
        <span>
            Are you sure you want to update
            <span className="font-weight-extra-bold"> "{role || "-"}" </span>
            role?
        </span>
    );
}

export const DELETE_ROLE_CONFIRMATION_MSG = (role) => {
    return (
        <span>
            Are you sure you want to delete
            <span className="font-weight-extra-bold"> "{role || "-"}" </span>
            role?
        </span>
    );
}

export const COPY_ROLE_CONFIRMATION_MSG = (role) => {
    return (
        <span>
            Are you sure you want to copy role
            <span className="font-weight-extra-bold"> "{role || "-"}" </span>?
        </span>
    );
}

export const CLOSE_REQ_WITH_NOTE_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Close" </span>
            this requisition?
            <br/><span className="font-weight-bold"> Note: </span> Associated jobs will also be marked as completed.
        </span>
    );
};

export const REMOVE_SERVICE_TYPE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Delete" </span>
            this service type?
        </span>
    );
}

export const INACTIVE_SERVICE_TYPE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Deactivate" </span>
            this service type?
        </span>
    );
}

export const ACTIVE_SERVICE_TYPE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this service type?
        </span>
    );
}

export const TS_PENDING_APPROVAL_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to send the selected timesheets for approval?
        </span>
    );
}

export const TS_REJECTED_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to reject the selected timesheets?
        </span>
    );
}

export const REMOVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Delete" </span>
            this notification?
        </span>
    );
}

export const INACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Deactivate" </span>
            this notification?
        </span>
    );
}

export const ACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate" </span>
            this notification?
        </span>
    );
}

export const TS_UNDERREVIEW_CONFIRMATION_MSG = (tsLockdownDays) => {
    return (
        <span className= "text-left d-block px-4">
            The timesheet pay period start date is past the allowable <strong className="font-weight-extra-bold">{tsLockdownDays} </strong>
            days for submission and will be placed <strong className="font-weight-extra-bold">“Under Review” </strong>
            and subject to approval/rejection from the client. <br /> Please provide a reason description
        </span>
    );
}

export const CREATE_PROJECTION_GENERATE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to  
            <span className="font-weight-extra-bold"> "Generate Forecast" </span>
            ?
        </span>
    );
}

export const OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG = (serviceType) => {
    return (
        <span>
            Are you sure you want to overwrite existing
            <span className="font-weight-extra-bold"> "Assignment Forecast" </span>
            for service type <strong className="font-weight-extra-bold">{serviceType} </strong>?
        </span>
    );
}

export const REMOVE_PROJECTION_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this projection?
        </span>
    );
}

export const GENERATE_PROJECTION_SUCCESS_MSG = "Assignment forecast generated successfully.";
export const CREATE_PROJECTION_SUCCESS_MSG = "Assignment forecast created successfully.";
export const UPDATE_PROJECTION_SUCCESS_MSG = "Assignment forecast updated successfully.";
export const PROJECTION_DELETE_SUCCESS_MSG = "Projection deleted successfully!";

export const TS_CONFIRMATION_INACTIVE_CONFIRMATION_MSG = () => {
    return (
        <span className= "text-left d-block px-4">
            There is no valid executed confirmation letter on file for the pay period. This timesheet will be placed <strong className="font-weight-extra-bold">“Under Review” </strong>
            and subject to approval/rejection from the client. <br /> Please provide a reason description.
        </span>
    );
}

export const TS_UNDERREVIEW_CONFIRMATION_INACTIVE_MSG = (tsLockdownDays) => {
    return (
        <span className= "text-left d-block px-4">
            There is no valid executed confirmation letter on file for the pay period and pay period start date is past the allowable <strong className="font-weight-extra-bold">{tsLockdownDays} </strong>
            days for submission.This timesheet will be placed <strong className="font-weight-extra-bold">“Under Review” </strong>
            and subject to approval/rejection from the client. <br /> Please provide a reason description.
        </span>
    );
}

export const GENERATE_CONFIRMATION_LETTER_MSG = (
    <span>
        Are you sure you want to generate
        <span className="font-weight-extra-bold"> 'Confirmation of Assignment' </span>letter?
    </span>
);

export const LETTER_GENERATED_SUCCESSFULLY = "Letter has been generated successfully.";
export const LETTER_SIGNED_SUCCESSFULLY = "Letter has been signed successfully.";
export const DOCUMENT_INACTIVE_SUCCESS_MSG = "Document inactivated successfully!";
export const CONFIRMATION_LETTER_COMMENT_MSG = "Missing executed version of confirmation letter";

export const INACTIVE_DOCUMENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Deactivate" </span>
            this document?
        </span>
    );
}

export const GENERATING_CONFIRMATION_LETTER_MSG = 'Generating "Confirmation of Assignment" Letter...';

export const PREPARING_CONFIRMATION_LETTER_MSG = 'Preparing signed copy of "Confirmation of Assignment" Letter';

export const INFO_MSG_FOR_BILLRATES_DATE_UPDATE = () => {
    return (
        <>
            <span className="text-left d-block px-4">
            Changes to the bill rates, assignment dates or special terms require a newly executed confirmation letter.
            Please contact Client Admin to process the confirmation letter.
            </span>
            <br></br>
            <span className="text-left d-block px-4">
                <span className="font-weight-extra-bold">Note:</span> The system requires at least one executed confirmation letter to submit a timesheet. 
                If an executed confirmation is not available during timesheet submission, the timesheet will be placed in an Under Review queue. 
                The client admin will need to generate a new confirmation letter and require signature for execution. 
            </span>
        </>
    )
}

export const VI_UNDERREVIEW_CONFIRMATION_MSG = (expenseLockdownDays) => {
    return (
        <span className= "text-left d-block px-4">
            This vendor invoice contains expense dates past the allowable <strong className="font-weight-extra-bold">{expenseLockdownDays} </strong>
            days for submission and will be placed <strong className="font-weight-extra-bold">“Under Review” </strong>
            and subject to approval/rejection from the client. <br /> Please provide a reason description.
        </span>
    );
}

export const VENDOR_INVOICE_UNDER_REVIEW_SUCCESS_MSG = "Vendor Invoice marked Under Review successfully!";

export const VI_ACTIVE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to set the selected vendor invoice(s) to <strong className="font-weight-extra-bold">“Active” </strong> state?
        </span>
    );
}

export const TS_VENDOR_AUTHORIZE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to set the selected vendor invoice(s) to <strong className="font-weight-extra-bold">“Vendor Authorized” </strong> state?
        </span>
    );
}

export const VI_UPDATED_SUCCESS_MSG = "Selected Vendor Invoice(s) updated successfully!";

export const UPDATE_CONFIRMATION_LETTER_MSG = (
    <span>
        Are you sure you want to update
        <span className="font-weight-extra-bold"> 'Confirmation of Assignment' </span>letter?
    </span>
);

export const LETTER_UPDATED_SUCCESSFULLY = "Letter has been updated successfully.";

export const WARNING_MESSAGE_FOR_TARGET_DATES = "Please update the Target dates using Edit Presentation Info action.";

export const EXCEL_DOWNLOAD_INPROGRESS = "Excel will be downloaded in a few minutes.";

export const DELETE_MESSAGE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Delete" </span>
            this Message?
        </span>
    );
}

export const ACTIVE_MESSAGE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Activate " </span>
            this Message?
        </span>
    );
}

export const DEACTIVATE_MESSAGE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Deatcivate " </span>
            this Message?
        </span>
    );
}

export const CAND_END_OWNERSHIP_SUCCESS_MSG = "Candidate released successfully.";
export const CAND_END_OWNERSHIP_CONFIRMATION_MSG = "Are you sure you want to end ownership?";

export const DELETE_TICKET_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Delete" </span>
            this Ticket?
        </span>
    );
}

export const SERVICE_REQUEST_CREATED_SUCCESS_MSG = "Ticket created successfully!";
export const SERVICE_REQUEST_UPDATED_SUCCESS_MSG = "Ticket updated successfully!";
export const SERVICE_REQUEST_REMOVED_SUCCESS_MSG = "Ticket deleted successfully!";

export const PUBLISH_MESSAGE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Publish" </span>
            this Message?
        </span>
    );
}

export const ARCHIVE_MESSAGE_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Archive" </span>
            this Message?
        </span>
    );
}

export const SERVICE_REQUEST_WARNING_MSG_FOR_OWNER = "Owner cannot be changed";

export const DELETE_CONTENT_LIB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Delete" </span>
            this Content?
        </span>
    );
}

export const PUBLISH_CONTENT_LIB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Publish" </span>
            this content?
        </span>
    );
}
export const ARCHIVE_CONTENT_LIB_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Archive" </span>
            this content?
        </span>
    );
}

export const VENDOR_INVOICE_PAYMENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to mark scheduled payment as
            <span className="font-weight-extra-bold"> "Remitted" </span>
            ?
        </span>
    );
}

export const DELETE_SCHEDULE_PAYMENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Cancel" </span>
            scheduled payment?
        </span>
    );
}

export const RESCHEDULE_PAYMENT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Reschedule" </span>
            payment?
        </span>
    );
}

export const PAYMENT_RESCHEDULED_SUCCESSFULLY = "Payment rescheduled successfully!";
export const SCHEDULED_PAYMENT_CANCELLED = "Scheduled payment cancelled successfully";
export const SCHEDULED_PAYMENT_REMITTED = "Scheduled Payment remitted successfully";

export const EXTEND_ASSIGNMENT_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Request for Extension' </span>?
        </span>
    );
};

export const APPROVE_ASSIGNMENT_EXTENSION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Approve' </span> Assignment Extension?
        </span>
    );
};

export const REJECT_ASSIGNMENT_EXTENSION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> 'Reject' </span> Assignment Extension?
        </span>
    );
};

export const REMOVE_CONTRACT_CONFIRMATION_MSG = () => {
    return (
        <span>
            Are you sure you want to
            <span className="font-weight-extra-bold"> "Remove" </span>
            this Bill Rate?
        </span>
    );
}


export const INLINE_BILL_ERROR_MSG = "Bill Rate already exists"
export const EXTENSION_CONTRACT_WARNING_MSG = "Please save all rates in Bill Rates and Expenses section";
export const INLINE_EXTENSION_CONTRACT_WARNING_MSG = "Please save the bill rate";
export const ASSIGNMENT_EXTENSION_REQUEST_SUCCESS_MSG = "Assignment extension request sent successfully!";
export const ASSIGNMENT_EXTENSION_UPDATED_SUCCESS_MSG = "Assignment extension updated successfully!";
export const APPROVE_EXTENSION_CONTRACT_VALIDATION_MSG = "All Bill Rates should be in 'Approved' or 'Rejected' status!";
export const DUPLICATE_CONTRACT_WARNING_MSG = "Please remove the duplicate rates from Bill Rates and Expenses section";
export const EXTENSION_TIME_CONTRACT_VALIDATION_MSG = "Atleast one service type of 'Time' is required!";