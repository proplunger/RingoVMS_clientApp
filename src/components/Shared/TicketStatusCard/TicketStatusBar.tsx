import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faClock } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import "../CandStatusCard/CandStatusCard.css";
import { dateFormatter } from "../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import { TicketEventsType } from "../AppConstants";
import TicketStatusCard from "./TicketStatusCard";
import CommonDataService from "../Services/CommonDataService";
import TicketAttributeHistory from "./TicketAttributeHistory";

export interface ITicketStatusBarProps {
  entityId?: string;
  title?: string;
  handleClose?: any;
  dataItem: any;
}

export interface ITicketStatusBarState {
  history?: any;
  openQueHistoryBox?: boolean;
  openAssignToHistoryBox?: boolean;
}

export default class TicketStatusBar extends Component<
  ITicketStatusBarProps,
  ITicketStatusBarState
> {
  constructor(props: ITicketStatusBarProps) {
    super(props);
    this.state = { history: [] };
  }

  componentDidMount() {
    this.getTicketHistory();
  }

  getTicketHistory = () => {
    const { entityId } = this.props;
    const queryParams = `streamId eq ${entityId} and type eq '${TicketEventsType.TICKETSTATUSEVENT}' & $orderby=timestamp`;

    CommonDataService.getEvents(queryParams).then((res) => {
      let data = res.data.map((x) => JSON.parse(x.data));
      this.setState({
        history: data
      });
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
        icon = faCheck;
        break;
    }
    return icon;
  };

  render() {
    const { history } = this.state;
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
            <div className="col-12 col-sm-6 col-md-6 text-left text-sm-left">
              <p className="hold-position_font-size">
                <span className="pl-1 work-break font-weight-normal cursor-pointer text-underline" onClick={() => this.setState({ openQueHistoryBox: true })}>
                  Queue:
                </span>
                {" "}{this.props.dataItem.tktQue}
              </p>
            </div>
            <div className="col-12 col-sm-6 col-md-6 text-left text-sm-center">
              <p className="hold-position_font-size">
                <span className="pl-1 work-break font-weight-normal cursor-pointer text-underline" onClick={() => this.setState({ openAssignToHistoryBox: true })}>
                  Assigned To:
                </span>
                {" "}{this.props.dataItem.currentAssignedTo}
              </p>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="py-4 px-4 col-12 d-flex justify-content-centerr" style={{ overflowX: "auto", minWidth:"533px" }}>
            {history.length==0 && (
              <div className="col-12 text-center">
                <div className="no-data mb-2 hold-position_font-size">No data available.</div>
              </div>
            )}
            <div className="row bs-wizard border-bottom-0 flex-wrapNOWrap ml-0 mr-0 justify-content-centerr w-100  justify-content-between row-centerr row-centerr-last-child">
              {history.length > 0 &&
                history.map((h, index) => (
                  <div
                    key={index}
                    className={"col bs-wizard-step mt-0 d-flex ccol-auto-width " + h.StateType.toLowerCase()}
                    style={{ flexDirection: "column" }}
                  >
                    <div className="progress">
                      <div className="progress-bar"></div>
                    </div>

                    <a className="bs-wizard-dot">
                      <FontAwesomeIcon icon={this.icon(h.StateType)} className="progress-bar-FontSize" />
                    </a>
                    <div className="bs-wizard-info border-0 card card-body flex-fill text-left font-weight-bold text-dark col pl-0 font-size-progressbar last-child-new pt-2">
                      {h.NewStatus || <Skeleton />}
                    </div>
                    {/* {h.stateType !="Draft" && ( */}
                    <div className="text-left col small pl-0">
                      <div>
                        <div className="w-60-pixel" data-tip data-for={"statusTooltip" + index} style={{ cursor: "pointer" }}>
                          <div className="font-weight-bold">Date:</div>
                          <span>
                            {dateFormatter(new Date(h.ActionDate))}
                          </span>
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
                          <TicketStatusCard
                            dataItem={h}
                          />
                        </ReactTooltip>
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {this.state.openAssignToHistoryBox && (
          <TicketAttributeHistory
            entityId={this.props.entityId}
            showDialog={this.state.openAssignToHistoryBox}
            handleNo={() => {
              this.setState({ openAssignToHistoryBox: false });
            }}
            ticketAssignTo={true}
            ticketQue={false}
          />
        )}
        {this.state.openQueHistoryBox && (
          <TicketAttributeHistory
            entityId={this.props.entityId}
            showDialog={this.state.openQueHistoryBox}
            handleNo={() => {
              this.setState({ openQueHistoryBox: false });
            }}
            ticketQue={true}
            ticketAssignTo={false}
          />
        )}
      </div>
    );
  }
}