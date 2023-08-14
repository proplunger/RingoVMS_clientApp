import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, PayPeriodCell, ExportExcel, ReqNumberCell } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, errorToastr, successToastr } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { AuthRole } from "../../Shared/AppConstants";
import reportServices from "../../Shared/Services/ReportServices";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface VendorPerformanceReportProps { }

export interface VendorPerformanceReportState {
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
  result?: any;
  dataQuery?: any;
  isDataManipulated?:boolean;
  isVendorRole?:boolean;
}



class VendorPerformanceReport extends React.Component<VendorPerformanceReportProps, VendorPerformanceReportState> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
  public reqId: string;
  public dataItem: any;
  public openModal: any;
  dataState;
  aggregates = [
  ];
  data = [];

  constructor(props: VendorPerformanceReportProps) {
    super(props);
    this.dataState = {
      skip: 0,
      take: 5,
      group: [{ field: "reqNumber", dir: "desc" }],
    };
    this.state = {
      searchString: "",
      data: [],
      result:
        { data: [] },
      dataState: this.dataState,
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      isVendorRole: AuthRole.Vendor_9==this.userObj.role || AuthRole.Vendor_10==this.userObj.role || AuthRole.Vendor_11==this.userObj.role || AuthRole.NAPA_VENDOR==this.userObj.role,
      onFirstLoad: true,
      showLoader: true,
    };

  }
  componentDidMount() {
  }

  getVendorPerformanceReport = (dataQuery?, isAdvanceSearch?) => {
    if (isAdvanceSearch) {
      this.state.dataState.skip = 0;
    }
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    let finalQueryString = CreateQueryString(dataQuery,this.state.clientId, this.state.vendorId);

    axios.get(`api/report/vp?${finalQueryString}`).then((res) => {
      this.data = res.data;
      let dataStateCopy = {
        skip: 0,
        take: this.state.dataState.take,
        group: this.state.dataState.group
      };
      this.setState(
        {
          data: res.data,
          result: process(res.data, dataStateCopy),
          showLoader: false,
          onFirstLoad: false,
          dataQuery: dataQuery,
        },
        () => this.getVendorPerformanceReportCount(dataQuery)
      );
    });
  };


  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    if (this.state.dataQuery.filter) {
      changeEvent.data.filter = this.state.dataQuery.filter;
    }
    this.state.dataState.group = changeEvent.data.group;
    this.state.dataState.skip = changeEvent.data.skip;
    this.state.dataState.take = changeEvent.data.take;
    this.setState({ dataState: this.state.dataState });
    this.getVendorPerformanceReport(changeEvent.data);
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
                <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                  <span
                    title="Excel"
                    onClick={() => this.downloadVendorPerformanceReportExcel()} >
                    <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
                  </span>
                </div>
              </span>              
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            page="VendorPerformance"
            entityType="VendorPerformance"
            handleSearch={(d)=>this.getVendorPerformanceReport(d,true)}
            onFirstLoad={this.state.onFirstLoad}
          />
          <div className="myOrderContainer gridshadow global-action-grid-onlyhead" id="grouping-performance-grid">
            <Grid
              resizable={true}
              reorderable={true}
              sortable={true}
              pageable={{ pageSizes: true }}
              groupable={{ footer: "none" }}
              data={this.state.result.data}
              total={this.state.totalCount}
              onDataStateChange={this.onDataStateChange}
              {...this.state.dataState}
              className="kendo-grid-custom lastchild  report-grid"
              onExpandChange={this.expandChange}
              expandField="expanded"
              // sort={[{field:"reqNumber", dir:"desc"}]}
              //resizable={true}
              //reorderable={true}
              //sortable={true}
              //pageable={{ pageSizes: true }}
              //groupable={{ footer: "none" }}
              //data={this.state.result}
              //onDataStateChange={this.onDataStateChange}
              //{...this.state.dataState}
              //className="kendo-grid-custom lastchild  report-grid"
              //onExpandChange={this.expandChange}
              //expandField="expanded"

              detail={ViewMoreComponent}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
                            
    
              <GridColumn
                field="client"
                // width="150px"
                title="Client"
                // cell={(props) => CellRender(props, "Client")}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (

                    <td contextMenu="Client" title={props.dataItem.client}>
                      <span className="my-task-desciption">{props.dataItem.client}</span>
                    </td>
                  )
                }}
                columnMenu={ColumnMenu}
              /> 
               }
              <GridColumn field="reqNumber"
                // width="130px" 
                title="Req#"
                cell={ReqNumberCell}
                columnMenu={ColumnMenu} />

              {/* <GridColumn
                field="position"
                width="80px"
                title="Position"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Position")}
              /> */}
              <GridColumn
                field="startDate"
                //width="100px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Start Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Start Date")}
              />
              <GridColumn
                field="endDate"
               //width="100px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="End Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "End Date")}
              />
              <GridColumn
                field="required"
                title="Required"
                filter={"numeric"}
                headerClassName="text-right pr-4"
                cell={(props) => NumberCell(props, "Required")}
                columnMenu={ColumnMenu}
              />
              {/* <GridColumn
                field="tier"
                title="Tier"
                width="80px"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Tier")}
              /> */}
              <GridColumn
                field="vendor"
                // width="180px"
                title="Release to Vendor"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Release to Vendor")}
              />
              <GridColumn
                field="releaseDate"
                //width="120px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Release Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Release Date")}
              />
              <GridColumn
                field="submittal"
                title="Submittal"
                filter={"numeric"}
                headerClassName="text-right pr-4"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td className="text-right pr-4" contextMenu={"Submittal"}
                      title={props.dataItem.submittal}
                    >  {props.dataItem.submittal ?
                      <Link className="orderNumberTd orderNumberTdBalck" to={`/report/cas?filter=reqId eq ${props.dataItem.reqId}`} style={{ color: "#007bff" }}>
                        {props.dataItem.submittal}
                      </Link>
                      : 0}
                    </td>
                  );
                }}
              />
              {/* <GridColumn field="timeToFill" title="Time To Fill" columnMenu={ColumnMenu} cell={(props) => CellRender(props, "Time To Fill")} /> */}
              <GridColumn sortable={false} field="expanded" width="80px" title="View More"
                cell={this.ExpandCell}
              />

            </Grid>
          </div>
        </div>
      </div>
    );
  }

  getVendorPerformanceReportCount = (dataState) => {
    var finalState: State = {
      ...dataState,
    };
    let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
    axios.get(`api/grid/vpcount?${`$count=true&`}${finalQueryString}`).then((res) => {
      this.setState({
        totalCount: res.data.count,
        isDataManipulated:true
      });
    });
  };  

  downloadVendorPerformanceReportExcel = () => {
    var finalState: State = {
      ...this.state.dataState,
      take: null,
      skip: 0,
    };
    let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
    successToastr(EXCEL_DOWNLOAD_INPROGRESS);
    axios.get(`/api/grid/vpexcel?${finalQueryString}`).then((res: any) => {
        if (res) {
            let fileExt = ".xlsx";
            let fileType = "application";
            
            const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
            const downloadLink = document.createElement("a");
            let fileName = "VendorPerformanceReport.xlsx";

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    });
}
}
export default VendorPerformanceReport;
