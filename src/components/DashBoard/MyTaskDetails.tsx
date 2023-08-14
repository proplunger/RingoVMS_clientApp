import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTimesCircle, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { toODataString } from "@progress/kendo-data-query";
import Axios from "axios";
import { CellRender, GridNoRecord } from "../..../../Shared/GridComponents/CommonComponents";
import { Link } from "react-router-dom";
import PageTitle from "../Shared/Title";
import ColumnMenu from "../Shared/GridComponents/ColumnMenu";

import { history, successToastr } from "../../HelperMethods";
import { TaskGroup } from "../Shared/AppConstants";

export interface IMyTaskDetailsProps {
    showDialog: boolean;
    handleNo: any;
    taskTypeId: string;
    match?: any;
}

let initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};



export interface IMyTaskDetailsState {
    filter: undefined;
    searchString: string;
    dataState?: any;
    data: any;
    total?: any;
    taskTypeId: string;
    showLoader?: boolean;
    onFirstLoad?: boolean;
    taskGroup?: string;
    taskData?: any;
}

export default class MyTaskDetailsBox extends Component<IMyTaskDetailsProps, IMyTaskDetailsState> {
    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            searchString: "",
            dataState: initialDataState,
            total: 0,
            taskTypeId: "",
            data: [],
            showLoader: true,
            onFirstLoad: true,
            taskData: []
        };
    }

    componentDidMount() {
        const { id, taskGroup } = this.props.match.params;
        this.setState({
            taskTypeId: id,
            taskGroup: taskGroup,
            searchString: "",
            data: [],
        }, () => this.onTasksViewClick(this.state.dataState));
        this.customData();
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.onTasksViewClick(changeEvent.data);
    };

    customData = () => {
        const taskData = [{
            id: 'Open Tasks',
            text: 'Open Tasks',
            icon: '',
            pageUrl: undefined,
            disabled: false
        }];

        this.setState({taskData: [...taskData]});
    }

    render() {
        const { taskGroup } = this.state;
        return (
            <>

                <div className="col-11 mx-auto pl-0 pr-0">
                    <div className="container-fluid  d-md-none d-block mb-3 remove-row">
                        <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                            <label className="mb-0 col-12">Open Tasks</label>
                        </div>
                    </div>
                    <PageTitle
                        title="Open Tasks"
                        isCustomBreadcrumb={true}
                        breadCrumbData={this.state.taskData}
                    />
                    <div className="container-fluid">

                        <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                            <Grid
                                sortable={true}
                                className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild font-weight-normal global-action-grid-onlyhead"
                                data={this.state.data}
                                {...this.state.dataState}
                                expandField="expanded"
                                onDataStateChange={this.onDataStateChange}
                                pageable={true}
                                pageSize={5}
                                total={this.state.total}
                            >
                                <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                {taskGroup==TaskGroup.REQUISITION &&
                                    <GridColumn
                                        field="reqNumber"
                                        title="Req#"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Req#")}
                                    />
                                }
                                <GridColumn
                                    field="name"
                                    width="200px"
                                    title="Name"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => CellRender(props, "Name")}
                                />
                                {(taskGroup==TaskGroup.TIMESHEET || taskGroup==TaskGroup.CANDIDATE || taskGroup==TaskGroup.ASSIGNMENTEXTENSION) &&
                                    <GridColumn
                                        field="candidateName"
                                        width={150}
                                        title="Candidate Name"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Candidate Name")}
                                    />
                                }
                                {(taskGroup==TaskGroup.REQUISITION || taskGroup==TaskGroup.CANDIDATE || taskGroup==TaskGroup.TIMESHEET || taskGroup==TaskGroup.ASSIGNMENTEXTENSION) &&
                                    <GridColumn
                                        field="division"
                                        title="Division"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Division")}
                                    />
                                }
                                {(taskGroup==TaskGroup.REQUISITION || taskGroup==TaskGroup.CANDIDATE || taskGroup==TaskGroup.TIMESHEET || taskGroup==TaskGroup.ASSIGNMENTEXTENSION) &&
                                    <GridColumn
                                        field="location"
                                        title="Location"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Location")}
                                    />
                                }
                                {(taskGroup==TaskGroup.REQUISITION || taskGroup==TaskGroup.CANDIDATE || taskGroup==TaskGroup.TIMESHEET || taskGroup==TaskGroup.ASSIGNMENTEXTENSION) &&
                                    <GridColumn
                                        field="position"
                                        title="Position"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Position")}
                                    />
                                }
                                {taskGroup==TaskGroup.REQUISITION &&
                                    <GridColumn
                                        field="reqCreatedDate"
                                        width="180px"
                                        editor="date"
                                        title="Req Created Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Req Created Date")}
                                    />
                                }
                                {taskGroup==TaskGroup.CANDIDATE &&
                                    <GridColumn
                                        field="submittedDate"
                                        //width="180px"
                                        editor="date"
                                        title="Submitted Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Submitted Date")}
                                    />
                                }
                                {taskGroup==TaskGroup.CANDIDATE &&
                                    <GridColumn
                                        field="presentationDate"
                                        //width="180px"
                                        editor="date"
                                        title="Presentation Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Presentation Date")}
                                    />
                                }
                                {taskGroup==TaskGroup.ASSIGNMENTEXTENSION &&
                                    <GridColumn
                                        field="extStartDate"
                                        //width="180px"
                                        editor="date"
                                        title="Extension Start Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Extension Start Date")}
                                    />
                                }
                                {taskGroup==TaskGroup.ASSIGNMENTEXTENSION &&
                                    <GridColumn
                                        field="extEndDate"
                                        //width="180px"
                                        editor="date"
                                        title="Extension End Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Extension End Date")}
                                    />
                                }
                                {taskGroup==TaskGroup.TIMESHEET &&
                                    <GridColumn
                                        field="timesheetPeriod"
                                        //width="250px"
                                        title="Timesheet Period"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Timesheet Period")}
                                    />
                                }
                                {(taskGroup==TaskGroup.VENDORINVOICE) &&
                                    <GridColumn
                                        field="vendor"
                                        //width="250px"
                                        title="Vendor"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Vendor")}
                                    />
                                }
                                {(taskGroup==TaskGroup.VENDORINVOICE) &&
                                    <GridColumn
                                        field="vendorInvoiceNumber"
                                        width={150}
                                        title="Invoice Number"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Invoice Number")}
                                    />
                                }
                                {(taskGroup==TaskGroup.VENDORINVOICE) &&
                                    <GridColumn
                                        field="invoicePeriod"
                                        width={200}
                                        title="Invoice Period"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Invoice Period")}
                                    />
                                }
                                {(taskGroup==TaskGroup.CLIENTINVOICE) &&
                                    <GridColumn
                                        field="clientInvoiceNumber"
                                        width={150}
                                        title="Client Invoice Number"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Client Invoice Number")}
                                    />
                                }
                                {(taskGroup==TaskGroup.CLIENTINVOICE) &&
                                    <GridColumn
                                        field="cbiRunDate"
                                        editor="date"
                                        title="Run Date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Run Date")}
                                    />
                                }
                                <GridColumn
                                    field="assignedDate"
                                    width="100px"
                                    editor="date"
                                    title="Task Date"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => CellRender(props, "Task Date")}
                                />
                                <GridColumn
                                    field="taskUrl"
                                    title="Action"
                                    width="100px"
                                    cell={(props) => <td className="nonactive-icon-color">
                                        {props.dataItem.taskUrl &&
                                            <Link to={props.dataItem.taskUrl} className="nonactive-icon-color action-taskdetails">
                                                Open Task
                                            </Link>}
                                    </td>} />
                            </Grid>
                        </div>
                        <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                            <div className="col-12 text-center text-right font-regular">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        );
    }
    onTasksViewClick = (dataState) => {
        var queryStr = `${toODataString(dataState)}`;
        const { taskTypeId } = this.state;
        Axios.get(`api/home/tasks/${taskTypeId}/details?${queryStr}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
            });
        }).then(() => this.onTasksViewClickCount(dataState, taskTypeId));
    }
    onTasksViewClickCount = (dataState, taskTypeId) => {

        var finalState = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        Axios.get(`api/home/tasks/${taskTypeId}/details?${queryStr}`).then((res) => {
            this.setState({
                total: res.data.length,
            });
        });
    }
    // on cancel
    private onCancel() {
        this.props.handleNo();
        this.setState({ searchString: "", data: [] });
    }
}
