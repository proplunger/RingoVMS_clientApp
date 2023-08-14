import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, ExportExcel, CustomHeaderActionCell, CommandCell } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { initialDataState, successToastr } from "../../../HelperMethods";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { EXP_CRED_SEND_REMINDER_SELECTED_VENDOR, EXP_CRED_SEND_REMINDER_VENDOR, REMINDER_SENT_SUCCESSFULLY } from "../../Shared/AppMessages";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ExpiringCredentialReportProps { }

export interface ExpiringCredentialReportState {
  searchString: string;
  data: any;
  allData?: any;
  clientId?: string;
  vendorId?: string;
  dataState: any;
  showSendReminderModal?: boolean;
  showSelectedSendReminderModal?: boolean;
  showLoader?: boolean;
  totalCount?: number;
  onFirstLoad: boolean;
  canSend?: boolean;
  selectedIds: any
}

class ExpiringCredentialReport extends React.Component<
  ExpiringCredentialReportProps,
  ExpiringCredentialReportState
> {
  CustomHeaderActionCellTemplate: any;
  CommandCell: any;
  public reqId: string;
  public dataItem: any;
  public openModal: any;
  private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
  constructor(props: ExpiringCredentialReportProps) {
    super(props);
    this.state = {
      searchString: "",
      data: [],
      dataState: initialDataState,
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      onFirstLoad: true,
      showLoader: true,
      selectedIds: [],
    };
    this.initializeHeaderCell(false);
    this.initializeActionCell();
  }

  //Row action(s)
  initializeActionCell = () => {
    this.CommandCell = CommandCell({
      send: this.sendReminder,
    });
  };

  // Global action(s)
  initializeHeaderCell = (canSend) => {
    this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
      send: () => this.setState({ showSelectedSendReminderModal: true }),
      canSend: canSend,
    });
  };

  sendReminder = (data) => {
    this.dataItem = data;
    this.setState({ showSendReminderModal: true });
  };

  SendTaskExpirationReminder = (modal, isGlobal) => {

    var tasks = [];
    var dataItem = this.dataItem;
    if (isGlobal) {
      tasks = this.state.selectedIds;
    } else {
      var data = {
        candSubOnboardingTaskId: dataItem.candSubOnboardingTaskId,
        clientId: dataItem.clientId,
        vendorId: dataItem.vendorId,
      };
      tasks.push(data);
    }

    axios
      .post(
        "api/candidates/candsubtaskexiprationreminder",
        JSON.stringify({ taskIds: tasks })
      )
      .then((res) => {
        successToastr(REMINDER_SENT_SUCCESSFULLY);
        this.getExpiringCredentialReport(this.state.dataState);
        this.setState({ showLoader: false });
      });

    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  getExpiringCredentialReport = (dataState) => {
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    let finalQueryString = CreateQueryString(dataState,this.state.clientId, this.state.vendorId);
    axios.get(`api/report/ec?${finalQueryString}`).then((res) => {
      this.setState({
        data: res.data,
        showLoader: false,
        dataState: dataState,
      });
      this.getExpiringCredentialReportCount(dataState);
    });
  };

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    debugger;
    this.getExpiringCredentialReport(changeEvent.data);
  };

  selectionChange = (event) => {
    var checked = event.syntheticEvent.target.checked;
    let ids = this.state.selectedIds;

    const data = this.state.data.map((item) => {
      if (
        item.candSubOnboardingTaskId ==event.dataItem.candSubOnboardingTaskId
      ) {
        item.selected = !event.dataItem.selected;

        if (checked==true) {
          ids.push({
            candSubOnboardingTaskId: item.candSubOnboardingTaskId,
            clientId: item.clientId,
            vendorId: item.vendorId,
          });
        } else if (checked==false) {
          ids = ids.filter(
            (o) => o.candSubOnboardingTaskId !=item.candSubOnboardingTaskId
          );
        }
      }
      return item;
    });
    this.setState({ data, selectedIds: ids });
    let isBtnEnable = this.state.data.filter((x) => x.selected).length > 0;
    this.initializeHeaderCell(isBtnEnable);
  };

  headerSelectionChange = (event) => {
    let ids = [];
    const checked = event.syntheticEvent.target.checked;
    const data = this.state.data.map((item) => {
      ids.push({
        candSubOnboardingTaskId: item.candSubOnboardingTaskId,
        clientId: item.clientId,
        vendorId: item.vendorId,
      });
      item.selected = checked;
      return item;
    });
    this.setState({ data, selectedIds: ids });
    let isBtnEnable = this.state.data.filter((x) => x.selected).length > 0;
    this.initializeHeaderCell(isBtnEnable);
  };

  ExpandCell = (props) => (
    <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
  );

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
                {ExportExcel(this.state.allData)}
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            placeholder="Search text here!"
            handleSearch={this.getExpiringCredentialReport}
            entityType={"Timesheet"}
            onFirstLoad={this.state.onFirstLoad}
            page="ExpiringCredentialReport"
          />
          <div className="myOrderContainer gridshadow sshowResponsive global-action-grid">
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
              className="kendo-grid-custom lastchild"
              selectedField="selected"
              onSelectionChange={this.selectionChange}
              onHeaderSelectionChange={this.headerSelectionChange}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="selected"
                width="50px"
                sortable={false}
                headerSelectionValue={
                  this.state.data &&
                  this.state.data.findIndex(
                    (dataItem) => dataItem.selected ==false
                  ) ==-1
                }
              />
              {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
              <GridColumn
                field="client"
                title="Client"
                cell={(props) => CellRender(props, "Client")}
                columnMenu={ColumnMenu}
              />
  }
              <GridColumn
                field="vendor"
                title="Vendor"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Vendor")}
                filter="text"
              />
              <GridColumn
                field="candidateName"
                title="Provider"
                cell={(props) => CellRender(props, "Provider")}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="position"
                title="Position"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Position")}
                filter="text"
              />
              <GridColumn
                field="credential"
                //   width="165px"
                title="Credential"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Credential")}
              />
              <GridColumn
                field="expiresOn"
                // width="115px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Expires On"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Expires On")}
              />
              <GridColumn
                field="daysToExpiration"
                title="Days To Expiration"
                filter={"numeric"}
                cell={(props) => NumberCell(props, "Days To Expiration")}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                title="Action"
                sortable={false}
                width={50}
                cell={this.CommandCell}

                headerCell={this.CustomHeaderActionCellTemplate}
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
        <ConfirmationModal
          message={EXP_CRED_SEND_REMINDER_VENDOR}
          showModal={this.state.showSendReminderModal}
          handleYes={() =>
            this.SendTaskExpirationReminder("showSendReminderModal", false)
          }
          handleNo={() => {
            this.setState({ showSendReminderModal: false });
          }}
        />
        <ConfirmationModal
          message={EXP_CRED_SEND_REMINDER_SELECTED_VENDOR}
          showModal={this.state.showSelectedSendReminderModal}
          handleYes={() =>
            this.SendTaskExpirationReminder(
              "showSelectedSendReminderModal",
              true
            )
          }
          handleNo={() => {
            this.setState({ showSelectedSendReminderModal: false });
          }}
        />
      </div>
    );
  }

  getExpiringCredentialReportCount = (dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
    axios.get(`api/report/ec?${finalQueryString}`).then((res) => {
      this.setState({
        allData: res.data,
        totalCount: res.data.length,
      });
    });
  };
}
export default ExpiringCredentialReport;
