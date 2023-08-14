import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { ReqCustomMenu, DefaultActions } from "./MapGlobalData/GlobalActions";
import MapRequisitionReason from "./MapData/MapRequisitionReason";
import RowActions from "../../../Shared/Workflow/RowActions";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { State, toODataString } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
import clientAdminService from "../Service/DataService";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { CLIENT_REQ_REASON_UNMAP_SUCCESS_MSG, UNMAP_REQ_REASON_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { successToastr } from "../../../../HelperMethods";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";


export interface RequisitionReasonProps {
    entityType: string;
    clientId: string;
    canEdit?: boolean;
}

export interface RequisitionReasonState {
    requisitionReasons: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    description?: string;
    dataState: any;
    totalCount?: number;
    showMapRequisitionReasonModal?: boolean;
    showUnmapModal?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class RequisitionReason extends React.Component<RequisitionReasonProps, RequisitionReasonState> {
    public dataItem: any;
    constructor(props: RequisitionReasonProps) {
        super(props);
        this.state = {
            requisitionReasons: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
        };
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.getRequisitionReasons(this.props.clientId);

        } else {
            this.setState({ showLoader: false });
        }
    }

    getRequisitionReasons = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { clientId } = this.props;
        axios.get(`api/admin/client/${clientId}/requisitionreasons?${queryStr}`)
            .then(res => {
                this.setState({
                    requisitionReasons: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getRequisitionReasonCount(dataState);
            });
    }

    getRequisitionReasonCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { clientId } = this.props;
        clientAdminService.getClientAssignmentTypes(clientId, queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length
            });
        });
    };

    deleteReqReason = (id) => {
        this.setState({ showUnmapModal: false });
        clientAdminService.deleteClientRequisitionReason(id).then((res) => {
            successToastr(CLIENT_REQ_REASON_UNMAP_SUCCESS_MSG);
            this.getRequisitionReasons(this.state.dataState);
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
        this.getRequisitionReasons(changeEvent.data);
    };

    MapModal = () => {
        this.dataItem = undefined
        this.setState({ showMapRequisitionReasonModal: true })
    }

    render() {

        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-4" id="createjoborderstep">
                                <div className="table-responsive tableShadow global-action-grid-lastchild">
                                    <Grid
                                        className="kendo-grid-custom lastchild"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onDataStateChange={this.onDataStateChange}
                                        filterable={false}
                                        columnMenu={false}
                                        //pageable={{ pageSizes: true }}
                                        data={this.state.requisitionReasons}
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
                                            title="Requisition Reasons"
                                            columnMenu={ColumnMenu}
                                            filter="text"
                                            cell={(props) => CellRender(props, "Requisition Reasons")}
                                        />
                                        <GridColumn
                                            field="createdDate"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            title="Created Date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Created Date")}
                                        />
                                        <GridColumn
                                            field="createdByName"
                                            title="Created By"
                                            cell={(props) => CellRender(props, "Created By")}
                                            columnMenu={ColumnMenu}
                                            filter="text"
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
                                headerCell={() => ReqCustomMenu(this.MapModal)}
                            />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ConfirmationModal
                        message={UNMAP_REQ_REASON_CONFIRMATION_MSG()}
                        showModal={this.state.showUnmapModal}
                        handleYes={() => this.deleteReqReason(this.dataItem.id)}
                        handleNo={() => {
                            this.setState({ showUnmapModal: false });
                        }}
                    />

                    {this.state.showMapRequisitionReasonModal && (
                    <div id="add-ClientJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <MapRequisitionReason
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showMapRequisitionReasonModal: false }, () => { this.dataItem = undefined; this.getRequisitionReasons(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showMapRequisitionReasonModal: true })}
                            />
                        </Dialog>
                    </div>
                )}
                </div>

            </React.Fragment>
        );
    }
}

export default RequisitionReason;