import React, { Component } from "react";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export interface TicketStatusCardProps {
  dataItem: any;
}

export interface TicketStatusCardState {
  data?: any;
  isDataLoaded: boolean;
}

export default class TicketStatusCard extends Component<
  TicketStatusCardProps,
  TicketStatusCardState
> {
  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
    };
  }

  render() {
    const {
      NewStatus,
      ActionDate,
      ActionBy
    } = this.props.dataItem;
    return (
      <div className="row mt-0 ml-0 mr-0">
        <div className="col-12 tooltippoup pl-0 pr-0 pt-0 max-auto mb-0 he">
        <div className="row mt-1 ml-0 mr-0">
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Ticket History:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {NewStatus}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Action Date:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {dateFormatter(new Date(ActionDate))} {convertShiftDateTime(ActionDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-1 ml-0 mr-0">
            <div className="col-6">
              <div className="row">
                <div className="col-12 text-left text-sm-left">
                  <p className="hold-position_font-size">Action By:</p>
                </div>
                <div className="col-12 text-left">
                  <p className="hold-position_font-size font-weight-normal">
                    {ActionBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}