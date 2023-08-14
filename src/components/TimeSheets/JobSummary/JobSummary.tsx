import { icon } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle, faTimes, faTimesCircle, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatter } from "../../../HelperMethods";
import * as React from "react";
import axios from "axios";
import { convertShiftDateTime } from "../../ReusableComponents";
import { AuthRoleType, isRoleType, EntityType, isVendorRoleType, TimesheetStatus, TimesheetStatuses } from "../../Shared/AppConstants";
import ApprovalsWFGrid from "../../Shared/ApprovalsWFGrid/ApprovalsWFGrid";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import ReactTooltip from "react-tooltip";
import ReqStatusCard from "../../Shared/ReqStatusCard/ReqStatusCard";

export interface IJobSummaryProps {
    candSubmissionId?: string;
    onClose?:any;
}
export interface IJobSummaryState {
    show?: boolean;
    jobSummary: any;
    clientId?:any;
}
class JobSummary extends React.Component<IJobSummaryProps, IJobSummaryState> {
    constructor(props: IJobSummaryProps) {
        super(props);
        this.state = {
            show: false,
            jobSummary: {},
            clientId: auth.getClient(),
        };
    }
    close = () => {
        this.setState({ show: false });
    };
    show = () => {
        this.setState({ show: true });
        this.getJobSummary();
    };

    getJobSummary = () => {
        axios.get(`api/ts/jobsummary?id=${this.props.candSubmissionId}`).then((res) => {
            this.setState({
                jobSummary: res.data,
            });
        });
    };

    componentDidMount() {
        this.getJobSummary();
    }
    render() {
        return (
            
                
            <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-md-10 col-lg-9 shadow containerDialoginside Popup-height-summary">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        Job Summary
                                        <span className="float-right" onClick={this.props.onClose}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                            {/* <i className="far fa-arrow-right mr-2 "></i> */}
                                        </span>
                                    </div>
                                </div>
                                {/* to do */}
                                <div className="row mx-0">
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Client :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div font-weight-bold">
                                                {this.state.jobSummary.client}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Division :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div font-weight-bold">
                                                {this.state.jobSummary.division}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Location :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div font-weight-bold">
                                                {this.state.jobSummary.location}
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div>
                                <div className="row mt-md-3 mt-2"> */}
                                    {!isRoleType(AuthRoleType.Vendor) && !isRoleType(AuthRoleType.Provider) &&
                                        <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                            <div className="row">
                                                <div className="col-6 text-right font-weight-normal">Division Contact :</div>
                                                <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{this.state.jobSummary.divisionContact}</div>
                                            </div>
                                        </div>
                                    }
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Position :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{this.state.jobSummary.position}</div>
                                        </div>
                                    </div>
                                    {!isRoleType(AuthRoleType.Vendor) && !isRoleType(AuthRoleType.Provider) &&
                                        <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                            <div className="row">
                                                <div className="col-6 text-right font-weight-normal">Hiring Manager :</div>
                                                <div className="col-6 font-weight-bold pl-0 text-left word-break-div font-weight-bold">
                                                    {this.state.jobSummary.hiringManager}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {/* </div>
                                <div className="row mt-md-3 mt-2"> */}
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Assignment Type :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div font-weight-bold">
                                                {this.state.jobSummary.assignmentType}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Vendor :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{this.state.jobSummary.vendor}</div>
                                        </div>
                                    </div>
                                    {/* </div>
                                <div className="row mt-md-3 mt-2"> */}
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Start Date:</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                {this.state.jobSummary.startDate ? dateFormatter(new Date(this.state.jobSummary.startDate)) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">End Date :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                {this.state.jobSummary.endDate ? dateFormatter(new Date(this.state.jobSummary.endDate)) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal"></div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div"></div>
                                        </div>
                                    </div>
                                    {/* </div>
                                <div className="row mt-md-3 mt-2"> */}
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">Start Time :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                {this.state.jobSummary.startTime ? convertShiftDateTime(this.state.jobSummary.startTime) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right font-weight-normal">End Time :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                {this.state.jobSummary.endTime ? convertShiftDateTime(this.state.jobSummary.endTime) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!isRoleType(AuthRoleType.Provider) && this.state.jobSummary.clientId &&
                                    <div className="mt-4">
                                        <label className="mb-0">Timesheet Approvers</label>
                                        <ApprovalsWFGrid
                                            entityId={this.state.jobSummary.reqId}
                                            entityType={EntityType.TIMESHEET}
                                            clientId={this.state.jobSummary.clientId}
                                            permission={AppPermissions.TS_APPROVE}
                                            canEdit={false}
                                        />
                                    </div>
                                }
                                <div className="btn-bottom pt-2 pb-2 pt-lg-4 pb-lg-4 mt-1 mb-1 mt-lg-0 mb-lg-0">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onClose}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            
            
        );
    }
}

export default JobSummary;
