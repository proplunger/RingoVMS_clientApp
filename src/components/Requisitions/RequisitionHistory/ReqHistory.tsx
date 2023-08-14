import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faHandPaper, faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import CandStatusCard from "../../Shared/CandStatusCard/CandStatusCard";
import axios from "axios";
import "../../Shared/CandStatusCard/CandStatusCard.css";
import { dateFormatter } from "../../../HelperMethods";
import Skeleton from "react-loading-skeleton";

export interface IReqHistoryProps {
    statusLevel?: number;
    dataItem: any;
    entityId?: string;
    title?: string;
    handleClose?: any;
    candidateName?: string;
}

export interface IReqHistoryState {
    history?: any;
}

export default class ReqHistory extends Component<IReqHistoryProps, IReqHistoryState> {
    //public c= CandStatusMap;
    constructor(props: IReqHistoryProps) {
        super(props);
        this.state = { history: [] };
    }

    getWFHistory = () => {
        axios.get(`api/requisitions/${this.props.entityId}/workflowhistory`).then((res) => {
            if (res.data.length > 0) {
                console.log(res.data);
                if (!res.data.some((x) => x.stateType=="Denied" || x.stateType=="Fully Completed")) {
                    res.data.push({ stateType: "Draft", actionDate: new Date(), displayStatus: "Upcoming Steps" });
                }
                this.setState({ history: res.data });
            }
        });
    };

    icon = (stateType) => {
        var icon;
        switch (stateType) {
            case "Fully Completed":
                icon = faCheck;
                break;
            case "Completed":
                icon = faCheck;
                break;
            case "Denied":
                icon = faTimes;
                break;
            case "Cancelled":
                icon = faTimes;
                break;
            case "Draft":
                icon = faClock;
                break;
            case "InProgress":
                icon = faHandPaper;
                break;
        }
        return icon;
    };

    componentDidMount() {
        this.getWFHistory();
    }

    render() {
        return (
            <div className="row ml-0 mr-0 modal-content border-0 modal-content-mobile">
                <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                    <h4 className="modal-title text-white fontFifteen">{this.props.title}</h4>
                    <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.handleClose}>
                        &times;
                    </button>
                </div>
                <div className="container-fluid">
                    <div className="row mt-2 mt-lg-4 ml-sm-0 mr-sm-0 mb-3">
                        <div className="col-sm-6 col-md-4">
                            <p className="hold-position_font-size">
                                Division: <span className="pl-1 work-break font-weight-normal">{this.props.dataItem.division}</span>
                            </p>
                        </div>

                        <div className="col-sm-6 col-md-4 text-left text-sm-center">
                            <p className="hold-position_font-size">
                                Location:
                                <span className="pl-1 work-break font-weight-normal">{this.props.dataItem.location}</span>
                            </p>
                        </div>

                        <div className="col-12 col-md-4 text-left text-md-right">
                            <p className="hold-position_font-size">
                                Position:
                                <span className="pl-1 work-break font-weight-normal">{this.props.dataItem.position}</span>
                            </p>
                        </div>
                        {/* <Skeleton circle={true} height={40} width={40} />
                        <Skeleton height={2} width={80} className="middle"/>
                        <Skeleton circle={true} height={40} width={40} /> */}
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="col-12 d-flex justify-content-centerr" style={{ overflowX: "auto" }}>
                        {this.state.history.length==0 && (
                            <div className="col-12 text-center">
                                <div className="no-data mb-2 hold-position_font-size">No data available.</div>
                            </div>
                        )}
                        <div className="row bs-wizard border-bottom-0 flex-wrapNOWrap ml-0 mr-0 justify-content-centerr w-100  justify-content-between row-centerr row-centerr-last-child">
                            {this.state.history.length > 0 &&
                                this.state.history.map((h, index) => (
                                    <div
                                        key={index}
                                        className={"col bs-wizard-step mt-0 d-flex ccol-auto-width " + h.stateType.toLowerCase()}
                                        style={{ flexDirection: "column" }}
                                    >
                                        <div className="progress">
                                            <div className="progress-bar"></div>
                                        </div>

                                        {/* ForShimmer */}
                                        {/* <div className="progress progress-Shimmer">
                                            <div className="progress-bar"></div>
                                        </div> */}
                                        {/* ForShimmer */}

                                        <a className="bs-wizard-dot">
                                            {/* ForShimmer */}
                                            {/* <Skeleton circle={true} height={38} width={38} style={{marginLeft:"19px", position:"absolute", left:"-20px", top:"-1px"}} /> */}
                                            {/* ForShimmer */}
                                            <FontAwesomeIcon icon={this.icon(h.stateType)} className="progress-bar-FontSize" />
                                        </a>
                                        <div className="bs-wizard-info border-0 card card-body flex-fill text-left font-weight-bold text-dark col pl-0 font-size-progressbar last-child-new pt-2">
                                            {h.displayStatus || <Skeleton />}
                                        </div>
                                        {h.stateType !="Draft" && (
                                            // <div className="text-left col small pl-0">
                                            <div className="text-left col small pl-0">
                                                <div>
                                                    <div className="w-60-pixel" data-tip data-for={"statusTooltip" + index} style={{ cursor: "pointer" }}>
                                                        <div className="font-weight-bold">Date:</div>
                                                        <span>{dateFormatter(new Date(h.actionDate))}</span>
                                                    </div>
                                                    <ReactTooltip
                                                        place={"top"}
                                                        effect={"solid"}
                                                        multiline={true}
                                                        backgroundColor={"white"}
                                                        type={"success"}
                                                        border={true}
                                                        className="tooltip-comments-cardstatus"
                                                        borderColor={"#FE988D"}
                                                        textColor="black"
                                                        id={"statusTooltip" + index}
                                                    >
                                                        <CandStatusCard dataItem={h} />
                                                    </ReactTooltip>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
