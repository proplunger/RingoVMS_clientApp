import { faCopy, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Link } from "react-router-dom";
import BaseRequisition from "../../Shared/BaseRequisition/BaseRequisition";
import axios from "axios";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { candidateUnderReview, clientSettingData, successToastr } from "../../../HelperMethods";
import { history } from "../../../HelperMethods";
import { REJECT_APPROVAL_STATUS } from "../../Shared/AppMessages";
import Collapsible from "react-collapsible";
import ReleaseVendor from "../ReleaseRequisition/ReleaseSchedule/ReleaseVendor";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { ReqStatus } from "../../Shared/AppConstants";
import auth from "../../Auth";
import CandidateWF from "../../Candidates/ManageCandidateWF/CandidateWF";

export interface ViewRequisitionProps {
    match: any;
}

export interface ViewRequisitionState {
    reqId: string;
    clientId: string;
    reqDetails: any;
    showModal?: boolean;
    toggleFifth: boolean;
    toggleSixth: boolean;
    isEnableDepartment: boolean;
}

class ViewRequisition extends React.Component<ViewRequisitionProps, ViewRequisitionState> {
    constructor(props: ViewRequisitionProps) {
        super(props);
        this.state = { 
            reqId: "",
            reqDetails: {},
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

    getClientSetting = (id) => {
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };

    duplicatedReq = () => {
        const data = {
            reqId: this.state.reqId,
        };
        axios.post(`/api/requisitions/duplicate`, JSON.stringify(data)).then((res) => {
            successToastr("A copy of this requisition has been created successfully");
            history.push("/requisitions/manage");
        });
    };

    openCollapsible = () => {
        this.setState({ toggleFifth: true, toggleSixth: true });
    };
    closeCollapsible = () => {
        this.setState({ toggleFifth: false, toggleSixth: false });
    };
    render() {
        const { reqDetails, reqId, toggleFifth, toggleSixth, isEnableDepartment} = this.state;
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        {this.state.reqId && (
                            <BaseRequisition
                                openFifthCollapsible={this.openCollapsible}
                                closeFifthCollapsible={this.closeCollapsible}
                                toggleFifth={toggleFifth}
                                toggleSixth={toggleSixth}
                                reqId={reqId}
                                reqDetails={reqDetails}
                                title="View"
                                showSubmittedCandLink = {reqDetails.status==ReqStatus.CLOSED || reqDetails.status==ReqStatus.CANCELLED|| reqDetails.status==ReqStatus.FILLED ? true : false}
                                isEnableDepartment={isEnableDepartment}
                            />
                        )}
                        {candidateUnderReview(this.state.reqDetails.status) && auth.hasPermissionV2(AppPermissions.REQ_CREATE) && (
                            <div className="col-12 rel mb-1">
                                <Collapsible
                                    trigger="Release"
                                    open={toggleFifth}
                                    onTriggerOpening={() => this.setState({ toggleFifth: true })}
                                    onTriggerClosing={() => this.setState({ toggleFifth: false })}
                                >
                                    <div className="col-12 mt-2 view-req">
                                    {reqDetails.hasOwnProperty('clientDivisionId') && 
                                        <ReleaseVendor
                                            reqId={this.state.reqId}
                                            clientId={localStorage.getItem("UserClientId")}
                                            reqStatus={this.state.reqDetails.status}
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
                    </div>
                </div>
                <div className="col-12">
                    <div className="col-sm-12 col-12 p-2">
                        <div className="row text-center">
                            <div className="col-12 mt-4 mb-4">
                                {/* <Link to="/requisitions/manage"> */}
                                <button onClick={() => history.goBack()} type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                        Close
                                    </button>
                                {/* </Link> */}
                                {auth.hasPermissionV2(AppPermissions.REQ_COPY) && <button
                                    type="button"
                                    disabled={this.state.reqDetails.status==REJECT_APPROVAL_STATUS}
                                    onClick={() => this.setState({ showModal: true })}
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                >
                                    <FontAwesomeIcon icon={faCopy} className={"mr-2"} />
                                    Copy
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    message={"Are you sure you want to create a copy of this requisition?"}
                    showModal={this.state.showModal}
                    handleYes={this.duplicatedReq}
                    handleNo={() => {
                        this.setState({ showModal: false });
                    }}
                />
            </React.Fragment>
        );
    }
}

export default ViewRequisition;
