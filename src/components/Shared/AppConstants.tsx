import { faCheck, faClock, faHandPaper, faLevelUpAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { dateFormatter } from "../../HelperMethods";
import auth from "../Auth";


export const emailPattern = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
);

//  
export enum AuthRole {
    Staff_1 = "Provider",
    Staff_2 = "Provider",
    Staff_3 = "Provider",
    Staff_4 = "Provider",
    HR = "Human Resources",
    HiringManager = "Hiring Manager",
    Client_7 = "Client Admin",
    Client_8 = "Client Admin",
    Vendor_9 = "Vendor",
    Vendor_10 = "Vendor",
    Vendor_11 = "Vendor",
    MSP = "System Admin",
    PROVIDER_1 = "Provider",
    SUPER_CLIENT_ADMIN = "Client Admin II",
    NAPA_VENDOR = "NAPA Vendor"
}
export enum GlobalData{
CLIENTID="$clientId$",
DIVISIONID="$divisionId$",
LOCATIONID="$locationId$",
REGIONID="$regionId$",
POSITIONID="$positionId$",
ZONEID="$zoneId$",
CLIENTINVOICEID="$clientInvoiceId$",
REQUISITIONID="$requisitionId$",
CANDSUBMISSIONID="$candSubmissionId$",
CANDIDATEID="$candidateId$",
TIMESHEETID="$timesheetId$",
VENDORID="$vendorId$",
RATECARDPROFILEGROUPID="$rateCardProfileGroupId$",
USERID="$userId$",
CANDSHAREREQUESTID="$candShareRequestId$",
VENDORCLIENTTIERPROFILEGROUPID="$vendorClientTierProfileGroupId$",
RELCONFIGGROUPID="$relConfigGroupId$",
TASKPROFILEGROUPID="$taskProfileGroupId$",
WFAPPROVALGROUPID="$wfApprovalGroupId$",
CLIENTINTVWCRITGROUPID="$clientIntvwCritGroupId$",
VENDORINVOICEID="$vendorInvoiceId$",
NOTIFICATIONID="$notificationId$",
MESSAGEID="$messageId$",
ROLEPERMISSIONID="$rolePermissionsId$",
ACTIONREASONID="$actionReasonId$",
STREAMID="$streamId$",
TICKETID="$ticketId$",
CANDSUBINTERVIEWID="$candSubInterviewId$",
EVENTID="$eventId$",
TSWEEKID="$tsWeekId$",
CONTENTID="$contentId$",
CANDSUBEXTID="$candSubExtId$"
}

export enum AuthRoleType {
    SystemAdmin = 1,
    Client = 2,
    Vendor = 3,
    Provider = 4,
    SuperAdmin = 5,
}

export enum EntityType {
    REQUISITION = "Requisition",
    CANDIDATE = "Candidate",
    CANDSUBMISSION = "CandSubmission",
    BILLRATE = "BillRate",
    VENDORINVOICE = "VendorInvoice",
    CLIENTINVOICE = "ClientInvoice",
    TIMESHEET = "Timesheet"
}

export enum TaskGroup {
    REQUISITION = "Requisition",
    CANDIDATE = "Candidate",
    VENDORINVOICE = "VI",
    CLIENTINVOICE = "CI",
    TIMESHEET = "Timesheet",
    ASSIGNMENTEXTENSION = "Assignment Extension"
}

export enum SettingCategory {
    CANDIDATE = "Candidate",
    TIMESHEET = "Timesheet",
    REQUISITION = "Requisition",
    REPORT = "Report",
}
export enum VendorTierType {
    PLATINUM = "Platinum",
    GOLD = "Gold",
    SILVER = "Silver",
    UTILITY = "Utility",
}

export enum serviceTypes {
    GAURANTEED_HOURS = "Guaranteed Hours",
    OVERTIME_HOURS = "Overtime"
}

export enum ServiceCategory {
    TIME = "Time",
    EXPENSE = "Expenses"
}

export enum ServiceCategoryIds {
    TIME = 1,
    EXPENSE = 2
}

export enum BillTypeFilters {
    ALLBILLTYPES = 1,
    ONETIME = 2
}

export enum BillTypeIntIds {
    HOURLY = 1,
    DAILY = 2,
    WEEKLY = 3,
    ONETIME = 4
}

