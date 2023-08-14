import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faChevronCircleUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { history, localDateTime, successToastr, warningToastr } from "../../../../HelperMethods";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";
import ExtensionInformation from "./ExtensionInformation";
import BillRateAndExpenses from "../../../Candidates/BillRateAndExpenses/BillRateAndExpenses";
import auth from "../../../Auth";
import ProviderContracts from "../ProviderContracts/ProviderContracts";
import { APPROVE_ASSIGNMENT_EXTENSION_MSG, APPROVE_EXTENSION_CONTRACT_VALIDATION_MSG, ASSIGNMENT_EXTENSION_REQUEST_SUCCESS_MSG, ASSIGNMENT_EXTENSION_UPDATED_SUCCESS_MSG, DUPLICATE_CONTRACT_WARNING_MSG, EXTEND_ASSIGNMENT_MSG, EXTENSION_CONTRACT_WARNING_MSG, EXTENSION_TIME_CONTRACT_VALIDATION_MSG, INFO_MSG_FOR_BILLRATES_DATE_UPDATE, REJECT_ASSIGNMENT_EXTENSION_MSG } from "../../../Shared/AppMessages";
import FormActions from "../../../Shared/Workflow/FormActions";
import { JOB_DETAIL } from "../../../Shared/ApiUrls";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { BillRateStatus, CandidateWorkflow, ExtensionActionStatuses, ExtensionStatuses, WfStatus } from "../../../Shared/AppConstants";
import AlertBox from "../../../Shared/AlertBox";
import RejectModal from "../../../Shared/RejectModal";
import ConfirmationLetter from "../../../Candidates/MakeAnOffer/OfferInformation/ConfirmationLetter";
import SkeletonWidget from "../../../Shared/Skeleton";

export interface CreateAssignmentExtensionProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateAssignmentExtensionState {
    candSubmissionId: string;
    candSubExtId?: string;
    clientId: string;
    reqNumber: string;
    candSubDetails: any;
    jobStartDate?: any;
    jobEndDate?: any;
    positionId?: any;
    jobPositionId?: string;
    locationId?: any;
    divisionId?: string;
    candidateId?: string;
    candidateName?: string;
    vendor?: any;
    status?: string;
    statusIntId?: number;
    extStartDate?: any;
    extEndDate?: any;
    specialTerms?: any;
    extStatus?: string;
    extensionStatus?: string;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    showRequestForExtensionModal?: boolean;
    showExtendOfferModal?: boolean;
    showRejectModal?: boolean;
    isView: boolean;
    openAlert?: boolean;
    showAlert: boolean;
}

class CreateAssignmentExtension extends React.Component<CreateAssignmentExtensionProps, CreateAssignmentExtensionState> {
    public extensionChild: any;
    public billRateChild: any;
    public extensionContracts: any;
    public confirmationLetter;
    statusId: any;
    eventName: any;
    actionId: any;
    action: any;
    existingExtStartDate: any;
    existingExtEndDate: any;
    candDocumentsId: any;
    jobEndDate: any;
    alertMessage: string;
    constructor(props: CreateAssignmentExtensionProps) {
        super(props);
        this.state = {
            candSubmissionId: "",
            reqNumber: "",
            clientId: auth.getClient(),
            candSubDetails: {},
            jobStartDate: null,
            jobEndDate: null,
            extStartDate: null,
            extEndDate: null,
            extStatus: WfStatus.ASSIGNMENTSTARTED,
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggleFirst: true,
            toggleSecond: true,
            isView: false,
            showLoader: true,
            showAlert: false,
        };

        this.state = this.state;
    }

    componentDidMount() {
        const { subId } = this.props.match.params;
        const { candSubExtId } = this.props.match.params;
        const isView = window.location.href.search('edit') ==-1 ? true : false;
        this.setState({ candSubmissionId: subId, candSubExtId: candSubExtId, isView: isView });
        if (candSubExtId) {
            this.getExtensionDetails(subId, candSubExtId)
        } else {
            this.getExtensions(subId);
            this.getCandSubPresentationInfo(subId);
        }
    }

