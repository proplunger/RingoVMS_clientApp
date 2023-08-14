import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { LevelStatusDictionary, ApproverStatusDictionary } from "./HelperComponent";
import Shimmer from "react-shimmer-effect";

export interface ReqStatusCardProps {
    orderId?: string;
    orderStatus?: string;
    entityType?: string;
}

export interface ReqStatusCardState {
    data?: any;
    isDataLoaded: boolean;
}

export default class ReqStatusCard extends Component<ReqStatusCardProps, ReqStatusCardState> {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
        };
        this.getApproverDetailsByReq();
    }

    getLevelStatus(level) {
        var legendClass = "l-draft",
            filteredRows;
        filteredRows = LevelStatusDictionary.find((s) => s.isLevelActive==level.isLevelActive && s.status==this.props.orderStatus.toLowerCase());
        if (filteredRows) {
            legendClass = filteredRows.className;
        }
        if (this.props.orderStatus.toLowerCase()=="rejected") {
            let isApproved = level.wfApprovalPendingWith.some((x) => x.action=="Approve");
            if (isApproved) legendClass = "l-approved";
        }
        return legendClass;
    }

    getApproverStatus(approver) {
        var legendClass = "c-draft";
        var filteredRows = ApproverStatusDictionary.find((s) => s.isApproverActive==approver.isApproverActive && s.action==approver.action);
        if (filteredRows) {
            legendClass = filteredRows.className;
        }
        return legendClass;
    }

    //gets approvers dropdown based on orderId
    getApproverDetailsByReq = () => {
        axios.get(`api/requisitions/${this.props.orderId}/approverdetails?entityType=${this.props.entityType}`).then((res) => {
            if (res.data) {
                this.setState({
                    data: { ...res.data },
                    isDataLoaded: true,
                });
            } else {
                this.setState({
                    data: {
                        //clientId: this.props.approverStep.approverDetails.clientId,
                        isParallel: false,
                        isOverridePriorLevel: false,
                        wfApprovalLevel: [],
                    },
                    isDataLoaded: true,
                });
            }
        });
    };

    render() {
        return (
            <div className="container-fluid pl-0 pr-0">
                <div className="shadow bg-white pt-2 Sequential-Flow">
                    <div className="col-12 d-flex justify-content-center">
                        <a href="" className="text-dark font-weight-bold">
                            Sequential Flow
                        </a>
                    </div>
                    <hr />
                    {!this.state.isDataLoaded && (
                        <div>
                            <Shimmer key="1">
                                <div className="line dropdown-shimmer" id="line1" key="line1"></div>
                            </Shimmer>
                            <br />
                            <Shimmer key="2">
                                <div className="line dropdown-shimmer" id="line2" key="line2"></div>
                            </Shimmer>
                        </div>
                    )}
                    {this.state.data &&
                        this.state.data.wfApprovalLevel.map((item) => (
                            <div key={item.wfApprovalLevelId}>
                                <div className="col-12">
                                    <div className="row mt-2 font-regular">
                                        <div className="col font-weight-bold">
                                            <div className="row align-items-center">
                                                <div className="col-auto pr-1  pr-xl-1">
                                                    <div className={this.getLevelStatus(item)}></div>
                                                </div>
                                                <div className="col text-left pl-xl-1 pr-0 pl-1">
                                                    <div className="word-break-div">{item.order && "Level " + item.order}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-auto d-flex justify-content-end">
                                            <a href="" className="text-dark font-weight-bold">
                                                {item.requireAllApprovers ? "All" : "Any One"}
                                                <FontAwesomeIcon className="ml-1" icon={item.requireAllApprovers ? faUsers : faUser} />
                                            </a>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="row">
                                        
                                            <div className="col-12 pb-2">
                                                <div className="row mx-0">
                                                {item.wfApprovalPendingWith.map((approver) => (
                                                    <div
                                                        key={this.props.orderStatus + approver.wfApprovalPendingWithId}
                                                        className={"mx-0 col-4  " + this.getApproverStatus(approver)}
                                                    >
                                                        {approver.approverName}{" "}
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    {this.state.data && this.state.data.wfApprovalLevel.length==0 && (
                        <div className="text-center mb-2" style={{ paddingBottom: "1em" }}>
                            No Approvers!
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
