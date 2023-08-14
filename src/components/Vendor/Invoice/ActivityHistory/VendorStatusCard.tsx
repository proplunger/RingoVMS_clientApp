import React, { Component } from "react";
import { dateFormatter } from "../../../../HelperMethods";
import { convertShiftDateTime } from "../../../ReusableComponents";
import { WorkflowStateType } from "../../../Shared/AppConstants";

export interface VendorStatusCardProps {
  dataItem: any;
}

export interface VendorStatusCardState {
  data?: any;
  isDataLoaded: boolean;
}

export default class VendorStatusCard extends Component<
  VendorStatusCardProps,
  VendorStatusCardState
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
    } = this.props.dataItem;
    return (
      <div className="row mt-0 ml-0 mr-0">
        <div className="col-auto tooltippoup pl-0 pt-0 max-auto mb-0">
          <div className="row mt-1 ml-0 mr-0">
            <div className="col-6 col-sm-6 text-left text-sm-right">
              <p className="hold-position_font-size">Authorization State:</p>
            </div>
            <div className="col-6 col-sm-6 text-left">
              <p className="hold-position_font-size font-weight-normal">
                {newStatus}
              </p>
            </div>
          </div>
          <div className="row mt-1 mt-lg-1 ml-0 mr-0">
            <div className="col-6 col-sm-6 text-left text-sm-right">
              <p className="hold-position_font-size">Action Date:</p>
            </div>
            <div className="col-6 col-sm-6 text-left">
              <p className="hold-position_font-size font-weight-normal">
                {dateFormatter(new Date(actionDate))} {convertShiftDateTime(actionDate)}
              </p>
            </div>
          </div>
          <div className="row mt-1 mt-lg-1 ml-0 mr-0">
            <div className="col-6 col-sm-6 text-left text-sm-right">
              <p className="hold-position_font-size">Action By:</p>
            </div>
            <div className="col-6 col-sm-6 text-left">
              <p className="hold-position_font-size font-weight-normal">
                {actionBy}
              </p>
            </div>
          </div>
          {this.props.dataItem.hasOwnProperty("openDays") &&
            stateType !=WorkflowStateType.CANCELLED &&
            stateType !=WorkflowStateType.FULLYCOMPLETED && (
              <div className="row mt-1 mt-lg-1 ml-0 mr-0">
                <div className="col-6 col-sm-6 text-left text-sm-right">
                  <p className="hold-position_font-size">Open Days:</p>
                </div>
                <div className="col-6 col-sm-6 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {openDays}
                  </p>
                </div>
              </div>
            )}
          {this.props.dataItem.hasOwnProperty("comment") && comment && (
            <div className="row mt-1 mt-lg-1 ml-0 mr-0">
              <div className="col-6 col-sm-6 text-left text-sm-right">
                <p className="hold-position_font-size">Comments:</p>
              </div>
              <div className="col-6 col-sm-6 text-left">
                <p className="hold-position_font-size font-weight-normal">
                  {comment}
                </p>
              </div>
            </div>
          )}
          {this.props.dataItem.hasOwnProperty("reason") && reason && (
            <div className="row mt-1 mt-lg-1 ml-0 mr-0">
              <div className="col-6 col-sm-6 text-left text-sm-right">
                <p className="hold-position_font-size">Reason:</p>
              </div>
              <div className="col-6 col-sm-6 text-left">
                <p className="hold-position_font-size font-weight-normal">
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
