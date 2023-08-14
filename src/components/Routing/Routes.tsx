import AuthorizedLayout from "../../components/Layouts/Header/AuthorizedLayout";
import GuestLayout from ".././Layouts/Header/GuestLayout";
import LoginPage from "../../components/Account/Login/Login";
import { AppRoute } from "./AppRoute";
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import SubmittedTimesheetDetails from "../TimeSheets/SubmittedTimesheets/SubmittedTimesheetDetails";
import ProviderContract from "../TimeSheets/ProviderContract/ProviderContract";
import WorkHistory from "../TimeSheets/WorkHistory/WorkHistory";
import ForgotPassword from "../Account/ForgotPassword/ForgotPassword";
import ResetPassword from "../Account/ResetPassword/ResetPassword";
import Register from "../Account/Register/Register";
import ChangePassword from "../Account/ChangePassword/ChangePassword";
import SendRegistrationLink from "../Account/SendRegistration/SendRegistrationLink";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "../Shared/NotFound/NotFound";
import NotAuthorized from "../Shared/NotAuthorized/NotAuthorized";
import DashBoard from "../../components/DashBoard/DashBoard";
import CreateRequisition from ".././Requisitions/CreateRequisition/CreateRequisition";
import EditRequisition from ".././Requisitions/EditRequisition/EditRequisition";
import ViewRequisition from ".././Requisitions/ViewRequisition/ViewRequisition";
import ReviewRequisition from ".././Requisitions/ReviewRequisition/ReviewRequisition";
import Requisitions from ".././Requisitions/ManageRequisitions/Requisitions";
import PendingRequisitions from ".././Requisitions/ManagePendingRequisitions/PendingRequisitions";
import ReleaseRequisition from ".././Requisitions/ReleaseRequisition/ReleaseRequisition";
import CandidateSubmission from ".././Candidates/ManageCandidateSubmission/CandidateSubmission";
import CandidateWF from ".././Candidates/ManageCandidateWF/CandidateWF";
import NameClearForm from ".././Candidates/NameClearForm/NameClearForm";
import CandidateSubmissionForm from ".././Candidates/CandidateSubmissionForm/CandidateSubmissionForm";
import ViewCandidate from ".././Candidates/ViewCandidate/ViewCandidate";
import RiskAttestationForm from ".././Candidates/RiskAttestationForm/RiskAttestationForm";
import RiskClearanceForm from ".././Candidates/RiskClearanceForm/RiskClearanceForm";
import SubmitPresentationForm from ".././Candidates/SubmitPresentationForm/SubmitPresentationForm";
import ClientPresentation from ".././Candidates/ClientPresentation/ClientPresentation";
import JobPosition from "../Admin/JobPosition/JobPosition";
import SchedulerAvailability from "../Account/ScheduleAvailability/ScheduleAvailabity";
import BookTimeslot from "../Candidates/BookTimeslot/BookTimeslot";
import ScheduleInterview from "../Candidates/ScheduleInterview/ScheduleInterview";
import CreateCandidate from ".././Candidates/CreateCandidate/CreateCandidate";
import CaptureRoundResult from "../Candidates/RoundCapture/CaptureRoundResults/CaptureRoundResult";
import InterviewDetails from "../Candidates/RoundCapture/ViewAllResults/InterviewDetails";
import TimeSheetManagement from "../TimeSheets/TimeSheetManagement/TimeSheetManagement";
import OfferInformation from "../Candidates/MakeAnOffer/OfferInformation/OfferInformation";
import TimeSheetInformation from "../TimeSheets/TimeSheetInformation/TimeSheetInformation";
import TimeSheet from "../TimeSheets/TimeSheet/TimeSheet";
import SubmittedTimesheets from "../TimeSheets/SubmittedTimesheets/SubmittedTimesheets";
import UnderReview from "../Shared/UnderReview/UnderReview";
import VendorInvoiceExpenses from "../Vendor/UnderReviewExpenses/UnderReviewExpensesDetails";
import JobDetail from "../TimeSheets/JobDetail/JobDetail";
import OnBoardingDetail from "../TimeSheets/OnBoardingDetail/OnBoardingDetail";
import ViewOnboarding from "../Candidates/CandidateOnBoarding/Onboarding";
import Assignment from "../Candidates/Assignment/Assignment";
import ManagePermissions from "../Admin/ManagePermissions/Permissions";
import ManageRegions from "../Admin/ClientAdmin/Regions/ManageRegions/Regions";
import ManageDivisions from "../Admin/ClientAdmin/Divisions/ManageDivisions/Divisions";
import ManageGlobalJobCatalog from "../Admin/GlobalAdmin/GlobalJobCatalog/ManageGlobalJobCatalog/GlobalJobCatalog";
import ManageGlobalServiceType from "../Admin/GlobalAdmin/GlobalServiceType/ManageGlobalServiceType/GlobalServiceType";
import ManageClientRateCard from "../Admin/ClientAdmin/ClientRateCard/ManageClientRateCard/ClientRateCard";
import CreateClientRateCard from "../Admin/ClientAdmin/ClientRateCard/CreateClientRateCard/CreateClientRateCards";
import ManageClientJobCatalog from "../Admin/ClientAdmin/ClientJobCatalog/ManageClientJobCatalog/ClientJobCatalog";
import MapGlobalDataToClient from "../Admin/ClientAdmin/GlobalData/MapGlobalData/MapGlobalDataToClient";
import ManageOnboardingConfiguration from "../Admin/ClientAdmin/OnBoardingConfiguration/ManageOnBoardingConfiguration/OnBoardingConfiguration";
import CreateOnboardingConfiguration from "../Admin/ClientAdmin/OnBoardingConfiguration/CreateOnBoardingConfiguration/CreateOnboardingConfiguration";
import TnC from "../Account/TermsAndConditions/TermsAndConditions";
import ManageReqApproverConfiguration from "../Admin/ClientAdmin/ReqApproverConfiguration/ManageReqApproverConfiguration/ReqApproverConfig";
import CreateReqApproverConfiguration from "../Admin/ClientAdmin/ReqApproverConfiguration/CreateReqApproverConfiguration/CreateReqApproverConfig";
import ClientSetting from '../Admin/ClientAdmin/ClientSetting/ClientSetting'
import GlobalSetting from '../Admin/GlobalAdmin/GlobalSettings/GlobalSettings'
import NotificationSetting from '../Admin/ClientAdmin/NotificationSettings/NotificationSettings'
import ManageLocations from "../Admin/ClientAdmin/Locations/ManageLocations/Locations";
import CreateLocation from "../Admin/ClientAdmin/Locations/CreateLocation/CreateLocation";
import ManageInterviewCriteria from "../Admin/ClientAdmin/InterviewCriteriaConfiguration/ManageInterviewCriteria/InterviewCriteria";
import CreateInterviewCriteria from "../Admin/ClientAdmin/InterviewCriteriaConfiguration/CreateInterviewCriteria/CreateInterviewCriteria";
import ManageRelease from "../Admin/ClientAdmin/RealeaseConfiguration/ManageReleaseConfiguration/ReleaseConfiguration";
import CreateRelease from "../Admin/ClientAdmin/RealeaseConfiguration/CreateReleaseConfiguration/CreateReleaseConfiguration";
import ManageSkills from "../Admin/ManageSkills/Skills";
import ManageServiceType from "../Admin/ManageSeviceType/GlobalServiceType";
import ManageJobCategories from "../Admin/ManageJobCategories/JobCategories";
import ManageReqReason from "../Admin/ManageReqReason/ReqReason";
import ManageRole from "../Admin/GlobalAdmin/ManageRole/Roles";
import ManageCandidate from "../Admin/GlobalAdmin/Candidates/ManageCandidates/Candidates";
import CreateCandidates from "../Admin/GlobalAdmin/Candidates/CreateCandidate/CreateCandidate";
import ManageUser from "../Users/ManageUsers/Users";
import CreateUser from "../Users/CreateUser/CreateUser";
import ManageVendor from "../Admin/GlobalAdmin/Vendors/ManageVendors/Vendors";
import CreateVendor from "../Admin/GlobalAdmin/Vendors/CreateVendor/CreateVendor";
import ManageClient from "../Admin/GlobalAdmin/Clients/ManageClients/Clients";
import CreateClientConfiguration from "../Admin/GlobalAdmin/Clients/CreateClient/CreateClient";
import GlobalAdmin from "../Admin/GlobalAdmin/GlobalAdmin/GlobalAdmin";
import VendorAdmin from "../Admin/VendorAdmin/VendorAdmin/VendorAdmin";
import ClientAdmin from "../Admin/ClientAdmin/ClientAdmin/ClientAdmin";
import ManageWorkflows from "../Shared/Workflow/ManageWorkflow";
import ManageVendorTiers from "../Admin/ClientAdmin/VendorTiers/ManageVendorTiers/VendorTiers";
import Invoices from "../Vendor/Invoice/Manage/Invoices";
import VendorInvoiceDetails from "../Vendor/Invoice/InvoiceDetails/VendorInvoiceDetails";
import ManageCBInvoices from '../Clients/ClientInvoice/Manage/CBInvoices'
import Expense from "../TimeSheets/Expense/Expense";
import ManageNotificationTemplates from "../Admin/GlobalAdmin/NotificationTemplates/ManageNotificationTemplates/NotificationTemplates";
import CreateNotificationTemplate from "../Admin/GlobalAdmin/NotificationTemplates/CreateNotificationTemplate/CreateNotificationTemplate";
import AssociateExpenseReport from "../Reports/AssociateExpenseReport/AssociateExpenseReport";
import ManageTicket from "../Tickets/ManageTickets/Tickets";
import CreateTicket from "../Tickets/CreateTicket/CreateTicket";
import ViewTicket from "../Tickets/ViewTicket/ViewTicket";

