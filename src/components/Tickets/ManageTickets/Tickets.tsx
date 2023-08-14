import * as React from "react";
import auth from "../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, TicketStatusCell } from "../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent, TicketNumberCell } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import ticketService from "../Services/DataService";
import { errorToastr, history, successToastr } from "../../../HelperMethods";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { DELETE_TICKET_CONFIRMATION_MSG, SERVICE_REQUEST_REMOVED_SUCCESS_MSG } from "../../Shared/AppMessages";
import { KendoFilter, NumberCell } from "../../ReusableComponents";
import { CREATE_SUPPORT_TICKETS } from "../../Shared/ApiUrls";
import { Dialog } from "@progress/kendo-react-dialogs";
import TicketStatusBar from "../../Shared/TicketStatusCard/TicketStatusBar";
import { process} from "@progress/kendo-data-query";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
//import { setGroupIds } from '@progress/kendo-react-data-tools';

export interface TicketsProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface TicketsState {
    tickets: any;
    clientId?: string;
    onFirstLoad: boolean;
    totalCount?: number;
    totalTicket?: any;
    showLoader?: boolean;
    showDeleteModal?: boolean;
    createdBy?: string;
    assignedTo?: string;
    dataState: any;
    dataCopy?: any;
    showTicketHistoryModal?: boolean;
    result?: any;
}

class Tickets extends React.Component<TicketsProps, TicketsState> {
    public dataItem: any;
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    dataState;
    aggregates = [
    ];
    data = [];
    constructor(props: TicketsProps) {
        super(props);
        this.dataState = {
            skip: 0,
            take: 10,
            group: [{ field: "tktQue"}],
          };
        this.state = {
            tickets: [],
            dataState: this.dataState,
            clientId: auth.getClient(),
            createdBy: this.userObj.userId,
            assignedTo: this.userObj.userId,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount() {
    }

    getTickets = (dataQuery?,dataState?) => {
        var dataCopy: State = {
            take: dataQuery.take,
            skip: dataQuery.skip,
            sort: dataQuery.sort,
        };
        this.setState({ showLoader: true, onFirstLoad: false,dataState:this.state.dataState });
        this.state.dataState.filter = dataQuery.filter;
        var queryStr = `${toODataString(dataQuery, { utcDates: true })}`;
        //let queryParams = `(createdById eq ${this.state.createdBy} or currentAssignedToId eq ${this.state.assignedTo})`;
        //var finalQueryString = KendoFilter(dataQuery, queryStr, queryParams);

        var url = `api/tickets/$query`;

        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };

        ticketService.getAllTickets(url ,queryStr, config).then((res) => {
            this.data = res.data;
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
            this.setState({
                tickets: res.data,
                result: process(res.data, dataStateCopy),
                dataCopy: dataCopy,
                showLoader: false,
                onFirstLoad: false,
            });
            this.getTicketCount(dataQuery);
        });
    }

    getTicketCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        //let queryParams = `(createdById eq ${this.state.createdBy} or currentAssignedToId eq ${this.state.assignedTo})`;
        //var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        var url = `api/tickets/$query`;

        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };

