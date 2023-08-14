import { toODataString } from "@progress/kendo-data-query";
import { Grid, GridNoRecords, GridColumn, GridCellProps } from "@progress/kendo-react-grid";
import axios from "axios";
import * as React from "react";
import { successToastr } from "../../../HelperMethods";
import { KendoFilter } from "../../ReusableComponents";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { PositionItemTemplate } from "./TimesheetCell";
import auth from "../../Auth";
import { TimesheetStatus } from "../../Shared/AppConstants";

import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

import { ExportExcel } from "./GlobalActions";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
export interface SubmittedTimesheetsProps { }

export interface SubmittedTimesheetsState {
    selectAll?: any;
    onFirstLoad?: any;
    data: any;
    showLoader?: boolean;
    dataState?: any;
    showConfirmationModal?: any;
    showRejectModal?: any;
    approverComments?: any;
    approverCommentError?: any;
    clientId?: any;
    disableBtn?: any;
}

const initialDataState = { skip: 0, take: 2 };
class SubmittedTimesheets extends React.Component<SubmittedTimesheetsProps, SubmittedTimesheetsState> {
    PositionItemCellTemplate;
    constructor(props: SubmittedTimesheetsProps) {
        super(props);
        this.state = {
            data: [],
            onFirstLoad: true,
            showLoader: true,
            approverComments: "",
            clientId: auth.getClient(),
            dataState: initialDataState,
            disableBtn: true,
        };

        this.PositionItemCellTemplate = PositionItemTemplate({
            check: this.handleSelectionChange.bind(this),
        });
    }

    componentDidMount() {
        this.getSubmittedTimesheets(this.state.dataState);
    }

    allDataLoaded = false;

