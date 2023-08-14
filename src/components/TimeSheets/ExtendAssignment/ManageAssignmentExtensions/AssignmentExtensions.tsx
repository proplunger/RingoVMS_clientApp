import * as React from "react";
import axios from "axios";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent } from "./GlobalActions";
import { initialDataState, history } from "../../../../HelperMethods";
import RowActions from "../../../Shared/Workflow/RowActions";
import { EXTEND_ASSIGNMENT } from "../../../Shared/ApiUrls";
import { Dialog } from "@progress/kendo-react-dialogs";
import ExtensionStatusBar from "../../../Shared/ExtensionStatusCard/ExtensionStatusBar";

export interface AssignmentExtensionsProps {
    candSubmissionId: string;
    assignmentStatus: any;
}

export interface AssignmentExtensionsState {
    data: any;
    showLoader?: boolean;
    dataItem?: any;
    dataState: any;
    totalCount?: number;
    showExtensionHistoryModal?: boolean;
}

class AssignmentExtensions extends React.Component<
    AssignmentExtensionsProps,
    AssignmentExtensionsState
> {
    public dataItem: any;
    constructor(props: AssignmentExtensionsProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            showLoader: true,
        };
    }

    componentDidMount() {
        if (this.props.candSubmissionId !=null) {
            this.getExtension(this.state.dataState);
        }
    }

    getExtension = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        this.setState({ showLoader: true });
        axios.get(`api/candidates/${this.props.candSubmissionId}/assignmentextensions?${queryStr}`).then((res) => {
            console.log("res.data", res.data);
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getExtensionCount(dataState);
        });
    };

    getExtensionCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;

        axios.get(`api/candidates/${this.props.candSubmissionId}/assignmentextensions?${queryStr}`).then((res) => {
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
        this.getExtension(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    RequestExtension = () => {
        history.push(`${EXTEND_ASSIGNMENT}${this.props.candSubmissionId}`);
    }

    ExpandCell = (props) => (
        <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
    );

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
                                field="extStartDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Extension Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Extension Start Date")}
                            />
                            <GridColumn
                                field="extEndDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Extension End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Extension End Date")}
                            />
                            <GridColumn
                                field="reason"
                                title="Extension Reason"
                                cell={(props) => CellRender(props, "Extension Reason")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="requestedDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Requested Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Requested Date")}
                            />
                            <GridColumn
                                field="requestedBy"
                                title="Requested By"
                                cell={(props) => CellRender(props, "Requested By")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="status"
                                width="160px"
                                title="Status"
                                cell={StatusCell}
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
                                        rowId={props.dataItem.candSubProjectionId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.RequestExtension, this.props.assignmentStatus)}
                            />
                            <GridColumn sortable={false} field="expanded"
                                width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                {this.state.showExtensionHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 width For-all-responsive-height">
                            <ExtensionStatusBar
                                dataItem={this.dataItem}
                                handleClose={() =>
                                    this.setState({ showExtensionHistoryModal: false })
                                }
                                statusLevel={1}
                            ></ExtensionStatusBar>
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}
export default AssignmentExtensions;
