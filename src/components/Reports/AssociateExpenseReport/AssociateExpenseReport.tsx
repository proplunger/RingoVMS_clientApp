import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State } from "@progress/kendo-data-query";
import { DetailColumnCell, PayPeriodStartCell,VendorInvoiceNumberCell, ViewMoreComponent } from "./GlobalActions";
import { CreateQueryString } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, dateFormatter, successToastr } from "../../../HelperMethods";
import { SearchData } from "../../Shared/AppConstants";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import Collapsible from "react-collapsible";
import AssociateExpenseReportInformation from "./AssociateExpenseReportInformation";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface AssociateExpenseReportProps { }

export interface AssociateExpenseReportState {
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
  associate?: any;
  isDirty?: boolean;
  preStartDate?: any;
  preEndDate?: any;
  preAssociate?: any;
  isRun?: boolean;
}

class AssociateExpenseReport extends React.Component<AssociateExpenseReportProps, AssociateExpenseReportState> {
  public dataItem: any;
  public openModal: any;
  dataState;
  aggregates = [
    { field: "amount", aggregate: "sum", format: "{0:##,#}" }
  ];
  data = [];

  constructor(props: AssociateExpenseReportProps) {
    super(props);
    this.dataState = {
      skip: 0,
      take: 10,
      //group: [{ field: "location" }, { field: "position" }, { field: "associate" }],
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
      associate: [],
      preStartDate: null,
      preEndDate: null,
      preAssociate: [],
    };

  }

  componentDidMount() {
   // this.createAppState(this.state.dataState);

    let searchData = JSON.parse(localStorage.getItem(`${SearchData.REPORTASSOCIATEEXPENSE}`))

        if (searchData) {
            if (searchData.startDate && searchData.startDate !="undefined" && searchData.endDate && searchData.endDate !="undefined" && searchData.associate && searchData.associate !="undefined") {
                this.setState({
                    startDate: searchData.startDate,
                    endDate: searchData.endDate,
                    associate: searchData.associate,
                })
            }
        }
  }

