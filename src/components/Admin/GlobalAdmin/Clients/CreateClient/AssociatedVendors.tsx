import * as React from "react";
import { Grid,GridCell,GridColumn, GridNoRecords, GridPageChangeEvent, GridToolbar } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList, DropDownListFilterChangeEvent, DropDownListPageChangeEvent } from "@progress/kendo-react-dropdowns";
import { MyCommandCell, CustomHeaderActionCellAssociatedVendor } from "./HelperComponent";
import withValueField from "../../../../Shared/withValueField";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy, FilterDescriptor, State, toODataString } from "@progress/kendo-data-query";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatter, errorToastr, successToastr } from "../../../../../HelperMethods";
import ReactExport from "react-data-export";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { ACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG, CLIENT_ASSOCIATED_VENDOR_ACTIVE_SUCCESS_MSG, CLIENT_ASSOCIATED_VENDOR_INACTIVE_SUCCESS_MSG, CLIENT_ASSOCIATED_VENDOR_REMOVE_SUCCESS_MSG, INACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG, REMOVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { ErrorComponent } from "../../../../ReusableComponents";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const defaultVendor = { vendor: "Select Vendor", vendorId: null };

export interface AssociatedVendosProps {
    entityType: string;
    clientId: string;
    canEdit?: boolean;
    
}

export interface AssociatedVendorsState {
    associatedVendor: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    name?: string;
    fee?: any;
    status?: any;
    dataState: any;
    vendors: Array<IDropDownModel>;
    originalvendors: Array<IDropDownModel>;
    vendorId?: string;
    totalCount?: number;
    totalAssociatedVendor?: any;
    showRemoveConfirmationModal?: boolean;
    showActiveConfirmationModal?: boolean;
    showInactiveConfirmationModal?: boolean;
    data?:any;
    skip:number;
    
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class AssociatedVendors extends React.Component<AssociatedVendosProps, AssociatedVendorsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    public isSubmit = false;
    private originalLevels = [];
    constructor(props: AssociatedVendosProps) {
        super(props);
        this.state = {
            associatedVendor: [],
            vendors: [],
            originalvendors: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
            data:[],
            skip:0
       
         
        };
        this.initializeHeaderCell();
        this.initializeActionCell();
    }
    

 

    componentDidMount() {
        if (this.props.clientId) {
            this.getAssociatedVendors(this.state.dataState);

        } else {
            this.setState({ showLoader: false });
        }
        this.getVendor();
    }
    pageChange = (event: GridPageChangeEvent) => {
        this.setState({
            skip: event.page.skip
        });
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
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCellAssociatedVendor({
            add: this.addNew,
            ExportMenu: this.ExportExcel,
        });
    };

    getAssociatedVendors = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/vendor?${queryStr}`)
            .then(async res => {
                this.setState({
                    associatedVendor: res.data,
                    data:res.data,
                    dataState: dataState,
                    showLoader: false
                });
                this.getAssociatedVendorCount(dataState);
                this.originalLevels = res.data;
            });
    }

    getAssociatedVendorCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        const { clientId } = this.props;
        axios.get(`api/clients/${clientId}/vendor?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalAssociatedVendor: res.data,
            });
        });
    };

    getVendor = () => {
        const queryParams = `status eq 'Active'`;
        axios.get(`api/vendor?$filter=${queryParams}&$orderby=vendor`)
            .then(async res => {
                this.setState({ vendors: res.data, originalvendors: res.data});
            });
    }

    handleFilterChange = (event) =>{
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    addNew = () => {
        this.isSubmit = false;
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.associatedVendor), fee: this.state.fee, status: "Draft", createdDate: dateFormatter(new Date()), createdByName: this.userObj.userFullName };
        
        {this.setState({ vendors: this.state.originalvendors })}
        this.setState({
            associatedVendor: [newDataItem, ...this.state.associatedVendor]
        });
    };

    enterEdit = (dataItem) => {
        this.isSubmit = false;
        this.setState({
            associatedVendor: this.state.associatedVendor.map(item =>
                item.intId ==dataItem.intId ?
                    { ...item, inEdit: true } : item
            )
        });
    }

    checkDuplicate = (name) => {
        let nameExists = this.state.associatedVendor.filter(i => i.vendor==name)
        if (nameExists.length > 1) {
            return false;
        }
        else {
            return true;
        }
    }

    add = dataItem => {
        this.isSubmit = true;
        if (dataItem.fee > 100 || dataItem.fee < 0) {
            this.setState({ associatedVendor: this.state.associatedVendor });
            return false;
        }
        if (this.checkDuplicate(dataItem.vendor)) {
            if (dataItem.vendor) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    associatedVendor: [...this.state.associatedVendor]
                });
            }
        }
        else {
            errorToastr("Associated Vendor already exists");
        }
    };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;

    remove = (dataItem, statusId, msg) => {
        const data = [...this.state.associatedVendor];

        if (dataItem.id) {
            this.deleteAssociatedVendor(dataItem.id, statusId, msg)
        } else {
            this.removeItem(data, dataItem);
            this.setState({ associatedVendor: data, showRemoveConfirmationModal: false });
        }
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    update = (dataItem) => {
        this.isSubmit = true;
        if (dataItem.fee > 100 || dataItem.fee < 0) {
            this.setState({ associatedVendor: this.state.associatedVendor });
            return false;
        }
        if (this.checkDuplicate(dataItem.vendor)) {
            if (dataItem.vendor) {
                const data = [...this.state.associatedVendor];
                const updatedItem = { ...dataItem, inEdit: undefined };

                this.updateItem(data, updatedItem);

                this.setState({ associatedVendor: data });
            }
        }
        else {
            errorToastr("Associated Vendor already exists");
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
        const data = this.state.associatedVendor.map((item) => item.id ==originalItem.id ? originalItem : item);
        this.setState({ associatedVendor: data });
    }

    discard = dataItem => {
        const data = [...this.state.associatedVendor];
        this.removeItem(data, dataItem);

        this.setState({ associatedVendor: data });
    };

    deleteAssociatedVendor = (id, statusId, msg) => {
        this.setState({ showRemoveConfirmationModal: false, showActiveConfirmationModal: false, showInactiveConfirmationModal: false });
        axios.delete(`/api/clients/${this.props.clientId}/associatedvendor/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getAssociatedVendors(this.state.dataState);
        });
    };

    onDataStateChange = (changeEvent) => {
        if (this.props.clientId) {
            this.getAssociatedVendors(changeEvent.data);
        }
    };

    updateState = (value, props) => {
        const data = this.state.associatedVendor.map((item) =>
            item.intId ==props.dataItem.intId
                ? { ...item, [props.field]: value }
                : item
        );
        this.setState({ associatedVendor: data });
    };

    itemChange = (event) => {
        const data = this.state.associatedVendor.map(item =>
            item.intId ==event.dataItem.intId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ associatedVendor: data });
    }

    InputField = (props) => {
        const { dataItem, field } = props;
        return (
            <td contextMenu="Transaction Fees (%)" className="text-right pr-4">
                {dataItem.inEdit ? (
                    <div className="input-desciption">
                        <input
                            type="number"
                            className="form-control text-right"
                            placeholder="Enter Trans. Fees"
                            value={dataItem[field]}
                            maxLength={100}
                            onChange={(event) => {
                                this.updateState(event.target.value, props);
                            }}
                            name="fee"
                        />
                         {this.isSubmit && props.dataItem.fee > 100 ? <ErrorComponent message="Fees should not be greater than 100" /> : props.dataItem.fee < 0 && <ErrorComponent message="Fees should not be less than 0" />}
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

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="Associated Vendors"
        >
            <ExcelSheet data={this.state.totalAssociatedVendor} name="Associated Vendors">
                <ExcelColumn label="Vendor" value="vendor" />
                <ExcelColumn label="Transaction Fees (%)" value="fee" />
                <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
                <ExcelColumn label="Created By" value="createdByName" />
                <ExcelColumn label="Status" value="status" />
            </ExcelSheet>
        </ExcelFile>
    );

    getAssociatedVendorData() {
        let hasUnsavedData = this.state.associatedVendor.filter(i => i.inEdit==true).length > 0;
        return ({ data: this.state.associatedVendor, hasError: hasUnsavedData ? true : false });
    }

    DropdownCell=(props)=>{
      
        return (

            <>
            {!props.dataItem.inEdit || props.dataItem.id != undefined
                ?(
                    <td contextMenu="Associated Vendors">
                        {props.dataItem.vendor != undefined && props.dataItem.vendor}
                    </td>
                ):
          (<td contextMenu="Associated Vendors" className="myOrderContainer-dropdownList">
                    
                        <CustomDropDownList
                            className={"form-control"}
                            data={this.state.vendors}
                            name='vendorId'
                            textField="vendor"
                            // valueField="vendorId"
                            id="vendors"
                            defaultItem={defaultVendor}
                            value={(props.dataItem.vendorId)}
                           
                            onChange={(e) => {

                                props.dataItem.vendorId = e.value.vendorId;
                                props.dataItem.vendor = e.value.vendor;
                                props.dataItem.vendorIntId = e.value.intId
                                this.setState({ associatedVendor: this.state.associatedVendor })
                             
                            }}
                            filterable={this.state.originalvendors.length>5?true:false}
                            onFilterChange={this.handleFilterChange}
                        />
                    </td>
                )
            }
            </>
        );
    }

    render() {
        const { canEdit } = this.props;
       console.log(this.props.clientId)
       console.log("pagin:",this.state.associatedVendor.length)
        return (
            <>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-a" id="createjoborderstep">
                                <div className="table-responsive tableShadow myOrderContainer-dropdownList">
                                    <Grid
                                        className="kendo-grid-custom lastchild global-action-grid-lastchild"
                                        style={{ height: 'auto',maxHeight:'2035px' }}
                                        sortable={true}
                                        onDataStateChange={this.onDataStateChange}
                                        onItemChange={this.itemChange}
                                        {...this.state.dataState}
                                        editField="inEdit"
                                        selectedField="selected"
                                        rowHeight={40}
                                        data={this.state.associatedVendor.slice(this.state.skip, this.state.skip + 65)}
                                        pageSize={50}
                                        total={this.state.associatedVendor.length}
                                        skip={this.state.skip}
                                        scrollable={'virtual'}
                                        onPageChange={this.pageChange}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>

                                        <GridColumn
                                            field="vendor"
                                            title="Vendor"
                                            className="myOrderContainer-K-textbox"
                                            columnMenu={WithoutFilterColumnMenu}
                                            cell={this.DropdownCell}
                                        />
                                     

                                        <GridColumn
                                            field="fee"
                                            title="Transaction Fees (%)"
                                            headerClassName="text-right pr-4"
                                            className="myOrderContainer-K-textbox"
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
                                        {/* <GridColumn field="vendor" cell={DropDownCell} /> */}
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={REMOVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG()}
                        showModal={this.state.showRemoveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 2, CLIENT_ASSOCIATED_VENDOR_REMOVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showRemoveConfirmationModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={ACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG()}
                        showModal={this.state.showActiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 1, CLIENT_ASSOCIATED_VENDOR_ACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showActiveConfirmationModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={INACTIVE_CLIENT_ASS_VENDOR_CONFIRMATION_MSG()}
                        showModal={this.state.showInactiveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem, 0, CLIENT_ASSOCIATED_VENDOR_INACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showInactiveConfirmationModal: false });
                        }}
                    />
                </div>

                
            </>
        );
    }

}

export default AssociatedVendors;