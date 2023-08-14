import * as React from "react";
import auth from "../../../Auth";
import axios from "axios";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import {
    CellRender,
    GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import {
    State,
    toODataString,
} from "@progress/kendo-data-query";
import {
    CustomMenu,
    DefaultActions,
    DetailColumnCell,
    ViewMoreComponent,
} from "./GlobalActions";
import { currencyFormatter, initialDataState, successToastr } from "../../../../HelperMethods";
import { KendoFilter } from "../../../ReusableComponents";
import { Dialog } from "@progress/kendo-react-dialogs";
import RowActions from "../../../Shared/Workflow/RowActions";
import AddAssignmentProjectionsProps from "./AddAssignmentProjections";
import { ServiceCategory } from "../../../Shared/AppConstants";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { PROJECTION_DELETE_SUCCESS_MSG, REMOVE_PROJECTION_CONFIRMATION_MSG } from "../../../Shared/AppMessages";

export interface AssignmentProjectionsProps {
    candSubmissionId: string;
    targetStartDate: any;
    targetEndDate: any;
}

export interface AssignmentProjectionsState {
    data: any;
    clientId: string;
    showLoader?: boolean;
    dataItem?: any;
    dataState: any;
    totalCount?: number;
    showEditModal?: boolean;
    showGenerateProjectionModal?: boolean;
    showDeleteModal?: boolean;
}

class AssignmentProjections extends React.Component<
    AssignmentProjectionsProps,
    AssignmentProjectionsState
> {
    public dataItem: any;
    constructor(props: AssignmentProjectionsProps) {
        super(props);
        this.state = {
            data: [],
            clientId: auth.getClient(),
            dataState: initialDataState,
            showLoader: true,
        };
    }

    componentDidMount() {
        if (this.props.candSubmissionId !=null) {
            this.getProjection(this.state.dataState);
        }
    }

    getProjection = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        const queryParams = `status eq 'Active'`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        this.setState({ showLoader: true });
        axios.get(`api/candidates/${this.props.candSubmissionId}/projection?${finalQueryString}`).then((res) => {
            console.log("res.data", res.data);
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getProjectionCount(dataState);
        });
    };

    getProjectionCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        const queryParams = `status eq 'Active'`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/${this.props.candSubmissionId}/projection?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length
            });
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getProjection(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }


    ExpandCell = (props) => (
        <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
    );

    GenerateProjectionModal = () => {
        this.dataItem = undefined
        this.setState({ showGenerateProjectionModal: true })
    }

    deleteProjection = (id, msg) => {
        this.setState({ showDeleteModal: false });
        axios.delete(`api/candidates/projection/${id}`).then((res) => {
            successToastr(msg);
            this.getProjection(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    render() {
        return (
            <div className="row mt-3 mt-md-0">
                <div className="container-fluid">
                    <div className="cand-bill-rate" id="cand-bill-rate-responsive">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            total={this.state.totalCount}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>
                                {GridNoRecord(this.state.showLoader)}
                            </GridNoRecords>
                            <GridColumn
                                field="startDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Pay Period Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Pay Period Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Pay Period End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Pay Period End Date")}
                            />
                            <GridColumn
                                field="serviceCategory"
                                title="Service Category"
                                cell={(props) => CellRender(props, "erviceCategory")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="serviceType"
                                width="120px"
                                title="Service Type"
                                cell={(props) => CellRender(props, "Service Type")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="billRate"
                                width="80px"
                                title="Bill Rate"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Bill Rate"
                                            className="pr-4 text-right"
                                            title={props.dataItem.serviceCategory==ServiceCategory.TIME ? props.dataItem.billRate : "-"}
                                        >
                                            {props.dataItem.serviceCategory==ServiceCategory.TIME ? currencyFormatter(props.dataItem.billRate) : "-"}
                                        </td>
                                    );
                                }}
                                filter="numeric"
                            />
                            <GridColumn
                                field="hours"
                                title="Hours"
                                headerClassName="text-right pr-4"
                                width="80px"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"hours"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.hours && props.dataItem.hours.toFixed(2)}
                                        >
                                            {props.dataItem.hours && props.dataItem.hours.toFixed(2)}
                                        </td>
                                    );
                                }}
                                filter="numeric"
                            />
                            <GridColumn
                                field="expenseAmount"
                                // width="105px"
                                title="Expense Amount"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Expense Amount"
                                            className="pr-4 text-right"
                                            title={props.dataItem.expenseAmount >= 0 && props.dataItem.serviceCategory==ServiceCategory.EXPENSE ? currencyFormatter(props.dataItem.expenseAmount) : props.dataItem.serviceCategory==ServiceCategory.TIME ? "-" : "-"}
                                        >
                                            {props.dataItem.expenseAmount >= 0 && props.dataItem.serviceCategory==ServiceCategory.EXPENSE ? currencyFormatter(props.dataItem.expenseAmount) : props.dataItem.serviceCategory==ServiceCategory.TIME ? "-" : "-"}
                                        </td>
                                    );
                                }}
                                filter="numeric"
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="70px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.candSubProjectionId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalCount, this.GenerateProjectionModal)}
                            />
                            <GridColumn sortable={false} field="expanded"
                                width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                {this.state.showGenerateProjectionModal && (
                    <div id="Edit-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <AddAssignmentProjectionsProps
                                candSubmissionId={this.props.candSubmissionId}
                                targetStartDate={this.props.targetStartDate}
                                targetEndDate={this.props.targetEndDate}
                                dataItem={this.dataItem}
                                onCloseModal={() => this.setState({ showGenerateProjectionModal: false }, () => { this.dataItem = undefined; this.getProjection(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showGenerateProjectionModal: true })}
                            />
                        </Dialog>
                    </div>
                )}
                {this.state.showEditModal && (
                    <div id="Edit-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <AddAssignmentProjectionsProps
                                candSubmissionId={this.props.candSubmissionId}
                                targetStartDate={this.props.targetStartDate}
                                targetEndDate={this.props.targetEndDate}
                                dataItem={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getProjection(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: true })}
                            />
                        </Dialog>
                    </div>
                )}
                <ConfirmationModal
                    message={REMOVE_PROJECTION_CONFIRMATION_MSG()}
                    showModal={this.state.showDeleteModal}
                    handleYes={() => this.deleteProjection(this.dataItem.candSubProjectionId, PROJECTION_DELETE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeleteModal: false });
                    }}
                />
            </div>
        );
    }
}
export default AssignmentProjections;
