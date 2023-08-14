import { CandSubStatusIds, CandSubInterviewStatusIds, VendorInvoiceStatusIds, ClientInvoiceStatusIds, ReqStatus, TicketStatus, ContentStatus } from "../AppConstants";

export interface StatusDictionary {
    status?: string;
    isLevelActive?: boolean;
    isApproverActive?: boolean;
    action?: string;
    className?: string;
    levelNumber?: number;
}

export const StatusLegendDictionary: Array<StatusDictionary> = [
    { status: ReqStatus.DRAFT, className: "legend-orng", levelNumber: 1 },
    { status: ReqStatus.PENDINGAPPROVAL, className: "legend-orng", levelNumber: 2 },
    { status: ReqStatus.APPROVED, className: "legend-grn", levelNumber: 3 },
    { status: ReqStatus.ONHOLD, className: "legend-yellow", levelNumber: 4 },
    { status: ReqStatus.REJECTED, className: "legend-red", levelNumber: 5 },
    { status: ReqStatus.RELEASED, className: "legend-cand-under-review", levelNumber: 6 },
    { status: ReqStatus.CANDIDATEUNDERREVIEW, className: "legend-orng", levelNumber: 11 },
    { status: ReqStatus.FILLED, className: "legend-cand-under-review", levelNumber: 12 },
    { status: ReqStatus.CLOSED, className: "legend-cand-under-review", levelNumber: 13 },
    { status: ReqStatus.CANCELLED, className: "legend-red", levelNumber: 14 },
    { status: "Pending Negotiation", className: "legend-orng", levelNumber: 8 },
    { status: "Active", className: "legend-grn", levelNumber: 9 },
    { status: "Pending", className: "legend-orng", levelNumber: 7 },
    { status: "Not Working", className: "legend-grey", levelNumber: 10 },
    { status: "Under Review", className: "legend-yellow", levelNumber: 15 },
    { status: "Published", className: "legend-grn", levelNumber: 16 },
    { status: "Archived", className: "legend-grey", levelNumber: 17 },
];

export const LevelStatusDictionary: Array<StatusDictionary> = [
    { status: "draft", isLevelActive: null, className: "l-draft", levelNumber: 1 },
    { status: "approved", isLevelActive: false, className: "l-approved", levelNumber: 3 },
    { status: "pending approval", isLevelActive: true, className: "l-Pendingapproval", levelNumber: 2 },
    { status: "pending approval", isLevelActive: false, className: "l-approved", levelNumber: 2 },
    { status: "on hold", isLevelActive: true, className: "l-hold", levelNumber: 4 },
    { status: "on hold", isLevelActive: false, className: "l-approved", levelNumber: 4 },
    { status: "rejected", isLevelActive: false, className: "l-reject", levelNumber: 5 },
    { status: "released", isLevelActive: false, className: "l-approved", levelNumber: 6 },
    { status: "open - candidates submitted", isLevelActive: false, className: "l-approved", levelNumber: 6 },
    { status: "filled", isLevelActive: false, className: "l-approved", levelNumber: 6 },
];

export const ApproverStatusDictionary: Array<StatusDictionary> = [
    { status: "draft", action: null, isApproverActive: null, className: "c-draft" },
    { status: "pending approval", action: null, isApproverActive: true, className: "c-pendingapproval" },
    { status: "approved", action: "Approve", isApproverActive: false, className: "c-approve" },
    { status: "on hold", action: "Hold", isApproverActive: true, className: "c-hold" },
    { status: "rejected", action: "Reject", isApproverActive: false, className: "c-reject" },
    { status: "approved", action: null, isApproverActive: false, className: "c-required" },
];

