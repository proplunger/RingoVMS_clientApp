import React from "react";

import Skeleton from "react-loading-skeleton";

import {
    DatePicker,
    DatePickerChangeEvent,
} from "@progress/kendo-react-dateinputs";

import { successToastr } from "../../../../HelperMethods";
import { ErrorComponent } from "../../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

export interface RunCBIProps {
    onCloseModal?: any;
}
export interface RunCBIState {
    showLoader?: boolean;
    startDate: any;
    endDate: any;
    poCenter: string;
}
export default class RunCBIModal extends React.Component<RunCBIProps, RunCBIState> {
    isSaveClicked: boolean;
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            startDate: null,
            endDate: null,
            poCenter: "",
        };
    }
    handleChange(e): void {
        let { name, value, type } = e.target;
        this.state[name] = value;
        this.setState(this.state);
    }

    RunCBI = () => {
        const { startDate, endDate, poCenter } = this.state;
        this.isSaveClicked = true;
        let data = {

        }
        if (startDate != null && startDate != undefined && endDate != null && endDate != undefined && poCenter != "" && poCenter != null) {

        }
        else {
            this.setState(this.state);
        }

    }
    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">

                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Run Consolidated Billing Invoice
                          </h4>
                        <button
                            type="button"
                            className="close text-white close_opacity"
                            data-dismiss="modal"
                            onClick={this.props.onCloseModal}
                        >
                            &times;
            </button>
                    </div>

                    {this.state.showLoader &&
                        Array.from({ length: 2 }).map((item, i) => (
                            <div className="row col-12 mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div
                                        className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                                        key={j}
                                    >
                                        <Skeleton width={100} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div className="col-12 mt-3">
                            <div className="row">
                                <div className="col-12 mt-0">
                                    <div className="row">
                                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                                            <label className={`mb-1 font-weight-bold`}>
                                                Start Billing Date
                                            </label>

                                            <DatePicker
                                                className="form-control release-date-ddl kendo-Tabledatepicker"
                                                format="MM/dd/yyyy"
                                                name="startDate"
                                                value={this.state.startDate}
                                                onChange={(e) => this.handleChange(e)}
                                                formatPlaceholder="formatPattern"
                                            />
                                            {this.isSaveClicked &&
                                                (this.state.startDate==undefined ||
                                                    this.state.startDate==null) && <ErrorComponent />}
                                        </div>

                                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                                            <label className={`mb-1 font-weight-bold`}>
                                                End Billing Date
                                        </label>

                                            <DatePicker
                                                className="form-control release-date-ddl kendo-Tabledatepicker"
                                                format="MM/dd/yyyy"
                                                name="endDate"
                                                value={this.state.endDate}
                                                onChange={(e) => this.handleChange(e)}
                                                formatPlaceholder="formatPattern"
                                            />
                                            {this.isSaveClicked &&
                                                (this.state.endDate==undefined ||
                                                    this.state.endDate==null) && <ErrorComponent />}
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                                            <label className={`mb-1 font-weight-bold`}>
                                                PO / Cost Center
                                        </label>
                                            <input
                                                className="form-control"
                                                name="poCenter"
                                                onChange={(e) => this.handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-12">
                        <div className="col-sm-12 col-12 p-2">
                            <div className="row text-center">
                                <div className="col-12 mt-4 mb-4 heello">
                                    <div className="row ml-sm-0 mr-sm-0 justify-content-center">
                                        <button
                                            type="button"
                                            className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                            onClick={this.props.onCloseModal}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTimesCircle}
                                                className={"mr-1"}
                                            />
                                         Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                            onClick={this.RunCBI}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}
                                                className={"mr-1"}
                                            />
                                            Run CBI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
