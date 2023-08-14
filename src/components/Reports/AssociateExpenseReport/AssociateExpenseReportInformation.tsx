import * as React from "react";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import { Forecast_Month } from "../../Shared/Search/searchFieldsOptions";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../../ReusableComponents";
import { DropDownList, MultiSelect, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import withValueField from "../../Shared/withValueField";
import axios from "axios";

const CustomDropDownList = withValueField(DropDownList);

export interface AssociateExpenseInformationProps {
    data: any;
    handleChange: any;
    generateAssociate: any;
    handleReset: any;
    dataState?: any;
}

export interface AssociateExpenseInformationState {
    forecastMonthData: any;
    showLoader?: boolean;
    selectedAssociate?: any;
    associates: Array<IDropDownModel>;
    originalAssociateData?: any;
    associateId?: any;
    flag?: boolean

}

class AssociateExpenseInformation extends React.Component<AssociateExpenseInformationProps, AssociateExpenseInformationState> {
    constructor(props: AssociateExpenseInformationProps) {
        super(props);
        this.state = {
            forecastMonthData: Forecast_Month,
            showLoader: false,
            associates: [],
            originalAssociateData: [],
            flag: false
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.restrictDatesEntry();
        this.getAssociates();
    }

    getAssociates = () => {
        axios.get(`api/candidates/candidateslisttype`).then((res) =>
            this.setState({
                associates: res.data,
                originalAssociateData: res.data
            })
        );
    };

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
        const data = this.state[originalArray];
        return filterBy(data, filter);
    }
    filterChange = (event: MultiSelectFilterChangeEvent) => {
        this.setState({
            associates: filterBy(this.state.originalAssociateData.slice(), event.filter)
        });
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
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold required">
                                            Associate
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.associates}
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.associate}
                                            autoClose={false}
                                            name={"associate"}
                                            textField="name"
                                            dataItemKey="id"
                                            placeholder="Select Associate Name"
                                            onFilterChange={this.filterChange}
                                            filterable={true}
                                        />
                                        {(!data.associate || data.associate==undefined || data.associate==null || data.associate.length ==0) && this.state.flag==true
                                            && <ErrorComponent message="Select at least one associate" />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold required">Expense Start Date</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="startDate"
                                            value={data.startDate !=undefined && data.startDate != null ? new Date(data.startDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            max={data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate() - 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                        />
                                        {(!data.startDate || data.startDate==undefined || data.startDate==null) && this.state.flag==true
                                            && <ErrorComponent message="Select Expense Start date" />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold required">Expense End Date</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="endDate"
                                            value={data.endDate !=undefined && data.endDate != null ? new Date(data.endDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1))}
                                        />
                                        {(!data.endDate || data.endDate==undefined || data.endDate==null) && this.state.flag==true
                                            && <ErrorComponent message="Select Expense End date" />}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer justify-content-center border-0">
                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.props.handleReset(this.props.dataState)}>
                            <FontAwesomeIcon icon={faUndo} className={"mr-1"} /> Clear
                        </button>
                        <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"

                            onClick={() => {
                                this.props.generateAssociate(this.props.dataState)
                                this.setState({ flag: true })
                            }}>

                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Run
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AssociateExpenseInformation;