    getSubmittedTimesheets = (dataState, concat?) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;
        const queryParams = `clientId eq ${this.state.clientId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/ts/submitted?${finalQueryString}`).then((res) => {
            if (res.data.length==0) {
                this.allDataLoaded = true;
            }
            this.setState({
                showLoader: false,
                dataState: dataState,
                data: concat ? this.state.data.concat(res.data) : res.data,
            });
        });
    };

    lastSkip = initialDataState.skip;

    scrollHandler = (event) => {
        const e = event.nativeEvent;
        if (e.target.scrollTop + 10 >= e.target.scrollHeight - e.target.clientHeight) {
            let skip = this.state.dataState.skip + this.state.dataState.take;
            if (this.lastSkip !=skip && !this.allDataLoaded) {
                let updatedDataState = { skip: skip, take: this.state.dataState.take };
                this.getSubmittedTimesheets(updatedDataState, true);
                this.lastSkip = skip;
            }
        }
    };

    handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.checked;
        const data = [...this.state.data];
        const updateData = data.map((item) => {
            item.tsWeek.map((x) => {
                x.isSelected = e.target.checked;
                return x;
            });
            return item;
        });
        let flag = e.target.checked;
        this.setState({ data: updateData, disableBtn: !flag, ...change });
    };

    handleSelectionChange(e, weekId?) {
        const data = [...this.state.data];
        const updateData = data.map((item) => {
            item.tsWeek.map((x) => {
                if (x.tsWeekId ==weekId) {
                    x.isSelected = e.target.checked;
                }
                return x;
            });
            return item;
        });
        let flag = this.checkIfSelected();
        this.setState({ data: updateData, disableBtn: !flag[0], selectAll: flag[0] && flag[1] });
    }

    checkIfSelected() {
        let selectedIds = [];
        let totalDataCount = 0;
        this.state.data.forEach((item) => {
            let ids = item.tsWeek.filter((x) => x.isSelected==true).map((x) => x.tsWeekId);
            selectedIds.push(...ids);
            totalDataCount += item.tsWeek.length;
        });
        if (!selectedIds.length) {
            return [false, false];
        }
        return [true, selectedIds.length==totalDataCount];
    }

    updateTimesheetStatus = (status) => {
        if (status==TimesheetStatus.REJECT && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
            this.setState({ approverCommentError: true });
            return;
        }
        let selectedIds = [];
        this.state.data.forEach((item) => {
            let ids = item.tsWeek.filter((x) => x.isSelected==true).map((x) => x.tsWeekId);
            selectedIds.push(...ids);
        });
        if (!selectedIds.length) {
            return;
        }
        let data = {
            id: selectedIds,
            statusId: status,
            comment: this.state.approverComments
        };
        axios.patch(`api/ts`, data).then((res) => {
            successToastr("Selected Timesheet(s) updated successfully!");
            this.setState({ showRejectModal: false, showConfirmationModal: false, data: [], dataState: initialDataState, selectAll: false });
            this.getSubmittedTimesheets(initialDataState);
        });
    };

    commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

    render() {
        return (
            <React.Fragment>
                <div className="col-11 mx-auto" id="searchCard">
                    <div className="mt-3 mb-3 d-md-block d-none">
                        <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                            <div className="col-12 fonFifteen paddingLeftandRight">
                                <BreadCrumbs></BreadCrumbs>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12 pl-0 pr-0">
                            <div className="input-group mt-0">
                                <div className="container-fluid">
                                    <CompleteSearch
                                        placeholder="Search text here!"
                                        handleSearch={this.getSubmittedTimesheets}
                                        entityType={"Timesheet"}
                                        onFirstLoad={this.state.onFirstLoad}
                                        page="TSSubmitted"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shadow">
                        <div className="row ml-0 mr-0  pb-2 pt-2 align-items-center">
                            <div className="col-auto  export-to-excel"
                            >
                                {ExportExcel(this.state.data)}
                            </div>
                            <div className="col pl-0 ml-auto col-md text-right">
                                <div className="row justify-content-end align-items-center">
                                    <div
                                        className="col-auto text-right txt-clr-green-select 
                                        font-weight-bold select-all text-right pr-0"
                                    >
                                        {this.state.selectAll ? "Select None" : "Select All"}
                                        <span className="grn-bg-icon-checkbox">
                                            <label className="container-R d-flex col-12">
                                                <input
                                                    name="selectAll"
                                                    type="checkbox"
                                                    value={this.state.selectAll}
                                                    onClick={(e) => {
                                                        this.handleChange(e);
                                                    }}
                                                    checked={this.state.selectAll}
                                                />
                                                <span className="checkmark-R ml-3 ml-xl-3"></span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="col-auto">
                                        <button
                                            type="button"
                                            className="btn button button-reject mr-3 shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showRejectModal: true })}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-approved shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row ml-0 mr-0">
                        <div className="col-12 mx-auto mt-3 pl-0 pr-0" id="timesheetDataGrid">
                            <Grid
                                style={{ margin: "0", height: "62vh" }}
                                onScroll={this.scrollHandler.bind(this)}
                                className="timesheetTblGrid"
                                data={this.state.data}
                            >
                                <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                <GridColumn field="position" title="Position" cell={this.PositionItemCellTemplate} headerClassName="positionHeader" />
                            </Grid>
                        </div>
                        <ConfirmationModal
                            message={"Are you sure you want to reject the selected timesheets?"}
                            showModal={this.state.showRejectModal}
                            handleYes={() => this.updateTimesheetStatus(4)}
                            enterComments
                            commentsRequired
                            commentsChange={this.commentsChange}
                            comments={this.state.approverComments}
                            handleNo={() => {
                                this.setState({ approverComments: "", showRejectModal: false });
                            }}
                            showError={this.state.approverCommentError}
                        />
                        <ConfirmationModal
                            message={"Are you sure you want to approve the selected timesheets?"}
                            showModal={this.state.showConfirmationModal}
                            handleYes={() => this.updateTimesheetStatus(3)}
                            enterComments
                            commentsChange={this.commentsChange}
                            comments={this.state.approverComments}
                            handleNo={() => {
                                this.setState({ approverComments: "", showConfirmationModal: false });
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SubmittedTimesheets;