export const AdditionalServiceTypes = [
    { id: "74de5601-cc69-493a-8e16-9fece8bef0ec", name: "Overtime" },
    { id: "be40a9bc-2e4d-4241-9efa-014ece0bd65b", name: "Guaranteed Hours" }
];
export enum EntityTypeId {
    REQUISITION = "a658de73-786e-4b04-8256-ef36d15c1e22",
    CANDIDATE = "d5e6e4f1-79ae-46f4-ae0d-d9ca4892074e",
    CANDSUBMISSION = "9d531ae5-5f7c-478f-b101-5911c4279f06",
    DOCUMENT = "26d88e98-a755-4f4e-8dd6-8621169a5c19",
    CLIENT = "a49972da-9289-4486-bfa1-5cdc1edc6480",
    TICKET = "a5b03cf7-43d0-47e8-9916-60a6aa9d286a"
}

export enum CandSubStatusIds {
    PENDINGSUBMISSION = 1,
    SUBMITTEDFORNAMECLEAR,
    NAMECLEARED,
    NAMENOTCLEARED,
    PENDINGFORNAMECLEAR,
    WITHDRAWN,
    PENDINGFORRISKATTESTATION,
    PENDINGFORRISKCLEARANCE,
    RISKCLEARED,
    RISKREJECTED,
    PENDINGFORVENDORPRESENTATION,
    VENDORPRESENTATIONSUBMITTED,
    VENDORPRESENTATIONREJECTED,
    PENDINGFORCLIENTPRESENTATION,
    CLIENTPRESENTATIONREJECTED,
    PENDINGSCHEDULEINTERVIEW,
    REJECTED,
    INTERVIEWCANCELLED = 25,
    PENDINGOFFER,
    INTERVIEWINPROGRESS,
    OFFERSUBMITTED,
    PENDINGONBOARDING,
    ONBOARDINGSUBMITTED,
    PENDINGCREDENTIALING,
    OFFERREJECTED,
    READYTOWORK,
    ASSIGNMENTCREATED = 36,
    ASSIGNMENTINPROGRESS = 50,
    ASSIGNMENTCOMPLETED = 51,
    ASSIGNMENTEXTENDED = 63,
}

// export enum CandSubStatusGuids {
//     SUBMITTEDFORNAMECLEAR = "56db08ea-aeae-48d7-bb6d-531e2b190c9f",
//     PENDINGFORCLIENTPRESENTATION = "3e589a13-1029-4c2c-a4e5-64aa4ca00340",
//     PENDINGSCHEDULEINTERVIEW = "054bb132-59d0-4208-9b7b-ba8c254d2558",
// }

export enum BillRateAndExpenseGuids {
    APPROVED = "550d2bdd-2bb0-430f-a72a-80997875beb2",
}

export enum CandSubmissionSubStatusIds {
    Default = 0,
    Temporary,
    FULLY,
    EXPIRED
}

export enum CandSubmissionSubStatus {
    PendingNameClearance = "Pending Name Clearance",
    PendingRiskAttestation = "Pending Risk Attestation"
}

export enum ReqStatus {
    DRAFT = "Draft",
    PENDINGAPPROVAL = "Pending Approval",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    ONHOLD = "On Hold",
    RELEASED = "Released",
    FILLED = "Filled",
    CANDIDATEUNDERREVIEW = "Open - Candidates Submitted",
    CLOSED = "Closed",
    CANCELLED = "Cancelled"
}

export enum TimesheetStatuses {
    PENDINGAPPROVAL = "Pending Approval",
    UNDERREVIEW = "Under Review",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    ACTIVE = "Active"
}

export enum ApprovalSettings {
    SEQUENTIALPARALLEL = "SequentialParallel",
    OVERRIDEPRIORLEVEL = "OverridePriorLevel"
}

export enum BillRateStatus {
    DRAFT = "Draft",
    PENDINGAPPROVAL = "Pending Approval",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    RELEASED = "Pending Negotiation"
}

export enum CandidateWorkflow {
    CANDIDATE = "WF_CAND",
    BILLRATE = "WF_BILL_RATE",
    VENDORINVOICE = "WF_VENDOR_INVOICE",
    CLIENTINVOICE = "WF_CLIENT_INVOICE",
    CANDSHARE = "WF_CAND_SHARE",
    ASSIGNMENTEXTENSION = "WF_ASSIGNMENT_EXTENSION"
}
export enum DistributionType {
    IMMEDIATE = "Immediate",
    AFTERDAYS = "After Days"
}
export enum CandidateWorkflowActions {
    SUBMIT = "Submit", // on submitPresentationForm
    WITHDRAW = "Withdraw", // on submitPresentationForm
    REJECT_CANDIDATE = "Reject Candidate",
    SUBMIT_TO_HIRING_MANAGER = "Submit To Hiring Manager",
    SUBMIT_TO_VENDOR = "Submit Offer",

