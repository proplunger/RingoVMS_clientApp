import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, PayPeriodCell, ExportExcel, ReqNumberCell, ExportExcelNew } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { clientSettingData, currencyFormatter, initialDataState } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { AuthRole } from "../../Shared/AppConstants";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";


export interface ReqPerformanceReportProps { }

export interface ReqPerformanceReportState {
    searchString: string;
    data: any;
    allData?: any;
    clientId?: string;
    vendorId?: string;
    dataState: any;
    showRemoveModal?: boolean;
    showCopyModal?: boolean;
    showLoader?: boolean;
    totalCount?: number;
    showHoldPositionModal?: any;
    showReqHistoryModal?: any;
    onFirstLoad: boolean;
    isVendorRole?:boolean;
    isEnableDepartment?: boolean;
}

class ReqPerformanceReport extends React.Component<ReqPerformanceReportProps, ReqPerformanceReportState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: ReqPerformanceReportProps) {
        super(props);
        this.state = {
            searchString: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            isVendorRole: AuthRole.Vendor_9==this.userObj.role || AuthRole.Vendor_10==this.userObj.role || AuthRole.Vendor_11==this.userObj.role || AuthRole.NAPA_VENDOR==this.userObj.role,
            onFirstLoad: true,
            showLoader: true,
            isEnableDepartment: false
        };
    }
    // componentDidMount(){
    //     this.getVendorId();
    // }
    // getVendorId=()=>{
    //     axios.get(`api/ts/vendor`).then((res) => {
    //         this.setState({vendorId:res.data});
    //         this.getReqPerformanceReport(this.state.dataState);
    //     });
    // }
    getReqPerformanceReport = (dataState?, isAdvanceSearch?) => {
        if (isAdvanceSearch) {
          this.state.dataState.skip = 0;
        }
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        let finalQueryString = CreateQueryString(dataState,this.state.clientId, this.state.vendorId);
        axios.get(`api/report/reqperformance?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            }, () => this.getClientSetting(this.state.clientId));
            this.getReqPerformanceReportCount(dataState);
        });
    };

    getClientSetting = (id) => {
        this.setState({ showLoader: true })
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };


    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        dataItem['isEnableDepartment'] = this.state.isEnableDepartment;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        debugger;
        this.getReqPerformanceReport(changeEvent.data);
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

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-block">
                    <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
                        <BreadCrumbs></BreadCrumbs>
                            <span className="float-right text-dark cursor-pointer">
                                {this.state.isEnableDepartment ?
                                  ExportExcelNew(this.state.allData)
                                : ExportExcel(this.state.allData)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getReqPerformanceReport}
                        entityType={"Requisition"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="ReqPerformanceReport"
                    />
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead">
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
                            className="kendo-grid-custom lastchild report-grid"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn field="reqNumber" width="130px" title="Req#" cell={ReqNumberCell} columnMenu={ColumnMenu} />
                            {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
                            <GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                            />
    }
                            <GridColumn
                                field="zone"
                                title="Zone"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Zone")}
                                filter="text"
                            />
                            <GridColumn
                                field="region"
                                title="Region"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Region")}
                                filter="text"
                            />
                            <GridColumn
                                field="division"
                                title="Division"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division")}
                                filter="text"
                            />
                            <GridColumn
                                field="location"
                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Location")}
                            />
                            <GridColumn
                                field="position"
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="totalRequired"
                                width="120px"
                                title="Open Position"
                                columnMenu={ColumnMenu}
                                filter={"numeric"}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Open Position"}
                                            className="pr-4 text-right"
                                            title={(props.dataItem.totalRequired - (props.dataItem.NoOfHoldStaff ? props.dataItem.NoOfHoldStaff :0 + props.dataItem.noOfFilledStaff ? props.dataItem.noOfFilledStaff: 0)).toString()}
                                        >
                                            {props.dataItem.totalRequired - (props.dataItem.NoOfHoldStaff ? props.dataItem.NoOfHoldStaff :0 + props.dataItem.noOfFilledStaff ? props.dataItem.noOfFilledStaff: 0)}
                                        </td>
                                    );
                                }}
                            />
                            {/* <GridColumn
                                field="filledRate"
                                width="110px"
                                title="Filled Rate"
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Filled Rate"}
                                        className="pr-4 text-right"
                                            title={props.dataItem.filledRate}
                                        >
                                            {props.dataItem.filledRate}
                                        </td>
                                    );
                                }}
                                columnMenu={ColumnMenu}
                            /> */}
                            <GridColumn
                                field="startDate"
                                width="110px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                width="110px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                            />
                            {/* <GridColumn
                                field="filledInDays"
                                title="Filled In Days"
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Filled In Days"}
                                        className="pr-4 text-right"
                                            title={props.dataItem.filledInDays}
                                        >
                                            {props.dataItem.filledInDays}
                                        </td>
                                    );
                                }}
                                columnMenu={ColumnMenu}
                            /> */}
                            <GridColumn field="status"  
                            width="220px"
                            title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
                            <GridColumn sortable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
    getReqPerformanceReportCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
        axios.get(`api/report/reqperformance?${finalQueryString}`).then((res) => {
            this.setState({
                allData: res.data,
                totalCount: res.data.length,
            });
        });
    };
}
export default ReqPerformanceReport;
