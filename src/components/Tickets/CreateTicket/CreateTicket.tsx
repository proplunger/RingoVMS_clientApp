import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TicketInformation from "./TicketInformation";
import ticketService from "../Services/DataService";
import { history, localDateTime, preventSubmitOnEnter, successToastr, warningToastr } from "../../../HelperMethods";
import { Form, Formik } from "formik";
import { ticketValidation } from "./validations/validation";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { Comment } from "../../Shared/Comment/Comment";
import Resolution from "./Resolution";
import TicketData from "./TicketData";
import { SERVICE_REQUEST_CREATED_SUCCESS_MSG, SERVICE_REQUEST_UPDATED_SUCCESS_MSG, SERVICE_REQUEST_WARNING_MSG_FOR_OWNER } from "../../Shared/AppMessages";
import Auth from "../../Auth";
import CommentHistoryView from "../../Shared/Comment/CommentHistoryView";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface CreateTicketProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateTicketState {
    ticketId?: string;
    ticketNumber: string;
    title?: string;
    clientId?: string;
    //vendorId?: string;
    selectedVendors: any;
    tktFunctionAreaId?: string;
    tktFunctionId?: string;
    tktQueueId?: string;
    description?: string;
    tktPriorityId?: string;
    tktRequestTypeId?: string;
    status?: string;
    tktStatusId?: string;
    assignedToId?: string;
    ownerId?: string;
    tktResolutionTypeId?: string;
    resDetails?: string;
    resDate?: Date;
    createdDate?: any;
    createdBy?: any;
    lastClosedDate?: any;
    lastClosedBy?: any;
    aging?: any;
    currentAssignedToName?: any;
    tktQueName?: any;
    openCommentBox?: boolean;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    toggleThird: boolean;
    toggleFourth: boolean;
    showCommentGrid?: boolean;
    oldOwnerId?: string;
}