  getAssociateExpenseReport = (dataQuery?, isAdvanceSearch?) => {
    var searchData = {}
    let dataStateCopy = {
      skip: 0,
      take: this.state.dataState.take,
      //group: this.state.dataState.group
    };
    let startDate = dateFormatter(this.state.startDate);
    let endDate = dateFormatter(this.state.endDate);
    let associate = this.extractNames(this.state.associate);
    var filterValidation = (this.state.associate ==null || this.state.startDate ==null || this.state.endDate ==null)
    if (filterValidation) {
      this.setState(
        {
          totalCount: 0,
          data: [],
          result: process([], dataStateCopy),
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
      'associate': this.state.associate,
    }

    localStorage[`${SearchData.REPORTASSOCIATEEXPENSE}`] = JSON.stringify(searchData)

    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    let finalQueryString = CreateQueryString(dataQuery, this.state.clientId, this.state.vendorId);
    axios.get(`api/report/ae?${`$count=true&`}&startDate=${new Date(startDate).toISOString().substring(0, 10)}&endDate=${new Date(endDate).toISOString().substring(0, 10)}&associate=${associate}&${finalQueryString}`).then((res) => {
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

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    this.state.dataState.filter = changeEvent.data.filter;
    this.state.dataState.sort = changeEvent.data.sort;
    //this.state.dataState.group = changeEvent.data.group;
    this.state.dataState.skip = changeEvent.data.skip;
    this.state.dataState.take = changeEvent.data.take;
    this.setState({ dataState: this.state.dataState });
    this.getAssociateExpenseReport(changeEvent.data);
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
    var searchData = {}
    searchData = {}

    localStorage[`${SearchData.REPORTASSOCIATEEXPENSE}`] = JSON.stringify(searchData)

    this.setState(
      {
        associate: null,
        startDate: null,
        endDate: null,
        isRun: false
      },
      () => {
        this.getAssociateExpenseReport(e);
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

  cellRender(cellProps) {
    if (cellProps.rowType =="groupHeader" && cellProps.dataItem.aggregates.amount) {
      let amount = currencyFormatter(cellProps.dataItem.aggregates.amount.sum);      
      return (
        <div className="time-and-expense">
              {cellProps.dataItem.field=="location" ? <span > {amount}</span> : ""}
              {cellProps.dataItem.field=="position" ? <span > {amount}</span> : ""}
              {cellProps.dataItem.field=="associate" ? <span > {amount}</span> : ""}
        </div>
      );
    }
    return <td></td>;
  }

  render() {
    const {
      associate,
      startDate,
      endDate,
      toggleFirst
    } = this.state;
    const associateInfo = {
      associate,
      startDate,
      endDate
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
                    onClick={() => this.downloadAssociateExpenseReportExcel()} >
                    <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
                  </span>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            page="AssociateExpense"
            entityType="AssociateExpense"
            handleSearch={(d) => this.getAssociateExpenseReport(d, true)}
            onFirstLoad={this.state.onFirstLoad}
          />
          <Collapsible
            trigger="Filter"
            open={toggleFirst}
            onTriggerOpening={() => this.setState({ toggleFirst: true })}
            onTriggerClosing={() => this.setState({ toggleFirst: false })}
          >
            <AssociateExpenseReportInformation
              data={associateInfo}
              handleChange={this.handleChange}
              generateAssociate={this.getAssociateExpenseReport}
              handleReset={this.handleReset}
              dataState={this.state.dataState}
            />
          </Collapsible>
          <div className="myOrderContainer gridshadow ClientActivityReport-responsive-notuse table-footer-vendor" id="grouping-performance-grid">
          <Grid
             // resizable={true}
             // reorderable={true}
             style={{ height: "auto" }}
              sortable={true}
              pageable={{ pageSizes: true }}
              //groupable={{ footer: "none" }}
              data={this.state.result.data}
              total={this.state.totalCount}
              onDataStateChange={this.onDataStateChange}
              {...this.state.dataState}
              className="kendo-grid-custom lastchild report-grid"
             // className="kendo-grid-custom lastchild global-action-grid-onlyhead"
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
                width={100}
                title="Location"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Location")}
              />
              <GridColumn
                field="associate"
                width={100}
                title="Associate"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Candidate")}
              />
              <GridColumn
                field="position"
                width={150}
                title="Position"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Position")}
              />
              <GridColumn
                field="payPeriodStartDate"
                width={100}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Pay Period Start"
                columnMenu={ColumnMenu}
                cell={PayPeriodStartCell}
              />
              <GridColumn
                field="payPeriodEndDate"
                width={100}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Pay Period End"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Pay Period End")}
              />
              <GridColumn
                field="expenseVendorInvoiceNumber"
                width={180}
                title="Vendor Invoice Number"
                cell={VendorInvoiceNumberCell}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="serviceType"
                width={100}
                title="Service Type"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Service Type")}
              />
              <GridColumn
                field="expenseDate"
                width={100}
                filter="date"
                format="{0:d}"
                editor="date"
                title="Expense Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Expense Date")}
              />
              <GridColumn
                field="amount"
                width={80}
                title="Amount ($)"
                filter={"numeric"}
                headerClassName="text-right pr-4"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Amount")}
                // cell={(props) => {
                //   if (props.dataItem.amount =="" || props.dataItem.amount ==null) {
                //     return <td colSpan={0} className="vendor-details-with-zero"></td>
                //   }
                //   if (props.rowType=="groupHeader") {
                //     return <td colSpan={0} className="vendor-details-with-zero">{this.cellRender(props)}</td>;
                //   }
                //   return <td
                //     contextMenu={"Amount ($)"}
                //     style={{ textAlign: "right" }}
                //     title={props.dataItem.amount}
                //     className="pr-4"
                //   >
                //     {currencyFormatter(props.dataItem.amount)}
                //   </td>
                // }}

              />
              <GridColumn sortable={false} field="expanded" width={78} title="View More"
                cell={this.ExpandCell}
              />
            </Grid>
          </div>
        </div>
      </div>
    );
  } 

    downloadAssociateExpenseReportExcel = () => {
        var finalState: State = {
            ...this.state.dataState,
            take: null,
            skip: 0,
        };
        let startDate = dateFormatter(this.state.startDate);
        let endDate = dateFormatter(this.state.endDate);
        let associate = this.extractNames(this.state.associate);
        if (this.state.isRun ==true) {
            let finalQueryString = CreateQueryString(finalState, this.state.clientId, this.state.vendorId);
            successToastr(EXCEL_DOWNLOAD_INPROGRESS);
            axios.get(`/api/grid/aeexcel?startDate=${new Date(startDate).toISOString().substring(0, 10)}&endDate=${new Date(endDate).toISOString().substring(0, 10)}&associate=${associate}&${finalQueryString}`).then((res: any) => {
                if (res) {
                    let fileExt = ".xlsx";
                    let fileType = "application";

                    const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                    const downloadLink = document.createElement("a");
                    let fileName = "AssociateExpenseReport.xlsx";

                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            });
        }
    }
}
export default AssociateExpenseReport;
