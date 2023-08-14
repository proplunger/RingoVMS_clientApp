import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { MyCommandCell, CustomHeaderActionCell } from "./HelperComponent";
import withValueField from "../../../../Shared/withValueField";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter, errorToastr, successToastr } from "../../../../../HelperMethods";
import { State, toODataString } from "@progress/kendo-data-query";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { ACTIVE_CLIENT_LOB_CONFIRMATION_MSG, CLIENT_LOB_ACTIVE_SUCCESS_MSG, CLIENT_LOB_INACTIVE_SUCCESS_MSG, CLIENT_LOB_REMOVE_SUCCESS_MSG, DELETE_LOB_ERROR_MSG, INACTIVE_CLIENT_LOB_CONFIRMATION_MSG, REMOVE_CLIENT_LOB_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";

import { ErrorComponent } from "../../../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };


export interface LineOfBusinessProps {
    entityType: string;
    clientId: string;
    canEdit?: boolean;
}

export interface LineOfBusinessState {
    clientId?: string;
    lob: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    description?: string;
    status?: any;
    dataState: any;
    totalCount?: number;
    totalLob?: any;
    showRemoveConfirmationModal?: boolean;
    showActiveConfirmationModal?: boolean;
    showInactiveConfirmationModal?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class LineOfBusiness extends React.Component<LineOfBusinessProps, LineOfBusinessState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    private originalLevels = [];
    constructor(props: LineOfBusinessProps) {
        super(props);
        this.state = {
            lob: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
        };

        this.initializeHeaderCell();
        this.initializeActionCell();
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.getLineOfBusiness(this.state.dataState);

        } else {
            this.setState({ showLoader: false });
        }
    }

    initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: (dataItem) => this.setState({ showRemoveConfirmationModal: true }, () => this.dataItem = dataItem),
            add: this.add,
            discard: this.discard,
            update: this.update,
            cancel: this.cancel,
            inactive: (dataItem) => this.setState({ showInactiveConfirmationModal: true }, () => this.dataItem = dataItem),
            active: (dataItem) => this.setState({ showActiveConfirmationModal: true }, () => this.dataItem = dataItem),
            editField: this.editField
        });
    };

    initializeHeaderCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew,
            ExportMenu: this.ExportExcel,
        });
    };

    getLineOfBusiness = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/lob?${queryStr}`)
            .then(res => {
                this.setState({
                    lob: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getLineOfBusinessCount(dataState);
                this.originalLevels = res.data;
            });
    }

    getLineOfBusinessCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/lob?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalLob: res.data,
            });
        });
    };

    addNew = () => {
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.lob), status: "Draft", createdDate: dateFormatter(new Date()), createdByName: this.userObj.userFullName };

        this.setState({
            lob: [newDataItem, ...this.state.lob]
        });
    };

    enterEdit = (dataItem) => {
        this.setState({
            lob: this.state.lob.map(item =>
                item.intId ==dataItem.intId ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    checkDuplicate = (name) => {
        let nameExists = this.state.lob.filter(i => i.name.toLowerCase().trim()==name.toLowerCase().trim())
        if (nameExists.length > 1) {
            return false;
        }
        else {
            return true;
        }
    }

    add = (dataItem, dataIndex) => {
        // if(dataItem.name.length<100 && dataItem.description.length<2000){
        if (this.checkDuplicate(dataItem.name)) {
            if (dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    //dataItem.tempId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    lob: [...this.state.lob]
                });
            }
        }
        else {
            errorToastr("LOB already exists");
        }
        // }
    };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;
    //generateId = data => data.reduce((acc, current) => Math.max(acc, current.tempId), 0) + 1;

    remove = (dataItem, statusId, msg) => {
        const data = [...this.state.lob];
        if (dataItem.id) {
            this.deleteLob(dataItem.id, statusId, msg)
        } else {
            this.removeItem(data, dataItem);
            this.setState({ lob: data, showRemoveConfirmationModal: false });
        }
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    update = (dataItem) => {
        // if(dataItem.name.length<100 && dataItem.description.length<2000){
        if (this.checkDuplicate(dataItem.name)) {
            if (dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) {
                const data = [...this.state.lob];
                const updatedItem = { ...dataItem, inEdit: undefined };

                this.updateItem(data, updatedItem);

                this.setState({ lob: data });
            }
        }
        else {
            errorToastr("LOB already exists");
        }
        // }
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    cancel = (dataItem) => {
        const originalItem = this.originalLevels.find((p) => p.id ==dataItem.id);
        originalItem["inEdit"] = undefined;
        //const data = this.state.lob.map((item) => item.intId ==originalItem.intId ? originalItem : item);
        const data = this.state.lob.map((item) => item.id ==originalItem.id ? originalItem : item);
        this.setState({ lob: data });
    }

    discard = dataItem => {
        const data = [...this.state.lob];
        this.removeItem(data, dataItem);

        this.setState({ lob: data });
    };

    // inactive = (dataItem, isActive) => {
    //     dataItem.status = isActive ? "Active" : "Inactive"
    //     const data = [...this.state.lob];
    //     this.updateItem(data, dataItem);
    //     this.setState({ lob: data });
    // }

    deleteLob = (id, statusId, msg) => {
        if (this.state.lob.length >= 2 && statusId==2) {
            this.setState({ showRemoveConfirmationModal: false, showActiveConfirmationModal: false, showInactiveConfirmationModal: false });
            axios.delete(`/api/clients/${this.props.clientId}/lob/${id}/${statusId}`).then((res) => {
                successToastr(msg);
                this.getLineOfBusiness(this.state.dataState);
            });
        } else if (id && (statusId==1 || statusId==0)) {
            this.setState({ showActiveConfirmationModal: false, showInactiveConfirmationModal: false });
            axios.delete(`/api/clients/${this.props.clientId}/lob/${id}/${statusId}`).then((res) => {
                successToastr(msg);
                this.getLineOfBusiness(this.state.dataState);
            });
        } else {
            this.setState({ showRemoveConfirmationModal: false });
            errorToastr(DELETE_LOB_ERROR_MSG);
        }
    };

    itemChange = (event) => {
        const data = this.state.lob.map(item =>
            item.intId ==event.dataItem.intId ?
                //item.tempId ==event.dataItem.tempId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ lob: data });
    }

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="Line of Business"
        >
            <ExcelSheet data={this.state.totalLob} name="Line of Business">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Description" value="description" />
                <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
                <ExcelColumn label="Created By" value="createdByName" />
                <ExcelColumn label="Status" value="status" />
            </ExcelSheet>
        </ExcelFile>
    );

    onDataStateChange = (changeEvent) => {
        if (this.props.clientId) {
            this.getLineOfBusiness(changeEvent.data);
        }
    };

    getLobData() {
        let noLob = this.state.lob.length <= 0;
        let hasUnsavedData = this.state.lob.filter(i => i.inEdit==true).length > 0;
        return ({ data: this.state.lob, hasError: hasUnsavedData ? true : false, hasLob: noLob ? true : false });
    }


    updateState = (value, props) => {
        const data = this.state.lob.map((item) =>
            item.intId ==props.dataItem.intId
                ? { ...item, [props.field]: value }
                : item
        );
        this.setState({ lob: data });
    };

    InputField = (props) => {
        const { dataItem, field } = props;
        let max = field=="description" ? 2000 : 100;
        return (
            <td contextMenu={max==2000?"Description":"Line Of Business"}>
                {dataItem.inEdit ? (
                    <div className="input-desciption">
                        <input
                            type="text"
                            className="form-control "
                            placeholder=""
                            value={dataItem[field]}
                            maxLength={max}
                            onChange={(event) => {
                                this.updateState(event.target.value, props);
                            }}
                            name="name"
                        />
                        {/* {props.dataItem && props.dataItem[field]&& props.dataItem[field].length >= max && <ErrorComponent message={`Lob ${field} should not be greater than ${max} charecters`} />} */}
                    </div>
                ) : (
                    <span
                        title={dataItem[field]}
                    >
                        {dataItem[field]}
                    </span>
                )}
            </td>
        );
    };



    render() {
        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-a" id="createjoborderstep">
                                <div className="table-responsive tableShadow">
                                    <Grid
                                        className="kendo-grid-custom lastchild global-action-grid-lastchild lob-grid"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onItemChange={this.itemChange}
                                        onDataStateChange={this.onDataStateChange}
                                        filterable={false}
                                        columnMenu={false}
                                        //pageable={{ pageSizes: true }}
                                        data={this.state.lob}
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
                                            title="Line Of Business"
                                           
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={this.InputField}
                                        />
                                        <GridColumn
                                            sortable={true}
                                            field="description"
                                            title="Description"
                                            
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={this.InputField}
                                        />
                                        <GridColumn
                                            field="createdDate"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            title="Created Date"
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={(props) => CellRender(props, "Created Date")}
                                        />
                                        <GridColumn
                                            field="createdByName"
                                            title="Created By"
                                            cell={(props) => CellRender(props, "Created By")}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="status"
                                            title="Status"
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={StatusCell}
                                        />
                                        <GridColumn
                                            sortable={false}
                                            cell={this.CommandCell}
                                            width="110px"
                                            headerCell={this.CustomHeaderActionCellTemplate}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={REMOVE_CLIENT_LOB_CONFIRMATION_MSG()}
                        showModal={this.state.showRemoveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 2, CLIENT_LOB_REMOVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showRemoveConfirmationModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={ACTIVE_CLIENT_LOB_CONFIRMATION_MSG()}
                        showModal={this.state.showActiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 1, CLIENT_LOB_ACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showActiveConfirmationModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={INACTIVE_CLIENT_LOB_CONFIRMATION_MSG()}
                        showModal={this.state.showInactiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 0, CLIENT_LOB_INACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showInactiveConfirmationModal: false });
                        }}
                    />
                </div>

            </React.Fragment>
        );
    }
}

export default LineOfBusiness;