import * as React from "react";
import { ErrorComponent } from "../../../ReusableComponents";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { AuthRoleType, isRoleType } from "../../../Shared/AppConstants";


export interface ExtensionInformationProps {
    data: any;
    handleChange: any;
}

export interface ExtensionInformationState {
}

class ExtensionInformation extends React.Component<ExtensionInformationProps, ExtensionInformationState> {
    constructor(props: ExtensionInformationProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        const { data } = this.props;
        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {data.showLoader &&
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
                        {!data.showLoader && (
                            <div>
                                <div className="row mt-2 mx-0">
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color text-box-disbaled ">
                                        <label className="mb-1 font-weight-bold required">Extension Start Date</label>
                                        <DatePicker
                                            disabled={data.candSubExtId != null && data.candSubExtId != undefined ? true : false}
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="extStartDate"
                                            value={data.extStartDate ? new Date(data.extStartDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(data.jobEndDate).setDate(new Date(data.jobEndDate).getDate() + 1))}
                                        />
                                        {data.submitted && (data.extStartDate==undefined || data.extStartDate==null) && <ErrorComponent />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
                                        <label className="mb-1 font-weight-bold required">Extension End Date</label>
                                        <DatePicker
                                            disabled={data.candSubExtId != null && data.candSubExtId != undefined ? true : false}
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="extEndDate"
                                            value={data.extEndDate ? new Date(data.extEndDate) : null}
                                            onChange={(e) => this.props.handleChange(e)}
                                            formatPlaceholder="formatPattern"
                                            min={new Date(new Date(data.extStartDate).setDate(new Date(data.extStartDate).getDate() + 1))}
                                        />
                                        {data.submitted && (data.extEndDate==undefined || data.extEndDate==null) && <ErrorComponent />}
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                        <label className="mb-1 font-weight-bold ">Special Terms</label>
                                        <textarea
                                            disabled={data.candSubExtId != null && data.candSubExtId != undefined && (data.isView==true || isRoleType(AuthRoleType.Client)) ? true : false}
                                            rows={3}
                                            name="specialTerms"
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.specialTerms}
                                            maxLength={2000}
                                            className="form-control"
                                            placeholder="Enter Special Terms"
                                        />
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

export default ExtensionInformation;