    ASSIGN = "Assign",
    SEND_CREDENTIALS = "Send Credentials",
    SEND_BACK = "Send Back",
    PROCEED_TO_NEXT_ROUND = "Proceed To Next Round",
    READY_FOR_OFFER = "Ready for Offer",
    SCHEDULE_INTERVIEW_REQUEST = "Schedule Interview Request",
    MARK_REMITTANCE_SENT = "Mark Remittance Sent",
    MAKE_PAYMENT = "Make Payment",
    ACCEPT_OFFER = "Accept Offer",
}

export enum CandidateWorkflowActionBtns {
    TEMPORARYCREDENTIAL = "TemporaryCredential",
    FULLYCREDENTIAL = "FullyCredential",
    SUBMIT = "Submit",
    SENDCREDENTIAL = "SendCredentials",
    ASSIGN = "Assign",
}

export enum CandSubInterviewStatusIds {
    DRAFT = 1,
    PENDINGCONFIRMATION,
    SCHEDULED,
    CANCELLED,
    ACTIVE,
    COMPLETED,
    RESCHEDULED
}

export enum NotificationTypeIds {
    SENDPRESENTATION = 28,
    SENDCREDENTIAL = 39
}

export enum CandSubOnBoardTaskStatusIds {
    PENDINGSUBMISSION = 1,
    SUBMITTED,
    UNDERREVIEW,
    APPROVED,
    SENTBACK,
    EXPIRED = 8,
}

export enum RecordStatus {
    INACTIVE,
    ACTIVE,
    DELETE
}

export const SchedulerTime = {
    START_TIME: "8:00",
    END_TIME: "18:00",
};

export const allowedMymeTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "video/mp4"
];

export const allowedFileExtentions = [
    "jpeg",
    "jpg",
    "pdf",
    "xls",
    "xlsx",
    "doc",
    "docx",
];

export const allowedFileSize = 4000000;

// export const IsVendor = (roleName) => {
//     return [AuthRole.Vendor_9, AuthRole.MSP].indexOf(roleName) !=-1;
// };

export const isVendorRoleType = () => {
    var user = auth.getUser();
    if (user !=null) {
        return [AuthRoleType.Vendor, AuthRoleType.Provider].indexOf(user.roleType) !=-1;
    }
    return true;
}

export const isRoleType = (roleType) => {
    var user = auth.getUser();
    if (user != null) {
        return user.roleType==roleType;
    }
    return false;
}

export const isAssignmentInProgress = (statusIntId) => {
    return (
        [
            CandSubStatusIds.ASSIGNMENTCREATED,
            CandSubStatusIds.ASSIGNMENTINPROGRESS,
            CandSubStatusIds.ASSIGNMENTEXTENDED,
            CandSubStatusIds.ASSIGNMENTCOMPLETED,
        ].indexOf(statusIntId) !=-1
    );
};

// export const IsVendorRole = (roleName) => {
//   return (
//     [AuthRole.Vendor_9, AuthRole.Vendor_10, AuthRole.Vendor_11].indexOf(
//       roleName
//     ) !=-1
//   );
// };

export const initialDataState = (start?, total?) => {
    let initialDataState = {
        skip: start || 0,
        take: total || 10,
    };
    return initialDataState;
};

export enum VendorInvoiceStatusIds {
    ACTIVE = 37,
    VENDORAUTHORIZED,
    CLIENTAUTHORIZED,
    UNDERAUDITREVIEW,
    REJECTED,
    REMITTANCESENT = 46,
    UNDERVENDORREVIEW = 52,
    CLOSED,
    PAIDINFULLREMITTANCE,
    UNDERREVIEWQUEUE = 57
}

export enum ClientInvoiceStatusIds {
    ACTIVE = 43,
    CBIAUTHORIZED,
    PAYMENTRECEIVED,
    REMITTANCEINPROCESS = 55,
    REMITTANCECOMPLETE
}

export enum VendorInvoiceServiceTypeId {
    DEBIT = 6,
    CREDIT = 8,
    REGULAR = 1,
}

export enum TimesheetStatus {
    ACTIVE = 1,
    PENDINGAPPROVAL = 2,
    APPROVE = 3,
    REJECT = 4,
    NOTWORKING = 5,
    UNDERREVIEW = 6,
}

