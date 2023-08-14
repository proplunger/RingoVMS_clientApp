import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, DownloadDocument, PayPeriodEndCell, PayPeriodStartCell,VendorInvoiceNumberCell, ViewMoreComponent } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, dateFormatter, dateFormatter2, errorToastr, localDateTime, successToastr } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { AuthRole } from "../../Shared/AppConstants";
import reportServices from "../../Shared/Services/ReportServices";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import Collapsible from "react-collapsible";
import ConfirmationAssignmentReportInformation from "./ConfirmationAssignmentReportInformation";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ConfirmationAssignmentReportProps { }

export interface ConfirmationAssignmentReportState {
  clientId?: any;
  vendorId?: any;
  searchString: string;
  data: any;
  allData?: any;
  dataState: any;
  showLoader?: boolean;
  totalCount?: number;
  onFirstLoad: boolean;
  result?: any;
  dataQuery?: any;
  isDataManipulated?: boolean;
  toggleFirst: boolean;
  startDate: Date;
  endDate: Date;
  provider?: any;
  associatedVendor?: any;
  cnfStatus?:any;
  isDirty?: boolean;
  preStartDate?: any;
  preEndDate?: any;
  preAssociate?: any;
  isRun?: boolean;
}

class ConfirmationAssignmentReport extends React.Component<ConfirmationAssignmentReportProps, ConfirmationAssignmentReportState> {
  public dataItem: any;
  public openModal: any;
  dataState;
  // aggregates = [
  //   { field: "amount", aggregate: "sum", format: "{0:##,#}" }
  // ];
  data = [];

  constructor(props: ConfirmationAssignmentReportProps) {
    super(props);
    this.dataState = {
      skip: 0,
      take: 10,
      group: [{ field: "confirmStatus" }]
    };
    this.state = {
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      searchString: "",
      data: [],
      result:
        { data: [] },
      dataState: this.dataState,
      onFirstLoad: true,
      showLoader: true,
      toggleFirst: true,
      startDate: null,
      endDate: null,
      provider: [],
      associatedVendor:[],
      cnfStatus:[],
      preStartDate: null,
      preEndDate: null,
      preAssociate: [],
    };

  }

  componentDidMount() {
    this.createAppState(this.state.dataState);
  }

  getConfirmationAssignmentReport = (dataQuery?, dataState?,isAdvanceSearch?) => {
    debugger
    // let dataStateCopy = {
    //   skip: 0,
    //   take: this.state.dataState.take,
    //   group: this.state.dataState.group
    // };
    let dataStateCopy = (this.state.onFirstLoad && dataState==undefined)
    ? this.dataState
    : (!this.state.onFirstLoad && dataState==undefined)
      ? {
        skip: 0,
        take: 10,
        group: this.state.dataState.group
      } :
      {
        skip: dataState.take==dataState.skip || dataState.take < dataState.skip ? 0 : dataState.skip,
        take: dataState.take,
        group: dataState.group
      };
    if (!isAdvanceSearch) {
      this.state.dataState.skip = 0;
    }
    this.state.dataState.filter = dataQuery.filter;
    let startDate = this.state.startDate ? dateFormatter(this.state.startDate) : null;
    let endDate = this.state.endDate ? dateFormatter(this.state.endDate) : null;    
    let provider = this.extractNames(this.state.provider);
    let associatedVendor = this.extractAssociatedVendorNames(this.state.associatedVendor);
    let cnfStatus = this.extractCnfName(this.state.cnfStatus)
    let start = startDate ? new Date(startDate).toISOString().substring(0, 10) : " "
    let end = endDate ? new Date(endDate).toISOString().substring(0, 10) : " "
    // var filterValidation = (this.state.provider ==null || this.state.startDate ==null || this.state.endDate ==null || this.state.associatedVendor ==null || this.state.cnfStatus ==null)
    var filterValidation = (this.state.cnfStatus ==null || this.state.cnfStatus ==undefined || this.state.cnfStatus.length ==0)
    if (filterValidation) {
      this.setState(
        {
          totalCount: 0,
          data: [],
          result: process([], dataStateCopy),
          showLoader: false,
          onFirstLoad: false,
          dataQuery: dataQuery,
        })
      return false
    }
    // if (isAdvanceSearch) {
    //   this.state.dataState.skip = 0;
    // }
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
      let finalQueryString = CreateQueryString(dataQuery, this.state.clientId, this.state.vendorId);
    axios.get(`api/report/confar?${`$count=true&`}&provider=${provider}&associatedVendor=${associatedVendor}&cnfStatus=${cnfStatus}&startDate=${start}&endDate=${end}&${finalQueryString}`).then((res) => {
        // axios.get(`api/report/car?${`$count=true&`}&startDate=${startDate}&endDate=${endDate}&provider=${provider}&associatedVendor=${associatedVendor}&cnfStatus=${cnfStatus}&${finalQueryString}`).then((res) => {

      this.data = res.data;
      this.setState(
        {
          isRun: true,
          totalCount: res.data.count,
          data: res.data.items,
          result: process(res.data.items, dataStateCopy),
          showLoader: false,
          onFirstLoad: false,
          dataQuery: dataQuery,
        }
      );
    });
  };
  extractNames = (data) => {
    if (data !=null) {
      let selectedIds = [];
      data.forEach((item) => {
        selectedIds.push(item.candidateFullName);
      });
      return selectedIds;
    }
  }

