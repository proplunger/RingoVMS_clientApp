import * as React from "react";
import axios from "axios";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { KendoFilter } from "../../../ReusableComponents";
import { dateFormatter, initialDataState } from "../../../../HelperMethods";

export interface CandidateVendorMappingProps {
    candidateId?: string;
    vendorId?:string;
}

export interface CandidateVendorMappingState {
    data: any;
    showLoader?: boolean;
    dataItem?: any;
    dataState: any;
    showRejectModal?: boolean;
    showApproveModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    totalCount?: any;
}

class CandidateVendorMapping extends React.Component<CandidateVendorMappingProps, CandidateVendorMappingState> {
    constructor(props: CandidateVendorMappingProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            showLoader: true,
        };
    }

    componentDidMount() {
        this.getCandVendorMap(this.state.dataState);
    }

    getCandVendorMap = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        const queryParams = `candidateId eq ${this.props.candidateId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        this.setState({ showLoader: true });
        axios.get(`api/candidates/candvendormap?${finalQueryString}`).then((res) => {
            console.log("res.data", res.data,this.props.vendorId);
            
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState
            });
            this.getCandShareRequestCount(dataState);
        });
    };

    getCandShareRequestCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        const queryParams = `candidateId eq ${this.props.candidateId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        axios.get(`api/candidates/candvendormap?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length
            });
        });
    };
    onDataStateChange = (changeEvent) => {
        this.getCandVendorMap(changeEvent.data);
    };


    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="myOrderContainer gridshadow ">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            pageable={{ pageSizes: true }}
                            total={this.state.totalCount}
                            onDataStateChange={this.onDataStateChange}
                            data={this.state.data.filter(x => x.vendorId !=this.props.vendorId)}
                            {...this.state.dataState}
                            className="kendo-grid-custom lastchild global-action-grid-onlyhead"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="vendor"
                                title="Vendor Name"
                                cell={(props) => CellRender(props, "Vendor Name")}
                                columnMenu={ColumnMenu}
                            />

                            <GridColumn
                                field="createdDate"
                                title="Associated Date"
                                headerClassName="text-left"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Share Date"}
                                            className="text-left"
                                            title={props.dataItem.hours}
                                        >
                                            {props.dataItem.createdDate ? dateFormatter(props.dataItem.createdDate) : "-"}
                                        </td>
                                    );
                                }}
                            //cell={(props) => CellRender(props, "Share Date")}
                            />
                        </Grid>

                    </div>
                </div>
            </div>
        );
    }
}
export default CandidateVendorMapping;
