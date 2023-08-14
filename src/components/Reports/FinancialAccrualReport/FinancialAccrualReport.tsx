import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, JobDetailCell, ClientInvoiceNumberCell, ViewMoreComponent } from "./GlobalActions";
import { CreateQueryString, KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, dateFormatter, localDateTime, successToastr } from "../../../HelperMethods";
import { SearchData } from "../../Shared/AppConstants";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import Collapsible from "react-collapsible";
import FinancialAccrualReportInfo from "./FinancialAccrualReportInfo";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface FinancialAccrualReportProps { }

export interface FinancialAccrualReportState {
    clientId?: any;
    vendorId?: any;
    searchString: string;
    data: any;
    allData?: any;
    dataState: any;
    showLoader?: boolean;
    totalCount?: number;
    onFirstLoad: boolean;
    dataQuery?: any;
    isDataManipulated?: boolean;
    toggleFirst: boolean;
    startDate: Date;
    endDate: Date;
    selectedAssociates?: any;
    isDirty?: boolean;
    selectedLocations?: any;
    selectedVendors?: any;
    isRun?: boolean;
    isAllProviderSelected?: boolean;
    isAllLocSelected?: boolean;
    isAllVendorSelected?: boolean;
}

class FinancialAccrualReport extends React.Component<FinancialAccrualReportProps, FinancialAccrualReportState> {
    public dataItem: any;
    public openModal: any;
    dataState;
    aggregates = [
        { field: "amount", aggregate: "sum", format: "{0:##,#}" }
    ];
    data = [];

    constructor(props: FinancialAccrualReportProps) {
        super(props);
        this.dataState = {
            skip: 0,
            take: 10
        };
        this.state = {
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            searchString: "",
            data: [],
            dataState: this.dataState,
            onFirstLoad: true,
            showLoader: true,
            toggleFirst: true,
            startDate: null,
            endDate: null,
            selectedAssociates: [],
            selectedLocations: [],
            selectedVendors: [],
            isAllProviderSelected: false,
            isAllLocSelected: false,
            isAllVendorSelected: false,
        };
    }

    componentDidMount() {
        let searchData = JSON.parse(localStorage.getItem(`${SearchData.REPORTFINANCIALACCRUAL}`))

        if (searchData) {
            if (searchData.startDate && searchData.startDate !="undefined" && searchData.endDate && searchData.endDate !="undefined" && searchData.associate && searchData.associate !="undefined") {
                this.setState({
                    startDate: searchData.startDate,
                    endDate: searchData.endDate,
                    selectedAssociates: searchData.associate,
                })
            }
        }
    }

