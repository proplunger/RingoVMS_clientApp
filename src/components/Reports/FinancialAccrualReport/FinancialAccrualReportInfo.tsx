import * as React from "react";
import { filterBy, toODataString } from "@progress/kendo-data-query";
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
import { ALLSELECTED } from "./GlobalActions";
import auth from "../../Auth";
import clientAdminService from "../../Admin/ClientAdmin/Service/DataService";

import _ from "lodash";

const CustomDropDownList = withValueField(DropDownList);

export interface FinancialAccrualInfoProps {
    data: any;
    handleChange: any;
    generateReport: any;
    handleReset: any;
    dataState?: any;
}

export interface FinancialAccrualInfoState {
    clientId: any;
    forecastMonthData: any;
    showLoader?: boolean;
    selectedAssociate?: any;
    associates: Array<IDropDownModel>;
    vendors: Array<IDropDownModel>;
    locations: any;
    originalassociates?: any;
    originalvendors?: any;
    originallocations?: any;
    associateId?: any;
    flag?: boolean;
    dataState?: any;
    isAllProviderSelected?: any;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class FinancialAccrualInfo extends React.Component<FinancialAccrualInfoProps, FinancialAccrualInfoState> {
    constructor(props: FinancialAccrualInfoProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            forecastMonthData: Forecast_Month,
            showLoader: false,
            associates: [],
            vendors: [],
            locations: [],
            originalassociates: [],
            originalvendors: [],
            originallocations: [],
            flag: false,
            dataState: initialDataState
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.restrictDatesEntry();
        this.getAssociates();
        this.getAssociatedVendors();
        this.getLocations();
    }

    getAssociates = () => {
        const queryParams = `$orderby=name`;
        axios.get(`api/candidates/candidateslisttype?${queryParams}`).then((res) => {
            res.data.unshift({
                name: ALLSELECTED.ALLPROVIDERS,
                id: 9999,
            });

            this.setState({
                associates: res.data,
                originalassociates: res.data
            })
        });
    };

    getAssociatedVendors = () => {
        const queryParams = `status eq 'Active'&$orderby=vendor`;
        axios.get(`api/clients/${this.state.clientId}/vendor?$filter=${queryParams}`)
            .then(async res => {
                res.data.unshift({
                    vendor: ALLSELECTED.ALLVENDORS,
                    vendorId: 9999,
                });
                this.setState({
                    vendors: res.data,
                    originalvendors: res.data
                });
            });
    }

    getLocations = () => {
        let queryParams = `$filter=clientId eq ${this.state.clientId} and status eq 'Active'&$orderby=location`
        clientAdminService.getLocations(queryParams).then((res) => {
            res.data.unshift({
                location: ALLSELECTED.ALLLOCATIONS,
                clientDivLocId: 9999,
            });
            this.setState({ locations: _.uniqBy(res.data, 'clientDivLocId'), originallocations: _.uniqBy(res.data, 'clientDivLocId') });
        });
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
            associates: filterBy(this.state.originalassociates.slice(), event.filter)
        });
    }

    itemRender = (li, itemProps) => {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    checked={itemProps.dataItem.name==ALLSELECTED.ALLPROVIDERS ? this.props.data.isAllProviderSelected :
                        itemProps.dataItem.name==ALLSELECTED.ALLLOCATIONS ? this.props.data.isAllLocSelected :
                            itemProps.dataItem.name==ALLSELECTED.ALLVENDORS ? this.props.data.isAllVendorSelected :
                                itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    handleDropdownChange = (e, type) => {

        let defaultText = ''
        var isAllSelected = false;
        let selectedAssociates = [];
        if (type==ALLSELECTED.ALLPROVIDERS) {
            defaultText = ALLSELECTED.ALLPROVIDERS;
            selectedAssociates = e.value.filter((x) => x.id !=undefined && x.id !=null && x.id !=9999);
        } else if (type==ALLSELECTED.ALLLOCATIONS) {
            defaultText = ALLSELECTED.ALLLOCATIONS;
            selectedAssociates = e.value.filter((x) => x.clientDivLocId !=undefined && x.clientDivLocId !=null && x.clientDivLocId !=9999);
        } else if (type==ALLSELECTED.ALLVENDORS) {
            defaultText = ALLSELECTED.ALLVENDORS;
            selectedAssociates = e.value.filter((x) => x.vendorId !=undefined && x.vendorId !=null && x.vendorId !=9999);
        }

        if (e.nativeEvent.target.innerText.trim() ==defaultText
            || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
                && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
                && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==defaultText)) {
            if ((type==ALLSELECTED.ALLPROVIDERS && !this.props.data.isAllProviderSelected) || (type==ALLSELECTED.ALLLOCATIONS && !this.props.data.isAllLocSelected) ||
                (type==ALLSELECTED.ALLVENDORS && !this.props.data.isAllVendorSelected) ) {

                isAllSelected = true;

                if (type==ALLSELECTED.ALLPROVIDERS) {
                    selectedAssociates = this.state.associates;
                } else if (type==ALLSELECTED.ALLLOCATIONS) {
                    selectedAssociates = this.state.locations;
                } else if (type==ALLSELECTED.ALLVENDORS) {
                    selectedAssociates = this.state.vendors;
                }

            } else {
                
                selectedAssociates = [];
            }
        } else {
            if (type==ALLSELECTED.ALLPROVIDERS && selectedAssociates.length==(this.state.associates.length - 1)) {
                selectedAssociates.unshift({ name: defaultText, id: 9999 });
                isAllSelected = true;
            } else if (type==ALLSELECTED.ALLVENDORS && selectedAssociates.length==(this.state.vendors.length - 1)) {
                selectedAssociates.unshift({ name: defaultText, vendorId: 9999 });
                isAllSelected = true;
            } else if (type==ALLSELECTED.ALLLOCATIONS && selectedAssociates.length==(this.state.locations.length - 1)) {
                selectedAssociates.unshift({ name: defaultText, clientDivLocId: 9999 });
                isAllSelected = true;
            }
        }

        if (type==ALLSELECTED.ALLPROVIDERS) {
            this.props.handleChange({
                selectedAssociates: selectedAssociates,
                isAllProviderSelected: isAllSelected,
            });
        } else if (type==ALLSELECTED.ALLLOCATIONS) {
            this.props.handleChange({
                selectedLocations: selectedAssociates,
                isAllLocSelected: isAllSelected,
            });
        } else if (type==ALLSELECTED.ALLVENDORS) {
            this.props.handleChange({
                selectedVendors: selectedAssociates,
                isAllVendorSelected: isAllSelected,
            });
        }

    };

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
                                        <label className="mb-1 font-weight-bold required">Assignment Start Date</label>
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
                                            && <ErrorComponent message="Select assignment start date" />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                                        <label className="mb-1 font-weight-bold required">Assignment End Date</label>
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
                                            && <ErrorComponent message="Select assignment end date" />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold">
                                            Location
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.locations}
                                            onChange={(e) => this.handleDropdownChange(e, ALLSELECTED.ALLLOCATIONS)}
                                            value={data.selectedLocations}
                                            autoClose={false}
                                            name={"locations"}
                                            textField="location"
                                            dataItemKey="clientDivLocId"
                                            id="locations"
                                            itemRender={this.itemRender}
                                            placeholder="Select Location Name"
                                            onFilterChange={this.handleFilterChange}
                                            filterable={this.state.originallocations.length > 5 ? true : false}
                                        />
                                        {/* {(!data.selectedLocations || data.selectedLocations==undefined || data.selectedLocations==null || data.selectedLocations.length ==0) && this.state.flag==true
                                            && <ErrorComponent message="Select at least one location" />} */}
                                    </div>
                                </div>
                                <div className="row mt-2 mx-0">
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold">
                                            Vendor
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.vendors}
                                            onChange={(e) => this.handleDropdownChange(e, ALLSELECTED.ALLVENDORS)}
                                            value={data.selectedVendors}
                                            autoClose={false}
                                            name={"vendors"}
                                            textField="vendor"
                                            dataItemKey="id"
                                            id="vendors"
                                            itemRender={this.itemRender}
                                            placeholder="Select Vendor Name"
                                            onFilterChange={this.handleFilterChange}
                                            filterable={this.state.originalvendors.length > 5 ? true : false}
                                        />
                                        {/* {(!data.selectedVendors || data.selectedVendors==undefined || data.selectedVendors==null || data.selectedVendors.length ==0) && this.state.flag==true
                                            && <ErrorComponent message="Select at least one vendor" />} */}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold">
                                            Provider
                                        </label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            data={this.state.associates}
                                            onChange={(e) => this.handleDropdownChange(e, ALLSELECTED.ALLPROVIDERS)}
                                            value={data.selectedAssociates.filter((x) => x.id !=9999)}
                                            autoClose={false}
                                            name={"associates"}
                                            textField="name"
                                            dataItemKey="id"
                                            id={"associates"}
                                            itemRender={this.itemRender}
                                            placeholder="Select Provider Name"
                                            onFilterChange={this.handleFilterChange}
                                            filterable={this.state.originalassociates.length > 5 ? true : false}
                                        />
                                        {/* {(!data.selectedAssociates || data.selectedAssociates==undefined || data.selectedAssociates==null || data.selectedAssociates.length ==0) && this.state.flag==true
                                            && <ErrorComponent message="Select at least one provider" />} */}
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
                                this.props.generateReport(this.props.dataState)
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

export default FinancialAccrualInfo;