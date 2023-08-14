import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileAlt,
    faInfo,
    faCommentAlt,
    faThumbsUp,
    faFileSignature,
    faTimesCircle,
    faCopy,
    faTimes,
    faThumbsDown,
    faHandPaper,
    faHourglass,
    faClock,
    faCheckCircle,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import ReqStatusCard from "./ReqStatusCard";
import { StatusLegendDictionary } from "./HelperComponent";
import { AuthRoleType, isRoleType, isVendorRoleType, ReqStatus } from "../AppConstants";
import axios from "axios";

export default class ReqStatusBar extends Component<{ statusLevel?: number; orderId: string; orderStatus: string }, {oldStatus?: string}> {
    constructor(props) {
        super(props);
        this.state = {
            oldStatus: ""
        };
    }

    componentDidMount() {
        this.getWFHistory();
    }

    getWFHistory = () => {
        axios.get(`api/requisitions/${this.props.orderId}/workflowhistory`).then((res) => {
            if (res.data.length > 0) {
                var data = res.data;
                var lastStatus = data[data.length - 1].oldStatus;
                this.setState({ oldStatus: lastStatus });
            }
        });
    };

    render() {
        const { orderStatus } = this.props;
        const legend = StatusLegendDictionary.filter((s) => s.status==orderStatus);
        const statusLevel = legend[0].levelNumber;
        const { oldStatus } = this.state;
        return (
            <div>
                <div className="row mt-3 text-dark mx-auto stepindicator-ReqStatusBar">
                    <div className="col-12 col-xl-9 mx-auto" id="stepindicator">
                        <ol className="step-indicator">
                            {!isRoleType(AuthRoleType.Vendor) && <React.Fragment>
                                <li className={statusLevel==1 ? "active" : statusLevel > 1 ? "past" : ""}>
                                    <div className="step">
                                        <FontAwesomeIcon icon={faFileSignature} className={"ml-1"} />
                                    </div>
                                    <div className="caption hidden-xs hidden-s">
                                        <span className="d-block d-sm-block">{ReqStatus.DRAFT}</span>
                                        {/* <span className="d-block d-sm-none">1</span> */}
                                    </div>
                                </li>
                                <li className={statusLevel==2 ? "active" : statusLevel > 2 ? "past" : ""}>
                                    <div data-tip data-for={"statusTooltip"}>
                                        <div className="step">
                                            <FontAwesomeIcon icon={faHourglass} />
                                        </div>
                                        <div className="caption hidden-xs hidden-sm">
                                            <span className="d-block d-sm-block">
                                                {ReqStatus.PENDINGAPPROVAL}
                                                <span className="text-primary ml-1">
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </span>
                                            </span>
                                            {/* <span className="d-block d-sm-none">
                                                2
                                            <span className="text-primary ml-1">
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </span>
                                            </span> */}
                                            <ReactTooltip
                                                place={"bottom"}
                                                effect={"solid"}
                                                multiline={true}
                                                backgroundColor={"white"}
                                                type={"success"}
                                                border={true}
                                                className=""
                                                borderColor={"#FE988D"}
                                                textColor="black"
                                                id={"statusTooltip"}
                                            >
                                                <ReqStatusCard
                                                    orderId={this.props.orderId}
                                                    orderStatus={this.props.orderStatus}
                                                    entityType="Requisition"
                                                />
                                            </ReactTooltip>
                                        </div>
                                    </div>
                                </li>
                                {(statusLevel <= 3 || statusLevel > 5) || (statusLevel==4 && oldStatus==ReqStatus.APPROVED) ? (
                                    <li className={statusLevel==3 ? "active" : statusLevel > 3 ? "past" : ""}>
                                        <div className="step">
                                            <FontAwesomeIcon icon={faThumbsUp} />
                                        </div>
                                        <div className="caption hidden-xs hidden-sm">
                                            <span className="d-block d-sm-block">{ReqStatus.APPROVED}</span>
                                            {/* <span className="d-block d-sm-none">3</span> */}
                                        </div>
                                    </li>
                                ) : (statusLevel==4 && oldStatus==ReqStatus.PENDINGAPPROVAL) ? (
                                    <li className={"active"}>
                                        <div className="step">
                                            <FontAwesomeIcon icon={faHandPaper} />
                                        </div>
                                        <div className="caption hidden-xs hidden-sm">
                                            <span className="d-block d-sm-block">{ReqStatus.ONHOLD}</span>
                                            {/* <span className="d-block d-sm-none">3</span> */}
                                        </div>
                                    </li>
                                ) : statusLevel==5 ? (
                                    <li className={"active last-step"}>
                                        <div className="step">
                                            <FontAwesomeIcon icon={faThumbsDown} />
                                        </div>
                                        <div className="caption hidden-xs hidden-sm">
                                            <span className="d-block d-sm-block">{ReqStatus.REJECTED}</span>
                                            {/* <span className="d-block d-sm-none">3</span> */}
                                        </div>
                                    </li>
                                ) : (
                                    ""
                                )}
                            </React.Fragment>
                            }

                            {(statusLevel==4 && oldStatus==ReqStatus.APPROVED) &&
                            <li className={"active"}>
                                <div className="step">
                                    <FontAwesomeIcon icon={faHandPaper} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.ONHOLD}</span>
                                    {/* <span className="d-block d-sm-none">3</span> */}
                                </div>
                            </li>}

                            <li
                                className={statusLevel==6 ? "active" : statusLevel > 6 || ((statusLevel==4 && (oldStatus==ReqStatus.CANDIDATEUNDERREVIEW || oldStatus==ReqStatus.RELEASED))) ? "past" : ""}
                                style={{ display: statusLevel !=5 ? "table-cell" : "none" }}
                            >
                                <div className="step">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.RELEASED}</span>
                                    {/* <span className="d-block d-sm-none">4</span> */}
                                </div>
                            </li>

