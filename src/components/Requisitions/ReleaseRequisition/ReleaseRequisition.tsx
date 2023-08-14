import * as React from "react";
import axios from "axios";
import BaseRequisition from "../../Shared/BaseRequisition/BaseRequisition";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faCopy, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { VendorDropdownModel } from "./ReleaseSchedule/IReleaseVendorState";
import { SelectDropdownMenus } from "./ReleaseSchedule/HelperFunctions";
import { translateDataSourceResultGroups } from "@progress/kendo-data-query";
import Collapsible from "react-collapsible";
import ReleaseVendor from "./ReleaseSchedule/ReleaseVendor";
import CandidateWF from "../../Candidates/ManageCandidateWF/CandidateWF";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox, { CommentHistoryRow } from "../../Shared/Comment/CommentHistoryBox";
import auth from "../../Auth";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { ReqStatus } from "../../Shared/AppConstants";
import { releaseReq, history, clientSettingData } from "../../../HelperMethods";

export interface ReleaseRequisitionProps {
    match: any;
}

export interface ReleaseRequisitionState {
    reqId: string;
    reqDetails?: any;
    showModal?: boolean;
    selectedVendors: any;
    vendorsList: any;
    openCommentBox?: boolean;
    toggleFifth: boolean;
    toggleSixth: boolean;
    isEnableDepartment: boolean;
    clientId: string;
}

class ReleaseRequisition extends React.Component<ReleaseRequisitionProps, ReleaseRequisitionState> {
    orignialVendorsList: VendorDropdownModel[];
    child: any;
    constructor(props: ReleaseRequisitionProps) {
        super(props);
        this.child = React.createRef();
        this.state = {
            reqId: "",
            selectedVendors: [],
            reqDetails: {},
            vendorsList: [],
            toggleFifth: false,
            toggleSixth: false,
            clientId: auth.getClient(),
            isEnableDepartment: false
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ reqId: id });
        this.getReqDetails(id);
        this.getClientSetting(this.state.clientId)
    }

    getReqDetails(reqId: string) {
        axios.get(`api/requisitions/${reqId}`).then((res) => {
            const { data } = res;
            const reqDetails = { ...data };
            this.setState({ reqDetails: reqDetails });
        });
    }

    releaseRequisition = (isRelease: boolean) => {
        this.child.current.release(isRelease);
    };

    openCollapsible = () => {
        this.setState({ toggleFifth: true, toggleSixth: true });
    };
    closeCollapsible = () => {
        this.setState({ toggleFifth: false, toggleSixth: false });
    };

    getClientSetting = (id) => {
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };

    render() {
        const { reqDetails, reqId, toggleFifth, toggleSixth, isEnableDepartment } = this.state;
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        {this.state.reqId && (
                            <div>
                                <BaseRequisition
                                    closeFifthCollapsible={this.closeCollapsible}
                                    openFifthCollapsible={this.openCollapsible}
                                    toggleFifth={toggleFifth}
                                    toggleSixth={toggleSixth}
                                    reqId={reqId}
                                    reqDetails={reqDetails}
                                    title="View"
                                    showSubmittedCandLink = {reqDetails.status==ReqStatus.APPROVED ? false : true}
                                    isEnableDepartment={isEnableDepartment}
                                />

                                {releaseReq(this.state.reqDetails.status) && auth.hasPermissionV2(AppPermissions.REQ_CREATE) && (
                                <div className="col-12 rel-notuse mb-1">
                                    <Collapsible
                                        trigger="Release"
                                        open={toggleFifth}
                                        onTriggerOpening={() => this.setState({ toggleFifth: true })}
                                        onTriggerClosing={() => this.setState({ toggleFifth: false })}
                                    >
                                        <div className="col-12 mt-2 z-index">
                                            {reqDetails.hasOwnProperty('clientDivisionId') &&
                                                <ReleaseVendor
                                                    ref={this.child}
                                                    reqId={this.state.reqId}
                                                    clientId={localStorage.getItem("UserClientId")}
                                                    reqStatus={reqDetails.status}
                                                    reqDetails={reqDetails}
                                                />
                                            }

                                        </div>
                                    </Collapsible>
                                </div>
                                )}
                                
                                {(reqDetails.status==ReqStatus.CANDIDATEUNDERREVIEW || reqDetails.status==ReqStatus.FILLED) &&
                                    <div className="col-12 rel-notuse mb-3">
                                        <Collapsible
                                            trigger="Submitted Candidates"
                                            open={toggleSixth}
                                            onTriggerOpening={() => this.setState({ toggleSixth: true })}
                                            onTriggerClosing={() => this.setState({ toggleSixth: false })}
                                        >
                                            <div className="col-12 mt-2 z-index px-0">
                                                <CandidateWF
                                                    reqId={this.state.reqId}
                                                />
                                            </div>
                                        </Collapsible>
                                    </div>
                                }

                                {auth.hasPermissionV2(AppPermissions.REQ_COMMENT_CREATE) && <div className="">
                                    <div className="col-12 pl-0 pr-0">
                                        <div className="col-12 col-md-4 mt-2 mb-2">
                                            <label className="mb-0 font-weight-bold">Comments</label>
                                            <span
                                                onClick={() => this.setState({ openCommentBox: true })}
                                                className="text-underline cursorElement align-middle"
                                            >
                                                <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                                            </span>
                                            <Comment entityType={"Requisition"} entityId={this.state.reqId} />
                                        </div>
                                    </div>
                                    {auth.hasPermissionV2(AppPermissions.REQ_COMMENT_VIEW) && this.state.reqId && this.state.openCommentBox && (
                                        <CommentHistoryBox
                                            entityType={"Requisition"}
                                            entityId={this.state.reqId}
                                            showDialog={this.state.openCommentBox}
                                            handleNo={() => {
                                                this.setState({ openCommentBox: false });
                                                document.body.style.position = "";
                                            }}
                                        />
                                    )}
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12">
                    <div className="col-sm-12 col-12 p-2">
                        <div className="row text-center">
                            <div className="col-12 mt-4 mb-4">

                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                    {/* <Link to="/requisitions/manage"> */}
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                        Close
                                    {/* </Link> */}
                                </button>

                                {auth.hasPermissionV2(AppPermissions.REQ_RELEASE_CREATE) && (
                                    <button type="button" onClick={() => this.releaseRequisition(false)} className="btn button button-bg mr-2 shadow mb-2 mb-xl-0">
                                        <FontAwesomeIcon icon={faSave} className={"mr-2"} />
                                        Save
                                    </button>
                                )}
                                {auth.hasPermissionV2(AppPermissions.REQ_RELEASE_CREATE) && reqDetails.status==ReqStatus.APPROVED && (
                                    <button type="button" onClick={() => this.releaseRequisition(true)} className="btn button button-bg mr-2 shadow mb-2 mb-xl-0">
                                        <FontAwesomeIcon icon={faCheckCircle} className={"mr-2"} />
                                        Release
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ReleaseRequisition;