class CreateTicket extends React.Component<CreateTicketProps, CreateTicketState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public ticketChild: any;
    public ticketResolution: any;
    public ticketData: any;
    constructor(props: CreateTicketProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            ticketId: id,
            ticketNumber: "",
            clientId: null,
            //vendorId: "",
            selectedVendors: [],
            tktFunctionAreaId: "",
            tktFunctionId: "",
            tktQueueId: "",
            tktPriorityId: "",
            tktRequestTypeId: "",
            tktStatusId: "",
            assignedToId: this.userObj.userId,
            ownerId: this.userObj.userId,
            tktResolutionTypeId: "",
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggleFirst: true,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
            showLoader: true,
            showCommentGrid: false,
        };
    }

    componentDidMount() {
        if (this.state.ticketId) {
            this.setState({ toggleSecond: true, toggleThird: true, toggleFourth: true });
            this.getTicketDetails(this.state.ticketId);

        } else {
            this.setState({ showLoader: false });
        }
    }

    handleChange = (e) => {
        let change = { isDirty: true };
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    handleObjChange = (change) => {
        change["isDirty"] = true;
        this.setState(change);
    };

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    };

    handleMultiselectChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.value;
        this.setState(change);
    };

    saveTicket(isSubmit: boolean) {
        let data = {
            ticketId: this.state.ticketId,
            title: this.state.title,
            clientId: this.state.clientId,
            //vendorId: this.state.vendorId,
            vendors: this.state.selectedVendors,
            tktFunctionAreaId: this.state.tktFunctionAreaId,
            tktFunctionId: this.state.tktFunctionId,
            tktQueueId: this.state.tktQueueId,
            description: this.state.description,
            tktPriorityId: this.state.tktPriorityId,
            tktRequestTypeId: this.state.tktRequestTypeId,
            assignedToId: this.state.assignedToId,
            ownerId: this.state.ownerId,
            tktStatusId: this.state.tktStatusId,
            tktResolutionTypeId: this.state.tktResolutionTypeId,
            resDetails: this.state.resDetails,
            resDate: null,
        };

        if (this.state.resDate !=null && this.state.resDate !=undefined) {
            data.resDate = localDateTime(this.state.resDate);
        }

        data["isSubmit"] = isSubmit;

            if (this.state.ticketId) {
                if(this.state.oldOwnerId !=null && this.state.oldOwnerId !=this.state.ownerId && 
                    this.userObj.userId !=this.state.oldOwnerId){
                    warningToastr(SERVICE_REQUEST_WARNING_MSG_FOR_OWNER);
                    return
                }

                ticketService.putTicket(data).then((res) => {
                    successToastr(SERVICE_REQUEST_UPDATED_SUCCESS_MSG);
                    history.goBack();
                });
            } else {
                ticketService.postTicket(data)
                    .then((response) => response)
                    .then((data) => {
                    this.ticketChild.uploadDocuments(data.data);
                    successToastr(SERVICE_REQUEST_CREATED_SUCCESS_MSG);
                    history.goBack();
                });
        }
    }

    getTicketDetails(ticketId: string) {
        ticketService.getTicketDetails(ticketId).then((res) => {
            const { data } = res;
            this.setState({
                ticketId: data.ticketId,
                ticketNumber: data.ticketNumber,
                title: data.title,
                description: data.ticketDesc,
                clientId: data.clientId,
                //vendorId: data.vendorId,
                selectedVendors: data.vendors,
                tktFunctionAreaId: data.tktFuncAreaId,
                tktFunctionId: data.tktFuncId,
                tktQueueId: data.tktQueId,
                tktPriorityId: data.tktPrioId,
                tktRequestTypeId: data.tktReqTypeId,
                tktStatusId: data.tktStatusId,
                status: data.status,
                assignedToId: data.currentAssignedTo,
                ownerId: data.ownerId,
                tktResolutionTypeId: data.tktResTypeId,
                resDetails: data.resDesc,
                resDate: data.resDate,
                createdDate: data.createdDate,
                createdBy: data.createdBy,
                lastClosedDate: data.lastClosedDate,
                lastClosedBy: data.lastClosedBy,
                aging: data.aging,
                currentAssignedToName: data.currentAssignedToName,
                tktQueName: data.tktQueName,
                showLoader: false,
                showCommentGrid: true,
                oldOwnerId: data.ownerId,
            });
            if (data.clientId) {
                this.ticketChild.getClientAssociatedVendor(data.clientId);
                //this.ticketChild.getUsers(data.clientId);
            }
            if (data.tktFuncAreaId) {
                this.ticketChild.getTktFunc(data.tktFuncAreaId);
            }
        });
    }
    
    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
            toggleThird: true,
            toggleFourth: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
        });
    };

    updateCommentGrid = () => {
        this.setState({ showCommentGrid: false });
        this.setState({ showCommentGrid: true  });
    };

    render() {
        const {
            ticketId,
            ticketNumber,
            title,
            description,
            clientId,
            //vendorId,
            selectedVendors,
            tktFunctionAreaId,
            tktFunctionId,
            tktQueueId,
            tktPriorityId,
            tktRequestTypeId,
            tktStatusId,
            assignedToId,
            ownerId,
            tktResolutionTypeId,
            resDetails,
            resDate,
            createdDate,
            createdBy,
            lastClosedDate,
            lastClosedBy,
            aging,
            tktQueName,
            currentAssignedToName,
            toggleAll,
            toggleFirst,
            toggleSecond,
            toggleThird,
            toggleFourth,
        } = this.state;
        const ticketInfo = {
            ticketId,
            ticketNumber,
            title,
            description,
            clientId,
            selectedVendors,
            tktFunctionAreaId,
            tktFunctionId,
            tktQueueId,
            tktPriorityId,
            tktRequestTypeId,
            tktStatusId,
            assignedToId,
            ownerId,
            createdDate,
            createdBy,
            aging,
            tktQue: tktQueName,
            currentAssignedTo: currentAssignedToName
        };
        const resInfo = {
            ticketId,
            tktResolutionTypeId,
            resDetails,
            resDate,
            lastClosedDate,
            lastClosedBy
        };
        // const ticketDataInfo = {
        //     createdDate,
        //     createdBy,
        //     lastClosedDate,
        //     lastClosedBy,
        //     aging
        // };
        const ticketTriggerName = (
            <span>
                Ticket Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status : {this.state.ticketId ? <span className="font-weight-bold">{this.state.status}</span> : "New"}
                </span>
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-9 col-md-9 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                {/* {this.state.ticketId ? "Edit" : "Add New"} Ticket */}
                                <BreadCrumbs globalData={{ticketId:ticketId}}></BreadCrumbs>
                             </div>
                        </div>

                        <div className="col-3 col-md-3 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
                        Ticket # : {(this.state.ticketId && this.state.ticketNumber) ? this.state.ticketNumber : "N/A"}
                            {(toggleFirst && toggleSecond && toggleThird && toggleFourth) ||
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

                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={ticketValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveTicket(true)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onKeyDown={preventSubmitOnEnter} onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={ticketTriggerName}
                                open={toggleFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                onTriggerClosing={() => this.setState({ toggleFirst: false })}
                            >
                                <TicketInformation
                                    ref={(instance) => {
                                        this.ticketChild = instance;
                                    }}
                                    data={ticketInfo}
                                    ticketId={ticketId}
                                    handleChange={this.handleChange}
                                    handleObjChange={this.handleObjChange}
                                    handleDropdownChange={this.handleDropdownChange}
                                    handleMultiselectChange={this.handleMultiselectChange}
                                    formikProps={formikProps}
                                    isEdit={true}
                                />
                            </Collapsible>

                            {ticketId && (
                                <div>
                                    <Collapsible
                                        lazyRender={ticketId ? true : false}
                                        trigger="Resolution"
                                        open={toggleSecond}
                                        onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                        onTriggerClosing={() => this.setState({ toggleSecond: false })}
                                    >
                                        <Resolution
                                            ref={(instance) => {
                                                this.ticketResolution = instance;
                                            }}
                                            data={resInfo}
                                            ticketId={ticketId}
                                            handleChange={this.handleChange}
                                            handleObjChange={this.handleObjChange}
                                            handleDropdownChange={this.handleDropdownChange}
                                            isEdit={true}
                                        />
                                    </Collapsible>


                                    {/* <Collapsible
                                        lazyRender={ticketId ? true : false}
                                        trigger="Case Data"
                                        open={toggleThird}
                                        onTriggerOpening={() => this.setState({ toggleThird: true })}
                                        onTriggerClosing={() => this.setState({ toggleThird: false })}
                                    >
                                        <TicketData
                                            ref={(instance) => {
                                                this.ticketData = instance;
                                            }}
                                            data={ticketDataInfo}
                                            ticketId={ticketId}
                                            isEdit={true}
                                        />
                                    </Collapsible> */}

                                    <Collapsible
                                        lazyRender={ticketId ? true : false}
                                        trigger="Activity"
                                        open={toggleFourth}
                                        onTriggerOpening={() => this.setState({ toggleFourth: true })}
                                        onTriggerClosing={() => this.setState({ toggleFourth: false })}
                                    >
                                        <div className="row mt-2">
                                            <div
                                                className="col-12 col-sm-6 col-lg-6 mt-0 mt-sm-0"
                                                style={{
                                                    display: ticketId
                                                        ? "block"
                                                        : "none",
                                                }}
                                            >
                                                <label className="mb-0 font-weight-bold">
                                                    Comments
                                                </label>
                                                <Comment
                                                    entityType={"Ticket"}
                                                    entityId={ticketId}
                                                    isCommentGrid={true}
                                                    updateCommentGrid={this.updateCommentGrid}
                                                />
                                                {this.state.showCommentGrid==true && (
                                                    <CommentHistoryView
                                                        entityType={"Ticket"}
                                                        entityId={ticketId}
                                                        showDialog={true}
                                                        isPrivate={this.state.isPrivate}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Collapsible>
                                </div>
                            )}

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                     </button>
                                </div>
                            </div>

                        </Form>
                    )}
                />
            </div>
        );
    }

}

export default CreateTicket;