                            {(statusLevel==4 && oldStatus==ReqStatus.RELEASED) &&
                            <li className={"active"}>
                                <div className="step">
                                    <FontAwesomeIcon icon={faHandPaper} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.ONHOLD}</span>
                                    {/* <span className="d-block d-sm-none">3</span> */}
                                </div>
                            </li>}

                            <li
                                className={statusLevel==11 ? "active" : statusLevel > 11 || (statusLevel==4 && oldStatus==ReqStatus.CANDIDATEUNDERREVIEW) ? "past" : ""}
                                style={{ display: statusLevel !=5 ? "table-cell" : "none" }}
                            >
                                <div className="step">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.CANDIDATEUNDERREVIEW}</span>
                                    {/* <span className="d-block d-sm-none">5</span> */}
                                </div>
                            </li>

                            {(statusLevel==4 && oldStatus==ReqStatus.CANDIDATEUNDERREVIEW) &&
                            <li className={"active"}>
                                <div className="step">
                                    <FontAwesomeIcon icon={faHandPaper} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.ONHOLD}</span>
                                    {/* <span className="d-block d-sm-none">3</span> */}
                                </div>
                            </li>}

                            <li
                                className={statusLevel==12 ? "active" : statusLevel > 12 ? "past" : ""}
                                style={{ display: statusLevel !=5 ? "table-cell" : "none" }}
                            >
                                <div className="step">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.FILLED}</span>
                                    {/* <span className="d-block d-sm-none">6</span> */}
                                </div>
                            </li>

                            <li
                                className={statusLevel==13 ? "active last-step" : "last-step"}
                                style={{ display: statusLevel !=5 ? "table-cell" : "none" }}
                            >
                                <div className="step">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className="caption hidden-xs hidden-sm">
                                    <span className="d-block d-sm-block">{ReqStatus.CLOSED}</span>
                                    {/* <span className="d-block d-sm-none">7</span> */}
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
