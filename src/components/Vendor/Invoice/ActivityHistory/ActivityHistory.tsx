import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faClock,
  faHandPaper,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import VendorStatusCard from "./VendorStatusCard";
import axios from "axios";
import "../../../Shared/CandStatusCard/CandStatusCard.css";
import { dateFormatter } from "../../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import SkeletonWidget from "../../../Shared/Skeleton";
import { icon, WorkflowStateType } from "../../../Shared/AppConstants";

export interface IVendorActivityHistoryProps {
  statusLevel?: number;
  dataItem: any;
  handleClose?: any;
  candidateName?: string;
}

export interface IVendorActivityHistoryState {
  history?: any;
  showLoader?: boolean;
}

export default class VendorActivityHistory extends Component<
  IVendorActivityHistoryProps,
  IVendorActivityHistoryState
> {
  constructor(props: IVendorActivityHistoryProps) {
    super(props);
    this.state = { history: [] };
  }

  // getWFHistory = () => {
  //     this.setState({ showLoader: true })
  //     const queryParams = `entityId eq ${this.props.dataItem.vendorInvoiceId}`;
  //     axios.get(`api/workflow/history?$filter=${queryParams}`).then((res) => {
  //         if (res.data.length > 0) {
  //             this.setState({ showLoader: false });
  //             if (!res.data.some((x) => x.stateType==WorkflowStateType.DENIED)
  //                 && !res.data.some((x) => x.stateType==WorkflowStateType.FULLYCOMPLETED)
  //                 && !res.data.some((x) => x.stateType==WorkflowStateType.CANCELLED)) {
  //                 res.data.push({ stateType: WorkflowStateType.DRAFT, actionDate: new Date(), displayStatus: "Upcoming Steps" });
  //             }
  //             res.data.forEach((d: any) => {
  //                 var dataItem = res.data.find((x) => x.oldStatus==d.newStatus);
  //                 if (dataItem) {
  //                     let dayDiff = Math.abs(new Date(d.actionDate).valueOf() - new Date(dataItem.actionDate).valueOf());
  //                     d.openDays = Math.floor(dayDiff / (1000 * 60 * 60 * 24));
  //                 } else {
  //                     d.openDays = 0;
  //                 }
  //             });
  //             this.setState({ history: res.data.filter((x) => x.displayStatus !=null), showLoader: false });
  //         }
  //         if (res.data.length==0) {
  //             this.setState({ showLoader: false })
  //         }
  //     });
  // };
  getWFHistory = () => {
    const queryParams = `entityId eq ${this.props.dataItem.vendorInvoiceId}`;
    axios.get(`api/workflow/history?$filter=${queryParams}`).then((res) => {
      if (res.data.length > 0) {
        if (
          !res.data.some((x) => x.stateType==WorkflowStateType.DENIED) &&
          !res.data.some((x) => x.stateType==WorkflowStateType.CANCELLED) &&
          !res.data.some((x) => x.stateType==WorkflowStateType.FULLYCOMPLETED)
        ) {
          res.data.push({
            stateType: "Draft",
            actionDate: new Date(),
            displayStatus: "Upcoming Steps",
          });
        }
        res.data.forEach((d: any, index) => {
          var dataItem = res.data.find((x) => x.oldStatus==d.newStatus);
          if (dataItem) {
            let dayDiff = Math.abs(
              new Date(d.actionDate).valueOf() -
                new Date(dataItem.actionDate).valueOf()
            );
            d.openDays = Math.floor(dayDiff / (1000 * 60 * 60 * 24));
          } else {
            d.openDays = 0;
          }

          if (
            res.data.length ==
            (res.data.some((x) => x.stateType=="Draft")
              ? index + 2
              : index + 1)
          ) {
            d.openDays = this.props.dataItem.openDays;
          }
        });
        this.setState({
          history: res.data.filter((x) => x.displayStatus !=null),
        });
      } else {
        this.setState({ showLoader: false });
      }
    });
  };
  componentDidMount() {
    this.getWFHistory();
  }
  icon = (stateType) => {
    var icon;
    switch (stateType) {
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
      case WorkflowStateType.FULLYCOMPLETED:
        icon = faCheck;
        break;
      case "InProgress":
        icon = faCheck;
        break;
      case "Review":
        icon = faHandPaper;
        break;
    }
    return icon;
  };

  render() {
    const { showLoader } = this.state;
    return (
      <div className="row ml-0 mr-0 modal-content border-0 modal-content-mobile">
        <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
          <h4 className="modal-title text-white fontFifteen">
            Activity History - {this.props.dataItem.vendorName}
          </h4>
          <button
            type="button"
            className="close text-white close_opacity"
            data-dismiss="modal"
            onClick={this.props.handleClose}
          >
            &times;
          </button>
        </div>
        {showLoader && <SkeletonWidget />}
        {!showLoader && (
          <div className="container-fluid">
            <div className="row mt-2 mt-lg-4 ml-sm-0 mr-sm-0 mb-3">
              <div className="col-6 col-sm-6 text-left">
                <p className="hold-position_font-size"style={{width:"300px"}}>
                  Vendor Invoice#:{" "}
                  <span className="work-break font-weight-normal">
                    {this.props.dataItem.vendorInvoiceNumber}
                  </span>
                </p>
              </div>
              <div className="col-6 col-sm-6 text-left text-sm-right mt-1 mt-sm-0">
                <p className="hold-position_font-size">
                  Billing Period:
                  <span className="pl-1 work-break font-weight-normal">
                    {this.props.dataItem.billingPeriod}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        {showLoader && <SkeletonWidget length={2} breadth={3} />}
        {!showLoader && (
          <div className="container-fluid">
            <div
              className="col-12 d-flex justify-content-centerr"
              style={{ overflowX: "auto" }}
            >
              {this.state.history.length==0 && (
                <div className="col-12 text-center">
                  <div className="no-data mb-2 hold-position_font-size">
                    No data available.
                  </div>
                </div>
              )}
              <div className="row bs-wizard border-bottom-0 flex-wrapNOWrap ml-0 mr-0 justify-content-centerr w-100  justify-content-between row-centerr row-centerr-last-child">
                {this.state.history.length > 0 &&
                  this.state.history.map((h, index) => (
                    <div
                      className={
                        "col bs-wizard-step mt-0 d-flex cccol-auto-width " +
                        h.stateType.toLowerCase()
                      }
                      style={{ flexDirection: "column" }}
                    >
                      <div className="progress">
                        <div className="progress-bar"></div>
                      </div>
                      <a className="bs-wizard-dot">
                        <FontAwesomeIcon
                          icon={this.icon(h.stateType)}
                          className="progress-bar-FontSize"
                        />
                      </a>
                      <div
                        className="bs-wizard-info border-0 card 
                                        card-body flex-fill text-left font-weight-bold text-dark 
                                        col pl-0 font-size-progressbar pt-2"
                      >
                        {h.displayStatus || <Skeleton />}
                      </div>
                      {h.stateType !=WorkflowStateType.DRAFT && (
                        <div className="text-left pl-0 w-60-pixell col small">
                          <div className="font-weight-bold">Date:</div>
                          <span
                            className="hover-under"
                            data-tip
                            data-for={"statusTooltip" + index}
                            style={{ cursor: "pointer" }}
                          >
                            {dateFormatter(new Date(h.actionDate))}
                          </span>
                          <div>
                            {h.stateType !=WorkflowStateType.CANCELLED &&
                              h.stateType !=
                                WorkflowStateType.FULLYCOMPLETED && (
                                <div className=" w-60-pixel">
                                  <div className="font-weight-bold space-noWarap">
                                    Open Days:
                                  </div>
                                  <span>{h.openDays}</span>
                                </div>
                              )}
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
                              id={"statusTooltip" + index}
                            >
                              <VendorStatusCard dataItem={h} />
                            </ReactTooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