    getExtensions = (candSubmissionId) => {
        let queryStr = `$filter=status eq '${ExtensionStatuses.APPROVED}'`;
        this.setState({ showLoader: true });
        axios.get(`api/candidates/${candSubmissionId}/assignmentextensions?${queryStr}`)
            .then((res) => {
                if (res.data.length > 0) {
                    this.existingExtStartDate = res.data[0].extEndDate !=null && res.data[0].extEndDate !=undefined && res.data[0].extEndDate !=""
                        ? new Date(new Date(res.data[0].extEndDate).setDate(new Date(res.data[0].extEndDate).getDate() + 1))
                        : new Date(new Date(res.data[0].extEndDate).setDate(new Date(res.data[0].extEndDate).getDate() + 1));
                    this.jobEndDate = res.data[0].extEndDate !=null && res.data[0].extEndDate !=undefined && res.data[0].extEndDate !=""
                        ? (res.data[0].extEndDate)
                        : res.data[0].extEndDate;
                }
                this.getCandidateSubmissionDetails(candSubmissionId, this.existingExtStartDate, this.jobEndDate);
            });
    };

    async getCandidateSubmissionDetails(candSubmissionId, existingExtStartDate?, jobEndDate?) {
        this.setState({ showLoader: true });
        await axios
            .get(`api/candidates/workflow/${candSubmissionId}`)
            .then((res) => {
                this.setState({
                    candSubDetails: res.data,
                    reqNumber: res.data.reqNumber,
                    locationId: res.data.locationId,
                    positionId: res.data.positionId,
                    jobPositionId: res.data.jobPositionId,
                    divisionId: res.data.divisionId,
                    status: res.data.status,
                    statusIntId: res.data.statusIntId,
                    candidateId: res.data.candidateId,
                    candidateName: res.data.candidateName,
                    vendor: res.data.vendor,
                    jobStartDate:
                        res.data.startDate !=null &&
                            res.data.startDate !=undefined &&
                            res.data.startDate !=""
                            ? (res.data.startDate)
                            : res.data.startDate,
                    jobEndDate:
                        jobEndDate !=null && jobEndDate !=undefined && jobEndDate !=""
                            ? jobEndDate
                            : res.data.endDate !=null &&
                                res.data.endDate !=undefined &&
                                res.data.endDate !=""
                                ? (res.data.endDate)
                                : res.data.endDate,
                    extStartDate:
                        existingExtStartDate !=null && existingExtStartDate !=undefined && existingExtStartDate !=""
                            ? existingExtStartDate
                            : res.data.endDate !=null &&
                                res.data.endDate !=undefined &&
                                res.data.endDate !=""
                                ? new Date(new Date(res.data.endDate).setDate(new Date(res.data.endDate).getDate() + 1))
                                : new Date(new Date(res.data.endDate).setDate(new Date(res.data.endDate).getDate() + 1)),
                    showLoader: false
                }, () => {
                    if (document.getElementsByName('extStartDate')) {
                        document.getElementsByName('extStartDate')[0]['disabled'] = true;
                        document.getElementsByName('extEndDate')[0]['disabled'] = true;
                    }
                });
            });
    }

    getCandSubPresentationInfo = (candSubmissionId: string) => {
        this.setState({ showLoader: true });
        axios.get(`api/candidates/workflow/${candSubmissionId}/presentationinfo`)
            .then((result) => {
                if (result !=null && result.data !="") {
                    this.setState({
                        specialTerms: result.data.specialTerms
                    });
                }
            });
    };

    getExtensionDetails = (candSubmissionId, candSubExtId) => {
        let queryStr = `$filter=candSubExtId eq ${candSubExtId}`;
        this.setState({ showLoader: true });
        axios.get(`api/candidates/${candSubmissionId}/assignmentextensions?${queryStr}`)
            .then((res) => {
                this.setState({
                    extEndDate:
                        res.data[0].extEndDate !=null &&
                            res.data[0].extEndDate !=undefined &&
                            res.data[0].extEndDate !=""
                            ? (res.data[0].extEndDate)
                            : res.data[0].extEndDate,
                    extStatus: res.data[0].status,
                    extensionStatus: res.data[0].status,
                    specialTerms: res.data[0].specialTerms
                });
                this.existingExtStartDate = res.data[0].extStartDate !=null && res.data[0].extStartDate !=undefined && res.data[0].extStartDate !=""
                    ? (res.data[0].extStartDate)
                    : res.data[0].extStartDate;
                this.jobEndDate = res.data[0].extStartDate !=null && res.data[0].extStartDate !=undefined && res.data[0].extStartDate !=""
                    ? new Date(new Date(res.data[0].extStartDate).setDate(new Date(res.data[0].extStartDate).getDate() - 1))
                    : new Date(new Date(res.data[0].extStartDate).setDate(new Date(res.data[0].extStartDate).getDate() - 1));

                if (res.data[0].status != ExtensionStatuses.PENDINGAPPROVAL) {
                    this.setState({ specialTerms: null });
                    this.getCandSubPresentationInfo(candSubmissionId);
                }
                this.getCandidateSubmissionDetails(candSubmissionId, this.existingExtStartDate, this.jobEndDate);
            });
    };

