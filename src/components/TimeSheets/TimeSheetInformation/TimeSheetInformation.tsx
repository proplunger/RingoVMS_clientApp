import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell, TotalHoursCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, CustomHeaderActionCell, DefaultActions, PayPeriodCell } from "./GlobalActions";
import { KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import JobSummary from "../JobSummary/JobSummary";
import RowActions from "../../Shared/Workflow/RowActions";
import { amountFormatter, initialDataState } from "../../../HelperMethods";
import { currencyFormatter, errorToastr, history, successToastr, warningToastr, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { Dialog } from "@progress/kendo-react-dialogs";
import AddExpense from "../Expense/AddExpense";
import { RESET_TIMESEET_SUCCESS, RESET_TIMESHEET_MSG, TIMESHEET_BULK_SUBMIT_CONFIRMATION_MSG } from "../../Shared/AppMessages";
import NameClearConfirmationModal from "../../Shared/NameClearConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthRoleType, isRoleType, TimesheetStatus, TimesheetStatuses } from "../../Shared/AppConstants";
import { convertShiftDateTime } from "../../ReusableComponents";
import ReactExport from "react-data-export";
import ReqHistory from "../../Requisitions/RequisitionHistory/ReqHistory";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { faLastfmSquare } from "@fortawesome/free-brands-svg-icons";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export interface TimeSheetInformationProps {
    match: any;
    location: any;
}

export interface TimeSheetInformationState {
    data: any;
    totalData?: any;
    clientId: string;
    vendorId: string;
    dataState: any;
    showLoader?: boolean;
    totalCount?: number;
    onFirstLoad: boolean;
    total?: any;
    candSubmissionId?: string;
    selectedIds?: any[];
    showSubmitConfirmationModal?: boolean;
    showResetTimesheetModal?: boolean;
    showJobSummaryModal?: boolean;
    showTSHistoryModal?: boolean;
    payPeriods?: any[];
    dataItem?: any;
    showAddExpenseModal?: boolean;
    candidateId?: any;
}

class TimeSheetInformation extends React.Component<TimeSheetInformationProps, TimeSheetInformationState> {
    CustomHeaderActionCellTemplate: any;
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: TimeSheetInformationProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: "",
            onFirstLoad: true,
            showLoader: true,
            total: 0,
        };
        this.initializeHeaderCell(true);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id) { // comes from manage job
            this.setState({ candSubmissionId: id });
        } else { // direct menu
            let candidateId = localStorage.getItem("candidateId");
            this.setState({ candidateId: candidateId });
        }
    }

    getProviderTimeSheetInfo = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = '';

        if (this.state.candidateId) {
            queryParams += `candidateId eq ${this.state.candidateId}`;
        } else {
            queryParams += `candSubmissionId eq ${this.state.candSubmissionId}`;
        }

        if (this.state.clientId) {
            queryParams += ` and clientId eq ${this.state.clientId}`
        }
        var params = new URLSearchParams(this.props.location.search);
        if (params.get('filter')) {
            queryParams = queryParams + " and " + params.get('filter');
        }
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        if (this.state.candidateId || this.state.candSubmissionId) {
            axios.get(`api/ts/provider?${finalQueryString}`).then((res) => {
                this.setState({
                    data: res.data,
                    showLoader: false,
                    dataState: dataState,
                });
                this.getProviderTimeSheetInfoInformationCount(dataState);
            });
        }
        else {
            this.setState({
                showLoader: false
            });
        }
    };

    confirmSubmit = () => {
        let selectedRows = this.state.data.filter((x) => x.selected);
        this.setState({ showSubmitConfirmationModal: true, payPeriods: selectedRows.map((s) => ({ startDate: s.startDate, endDate: s.endDate })) });
    };

    submitSelected = () => {
        this.setState({ showSubmitConfirmationModal: false });
        let selectedRows = this.state.data.filter((x) => x.selected && x.status==TimesheetStatuses.ACTIVE);

        if (selectedRows.length > 0) {
            let hasHoursOrAmount = selectedRows.every(x => x.totalHours > 0 || x.totalAmount > 0);
            if (!hasHoursOrAmount) {
                warningToastr("Empty timesheet(s) cannot be submitted.");
                return;
            }
            let tsWeekIdList = selectedRows.map((x) => x.tsWeekId);
            let data = {
                tsWeekIds: tsWeekIdList,
            };
            axios.post(`/api/ts/bulksubmit`, JSON.stringify(data)).then((res) => {
                if (!res.data) {
                    errorToastr("Timesheet for some working days is not saved.");
                    return false;
                } else {
                    this.getProviderTimeSheetInfo(this.state.dataState);
                    successToastr("Timesheet/s submitted successfully.");
                }
            });
        }
    };

    resetTimesheet = () => {
        this.setState({ showResetTimesheetModal: false });
        const { tsWeekId, statusIntId } = this.state.dataItem;
        let data = { id: tsWeekId, statusId: statusIntId };
        axios.patch(`/api/ts/reset/${tsWeekId}`, JSON.stringify(data)).then((res) => {
            successToastr(RESET_TIMESEET_SUCCESS);
            this.getProviderTimeSheetInfo(this.state.dataState);
        });
    };

    showColumn = () => { };

    initializeHeaderCell = (canSubmit) => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            submitSelected: this.confirmSubmit,
            showColumn: this.showColumn,
            isDisabled: canSubmit,
            ExportExcel: this.ExportExcel
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getProviderTimeSheetInfo(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    advancedSearchStates = () => {
        let states = {
            division: "",
            originalDivision: [],
            location: "",
        };
        return states;
    };

    selectionChange = (event) => {
        const data = this.state.data.map((item) => {
            if (item.tsWeekId ==event.dataItem.tsWeekId) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ data });
        let disableAction = true;
        let isActiveSelected = this.state.data.filter((x) => x.selected && x.status==TimesheetStatuses.ACTIVE).length > 0;
        if (isActiveSelected) {
            let isOtheSelected = this.state.data.filter((x) => x.selected && x.status !=TimesheetStatuses.ACTIVE).length > 0;
            disableAction = !(isActiveSelected && !isOtheSelected);
        }
        this.initializeHeaderCell(disableAction);
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.data.map((item) => {
            item.selected = checked;
            return item;
        });
        this.setState({ data });
        let disableAction = true;
        let isActiveSelected = this.state.data.filter((x) => x.selected && x.status==TimesheetStatuses.ACTIVE).length > 0;
        if (isActiveSelected) {
            let isOtheSelected = this.state.data.filter((x) => x.selected && x.status !=TimesheetStatuses.ACTIVE).length > 0;
            disableAction = !(isActiveSelected && !isOtheSelected);
        }
        this.initializeHeaderCell(disableAction);
    };

    // dynamic action click
    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = { dataItem: dataItem };
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
    };


    close = () => {
        this.setState({ showAddExpenseModal: false, showJobSummaryModal: false });
        //this.dataItem = undefined;
    };

    onSaveAndNew = () => {
        this.close();
        this.getProviderTimeSheetInfo(initialDataState);
        //this.dataItem = undefined;
        setTimeout(() => {
            this.setState({ showAddExpenseModal: true });
        }, 50);
    };

    onSaveAndClose = () => {
        this.close();
        history.push(`/timesheets/week/${this.state.dataItem.tsWeekId}/expense`);
    };
    totalHoursCell = (props, data) => {
        let totalHours = data.reduce((acc, current) => acc + current["totalHours"], 0);
        let totalAmount = data.reduce((acc, current) => acc + current["totalBillableAmount"], 0);
        totalHours = totalHours.toFixed(2);
        totalAmount = totalAmount.toFixed(2);
        return (
            <td colSpan={18} className="timeshhet-info" style={props.style}>
                <div className="row align-items-center justify-content-center mx-0">
                    <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-2">Total Hours:</div>
                    <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{totalHours}</div>
                    {!isRoleType(AuthRoleType.Provider) &&
                        <React.Fragment>
                            <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">Total Billable:</div>
                            <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{currencyFormatter(totalAmount)}</div>
                        </React.Fragment>
                    }

                </div>
                {/* Total Hours: <span className="total-hours total-hours-font-size"> {total}</span> */}
            </td>
        );
    };


    getExpenses = (tsWeekId) => {
        let data;
        axios.get(`api/ts/week/expense?tsWeekId eq ${tsWeekId}`).then((res) => {
            data = res.data;
        });
        return data;
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            <BreadCrumbs globalData={{candSubmissionId:this.state.candSubmissionId}}></BreadCrumbs>
                            {/* {this.state.candSubmissionId && <JobSummary candSubmissionId={this.state.candSubmissionId}></JobSummary>} */}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getProviderTimeSheetInfo}
                        entityType={"TSSingleProvider"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="TSSingleProvider"
                    />
                    <div className="myOrderContainer tableTimeSheetInformation global-action-grid">

                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.total}
                            className="kendo-grid-custom lastchild"
                            selectedField="selected"
                            onSelectionChange={this.selectionChange}
                            onHeaderSelectionChange={this.headerSelectionChange}
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="selected"
                                width="40px"
                                sortable={false}
                            // headerSelectionValue={
                            //     this.state.data && this.state.data.findIndex((dataItem) => dataItem.selected ==false) ==-1
                            // }
                            />
                            <GridColumn
                                field="provider"
                                width="100px"
                                title="Provider"
                                cell={(props) => CellRender(props, "Provider")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="location"
                                title="Location"
                                cell={(props) => CellRender(props, "Location")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="position"
                                title="Position"
                                cell={(props) => CellRender(props, "Position")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="jobStartDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Start Date")}
                            />
                            <GridColumn
                                field="jobEndDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                                footerCell={(props) => this.totalHoursCell(props, this.state.data)}
                            />
                            <GridColumn
                                title="Pay Period"
                                columnMenu={ColumnMenu}
                                cell={(props) => PayPeriodCell(props)}
                                filter="text"
                            />
                            <GridColumn
                                field="totalHours"
                                title="Hours"
                                width="80px"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Hours"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalHours}
                                        >
                                            {props.dataItem.totalHours ? props.dataItem.totalHours.toFixed(2) : "0.00"}
                                        </td>
                                    );
                                }}
                                filter="numeric"
                            />
                            {!isRoleType(AuthRoleType.Provider) &&
                                <GridColumn
                                    field="totalAmount"
                                    title="Amount"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => {
                                        return (
                                            <td contextMenu="Amount" className="pr-4"
                                                style={{ textAlign: "right" }}
                                                title={props.dataItem.totalAmount ? currencyFormatter(props.dataItem.totalAmount) : "$0.00"}

                                            >
                                                {currencyFormatter(props.dataItem.totalAmount)}
                                            </td>
                                        );
                                    }}
                                    filter="numeric"
                                />
                            }
                            <GridColumn
                                title="Expense"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Expense"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalExpense ? currencyFormatter(props.dataItem.totalExpense) : "$0.00"}
                                        >
                                            {props.dataItem.totalExpense ? currencyFormatter(props.dataItem.totalExpense) : "$0.00"}
                                        </td>
                                    );
                                }}
                            />
                            {!isRoleType(AuthRoleType.Provider) &&
                                <GridColumn
                                    field="totalBillableAmount"
                                    title="Billable Amount"
                                  
                                    columnMenu={ColumnMenu}
                                    cell={(props) => {
                                        return (
                                            <td contextMenu="Billable Amount" className="pr-4"
                                                style={{ textAlign: "right" }}
                                                title={currencyFormatter(props.dataItem.totalBillableAmount)}
                                            >
                                                {currencyFormatter(props.dataItem.totalBillableAmount)}
                                            </td>
                                        );
                                    }}
                                    filter="numeric"
                                />
                            }
                            <GridColumn field="status" 
                            width="165px"
                            title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="30px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={props.dataItem.status}
                                        rowId={props.dataItem.tsWeekId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={this.CustomHeaderActionCellTemplate}
                            />
                            <GridColumn sortable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>

                    </div>
                    <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                Close
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.showSubmitConfirmationModal && (
                    <ConfirmationModal
                        message={TIMESHEET_BULK_SUBMIT_CONFIRMATION_MSG(this.state.payPeriods)}
                        showModal={this.state.showSubmitConfirmationModal}
                        handleYes={() => this.submitSelected()}
                        handleNo={() => {
                            this.setState({ showSubmitConfirmationModal: false });
                        }}
                    />
                )}
                {this.state.showResetTimesheetModal && (
                    <NameClearConfirmationModal
                        message={RESET_TIMESHEET_MSG(this.state.dataItem)}
                        showModal={this.state.showResetTimesheetModal}
                        handleYes={() => this.resetTimesheet()}
                        handleNo={() => {
                            this.setState({ showResetTimesheetModal: false });
                        }}
                        radioSelection={false}
                    />
                )}

                {this.state.showAddExpenseModal && <div id="hold-position">
                    <Dialog className="col-12 For-all-responsive-height">
                        <AddExpense
                            candSubmissionId={this.state.dataItem.candSubmissionId}
                            candidateName={this.state.data[0].provider}
                            tsWeekId={this.state.dataItem.tsWeekId}
                            dataItem={this.state.dataItem}
                            onCloseModal={this.close}
                            onSaveAndNew={this.onSaveAndNew}
                            onSaveAndClose={this.onSaveAndClose}
                            filters={this.state.dataItem}
                        />
                    </Dialog>
                </div>
                }
                {this.state.showTSHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 width-requisitions-manager For-all-responsive-height">
                            <ReqHistory
                                entityId={this.state.dataItem.tsWeekId}
                                dataItem={this.state.dataItem}
                                title={"Timesheet History"}
                                handleClose={() => this.setState({ showTSHistoryModal: false })}
                                statusLevel={1}
                                candidateName={"Cand Name"}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showJobSummaryModal && (
                    <JobSummary candSubmissionId={this.state.dataItem.candSubmissionId} onClose={this.close}></JobSummary>
                )}

            </div>
        );
    }

    getProviderTimeSheetInfoInformationCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let queryParams = '';

        if (this.state.candidateId) {
            queryParams += `candidateId eq ${this.state.candidateId}`;
        } else {
            queryParams += `candSubmissionId eq ${this.state.candSubmissionId}`;
        }

        if (this.state.clientId) {
            queryParams += ` and clientId eq ${this.state.clientId}`
        }

        var finalQueryString = `$filter=${queryParams}&${queryStr}`;
        if (dataState.filter) {
            if (dataState.filter.filters.length > 0) {
                var splitQueryArr = queryStr.split("$filter=");
                splitQueryArr[1] = queryParams + " and " + splitQueryArr[1];
                finalQueryString = splitQueryArr.join("$filter=");
            }
        }
        axios.get(`api/ts/provider?${finalQueryString}`).then((res) => {
            this.setState({
                total: res.data.length,
                totalData: res.data
            }, () => {
                this.initializeHeaderCell(true);
            });
        });
    };
    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="Timesheet Information"
        >
            <ExcelSheet data={this.state.totalData} name="Timesheet Information">
                <ExcelColumn label="Provider" value="provider" />
                <ExcelColumn label="Pay Period" value={(col) => col.startDate && col.endDate ? dateFormatter2(col.startDate) + " - " + dateFormatter2(col.endDate) : "-"} />
                <ExcelColumn label="Hours" value="totalHours" />
                <ExcelColumn label="Amount ($)" value={(col) => amountFormatter(col.totalAmount)} />
                <ExcelColumn label="Start Date" value={(col) => col.startDate ? dateFormatter(col.startDate) : "-"} />
                <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
                <ExcelColumn label="Division" value="division" />
                <ExcelColumn label="Location" value="location" />
                <ExcelColumn label="Position" value="position" />
                <ExcelColumn label="Expense ($)" value={(col) =>  amountFormatter(col.totalExpense) }  />
                <ExcelColumn label="Billable Amount ($)" value={(col) =>  amountFormatter(col.totalBillableAmount) }  />
                <ExcelColumn label="Req#" value={"reqNumber"}  />
                <ExcelColumn label="Status" value="status" />
            </ExcelSheet>
        </ExcelFile>
    );

}
export default TimeSheetInformation;
