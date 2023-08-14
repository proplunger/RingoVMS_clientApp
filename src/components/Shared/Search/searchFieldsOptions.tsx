import { ReqStatus } from "../AppConstants";

export const searchFieldsReq = [
  "All",
  "Requisition#",
  "Client",
  "Division",
  "Location",
  "Reason",
  "Status",
  "Position",

  // "Created",
];
export const searchFieldsManageReq = [
  "All",
  "Requisition#",
  "Client",
  "Region",
  "State",
  "City",
  "Division",
  "Location",
  "Reason",
  "Status",
  "Position",

  // "Created",
];
export const AdvanceSearchFieldsReq = [
  "All",
  "Client",
  "Division",
  "Location",
  "Reason",
  "Status",
  // "Created",
];

export const Req_Status = [
  ReqStatus.DRAFT,
  ReqStatus.PENDINGAPPROVAL,
  ReqStatus.APPROVED,
  ReqStatus.REJECTED,
  ReqStatus.ONHOLD,
  ReqStatus.RELEASED,
  ReqStatus.CANDIDATEUNDERREVIEW,
  ReqStatus.FILLED,
  ReqStatus.CLOSED,
  ReqStatus.CANCELLED,
];

export const Candidate_Sub_Status = [
  "Released",
  "Partially Filled",
  "Filled",
  "Closed",
];
// export const Timesheet_Information=["Active","Approved","Not Working", "Pending Approval","Rejected" ]
export const candidateWF = [
  "All",
  "Requisition#",
  "Candidate Name",
  "Position",
  "State",
  "City",
  "Status",
  "Open Days",
];

export const tsAllProvider = [
  "All",
  "Requisition#",
  "Vendor",
  "Provider",
  "Location",
  "Division",
  "Position",
];

export const tsSingleProvider = ["All", "Status", "Hours"];

export const CandidateWF_Status = [
  "Client Presentation Rejected",
  "Interview Stage In-progress",
  "Name Not Cleared",
  "Onboarding Submitted",
  "Onboarding Sent Back",
  "Offer Submitted",
  "Offer Rejected",
  "Pending Submission",
  "Pending Name Clearance",
  "Pending Name Clearance - Client",
  "Pending Client Presentation",
  "Pending Credentialing",
  "Pending Interview",
  "Pending Onboarding",
  "Pending Risk Attestation",
  "Pending Risk Clearance",
  "Pending Schedule Interview",
  "Pending Vendor Presentation",
  "Submitted For Name Clear",
  "Risk Rejected",
  "Rejected",
  "Ready for Offer",
  "Ready To Work",
  "Ready To Work - Temp",
  "Vendor Presentation Submitted",
  "Vendor Presentation Rejected",
  "Withdrawn",
];

export const VendorInvoiceWF_Status = [
  "Active",
  "Under Vendor Review",
  "Vendor Authorized",
  "Under Audit Review",
  "Client Authorized",
  "Rejected",
  "Partial Remittance",
  "Paid In Full Remittance",
  "VI Closed"
];

export const ClientInvoiceWF_Status = [
  "Active",
  "CBI Authorized",
  "Payment Received",
  "Remittance In Process",
  "Remittance Complete",
];

export const Timesheet_Status = [
  "Active",
  "Pending Approval",
  "Not Working",
  "Approved",
  "Rejected",
];
export const VendorInvoice = [
  "All",
  "Vendor Name",
  "Status",
  "Hours",
  "Invoice#",
  "Client Invoice Number"
];

export const ClientStatementReport = [
  "All",
  "Vendor Name",
  "Status",
  "Hours",
  "Invoice#",
];


export const VendorInvoicingDetail = [
  "All",
  "Associate",
  "Division",
  "Location",
  "Position",
];

export const TSSubmitted = [
  "All",
  "Client",
  "Division",
  "Location",
  "Vendor",
  "Provider",
  "Position",
  "Hiring Manager",
];

export const TSReport = [
  "All",
  "Client",
  "Division",
  "Location",
  "Status",
  "Provider",
  "Position",
  "Hiring Manager",
  "Requisition#",
  "Vendor Name",
];

