import * as React from "react";
import { State, filterBy, toODataString } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Forecast_Month } from "../../Shared/Search/searchFieldsOptions";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../../ReusableComponents";
import { DropDownList, MultiSelect, MultiSelectChangeEvent, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import withValueField from "../../Shared/withValueField";
import { getSubmittedCandidates } from "../../Vendor/VendorService/Services";
import axios from "axios";
import auth from "../../Auth";
import { ConfirmStatusIntId } from "../../Shared/AppConstants";

const defaultItem = { cnfStatus: "Select..", id: null };

export interface ConfirmationAssignmentReportInformationProps {
    data: any;
    handleChange: any;
    generateAssociate: any;
    handleReset: any;
    dataState?: any;
    handleChangeCnfStatus?: any;
}

export interface ConfirmationAssignmentReportInformationState {
    clientId: any;
    forecastMonthData: any;
    showLoader?: boolean;
    selectedAssociate?: any;
    provider: Array<IDropDownModel>;
    originalProviderData?: any;
    associateId?: any;
    flag?: boolean;
    associatedVendor: Array<IDropDownModel>;
    originalAssociatedVendor?: any;
    dataState?:any;
    cnfStatus?:any;
    originalCnfStatus?:any;
}
const initialDataState = {
    skip: 0,
    take: 50,
};
class ConfirmationAssignmentReportInformation extends React.Component<ConfirmationAssignmentReportInformationProps, ConfirmationAssignmentReportInformationState> {
    originalLevels: any;
    constructor(props: ConfirmationAssignmentReportInformationProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            forecastMonthData: Forecast_Month,
            showLoader: false,
            provider: [],
            associatedVendor:[],
            originalProviderData: [],
            flag: false,
            dataState: initialDataState
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.restrictDatesEntry();
        this.getAssociates();
        this.getAssociatedVendors(this.state.dataState);
        this.getConfirmStatus();
    }

    getAssociates = () => {
        axios.get(`api/candidates/candidateslisttype`).then((res) =>
            this.setState({
                provider: res.data,
                originalProviderData: res.data
            })
        );
    };

    getConfirmStatus = () => {
        axios.get(`api/candidates/confirmstatus?&$filter=intId ne ${ConfirmStatusIntId.Active} and intId ne ${ConfirmStatusIntId.Expired}`).then((res) =>
            this.setState({
                cnfStatus: res.data,
                originalCnfStatus: res.data
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
            provider: filterBy(this.state.originalProviderData.slice(), event.filter)
        });
    }
    handleAssociatedVendorChange = (event: MultiSelectFilterChangeEvent) => {
        this.setState({
            associatedVendor: filterBy(this.state.originalAssociatedVendor.slice(), event.filter)
        });
    }

    handleConfirmStatsusChange = (event: MultiSelectFilterChangeEvent) => {
        this.setState({
            cnfStatus: filterBy(this.state.originalCnfStatus.slice(), event.filter)
        });
    }

    getAssociatedVendors = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        axios.get(`api/clients/${this.state.clientId}/vendor?${queryStr}`)
            .then(async res => {
                this.setState({
                    associatedVendor: res.data,
                    originalAssociatedVendor: res.data
                });
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
                                        <label className="mb-1 font-weight-bold">
                                            Provider
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.provider}
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.provider}
                                            autoClose={false}
                                            name={"provider"}
                                            textField="name"
                                            dataItemKey="id"
                                            placeholder="Select Provider Name"
                                            onFilterChange={this.filterChange}
                                            filterable={true}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold">Assignment Start</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="startDate"
                                            value={data.startDate !=undefined && data.startDate != null ? new Date(data.startDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            // max={data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate() - 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold">Assignment End</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="endDate"
                                            value={data.endDate !=undefined && data.endDate != null ? new Date(data.endDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            // min={new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1))}
                                        />
                                    </div>

                                
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold mt-3">
                                            Vendor
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.associatedVendor}
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.associatedVendor}
                                            autoClose={false}
                                            name={"associatedVendor"}
                                            textField="vendor"
                                            dataItemKey="id"
                                            placeholder="Select Vendor Name"
                                            onFilterChange={this.handleAssociatedVendorChange}
                                            filterable={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                        <label className="mb-1 font-weight-bold required mt-3">
                                            Confirm Status
                                        </label>
                                    {/* <DropDownList
                                        data={this.state.cnfStatus}
                                        className="form-control"
                                        textField="cnfStatus"
                                        dataItemKey="id"
                                        id="cnfStatus"
                                        name="cnfStatus"
                                        value={data.cnfStatus}
                                        defaultItem={defaultItem}
                                        onChange={(e) => this.props.handleChange(e)}
                                    /> */}
                                    <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.cnfStatus}
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.cnfStatus}
                                            autoClose={false}
                                            name={"cnfStatus"}
                                            textField="cnfStatus"
                                            dataItemKey="id"
                                            placeholder="Select Confirm Status"
                                            onFilterChange={this.handleConfirmStatsusChange}
                                            filterable={true}
                                        />
                                    {(!data.cnfStatus || data.cnfStatus==undefined || data.cnfStatus==null || data.cnfStatus.length ==0) && this.state.flag==true
                                            && <ErrorComponent message="Please select confirm Status" />}
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

export default ConfirmationAssignmentReportInformation;