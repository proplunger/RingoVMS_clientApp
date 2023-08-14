import React from "react";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";

export interface DatePickerProps {
    updateState?: any;
    startDateFrom: any;
    startDateTo: any;
    endDateFrom: any;
    endDateTo: any;
}

export interface DatePickerState { }

class DateSelector extends React.Component<DatePickerProps, DatePickerState> {
    disableDate = () => {
        document.getElementsByName("startDateFrom").length > 0 && (document.getElementsByName("startDateFrom")[0]["disabled"] = true)

        document.getElementsByName("startDateTo").length > 0 && (document.getElementsByName("startDateTo")[0]["disabled"] = true)

        document.getElementsByName("endDateFrom").length > 0 && (document.getElementsByName("endDateFrom")[0]["disabled"] = true)

        document.getElementsByName("endDateTo").length > 0 && (document.getElementsByName("endDateTo")[0]["disabled"] = true)
    }
    render() {
        this.disableDate()
        return (
           <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                    <div className="row">
                        <div className="col-12">
                            <label className="mb-1 font-weight-bold">Start Date</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="startDateFrom"
                                formatPlaceholder="formatPattern"
                                value={this.props.startDateFrom}
                                title="Start Date - From"
                                onChange={(e) => this.props.updateState(e.target.value, "startDateFrom")}
                                max={this.props.startDateTo ? new Date(this.props.startDateTo) : undefined}
                            />
                        </div>
                        <div className="col-12 col-sm-6 mt-2 mt-sm-0">
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="startDateTo"
                                formatPlaceholder="formatPattern"
                                value={this.props.startDateTo}
                                title="Start Date - To"
                                onChange={(e) => this.props.updateState(e.target.value, "startDateTo")}
                                min={this.props.startDateFrom ? new Date(this.props.startDateFrom) : undefined}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 mt-2">
                    <div className="row">
                        <div className="col-12">
                            <label className="mb-1 font-weight-bold">End Date</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="endDateFrom"
                                formatPlaceholder="formatPattern"
                                value={this.props.endDateFrom}
                                title="End Date - From"
                                onChange={(e) => this.props.updateState(e.target.value, "endDateFrom")}
                                //min={new Date(this.props.startDateFrom)}
                                max={this.props.endDateTo ? new Date(this.props.endDateTo) : undefined}
                            />
                        </div>
                        <div className="col-12 col-sm-6 mt-2 mt-sm-0 ">
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="endDateTo"
                                formatPlaceholder="formatPattern"
                                title="End Date - To"
                                onChange={(e) => this.props.updateState(e.target.value, "endDateTo")}
                                value={this.props.endDateTo}
                                //min={new Date(this.props.startDateTo)}
                                min={this.props.endDateFrom ? new Date(this.props.endDateFrom) : undefined}
                            />
                        </div>
                    </div>
                </div>
                </React.Fragment>
        );
    }
}

export default DateSelector;
