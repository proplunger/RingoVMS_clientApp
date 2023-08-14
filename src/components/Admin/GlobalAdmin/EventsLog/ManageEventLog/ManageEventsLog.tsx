import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, GridColumn, GridNoRecords } from '@progress/kendo-react-grid';
import * as React from 'react';
import ColumnMenu from '../../../../Shared/GridComponents/ColumnMenu';
import { CellRender, GridNoRecord } from '../../../../Shared/GridComponents/CommonComponents';
import { dateFormatter, history } from '../../../../../HelperMethods';
import CompleteSearch from '../../../../Shared/Search/CompleteSearch';
import { toODataString } from '@progress/kendo-data-query';
import { initialDataState } from '../../../../../HelperMethods';
import RowActions from '../../../../Shared/Workflow/RowActions';
import { CustomMenu, DefaultActions } from './GlobalActions';
import clientAdminService from "../../Service/DataService";
import { convertShiftDateTime, KendoFilter } from '../../../../ReusableComponents';
import WithoutFilterColumnMenu from '../../../../Shared/GridComponents/WithoutFilterColumnMenu';
import BreadCrumbs from '../../../../Shared/BreadCrumbs/BreadCrumbs';


export interface ManageEventsLogProps {
    match: any;
}

export interface ManageEventsLogState {
    showLoader?: boolean;
    onFirstLoad: boolean;
    eventslog: any;
    dataState: any;
    totalCount?: any;
    streamId: string;
}

export default class ManageEventsLog extends React.Component<ManageEventsLogProps, ManageEventsLogState> {
    public dataItem: any;
    public CustomHeaderActionCellTemplate: any;
    constructor(props: ManageEventsLogProps) {
        super(props);
        const { streamId } = this.props.match.params;
        this.state = {
            streamId: streamId,
            eventslog: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getEventslogs = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var finalQueryString = queryStr;

        if (this.state.streamId) {
            queryStr = `${toODataString(dataState, { utcDates: true })}`;
            let queryParams = `streamId eq ${this.state.streamId}`
            finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        }
        clientAdminService.getEventLogs(finalQueryString)
            .then((res) => {
                this.setState({
                    eventslog: res.data.value,
                    showLoader: false,
                    dataState: dataState,
                    totalCount: res.data["@odata.count"],
                });
            });
    }

    onDataStateChange = (changeEvent) => {
        this.getEventslogs(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-8 fonFifteen paddingLeftandRight">
                            <BreadCrumbs globalData={{ streamId: this.state.streamId}}></BreadCrumbs>
                            </div>
                            <div className="col-4">
                            <span className="float-right text-dark cusrsor-pointer ">
                                {(this.state.eventslog.length > 0 && this.state.streamId) ? (this.state.eventslog[0].entityType + " - " + this.state.eventslog[0].entityData) : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        page="EventsLogs"
                        entityType={"Events"}
                        placeholder="Search text here!"
                        handleSearch={this.getEventslogs}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageDivisionContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.eventslog}
                            {...this.state.dataState}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="entityType"
                                title="Entity Type"
                                cell={(props) => CellRender(props, "Entity Type")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="eventDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Event Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => <td contextMenu="Event Date" className="text-left">
                                    {props.dataItem.eventDate && dateFormatter(props.dataItem.eventDate)} {props.dataItem.eventDate && convertShiftDateTime(props.dataItem.eventDate)}
                                </td>}
                            />
                            <GridColumn
                                field="eventType"
                                title="Event Type"
                                cell={(props) => CellRender(props, "Event Type")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="entityData"
                                title="Entity Data"
                                cell={(props) => CellRender(props, "Entity Data")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="eventData"
                                title="Event Data"
                                cell={(props) => CellRender(props, "Event Data")}
                                columnMenu={WithoutFilterColumnMenu}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="70px"
                                cell={(props) => (
                                    <RowActions
                                        rowId={props.dataItem.streamId}
                                        dataItem={props.dataItem}
                                        currentState={props.dataItem.status}
                                        defaultActions={DefaultActions(props)}
                                        handleClick={this.handleActionClick}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.dataState, this.state.streamId)}
                            />
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
            </div>
        )
    }
}