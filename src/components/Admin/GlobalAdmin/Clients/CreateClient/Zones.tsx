import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { MyCommandCell, CustomHeaderActionCellZone } from "./HelperComponent";
import withValueField from "../../../../Shared/withValueField";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { State, toODataString } from "@progress/kendo-data-query";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter, errorToastr, successToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { ACTIVE_CLIENT_ZONE_CONFIRMATION_MSG, CLIENT_ZONE_ACTIVE_SUCCESS_MSG, CLIENT_ZONE_INACTIVE_SUCCESS_MSG, CLIENT_ZONE_REMOVE_SUCCESS_MSG, INACTIVE_CLIENT_ZONE_CONFIRMATION_MSG, REMOVE_CLIENT_ZONE_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export interface ZonesProps {
    entityType: string;
    clientId: string;
    canEdit?: boolean;
}

export interface ZonesState {
    zone: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    description?: string;
    status?: any;
    dataState: any;
    totalCount?: number;
    totalZone?: any;
    showRemoveConfirmationModal?: boolean;
    showActiveConfirmationModal?: boolean;
    showInactiveConfirmationModal?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class Zones extends React.Component<ZonesProps, ZonesState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    private originalLevels = [];
    constructor(props: ZonesProps) {
        super(props);
        this.state = {
            zone: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
        };

        this.initializeHeaderCell();
        this.initializeActionCell();
    }

    componentDidMount() {
        if (this.props.clientId) {
            this.getZones(this.props.clientId);

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
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCellZone({
            add: this.addNew,
            ExportMenu: this.ExportExcel,
        });
    };

    getZones = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/zone?${queryStr}`)
            .then(async res => {
                this.setState({
                    zone: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getZoneCount(dataState);
                this.originalLevels = res.data;
            });
    }

    getZoneCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/zone?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalZone: res.data,
            });
        });
    };

    addNew = () => {
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.zone), status: "Draft", createdDate: dateFormatter(new Date()), createdByName: this.userObj.userFullName };

        this.setState({
            zone: [newDataItem, ...this.state.zone]
        });
    };

    enterEdit = (dataItem) => {
        this.setState({
            zone: this.state.zone.map(item =>
                item.intId ==dataItem.intId ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    checkDuplicate = (name) => {
        let nameExists = this.state.zone.filter(i => i.name.toLowerCase().trim()==name.toLowerCase().trim())
        if (nameExists.length > 1) {
            return false;
        }
        else {
            return true;
        }
    }

    add = dataItem => {
        // if(dataItem.name.length<100 && dataItem.description.length<2000){
        if (this.checkDuplicate(dataItem.name)) {
            if (dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    zone: [...this.state.zone]
                });
            }
        }
        else {
            errorToastr("Zone already exists");
        }
        // }
    };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;

    remove = (dataItem, statusId, msg) => {
        const data = [...this.state.zone];
        if (dataItem.id) {
            this.deleteRegion(dataItem.id, statusId, msg)
        } else {
            this.removeItem(data, dataItem);

            this.setState({ zone: data, showRemoveConfirmationModal: false });
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
                const data = [...this.state.zone];
                const updatedItem = { ...dataItem, inEdit: undefined };

                this.updateItem(data, updatedItem);

                this.setState({ zone: data });
            }
        }
        else {
            errorToastr("Zone already exists");
            // }
        }
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
        const data = this.state.zone.map((item) => item.id ==originalItem.id ? originalItem : item);
        //const data = this.state.region.map((item) => item.intId ==originalItem.intId ? originalItem : item);
        this.setState({ zone: data });
    }

    discard = dataItem => {
        const data = [...this.state.zone];
        this.removeItem(data, dataItem);

        this.setState({ zone: data });
    };

    // inactive = (dataItem, isActive) => {
    //     dataItem.status = isActive ? "Active" : "Inactive"
    //     const data = [...this.state.region];
    //     this.updateItem(data, dataItem);
    //     this.setState({ region: data });
    // }

    deleteRegion = (id, statusId, msg) => {
        this.setState({ showRemoveConfirmationModal: false, showActiveConfirmationModal: false, showInactiveConfirmationModal: false });
        axios.delete(`/api/clients/${this.props.clientId}/zone/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getZones(this.state.dataState);
        });
    };

    onDataStateChange = (changeEvent) => {
        if (this.props.clientId) {
            this.getZones(changeEvent.data);
        }
    };

    updateState = (keyword, props) => {
        const data = this.state.zone.map((item) =>
            item.intId ==props.dataItem.intId
                ? { ...item, [props.field]: keyword }
                : item
        );
        this.setState({ zone: data });
    };

    itemChange = (event) => {
        const data = this.state.zone.map(item =>
            item.intId ==event.dataItem.intId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ zone: data });
    }

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="Zones"
        >
            <ExcelSheet data={this.state.totalZone} name="Zones">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Description" value="description" />
                <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
                <ExcelColumn label="Created By" value="createdByName" />
                <ExcelColumn label="Status" value="status" />
            </ExcelSheet>
        </ExcelFile>
    );

    getZoneData() {
        let hasUnsavedData = this.state.zone.filter(i => i.inEdit==true).length > 0;
        return ({ data: this.state.zone, hasError: hasUnsavedData ? true : false });
    }


    InputField = (props) => {
        const { dataItem, field } = props;
        let max = field=="description" ? 2000 : 100;
        return (
            <td contextMenu={max==2000?"Description":"Zone Name"}>
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
                        {/* {props.dataItem && props.dataItem[field]&& props.dataItem[field].length >= max && <ErrorComponent message={`Region ${field} should not be greater than ${max} charecters`} />} */}
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
                                        className="kendo-grid-custom lastchild global-action-grid-lastchild region-grid"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onDataStateChange={this.onDataStateChange}
                                        onItemChange={this.itemChange}
                                        //pageable={{ pageSizes: true }}
                                        data={this.state.zone}
                                        {...this.state.dataState}
                                        total={this.state.totalCount}
                                        editField="inEdit"
                                        selectedField="selected"
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                        <GridColumn
                                            field="name"
                                            title="Zone Name"
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={this.InputField}
                                        />
                                        <GridColumn
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
                        message={REMOVE_CLIENT_ZONE_CONFIRMATION_MSG()}
                        showModal={this.state.showRemoveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 2, CLIENT_ZONE_REMOVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showRemoveConfirmationModal: false });
                        }}
                    />
                    <ConfirmationModal
                        message={ACTIVE_CLIENT_ZONE_CONFIRMATION_MSG()}
                        showModal={this.state.showActiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 1, CLIENT_ZONE_ACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showActiveConfirmationModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={INACTIVE_CLIENT_ZONE_CONFIRMATION_MSG()}
                        showModal={this.state.showInactiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 0, CLIENT_ZONE_INACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showInactiveConfirmationModal: false });
                        }}
                    />
                </div>

            </React.Fragment>
        );
    }

}

export default Zones;