import {
    CAND_SUB_RISK_ATTESTATION_URL,
    CAND_SUB_RISK_CLEARANCE_URL,
    CAND_PRESENTATION_URL,
    CAND_SUBMISSION_FORM_URL,
    CAND_SUB_NAME_CLEAR_URL,
    CAND_SUB_MANAGE_URL,
    CAND_SUBMISSIONS_URL,
    CAND_SUBMIT_PRESENTATION_URL,
    CAND_SUB_VIEW_URL,
    ADD_CANDIDATE_URL,
    USER_CALENDAR_URL,
    CAND_SUB_SCHEDULE_INTERVIEW_URL,
    CAPTURE_ROUND_RESULT,
    INTERVIEW_DETAILS,
    CAND_SUB_BOOK_TIMESLOT_URL,
    CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL,
    OFFER_INFORMATION,
    VIEW_ONBOARDING,
    CREATE_ASSIGNMENT,
    MANAGE_TIMESHEET,
    PROVIDER_TIMESHEET,
    TIMESHEET,
    CANDIDATE_PROVIDER_TIMESHEET,
    MANAGE_VENDOR_INVOICES,
    VIEW_VENDOR_INVOICE,
    RATE_CARD,
    MANAGE_CBI,
    ReqUrls,
    MANAGE_RELEASE,
    CREATE_RELEASE,
    EDIT_RELEASE,
    MANAGE_MY_TASKS,
    MANAGE_GLOBAL_JOB_CATALOG,
    MANAGE_CLIENT_RATE_CARD,
    MANAGE_INTERVIEW_CRITERIA,
    CREATE_INTERVIEW_CRITERIA,
    EDIT_INTERVIEW_CRITERIA,
    MANAGE_CLIENT_JOB_CATALOG,
    CLIENT_SETTING,
    MANAGE_DIV_LOCATION,
    CAND_SUB_WORKFLOW_URL,
    MANAGE_ONBOARDING_CONFIGURATION,
    CREATE_ONBOARDING_CONFIGURATION,
    MANAGE_CLIENT_LOCATION,
    CREATE_CLIENT_LOCATION,
    EDIT_CLIENT_LOCATION,
    EDIT_ONBOARDING_CONFIGURATION,
    MANAGE_TIMESHEET_APPROVER_CONFIGURATION,
    MANAGE_REQ_APPROVER_CONFIGURATION,
    CREATE_TIMESHEET_APPROVER_CONFIGURATION,
    EDIT_TIMESHEET_APPROVER_CONFIGURATION,
    CREATE_REQ_APPROVER_CONFIGURATION,
    EDIT_REQ_APPROVER_CONFIGURATION,
    MAP_GLOBAL_DATA_TO_CLIENT,
    CREATE_DIV_LOCATION,
    EDIT_DIV_LOCATION,
    NOTIFICATION_SETTING,
    GLOBAL_SETTING,
    PROVIDER_TIMESHEETS,
    JOB_DETAIL,
    ONBOARDING_DETAIL,
    MANAGE_USERS,
    CREATE_USERS,
    EDIT_USERS,
    USER_NOTIFICATION_SETTING,
    CREATE_CLIENT_RATE_CARD,
    EDIT_CLIENT_RATE_CARD,
    MANAGE_EVENTS_LOGS,
    MANAGE_SERVICE_TYPE,
    MANAGE_ACTION_REASON,
    MANAGE_NOTIFICATIONS,
    CREATE_NOTIFICATION,
    EDIT_NOTIFICATION,    
    MANAGE_ROLE_PERMISSIONS,
    CREATE_ROLES,
    EDIT_ROLES,
    MANAGE_USERS_ROLE,
    UNDER_REVIEW,
    VENDOR_INVOICE_UNDER_REVIEW,
    ASSOCIATE_EXPENSE_REPORT,
    CREATE_MESSAGE_CENTER,
    COMMUNICATION_CENTER,
    CREATE_COMMUNICATION_CENTER,
    EDIT_COMMUNICATION_CENTER,
    MANAGE_SUPPORT_TICKETS,
    CREATE_SUPPORT_TICKETS,
    EDIT_SUPPORT_TICKETS,
    VIEW_SUPPORT_TICKETS,
    MANAGE_CONTENT_LIBRARY,
    CREATE_CONTENT_LIBRARY,
    EDIT_CONTENT_LIBRARY,
    VIEW_CONTENT_LIBRARY,
    USER_VIEW_CONTENT_LIBRARY,
    CANDIDATE_PRESENTATION_INFO,
    CONFIRMATION_ASSIGNMENT_REPORT,
    FINANCIAL_ACCRUAL_REPORT,
    CLIENT_ACTIVITY_REPORT,
    EXPIRING_CREDENTIAL_REPORT,
    CANDIDATE_SUBMITTAL_REPORT,
    VENDOR_PERFORMANCE_REPORT,
    FILLED_ASSIGNMENT_REPORT,
    CLIENT_STATEMENT_REPORT,
    REQ_PERFORMANCE_REPORT,
    TIMESHEET_REPORT,
    MANAGE_CBI_VENDOR_INVOICES,
    EXTEND_ASSIGNMENT,
    EDIT_ASSIGNMENT_EXTENSION,
    VIEW_ASSIGNMENT_EXTENSION
} from "../Shared/ApiUrls";
import auth from "../Auth";
import ClientRateCard from "../TimeSheets/ClientRateCard/ClientRateCard";
import TimeSheetReport from "../Reports/TimeSheetReport/TimeSheetReport";
import ReqPerformanceReport from "../Reports/ReqPerformanceReport/ReqPerformanceReport";
import ClientStatementReport from "../Reports/ClientStatementReport/ClientStatementReport";
import FilledAssignmentReport from "../Reports/FIlledAssignmentReport/FilledAssignmentReport";
import VendorPerformanceReport from "../Reports/VendorPerformanceReport/VendorPerformanceReport";
import CandidateSubmittalReport from "../Reports/CandidateSubmittalReport/CandidateSubmittalReport";
import ExpiringCredentialReport from "../Reports/ExpiringCredentialReport/ExpiringCredentialReport";
import ClientActivityReport from "../Reports/ClientActivityReport/ClientActivityReport";
import MyTaskDetails from "../DashBoard/MyTaskDetails";
import CandidateShareWF from "../Admin/GlobalAdmin/CandidateShareWF/CandidateShareWF";
import ApproveCandidateShare from "../Admin/GlobalAdmin/CandidateShareWF/ApproveCandidateShare";
import CreateVendorTiers from "../Admin/ClientAdmin/VendorTiers/CreateVendorTier/CreateVendorTiers";
import CreateRole from "../Admin/GlobalAdmin/ManageRole/CreateRole";
import ManageEventsLog from "../Admin/GlobalAdmin/EventsLog/ManageEventLog/ManageEventsLog";
import ViewEventsLog from "../Admin/GlobalAdmin/EventsLog/ViewEventsLogs/ViewEventsLogs";
import BatchReleaseRequisition from "../Requisitions/BatchReleaseRequisition/BatchReleaseRequisition";
import GlobalActionReason from "../Admin/GlobalAdmin/GlobalActionReason/ManageGlobalActionReason/GlobalActionReason";
import CreateGlobalActionReason from "../Admin/GlobalAdmin/GlobalActionReason/CreateGlobalActionReason/CreateGlobalActionReason";
import SpendForecastReport from "../Reports/SpendForecastReport/SpendForecastReport";
import CandidatePresentationInfo from "../Candidates/CandidatePresentationInfo/CandidatePresentationInfo";
import MessageCenter from "../Admin/GlobalAdmin/MessageCenter/ManageMessageCenter/MessageCenter";
import CreateMessageCenter from "../Admin/GlobalAdmin/MessageCenter/CreateMessageCenter/CreateMessageCenter";
// import ManageContentLibrary from "../ContentLibrary/ManageContentLibrary/ContentLibrary";
// import CreateContentLibrary from "../ContentLibrary/CreateContentLibrary/CreateContentLibrary";
// import ViewContentLibrary from "../ContentLibrary/ViewContentLibrary/GlobalViewContentLibrary";
// import UserViewContentLibrary from "../ContentLibrary/ViewContentLibrary/ViewContentLibrary";
import ConfirmationAssignmentReport from "../Reports/ConfirmationAssignmentReport/ConfirmationAssignmentReport";
import CreateAssignmentExtension from "../TimeSheets/ExtendAssignment/CreateAssignmentExtension/CreateAssignmentExtension";
import FinancialAccrualReport from "../Reports/FinancialAccrualReport/FinancialAccrualReport";