    getFinancialAccrualReport = (dataState?, isAdvanceSearch?) => {
        var searchData = {}
        
        var filterValidation = (this.state.selectedAssociates ==null || this.state.startDate ==null || this.state.endDate ==null)
        if (filterValidation) {
            this.setState(
                {
                    totalCount: 0,
                    data: [],
                    showLoader: false,
                    onFirstLoad: false
                })
            return false
        }
        if (isAdvanceSearch) {
            this.state.dataState.skip = 0;
        }

        searchData = {
            'startDate': this.state.startDate,
            'endDate': this.state.endDate,
            'associate': this.state.selectedAssociates,
            'location': this.state.selectedLocations,
            'vendor': this.state.selectedVendors,
        }

        localStorage[`${SearchData.REPORTFINANCIALACCRUAL}`] = JSON.stringify(searchData)

        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        let startDate = this.state.startDate ? localDateTime(this.state.startDate) : null;
        let endDate = this.state.endDate ? localDateTime(this.state.endDate) : null;
        
        const data = {
            associates: this.state.selectedAssociates.filter((x) => x.id !=9999).map((m) => m.id),
            locations: this.state.selectedLocations.filter((x) => x.clientDivLocId !=9999).map((m) => m.clientDivLocId),
            vendors: this.state.selectedVendors.filter((x) => x.vendorId !=9999).map((m) => m.vendorId),
            startDate: startDate, 
            endDate: endDate
        };

      axios.post(`api/report/finacc?${`$count=true`}&${queryStr}`,JSON.stringify(data))
        .then((res) => {
            this.data = res.data;
            this.setState(
                {
                    isRun: true,
                    totalCount: res.data.count,
                    data: res.data.items,
                    showLoader: false,
                    onFirstLoad: false,
                    dataState: dataState,
                }
            );
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getFinancialAccrualReport(changeEvent.data);
    };
 
    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    onCollapseOpen = () => {
        this.setState({
            toggleFirst: true
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleFirst: false
        });
    };

    handleChange = (change) => {
        if (change.target !=undefined && (change.target.name=='startDate' || change.target.name=='endDate')) {
            let changes = { isDirty: true };
            changes[change.target.name] = change.target.value;
            this.setState(changes);
        } else {
            change["isDirty"] = true;
            this.setState(change);
        }
    };

    handleReset = (e) => {
        var searchData = {}
        searchData = {}

        localStorage[`${SearchData.REPORTFINANCIALACCRUAL}`] = JSON.stringify(searchData)

        this.setState(
            {
                selectedAssociates: [],
                selectedLocations: [],
                selectedVendors: [],
                startDate: null,
                endDate: null,
                isRun: false
            },
            () => {
                this.getFinancialAccrualReport(e);
            }
        );
    };

    advancedSearchStates = () => {
        let states = {
            division: "",
            originalDivision: [],
            location: "",
        };
        return states;
    };    

    render() {
        const {
            selectedAssociates,
            selectedLocations,
            selectedVendors,
            startDate,
            endDate,
            isAllProviderSelected,
            isAllLocSelected,
            isAllVendorSelected,
            toggleFirst
        } = this.state;
        const associateInfo = {
            selectedAssociates,
            selectedLocations,
            selectedVendors,
            startDate,
            endDate,
            isAllProviderSelected,
            isAllLocSelected,
            isAllVendorSelected,
        };

        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-block">
                    <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
                            <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            <span className="float-right text-dark cursor-pointer">
                                <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                                    <span
                                        title="Excel"
                                        onClick={() => this.downloadFinancialAccrualReportExcel()} >
                                        <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
                                    </span>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        page="FinancialAccrualReport"
                        entityType="Report"
                        handleSearch={(d) => this.getFinancialAccrualReport(d, true)}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <Collapsible
                        trigger="Filter"
                        open={toggleFirst}
                        onTriggerOpening={() => this.setState({ toggleFirst: true })}
                        onTriggerClosing={() => this.setState({ toggleFirst: false })}
                    >
                        <FinancialAccrualReportInfo
                            data={associateInfo}
                            handleChange={this.handleChange}
                            generateReport={this.getFinancialAccrualReport}
                            handleReset={this.handleReset}
                            dataState={this.state.dataState}
                        />
                    </Collapsible>
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead" id="grouping-performance-grid">
                        <Grid
                            //style={{ height: "auto" }}
                            sortable={true}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            total={this.state.totalCount}
                            onDataStateChange={this.onDataStateChange}
                            onExpandChange={this.expandChange}
                            expandField="expanded"
                            detail={ViewMoreComponent}
                            resizable={false}
                            reorderable={false}                            
                            className="kendo-grid-custom lastchild table_responsive-TABcandidates frozen-column report-grid"
                        >
                            <GridNoRecords>
                                {GridNoRecord(this.state.showLoader)}
                            </GridNoRecords>
                            <GridColumn 
                                field="providerName"
                                width={120}
                                title="Provider Name"
                                columnMenu={ColumnMenu}
                                cell={JobDetailCell}
                            />                           
                            <GridColumn
                                field="region"
                                width={100}
                                title="Region"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Region")}
                            />
                            <GridColumn
                                field="division"
                                width={100}
                                title="Division"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division")}
                            />
                            <GridColumn
                                field="location"
                                width={100}
                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Location")}
                            />
                            <GridColumn
                                field="position"
                                width={150}
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />                            
                             <GridColumn
                                field="vendor"
                                width={150}
                                title="Vendor"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Vendor")}
                            />
                            <GridColumn
                                field="startDate"
                                width={160}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Assignment Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Assignment Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                width={160}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Assignment End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Assignment End Date")}
                            />
                            <GridColumn
                                field="providerStatus"
                                width={120}
                                title="Provider Status"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Provider Status")}
                            />
                            <GridColumn
                                field="payPeriodStartDate"
                                width={160}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Pay Period Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Pay Period Start Date")}
                            />
                            <GridColumn
                                field="payPeriodEndDate"
                                width={160}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Pay Period End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Pay Period End Date")}
                            />
                            <GridColumn
                                field="totalHours"
                                width={100}
                                title="Total Hours"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu={"Total Hours"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalHours}
                                        >
                                            {props.dataItem.totalHours ? props.dataItem.totalHours.toFixed(2) : "0.00"}
                                        </td>
                                    );
                                }}
                            />
                             <GridColumn
                                field="totalBillableTime"
                                width={160}
                                title="Total Billable Time"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu="Total Billable Time"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBillableTime}
                                        >
                                            {currencyFormatter(props.dataItem.totalBillableTime)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalReimbursableExpenses"
                                width={200}
                                title="Total Reimbursable Expenses"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu="Total Reimbursable Expenses"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalReimbursableExpenses}
                                        >
                                            {currencyFormatter(props.dataItem.totalReimbursableExpenses)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalBillableSpend"
                                width={160}
                                title="Total Billable Spend"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu="Total Billable Spend"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBillableSpend}
                                        >
                                            {currencyFormatter(props.dataItem.totalBillableSpend)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="fees"
                                width={100}
                                title="Fees"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu="Fees"
                                            className="pr-4 text-right"
                                            title={props.dataItem.fees}
                                        >
                                            {currencyFormatter(props.dataItem.fees)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalBudgetedHours"
                                width={160}
                                title="Total Forecasted Hours"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu={"Total Forecasted Hours"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBudgetedHours}
                                        >
                                            {props.dataItem.totalBudgetedHours ? props.dataItem.totalBudgetedHours.toFixed(2) : "0.00"}
                                        </td>
                                    );
                                }}
                            />
                             <GridColumn
                                field="totalBudgetedBillableTime"
                                width={220}
                                title="Total Forecasted Billable Time"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                      }
                                    return (
                                        <td contextMenu="Total Forecasted Billable Time"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBudgetedBillableTime}
                                        >
                                            {currencyFormatter(props.dataItem.totalBudgetedBillableTime)}
                                        </td>
                                    );
                                }}
                            />
                             <GridColumn
                                field="totalBudgetedReimbursableExpenses"
                                width={270}
                                title="Total Forecasted Reimbursable Expenses"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Total Forecasted Reimbursable Expenses"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBudgetedReimbursableExpenses}
                                        >
                                            {currencyFormatter(props.dataItem.totalBudgetedReimbursableExpenses)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalBudgetedBillableSpend"
                                width={230}
                                title="Total Forecasted Billable Spend"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {                                   
                                    return (
                                        <td contextMenu="Total Forecasted Billable Spend"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBudgetedBillableSpend}
                                        >
                                            {currencyFormatter(props.dataItem.totalBudgetedBillableSpend)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalBudgetedFees"
                                width={160}
                                title="Total Forecasted Fees"
                                filter={"numeric"}
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {                                    
                                    return (
                                        <td contextMenu="Total Forecasted Fees"
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalBudgetedFees}
                                        >
                                            {currencyFormatter(props.dataItem.totalBudgetedFees)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="clientInvoiceNumber"
                                width="190px"
                                title="Client Invoice Number (CBI)"
                                cell={ClientInvoiceNumberCell}
                                columnMenu={ColumnMenu}                            
                            />
                            <GridColumn
                                locked
                                sortable={false} 
                                field="expanded" 
                                width="78px"
                                title="View More"
                                cell={this.ExpandCell}
                            />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }

    downloadFinancialAccrualReportExcel = () => {
        var finalState: State = {
            ...this.state.dataState,
            take: null,
            skip: 0,
        };

        if (this.state.isRun ==true) {
            let finalQueryString = CreateQueryString(finalState, this.state.clientId, this.state.vendorId);
            successToastr(EXCEL_DOWNLOAD_INPROGRESS);
            let startDate = this.state.startDate ? localDateTime(this.state.startDate) : null;
            let endDate = this.state.endDate ? localDateTime(this.state.endDate) : null;

            const data = {
                associates: this.state.selectedAssociates.filter((x) => x.id !=9999).map((m) => m.id),
                locations: this.state.selectedLocations.filter((x) => x.clientDivLocId !=9999).map((m) => m.clientDivLocId),
                vendors: this.state.selectedVendors.filter((x) => x.vendorId !=9999).map((m) => m.vendorId),
                startDate: startDate,
                endDate: endDate
            };

            axios.post(`api/grid/finaccexcel?${`$count=true`}&${finalQueryString}`, JSON.stringify(data))
                .then((res: any) => {
                    if (res) {
                        let fileExt = ".xlsx";
                        let fileType = "application";

                        const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                        const downloadLink = document.createElement("a");
                        let fileName = "FinancialAccrualReport.xlsx";

                        downloadLink.href = linkSource;
                        downloadLink.download = fileName;
                        downloadLink.click();
                    }
                });
        }
    }
}
export default FinancialAccrualReport;
