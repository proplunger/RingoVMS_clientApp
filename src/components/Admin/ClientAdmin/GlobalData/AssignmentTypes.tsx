import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { CustomMenu, DefaultActions } from "./MapGlobalData/GlobalActions";
import MapAssignmentType from "./MapData/MapAssignmentType";
import RowActions from "../../../Shared/Workflow/RowActions";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { State, toODataString } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
import clientAdminService from "../Service/DataService";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { CLIENT_ASSIGN_TYPE_REMOVE_SUCCESS_MSG, UNMAP_ASSIGN_TYPE_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { successToastr } from "../../../../HelperMethods";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";


export interface AssignmentTypesProps {
    entityType: string;
    clientId: string;
    canEdit?: boolean;
}

export interface AssignmentTypesState {
    assignmentTypes: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    description?: string;
    dataState: any;
    totalCount?: number;
    showMapAssignmentTypeModal?: boolean;
    showUnmapModal?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class AssignmentTypes extends React.Component<AssignmentTypesProps, AssignmentTypesState> {
    public dataItem: any;
    constructor(props: AssignmentTypesProps) {
        super(props);
        this.state = {
            assignmentTypes: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
        };
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.getAssignmentTypes(this.props.clientId);

        } else {
            this.setState({ showLoader: false });
        }
    }

    getAssignmentTypes = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { clientId } = this.props;
        axios.get(`api/admin/client/${clientId}/assignmenttypes?${queryStr}`)
            .then(res => {
                this.setState({
                    assignmentTypes: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getAssignmentTypesCount(dataState);
            });
    }

    getAssignmentTypesCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        
        const { clientId } = this.props;
        clientAdminService.getClientRequisitionReasons(clientId, queryStr)
        .then((res) => {
            this.setState({ totalCount: res.data.length });
        });
    };

    deleteAssignType = (id) => {
        this.setState({ showUnmapModal: false });
        clientAdminService.deleteClientAssignmentType(id).then((res) => {
            successToastr(CLIENT_ASSIGN_TYPE_REMOVE_SUCCESS_MSG);
            this.getAssignmentTypes(this.state.dataState);
        });
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    onDataStateChange = (changeEvent) => {
        this.getAssignmentTypes(changeEvent.data);
    };

    MapModal = () => {
        this.dataItem = undefined
        this.setState({ showMapAssignmentTypeModal: true })
    }

    render() {

        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-4 " id="createjoborderstep">
                                <div className="table-responsive tableShadow global-action-grid-lastchild">
                                    <Grid
                                        className="kendo-grid-custom lastchild"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onDataStateChange={this.onDataStateChange}
                                        filterable={false}
                                        columnMenu={false}
                                        //pageable={{ pageSizes: true }}
                                        data={this.state.assignmentTypes}
                                        {...this.state.dataState}
                                        total={this.state.totalCount}
                                        editField="inEdit"
                                        selectedField="selected"
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                        <GridColumn
                                            sortable={true}
                                            filterable={false}
                                            field="name"
                                            title="Assignment Types"
                                            columnMenu={ColumnMenu}
                                            filter="text"
                                            cell={(props) => CellRender(props, "Assignment Types")}
                                        />
                                        <GridColumn
                                            field="createdDate"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            columnMenu={ColumnMenu}
                                            title="Created Date"
                                            cell={(props) => CellRender(props, "Created Date")}
                                        />
                                        <GridColumn
                                            field="createdByName"
                                            title="Created By"
                                            columnMenu={ColumnMenu}
                                            filter="text"
                                            cell={(props) => CellRender(props, "Created By")}
                                        />
                                        <GridColumn
                                            field="status"
                                            title="Status"
                                            columnMenu={ColumnMenu}
                                            filter="text"
                                            cell={StatusCell}
                                        />
                                        <GridColumn
                                            title="Action"
                                            sortable={false}
                                            width="60px"
                                            cell={(props) => (
                                                <RowActions
                                                    dataItem={props.dataItem}
                                                    currentState={""}
                                                    rowId={props.dataItem.clientDivId}
                                                    handleClick={this.handleActionClick}
                                                    defaultActions={DefaultActions(props)}
                                                />
                                )}
                                headerCell={() => CustomMenu(this.MapModal)}
                            />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ConfirmationModal
                        message={UNMAP_ASSIGN_TYPE_CONFIRMATION_MSG()}
                        showModal={this.state.showUnmapModal}
                        handleYes={() => this.deleteAssignType(this.dataItem.id)}
                        handleNo={() => {
                            this.setState({ showUnmapModal: false });
                        }}
                    />

                    {this.state.showMapAssignmentTypeModal && (
                    <div id="add-ClientJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <MapAssignmentType
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showMapAssignmentTypeModal: false }, () => { this.dataItem = undefined; this.getAssignmentTypes(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showMapAssignmentTypeModal: true })}
                            />
                        </Dialog>
                    </div>
                )}
                </div>

            </React.Fragment>
        );
    }
}

export default AssignmentTypes;