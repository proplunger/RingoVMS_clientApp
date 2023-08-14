// HOME Url
export const APP_HOME_URL = "/";

// Requisitions Urls
export enum ReqUrls {
    APPROVAL = "/requisitions/approval"
}
export const REQ_VIEW_URL = "/requisitions/view/";
export const REQ_RELEASE_URL = "/requisitions/release/";

// Candidate route urls
export const CAND_SUBMISSIONS_URL = "/candidate/submissions";
export const CAND_SUB_MANAGE_URL = "/candidates/submitted/";
export const CAND_SUB_WORKFLOW_URL = "/candidates/submitted/";
export const CAND_SUB_VIEW_URL = "/candidate/view/";
export const CAND_SUB_NAME_CLEAR_URL = "/candidate/nameclearform/";
export const CAND_SUBMISSION_FORM_URL = "/candidate/candidatesubmissionform/";
export const CAND_SUB_RISK_ATTESTATION_URL = "/candidate/riskattestation/";
export const CAND_SUB_RISK_CLEARANCE_URL = "/candidate/riskclearance/";
export const CAND_PRESENTATION_URL = "/candidate/clientpresentation/";
export const CAND_SUBMIT_PRESENTATION_URL = "/candidate/submitpresentation/";
//export const CAND_SUB_MANAGE_SCHEDULE_INTERVIEW_URL = "/candidate/manage/managescheduleinterview/"; // Screen removed
export const CAND_SUB_SCHEDULE_INTERVIEW_URL = "/candidate/manage/scheduleinterview/";
export const CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL = "/candidate/manage/updatescheduleinterview/";
export const CAND_SUB_BOOK_TIMESLOT_URL = "/candidate/manage/booktimeslot/";
export const OFFER_INFORMATION = "/candidates/offerInformation/"
export const VIEW_ONBOARDING = "/candidates/viewOnboarding/"
export const CREATE_ASSIGNMENT = "/candidates/startassignment/"
export const CAPTURE_ROUND_RESULT = "/candidates/RoundCapture/"
export const INTERVIEW_DETAILS = "/candidates/InterviewDetails/"
export const CANDIDATE_PRESENTATION_INFO = "/candidate/presentationinfo/"

//Global Admin route urls
export const MANAGE_ROLE_PERMISSIONS = "/admin/role/manage";
export const CREATE_ROLES = "/admin/role/create";
export const EDIT_ROLES = "/admin/role/edit/:id";

// Admin route urls
export const USER_CALENDAR_URL = "/admin/scheduleavailability";
export const ADD_CANDIDATE_URL = "/candidate/create";
export const EDIT_CANDIDATE_URL = "/candidate/edit/";
export const MANAGE_CLIENT_LOCATION = "/admin/client/:clientId/locations"
export const MANAGE_DIV_LOCATION = "/admin/client/:clientId/division/:id/locations"
export const CREATE_CLIENT_LOCATION = "/admin/client/:clientId/location/create/"
export const CREATE_DIV_LOCATION = "/admin/client/:clientId/division/:id/location/create/"
export const EDIT_DIV_LOCATION = "/admin/client/:clientId/division/:divisionId/location/edit/:locId"
export const EDIT_CLIENT_LOCATION = "/admin/client/:clientId/location/edit/:locId"
export const MANAGE_INTERVIEW_CRITERIA = "/admin/interviewcriteria/manage/"
export const CREATE_INTERVIEW_CRITERIA = "/admin/interviewcriteria/create/"
export const EDIT_INTERVIEW_CRITERIA = "/admin/interviewcriteria/edit/:id"
export const MANAGE_RELEASE = "/admin/releaseconfig/manage/"
export const CREATE_RELEASE = "/admin/releaseconfig/create/"
export const EDIT_RELEASE = "/admin/releaseconfig/edit/"
export const CLIENT_SETTING = "/admin/client/settings"
export const GLOBAL_SETTING = "/admin/global/settings"
export const NOTIFICATION_SETTING = "/admin/notification/settings"
export const USER_NOTIFICATION_SETTING = "/admin/user/:id/notification/settings"
export const MANAGE_GLOBAL_JOB_CATALOG = "/admin/globaljobcatalog/manage/"
export const MANAGE_CLIENT_RATE_CARD = "/admin/clientratecard/manage/"
export const CREATE_CLIENT_RATE_CARD = "/admin/clientratecard/create/"
export const EDIT_CLIENT_RATE_CARD = "/admin/clientratecard/edit/"
export const MANAGE_CLIENT_JOB_CATALOG = "/admin/clientjobcatalog/manage/"
export const MAP_GLOBAL_DATA_TO_CLIENT = "/admin/globaldata/map/"
export const MANAGE_ONBOARDING_CONFIGURATION = "/admin/onboarding/manage/"
export const CREATE_ONBOARDING_CONFIGURATION = "/admin/onboarding/create/"
export const EDIT_ONBOARDING_CONFIGURATION = "/admin/onboarding/edit/"
export const EDIT_VENDOR_TIER = "/admin/vendortiers/edit/"
export const EDIT_INTERVIEW_CRITERIA_CONFIG = "/admin/interviewcriteria/edit/"
export const MANAGE_REQ_APPROVER_CONFIGURATION = "/admin/:entityType/approver/manage/"
export const CREATE_REQ_APPROVER_CONFIGURATION = "/admin/:entityType/approver/create/"
export const EDIT_REQ_APPROVER_CONFIGURATION = "/admin/:entityType/approver/edit/:id"
export const MANAGE_TIMESHEET_APPROVER_CONFIGURATION = "/admin/timesheetapprover/manage/"
export const CREATE_TIMESHEET_APPROVER_CONFIGURATION = "/admin/timesheetapprover/create/"
export const EDIT_TIMESHEET_APPROVER_CONFIGURATION = "/admin/timesheetapprover/edit/:id"
export const MANAGE_SERVICE_TYPE="/admin/globalservicetype/manage";
export const MANAGE_ACTION_REASON="/admin/globalactionreason/manage";
export const MANAGE_NOTIFICATIONS="/admin/notification/manage/";
export const CREATE_NOTIFICATION="/admin/notification/create";
export const EDIT_NOTIFICATION="/admin/notification/edit/:id";

