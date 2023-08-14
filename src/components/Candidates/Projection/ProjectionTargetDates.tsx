import * as React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CREATE_PROJECTION_GENERATE_CONFIRMATION_MSG } from "../../Shared/AppMessages";
import ProjectionConfirmationModal from "../../Shared/ProjectionConfirmationModal";
import { ErrorComponent } from "../../ReusableComponents";

export interface ProjectionTargetDatesProps {
    data: any;
    handleChange: any;
    showLoader?: boolean;
    generateProjection?: boolean;
    handleGenerateProjections?: any;
    reqDates?:{
        reqStartDate?:any;
        reqEndDate?:any
        }
}

export interface ProjectionTargetDatesState {
    showGenerateProjectionModal?: boolean;
}

class ProjectionTargetDates extends React.Component<ProjectionTargetDatesProps, ProjectionTargetDatesState> {
    constructor(props: ProjectionTargetDatesProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.restrictDatesEntry();
    }

    restrictDatesEntry = () => {
        if (document.getElementsByName('targetStartDate') && document.getElementsByName('targetStartDate')[0]) {
            document.getElementsByName('targetStartDate')[0]['disabled'] = true;
            document.getElementsByName('targetEndDate')[0]['disabled'] = true;
        }
    }

    render() {
        const { data } = this.props;
        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {this.props.showLoader &&
                            Array.from({ length: 2 }).map((item, i) => (
                                <div className="row mx-auto mt-2" key={i}>
                                    {Array.from({ length: 3 }).map((item, j) => (
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                            <Skeleton width={100} />
                                            <Skeleton height={30} />
                                        </div>
                                    ))}
                                </div>
                            ))
                        }
                        {!this.props.showLoader && (
                            <div className="row text-dark">
                                <div className="col-12">
                                    <div className="row mx-auto d-flex justify-content-start">
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
                                            <label className="mb-2 text-dark font-weight-bold required">
                                                Target Start Date
                                            </label>
                                            <DatePicker
                                                className="form-control"
                                                format="MM/dd/yyyy"
                                                name="targetStartDate"
                                                value={data.targetStartDate !=undefined && data.targetStartDate != null ? new Date(data.targetStartDate) : null}
                                                onChange={(e) => this.props.handleChange(e)}
                                                formatPlaceholder="formatPattern"
                                                max={data.targetEndDate ? new Date(new Date(data.targetEndDate).setDate(new Date(data.targetEndDate).getDate() - 1)) :
                                                    this.props.reqDates.reqEndDate
                                                }
                                                min={this.props.reqDates.reqStartDate}
                                            />
                                            {data.targetDateError && data.targetStartDate==null ? 
                                                <ErrorComponent/> : null}  
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                            <label className="mb-2 text-dark font-weight-bold required">
                                                Target End Date
                                            </label>
                                            <DatePicker
                                                className="form-control"
                                                format="MM/dd/yyyy"
                                                name="targetEndDate"
                                                value={data.targetEndDate !=undefined && data.targetEndDate != null ? new Date(data.targetEndDate) : null}
                                                onChange={(e) => this.props.handleChange(e)}
                                                formatPlaceholder="formatPattern"
                                                //min={new Date(new Date(data.targetStartDate).setDate(new Date(data.targetStartDate).getDate() + 1))}
                                                min={this.props.reqDates.reqStartDate}
                                                max={this.props.reqDates.reqEndDate}
                                                />
                                            {data.targetDateError && data.targetEndDate==null ? 
                                                <ErrorComponent/> : null}                                         
                                        </div>
                                        {this.props.generateProjection==true && (
                                            <div className="col-12 col-sm-4 col-lg-4 mt-1">
                                                <label className="marginbtn font-weight-bold required invisible d-block pl-1">
                                                    Assignment
                                                </label>
                                                <button
                                                    type="button"
                                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                                    onClick={() => {
                                                        this.setState({ showGenerateProjectionModal: true });
                                                    }}
                                                    disabled={!(data.targetStartDate && data.targetEndDate)}
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} />{" "}
                                                    Generate Forecast
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {this.state.showGenerateProjectionModal && (
                    <ProjectionConfirmationModal
                        message={CREATE_PROJECTION_GENERATE_CONFIRMATION_MSG()}
                        showModal={this.state.showGenerateProjectionModal}
                        handleYes={() => this.props.handleGenerateProjections()}
                        handleNo={() => {
                            this.setState({ showGenerateProjectionModal: false });
                        }}
                        hours={data.hours}
                        projectedStartDate={data.projectedStartDate}
                        projectedEndDate={data.projectedEndDate}
                        targetStartDate={data.targetStartDate}
                        targetEndDate={data.targetEndDate}
                        handleChange={(e) => this.props.handleChange(e)}
                    />
                )}
            </div>
        );
    }
}

export default ProjectionTargetDates;