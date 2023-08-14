import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { MyCommandCell, CustomHeaderActionCell } from "./HelperComponent";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import ReactExport from "react-data-export";
import clientAdminService from "../../Service/DataService";
import commonDataService from "../../../../Shared/Services/CommonDataService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter, errorToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { REMOVE_TASKS_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { State, toODataString } from "@progress/kendo-data-query";
import { Input } from "reactstrap";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import axios from "axios";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { documentType: "Select...", documentTypeId: null };

export interface TaskProps {
    entityType: string;
    match: any;
    // criteriaId: string;
    canEdit?: boolean;
}

export interface TaskState {
    onboardingId?: string;
    tasks: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    dataState: any;
    documents: Array<IDropDownModel>;
    totalCount?: number;
    totalTask?: any;
    showError?: boolean;
    showRemoveConfirmationModal?: boolean
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class Task extends React.Component<TaskProps, TaskState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    public isSubmit = false;
    private originalLevels = [];
    constructor(props: TaskProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            onboardingId: id,
            tasks: [],
            documents: [],
            dataState: initialDataState,
            showLoader: true,
            showError: false,
            filterText: "",
        };
        this.initializeHeaderCell();
        this.initializeActionCell();
    }

    componentDidMount() {
        const { onboardingId } = this.state;
        if (onboardingId) {
            this.getTask(this.state.dataState);

        } else {
            this.setState({ showLoader: false });
        }
        this.getDocuments();
    }

    initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: (dataItem) => this.setState({ showRemoveConfirmationModal: true }, () => this.dataItem = dataItem),
            add: this.add,
            discard: this.discard,
            update: this.update,
            cancel: this.cancel,
            editField: this.editField
        });
    };

    initializeHeaderCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew,
            ExportMenu: this.ExportExcel,
            onBoardingId: this.state.onboardingId,
        });
    };

    getTask = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { onboardingId } = this.state;
        clientAdminService.getTask(onboardingId, queryStr)
            .then(res => {
                this.setState({
                    tasks: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getTaskCount(dataState);
                this.originalLevels = res.data;
            });
    }

    getTaskCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { onboardingId } = this.state;
        clientAdminService.getTask(onboardingId, queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalTask: res.data,
            });
        });
    };

    getDocuments = () => {
        commonDataService.getDocTypes()
            .then(async res => {
                this.setState({ documents: res.data });
            });
    }

    // handleDocumentChange = (e, props) => {
    //     let { name, value } = e.target.props;
    //     const { tasks } = this.state;
    //     this.setState(() => ({
    //         tasks: tasks.map((item) =>
    //             item.documentTypeId==props.dataItem.documentTypeId        //(item.documentTypeId==props.dataItem.documentTypeId && item.intId)candDocTypeIntId
    //                 ? (Object.assign(item, { documentTypeId: e.value.documentTypeId, documentType: e.value.documentType , docTypeIntId: e.value.candDocTypeIntId})) : item
    //         ),
    //     }));
    // }

    addNew = () => {
        this.isSubmit = false;
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.tasks)};
        this.setState({
            tasks: [ newDataItem, ...this.state.tasks]
        });
    };

    enterEdit = (dataItem) => {
        this.isSubmit = false;
        this.setState({
            tasks: this.state.tasks.map(item =>
                item.intId ==dataItem.intId ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    checkDuplicate = (name) => {
        let nameExists = this.state.tasks.filter(i => i.name && i.name.toLowerCase().trim()==name.toLowerCase().trim())
        if(nameExists.length > 1){
            return false;
        }
        else{
            return true;
        }
    }

    add = (dataItem, dataIndex) => {
        this.isSubmit = true;
        if (dataItem.documentTypeId==null) {
            this.setState({ tasks: this.state.tasks });
            return false;
        } 
        else if(dataItem.isMandatory && (!dataItem.isValidFromApplicable && !dataItem.isValidToApplicable && !dataItem.isDocumentMandatory)){
            this.setState({ tasks: this.state.tasks });
            errorToastr("For mandatory task, please check atleast one other criteria!");
            return false;
        }
        if(this.checkDuplicate(dataItem.name)){
            if ((dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) ) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    tasks: [...this.state.tasks]
                });
            }
        }
        else {
            errorToastr("Task already exists");
        }
    };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;
    
    remove = (dataItem) => {
        const data = [...this.state.tasks];
        this.removeItem(data, dataItem);
    
        this.setState({ tasks: data, showRemoveConfirmationModal: false });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    update = (dataItem) => {
        this.isSubmit = true;
        if (dataItem.documentTypeId==null) {
            this.setState({ tasks: this.state.tasks });
            return false;
        }
        else if(dataItem.isMandatory && (!dataItem.isValidFromApplicable && !dataItem.isValidToApplicable && !dataItem.isDocumentMandatory)){
            this.setState({ tasks: this.state.tasks });
            errorToastr("For mandatory task, please check atleast one other criteria!");
            return false;
        }
            if(this.checkDuplicate(dataItem.name)){
                if ((dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) ) {
                    const data = [...this.state.tasks];
                    const updatedItem = { ...dataItem, inEdit: undefined };

                    this.updateItem(data, updatedItem);

                    this.setState({ tasks: data });
                }
            }
            else {
                errorToastr("Task already exists");
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
        const data = this.state.tasks.map((item) => item.id ==originalItem.id ? originalItem : item);
        this.setState({ tasks: data });
    }

    discard = dataItem => {
        const data = [...this.state.tasks];
        this.removeItem(data, dataItem);

        this.setState({ tasks: data });
    };

    itemChange = (event) => {
        const data = this.state.tasks.map(item =>
            item.intId ==event.dataItem.intId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ tasks: data });
    }

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="OnBoarding Task"
        >
            <ExcelSheet data={this.state.totalTask} name="OnBoarding Task">
                <ExcelColumn label="Task Name" value="name" />
                <ExcelColumn label="Document Type" value="documentType" />
                <ExcelColumn label="Is Mandatory" value="isMandatory" />
                <ExcelColumn label="Apply Start Date?" value="isValidFromApplicable" />
                <ExcelColumn label="Apply End Date?" value="isValidToApplicable" />
                <ExcelColumn label="Is Document Mandatory" value="isDocumentMandatory" />
            </ExcelSheet>
        </ExcelFile>
    );

    onDataStateChange = (changeEvent) => {
        if (this.state.onboardingId) {
            this.getTask(changeEvent.data);
        }
    };

    updateState = (keyword, props) => {
        const data = this.state.tasks.map((item) =>
            item.id ==props.dataItem.id
                ? { ...item, [props.field]: keyword }
                : item
        );
        this.setState({ tasks: data });
    };

    
    getTaskData() {
        let noTask = this.state.tasks.length <= 0;
        let hasUnsavedData = this.state.tasks.filter(i => i.inEdit==true).length > 0;
        return ({ data: this.state.tasks, hasError: hasUnsavedData ? true : false , hasTask: noTask ? true : false});
    }

    handleChange(event, index) {
        if (event.target.type=="radio") {
            this.state.tasks[index - 1][event.target.name.split(" ")[1]] = event.target.checked=="true" ? true : false;
        } else {
            this.state.tasks[index - 1][event.target.name.split(" ")[1]] =
                event.target.type=="checkbox" ? event.target.checked : event.target.value;
        }
    }

    render() {
        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-notuse" id="createjoborderstep">
                                <div className="table-responsive tableShadow tableShadow-form-control-a  global-action-grid-lastchild">
                                    <Grid
                                        className="kendo-grid-custom lastchild"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onItemChange={this.itemChange}
                                        onDataStateChange={this.onDataStateChange}
                                        filterable={false}
                                        columnMenu={false}
                                        data={this.state.tasks}
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
                                            title="Task Name"
                                            className="task-form-control task-form-control-Tasks"
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="documentType"
                                            title="Document Type"
                                            cell={(props) => {
                                                if (!props.dataItem.inEdit) {
                                                    return (
                                                        <td contextMenu="Document Type">
                                                            {props.dataItem.documentType != undefined && props.dataItem.documentType}
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td contextMenu="Document Type">
                                                            <CustomDropDownList
                                                                className={"form-control task-form-control-Desc"}
                                                                data={this.state.documents}
                                                                name='documentTypeId'
                                                                textField="documentType"
                                                                valueField="documentTypeId"
                                                                id="documentTypeId"
                                                                defaultItem={defaultItem}
                                                                value={(props.dataItem.documentTypeId)}
                                                                onChange={(e) => {
                                                                    props.dataItem.documentTypeId = e.value.documentTypeId;
                                                                    props.dataItem.documentType = e.value.documentType;
                                                                    props.dataItem.candDocTypeIntId = e.value.candDocTypeIntId
                                                                    this.setState({ tasks: this.state.tasks })
                                                                }}
                                                            />
                                                            {this.isSubmit && props.dataItem.documentTypeId==null && <ErrorComponent />}
                                                        </td>
                                                    );
                                                }
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="isMandatory"
                                            title="Is Mandatory"
                                            cell={(props) => {
                                                if (!props.dataItem.inEdit) {
                                                    return (
                                                        <td contextMenu="Is Mandatory">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            disabled ={true}
                                                                            checked = {props.dataItem.isMandatory}
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td contextMenu="Is Mandatory">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox"
                                                                            checked = {props.dataItem.isMandatory}
                                                                            name={props.dataIndex + " isMandatory " + this.props.entityType}
                                                                            onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                            value="false"
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="isValidFromApplicable"
                                            title="Apply Start Date?"
                                            cell={(props) => {
                                                if (!props.dataItem.inEdit) {
                                                    return (
                                                        <td contextMenu="Apply Start Date?">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            disabled ={true}
                                                                            checked = {props.dataItem.isValidFromApplicable}
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td contextMenu="Apply Start Date?">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            checked = {props.dataItem.isValidFromApplicable}
                                                                            name={props.dataIndex + " isValidFromApplicable " + this.props.entityType}
                                                                            onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                            value="false"
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="isValidToApplicable"
                                            title="Apply End Date?"
                                            cell={(props) => {
                                                if (!props.dataItem.inEdit) {
                                                    return (
                                                        <td contextMenu="Apply End Date?">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            disabled ={true}
                                                                            checked = {props.dataItem.isValidToApplicable}
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td contextMenu="Apply End Date?">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            checked = {props.dataItem.isValidToApplicable}
                                                                            name={props.dataIndex + " isValidToApplicable " + this.props.entityType}
                                                                            onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                            value="false"
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            field="isDocumentMandatory"
                                            title="Is Document Mandatory"
                                            cell={(props) => {
                                                if (!props.dataItem.inEdit) {
                                                    return (
                                                        <td contextMenu="Is Document Mandatory">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox" 
                                                                            disabled ={true}
                                                                            checked = {props.dataItem.isDocumentMandatory}
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td contextMenu="Is Document Mandatory">
                                                            <div className="form-control border-0 task-form-control-Check">
                                                                <div style={{ width: "20px", height:"20px"}}>
                                                                    <label className="container-R d-flex mb-0 pb-3">
                                                                        <input 
                                                                            type = "checkbox"
                                                                            checked = {props.dataItem.isDocumentMandatory}
                                                                            name={props.dataIndex + " isDocumentMandatory " + this.props.entityType}
                                                                            onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                            value="false"
                                                                        />
                                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                        />
                                        <GridColumn
                                            sortable={false}
                                            cell={this.CommandCell}
                                            width="120px"
                                            headerCell={this.CustomHeaderActionCellTemplate}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={REMOVE_TASKS_CONFIRMATION_MSG()}
                        showModal={this.state.showRemoveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem)}
                        handleNo={() => {
                            this.setState({ showRemoveConfirmationModal: false });
                        }}
                    />
                </div>

            </React.Fragment>
        );
    }
}

export default Task;