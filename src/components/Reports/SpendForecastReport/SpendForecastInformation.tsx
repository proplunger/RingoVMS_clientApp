import * as React from "react";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Forecast_Month } from "../../Shared/Search/searchFieldsOptions";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../../ReusableComponents";

export interface SpendForecastInformationProps {
    data: any;
    handleChange: any;
    generateForecast: any;
    handleReset: any;
    dataState?: any;
}

export interface SpendForecastInformationState {
    forecastMonthData: any;
    showLoader?: boolean;
}

class SpendForecastInformation extends React.Component<SpendForecastInformationProps, SpendForecastInformationState> {
    constructor(props: SpendForecastInformationProps) {
        super(props);
        this.state = {
            forecastMonthData: Forecast_Month,
            showLoader: false,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.restrictDatesEntry();
    }

    restrictDatesEntry = () => {
        if (document.getElementsByName('startDate') && document.getElementsByName('startDate')[0]) {
            document.getElementsByName('startDate')[0]['disabled'] = true;
            document.getElementsByName('endDate')[0]['disabled'] = true;
        }
    }

    handleFilterChange(event) {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    render() {
        const { data } = this.props;
        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {this.state.showLoader &&
                            Array.from({ length: 3 }).map((item, i) => (
                                <div className="row mx-auto mt-2" key={i}>
                                    {Array.from({ length: 3 }).map((item, j) => (
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                            <Skeleton width={100} />
                                            <Skeleton height={30} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        {!this.state.showLoader && (
                            <div>
                                <div className="row mt-2 mx-0">
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold ">Start Date</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="startDate"
                                            value={data.startDate !=undefined && data.startDate != null ? new Date(data.startDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            max={data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate() - 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold ">End Date</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="endDate"
                                            value={data.endDate !=undefined && data.endDate != null ? new Date(data.endDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                        <label className="mb-1 font-weight-bold">
                                            % of Base Forecast
                                        </label>
                                        <input
                                            type="number"
                                            name="ServiceTypePercent"
                                            className="form-control disabled"
                                            placeholder="Type here..."
                                            value={data.ServiceTypePercent}
                                            maxLength={2}
                                            onChange={(e) => this.props.handleChange(e)}
                                            />
                                            {(!data.ServiceTypePercent || data.ServiceTypePercent==undefined 
                                            && data.ServiceTypePercent==null || data.ServiceTypePercent < 0) 
                                            && <ErrorComponent message="% of Base Forecast must be greater than or equal to zero." />}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer justify-content-center border-0">
                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.props.handleReset()}>
                            <FontAwesomeIcon icon={faUndo} className={"mr-1"} /> Clear
                        </button>
                        <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.props.generateForecast(this.props.dataState)}>
                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Run
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpendForecastInformation;