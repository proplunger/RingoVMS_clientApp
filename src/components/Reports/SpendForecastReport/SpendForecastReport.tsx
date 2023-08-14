import * as React from "react";
import axios from "axios";
import auth from "../../Auth";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { clientSettingsData, currencyFormatter, dateFormatter } from "../../../HelperMethods";
import { DetailColumnCell, ExportExcel, ViewMoreComponent } from "./GlobalActions";
import { excelExport, ForecastReportExcelExport } from "./ForecastSpreadSheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Collapsible from "react-collapsible";
import SpendForecastInformation from "./SpendForecastInformation";
import { ServiceCategory, ServiceCategoryIds, SettingCategory, SETTINGS } from "../../Shared/AppConstants";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface SpendForecastReportProps { }

export interface SpendForecastReportState {
  searchString: string;
  data: any;
  rawData: any;
  result?: any;
  allData?: any;
  dataState: any;
  allDataFc: any;
  showRemoveModal?: boolean;
  showCopyModal?: boolean;
  showLoader?: boolean;
  totalCount?: number;
  showHoldPositionModal?: any;
  showReqHistoryModal?: any;
  onFirstLoad: boolean;
  dataQuery?: any;
  ServiceTypePercent?: any;
  percent?: any;
  startDate?: any;
  endDate?: any;
  toggleFirst: boolean;
  isDirty?: boolean;
  clientId?: any;
}

class SpendForecastReport extends React.Component<SpendForecastReportProps, SpendForecastReportState> {
  dataState;
  data = [];
  transformedData = [];
  transformedDataAllRecords = [];
  expenseName = [];
  timeName = [];
  divisionName = [];
  LocationName = [];
  PositionName = [];
  combinedArray = [];
  divisionFacilityArray = [];
  divisionFacilityPosArray = [];
  finalArray = [];
  finalArrayLoop = [];
  componentRef;
  totalAmount: any;
  aggregates = [
    { field: "clientBillable", aggregate: "sum",format: "{0:##,#}" },
    { field: "billableHours", aggregate: "sum",format: "{0:##,#}" },
    { field: "forecastTimeProvider1", aggregate: "sum",format: "{0:##,#}" },
    { field: "forecastExpenseProvider1", aggregate: "sum",format: "{0:##,#}" },
    { field: "forecastDivision1", aggregate: "sum",format: "{0:##,#}" },
    { field: "forecastFacility1", aggregate: "sum",format: "{0:##,#}" },
    { field: "forecastPosition1", aggregate: "sum",format: "{0:##,#}" },
  ];

  constructor(props: SpendForecastReportProps) {
    super(props);
    this.dataState = {
      skip: 0,
      take: 100,
      group: [{ field: "region" }, { field: "division" }, { field: "location" }, { field: "position" }, { field: "provider" }],
    };
    this.state = {
      searchString: "",
      data: [],
      rawData: [],
      allData: [],
      allDataFc: [],
      dataState: this.dataState,
      onFirstLoad: true,
      showLoader: true,
      ServiceTypePercent: 0,
      startDate: null,
      endDate: null,
      toggleFirst: true,
      clientId: auth.getClient(),
    };
  }

  componentDidMount() {
    this.transformedData = [];
    this.transformedDataAllRecords = [];
    this.createAppState(this.state.dataState);
    this.getClientSettings(this.state.clientId);
  }

