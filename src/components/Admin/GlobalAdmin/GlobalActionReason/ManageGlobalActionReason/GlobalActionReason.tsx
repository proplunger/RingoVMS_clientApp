import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, GridColumn, GridNoRecords } from '@progress/kendo-react-grid';
import * as React from 'react';
import ColumnMenu from '../../../../Shared/GridComponents/ColumnMenu';
import { CellRender, GridNoRecord, StatusCell } from '../../../../Shared/GridComponents/CommonComponents';
import CompleteSearch from '../../../../Shared/Search/CompleteSearch';
import { history, initialDataState, newPageSizes } from '../../../../../HelperMethods';
import { State, toODataString } from '@progress/kendo-data-query';
import axios from 'axios';
import Auth from '../../../../Auth';
import { AppPermissions } from '../../../../Shared/Constants/AppPermissions';
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent } from './GlobalActions';
import RowActions from '../../../../Shared/Workflow/RowActions';
import { Link } from 'react-router-dom';
import GlobalAdminDataService from "../../Service/DataService";
import BreadCrumbs from '../../../../Shared/BreadCrumbs/BreadCrumbs';

export interface GlobalActionReasonProps {
    props: any;
    match: any;
}
export interface GlobalActionReasonState {
    onFirstLoad: boolean;
    showLoader: boolean;
    data: any;
    dataState: any;
    totalCount?: number;
    totaldata?: any;
    showAddNewActionReason?: any;
    ActionReason?: string;
}
export default class GlobalActionReason extends React.Component<GlobalActionReasonProps, GlobalActionReasonState>{
    public dataItem: any;
    public ActionReasonId: string;
    constructor(props: GlobalActionReasonProps) {
        super(props);
        this.state = {
            onFirstLoad: true,
            showLoader: true,
            data: [],
            dataState: initialDataState,
            ActionReason: "",
        }
    }
    componentDidMount() {
        this.getActionReason(this.state.dataState)
        if (this.props.props) {
            this.setState({
                ActionReason: this.props.props.id
            })
        }
    }
    getActionReason = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        GlobalAdminDataService.getGlobalActionReason(queryStr).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getActionReasonCount(dataState);
        });

    }
    getActionReasonCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        GlobalAdminDataService.getGlobalActionReason(queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totaldata: res.data,
            });
        });
    };
    onDataStateChange = (changeEvent) => {
        this.getActionReason(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;
    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }
    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewActionReason: true })
    }
    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-8 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                            </div>
                            <div className="col-4">
                            {Auth.hasPermissionV2(AppPermissions.AUTHENTICATED) && (
                                <Link to={`/admin/globalactionreason/create`}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Action Reason
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageActionReason"
                        entityType={"Action Reason"}
                        placeholder="Search text here!"
                        handleSearch={this.getActionReason}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageDivisionContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: newPageSizes }}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="reason"
                                title="Reason"
                                cell={(props) => CellRender(props, "ActionReason")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="description"
                                title="Description"
                                cell={(props) => CellRender(props, "Description")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="createdDate"
                                title="Created Date"
                                format="{0:d}"
                                editor="date"
                                cell={(props) => CellRender(props, "Created Date")}
                                columnMenu={ColumnMenu}
                                filter="date"
                            />
                            <GridColumn
                                field="createdBy"
                                title="Created By"
                                cell={(props) => CellRender(props, "Created By")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="70px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totaldata, this.AddNewModal)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />

                        </Grid>
                    </div>
                </div>
            </div>
        )

    }

}