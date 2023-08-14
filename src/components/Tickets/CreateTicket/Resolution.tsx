import * as React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ticketService from "../Services/DataService";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

const CustomDropDownList = withValueField(DropDownList);

const defaultItem = { name: "Select...", id: null };

export interface ResolutionProps {
    data: any;
    ticketId: string;
    handleChange: any;
    handleObjChange: any;
    handleDropdownChange: any;
    isEdit?: boolean;
}

export interface ResolutionState {
    tktResolutionType: Array<IDropDownModel>;
    originaltktResolutionType: Array<IDropDownModel>;
    showLoader?: boolean;
}

class Resolution extends React.Component<ResolutionProps, ResolutionState> {
    constructor(props: ResolutionProps) {
        super(props);
        this.state = {
            tktResolutionType: [],
            originaltktResolutionType: [],
            showLoader: true,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        if(this.props.ticketId !=null){
            this.getTktResType();
        }
    }

    getTktResType = () => {
        let queryParams = `status eq 'Active'&$orderby=name`;
        ticketService.getResolutionType(queryParams).then((res) => {
            this.setState({
                tktResolutionType: res.data,
                originaltktResolutionType: res.data,
                showLoader: false
            }, () => {
                if (document.getElementsByName('resDate')) {
                    document.getElementsByName('resDate')[0]['disabled'] = true;
                }
            });
        });
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
                            Array.from({ length: 2 }).map((item, i) => (
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
                                <div className="row mt-3 mx-0">
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                        <label className="mb-1 font-weight-bold ">Resolution Type</label>
                                        <CustomDropDownList
                                            className={"form-control disabled"}
                                            data={this.state.tktResolutionType}
                                            valueField="id"
                                            name={`tktResolutionTypeId`}
                                            textField="name"
                                            id="tktResolutionType"
                                            value={data.tktResolutionTypeId}
                                            defaultItem={defaultItem}
                                            onChange={(e) => this.props.handleDropdownChange(e)}
                                            filterable={this.state.originaltktResolutionType.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1" id="ShowDatePickerIcon">
                                        <label className="mb-1 font-weight-bold ">Resolution Date</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="resDate"
                                            value={data.resDate !=undefined && data.resDate != null ? new Date(data.resDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                        //min={new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                        <label className="mb-0 font-weight-bold">Resolution Details</label>
                                        <textarea
                                            rows={3}
                                            id=""
                                            maxLength={5000}
                                            value={data.resDetails}
                                            name="resDetails"
                                            className="form-control mt-1"
                                            placeholder="Enter Description"
                                            onChange={(e) => this.props.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3 mx-0">                                    
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                            <div className="row ml-1">
                                                <span className={`${this.props.isEdit ==true ? "" : "col-6 text-right"}`}>Closed Date :</span>
                                                <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-2 text-left word-break-div`}>{data.lastClosedDate ? `${dateFormatter(new Date(data.lastClosedDate))} ${convertShiftDateTime(data.lastClosedDate)}` : "-"}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                            <div className="row ml-1">
                                                <span className={`${this.props.isEdit ==true ? "" : "col-6 text-right"}`}>Closed By :</span>
                                                <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-2 text-left word-break-div`}>{data.lastClosedBy ? data.lastClosedBy : "-"}</div>
                                            </div>
                                        </div>                                  
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Resolution;