export enum WorkflowStateType {
    COMPLETED = 'Completed',
    DENIED = 'Denied',
    CANCELLED = 'Cancelled',
    DRAFT = 'Draft',
    INPROGRESS = 'InProgress',
    FULLYCOMPLETED = 'Fully Completed'
}

export enum CandidateStatus {
    ALLOCATED = "Allocated",
    AVAILABLE = "Available",
}

export enum TaskActions {
    EDIT = 'Edit',
    UNDERREVIEW = 'Under Review',
    APPROVE = 'Approve',
    REMOVE = 'Remove',
    SUBMIT = 'Submit',
    HISTORY = 'History',
}

export const icon = (stateType) => {
    var icon;
    switch (stateType) {
        case WorkflowStateType.COMPLETED:
            icon = faCheck;
            break;
        case WorkflowStateType.DENIED:
            icon = faTimes;
            break;
        case WorkflowStateType.CANCELLED:
            icon = faTimes;
            break;
        case WorkflowStateType.DRAFT:
            icon = faClock;
            break;
        case WorkflowStateType.INPROGRESS:
            icon = faHandPaper;
            break;
        case WorkflowStateType.FULLYCOMPLETED:
            icon = faCheck;
            break;
    }
    return icon;
};



export const colorCode = [
    { color: "#f47a1f", },
    {
        color: "#FDBB2F"
    },
    {
        color: "#377B2B"
    },
    {
        color: "#007CC3"
    },
    {
        color: "#7AC142"
    },
    {
        color: "#00529B"
    },
    {
        color: "#E6F69D"
    },
    {
        color: "#AADEA7"
    },
    {
        color: "#64C2A6"
    },
    {
        color: "#A5C1DC"
    },
    {
        color: "#E9F6FA"
    },
    {
        color: "#20c997"
    },
    { color: "#0d2673" }

];

export const CandidateStatusSequence = [["Submitted For Name Clear"], ["Pending Risk Attestation"],
["Pending Name Clearance"], ["Pending Name Clearance - Client"], ["Pending Vendor Presentation"], ["Vendor Presentation Submitted"], ["Pending Client Presentation"],
["Pending Schedule Interview"], ["Pending Timeslot"], ["Interview In-progress"], ["Pending Offer"], ["Offer Submitted"], ["Pending Onboarding"],
["Pending Credentialing"], ["Ready To Work"], ["Assignment Created"]
]

export const validMobile = (val) => {
    if (val !=null) {
        val = val.substring(0, 14);
        if (val.replace(/\D+/g, "").length > 0) {
            return (val.replace(/\D+/g, "").length ==10)
        } else {
            return true;
        }
    }
    else {
        return true
    }
}

export const CIAccountingReport = "CI Accounting Export";
export const CIDetailReport = "CI Detail Export";
export const CISummaryReport = "CI Summary Export";
export const TimesheetDetailReport = "Timesheet Detail Export";


export enum AuthApproverRole {
    HR = "Human Resources",
    HiringManager = "Hiring Manager",
    ClientAdmin = "Client Admin",
    ClientAdminII = "Client Admin II",
    Finance = "Finance"
}

export const isAuthApproverRoles = (role) => {
    return (
        [
            AuthApproverRole.HR,
            AuthApproverRole.HiringManager,
            AuthApproverRole.ClientAdmin,
            AuthApproverRole.ClientAdminII,
            AuthApproverRole.Finance,
        ].indexOf(role) !=-1
    );
};

export const SKIP_ONBOARDING_TASK_APPROVAL = "skip_onbord_task_approval";
export const ENABLE_PAY_RATE = "enable_pay_rate";

export const DISPLAY_DEPARTMENT = "display_department"

export const RINGO_NEXTGEN = "Ringo NextGen";
export const BASE_URL = "https://localhost:44338";

export enum ROWACTIONS{
    DELETE = "Delete",
    DEACTIVATE = "Deactivate"
}

export const roleType = [
    { name: "Super Admin", id: AuthRoleType.SuperAdmin },
    { name: "System Admin", id: AuthRoleType.SystemAdmin },
    { name: "Client", id: AuthRoleType.Client },
    { name: "Vendor", id: AuthRoleType.Vendor },
    { name: "Provider", id: AuthRoleType.Provider }
];

export const roleTypeName = (roleTypeId) => {
    return roleType.filter(x => x.id==roleTypeId)[0].name;
}