    handleChange = (e) => {
        let change = { isDirty: true };
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    saveExtension(props) {
        this.setState({ submitted: true, showRequestForExtensionModal: false })
        let isValid = this.checkValidations();
        if (isValid) {
            this.setState({ submitted: true })
            let data = {
                candSubmissionId: this.state.candSubmissionId,
                extStartDate: localDateTime(this.state.extStartDate),
                extEndDate: localDateTime(this.state.extEndDate),
                specialTerms: this.state.specialTerms,
                extensionContracts: this.extensionContracts.getContractData().data,
                statusId: this.statusId,
                eventName: this.eventName,
                actionId: this.actionId,
                ...props
            };

            if (this.state.candSubmissionId) {
                const { candSubmissionId } = this.state;
                if ((this.state.extStartDate !=undefined && this.state.extStartDate !=null) && (this.state.extEndDate !=undefined && this.state.extEndDate !=null)) {
                    axios.post(`api/candidates/assignmentextendrequest`, JSON.stringify(data)).then((res) => {
                        successToastr(ASSIGNMENT_EXTENSION_REQUEST_SUCCESS_MSG);
                        history.push(`${JOB_DETAIL}${candSubmissionId}`);
                    });
                }
            }
        }
    }

    updateExtension(candSubExtId, props?) {
        this.setState({ submitted: true, showExtendOfferModal: false, showRejectModal: false, showLoader: true })
        let data = {
            candSubmissionId: this.state.candSubmissionId,
            candSubExtId: candSubExtId,
            specialTerms: this.state.specialTerms,
            statusId: this.statusId,
            eventName: this.eventName,
            actionId: this.actionId,
            action: this.action,
            ...props
        };

        if (this.state.candSubmissionId && candSubExtId) {
            const { candSubmissionId } = this.state;
            if (this.action==ExtensionActionStatuses.EXTENDOFFER || this.action==ExtensionActionStatuses.REJECT) {
                if ((this.state.extStartDate !=undefined && this.state.extStartDate !=null) && (this.state.extEndDate !=undefined && this.state.extEndDate !=null)) {
                    axios.patch(`api/candidates/assignmentextension/${candSubExtId}`, JSON.stringify(data)).then((res) => {
                        if (this.action==ExtensionActionStatuses.EXTENDOFFER) {
                            this.getDocPortfolio(this.state.candSubmissionId)
                            successToastr(ASSIGNMENT_EXTENSION_UPDATED_SUCCESS_MSG);
                            this.setState({ showLoader: false })
                        } else {
                            successToastr(ASSIGNMENT_EXTENSION_UPDATED_SUCCESS_MSG);
                            history.push(`${JOB_DETAIL}${candSubmissionId}`);
                        }
                    }).catch(error => {
                        this.setState({ showLoader: false });
                    });
                }
            } else {
                if ((this.state.extStartDate !=undefined && this.state.extStartDate !=null) && (this.state.extEndDate !=undefined && this.state.extEndDate !=null)) {
                    axios.post(`api/candidates/assignmentextension/${candSubExtId}`, JSON.stringify(data)).then((res) => {
                        successToastr(ASSIGNMENT_EXTENSION_UPDATED_SUCCESS_MSG);
                        history.push(`${JOB_DETAIL}${candSubmissionId}`);
                    }).catch(error => {
                        this.setState({ showLoader: false });
                    });
                }
            }
        }
    }

    getDocPortfolio = (candSubmissionId) => {
        var submission = candSubmissionId;
        var queryParams = '';
        if (submission !="" && submission !=null && submission !=undefined) {
            queryParams = "?candSubmissionId=" + candSubmissionId + "&$filter=docType eq 'Confirmation Letter' and status eq 'Pending Signature'"
        }
        axios.get(`/api/candidates/${this.state.candidateId}/documents` + queryParams).then((res: any) => {
            if (res) {
                this.candDocumentsId = res.data[0].candDocumentsId
                this.confirmationLetter.getDocumentPortfolio(this.candDocumentsId)
            }
        });
    }

    checkValidations() {
        let extensionContracts = this.extensionContracts.getContractData();
        if (extensionContracts.data.length <= 0) {
            warningToastr(EXTENSION_TIME_CONTRACT_VALIDATION_MSG);
            return false;
        }

        if (extensionContracts.hasError) {
            warningToastr(EXTENSION_CONTRACT_WARNING_MSG);
            return false;
        }

        if (extensionContracts.hasDuplicateRecords) {
            warningToastr(DUPLICATE_CONTRACT_WARNING_MSG);
            return false;
        }

        if (extensionContracts.hasNoTimeCategoryData) {
            warningToastr(EXTENSION_TIME_CONTRACT_VALIDATION_MSG);
            return false;
        }

        if (this.state.extEndDate==undefined || this.state.extEndDate==null) {
            this.setState({ submitted: true });
            return false;
        }

        return true;
    }

    getProviderContractCount = async () => {
        let pendingContractCount;

        let queryParams = `candSubId eq ${this.state.candSubmissionId} and candSubExtId eq ${this.state.candSubExtId}`;

        await axios.get(`api/candidates/billrate?$filter=${queryParams}`).then((res) => {
            pendingContractCount = res.data.filter((i) => i.status==BillRateStatus.PENDINGAPPROVAL).length;
        });

        return pendingContractCount;
    };

    handleActionClick = async (action, nextStateId?, eventName?, actionId?) => {
        this.statusId = nextStateId;
        this.eventName = eventName;
        this.actionId = actionId;
        this.action = action;

        if (action==ExtensionActionStatuses.REQUESTFOREXTENSION) {
            let isValid = this.checkValidations();
            if (!isValid) {
                return false;
            }
        }

        if (action==ExtensionActionStatuses.SAVE) {
            this.updateExtension(this.state.candSubExtId);
        }

        if (action==ExtensionActionStatuses.EXTENDOFFER) {
            let pendingContractCount = await this.getProviderContractCount();
            if (pendingContractCount > 0) {
                this.alertMessage = APPROVE_EXTENSION_CONTRACT_VALIDATION_MSG;
                this.setState({ openAlert: true });
                return false;
            }
        }

        let change = {};
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
    };

    handleConfirmationStatusAlert = (responseCode) => {
        if (responseCode=="CSU"){
            this.setState({showAlert: true});
        }
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false
        });
    };

    render() {
        const {
            candSubmissionId,
            candSubExtId,
            candSubDetails,
            jobStartDate,
            jobEndDate,
            clientId,
            locationId,
            positionId,
            jobPositionId,
            divisionId,
            status,
            statusIntId,
            extStartDate,
            extEndDate,
            extStatus,
            specialTerms,
            isView,
            toggleAll,
            toggleFirst,
            toggleSecond,
            submitted,
            showLoader
        } = this.state;

        const extensionInfo = {
            candSubmissionId,
            candSubExtId,
            jobStartDate,
            jobEndDate,
            status,
            statusIntId,
            extStartDate,
            extEndDate,
            extStatus,
            specialTerms,
            isView,
            submitted,
            showLoader
        };

        const extendAssignmentTriggerName = (
            <span>
                Extension Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status : <span className="font-weight-bold">{this.state.extensionStatus ? this.state.extensionStatus : "Draft"}</span>
                </span>
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                <BreadCrumbs globalData={{ candSubmissionId: candSubmissionId, candSubExtId: candSubExtId }}></BreadCrumbs>
                            </div>
                        </div>

                        <div className="col-2 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
                            {(toggleFirst && toggleSecond) ||
                                toggleAll ? (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleUp}
                                    onClick={
                                        toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            ) : (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleDown}
                                    onClick={
                                        toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    {showLoader && <SkeletonWidget />}
                    {!showLoader && (
                        <Collapsible
                            trigger={extendAssignmentTriggerName}
                            open={toggleFirst}
                            accordionPosition="1"
                            onTriggerOpening={() => this.setState({ toggleFirst: true })}
                            onTriggerClosing={() => this.setState({ toggleFirst: false })}
                        >
                            <ExtensionInformation
                                ref={(instance) => {
                                    this.extensionChild = instance;
                                }}
                                data={extensionInfo}
                                handleChange={this.handleChange}
                            />
                        </Collapsible>
                    )}
                    {!showLoader &&
                        candSubmissionId &&
                        candSubDetails &&
                        clientId &&
                        locationId &&
                        positionId &&
                        jobPositionId && (
                            <div>
                                <Collapsible
                                    trigger="Bill Rates and Expenses"
                                    open={toggleSecond}
                                    onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                    onTriggerClosing={() => this.setState({ toggleSecond: false })}
                                >
                                    {(this.state.candSubExtId==null || this.state.candSubExtId==undefined) && this.state.candSubmissionId ? (
                                        <ProviderContracts
                                            ref={(instance) => {
                                                this.extensionContracts = instance;
                                            }}
                                            candSubmissionId={candSubmissionId}
                                            canEdit={true}
                                            clientId={clientId}
                                            positionId={jobPositionId}
                                            locationId={locationId}
                                            divisionId={divisionId}
                                            key="Contracts"
                                        />
                                    ) :
                                        <BillRateAndExpenses
                                            ref={(instance) => {
                                                this.billRateChild = instance;
                                            }}
                                            candSubmissionId={candSubmissionId}
                                            candSubExtId={candSubExtId}
                                            candidateName={this.state.candidateName}
                                            positionId={jobPositionId}
                                            locationId={locationId}
                                            divisionId={divisionId}
                                            candidateSubStatus={status}
                                            handleDisable={() => { }}
                                            handleEnable={() => { }}
                                            candidateSubStatusIntId={statusIntId}
                                            AssignmentStartDate={extStartDate}
                                            AssignmentEndDate={extEndDate}
                                            handleAlert={this.handleConfirmationStatusAlert}
                                        />
                                    }
                                </Collapsible>
                            </div>
                        )}
                </div>
                {!showLoader && this.state.extStatus && this.state.candSubmissionId && (
                    <FormActions
                        wfCode={CandidateWorkflow.ASSIGNMENTEXTENSION}
                        currentState={this.state.extStatus}
                        handleClick={this.handleActionClick}
                        handleClose={() => history.goBack()}
                    />
                )}
                {this.state.showRequestForExtensionModal && this.actionId && (
                    <RejectModal
                        action={this.action}
                        actionId={this.actionId}
                        message={EXTEND_ASSIGNMENT_MSG()}
                        showModal={this.state.showRequestForExtensionModal}
                        handleYes={(data) => this.saveExtension(data)}
                        handleNo={() => {
                            this.setState({ showRequestForExtensionModal: false });
                        }}
                        isRequest={true}
                    />
                )}
                {this.state.showExtendOfferModal && this.actionId && (
                    <ConfirmationModal
                        message={APPROVE_ASSIGNMENT_EXTENSION_MSG()}
                        showModal={this.state.showExtendOfferModal}
                        handleYes={(e) => this.updateExtension(this.state.candSubExtId)}
                        handleNo={() => {
                            this.setState({ showExtendOfferModal: false });
                        }}
                    />
                )}
                {this.state.showRejectModal && this.actionId && (
                    <RejectModal
                        action={this.action}
                        actionId={this.actionId}
                        message={REJECT_ASSIGNMENT_EXTENSION_MSG()}
                        showModal={this.state.showRejectModal}
                        handleYes={(data) => this.updateExtension(this.state.candSubExtId, data)}
                        handleNo={() => {
                            this.setState({ showRejectModal: false });
                        }}
                    />
                )}
                {this.state.openAlert && (
                    <AlertBox
                        handleNo={() => {
                            this.setState({ openAlert: false });
                        }}
                        message={this.alertMessage}
                        showModal={this.state.openAlert}
                    ></AlertBox>
                )}
                {this.state.showAlert && (
                    <AlertBox
                        handleNo={() => {
                            this.setState({ showAlert: false });
                        }}
                        message={INFO_MSG_FOR_BILLRATES_DATE_UPDATE()}
                        showModal={this.state.showAlert}
                    ></AlertBox>
                )}
                <ConfirmationLetter
                    ref={(instance) => {
                        this.confirmationLetter = instance;
                    }}
                    candSubmissionId={this.state.candSubmissionId}
                    candidateId={this.state.candidateId}
                    vendor={this.state.vendor}
                    updateCandWf={false}
                    reqNumber={this.state.reqNumber}
                    jobDetailPage={true}
                    redirectTo={(`${JOB_DETAIL}${this.state.candSubmissionId}`)}
                    isRedirectTo={true}
                />
            </div>
        );
    }

}

export default CreateAssignmentExtension;