import React, { Component } from "react";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";
import { CandSubmissionSubStatus, WorkflowStateType } from "../AppConstants";

export interface CandStatusCardProps {
  dataItem: any;
  history?: any;
}

export interface CandStatusCardState {
  data?: any;
  isDataLoaded: boolean;
}

export default class CandStatusCard extends Component<
  CandStatusCardProps,
  CandStatusCardState
> {
  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
    };
  }

  render() {
    
    const {
      newStatus,
      actionDate,
      actionBy,
      openDays,
      comment,
      reason,
      stateType,
      isNameClearFee,
    } = this.props.dataItem;
    return (
      <div className="row mt-0 ml-0 mr-0">
        <div className="col-12 tooltippoup pl-0 pr-0 pt-0 max-auto mb-0 he">
          <div className="row mt-1 ml-0 mr-0">
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Transition State:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {newStatus}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Submitted On:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {dateFormatter(new Date(actionDate))} {convertShiftDateTime(actionDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-1 ml-0 mr-0">
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Submitted By:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {actionBy}
                  </p>
                </div>
              </div>
            </div>
            {this.props.dataItem.hasOwnProperty("openDays") &&
              stateType !=WorkflowStateType.DENIED &&
              stateType !=WorkflowStateType.CANCELLED &&
              stateType !=WorkflowStateType.FULLYCOMPLETED && (
                <div className="col-6">
                  <div className="row">
                    <div className="col-12 text-left text-sm-left">
                      <p className="hold-position_font-size">Open Days:</p>
                    </div>
                    <div className="col-12 text-left">
                      <p className="hold-position_font-size font-weight-normal">
                        {openDays}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
          {CandSubmissionSubStatus.PendingNameClearance==newStatus && isNameClearFee !=null ?
          <div className="row mt-1 ml-0 mr-0">
            <div className="col-6">
              <div className="row"> 
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Name Clear:</p>
                </div>
                <div className="col-12 text-left pr-0">
                  <p className="hold-position_font-size font-weight-normal comments-card-status">
                    {isNameClearFee ? 'Fee' : 'No Fee'}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row"> 
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Name Clear Date:</p>
                </div>
                <div className="col-12 text-left pr-0">
                  <p className="hold-position_font-size font-weight-normal comments-card-status">
                    {this.props.history.map(x => {
                      if(x.newStatus==CandSubmissionSubStatus.PendingRiskAttestation){
                        return `${dateFormatter(new Date(x.actionDate))} ${convertShiftDateTime(x.actionDate)}`
                      }
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
            
          : null }
          {this.props.dataItem.hasOwnProperty("comment") && comment && (
            <div className="row mt-1 mt-lg-1 ml-0 mr-0">
              <div className="col-12 text-left text-sm-left">
                <p className="hold-position_font-size">Comment:</p>
              </div>
              <div className="col-12 text-left pr-0">
                <p className="hold-position_font-size font-weight-normal comments-card-status">
                  {comment}
                </p>
              </div>
            </div>
          )}
          {this.props.dataItem.hasOwnProperty("reason") && reason && (
            <div className="row mt-1 mt-lg-1 ml-0 mr-0">
              <div className="col-12 text-left text-sm-left">
                <p className="hold-position_font-size">Reason:</p>
              </div>
              <div className="col-12 text-left pr-0">
                <p className="hold-position_font-size font-weight-normal comments-card-status">
                  {reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
