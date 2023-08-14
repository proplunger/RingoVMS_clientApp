import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";

export interface ProjectionConfirmationModalProps {
    showModal: boolean;
    message: any;
    handleYes: any;
    handleNo: any;
    showError?: boolean;
    errorMessage?: boolean;
    hours?: any;
    projectedStartDate?: any;
    projectedEndDate?: any;
    targetStartDate?: any;
    targetEndDate?: any;
    handleChange?: any;
}

export interface ProjectionConfirmationModalState {
    showModal: boolean;
}

export class ProjectionConfirmationModal extends React.Component<ProjectionConfirmationModalProps, ProjectionConfirmationModalState> {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    componentDidMount() {
        this.restrictDatesEntry();
    }

    restrictDatesEntry = () => {
        if (document.getElementsByName('projectedStartDate') && document.getElementsByName('projectedStartDate')[0]) {
            document.getElementsByName('projectedStartDate')[0]['disabled'] = true;
            document.getElementsByName('projectedEndDate')[0]['disabled'] = true;
        }
    }

    render() {
        return (
            <div className="">
                {this.props.showModal && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-sm-7 col-xl-4 shadow containerDialoginside">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        Generate Forecast
                                        <span className="float-right" onClick={this.props.handleNo}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-12 text-dark mt-4 pl-2 pr-2">{this.props.message}</div>
                                </div>

                                <div className="row ml-0 mr-0 mt-3">
                                    <div className="col-6 mt-sm-2">
                                        <label className="mb-2 text-dark font-weight-bold">
                                            Hours
                                        </label>
                                        <NumericTextBox
                                            className="form-control"
                                            value={(isNaN(this.props.hours)) ? 0 : this.props.hours}
                                            min={0}
                                            max={99999}
                                            name="hours"
                                            onChange={(e) => this.props.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="row mx-0 ">
                                    <div className="col-12 col-sm-12 col-lg-6 mt-sm-3 mt-1 cal-icon-color">
                                        <label className="mb-2 text-dark font-weight-bold">
                                            Forecast Start Date
                                        </label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="projectedStartDate"
                                            value={this.props.projectedStartDate !=undefined && this.props.projectedStartDate != null ? new Date(this.props.projectedStartDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(this.props.targetStartDate).setDate(new Date(this.props.targetStartDate).getDate()))}
                                            max={this.props.targetEndDate ? new Date(new Date(this.props.targetEndDate).setDate(new Date(this.props.targetEndDate).getDate())) :
                                                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                                            }
                                        />
                                    </div>
                                    <div className="col-12 col-sm-12 col-lg-6 mt-sm-3 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-2 text-dark font-weight-bold">
                                            Forecast End Date
                                        </label>
                                        <DatePicker
                                            //disabled={!this.props.projectedStartDate}
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="projectedEndDate"
                                            value={this.props.projectedEndDate !=undefined && this.props.projectedEndDate != null ? new Date(this.props.projectedEndDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(this.props.projectedStartDate).setDate(new Date(this.props.projectedStartDate).getDate() + 1))}
                                            max={this.props.targetEndDate ? new Date(new Date(this.props.targetEndDate).setDate(new Date(this.props.targetEndDate).getDate())) :
                                                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row ml-0 mr-0">
                                    <div className="col-12 mt-4 mb-4 text-center font-regular">
                                        <button
                                            type="button"
                                            onClick={this.props.handleNo}
                                            className="btn button button-close mr-3 shadow mb-2 mb-xl-0 px-4">
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                            No
                                        </button>
                                        <button
                                            disabled={!(this.props.projectedStartDate && this.props.projectedEndDate && this.props.hours >= 0 && this.props.hours !=null)}
                                            type="button"
                                            onClick={this.props.handleYes}
                                            className="btn button button-bg shadow mb-2 mb-xl-0 px-4">
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ProjectionConfirmationModal;