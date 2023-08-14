import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faChartBar, faFileExcel, faLock, faLockOpen, faPlusCircle, faReceipt, faUnlock } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, dateFormatter2, downloadExcel, errorToastr, initialDataState, successToastr } from "../../../HelperMethods";
import { PayPeriodCell } from "../../TimeSheets/TimeSheetInformation/GlobalActions";
import ClientActivityChart from "./ClientActivityChart";
import { ExportExcel } from "./GlobalActions";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import reportServices from "../../Shared/Services/ReportServices";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ClientActivityReportProps { }

export interface ClientActivityReportState {
  searchString: string;
  data: any;
  result?: any;
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
  isGridActive?: boolean;
  dataQuery?: any;
}

class ClientActivityReport extends React.Component<ClientActivityReportProps, ClientActivityReportState> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
  dataState;
  data = [];
  componentRef;
  totalAmount: any;
  aggregates = [
    { field: "totalAmount", aggregate: "sum" },
    { field: "totalHours", aggregate: "sum" },
  ];
  constructor(props: ClientActivityReportProps) {
    super(props);
    this.dataState = {
      initialDataState,
      group: [{ field: "division" }, { field: "candidateName" }],
    };
    this.state = {
      searchString: "",
      data: [],
      allData: [],
      dataState: this.dataState,
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      onFirstLoad: true,
      showLoader: true,
      isGridActive: true
    };

  }
  componentDidMount() {
    this.createAppState(this.state.dataState);
  }

  getClientActivityReport = (dataQuery?, dataState?,isAdvanceSearch?) => {
    if (!isAdvanceSearch) {
      this.state.dataState.skip = 0;
    }
    this.state.dataState.filter = dataQuery.filter;
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    let finalQueryString = CreateQueryString(dataQuery,this.state.clientId, this.state.vendorId);
    axios.get(`api/report/ca?${`$count=true&`}${finalQueryString}`).then((res) => {
      this.data = res.data.items;
      let dataStateCopy = (this.state.onFirstLoad && dataState==undefined)
        ? this.dataState
        : (!this.state.onFirstLoad && dataState==undefined)
          ? {
            initialDataState,
            group: this.state.dataState.group
          } :
          {
            skip: dataState.take==dataState.skip || dataState.take < dataState.skip ? 0 : dataState.skip,
            take: dataState.take,
            group: dataState.group
          };
      this.setState(
        {
          data: res.data.items,
          result: process(res.data.items, dataStateCopy),
          showLoader: false,
          onFirstLoad: false,
          allData:res.data.items,
          totalCount: res.data.count
        }
      );
    });
  };


  onDataStateChange = (changeEvent) => {
    let dataState2;
    if (changeEvent.data.filter) {
      dataState2 = {
        filter: changeEvent.data.filter,
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (changeEvent.data.sort) {
      dataState2 = {
        sort: changeEvent.data.sort,
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (changeEvent.data.sort==undefined && changeEvent.data.filter==undefined) {
      dataState2 = {
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (this.state.dataState.group.length==changeEvent.data.group.length) {
      return this.setState(
        {
          dataState: dataState2,
        },
        () => this.getClientActivityReport(this.state.dataState, dataState2,true)
      );
    } else {
      changeEvent.data.group.length <= 2 && changeEvent.data.group.length >= 0
        ? this.setState(this.createAppState(changeEvent.data))
        : errorToastr("Only two columns can be grouped at once!");
    }
  };

  createAppState(dataState) {
    const groups = dataState.group;
    if (groups) {
      groups.map((group) => (group.aggregates = this.aggregates));
    }
    let dataState2 = {
      skip: dataState.skip,
      take: dataState.take,
      group: dataState.group,
    };
    // this.setState({ dataState: dataState2 })
    // this.dataState = dataState2;
    return {
      result: process(this.data, dataState2),
      dataState: dataState2,
    };
  }

  advancedSearchStates = () => {
    let states = {
      division: "",
      originalDivision: [],
      location: "",
    };
    return states;
  };

  cellRender(cellProps) {
    if (cellProps.rowType =="groupHeader") {
      if (cellProps.field =="totalAmount") {
        return (
          <div className="vendor-totalhours-totalamount">
            Total Hours: {cellProps.dataItem.aggregates.totalHours.sum.toFixed(2)},
            <span className="ml-1">
              Total Amount:{" "}
              {currencyFormatter(cellProps.dataItem.aggregates.totalAmount.sum)}
            </span>
          </div>
        );
      }
    }
    return <td></td>;
  }

  PayPeriodCell = (props) => {
    if (!props.dataItem.hasOwnProperty("aggregates")) {
      var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
      return (
        <td contextMenu="Pay Period">
          <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
            {" "}
            {dateFormatter2(props.dataItem.startDate) + " - " + dateFormatter2(props.dataItem.endDate)}{" "}
          </Link>
        </td>
      );
    }
    else return null;
  };

  BilingCell = (props) => {
    if (!props.dataItem.hasOwnProperty("aggregates")) {
      return (
        <td contextMenu="Billing" className="text-center">
          <FontAwesomeIcon icon={props.dataItem.vendorInvoiceId ? faLock : faLockOpen} className={"ml-2 mr-2"} style={{ color: "#808080" }}></FontAwesomeIcon>
        </td>
      );
    }
    else return null;
  };

  SatusCell = (props) => {
    if (!props.dataItem.hasOwnProperty("aggregates")) {
      return (
        StatusCell(props)
      );
    }
    else return null;
  };

  CellRender = (props: GridCellProps, titleValue, isCurrency?) => {
    var fieldValue = props.dataItem[props.field];
    if (props.field.indexOf(".") > -1) {
      var fieldArray = props.field.split(".");
      if (props.dataItem[fieldArray[0]]) {
        fieldValue = props.dataItem[fieldArray[0]][fieldArray[1]];
      }
    }
    if (isCurrency) {
      if (fieldValue !=null) {
        fieldValue = currencyFormatter(new Date(fieldValue));
      }
      else {
        fieldValue = "-"
      }
    }
    return (
      <td contextMenu={titleValue} title={fieldValue}>
        {fieldValue || <div className="text-right">{""}</div>}
      </td>
    );
  };

  getTotal = (field) => {
    const totalAmoutithoutDebit =
      this.state.allData !=undefined &&
        this.state.allData !=null &&
        this.state.allData.length > 0
        ? this.state.allData.reduce(
          (acc, current) => acc + current[field],
          0
        )
        : 0;
    let total = totalAmoutithoutDebit
    this.totalAmount = total;
    return total;
  };

  amountTotal = (props) => {
    return (
      <td colSpan={18} className="t-foot-vendor">
        <div className="row mx-0 d-flex justify-content-center align-items-center">
          <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Hours: 
            {/* <span className="tfoot ml-2 tfoot-vendor"> {this.getTotal("totalHours").toFixed(2)}</span> */}
          </div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{this.getTotal("totalHours").toFixed(2)}</div>
          <div  className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Amount:
            {/* <span className="tfoot ml-2 tfoot-vendor">{currencyFormatter(this.getTotal("totalAmount"))}</span> */}
          </div>  
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{currencyFormatter(this.getTotal("totalAmount"))}</div>
          </div>
      </td>
    );
  };

  render() {
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid mt-3 mb-3 d-md-block d-block">
          <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight activity-report">
              <div className="row mx-0 align-items-center">
                <div><BreadCrumbs></BreadCrumbs></div>
                <div className="col pr-0 d-flex align-items-center justify-content-end">
                  {this.state.isGridActive && (
                    <span title="Export to Excel" onClick={() => this.downloadClientActivityReportExcel()} className="mr-2 float-right text-dark shadow invoice cursor-pointer">
                      <FontAwesomeIcon icon={faFileExcel} style={{ color: "white" }} className={"faclock_size d-block"}></FontAwesomeIcon>
                    </span>
                  )}
                  <span className={`mr-2 float-right text-dark shadow invoice cursor-pointer ${this.state.isGridActive ? 'active' : ''}`}
                    onClick={() => this.setState({ isGridActive: true })} title="Client Activity Report Grid">
                    {" "}
                    <FontAwesomeIcon
                      className="faclock_size d-block"
                      icon={faBorderAll}
                      style={{ color: "white" }}
                    />{" "}
                  </span>
                  
                  {this.state.result &&
                    <span className={`mr-2 float-right text-dark shadow invoice cursor-pointer  ${!this.state.isGridActive ? 'active' : ''}`}
                      onClick={() => this.setState({ isGridActive: false })} title="Client Activity Report Graph">
                      {" "}
                      <FontAwesomeIcon
                        className="faclock_size d-block"
                        icon={faChartBar}
                        style={{ color: "white" }}
                      />{" "}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.isGridActive ? (
          <div className="container-fluid">
            <CompleteSearch
              placeholder="Search text here!"
              handleSearch={this.getClientActivityReport}
              entityType={"ClientActivityReport"}
              onFirstLoad={this.state.onFirstLoad}
              page="ClientActivityReport"
            />
            <div className="myOrderContainer gridshadow ClientActivityReport-responsive-notuse table-footer-vendor" id="grouping-performance-grid">
              <Grid
                resizable={false}
                reorderable={false}
                sortable={true}
                pageable={{ pageSizes: true }}
                groupable={{ footer: "none" }}
                data={this.state.result}
                total={this.state.totalCount}
                onDataStateChange={this.onDataStateChange}
                {...this.state.dataState}
                className="kendo-grid-custom lastchild global-action-grid-onlyhead"
                expandField="expanded"
              // cellRender={this.cellRender}
              >
                <GridNoRecords>
                  {GridNoRecord(this.state.showLoader)}
                </GridNoRecords>
                <GridColumn
                  field="candidateName"
                  title="Candidate Name"
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Candidate Name"} title={props.dataItem.candidateName}>
                        {props.dataItem.candidateName}
                      </td>
                    );
                  }}
                  columnMenu={ColumnMenu}
                />
                <GridColumn
                  field="position"
                  title="Position"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Position"} title={props.dataItem.position}>
                        {props.dataItem.position}
                      </td>
                    );
                  }}
                />
                {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
                <GridColumn
                  field="client"
                  title="Client"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Client"} title={props.dataItem.client}>
                        {props.dataItem.client}
                      </td>
                    );
                  }}
                />
  }
                <GridColumn
                  field="zone"
                  title="Zone"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Zone"} title={props.dataItem.zone}>
                        {props.dataItem.zone}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  field="region"
                  title="Region"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Region"} title={props.dataItem.region}>
                        {props.dataItem.region}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  field="division"
                  title="Division"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Division"} title={props.dataItem.division}>
                        {props.dataItem.division}
                      </td>
                    );
                  }}
                  filter="text"
                />
                <GridColumn
                  field="location"
                  title="Location"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Location"} title={props.dataItem.location}>
                        {props.dataItem.location}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  field="payPeriod"
                  title="Pay Period"
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Pay Period"} title={props.dataItem.payPeriod}>
                        <Link
                          className="orderNumberTd orderNumberTdBalck" style={{ color: "#007bff" }}
                          to={`/timesheet/${props.dataItem.tsWeekId}/edit`}
                        >
                          {props.dataItem.payPeriod}
                        </Link>
                      </td>
                    );
                  }}
                  columnMenu={ColumnMenu}
                  footerCell={this.amountTotal}
                />
                {/* <GridColumn
                  title="Pay Period"
                  width="150px"
                  columnMenu={ColumnMenu}
                  cell={(props) => this.PayPeriodCell(props)}
                  //filter="text"
                  //footerCell={this.state.allData.length > 0 && this.amountTotal}
                /> */}
                <GridColumn
                  field="totalHours"
                  width="100px"
                  title="Hours"
                  headerClassName="text-right pr-4"
                  filter={"numeric"}
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none" style={{ width: "0px" }}></td>;
                    }
                    return props.dataItem.totalHours != undefined
                      && props.dataItem.totalHours != null && props.dataItem.totalHours > 0
                      ? <td contextMenu={"Hours"} className="text-right pr-4">{parseFloat(props.dataItem.totalHours).toFixed(2)}</td>
                      : <td contextMenu={"Hours"} style={{ textAlign: "center" }}>{""}</td>
                  }}
                />
                <GridColumn
                  field="totalAmount"
                  title="Amount"
                  filter={"numeric"}
                  headerClassName="text-right pr-4"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="vendor-details-with-zero">{this.cellRender(props)}</td>;
                    }
                    return <td contextMenu={"Amount"} className="text-right pr-4">{props.dataItem.totalAmount != undefined
                      && props.dataItem.totalAmount != null && props.dataItem.totalAmount > 0
                      ? currencyFormatter(props.dataItem.totalAmount)
                      : ""}</td>
                  }}
                />
                <GridColumn field="status" width="160px" title="Status" columnMenu={ColumnMenu} cell={this.SatusCell} />
                <GridColumn
                  title="Billing" width="80px"
                  cell={(props) => this.BilingCell(props)}
                />
              </Grid>
            </div>
          </div>
        ) :
          (
            <ClientActivityChart data={this.state.allData}></ClientActivityChart>
          )
        }
      </div>
    );
  }

  downloadClientActivityReportExcel = () => {
    var finalState: State = {
      ...this.state.dataState,
      take: null,
      skip: 0,
    };
    successToastr(EXCEL_DOWNLOAD_INPROGRESS);
    reportServices.getClientActivityReportForExcel(this.state.clientId, this.state.vendorId, finalState).then((res: any) => {
        if (res) {
            downloadExcel("Client Activity Report.xlsx", res.data);
        }
    });
  }
}
export default ClientActivityReport;
