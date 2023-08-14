import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CandidateStatusCell, CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, ViewMoreComponent, CommandCell, RequisitionCell, CandidateCell, PositionCell } from "./GlobalActions";
import { KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { initialDataState } from "../../../HelperMethods";
import { AuthRoleType, isRoleType } from "../../Shared/AppConstants";
import { Dialog } from "@progress/kendo-react-dialogs";
import CandStatusBar from "../../Shared/CandStatusCard/CandStatusBar";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
import AuditLog from "../../Shared/AuditLog/AuditLog";

export interface TimeSheetManagementProps { }

export interface TimeSheetManagementState {
    data: any;
    clientId: string;
    vendorId: string;
    dataState: any;
    showRemoveModal?: boolean;
    showCopyModal?: boolean;
    showLoader?: boolean;
    totalCount?: number;
    showHoldPositionModal?: any;
    showReqHistoryModal?: any;
    onFirstLoad: boolean;
    total?: any;
    totalData?:any;
    showCandidateStatusModal?:any;
    showAuditLogModal?: any;
}

class TimeSheetManagement extends React.Component<TimeSheetManagementProps, TimeSheetManagementState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    CommandCell: any;
    constructor(props: TimeSheetManagementProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            onFirstLoad: true,
            showLoader: true,
            total: 0
        };
        this.initializeActionCell();
    }
        initializeActionCell = () => {
        this.CommandCell = CommandCell({editField:""
        }, (data)=>{this.dataItem=data; return this.setState({showCandidateStatusModal:true});}, (data) => this.getAuditLog(data));

    };


    getAuditLog = (data) => {
      this.dataItem = data;
      this.setState({showAuditLogModal: true});
    }

    // getVendorId=()=>{
    //     axios.get(`api/ts/vendor`).then((res) => {
    //         this.setState({vendorId:res.data});
    //         this.getTimeSheet(this.state.dataState);
    //     });
    // }

    getTimeSheet = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `clientId eq ${this.state.clientId}`;

        if (this.state.vendorId) {
            queryParams = queryParams + ` and vendorId eq ${this.state.vendorId}`;
        }
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/ts?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getTimeSheetManagementCount(dataState);
        });
    };


    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getTimeSheet(changeEvent.data);
        localStorage.setItem("TSAllProvider-GridDataState", JSON.stringify(changeEvent.data));
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
            <div className="container-fluid mt-3 mb-3 d-md-block d-none">
              <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                <div className="col-12 fonFifteen paddingLeftandRight">
                 <BreadCrumbs></BreadCrumbs>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <CompleteSearch
                placeholder="Search text here!"
                handleSearch={this.getTimeSheet}
                entityType={"TSAllProvider"}
                onFirstLoad={this.state.onFirstLoad}
                page="TSAllProvider"
                persistSearchData={true}
              />
              <div className="myOrderContainer global-action-grid">
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
                >
                  <GridNoRecords>
                    {GridNoRecord(this.state.showLoader)}
                  </GridNoRecords>
                  <GridColumn
                    field="reqNumber"
                    title="Req#"
                    width="130px"
                    cell={RequisitionCell}
                    columnMenu={ColumnMenu}
                  />
                  {!isRoleType(AuthRoleType.Vendor) && (
                    <GridColumn
                      field="vendor"
                      title="Vendor"
                      cell={(props) => CellRender(props, "Vendor")}
                      columnMenu={ColumnMenu}
                    />
                  )}
                  <GridColumn
                    field="candidateName"
                    title="Provider"
                    cell={(props) => CandidateCell(props)}
                    columnMenu={ColumnMenu}
                  />
                  <GridColumn
                    field="position"
                    title="Position"
                    cell={PositionCell}
                    columnMenu={ColumnMenu}
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
                    field="jobStartDate"
                    filter="date"
                    format="{0:d}"
                    width="100px"
                    editor="date"
                    title="Start Date"
                    columnMenu={ColumnMenu}
                    cell={(props) => CellRender(props, "Start Date")}
                  />
                  <GridColumn
                    field="jobEndDate"
                    filter="date"
                    format="{0:d}"
                    width="100px"
                    editor="date"
                    title="End Date"
                    columnMenu={ColumnMenu}
                    cell={(props) => CellRender(props, "End Date")}
                  />
                  <GridColumn
                    field="candSubStatus"
                  width="240px"
                    title="Status"
                    columnMenu={ColumnMenu}
                    cell={CandidateStatusCell}
                  />
                  <GridColumn
                    title="Action"
                    sortable={false}
                    width="30px"
                    cell={this.CommandCell}
                    headerCell={() => CustomMenu(this.state.totalData)}
                  />
                  <GridColumn
                    sortable={false}
                    field="expanded"
                    width="80px"
                    title="View More"
                    cell={this.ExpandCell}
                  />
                </Grid>
              </div>
            </div>

            {this.state.showCandidateStatusModal && (
          <div id="hold-position">
            <Dialog className="col-12 width For-all-responsive-height">
              <CandStatusBar
                dataItem={this.dataItem}
                handleClose={() =>
                  this.setState({ showCandidateStatusModal: false })
                }
                statusLevel={1}
                candidateName={"Cand Name"}
              ></CandStatusBar>
            </Dialog>
          </div>
        )}
           
           {this.state.showAuditLogModal && (
                    <AuditLog
                        candSubmissionId={this.dataItem && this.dataItem.candSubmissionId}
                        showDialog={this.state.showAuditLogModal}
                        handleNo={() => {
                        this.setState({ showAuditLogModal: false });
                        }}
                    />
                )}
          </div>
        );
    }
    getTimeSheetManagementCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `clientId eq ${this.state.clientId}`;
        if (this.state.vendorId) {
            queryParams = queryParams + ` and vendorId eq ${this.state.vendorId}`;
        }
        var finalQueryString = `$filter=${queryParams}&${queryStr}`;
        if (dataState.filter) {
            if (dataState.filter.filters.length > 0) {
                var splitQueryArr = queryStr.split("$filter=");
                splitQueryArr[1] = queryParams + " and " + splitQueryArr[1];
                finalQueryString = splitQueryArr.join("$filter=");
            }
        }
        axios.get(`api/ts?${finalQueryString}`).then((res) => {
            this.setState({
                total: res.data.length,
                totalData:res.data
            });
        });
    };
}
export default TimeSheetManagement;