        ticketService.getAllTickets(url, queryStr, config).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalTicket: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        localStorage.setItem("ManageSupportTickets-GridDataState", JSON.stringify(changeEvent.data));
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
            () => this.getTickets(this.state.dataState, dataState2)
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
        return {
          result: process(this.data, dataState2),
          dataState: dataState2,
        };
      }

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    deleteTicket = (id, msg) => {
        this.setState({ showDeleteModal: false });
        ticketService.deleteTicket(id).then((res) => {
            successToastr(msg);
            this.getTickets(this.state.dataState);
            // this.dataItem = undefined;
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
      };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-9 fonFifteen paddingLeftandRight">
                              <BreadCrumbs></BreadCrumbs>
                              </div>
                              <div className="col-3">
                            {auth.hasPermissionV2(AppPermissions.SUP_TKT_VIEW) && (
                                <Link to={CREATE_SUPPORT_TICKETS}>
                                <span className="float-right text-dark">
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Ticket
                                </span>
                            </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageSupportTickets"
                        entityType={"Ticket"}
                        placeholder="Search text here!"
                        handleSearch={this.getTickets}
                        onFirstLoad={this.state.onFirstLoad}
                        persistSearchData={true}
                    />
                    <div className="myOrderContainer global-action-grid table_responsive-TABcandidates frozen-column" id="grouping-performance-grid">
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
                            {...this.state.dataCopy}
                            onExpandChange={this.expandChange}
                            expandField="expanded"
                            detail={ViewMoreComponent}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="ticketNumber"
                                width={150}
                                title="Ticket #"
                                cell={TicketNumberCell}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="createdDate"
                                width={150}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Created Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Created Date", null, true)}
                            />
                            <GridColumn
                                field="tktPrio"
                                width={120}
                                title="Priority"
                                cell={(props) => CellRender(props, "Priority")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="aging"
                                width="70px"
                                headerClassName="text-right pr-4"
                                title="Aging"
                                filter="numeric"
                                cell={(props) => NumberCell(props, "Aging")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="ticketTitle"
                                width={150}
                                title="Title"
                                cell={(props) => CellRender(props, "Title")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="client"
                                width={150}
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="tktFuncArea"
                                width={150}
                                title="Functional Area"
                                cell={(props) => CellRender(props, "Functional Area")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="currentAssignedTo"
                                width={150}
                                title="Assigned To"
                                cell={(props) => CellRender(props, "Assigned To")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="tktQue"
                                width={150}
                                title="Queue"
                                cell={(props) => CellRender(props, "Queue")}
                                // cell={(props) => {
                                //     if (props.rowType=="groupHeader") {
                                //       return <td colSpan={0} className="d-none"></td>;
                                //     }
                                //     return (
                                //       <td contextMenu="Queue" title={props.dataItem.tktQue}>
                                //         {props.dataItem.tktQue}
                                //       </td>
                                //     );
                                //   }}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="tktReqType"
                                width={150}
                                title="Request Type"
                                cell={(props) => CellRender(props, "Request Type")}
                                columnMenu={ColumnMenu}
                            />                            
                            <GridColumn
                                field="resDate"
                                width={150}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Resolution Date"
                                cell={(props) => CellRender(props, "Resolution Date")}
                                columnMenu={ColumnMenu}
                            />                            
                            <GridColumn
                                locked={true}
                                field="tktStatus"
                                width="100px"
                                title="Status"
                                cell={TicketStatusCell}
                                columnMenu={ColumnMenu}
                                //cell={StatusCell}
                            />
                            <GridColumn
                                locked={true}
                                title="Action"
                                sortable={false}
                                width="70px"
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                    } return (
                                        <RowActions
                                            props={props}
                                            dataItem={props.dataItem}
                                            currentState={""}
                                            rowId={props.dataItem.ticketId}
                                            handleClick={this.handleActionClick}
                                            defaultActions={DefaultActions(props)}
                                        />
                                    )
                                }}
                                headerCell={() => CustomMenu(this.state.totalTicket)}
                            />
                            <GridColumn locked sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    message={DELETE_TICKET_CONFIRMATION_MSG()}
                    showModal={this.state.showDeleteModal}
                    handleYes={() => this.deleteTicket(this.dataItem.ticketId, SERVICE_REQUEST_REMOVED_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeleteModal: false });
                    }}
                />

                {this.state.showTicketHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 width For-all-responsive-height">
                            <TicketStatusBar
                                entityId={this.dataItem.ticketId}
                                title={"Ticket History - " + this.dataItem.ticketNumber}
                                handleClose={() => this.setState({ showTicketHistoryModal: false })}
                                dataItem={this.dataItem}
                            />
                        </Dialog>
                    </div>
                )}
                
            </div>
        );
    }
}

export default Tickets;