export const CandidateStatusLegendDictionary: Array<StatusDictionary> = [
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORNAMECLEAR },
    { className: "legend-orng", levelNumber: CandSubStatusIds.SUBMITTEDFORNAMECLEAR },
    { className: "legend-orng", levelNumber: CandSubStatusIds.NAMECLEARED },
    { className: "legend-red", levelNumber: CandSubStatusIds.NAMENOTCLEARED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORNAMECLEAR },
    { className: "legend-cand-under-review", levelNumber: CandSubStatusIds.WITHDRAWN },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORRISKATTESTATION },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORRISKCLEARANCE },
    { className: "legend-orng", levelNumber: CandSubStatusIds.RISKCLEARED },
    { className: "legend-red", levelNumber: CandSubStatusIds.RISKREJECTED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORVENDORPRESENTATION },
    { className: "legend-orng", levelNumber: CandSubStatusIds.VENDORPRESENTATIONSUBMITTED },
    { className: "legend-red", levelNumber: CandSubStatusIds.VENDORPRESENTATIONREJECTED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGFORCLIENTPRESENTATION },
    { className: "legend-red", levelNumber: CandSubStatusIds.CLIENTPRESENTATIONREJECTED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGSCHEDULEINTERVIEW },
    { className: "legend-red", levelNumber: CandSubStatusIds.REJECTED },
    { className: "legend-red", levelNumber: CandSubStatusIds.INTERVIEWCANCELLED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGOFFER },
    { className: "legend-orng", levelNumber: CandSubStatusIds.INTERVIEWINPROGRESS },
    { className: "legend-orng", levelNumber: CandSubStatusIds.OFFERSUBMITTED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGONBOARDING },
    { className: "legend-orng", levelNumber: CandSubStatusIds.ONBOARDINGSUBMITTED },
    { className: "legend-orng", levelNumber: CandSubStatusIds.PENDINGCREDENTIALING },
    { className: "legend-red", levelNumber: CandSubStatusIds.OFFERREJECTED },
    { className: "legend-grn", levelNumber: CandSubStatusIds.READYTOWORK },
    { className: "legend-orng", levelNumber: CandSubStatusIds.ASSIGNMENTCREATED },
    { className: "legend-grn", levelNumber: CandSubStatusIds.ASSIGNMENTINPROGRESS },
    { className: "legend-grn", levelNumber: CandSubStatusIds.ASSIGNMENTEXTENDED },
    { className: "legend-cand-under-review", levelNumber: CandSubStatusIds.ASSIGNMENTCOMPLETED },
];

export const CandidateInterviewStatusLegendDictionary: Array<StatusDictionary> = [
    { className: "legend-orng", levelNumber: CandSubInterviewStatusIds.DRAFT },
    { className: "legend-orng", levelNumber: CandSubInterviewStatusIds.PENDINGCONFIRMATION },
    { className: "legend-orng", levelNumber: CandSubInterviewStatusIds.SCHEDULED },
    { className: "legend-red", levelNumber: CandSubInterviewStatusIds.CANCELLED },
    { className: "legend-grn", levelNumber: CandSubInterviewStatusIds.ACTIVE },
    { className: "legend-cand-under-review", levelNumber: CandSubInterviewStatusIds.COMPLETED },
    { className: "legend-orng", levelNumber: CandSubInterviewStatusIds.RESCHEDULED },
]

export const VendorInvoiceStatusLegendDictionary: Array<StatusDictionary> = [
    { className: "legend-grn", levelNumber: VendorInvoiceStatusIds.ACTIVE },
    { className: "legend-grn", levelNumber: VendorInvoiceStatusIds.VENDORAUTHORIZED },
    { className: "legend-grn", levelNumber: VendorInvoiceStatusIds.CLIENTAUTHORIZED },
    { className: "legend-orng", levelNumber: VendorInvoiceStatusIds.UNDERAUDITREVIEW },
    { className: "legend-red", levelNumber: VendorInvoiceStatusIds.REJECTED },
    { className: "legend-orng", levelNumber: VendorInvoiceStatusIds.REMITTANCESENT },
    { className: "legend-cand-under-review", levelNumber: VendorInvoiceStatusIds.PAIDINFULLREMITTANCE },
    { className: "legend-orng", levelNumber: VendorInvoiceStatusIds.UNDERVENDORREVIEW },
    { className: "legend-cand-under-review", levelNumber: VendorInvoiceStatusIds.CLOSED },
    { className: "legend-yellow", levelNumber: VendorInvoiceStatusIds.UNDERREVIEWQUEUE },
]

export const ClientInvoiceStatusLegendDictionary: Array<StatusDictionary> = [
    { className: "legend-grn", levelNumber: ClientInvoiceStatusIds.ACTIVE },
    { className: "legend-grn", levelNumber: ClientInvoiceStatusIds.CBIAUTHORIZED },
    { className: "legend-orng", levelNumber: ClientInvoiceStatusIds.PAYMENTRECEIVED },
    { className: "legend-orng", levelNumber: ClientInvoiceStatusIds.REMITTANCEINPROCESS},
    { className: "legend-cand-under-review", levelNumber: ClientInvoiceStatusIds.REMITTANCECOMPLETE},
]

export const TicketStatusLegendDictionary: Array<StatusDictionary> = [
    { status: TicketStatus.NEW, className: "legend-orng", levelNumber: 1 },
    { status: TicketStatus.OPEN, className: "legend-grn", levelNumber: 2 },
    { status: TicketStatus.RESOLVED, className: "legend-cand-under-review", levelNumber: 3 },
    { status: TicketStatus.CLOSED, className: "legend-cand-under-review", levelNumber: 4 },
];

export const ContentLibStatusLegendDictionary: Array<StatusDictionary> = [
    { status: ContentStatus.DRAFT, className: "legend-orng", levelNumber: 1 },
    { status: ContentStatus.PUBLISHED, className: "legend-grn", levelNumber: 2 },
    { status: ContentStatus.ARCHIVED, className: "legend-cand-under-review", levelNumber: 3 }
];