interface IProps {
    children: any;
}

export default class Routes extends React.Component<{}, {}> {
    public render() {
        return (
            <Switch>
                {!auth.isAuthenticated() &&
                    <AppRoute layout={GuestLayout} exact path="/" component={LoginPage} pageTitle={"Login"} />}
                {auth.isAuthenticated() && <ProtectedRoute layout={AuthorizedLayout} exact path="/" component={DashBoard} pageTitle={"Home"} />}
                <AppRoute layout={GuestLayout} exact path="/login" component={LoginPage} pageTitle={"Login"} />
                <AppRoute layout={GuestLayout} exact path="/forgotpassword" component={ForgotPassword} pageTitle={"Forgot Password"} />
                <AppRoute layout={GuestLayout} exact path="/resetpassword" component={ResetPassword} pageTitle={"Reset Password"} />
                <AppRoute layout={GuestLayout} exact path="/register" component={Register} pageTitle={"Register"} />
                <AppRoute layout={GuestLayout} exact path="/sendregistration" component={SendRegistrationLink} pageTitle={"Send Registration Link"} />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/changepassword" component={ChangePassword} pageTitle={"Change Password"} />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/notauthorized" component={NotAuthorized} pageTitle={"Not Authorized"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisitions/create"
                    component={CreateRequisition}
                    pageTitle={"Create Requisition"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisitions/edit/:id"
                    component={CreateRequisition}
                    pageTitle={"Edit Requisition"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisition/edit/:id"
                    component={EditRequisition}
                    pageTitle={"Edit Requisition"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisitions/view/:id"
                    component={ViewRequisition}
                    pageTitle={"View Requisition"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisitions/review/:id"
                    component={ReviewRequisition}
                    pageTitle={"Review Requisition"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/requisitions/release/:id"
                    component={ReleaseRequisition}
                    pageTitle={"Release Requisition"}
                />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/requisitions/manage" component={Requisitions} pageTitle={"Manage Requisitions"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={ReqUrls.APPROVAL}
                    component={PendingRequisitions}
                    pageTitle={"My Pending Approvals"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CAND_SUBMISSIONS_URL}
                    component={CandidateSubmission}
                    pageTitle={"Candidate Submission"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_WORKFLOW_URL}:id`}
                    component={CandidateWF}
                    pageTitle={"Candidate Workflow"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_WORKFLOW_URL}`}
                    component={CandidateWF}
                    pageTitle={"Candidate Workflow"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_NAME_CLEAR_URL}:id/:subId`}
                    component={NameClearForm}
                    pageTitle={"Name Clear"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUBMISSION_FORM_URL}:id`}
                    component={CandidateSubmissionForm}
                    pageTitle={"Candidate Submission"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUBMISSION_FORM_URL}:id/:subId`}
                    component={CandidateSubmissionForm}
                    pageTitle={"Candidate Submission"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_VIEW_URL}:subId`}
                    component={ViewCandidate}
                    pageTitle={"View Candidate"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_RISK_ATTESTATION_URL}:id/:subId`}
                    component={RiskAttestationForm}
                    pageTitle={"Risk Attestation"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_RISK_CLEARANCE_URL}:id/:subId`}
                    component={RiskClearanceForm}
                    pageTitle={"Risk Attestation"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUBMIT_PRESENTATION_URL}:subId`}
                    component={SubmitPresentationForm}
                    pageTitle={"Vendor Presentation"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_PRESENTATION_URL}:subId`}
                    component={ClientPresentation}
                    pageTitle={"Candidate Presentation"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_SCHEDULE_INTERVIEW_URL}:subId`}
                    component={ScheduleInterview}
                    pageTitle={"Schedule Interview"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL}:id/:subId`}
                    component={ScheduleInterview}
                    pageTitle={"Schedule Interviews"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAND_SUB_BOOK_TIMESLOT_URL}:id/:subId`}
                    component={BookTimeslot}
                    pageTitle={"Pick a time slot for interview"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={USER_CALENDAR_URL}
                    component={SchedulerAvailability}
                    pageTitle={"Schedule Your Availability"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CAPTURE_ROUND_RESULT}:subId/:interviewId`}
                    component={CaptureRoundResult}
                    pageTitle={"Capture Round Result"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${INTERVIEW_DETAILS}:subId`}
                    component={InterviewDetails}
                    pageTitle={"Interview Details"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${OFFER_INFORMATION}:subId`}
                    component={OfferInformation}
                    pageTitle={"Offer Information"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${VIEW_ONBOARDING}:subId`}
                    component={ViewOnboarding}
                    pageTitle={"View Onboarding"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_ASSIGNMENT}:subId`}
                    component={Assignment}
                    pageTitle={"Start Assignment"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/jobpositions"
                    component={JobPosition}
                    pageTitle={"Manage Job Positions"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/permissions/manage"
                    component={ManagePermissions}
                    pageTitle={"Manage Permissions"}
                />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/workflows/manage" component={ManageWorkflows} pageTitle={"Manage Workflows"} />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/divisions/manage" component={ManageDivisions} pageTitle={"Manage Divisions"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/:id/regions"
                    component={ManageRegions}
                    pageTitle={"Manage Regions"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/:id/region/:regionId/divisions"
                    component={ManageDivisions}
                    pageTitle={"Manage Divisions"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/:id/divisions"
                    component={ManageDivisions}
                    pageTitle={"Manage Divisions"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_GLOBAL_JOB_CATALOG}`}
                    component={ManageGlobalJobCatalog}
                    pageTitle={"Global Job Catalog"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_SERVICE_TYPE}`}
                    component={ManageGlobalServiceType}
                    pageTitle={"Manage Service Types"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_CLIENT_RATE_CARD}`}
                    component={ManageClientRateCard}
                    pageTitle={"Manage Rate Cards"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_CLIENT_RATE_CARD}
                    component={CreateClientRateCard}
                    pageTitle={"Add New Rate Card"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_CLIENT_RATE_CARD}:id`}
                    component={CreateClientRateCard}
                    pageTitle={"Edit Rate Card"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_CLIENT_JOB_CATALOG}`}
                    component={ManageClientJobCatalog}
                    pageTitle={"Client Job Catalog"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MAP_GLOBAL_DATA_TO_CLIENT}`}
                    component={MapGlobalDataToClient}
                    pageTitle={"Map Global Data"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_DIV_LOCATION}`}
                    component={ManageLocations}
                    pageTitle={"Manage Locations"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_CLIENT_LOCATION}`}
                    component={ManageLocations}
                    pageTitle={"Manage Locations"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_CLIENT_LOCATION}`}
                    component={CreateLocation}
                    pageTitle={"Add New Location"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_DIV_LOCATION}`}
                    component={CreateLocation}
                    pageTitle={"Add New Location"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_DIV_LOCATION}`}
                    component={CreateLocation}
                    pageTitle={"Edit Location"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_CLIENT_LOCATION}`}
                    component={CreateLocation}
                    pageTitle={"Edit Location"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_INTERVIEW_CRITERIA}`}
                    component={ManageInterviewCriteria}
                    pageTitle={"Interview Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_INTERVIEW_CRITERIA}`}
                    component={CreateInterviewCriteria}
                    pageTitle={"Add Interview Criteria"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_INTERVIEW_CRITERIA}`}
                    component={CreateInterviewCriteria}
                    pageTitle={"Edit Interview Criteria"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_ONBOARDING_CONFIGURATION}`}
                    component={ManageOnboardingConfiguration}
                    pageTitle={"Onboarding Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_ONBOARDING_CONFIGURATION}`}
                    component={CreateOnboardingConfiguration}
                    pageTitle={"Add Onboarding Profile"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_ONBOARDING_CONFIGURATION}:id`}
                    component={CreateOnboardingConfiguration}
                    pageTitle={"Edit Onboarding Profile"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_REQ_APPROVER_CONFIGURATION}`}
                    component={ManageReqApproverConfiguration}
                    pageTitle={"Manage Approver Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_REQ_APPROVER_CONFIGURATION}`}
                    component={CreateReqApproverConfiguration}
                    pageTitle={"Add New Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_REQ_APPROVER_CONFIGURATION}`}
                    component={CreateReqApproverConfiguration}
                    pageTitle={"Edit Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_RELEASE}`}
                    component={ManageRelease}
                    pageTitle={"Release Configuration"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CREATE_RELEASE}`}
                    component={CreateRelease}
                    pageTitle={"Add New Release"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_RELEASE}:id`}
                    component={CreateRelease}
                    pageTitle={"Edit Release"}
                />
                <ProtectedRoute layout={AuthorizedLayout} exact path="/skills/manage" component={ManageSkills} pageTitle={"Manage Skills"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/servicetype/manage"
                    component={ManageServiceType}
                    pageTitle={"Manage Service Type"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/jobcategories/manage"
                    component={ManageJobCategories}
                    pageTitle={"Manage Job Categories"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/reqreason/manage"
                    component={ManageReqReason}
                    pageTitle={"Manage Requisition Reason"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact path={MANAGE_ROLE_PERMISSIONS}
                    component={ManageRole}
                    pageTitle={"Role & Permissions"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact path={CREATE_ROLES}
                    component={CreateRole}
                    pageTitle={"Add New Role"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact path={EDIT_ROLES}
                    component={CreateRole}
                    pageTitle={"Edit Role"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/candidate/manage"
                    component={ManageCandidate}
                    pageTitle={"Manage Candidates"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/candidate/create"
                    component={CreateCandidates}
                    pageTitle={"Add New Candidate"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/candidate/edit/:id"
                    component={CreateCandidates}
                    pageTitle={"Edit Candidate"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendor/manage"
                    component={ManageVendor}
                    pageTitle={"Manage Vendors"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendor/create"
                    component={CreateVendor}
                    pageTitle={"Add New Vendor"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendor/edit/:id"
                    component={CreateVendor}
                    pageTitle={"Edit Vendor"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/manage"
                    component={ManageClient}
                    pageTitle={"Manage Clients"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/create"
                    component={CreateClientConfiguration}
                    pageTitle={"Add New Client"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/client/edit/:id"
                    component={CreateClientConfiguration}
                    pageTitle={"Edit Client"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_USERS}
                    component={ManageUser}
                    pageTitle={"Manage Users"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_USERS_ROLE}
                    component={ManageUser}
                    pageTitle={"Manage Users"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_USERS}
                    component={CreateUser}
                    pageTitle={"Add User"}
                />
                 <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_NOTIFICATIONS}
                    component={ManageNotificationTemplates}
                    pageTitle={"Manage Notifications"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_NOTIFICATION}
                    component={CreateNotificationTemplate}
                    pageTitle={"Create Notification"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EDIT_NOTIFICATION}
                    component={CreateNotificationTemplate}
                    pageTitle={"Edit Notification"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_MESSAGE_CENTER}
                    component={CreateMessageCenter}
                    pageTitle={"Add Message Center"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EDIT_USERS}
                    component={CreateUser}
                    pageTitle={"Edit User"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendortiers/manage"
                    component={ManageVendorTiers}
                    pageTitle={"Manage Vendor Tiers"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendortiers/create"
                    component={CreateVendorTiers}
                    pageTitle={"Create Vendor Tier"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path="/admin/vendortiers/edit/:id"
                    component={CreateVendorTiers}
                    pageTitle={"Edit Vendor Tier"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${ADD_CANDIDATE_URL}`}
                    component={CreateCandidate}
                    pageTitle={"Create Candidate"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_TIMESHEET}`}
                    component={TimeSheetManagement}
                    pageTitle={"Manage Jobs"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${PROVIDER_TIMESHEET}:id`}
                    component={TimeSheetInformation}
                    pageTitle={"Timesheet Information"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CANDIDATE_PROVIDER_TIMESHEET}`}
                    component={TimeSheetInformation}
                    pageTitle={"Timesheet Information"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_CBI}`}
                    component={ManageCBInvoices}
                    pageTitle={"Consolidated Billing Invoice"}
                />
                <ProtectedRoute layout={AuthorizedLayout} exact path={`${TIMESHEET}:id/edit`} component={TimeSheet} pageTitle={"Timesheet"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/timesheets/submitted`}
                    component={SubmittedTimesheets}
                    pageTitle={"Submitted Timesheets"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/timesheets/submitted/:id`}
                    component={SubmittedTimesheetDetails}
                    pageTitle={"Timesheet Details"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={UNDER_REVIEW}
                    component={UnderReview}
                    pageTitle={"Under Review Queue"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={VENDOR_INVOICE_UNDER_REVIEW}
                    component={VendorInvoiceExpenses}
                    pageTitle={"Vendor Invoices Expenses"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/timesheets/:tsWeekId/provider/:id/contract`}
                    component={ProviderContract}
                    pageTitle={"Provider Contract"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/timesheets/provider/workhistory`}
                    component={WorkHistory}
                    pageTitle={"Work History"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/timesheets/provider/:id/workhistory`}
                    component={WorkHistory}
                    pageTitle={"Work History"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${JOB_DETAIL}:subId`}
                    component={JobDetail}
                    pageTitle={"Job Details"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${ONBOARDING_DETAIL}:subId`}
                    component={OnBoardingDetail}
                    pageTitle={"Onboarding Details"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={TIMESHEET_REPORT}
                    component={TimeSheetReport}
                    pageTitle={"Timesheet Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={REQ_PERFORMANCE_REPORT}
                    component={ReqPerformanceReport}
                    pageTitle={"Requisition Performance Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CLIENT_STATEMENT_REPORT}
                    component={ClientStatementReport}
                    pageTitle={"Client Statement Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={FILLED_ASSIGNMENT_REPORT}
                    component={FilledAssignmentReport}
                    pageTitle={"Filled Assignment Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={VENDOR_PERFORMANCE_REPORT}
                    component={VendorPerformanceReport}
                    pageTitle={"Vendor Performance Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CANDIDATE_SUBMITTAL_REPORT}
                    component={CandidateSubmittalReport}
                    pageTitle={"Candidate Submittal Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EXPIRING_CREDENTIAL_REPORT}
                    component={ExpiringCredentialReport}
                    pageTitle={"Expiring Credential Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CLIENT_ACTIVITY_REPORT}
                    component={ClientActivityReport}
                    pageTitle={"Client Activity Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/cand/share/manage`}
                    component={CandidateShareWF}
                    pageTitle={"Candidate Share Requests"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/candidate/share/:id`}
                    component={ApproveCandidateShare}
                    pageTitle={"Candidate Share Requests"}
                />
                <ProtectedRoute layout={AuthorizedLayout} exact path={`/timesheets/week/:id/expense`} component={Expense} pageTitle={"Expenses"} />
                <ProtectedRoute layout={AuthorizedLayout} exact path={MANAGE_VENDOR_INVOICES} component={Invoices} pageTitle={"Vendor Invoicing"} />
                <ProtectedRoute layout={AuthorizedLayout} exact path={MANAGE_CBI_VENDOR_INVOICES} component={Invoices} pageTitle={"Vendor Invoicing"} />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${VIEW_VENDOR_INVOICE}:id`}
                    component={VendorInvoiceDetails}
                    pageTitle={"Vendor Invoice"}
                />  <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${VIEW_VENDOR_INVOICE}:id/:clientId`}
                    component={VendorInvoiceDetails}
                    pageTitle={"Vendor Invoice"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${RATE_CARD}:id/:tsWeekId`}
                    component={ClientRateCard}
                    pageTitle={"Client Rate Card"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${MANAGE_MY_TASKS}/:id/:taskGroup`}
                    component={MyTaskDetails}
                    pageTitle={"My Task Details"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/global`}
                    component={GlobalAdmin}
                    pageTitle={"Global Admin"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_EVENTS_LOGS}
                    component={ManageEventsLog}
                    pageTitle={"Events Logs"}
                />
                 <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/eventslogs/manage/:streamId`}
                    component={ManageEventsLog}
                    pageTitle={"Events Logs"}
                />
                  <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/eventslogs/view/:id`}
                    component={ViewEventsLog}
                    pageTitle={"View Events Logs"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/vendor`}
                    component={VendorAdmin}
                    pageTitle={"Vendor Admin"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/client`}
                    component={ClientAdmin}
                    pageTitle={"Client Admin"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CLIENT_SETTING}
                    component={ClientSetting}
                    pageTitle={"Client Settings"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={NOTIFICATION_SETTING}
                    component={NotificationSetting}
                    pageTitle={"Notification Settings"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={USER_NOTIFICATION_SETTING}
                    component={NotificationSetting}
                    pageTitle={"Notification Settings"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={GLOBAL_SETTING}
                    component={GlobalSetting}
                    pageTitle={"Global Settings"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={'/requisitions/batchRelease'}
                    component={BatchReleaseRequisition}
                    pageTitle={"Batch Release"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_ACTION_REASON}
                    component={GlobalActionReason}
                    pageTitle={"Manage Action Reason"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/globalactionreason/create`}
                    component={CreateGlobalActionReason}
                    pageTitle={"Create Action Reason"}
                />
                 <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/admin/globalactionreason/edit/:id`}
                    component={CreateGlobalActionReason}
                    pageTitle={"Edit Action Reason"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`/report/fc`}
                    component={SpendForecastReport}
                    pageTitle={"Spend Forecast Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${CANDIDATE_PRESENTATION_INFO}:subId`}
                    component={CandidatePresentationInfo}
                    pageTitle={"Edit Presentation Info"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={ASSOCIATE_EXPENSE_REPORT}
                    component={AssociateExpenseReport}
                    pageTitle={"Associate Expense Report"}
                />
                  <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={COMMUNICATION_CENTER}
                    component={MessageCenter}
                    pageTitle={"Communication Center"}
                />
                 <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_COMMUNICATION_CENTER}
                    component={CreateMessageCenter}
                    pageTitle={"Communication Center-Create"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EDIT_COMMUNICATION_CENTER}
                    component={CreateMessageCenter}
                    pageTitle={"Communication Center-Edit"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_SUPPORT_TICKETS}
                    component={ManageTicket}
                    pageTitle={"Customer Service Management"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_SUPPORT_TICKETS}
                    component={CreateTicket}
                    pageTitle={"Add New Ticket"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EDIT_SUPPORT_TICKETS}
                    component={CreateTicket}
                    pageTitle={"Edit Ticket"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={VIEW_SUPPORT_TICKETS}
                    component={ViewTicket}
                    pageTitle={"View Ticket"}
                />
                {/* <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={MANAGE_CONTENT_LIBRARY}
                    component={ManageContentLibrary}
                    pageTitle={"Manage Content Library"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CREATE_CONTENT_LIBRARY}
                    component={CreateContentLibrary}
                    pageTitle={"Create Content Library"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={EDIT_CONTENT_LIBRARY}
                    component={CreateContentLibrary}
                    pageTitle={"Edit Content Library"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={VIEW_CONTENT_LIBRARY}
                    component={ViewContentLibrary}
                    pageTitle={"View Content Library"}
                />
                 <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={USER_VIEW_CONTENT_LIBRARY}
                    component={UserViewContentLibrary}
                    pageTitle={"View Content Library"}
                /> */}
                <AppRoute
                    layout={GuestLayout}
                    exact
                    path="/accounts/tnc"
                    component={TnC}
                    pageTitle={"Terms And Conditions"} />
                <AppRoute
                    layout={auth.isAuthenticated() ? AuthorizedLayout : GuestLayout}
                    path="/404"
                    exact
                    component={NotFound}
                    pageTitle={"Not Found"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={CONFIRMATION_ASSIGNMENT_REPORT}
                    component={ConfirmationAssignmentReport}
                    pageTitle={"Confirmation Assignment Report"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EXTEND_ASSIGNMENT}:subId`}
                    component={CreateAssignmentExtension}
                    pageTitle={"Create Assignment Extension"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${EDIT_ASSIGNMENT_EXTENSION}`}
                    component={CreateAssignmentExtension}
                    pageTitle={"Edit Assignment Extension"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={`${VIEW_ASSIGNMENT_EXTENSION}`}
                    component={CreateAssignmentExtension}
                    pageTitle={"View Assignment Extension"}
                />
                <ProtectedRoute
                    layout={AuthorizedLayout}
                    exact
                    path={FINANCIAL_ACCRUAL_REPORT}
                    component={FinancialAccrualReport}
                    pageTitle={"Financial Accrual Report"}
                />
                 
                <AppRoute layout={auth.isAuthenticated() ? AuthorizedLayout : GuestLayout} path="*" component={NotFound} pageTitle={"Not Found"} />
            </Switch>
        );
    }
}