export const VendorInvoice_ServiceType = [
  { "id": 1,"field":"serviceCatIntId", "text": "Timesheet" },
  { "id": 6, "field":"serviceTypeIntId", "text": "Debit Adjustment" },
  { "id": 8, "field":"serviceTypeIntId", "text": "Credit Adjustment" },
  { "id": 2, "field":"serviceCatIntId", "text": "Expense" }
];

export const CandSubStatus = [
  "Assignment Created",
  "Assignment Started",
  "Assignment Extended",
  "Assignment Completed"
];

export const ManageCandidate = [
  "All",
  "First Name",
  "Last Name",
  "NPI#",
  "Email",
  "Position",
  "Status",
  "Tags",
];

export const CBI = ["All", "Client Invoice Number", "Status"];

export const ManageClient = ["All", "Client", "Status"];

export const ManageRegion = ["All", "Zone", "Region", "Status"];

export const Role =["All", "Role", "User Type"]

export const ManageDivision = ["All",  "Zone", "Region" , "Division", "Status"];

export const ManageLocation = ["All", "Division", "Location", "Status"];

export const ManageGlobalJobCatalog = ["All", "Job Category", "Position"];

export const ManageNotifications = ["All","Notification","Category"];

export const ManageClientRateCard = [
  "All",
  "Division",
  "Location",
  "Position",
  "Service Type",
  "Tags"
];

export const ManageInterviewCriteriaConfiguration = [
  "All",
  "Client",
  "Division",
  "Location",
  "Position",
];

export const ManageReleaseConfiguration = [
  "All",
  "Client",
  "Division",
  "Location",
  "Position",
  "Tags"
]

export const ManageVendor = ["All", "Vendor", "Status"];

export const ManageUser = [
  "All",
  "Username",
  "Last Name",
  "First Name",
  "Role",
  "Email",
  "Status",
  "Client"
];

export const ManageVendorTiers = [
  "All",
  "Division",
  "Location",
  "Vendor",
  "Tier",
  "Tags"
];

export const ManageClientJobCatalog = [
  "All",
  "Job Category",
  "Global Position",
  "Client Position",
];

export const Client_Status = ["Active", "Inactive"];


export const UserStatus = [
  { "id": "1", "text": "Active" },
  { "id": "3", "text": "Pending" },
  { "id": "0", "text": "Inactive" },
]


export const FilledAssignmentReport = [
  "All",
  "Vendor",
  "Division",
  "Location",
  "Position",
  "Provider",
];

export const VendorPerformanceReport = [
  "All",
  "Requisition#",
  "Position",
  "Location",
  "Division",
  "Tier",
];

export const VendorPerformance = [
  "All",
  "Requisition#",
  "Client",
  "Vendor"
];
export const candSubReport = [
  "All",
  "Requisition#",
  "Candidate Name",
  "Status",
  "Submitted By",
];

export const clientActivityReport = [
  "All",
  "Provider",
  "Position",
  "Location",
  "Division",
  "Status",
];

export const CandidateShareWF = [
  "All",
  "Candidate Name",
  "Vendor Name",
  "Status"
];

export const ManageServiceType = ["All", "Service Category", "Service Type" , "Status"];

export const SpendForecastReport = [
  "All",
  "Provider",
  "Region",
  "Division",
  "Location"
];

export const Forecast_Month = [
  1,
  2,
  3,
];

export const AssociateExpense = [
  "All",
  "Associate",
  "Division",
  "Location",
  "Position"
];

export const Expense_Status = [
    "Under Review"
];

export const EventsLogs = ["All", "Event Type", "Entity Type"]

export const ManageActionReason = ["All", "Reason", "Action"]

export const ManageSupportTickets = [
    "All",
    "Client",
    "Ticket #",
    "Title",
    "Functional Area",
    "Request Type",
    "Priority",
    "Status"
];

export const ManageCommunicationCenter = ["All", "Message", "Priority", "Category", "Status"];

export const ConfirmationAssignment = [
  "All",
  "Division",
  "Location",
  "Position",
  "Confirm Status"
];

export const ManageContentLibrary = ["All", "Title", "Content Type"];

export const ManageContentLibStatus = [
    "Draft",
    "Archived",
    "Published"
]

export const FinancialAccrualReport = [
  "All",
  "Provider Name",
  "Region",
  "Division",
  "Location",
  "Vendor"
];