export const COMMUNICATION_CENTER ="/admin/communicationcenter/manage";
export const CREATE_COMMUNICATION_CENTER ="/admin/communicationcenter/create";
export const EDIT_COMMUNICATION_CENTER ="/admin/communicationcenter/edit/:id";
export const MANAGE_EVENTS_LOGS = "/admin/eventslogs/manage";


//Admin Users urls
export const MANAGE_USERS = "/admin/users/manage";
export const MANAGE_USERS_ROLE = "/admin/users/role/:roleId";
export const CREATE_USERS = "/admin/users/create";
export const EDIT_USERS = "/admin/users/edit/:id";
export const CREATE_MESSAGE_CENTER="/admin/messagecenter/create";


// Timesheet route urls
export const MANAGE_TIMESHEET = "/jobs/manage";
export const PROVIDER_TIMESHEET = "/timesheet/provider/";
export const CANDIDATE_PROVIDER_TIMESHEET = "/timesheet/provider";
export const TIMESHEET = "/timesheet/";
export const TIMESHEET_APPROVAL = "/timesheets/approval";
export const TIMESHEET_SUBMITTED = "/timesheets/submitted";
export const UNDER_REVIEW = "/underreview";
export const RATE_CARD = "/timesheet/ratecard/provider/";
export const PROVIDER_TIMESHEETS = "/timesheets/provider/";
export const JOB_DETAIL = "/jobdetail/";
export const ONBOARDING_DETAIL = "/onboardingdetail/";
export const EXTEND_ASSIGNMENT = "/extendassignment/";
export const EDIT_ASSIGNMENT_EXTENSION = "/candsub/:subId/extassignment/:candSubExtId/edit";
export const VIEW_ASSIGNMENT_EXTENSION = "/candsub/:subId/extassignment/:candSubExtId/view";

// Vendor Invoice urls
export const MANAGE_VENDOR_INVOICES = "/vendor/invoices";
export const VIEW_VENDOR_INVOICE = "/vendor/invoices/view/";
export const VENDOR_INVOICE_UNDER_REVIEW = "/vendor/invoices/:id/expenses";
export const MANAGE_CBI_VENDOR_INVOICES = "/vendor/invoices/:id";
// CBI urls
export const MANAGE_CBI = '/client/invoices';

// Dashboard urls
export const MANAGE_MY_TASKS = '/tasks'

// Ticket urls
export const MANAGE_SUPPORT_TICKETS = '/tickets'
export const CREATE_SUPPORT_TICKETS = '/ticket/create'
export const EDIT_SUPPORT_TICKETS = '/ticket/edit/:id'
export const VIEW_SUPPORT_TICKETS = '/ticket/view/:id'
export const TICKET_VIEW_URL = "/ticket/view/";

//Content Library urls
export const MANAGE_CONTENT_LIBRARY = '/admin/contentlib/manage';
export const CREATE_CONTENT_LIBRARY = '/admin/contentlib/create';
export const EDIT_CONTENT_LIBRARY = '/admin/contentlib/edit/:id';
export const VIEW_CONTENT_LIBRARY = '/admin/contentlib/view/:id'
export const USER_VIEW_CONTENT_LIBRARY = '/contentlibrary/view';

//report urls
export const CONFIRMATION_ASSIGNMENT_REPORT = '/report/car';
export const ASSOCIATE_EXPENSE_REPORT  = '/report/ae'
export const FINANCIAL_ACCRUAL_REPORT  = '/report/far'
export const TIMESHEET_REPORT= '/report/ts'
export const REQ_PERFORMANCE_REPORT='/report/rp'
export const CLIENT_STATEMENT_REPORT='/report/cs'
export const FILLED_ASSIGNMENT_REPORT=	'/report/fa'
export const VENDOR_PERFORMANCE_REPORT='/report/vp'
export const CANDIDATE_SUBMITTAL_REPORT='/report/cas'
export const EXPIRING_CREDENTIAL_REPORT='/report/ec'
export const CLIENT_ACTIVITY_REPORT='/report/ca'