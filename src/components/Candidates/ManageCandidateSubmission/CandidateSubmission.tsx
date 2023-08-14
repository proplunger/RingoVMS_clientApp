import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, ReqStatusWithoutStatusCardCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, CustomCell, DetailColumnCell, ViewMoreComponent, CandNumberCell } from "./CandidateCells";
import { NumberCell, KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import "./CandidateSubmission.css";
import PageTitle from "../../Shared/Title";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { initialDataState } from "../../../HelperMethods";

export interface CandidateSubmissionsProps { }

export interface CandidateSubmissionsState {
    search: string;
    data: any;
    clientId: string;
    vendorId: string;
    dataState: any;
    showLoader?: boolean;
    totalCount?: number;
    onFirstLoad: boolean;
}

class CandidateSubmissions extends React.Component<CandidateSubmissionsProps, CandidateSubmissionsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    constructor(props: CandidateSubmissionsProps) {
        super(props);
        this.state = {
            search: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getCandidateSubmissions = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        var queryProps = this.candidateQuery();
        var apiUrl = queryProps[0];
        var queryParams = queryProps[1];

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`${apiUrl}${finalQueryString}`).then((res) => {
            this.setState({
                dataState: dataState,
                data: res.data,
                showLoader: false,
            });
            this.getCandidateSubmissionsCount(dataState);
        });
    };

    openModal = (prop, reqId) => {
        let change = {};
        change[prop] = true;
        this.setState(change);
        this.reqId = reqId;
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getCandidateSubmissions(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0">
                <PageTitle title="Candidate Submission" />
                <div className="container-fluid">
                    <CompleteSearch
                        page="CandidateSubmission"
                        entityType="Candidate"
                        onFirstLoad={this.state.onFirstLoad}
                        handleSearch={this.getCandidateSubmissions}
                    />
                    <div className="candidateSubmissionContainer" id="candidateSubmissionContainer-date">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="location"
                                //width="250px"
                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Location")}
                            />
                            <GridColumn
                                field="position"
                                //width="150px"
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="totalRequired"
                                title="Required"
                                filter="numeric"
                                columnMenu={ColumnMenu}
                                cell={(props) => NumberCell(props, "Required")}
                            />
                            <GridColumn
                                field="submitted"
                                title="Submitted"
                                filter="numeric"
                                columnMenu={ColumnMenu}
                                cell={(props) => NumberCell(props, "Submitted")}
                            />
                            <GridColumn field="reqNumber" title="Req#" cell={CandNumberCell} columnMenu={ColumnMenu} />
                            <GridColumn
                                field="startDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                width="110px"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                width="110px"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                            />
                            <GridColumn field="status" title="Status" columnMenu={ColumnMenu} cell={ReqStatusWithoutStatusCardCell} />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="40px"
                                cell={CustomCell({ openConfirm: this.openModal })}
                                headerCell={() => CustomMenu(this.state.data)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }

    // To be removed
    getCandidateSubmissionsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;

        var queryProps = this.candidateQuery();
        var apiUrl = queryProps[0];
        var queryParams = queryProps[1];

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`${apiUrl}${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    private candidateQuery() {
        let apiUrl = 'api/requisitions?';
        let queryParams;
        // let queryParams = `status eq 'Released'`;
        if (this.state.clientId) {
            // queryParams = `${queryParams} and clientId eq ${this.state.clientId}`
            queryParams = `clientId eq ${this.state.clientId}`
        }
        if (this.state.vendorId) {
            apiUrl = 'api/requisitions/candidatesubmissions?';
            // queryParams = `${queryParams} and vendorUserId eq ${this.state.vendorId}`;
            queryParams = `vendorUserId eq ${this.state.vendorId}`;
        }

        return [apiUrl, queryParams];
    }
}

export default CandidateSubmissions;
