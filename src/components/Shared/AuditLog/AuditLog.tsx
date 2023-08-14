import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { CompositeFilterDescriptor, toODataString, State } from "@progress/kendo-data-query";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import CommonDataService from "../Services/CommonDataService";
import { KendoFilter } from "../../ReusableComponents";
import ColumnMenu from "../GridComponents/ColumnMenu";
import { ExportExcelAuditLog } from "./GlobalActions";

export interface AuditLogProps {
    showDialog: boolean;
    handleNo: any;
    candSubmissionId?: string;
}

let initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};

let dataState = initialDataState;

export interface AuditLogState {
    filter: undefined;
    searchString: string;
    dataState?: any;
    data: any;
    totalCount?: any;
    showLoader?: boolean;
    totalAuditLog: any;
}

export default class AuditLog extends Component<AuditLogProps, AuditLogState> {
    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            searchString: "",
            dataState: initialDataState,
            data: [],
            showLoader: true,
            totalAuditLog: []
        };

        // this.searchComments = this.searchComments.bind(this);
    }

    componentDidMount() {
        this.getAuditLogs(initialDataState);
    }

    getAuditLogs = (dataState) => {
        var queryStr = `${toODataString(dataState)}`;

        const queryParams = `candSubmissionId eq ${this.props.candSubmissionId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        CommonDataService.getAuditLogsService(finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getAuditLogCount(dataState);
        });
    }

    getAuditLogCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        const queryParams = `candSubmissionId eq ${this.props.candSubmissionId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        CommonDataService.getAuditLogsService(finalQueryString).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalAuditLog: res.data,
            });
        });
    };

    searchComments = () => {
        if (this.state.searchString=="" || this.state.searchString==null) {
            var gridState = {
                ...this.state.dataState,
                skip: 0,
                filter: null,
            };
            this.getAuditLogs(`gridState`);
        } else {
            var filterObj: CompositeFilterDescriptor = {
                logic: "or",
                filters: this.searchFilterOperation(),
            };

            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: filterObj,
            };

            this.getAuditLogs(dataState);
        }
    };

    searchBtnChange = (e) => {
        var value = e.target.value;
        if (value==null || value=="") {
            var gridState = {
                ...this.state.dataState,
                filter: null,
            };
            this.getAuditLogs(gridState);
        }
        this.setState({ searchString: e.target.value });
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getAuditLogs(changeEvent.data);
    };

    render() {
        return (
            <div>
                {this.props.showDialog && (
                    <div className="containerDialog audit-log-popup">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-md-10 shadow containerDialoginside containerDialoginside-height">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        Audit Log
                                        <span className="float-right cursorElement" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 ">
                                        <div className="input-group mt-3">
                                            <input
                                                type="search"
                                                value={this.state.searchString}
                                                onChange={this.searchBtnChange.bind(this)}
                                                className="BorderSearch border-right-0 form-control placeholder-mobile searchText border-left-radius"
                                                title="Search Audit Log"
                                                placeholder="Search Audit Log"
                                                onKeyPress={(event) => {
                                                    if (event.key =="Enter") {
                                                        event.preventDefault();
                                                        this.searchComments();
                                                    }
                                                }}
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    style={{ border: "1px solid #109dd2" }}
                                                    className="btn btn-secondary BorderSearch border-left-0"
                                                    type="button"
                                                    onClick={(e) => this.searchComments()}
                                                >
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 pl-0 pr-0">
                                    <div className="row mx-auto align-items-center">
                                        <div className="col-12 text-right">
                                            {ExportExcelAuditLog(this.state.totalAuditLog)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid
                                        style={{ maxHeight: "400px" }}
                                        sortable={true}
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild font-weight-normal"
                                        data={this.state.data}
                                        {...this.state.dataState}
                                        expandField="expanded"
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={{ pageSizes: true }}
                                        total={this.state.totalCount}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                        <GridColumn
                                            field="fieldName"
                                            width="130px"
                                            title="Field"
                                            filter="text"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Field")}
                                        />
                                        <GridColumn
                                            field="oldValue"
                                            width="120px"
                                            title="Current Value"
                                            cell={(props) => CellRender(props, "Current Value")}
                                        />
                                        <GridColumn
                                            field="newValue"
                                            width="120px"
                                            title="New Value"
                                            cell={(props) => CellRender(props, "New Value")}
                                        />
                                        <GridColumn
                                            field="validFrom"
                                            width="95px"
                                            editor="date"
                                            title="Valid From"
                                            filter="date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Valid From", false, true)}
                                        />
                                        <GridColumn
                                            field="validTo"
                                            width="95px"
                                            editor="date"
                                            title="Valid To"
                                            filter="date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Valid To", false, true)}
                                        />
                                        <GridColumn
                                            field="createdBy"
                                            width="70px"
                                            title="Action By"
                                            cell={(props) => CellRender(props, "Action By")}
                                        />
                                    </Grid>
                                </div>
                                <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                                    <div className="col-12 text-center text-right font-regular">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                            Close
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

    public searchFilterOperation() {
        const { searchString } = this.state;
        let searchStrings = searchString !=null && searchString !=undefined ? searchString.toLowerCase() : "";
        var filterArray: Array<CompositeFilterDescriptor> = [
            {
                logic: "or",
                filters: [
                    {
                        field: "fieldName",
                        operator: "contains",
                        value: searchStrings,
                        ignoreCase: true,
                    },
                    {
                        field: "oldValue",
                        operator: "contains",
                        value: searchStrings,
                        ignoreCase: true,
                    },
                    {
                        field: "newValue",
                        operator: "contains",
                        value: searchStrings,
                        ignoreCase: true,
                    },
                    {
                        field: "createdBy",
                        operator: "contains",
                        value: searchStrings,
                        ignoreCase: true,
                    }
                ],
            },
        ];

        return filterArray;
    }

    

    // on cancel
    private onCancel() {
        this.props.handleNo();
        this.setState({ searchString: "", data: [] });
    }
}
