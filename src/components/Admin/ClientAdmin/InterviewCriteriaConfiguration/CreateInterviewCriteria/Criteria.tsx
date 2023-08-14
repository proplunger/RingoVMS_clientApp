import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { MyCommandCell, CustomHeaderActionCell } from "./HelperComponent";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import ReactExport from "react-data-export";
import clientAdminService from "../../Service/DataService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter, errorToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import {REMOVE_CRITERIA_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { State, toODataString } from "@progress/kendo-data-query";
import { Input } from "reactstrap";
import { ErrorComponent } from "../../../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export interface CriteriaProps {
    entityType: string;
    match: any;
    // criteriaId: string;
    canEdit?: boolean;
}

export interface CriteriaState {
    criteriaId?: string;
    criteria: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    status?: any;
    dataState: any;
    totalCount?: number;
    totalCriteria?: any;
    showError?: boolean;
    showRemoveConfirmationModal?: boolean
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class Criteria extends React.Component<CriteriaProps, CriteriaState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    private originalLevels = [];
    constructor(props: CriteriaProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            criteriaId: id,
            criteria: [],
            dataState: initialDataState,
            showLoader: true,
            showError: false,
            filterText: "",
        };
        this.initializeHeaderCell();
        this.initializeActionCell();
    }

    componentDidMount() {
        const { criteriaId } = this.state;
        if (criteriaId) {
            this.getCriteria(this.state.dataState);

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
            inactive: this.inactive,
            editField: this.editField
        });
    };

    initializeHeaderCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew,
            ExportMenu: this.ExportExcel,
            criteriaId: this.state.criteriaId,
        });
    };

    getCriteria = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { criteriaId } = this.state;
        clientAdminService.getCriteria(criteriaId, queryStr)
            .then(res => {
                this.setState({
                    criteria: res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getCriteriaCount(dataState);
                this.originalLevels = res.data;
            });
    }

    getCriteriaCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { criteriaId } = this.state;
        clientAdminService.getCriteria(criteriaId, queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalCriteria: res.data,
            });
        });
    };

    addNew = () => {
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.criteria) ,status: "Draft", createdDate: dateFormatter(new Date()), createdByName: this.userObj.userFullName };

        this.setState({
            criteria: [newDataItem, ...this.state.criteria]
        });
    };

    enterEdit = (dataItem) => {
        this.setState({
            criteria: this.state.criteria.map(item =>
                item.intId ==dataItem.intId ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    checkDuplicate = (name) => {
        let nameExists = this.state.criteria.filter(i => i.name.toLowerCase().trim()==name.toLowerCase().trim())
        if(nameExists.length > 1){
            return false;
        }
        else{
            return true;
        }
    }

    add = (dataItem, dataIndex) => {
        if(this.checkDuplicate(dataItem.name)){
            if (dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    //dataItem.tempId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    criteria: [...this.state.criteria]
                });
            }
        }
        else {
            errorToastr("Criteria already exists");
        }
    };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;
    //generateId = data => data.reduce((acc, current) => Math.max(acc, current.tempId), 0) + 1;

    remove = (dataItem) => {
        const data = [...this.state.criteria];
        this.removeItem(data, dataItem);
        //this.removeItem(this.state.transitions, dataItem);

        this.setState({ criteria: data, showRemoveConfirmationModal: false });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    update = (dataItem) => {
        if(this.checkDuplicate(dataItem.name)){
            if (dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100) {
                const data = [...this.state.criteria];
                const updatedItem = { ...dataItem, inEdit: undefined };

                this.updateItem(data, updatedItem);

                this.setState({ criteria: data });
            }
        }
        else {
            errorToastr("Criteria already exists");
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
        //const data = this.state.lob.map((item) => item.intId ==originalItem.intId ? originalItem : item);
        const data = this.state.criteria.map((item) => item.id ==originalItem.id ? originalItem : item);
        this.setState({ criteria: data });
    }

    discard = dataItem => {
        const data = [...this.state.criteria];
        this.removeItem(data, dataItem);

        this.setState({ criteria: data });
    };

    inactive = (dataItem, isActive) => {
        dataItem.status = isActive ? "Active" : "Inactive"
        const data = [...this.state.criteria];
        this.updateItem(data, dataItem);
        this.setState({ criteria: data });
    }

    itemChange = (event) => {
        const data = this.state.criteria.map(item =>
            item.intId ==event.dataItem.intId ?
                //item.tempId ==event.dataItem.tempId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ criteria: data });
    }

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="Interview Criteria"
        >
            <ExcelSheet data={this.state.totalCriteria} name="Interview Criteria">
                <ExcelColumn label="Criteria" value="name" />
                <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
                <ExcelColumn label="Created By" value="createdByName" />
                {/* <ExcelColumn label="Status" value="status" /> */}
            </ExcelSheet>
        </ExcelFile>
    );

    onDataStateChange = (changeEvent) => {
        if (this.state.criteriaId) {
            this.getCriteria(changeEvent.data);
        }
    };

    getCriteriaData() {
        let noCriteria = this.state.criteria.length <= 0;
        let hasUnsavedData = this.state.criteria.filter(i => i.inEdit==true).length > 0;
        return ({ data: this.state.criteria, hasError: hasUnsavedData ? true : false , hasCriteria: noCriteria ? true : false});
    }

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
                                        className="kendo-grid-custom lastchild global-action-grid-lastchild"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onItemChange={this.itemChange}
                                        onDataStateChange={this.onDataStateChange}
                                        filterable={false}
                                        columnMenu={false}
                                        //pageable={{ pageSizes: true }}
                                        data={this.state.criteria}
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
                                            title="Criteria"
                                            className="task-form-control task-form-control-criteria"
                                            //cell={this.InputField}
                                            columnMenu={WithoutFilterColumnMenu}
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
                                        {/* <GridColumn
                                            field="status"
                                            title="Status"
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={StatusCell}
                                        /> */}
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
                        message={REMOVE_CRITERIA_CONFIRMATION_MSG()}
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

export default Criteria;