  getSpendForecastReport = (dataQuery?, dataState?, isAdvanceSearch?) => {
    let startDate = dateFormatter(this.state.startDate);
    let endDate = dateFormatter(this.state.endDate);
    var percentValidation =  (!this.state.ServiceTypePercent || this.state.ServiceTypePercent==undefined 
                          || this.state.ServiceTypePercent==null || this.state.ServiceTypePercent < 0) ;
    if(percentValidation){ return false;}
    if (!isAdvanceSearch) {
      this.state.dataState.skip = 0;
    }
    this.state.dataState.filter = dataQuery.filter;
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    let finalQueryString = `${toODataString(dataQuery)}`;

    var config = {
      headers: {
          'Content-Type': 'text/plain'
      },
    };

    axios.post(`api/report/fc/$query?startDate=${startDate}&endDate=${endDate}&servicetypepercent=${this.state.ServiceTypePercent}`, (finalQueryString), config).then((res) => {
      this.transformedData = res.data.map((item) => {
        let ForecastRecords = {
          region: item.region,
          division: item.division,
          provider: item.provider,
          location: item.location,
          position: item.position,
          serviceCategory: item.serviceCategory,
          month: item.month,
          maxBillRate: item.maxBillRate,
          maxDays: item.maxDays,
          billableHours: item.billableHours,
          clientBillable: item.clientBillable,
          loadedForecast: item.loadedForecast,
          forecastDivision: item.forecastDivision,
          forecastFacility: item.forecastFacility
        };
        let expenseNames = []
        let timeNames = []
        let divisionNames = []
        let LocationNames = []
        let PositionNames = []
        const fcExp = JSON.parse(item.forecastExpenseProvider)//.forecastexpenseprovider
        const fcT = JSON.parse(item.forecastTimeProvider)//.forecasttime_provider
        const fcDiv = JSON.parse(item.forecastDivision)//.forcastdivision
        const fcLoc = JSON.parse(item.forecastFacility)//.forcastfacility
        const fcPos = JSON.parse(item.forecastPosition)

        for (let iExp = 0; iExp < fcExp.length; iExp++) {
          ForecastRecords[`forecastExpenseProvider${iExp + 1}`] = !isNaN(parseFloat(fcExp[iExp].Data)) ? parseFloat(fcExp[iExp].Data) : 0;
          expenseNames.push({ field: `forecastExpenseProvider${iExp + 1}`, title: `Loaded Forecast ${iExp + 1}` });
        }
        for (let iT = 0; iT < fcT.length; iT++) {
          ForecastRecords[`forecastTimeProvider${iT + 1}`] = !isNaN(parseFloat(fcT[iT].Data)) ? parseFloat(fcT[iT].Data) : 0;
          timeNames.push({ field: `forecastTimeProvider${iT + 1}`, title: `Base Forecast ${iT + 1}` });
        }
        for (let iDiv = 0; iDiv < fcDiv.length; iDiv++) {
          ForecastRecords[`forecastDivision${iDiv + 1}`] = !isNaN(parseFloat(fcDiv[iDiv].Data)) ? parseFloat(fcDiv[iDiv].Data) : 0;
          divisionNames.push({ field: `forecastDivision${iDiv + 1}`, title: `Forecast Division` });
        }
        for (let iLoc = 0; iLoc < fcLoc.length; iLoc++) {
          ForecastRecords[`forecastFacility${iLoc + 1}`] = !isNaN(parseFloat(fcLoc[iLoc].Data)) ? parseFloat(fcLoc[iLoc].Data) : 0;
          LocationNames.push({ field: `forecastFacility${iLoc + 1}`, title: `Forecast Location` });
        }
        for (let iPos = 0; iPos < fcPos.length; iPos++) {
          ForecastRecords[`forecastPosition${iPos + 1}`] = !isNaN(parseFloat(fcLoc[iPos].Data)) ? parseFloat(fcLoc[iPos].Data) : 0;
          PositionNames.push({ field: `forecastPosition${iPos + 1}`, title: `Forecast Position` });
        }
        this.expenseName = expenseNames
        this.timeName = timeNames
        this.divisionName = divisionNames
        this.LocationName = LocationNames
        this.PositionName = PositionNames

        this.divisionFacilityArray = this.divisionName.concat(this.LocationName)
        this.divisionFacilityPosArray = this.divisionFacilityArray.concat(this.PositionName)

        this.divisionFacilityPosArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });

        this.combinedArray = this.timeName.concat(this.expenseName)
        this.combinedArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });
        this.finalArray = this.divisionFacilityPosArray.concat(this.combinedArray)
        this.finalArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });
        this.finalArrayLoop = this.timeName;
        return ForecastRecords;
      });

      this.data = this.transformedData;
      let dataStateCopy = (this.state.onFirstLoad && dataState==undefined)
        ? this.dataState
        : (!this.state.onFirstLoad && dataState==undefined)
          ? {
            skip: 0,
            take: 100,
            group: this.state.dataState.group
          } :
          {
            skip: dataState.take==dataState.skip || dataState.take < dataState.skip ? 0 : dataState.skip,
            take: dataState.take,
            group: dataState.group
          };
      this.setState(
        {
          data: this.transformedData,
          result: process(this.transformedData, dataStateCopy),
          showLoader: false,
          onFirstLoad: false
        },
        () => this.getSpendForecastReportCount(dataQuery)
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
        () => this.getSpendForecastReport(this.state.dataState, dataState2, true)
      );
    } else {
      this.setState(this.createAppState(changeEvent.data))
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
      
      let forecastBaseAgg = currencyFormatter(cellProps.dataItem.aggregates.forecastTimeProvider1.sum);
      let forecastLoadedAgg = currencyFormatter(cellProps.dataItem.aggregates.forecastExpenseProvider1.sum);
      let forecastDivisionAgg = currencyFormatter(cellProps.dataItem.aggregates.forecastDivision1.sum);
      let forecastLocationAgg = currencyFormatter(cellProps.dataItem.aggregates.forecastFacility1.sum);
      let forecastPositionAgg = currencyFormatter(cellProps.dataItem.aggregates.forecastPosition1.sum);

      return (
        <div className="time-and-expense">
          {console.log("TimeValueProps", cellProps.dataItem)}

              {cellProps.dataItem.field=="provider" ?
            <><span > Base Forecast: {forecastBaseAgg}, Loaded Forecast: {forecastLoadedAgg}</span>
            </> : ""}

              {cellProps.dataItem.field=="division" ?
            <><span> Division Base Forecast: {forecastDivisionAgg}, Division Loaded Forecast: {forecastLoadedAgg} </span>
              </> : ""}

              {cellProps.dataItem.field=="location" ?
            <><span> Location Base Forecast: {forecastLocationAgg}, Location Loaded Forecast: {forecastLoadedAgg} </span>
               </> : ""}

               {cellProps.dataItem.field=="position" ?
            <><span> Position Base Forecast: {forecastPositionAgg}, Position Loaded Forecast: {forecastLoadedAgg} </span>
               </> : ""}

               {cellProps.dataItem.field=="region" ?
            <><span> Region Base Forecast: {forecastBaseAgg}, Region Loaded Forecast: {forecastLoadedAgg} </span>
               </> : ""}

        </div>
      );
    }
    return <td></td>;
  }

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
    this.transformedData !=undefined &&
    this.transformedData !=null &&
    this.transformedData.length > 0
        ? this.transformedData.reduce(
          (acc, current) => acc + current[field],
          0
        )
        : 0;
    let total = totalAmoutithoutDebit
    this.totalAmount = total;

    if(field=="billableHours"){
      total = total / 2 ;
    }

    return total;
  };

  amountTotal = (props) => {
    return (
      <td colSpan={18} className="t-foot-vendor">
        <div className="row mx-0 d-flex justify-content-center align-items-center">
          <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Hours:
          </div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{this.getTotal("billableHours").toFixed(2)}</div>
          <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Base Forecast:
          </div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{currencyFormatter(this.getTotal("forecastTimeProvider1"))}</div>
          <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Loaded Forecast:
            </div>
            <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{currencyFormatter(this.getTotal("forecastExpenseProvider1"))}</div>
        </div>
      </td>
    );
  };

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
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

  handleChange = (e) => {
    let change = { isDirty: true };
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  handleReset = (e) => {
    this.setState({
      ServiceTypePercent: this.state.percent,
      startDate: null,
      endDate: null,
    });
  };

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.PERCENT_OF_BASE_FORECAST, (response) => {
      this.setState({ ServiceTypePercent: response, percent: response });
    });
  };  

  render() {
    const {
      ServiceTypePercent,
      startDate,
      endDate,
      toggleFirst
    } = this.state;
    const forecastInfo = {
      ServiceTypePercent,
      startDate,
      endDate
    };
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        {/* {this.transformedData && ForecastReportExcelExport(this.transformedDataAllRecords, this.finalArray, '')} */}
        <div className="container-fluid mt-3 mb-3 d-md-block d-block">
          <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight activity-report">
              <div className="row mx-0 align-items-center">
                <BreadCrumbs></BreadCrumbs>
                <div className="col pr-0 d-flex align-items-center justify-content-end">
                  {/* {ExportExcel(this.state.allData, this.finalArray)} */}
                  {/* <span
                    title="Export Excel"
                    className="mr-2 float-right text-dark shadow invoice cursor-pointer"
                    onClick={() => excelExport(this.state.allDataFc, 'TestData')}
                  >
                    <FontAwesomeIcon icon={faFileExcel} style={{ color: "white" }} className={"faclock_size d-block"}></FontAwesomeIcon>
                  </span> */}
                    <span className="float-right text-dark cursor-pointer">
                        {ExportExcel(this.state.rawData)}
                    </span> 
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <CompleteSearch
            placeholder="Search text here!"
            handleSearch={this.getSpendForecastReport}
            entityType={"SpendForecastReport"}
            onFirstLoad={this.state.onFirstLoad}
            page="SpendForecastReport"
          />
          <Collapsible
            trigger="Spend Forecast Information"
            open={toggleFirst}
            onTriggerOpening={() => this.setState({ toggleFirst: true })}
            onTriggerClosing={() => this.setState({ toggleFirst: false })}
          >
            <SpendForecastInformation
              data={forecastInfo}
              handleChange={this.handleChange}
              generateForecast={this.getSpendForecastReport}
              handleReset={this.handleReset}
              dataState={this.state.dataState}
            />
          </Collapsible>
          <div className="myOrderContainer gridshadow ClientActivityReport-responsive-notuse table-footer-vendor" id="grouping-performance-grid">
          <Grid
              resizable={false}
              reorderable={false}
              sortable={true}
              pageable={{ pageSizes: true }}
              pageSize={100}
              groupable={{ footer: "none" }}
              data={this.state.result}
              total={this.state.totalCount}
              detail={ViewMoreComponent}
              onDataStateChange={this.onDataStateChange}
              {...this.state.dataState}
              className="kendo-grid-custom lastchild global-action-grid-onlyhead"
              //className="kendo-grid-custom lastchild table_responsive-TABcandidates frozen-column"
              //style={{ height: "auto" }}
              expandField="expanded"
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="region"
                title="Region"
                width={90}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Region"} title={props.dataItem.region}>
                      {props.dataItem.region ==0 ? null : props.dataItem.region}
                    </td>
                  );
                }}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="division"
                title="Division"
                width={90}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Division"} title={props.dataItem.division}>
                      {props.dataItem.division ==0 ? null : props.dataItem.division}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="location"
                title="Location"
                width={90}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Location"} title={props.dataItem.location}>
                      {props.dataItem.location ==0 ? null : props.dataItem.location}
                    </td>
                  );
                }}
              />
              <GridColumn
                  field="position"
                  title="Position"
                  width={90}
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                      return  <td colSpan={0} className="vendor-details-with-zero"></td>
                     }
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return (
                      <td contextMenu={"Position"} title={props.dataItem.position}>
                      {props.dataItem.position ==0 ? null : props.dataItem.position}
                      </td>
                    );
                  }}
                />
              <GridColumn
                field="provider"
                title="Associate"
                width={90}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Associate"} title={props.dataItem.provider}>
                      {props.dataItem.provider ==0 ? null : props.dataItem.provider}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="serviceCategory"
                title="Service Category"
                width={100}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Service Category"} title={props.dataItem.serviceCategory}>
                      {props.dataItem.serviceCategory ==0 ? null : props.dataItem.serviceCategory}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="month"
                title="Month"
                width={90}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Month"} className="pr-4" title={props.dataItem.month}>
                      {props.dataItem.month ==0 ? null : props.dataItem.month}
                    </td>
                  );
                }}
                filter="text"
              />
              <GridColumn
                field="maxBillRate"
                title="Bill Rate"
                width={80}
                columnMenu={ColumnMenu}
                headerClassName="text-right pr-4"
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Bill Rate"} style={{ textAlign: "right" }} className="pr-4" title={props.dataItem.maxBillRate ==0 ? null : props.dataItem.serviceCategory !=ServiceCategory.EXPENSE ? props.dataItem.maxBillRate: null}>
                      {props.dataItem.maxBillRate ==0 ? null : props.dataItem.serviceCategory !=ServiceCategory.EXPENSE ? currencyFormatter(props.dataItem.maxBillRate): null }
                    </td>
                  );
                }}
              />
              <GridColumn
                field="billableHours"
                width={70}
                title="Hours"
                headerClassName="text-right pr-4"
                filter={"numeric"}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Hours"} style={{ textAlign: "right" }} className="pr-4" title={props.dataItem.billableHours}>
                      {props.dataItem.billableHours}
                    </td>
                  );
                }}
                footerCell={this.amountTotal}
              />
              <GridColumn
                field="clientBillable"
                title="Base Forecast"
                width={120}
                filter={"numeric"}
                headerClassName="text-right pr-4"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="vendor-details-with-zero">{this.cellRender(props)}</td>;
                  }
                  return <td
                  contextMenu={"Base Forecast"}
                  style={{ textAlign: "right" }}
                  title={props.dataItem.clientBillable}
                  className="pr-4"
                >
                  {currencyFormatter(props.dataItem.clientBillable)}
                </td>
                }}
              />
              <GridColumn
                field="loadedForecast"
                title="Loaded Forecast"
                width={140}
                filter={"numeric"}
                headerClassName="text-right pr-4"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if(props.dataItem.serviceCategory =="" || props.dataItem.serviceCategory ==null){
                    return <td colSpan={0} className="vendor-details-with-zero"></td>
                   }
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="vendor-details-with-zero">{this.cellRender(props)}</td>;
                  }
                  return <td contextMenu={"Loaded Forecast"}
                  style={{ textAlign: "right" }}
                  title={props.dataItem.loadedForecast !=null ? props.dataItem.loadedForecast : ""}
                  className="pr-4">
                    {props.dataItem.loadedForecast !=null ? currencyFormatter(props.dataItem.loadedForecast) : null}
                  </td>
                }}
              />
            </Grid>
          </div>
        </div>
      </div>
    );
  }

  getSpendForecastReportCount = (dataState) => {
    let startDate = dateFormatter(this.state.startDate);
    let endDate = dateFormatter(this.state.endDate);
    let serviceTypePercent = this.state.ServiceTypePercent;
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    let finalQueryString = `${toODataString(finalState)}`;

    var config = {
      headers: {
          'Content-Type': 'text/plain'
      },
    };

    axios.post(`api/report/fc/$query?startDate=${startDate}&endDate=${endDate}&servicetypepercent=${serviceTypePercent}`, (finalQueryString), config).then((res) => {
    
      this.setState({
        totalCount: res.data.length,
        rawData: res.data,
      });

      this.transformedDataAllRecords = res.data.map((item) => {
        let ForecastRecords = {
          region: item.region,
          division: item.division,
          provider: item.provider,
          location: item.location,
          position: item.position,
          serviceCategory: item.serviceCategory,
          month: item.month,
          maxBillRate: item.maxBillRate,
          maxDays: item.maxDays,
          billableHours: item.billableHours,
          clientBillable: item.clientBillable,
          forecastDivision: item.forecastDivision,
          forecastFacility: item.forecastFacility
        };
        let expenseNames = []
        let timeNames = []
        let divisionNames = []
        let LocationNames = []
        let PositionNames = []
        const fcExp = JSON.parse(item.forecastExpenseProvider)//.forecastexpenseprovider
        const fcT = JSON.parse(item.forecastTimeProvider)//.forecasttime_provider
        const fcDiv = JSON.parse(item.forecastDivision)//.forcastdivision
        const fcLoc = JSON.parse(item.forecastFacility)//.forcastfacility
        const fcPos = JSON.parse(item.forecastPosition)

        for (let iExp = 0; iExp < fcExp.length; iExp++) {
          ForecastRecords[`forecastExpenseProvider${iExp + 1}`] = !isNaN(parseFloat(fcExp[iExp].Data)) ? parseFloat(fcExp[iExp].Data) : 0;
          expenseNames.push({ field: `forecastExpenseProvider${iExp + 1}`, title: `Loaded Forecast ${iExp + 1}` });
        }
        for (let iT = 0; iT < fcT.length; iT++) {
          ForecastRecords[`forecastTimeProvider${iT + 1}`] = !isNaN(parseFloat(fcT[iT].Data)) ? parseFloat(fcT[iT].Data) : 0;
          timeNames.push({ field: `forecastTimeProvider${iT + 1}`, title: `Base Forecast ${iT + 1}` });
        }
        for (let iDiv = 0; iDiv < fcDiv.length; iDiv++) {
          ForecastRecords[`forecastDivision${iDiv + 1}`] = !isNaN(parseFloat(fcDiv[iDiv].Data)) ? parseFloat(fcDiv[iDiv].Data) : 0;
          divisionNames.push({ field: `forecastDivision${iDiv + 1}`, title: `Forecast Division` });
        }
        for (let iLoc = 0; iLoc < fcLoc.length; iLoc++) {
          ForecastRecords[`forecastFacility${iLoc + 1}`] = !isNaN(parseFloat(fcLoc[iLoc].Data)) ? parseFloat(fcLoc[iLoc].Data) : 0;
          LocationNames.push({ field: `forecastFacility${iLoc + 1}`, title: `Forecast Location` });
        }
        for (let iPos = 0; iPos < fcPos.length; iPos++) {
          ForecastRecords[`forecastPosition${iPos + 1}`] = !isNaN(parseFloat(fcLoc[iPos].Data)) ? parseFloat(fcLoc[iPos].Data) : 0;
          PositionNames.push({ field: `forecastPosition${iPos + 1}`, title: `Forecast Position` });
        }
        this.expenseName = expenseNames
        this.timeName = timeNames
        this.divisionName = divisionNames
        this.LocationName = LocationNames
        this.PositionName = PositionNames

        this.divisionFacilityArray = this.divisionName.concat(this.LocationName)
        this.divisionFacilityPosArray = this.divisionFacilityArray.concat(this.PositionName)

        this.divisionFacilityPosArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });

        this.combinedArray = this.timeName.concat(this.expenseName)
        this.combinedArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });
        this.finalArray = this.divisionFacilityPosArray.concat(this.combinedArray)
        this.finalArray.sort((a, b) => {
          const x = parseInt(a.field.match(/\d+/));
          const y = parseInt(b.field.match(/\d+/));
          return x - y;
        });
        this.finalArrayLoop = this.timeName;
        return ForecastRecords;
      })

      this.setState({
        allDataFc: this.transformedDataAllRecords,
      });

    });
  }
}
export default SpendForecastReport;