  extractAssociatedVendorNames = (data) => {
    if (data !=null) {
      let selectedIds = [];
      data.forEach((item) => {
        selectedIds.push(item.vendor);
      });
      return selectedIds;
    }
  }
  extractCnfName = (data) => {
    if (data !=null) {
      let selectedIds = [];
      data.forEach((item) => {
        selectedIds.push(item.cnfStatus);
      });
      return selectedIds;
    }
  }
  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  // onDataStateChange = (changeEvent) => {
  //   if (this.state.dataQuery.filter) {
  //     changeEvent.data.filter = this.state.dataQuery.filter;
  //   }
  //   this.state.dataState.group = changeEvent.data.group;
  //   this.state.dataState.skip = changeEvent.data.skip;
  //   this.state.dataState.take = changeEvent.data.take;
  //   this.setState({ dataState: this.state.dataState });
  //   this.getConfirmationAssignmentReport(changeEvent.data);
  // };

  onDataStateChange = (changeEvent) => {
    let dataState2;
    if (changeEvent.data.filter) {
      dataState2 = {
        filter: changeEvent.data.filter,
        // sort: changeEvent.data.sort.length > 0 ? changeEvent.data.sort : [],
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (changeEvent.data.sort) {
      dataState2 = {
        filter: changeEvent.data.filter ? changeEvent.data.filter : null,
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
    // if (this.state.dataState.group.length==changeEvent.data.group.length) {
      return this.setState(
        {
          dataState: dataState2,
        },
        () => this.getConfirmationAssignmentReport(this.state.dataState, dataState2,true)
      );
    // } 
    // else {
    //   changeEvent.data.group.length <= 2 && changeEvent.data.group.length >= 0
    //     ? this.setState(this.createAppState(changeEvent.data))
    //     : errorToastr("Only two columns can be grouped at once!");
    // // }
    // this.setState({ dataState: dataState2 });
    // this.getConfirmationAssignmentReport(changeEvent.data);
  };

  createAppState(dataState) {
    let dataState2 = {
      skip: dataState.skip,
      take: dataState.take,
      group: dataState.group,
    };
    return {
      result: process(this.data, dataState2),
      dataState: dataState2,
    };
  }
  
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

  handleChange = (e) => {
    let change = { isDirty: true };
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  handleReset = (e) => {
    this.setState(
      {
        provider: [],
        startDate: null,
        endDate: null,
        associatedVendor:[],
        cnfStatus:[],
        isRun: false
      },
      () => {
        this.getConfirmationAssignmentReport(e);
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

  // cellRender(cellProps) {
  //   if (cellProps.rowType =="groupHeader" && cellProps.dataItem.aggregates.amount) {
  //     let amount = currencyFormatter(cellProps.dataItem.aggregates.amount.sum);      
  //     return (
  //       <div className="time-and-expense">
  //             {cellProps.dataItem.field=="location" ? <span > {amount}</span> : ""}
  //             {cellProps.dataItem.field=="position" ? <span > {amount}</span> : ""}
  //             {cellProps.dataItem.field=="associate" ? <span > {amount}</span> : ""}
  //       </div>
  //     );
  //   }
  //   return <td></td>;
  // }

  render() {
    const {
      provider,
      startDate,
      endDate,
      associatedVendor,
      cnfStatus,
      toggleFirst
    } = this.state;
    const associateInfo = {
      provider,
      startDate,
      endDate,
      associatedVendor,
      cnfStatus
    };
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid mt-3 mb-3 d-md-block d-block">
          <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
              <div><BreadCrumbs></BreadCrumbs></div>
              <span className="float-right text-dark cursor-pointer">
                <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                  <span
                    title="Excel"
                    onClick={() => this.downloadConfirmationAssignmentReportExcel()} >
                    <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
                  </span>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            page="ConfirmationAssignment"
            entityType="ConfirmationAssignment"
            handleSearch={(d) => this.getConfirmationAssignmentReport(d, true)}
            onFirstLoad={this.state.onFirstLoad}
          />
          <Collapsible
            trigger="Filter"
            open={toggleFirst}
            onTriggerOpening={() => this.setState({ toggleFirst: true })}
            onTriggerClosing={() => this.setState({ toggleFirst: false })}
          >
            <ConfirmationAssignmentReportInformation
              data={associateInfo}
              handleChange={this.handleChange}
              handleChangeCnfStatus={this.handleChange}
              generateAssociate={this.getConfirmationAssignmentReport}
              handleReset={this.handleReset}
              dataState={this.state.dataState}
            />
          </Collapsible>
          <div className="myOrderContainer gridshadow ClientActivityReport-responsive-notuse table-footer-vendor" id="grouping-performance-grid">
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
              className="kendo-grid-custom lastchild global-action-grid-onlyhead"
              onExpandChange={this.expandChange}
              expandField="expanded"
              detail={ViewMoreComponent}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn field="division"
                width={100}
                title="Division"
                columnMenu={ColumnMenu} 
                />
              <GridColumn
                field="location"
                width={140}
                title="Location"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Location")}
              />
              <GridColumn
                field="provider"
                width={130}
                title="Provider"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Provider")}
              />
              <GridColumn
                field="position"
                width={130}
                title="Position"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Position")}
              />
              <GridColumn
                field="startDate"
                width={130}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Assignment Start"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Assignment Start")}
              />
              <GridColumn
                field="endDate"
                width={130}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Assignment End"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Assignment End")}
              />
                <GridColumn
                field="confirmStatus"
                width={110}
                title="Confirm Status"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Confirm Status")}
              />
              <GridColumn
                field="createdDate"
                width={110}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Date Created"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Expense Date")}
              />
              <GridColumn
                field="filePath"
                width={80}
                title="Attached Documents"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none" style={{ width: "0px" }}></td>;
                  }
                  return <td contextMenu="Attached Documents">
                    <FontAwesomeIcon
                      className="nonactive-icon-color mr-2 cursor-pointer"
                      title="Download Document(s)"
                      icon={faFilePdf}
                      onClick={() => DownloadDocument(props.dataItem.filePath)}
                    />
                  </td>
                }}
              />
              <GridColumn sortable={false} field="expanded" width={66} title="View More"
                cell={this.ExpandCell}
              />
            </Grid>
          </div>
        </div>
      </div>
    );
  } 

    downloadConfirmationAssignmentReportExcel = () => {
        var finalState: State = {
            ...this.state.dataQuery,
            take: null,
            skip: 0,
        };
        let startDate = this.state.startDate ? dateFormatter(this.state.startDate) : null;
        let endDate = this.state.endDate ? dateFormatter(this.state.endDate) : null;    
        let provider = this.extractNames(this.state.provider);
        let associatedVendor = this.extractAssociatedVendorNames(this.state.associatedVendor);
        let cnfStatus = this.extractCnfName(this.state.cnfStatus);
        let start = startDate ? new Date(startDate).toISOString().substring(0, 10) : " "
        let end = endDate ? new Date(endDate).toISOString().substring(0, 10) : " "
        if (this.state.isRun ==true) {
            let finalQueryString = CreateQueryString(finalState, this.state.clientId, this.state.vendorId);
            successToastr(EXCEL_DOWNLOAD_INPROGRESS);
            axios.get(`/api/grid/carexcel?${`$count=true&`}&provider=${provider}&associatedVendor=${associatedVendor}&cnfStatus=${cnfStatus}&startDate=${start}&endDate=${end}&${finalQueryString}`).then((res: any) => {
                if (res) {
                    let fileExt = ".xlsx";
                    let fileType = "application";

                    const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                    const downloadLink = document.createElement("a");
                    let fileName = "ConfirmationAssignmentReport.xlsx";

                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            });
        }
    }
}
export default ConfirmationAssignmentReport;