export enum RegistrationStatus {
    PENDING = 0,                            //* Not Invited Yet
    INVITED = 1,                            //* Invitation Sent
    AUTOREGISTER = 2,                       //* Auto Registered
    PENDINGTNC = 3,                         //* Having Last Login But Not Accepted TnC Yet
    COMPLETE = 4                            //* Having Last Login and Accepted TnC
}

export enum SETTINGS{
   EDIT_POSITION_DESCRIPTION = "edit_position_descripition",
   ASSIGNMENT_PROJECTION = "assignment_projection",
   PERCENT_OF_BASE_FORECAST = "percent_of_base_forecast",
   CONFIRMATION_OF_ASSIGNMENT = "confirmation_of_assignment"
}

export enum DocType {
    CONFIRMATIONLETTER = 'Confirmation Letter'
}

export enum DocStatus {
    ACTIVE = 'Active',
    EXECUTED = 'Executed',
    INACTIVE = 'Inactive',
    EXPIRED = 'Expired',
    PENDINGSIGNATURE = 'Pending Signature',
    CLIENTSIGNED = 'Client Signed'
}

export enum TimeSheetCheck {
    CONFIRMATION_NOT_VALID = "Confirmation Not Valid",
    CONFIRMATION_NOT_VALID_UNDER_REVIEW = "Under Review and Confirmation Not Valid"
}

export enum VIStatuses {
    ACTIVE = "Active",
    UNDERREVIEWQUEUE = "Under Review Queue",
    VENDORAUTHORIZED = "Vendor Authorized",
    UNDERAUDITREVIEW = "Under Audit Review",
    CLIENTAUTHORIZED = "Client Authorized",
}

export enum ExpenseStatuses {
    APPROVED = "Approved",
    UNDERREVIEW = "Under Review"
}

export enum ConfirmStatusIntId {
    Active = 1,
    Executed = 2,
    Inactive = 3,
    Expired = 4,
    PendingSignature = 5,
    ClientSigned = 6
}

export enum TicketStatus {
    NEW = "New",
    OPEN = "Open",
    RESOLVED = "Resolved",
    CLOSED = "Closed"
}

export enum TicketEventsType {
    TICKETCREATEDEVENT = "ticket_created",
    TICKETSTATUSEVENT = "ticket_status_updated",
    TICKETASSIGNTOEVENT = "ticket_assign_to_updated",
    TICKETQUEUEEVENT = "ticket_queue_updated"
}

export enum MessageStatus {
    DRAFT = "Draft",                            // saved and not published
    PUBLISHED = "Published",                        // save and publish
    ARCHIVED = "Archived"                          // Inactive and expired
}

export enum SearchData {
    REPORTASSOCIATEEXPENSE = "RptAssociateExpense-SearchData",
    REPORTFINANCIALACCRUAL = "RptFinancialAccrual-SearchData"
}

export enum ContentLibStatus {
    DRAFT = 1,                            
    PUBLISHED = 2,                        
    ARCHIVED = 3                          
}

export enum ContentStatus {
    DRAFT = "Draft",
    PUBLISHED = "Published",
    ARCHIVED = "Archived"
}

export enum PaymentStatus {
    PENDING = "Pending",
    SCHEDULED = "Scheduled",
    PAID = "Remitted to Vendor"
}

export enum TsUnderReviewReasons {
    UnderReview = 1,
    NoConfirmationLetter = 2,
    UnderReviewAndNoConfirmationLetter = 3
}

export enum DocFileType {
    IMAGE_PNG = "image/png",
    IMAGE_JPEG = "image/jpeg",
    IMAGE_JPG = "image/jpg",
    PDF = "application/pdf",
    WORD = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    WORD_DOC = "application/doc",
    WORD_DOCX = "application/docx",
    EXCEL = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    EXCEL_XLS = "application/xls",
    EXCEL_XLSX = "application/xlsx",
    VIDEO = "video/mp4",
    VIDEO_MKV = "video/mkv",
}

export enum ContentType {
    RELEASENOTES = "Release Notes",
    BLOG = "Blog",
    USERGUIDE = "User Guide",
    TRAININGVIDEOS = "Training Videos"
}

export enum ExtensionActionStatuses {
    REQUESTFOREXTENSION = "Request For Extension",
    SAVE = "Save",
    EXTENDOFFER = "Extend Offer",
    REJECT = "Reject"
}

export enum ExtensionStatuses {
    PENDINGAPPROVAL = "Pending Approval",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}

export enum WfStatus {
    ASSIGNMENTSTARTED = "Assignment Started",
    ASSIGNMENTEXTENDED = "Assignment Extended"
}