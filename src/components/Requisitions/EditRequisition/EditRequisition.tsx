import * as React from "react";
import Collapsible from "react-collapsible";
import RequisitionDetails from "../CreateRequisition/RequisitionDetails";
import PositionDetails from "../CreateRequisition/PositionDetails";
import ApprovalsWFGrid from "../../Shared/ApprovalsWFGrid/ApprovalsWFGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { REQ_APPROVERS_WARNING_MSG, SAVED_ORDER_SUCCESS_MSG, SUBMIT_ORDER_SUCCESS_MSG, TS_APPROVERS_REQUIRED_WARNING_MSG, TS_APPROVERS_WARNING_MSG } from "../../Shared/AppMessages";
import { faCheckCircle, faChevronCircleDown, faChevronCircleUp, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import auth from "../../Auth";
import { ICreateRequisitionState, ICreateRequisitionProps } from "../CreateRequisition/models/ICreateRequisitionState";
import axios from "axios";
import { history, successToastr, errorToastr, infoToastr, warningToastr, toLocalDateTime, clientSettingData } from "../../../HelperMethods";
import { Form, Formik } from "formik";
import { requisitionValidation, validate } from "../CreateRequisition/validations/validation";
import { Prompt } from "react-router";
import { Link } from "react-router-dom";
import "../../../assets/css/App.css";
import "../CreateRequisition/CreateRequisition.css";
import { FormatPhoneNumber } from "../../ReusableComponents";
import ErrorFocus from "../../Shared/ErrorFocus";
import _, { includes } from "lodash";
import { APP_HOME_URL } from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { EntityType, ReqStatus } from "../../Shared/AppConstants";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

const billRate = 100;

class EditRequisition extends React.Component<ICreateRequisitionProps, ICreateRequisitionState> {
    public reqChild: any;
    public positionChild: any;
    public reqApprovalChild: any;
    public tsApprovalChild: any;
    //   public { id } = this.props.match.params;
     initialState=  {
        reqId: this.props.match.params.id ? this.props.match.params.id : "",
        reqNumber: "",
        clientId: auth.getClient(),
        clientDivisionId: "",
        divisionLocationId: "",
        divLocId: "",
        purchaseOrder: "",
        clientContactNum: "",
        divisionContactId: "",
        reasonId: "",
        customerLocation: "",
        justification: "",
        status: "",
        reqPosition: {
            jobWf: { id: null, name: "Select" },
            jobCategory: { id: null, name: "Select" },
            jobPosition: { id: null, name: "Select" },
            hiringManager: { id: null, name: "Select" },
            assignType: { id: null, name: "Select" },
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            shiftStartTime: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
            shiftEndTime: new Date(new Date(new Date().setHours(17)).setMinutes(30)),
            positionSkillMapping: [],
            billRate: billRate,
            positionDesc: "",
            noOfReqStaff: 1,
        },
        reqApproverDetails: {},
        timesheetApproverDetails: {},
        toggleAll: false,
        isDirty: false,
        toggelFirst: true,
        toggleFourth: false,
        toggleThird: false,
        toggleSecond: false,
        submitted: false,
        errorValidate: true,
    };
    constructor(props: ICreateRequisitionProps) {
      
        super(props);
      
        this.state = this.initialState;
        window.onbeforeunload = this.hasUsavedData.bind(this);
    }

    componentDidMount() {
        const { reqId } = this.state;
        if (reqId) {
            this.getReqDetails(reqId);
        }
        else {
            this.setState({ status: ReqStatus.DRAFT });
        }
        this.getClientSetting(this.state.clientId);
    }
    
    componentDidUpdate(nextProps){
        if(this.props.location.key!=nextProps.location.key){
            this.setState(this.initialState)
            const { reqId } = this.state;
            if (reqId) {
                this.getReqDetails(reqId);
            }
            else {
                this.setState({ status: ReqStatus.DRAFT });
            }
        }
    }
    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    handleChange = (e) => {
        let change = { isDirty: true };
        change[e.target.name] = e.target.value;

        this.setState(change);
    };

    handleObjChange = (change) => {
        var changeCopy = { ...change };
        if (change.hasOwnProperty("reqPosition")) {
            const { reqPosition } = this.state;
            change.reqPosition = { ...reqPosition, ...change.reqPosition };
        }
        if (change.hasOwnProperty("reqPosition") && change.reqPosition && !change.reqPosition.reqPositionId) {
            change["isDirty"] = true;
        }
        this.setState(change, () => {
            this.getApprovers(changeCopy, EntityType.REQUISITION);
            this.getApprovers(changeCopy, EntityType.TIMESHEET);
        });


    };

    getApprovers(change, entityType) {
        // req status draft and when approvers are not generated against entity
        if (this.state.status==ReqStatus.DRAFT && ((entityType==EntityType.REQUISITION && !this.state.reqApproverDetails.entityId) || (entityType==EntityType.TIMESHEET && !this.state.timesheetApproverDetails.entityId)))
            if (change.hasOwnProperty('clientDivisionId') || change.hasOwnProperty('divisionLocationId') ||
                (change.hasOwnProperty('reqPosition') && change.reqPosition.jobPosition && !change.reqPosition.startDate)) {
                const { clientId, clientDivisionId, divisionLocationId, reqPosition } = this.state;
                if (clientId && clientDivisionId && divisionLocationId && reqPosition.jobPosition && reqPosition.jobPosition.id) {
                    if (entityType==EntityType.REQUISITION) {
                        this.reqApprovalChild.getApproverDetailsByClient(clientId, EntityType.REQUISITION,
                            clientDivisionId, divisionLocationId, reqPosition.jobPosition.id);
                    }
                    if (entityType==EntityType.TIMESHEET) {
                        this.tsApprovalChild.getApproverDetailsByClient(clientId, EntityType.TIMESHEET,
                            clientDivisionId, divisionLocationId, reqPosition.jobPosition.id);
                    }
                }
            }
    }

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    };

    handlePositionChange = (e) => {
        let { name, value, type } = e.target;
        const { reqPosition } = this.state;
        if (type=="radio") {
            reqPosition[name] = value=="true" ? true : false;
        } else {
            reqPosition[name] = type =="checkbox" ? e.target.checked : value;
        }
        this.setState({ reqPosition: reqPosition, isDirty: true });
    };

    handleTimesheetApproversChange = (data, isTsApproverUpdated?) => {
        this.setState({ timesheetApproverDetails: data });
        if (isTsApproverUpdated==true){
            this.setState({ isApproversUpdated: true });
        }
    };

    saveRequisition(isSubmit: boolean) {
        if (this.checkValidations(isSubmit)) {
            this.setState({ isDirty: false });
            let data = JSON.parse(JSON.stringify(this.state));
            data.reqPosition.startDate = toLocalDateTime(data.reqPosition.startDate);
            data.reqPosition.endDate = toLocalDateTime(data.reqPosition.endDate);
            data.reqPosition.shiftStartTime = toLocalDateTime(data.reqPosition.shiftStartTime);
            data.reqPosition.shiftEndTime = toLocalDateTime(data.reqPosition.shiftEndTime);
            data["isSubmit"] = isSubmit;
            data.clientContactNum = data.clientContactNum ? data.clientContactNum.replace(/\D+/g, "") : "";
            const successMsg = isSubmit ? SUBMIT_ORDER_SUCCESS_MSG : SAVED_ORDER_SUCCESS_MSG;
            //let httpVerb = data.reqId ? "put" : "post";
            axios.patch("/api/requisitions", JSON.stringify(data)).then((res) => {
                successToastr(successMsg);
                if (auth.hasPermissionV2(AppPermissions.REQ_VIEW)) {
                    history.push("/requisitions/manage");
                } else {
                    history.push(APP_HOME_URL);
                }
            });
        }
    }

    checkValidations(isSubmit) {
        if (this.state.reqApproverDetails.hasOwnProperty("wfApprovalLevel")) {
            let hasUnsavedChanges = this.state.reqApproverDetails.wfApprovalLevel.some((x) => x.inEdit==true);
            if (hasUnsavedChanges) {
                warningToastr(REQ_APPROVERS_WARNING_MSG);
                return false;
            }
        }
        if (this.state.timesheetApproverDetails.hasOwnProperty("wfApprovalLevel")) {
            let hasUnsavedChanges = this.state.timesheetApproverDetails.wfApprovalLevel.some((x) => x.inEdit==true);
            if (hasUnsavedChanges) {
                warningToastr(TS_APPROVERS_WARNING_MSG);
                return false;
            }
            let hasAtleasetOneLevel = this.state.timesheetApproverDetails.wfApprovalLevel.length > 0;
            if (!hasAtleasetOneLevel && (isSubmit || this.state.status !=ReqStatus.DRAFT)) {
                warningToastr(TS_APPROVERS_REQUIRED_WARNING_MSG);
                return false;
            }
        }
        return true;
    }

    getReqDetails(reqId: string) {
        axios.get(`api/requisitions/${reqId}`).then((res) => {
            const { data } = res;
            this.setState({
                reqId: data.reqId,
                reqNumber: data.reqNumber,
                // clientId: data.client.id,
                clientDivisionId: data.clientDivision.id,
                divisionLocationId: data.divisionLocation.id,
                divLocId: data.divisionLocation.id,
                purchaseOrder: data.purchaseOrder,
                clientContactNum: FormatPhoneNumber(data.clientContactNum),
                divisionContactId: data.divisionContactId,
                reasonId: (data.reason && data.reason.id) || null,
                customerLocation: data.customerLocation,
                justification: data.justification,
                additionalDetails: data.additionalDetails,
                departmentId: data.departmentId,
                status: data.status,
            });
            this.reqChild.getLocations(data.clientDivisionId);

            if(data.clientDivision.city || data.clientDivision.state){
                this.reqChild.updateLocationInfo(data.clientDivision);
            }else{
                this.reqChild.updateLocationInfo(data.divisionLocation);
            }
        });
    }

    hasUsavedData() {
        if (!this.state.isDirty) {
            window.onbeforeunload = null;
        } else {
            return "";
        }
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggelFirst: true,
            toggleFourth: true,
            toggleThird: true,
            toggleSecond: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggelFirst: false,
            toggleFourth: false,
            toggleThird: false,
            toggleSecond: false,
        });
    };

    getClientSetting = (id) => {
        this.setState({ showLoader: true })
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };

    handleChangePurchaseOrder = (value) => {
        this.setState({ purchaseOrder: value })
    }

    render() {
        const {
            reqId,
            clientId,
            clientDivisionId,
            divisionLocationId,
            divLocId,
            purchaseOrder,
            clientContactNum,
            divisionContactId,
            reasonId,
            customerLocation,
            justification,
            status,
            reqPosition,
            toggleAll,
            toggelFirst,
            toggleSecond,
            toggleThird,
            toggleFourth,
            additionalDetails,
            isEnableDepartment,
            departmentId
        } = this.state;
        const reqDetails = {
            reqId,
            clientId,
            clientDivisionId,
            divisionLocationId,
            divLocId,
            purchaseOrder,
            clientContactNum,
            divisionContactId,
            reasonId,
            customerLocation,
            justification,
            additionalDetails,
            isEnableDepartment,
            departmentId        
        };
        reqPosition.reqId = reqId;
        const reqTriggerName = (
            <span>
                Requisition Details
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status : <span className="font-weight-bold">{status}</span>
                </span>
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3" key={this.props.location.key}>
                <Prompt
                    when={this.state.isDirty}
                    message={(location) => `Changes you made may not be saved.`}
                />
                <div className="col-12 p-0 shadow pt-1 pb-1">
                    <div className="col-12 ml-0 mr-0">
                        <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                            <div className="col-2 col-md-4 fonFifteen paddingLeftandRight">
                                <div className="d-none d-md-block">
                                    {/* {reqId ? "Edit" : "Create"} Requisition */}
                                    <BreadCrumbs globalData={{requisitionId:this.state.reqId}}></BreadCrumbs>
                                </div>
                            </div>
                            <div className="col-10 col-md-8 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end">
                                Req# : {this.state.reqNumber ? this.state.reqNumber : "NA"}
                                {(toggleFourth && toggleSecond && toggelFirst && toggleThird) ||
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
                    <div className="row">
                        <div className="col-11 pr-0">
                            <div className="d-block d-md-none text-right">
                                Status : <span className="font-weight-bold"> {status} </span>
                            </div>
                        </div>
                    </div>

                    <Formik
                        validateOnMount={this.state.submitted}
                        initialValues={this.state}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={requisitionValidation}
                        validateOnBlur={false}
                        onSubmit={(fields) => this.saveRequisition(ReqStatus.DRAFT==this.state.status ? true : false)}
                        render={(formikProps) => (
                            <Form noValidate className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                                <Collapsible
                                    trigger={reqTriggerName}
                                    open={toggelFirst}
                                    accordionPosition="1"
                                    onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                    onTriggerClosing={() => this.setState({ toggelFirst: false })}
                                >
                                    {((reqId && clientDivisionId) || !reqId) &&
                                    <RequisitionDetails
                                        ref={(instance) => {
                                            this.reqChild = instance;
                                        }}
                                        data={reqDetails}
                                        clientId={clientId}
                                        handleChange={this.handleChange}
                                        handleObjChange={this.handleObjChange}
                                        handleDropdownChange={this.handleDropdownChange}
                                        formikProps={formikProps}
                                        disableReg={(this.state.status==ReqStatus.RELEASED 
                                                    || this.state.status==ReqStatus.CANDIDATEUNDERREVIEW 
                                                    || this.state.status==ReqStatus.FILLED 
                                                    || this.state.status==ReqStatus.CLOSED)}
                                        handleChangePurchaseOrder={this.handleChangePurchaseOrder}
                                    />}
                                </Collapsible>

                                <div>
                                    <Collapsible
                                        lazyRender={reqId ? false : true}
                                        trigger="Position Details"
                                        open={toggleSecond}
                                        onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                        onTriggerClosing={() => this.setState({ toggleSecond: false })}
                                    >
                                        <PositionDetails
                                            data={reqPosition}
                                            clientId={clientId}
                                            handlePositionChange={this.handlePositionChange}
                                            handleObjChange={this.handleObjChange}
                                            formikProps={formikProps}
                                            disableReg={(this.state.status==ReqStatus.RELEASED 
                                                || this.state.status==ReqStatus.CANDIDATEUNDERREVIEW 
                                                || this.state.status==ReqStatus.FILLED 
                                                || this.state.status==ReqStatus.CLOSED)}
                                        />
                                    </Collapsible>
                                    <Collapsible
                                        lazyRender={true}
                                        trigger="Requisition Approvers"
                                        open={toggleThird}
                                        onTriggerOpening={() => this.setState({ toggleThird: true })}
                                        onTriggerClosing={() => this.setState({ toggleThird: false })}
                                    >
                                        {this.state.status &&
                                            <ApprovalsWFGrid
                                                entityId={reqId}
                                                entityType="Requisition"
                                                clientId={clientId}
                                                permission={AppPermissions.REQ_APPROVE}
                                                canEdit={false}
                                            />}
                                    </Collapsible>
                                    <Collapsible
                                        lazyRender={false}
                                        trigger="Timesheet Approvers"
                                        open={toggleFourth}
                                        onTriggerOpening={() => this.setState({ toggleFourth: true })}
                                        onTriggerClosing={() => this.setState({ toggleFourth: false })}
                                    >
                                        {this.state.status &&
                                            <ApprovalsWFGrid
                                                ref={(instance) => {
                                                    this.tsApprovalChild = instance;
                                                }}
                                                entityId={reqId}
                                                entityType="Timesheet"
                                                clientId={clientId}
                                                permission={AppPermissions.TS_APPROVE}
                                                canEdit={true}
                                                key="Timesheet"
                                                handleApproversChange={this.handleTimesheetApproversChange}
                                            />}
                                    </Collapsible>
                                </div>

                                <div className="row mb-2 mb-lg-4  ml-sm-0 mr-sm-0">
                                    <div className="col-12 mt-5 text-sm-center text-center font-regular">
                                        <button type="button" onClick={() => history.goBack()} className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                                Close
                                        </button>
                                        {auth.hasPermissionV2(AppPermissions.REQ_UPDATE) && (
                                            <button
                                                type="submit"
                                                disabled={!clientId}
                                                className="btn button button-bg shadow mb-2 mb-xl-0"
                                                onClick={() => {
                                                    if (formikProps.errors) {
                                                        this.setState({
                                                            toggelFirst: true,
                                                            toggleSecond: true,
                                                        });
                                                    }
                                                    this.setState({ submitted: true, errorValidate: true }, () =>
                                                        setTimeout(() => this.setState({ errorValidate: false }), 50)
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Update
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {this.state.errorValidate ? <ErrorFocus /> : null}
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default EditRequisition;
