import * as React from "react";
import { Grid, GridColumn as Column, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faTrash, faPlusCircle, faUndo, faPencilAlt, faSave, faPlus, faUserPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { kendoLoadingPanel, KendoDataValueRender } from "../../ReusableComponents";
import axios from "axios";
import { DropDownList, MultiSelect, MultiSelectChangeEvent, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import { CustomHeaderActionCell, MyCommandCell } from "./HelperComponent";
import { IWfApprovalVm, IWfApprovalLevelVm } from "./models/IApprovalWfState";
import { ConfirmationModal } from "../ConfirmationModal";
import Skeleton from "react-loading-skeleton";
import { IDropDownModel } from "../Models/IDropDownModel";
import withValueField from "../withValueField";
import ReactTooltip from "react-tooltip";
import { ApprovalSettings, AuthApproverRole, AuthRoleType, isAuthApproverRoles } from "../AppConstants";
import { GridNoRecord } from "../GridComponents/CommonComponents";
import { Link } from "react-router-dom";
import auth from "../../Auth";
import { AppPermissions } from "../Constants/AppPermissions";
import { filterBy } from "@progress/kendo-data-query";
import { defaultProps } from "@progress/kendo-react-scheduler/dist/npm/views/time/TimelineView";

const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const globalAll = "All";
const defaultItem = { name: globalAll, id: null };

class ApproverHeaderCell extends React.Component<{ onClick; title; canEdit, canEditDefault }> {
    render() {
        return (
            <React.Fragment>
                <span>{this.props.title}</span>
                {this.props.canEdit && !this.props.canEditDefault && (
                    <React.Fragment>
                        <ReactTooltip
                            place={"top"}
                            effect={"solid"}
                            multiline={true}
                            backgroundColor={"white"}
                            type={"success"}
                            border={true}
                            className="tooltipClsnew"
                            borderColor={"#FE988D"}
                            textColor="black"
                            id={"legendTooltip"}
                        >
                            <span style={{ fontSize: "13px" }}>* Note: Default approvers cannot be edited or removed.</span>
                        </ReactTooltip>
                        <FontAwesomeIcon icon={faInfoCircle} className={"ml-2 text-white"} data-tip data-for={"legendTooltip"} />
                    </React.Fragment>
                )}
                {this.props.children}
            </React.Fragment>
        );
    }
}

export interface ApprovalsWFGridProps {
    entityType: string;
    entityId: string;
    clientId: string;
    wfApprovalId?: string;
    permission: string;
    canEdit?: boolean;
    canEditDefault?: boolean;
    disableAddLevel?: boolean;
    disableActiveLevel?: boolean;
    handleApproversChange?: any;
}

export interface ApprovalsWFGridState {
    data: IWfApprovalVm;
    approvers: any[];
    originalApprovers: any[];
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showRemoveSelectedModal?: boolean;
    currentDataItem: any;
    roles: Array<IDropDownModel>;
    settings: any;
    filterText: any;
    value:any;
}

class ApprovalsWFGrid extends React.Component<ApprovalsWFGridProps, ApprovalsWFGridState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    editField = "inEdit";
    private originalLevels;
    constructor(props: ApprovalsWFGridProps) {
        super(props);
        this.state = {
            data: {
                clientId: this.props.clientId,
                isParallel: false,
                isOverridePriorLevel: false,
                wfApprovalLevel: [],
            },
            approvers: [],
            originalApprovers:[],
            showLoader: true,
            currentDataItem: { isDefault: false },
            roles: [],
            settings: [],
            filterText: "",
            value:[]
        };

        this.initializeHeaderCell(false);
        this.initializeActionCell();
    }

    componentDidMount() {
        const { entityType, entityId, wfApprovalId, permission, clientId } = this.props;
        this.getApprovers(clientId, permission);
        this.getApprovalSettings(clientId);
        if (entityId) {
            this.getApproverDetailsByEntityId(entityId, entityType, clientId);
        } else if (wfApprovalId=="") {
            this.setState({ showLoader: false })
        }
        else if (wfApprovalId) {
            //this.setState({ showLoader: false });
            this.getApproverDetailsByClient(clientId, entityType);
        }
        else {
            this.setState({ showLoader: false });
        }
        this.getRoles();
    }


    filterChange = (event: MultiSelectFilterChangeEvent) => {
        this.setState({
            approvers: filterBy(this.state.originalApprovers.slice(), event.filter)
        });
    }
   
    initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: this.openRemoveConfirmBox,
            add: this.addNew,
            discard: this.openRemoveConfirmBox,
            update: this.update,
            cancel: this.cancel,
            editField: this.editField,
            canEdit: this.props.canEdit,
            canEditDefault: this.props.canEditDefault,
            disableActiveLevel: this.props.disableActiveLevel,
        });
    };

    initializeHeaderCell = (canRemove) => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew,
            canAdd: !this.props.disableAddLevel,
            removeSelected: this.openRemoveSelectedConfirmBox,
            canRemove: canRemove,
            resetChanges: this.resetChanges,
        });
    };

    //gets approvers dropdown based on clientId and locationId having UpdateReqStatus permission
    getApprovers(clientId: string, permission: string) {
        // const { locationId } = this.props.approverStep;
        axios.get(`api/clients/${clientId}/approvers?$filter=permCode eq '${permission}'&$orderby=name`).then((res) => {
            // this.props.handlePositionSave(res.data.data, true);
            this.setState({
                approvers: res.data.filter((x) => [
                    AuthApproverRole.HR,
                    AuthApproverRole.HiringManager,
                    AuthApproverRole.ClientAdmin,
                    AuthApproverRole.ClientAdminII,
                    AuthApproverRole.Finance,
                ].indexOf(x.role)!=-1),
                originalApprovers: res.data.filter((x) => [
                    AuthApproverRole.HR,
                    AuthApproverRole.HiringManager,
                    AuthApproverRole.ClientAdmin,
                    AuthApproverRole.ClientAdminII,
                    AuthApproverRole.Finance,
                ].indexOf(x.role)!=-1),
            });
        });
    }

    getApprovalSettings(clientId: string) {
        axios.get(`api/clients/${clientId}/approvalsettings`).then((res) => {
            this.setState({
                settings: res.data,
            });
        });
    }

    checkSettings(settingName) {
        let setting = this.state.settings.filter((x) => x.name==settingName);
        if (setting.length) {
            return setting[0].value;
        }
    }

    //gets approver details dropdown based on clientId and entityType
    getApproverDetailsByClient(clientId: string, entityType: string, divId?, locId?, posId?) {
        this.setState({ showLoader: true });
        let queryParams = `entityType=${entityType}`;
        if (divId) {
            queryParams += `&divId=${divId}&locId=${locId}&posId=${posId}`;
        }
        if (this.props.wfApprovalId) {
            queryParams += `&wfApprovalId=${this.props.wfApprovalId}`;
        }
        axios.get(`api/clients/${clientId}/approverdetails?${queryParams}`).then((res) => {
            if (res.data) {
                this.setState({
                    data: { ...res.data },
                    showLoader: false,
                });
                this.originalLevels = { ...res.data };
            } else {
                this.setState({
                    data: {
                        clientId: clientId,
                        isParallel: false,
                        isOverridePriorLevel: false,
                        wfApprovalLevel: [],
                    },
                    showLoader: false,
                });
                this.originalLevels = { ...this.state.data };
            }

            this.props.handleApproversChange(this.state.data);
        });
    }

    //gets approvers dropdown based on entityId
    getApproverDetailsByEntityId(entityId: string, entityType: string, clientId: string) {
        axios.get(`api/requisitions/${entityId}/approverdetails?clientId=${clientId}&entityType=${entityType}`).then((res) => {
            if (res.data) {
                this.setState({
                    data: { ...res.data },
                    showLoader: false,
                });
                this.originalLevels = { ...res.data };
            } else {
                this.setState({
                    data: {
                        clientId: this.props.clientId,
                        // entityId: entityId,
                        isParallel: false,
                        isOverridePriorLevel: false,
                        wfApprovalLevel: [],
                    },
                    showLoader: false,
                });
                this.originalLevels = { ...this.state.data };
            }
            if (this.props.canEdit) {
                this.props.handleApproversChange(this.state.data);
            }
        });
    }

    getRoles() {
        const queryParams = `roleType eq ${AuthRoleType.Client}&$orderby=name`;
        axios.get(`api/admin/role?$filter=${queryParams}`).then((result) => {
            this.setState({ roles: result.data });
        });
    }

    getRoleApprovers = (role) => {
        if (role) {
            if(isAuthApproverRoles(role))
            {
                return this.state.approvers.filter((x) => x.role==role);
            }else if(role==globalAll){
                return this.state.approvers.filter((x) => [
                    AuthApproverRole.HR,
                    AuthApproverRole.HiringManager,
                    AuthApproverRole.ClientAdmin,
                    AuthApproverRole.ClientAdminII,
                    AuthApproverRole.Finance,
                ].indexOf(x.role)!=-1);
            }
        }
        return this.state.approvers;
    };

    handleApproverChange(e, index) {
        var deletedItem = e.target.props.value.filter((x) => !e.target.value.includes(x));
        var isDefault = false;
        if (deletedItem.length) isDefault = this.isApporverDefault(deletedItem[0].id, index);
        if (this.props.canEditDefault || !isDefault) {
            if (!e.target.value.length) {
                this.state.data.wfApprovalLevel[index - 1].approverIds = e.target._tags
                    .filter((x) => this.isApporverDefault(x.data[0].id, index)==true)
                    .map((x) => x.data[0].id)
                    .join(",");
            } else {
                this.state.data.wfApprovalLevel[index - 1].approverIds = e.target.value.map((x) => x.id).join(",");
            }
            this.props.handleApproversChange(this.state.data);
        }
        // this.setState({
        //     value: [...e.target.value]
        //  });
    }

    handleChange(event, index) {
        if (event.target.type=="radio") {
            this.state.data.wfApprovalLevel[index - 1][event.target.name.split(" ")[1]] = event.target.value=="true" ? true : false;
        } else {
            this.state.data.wfApprovalLevel[index - 1][event.target.name.split(" ")[1]] =
                event.target.type=="checkbox" ? event.target.checked : event.target.value;
        }
        //this.setState(this.state);
        this.props.handleApproversChange(this.state.data);
    }

    handleDropDownChange(event, index) {
        this.state.data.wfApprovalLevel[index - 1][event.target.component.name.split(" ")[1]] = event.target.value;
        //this.state.data.wfApprovalLevel[index - 1]["approverIds"] = "";
        this.props.handleApproversChange(this.state.data);
    }

    change = (event) => {
        if (event.target.type=="radio") {
            this.state.data[event.target.name] = event.target.value=="true" ? true : false;
        } else {
            this.state.data[event.target.name] = event.target.type=="checkbox" ? event.target.checked : event.target.value;
        }
        // this.setState(this.state);
        this.props.handleApproversChange(this.state.data);
    };

    selectionChange = (event) => {
        const data = [...this.state.data.wfApprovalLevel];
        const updateData = data.map((item) => {
            if (item.order ==event.dataItem.order) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });

        this.state.data.wfApprovalLevel = updateData;
        this.setState(this.state);
        let canRemove = this.state.data.wfApprovalLevel.filter(x => x.selected==true && x.isDefault !=true).length > 0 ? true : false;
        if (this.props.canEditDefault) {
            canRemove = true;
        }
        this.initializeHeaderCell(canRemove);
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.data.wfApprovalLevel.map((item) => {
            item.selected = checked;
            return item;
        });
        this.state.data.wfApprovalLevel = data;
        this.setState(this.state);
        let canRemove = this.state.data.wfApprovalLevel.filter(x => x.selected==true && x.isDefault !=true).length > 0 ? true : false;
        if (this.props.canEditDefault) {
            canRemove = true;
        }
        this.initializeHeaderCell(canRemove);
    };

    addNew = () => {
        let levelNo = this.generateLevelNo(this.state.data.wfApprovalLevel);
        const newDataItem: IWfApprovalLevelVm = {
            role: `All`,
            order: levelNo,
            requireAllApprovers: false,
            inEdit: true,
            isDefault: false,
            wfApprovalPendingWith: [],
        };

        this.state.data.wfApprovalLevel = [...this.state.data.wfApprovalLevel, newDataItem];
        this.props.handleApproversChange(this.state.data);
    };

    enterEdit = (dataItem) => {
        if (this.props.disableActiveLevel && dataItem.isLevelActive !=null) {
            return;
        }
        const data = this.state.data.wfApprovalLevel.map((item) => (item.order ==dataItem.order ? { ...item, inEdit: true } : item));
        this.state.data.wfApprovalLevel = data;
        this.setState({
            data: this.state.data,
            currentDataItem: dataItem,
        });
        this.props.handleApproversChange(this.state.data);
    };

    update = (dataItem) => {
        if (dataItem.approverIds && dataItem.role) {
            dataItem.role = globalAll;
            const data = [...this.state.data.wfApprovalLevel];
            const updatedItem = { ...dataItem, inEdit: undefined };
            if (!dataItem.hasOwnProperty("wfApprovalLevelId")) {
                dataItem.inEdit = false;
            }

            this.updateItem(data, updatedItem);
            this.state.data.wfApprovalLevel = data;
            // this.setState(this.state.data);
            this.props.handleApproversChange(this.state.data,true);
        }
    };

    updateItem = (data, item) => {
        let index = data.findIndex((p) => p ==item || (item.order && p.order ==item.order));
        if (index >= 0) {
            data[index] = { ...item };
        }
    };

    cancel = (dataItem) => {
        const originalItem = this.originalLevels.wfApprovalLevel.find((p) => p.wfApprovalLevelId ==dataItem.wfApprovalLevelId);
        originalItem["inEdit"] = undefined;
        const data = this.state.data.wfApprovalLevel.map((item) => (item.wfApprovalLevelId ==originalItem.wfApprovalLevelId ? originalItem : item));
        this.state.data.wfApprovalLevel = data;
        // this.setState({ data: this.state.data });
        this.props.handleApproversChange(this.state.data);
    };

    discard = (dataItem) => {
        const data = [...this.state.data.wfApprovalLevel];
        this.removeItem(data, dataItem);
        this.state.data.wfApprovalLevel = data;
        // this.setState(this.state.data);
        this.props.handleApproversChange(this.state.data);
    };

    openRemoveConfirmBox = (dataItem) => {
        if (this.props.disableActiveLevel && dataItem.isLevelActive !=null) {
            return;
        }
        this.setState({ showRemoveModal: true, currentDataItem: dataItem });
    };

    // remove only when it's not default order or canEditDefault is true
    remove = (dataItem) => {
        if (this.props.disableActiveLevel && dataItem.isLevelActive !=null) {
            return;
        }
        if (this.props.canEditDefault || !dataItem.isDefault) {
            this.setState({ showRemoveModal: false });
            const data = [...this.state.data.wfApprovalLevel];
            this.removeItem(data, dataItem);
            this.state.data.wfApprovalLevel = data;
            // this.setState(this.state.data);
            this.props.handleApproversChange(this.state.data,true);
        }

    };

    removeItem(data, item) {
        let index = data.findIndex((p) => p ==item || (item.wfApprovalLevelId && p.wfApprovalLevelId ==item.wfApprovalLevelId));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    openRemoveSelectedConfirmBox = () => {
        this.setState({ showRemoveSelectedModal: true });
    };

    removeSelected = () => {
        const selected = this.state.data.wfApprovalLevel.filter((x) => x.selected==true && (this.props.canEditDefault || x.isDefault !=true)
            && !(this.props.disableActiveLevel && x.isLevelActive !=null));
        const data = [...this.state.data.wfApprovalLevel];
        selected.forEach((element) => {
            this.removeItem(data, element);
        });
        this.state.data.wfApprovalLevel = data;
        // this.setState(this.state.data);
        this.props.handleApproversChange(this.state.data);
        this.initializeHeaderCell(false);
        this.setState({ showRemoveSelectedModal: false });
    };

    resetChanges = () => {
        const data = { ...this.originalLevels };
        this.setState({ data });
        this.initializeHeaderCell(false);
    };

    tagRender = (tagData, li, dataItem) => {
        if (!this.props.canEditDefault && dataItem.isDefault && this.isApporverDefault(tagData.data[0].id, dataItem.order)) {
            return React.cloneElement(li, li.props, [
                <span className="custom-tag" style={{ opacity: 0.7 }} key={dataItem.order}>
                    {tagData.text}
                </span>,
                [],
            ]);
        } else {
            return React.cloneElement(li, li.props, [li.props.children]);
        }
    };

    isApporverDefault = (approverId, order) => {
        const approver = this.state.data.wfApprovalLevel[order - 1].wfApprovalPendingWith.filter((x) => x.approverId==approverId);
        return approver.length && !this.props.canEditDefault && approver[0].isDefault;
    };

    itemChange = (event) => {
        const inEditID = event.dataItem.order;
        const data = this.state.data.wfApprovalLevel.map((item) => (item.order ==inEditID ? { ...item, [event.field]: event.value } : item));
        this.state.data.wfApprovalLevel = data;
        this.setState(this.state);
    };
    

    MultiSelectCell=(props)=>{
        return (
            <td contextMenu="Approvers" id="Approvers_approvalWFGrid">
                <div className="row align-items-center mx-0 Approvers_Grid">
                    <div className="col-12 col-sm-10 col-lg-11 pl-0 pr-0 pr-lg-3 mb-2 mb-sm-0">
                        <MultiSelect
                            autoClose={false}
                            disabled={!props.dataItem.inEdit}
                            data={this.getRoleApprovers(props.dataItem.role)}
                            // data={this.state.approvers}
                            value={this.itemFromValue(props.dataItem.approverIds)}
                            // value={this.state.value}
                            textField="name"
                            dataItemKey="id"
                            name={props.dataIndex + " approverIds " + this.props.entityType}
                            className="Approvers_mobile_desktop form-control"
                            onChange={(e) => this.handleApproverChange(e, props.dataIndex)}
                            onClose={this.onClose}
                            tagRender={(tagData, li) => this.tagRender(tagData, li, props.dataItem)}
                            filterable={true}
                            onFilterChange={this.filterChange}
                        />
                        

                    </div>

                    {auth.hasPermissionV2(AppPermissions.USER_CREATE) && this.props.canEdit && (
                        <Link to={'/admin/users/create'}>
                            <div className="col-12 col-sm-2 col-lg-1 pl-lg-0">
                                <span title="Add User" style={{ cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faUserPlus} className="active-icon-blue" />
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </td>
        );
    }

    render() {
        const { canEdit, canEditDefault } = this.props;
        return (
            <div className="">
                {/* {this.state.showLoader && (
                    <div className="row pl-0 pr-0">
                        <div className="col-12">
                            <div className="row justify-content-end align-items-center">
                                <div className="col-auto pr-0 mt-1 mr-3">
                                    <Skeleton width={150} height={30} />
                                    <Skeleton className={"pl-5 ml-3"} width={70} height={30} />
                                </div>
                            </div>
                            <Skeleton height={50} />
                        </div>
                    </div>
                )} */}

                <div>
                    <div className="row">
                        <div className="col-12">
                            <div className="row justify-content-end align-items-center">
                                <div className="col-12 col-sm-7 col-lg-8">
                                    <div className="row justify-content-end align-items-center">
                                        {this.checkSettings(ApprovalSettings.SEQUENTIALPARALLEL) && (
                                            <div className="col-auto pr-0">
                                                <label className="container font-weight-normal" style={{ display: "inline", paddingLeft: "25px" }}>
                                                    Sequential
                                                    <input
                                                        type="radio"
                                                        disabled
                                                        checked={!this.state.data.isParallel}
                                                        name={"isParallel" + this.props.entityType}
                                                        // onChange={(e) => this.change(e)}
                                                        value="false"
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container font-weight-normal" style={{ display: "inline", paddingLeft: "25px" }}>
                                                    Parallel
                                                    <input
                                                        type="radio"
                                                        disabled
                                                        checked={this.state.data.isParallel}
                                                        name={"isParallel" + this.props.entityType}
                                                        // onChange={(e) => this.change(e)}
                                                        value="true"
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        )}
                                        {this.checkSettings(ApprovalSettings.OVERRIDEPRIORLEVEL) && (
                                            <div className="col-auto pl-0 mt-1 mr-2">
                                                <label className="container-R d-flex">
                                                    <input
                                                        type="checkbox"
                                                        disabled
                                                        name={"isOverridePriorLevel" + this.props.entityType}
                                                        checked={this.state.data.isOverridePriorLevel}
                                                        onChange={(e) => this.change(e)}
                                                        className="mr-1"
                                                    />
                                                    <span className="text-dark ml-1 mt-1 font-weight-normal font-medium">Override Prior Level</span>
                                                    <span className="checkmark-R checkPosition_createorder"></span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="row mt-2">
                            <div className="col-12">
                                <div className="createjoborderstep4-a" id="createjoborderstep">
                                    <div className="table-responsive tableShadow global-action-grid-status-active-aaprovalgrid">
                                        <Grid
                                            className="kendo-grid-custom"
                                            style={{ height: "auto" }}
                                            data={this.state.data.wfApprovalLevel}
                                            //editField="inEdit"
                                            //onItemChange={this.itemChange}
                                            selectedField="selected"
                                            onSelectionChange={this.selectionChange}
                                            onHeaderSelectionChange={this.headerSelectionChange}
                                        >
                                            <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                            {canEdit && (
                                                <Column
                                                    field="selected"
                                                    width="50px"
                                                    sortable={false}
                                                    headerSelectionValue={
                                                        this.state.data.wfApprovalLevel && this.state.data.wfApprovalLevel.length &&
                                                        this.state.data.wfApprovalLevel.every((dataItem) => dataItem.selected ==true)
                                                    }
                                                />
                                            )}
                                            <Column
                                                width="70px"
                                                sortable={false}
                                                field="order"
                                                headerClassName="text-right"
                                                title="Order"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu="Order" className="text-right">
                                                            <span>{props.dataIndex}</span>
                                                        </td>
                                                    );
                                                }}
                                            />
                                            <Column
                                                width="180px"
                                                sortable={false}
                                                field="role"
                                                title="Filter By Roles"
                                                //editable={!this.state.currentDataItem.isDefault}
                                                cell={(props) => {
                                                    if (!this.props.canEditDefault && props.dataItem.isDefault || !props.dataItem.inEdit) {
                                                        return (
                                                            <td contextMenu="Roles">
                                                                {props.dataItem.role} {!this.props.canEditDefault && props.dataItem.isDefault && <span>*</span>}
                                                            </td>
                                                        );
                                                    } else {
                                                        return (
                                                            <td contextMenu="Roles" id="Roles_approvalWFGrid">
                                                                {/* <input
                                                                        autoFocus
                                                                        style={{ width: "50%", outline: "none" }}
                                                                        type="text"
                                                                        disabled={!props.dataItem.inEdit}
                                                                        value={props.dataItem.role}
                                                                        name={props.dataIndex + " role " + this.props.entityType}
                                                                        onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                    /> */}
                                                                <CustomDropDownList
                                                                    className="form-control"
                                                                    data={this.state.roles}
                                                                    textField="name"
                                                                    valueField="name"
                                                                    disabled={!props.dataItem.inEdit}
                                                                    name={props.dataIndex + " role " + this.props.entityType}
                                                                    value={props.dataItem.role}
                                                                    defaultItem={defaultItem}
                                                                    onChange={(e) => this.handleDropDownChange(e, props.dataIndex)}
                                                                />
                                                            </td>
                                                        );
                                                    }
                                                }}
                                            />
                                            <Column
                                                sortable={false}
                                                field="approverIds"
                                                title="Approvers"
                                                cell={this.MultiSelectCell}
                                            />
                                            <Column
                                                sortable={false}
                                                field="requireAllApprovers"
                                                title="One / All"
                                                width="150px"
                                                cell={(props) => {
                                                    const value = props.dataItem[props.field];
                                                    return (
                                                        <td contextMenu="One/All">
                                                            <div className="" style={{ display: "inline-block" }}>
                                                                <label
                                                                    className="container font-weight-normal"
                                                                    style={{
                                                                        display: "inline",
                                                                        paddingLeft: "35px",
                                                                    }}
                                                                >
                                                                    One
                                                                    <input
                                                                        type="radio"
                                                                        disabled={!this.props.canEditDefault && props.dataItem.isDefault || !props.dataItem.inEdit}
                                                                        checked={!props.dataItem.requireAllApprovers}
                                                                        name={props.dataIndex + " requireAllApprovers " + this.props.entityType}
                                                                        onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                        value="false"
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                                <label
                                                                    className="container font-weight-normal"
                                                                    style={{
                                                                        display: "inline",
                                                                        paddingLeft: "35px",
                                                                    }}
                                                                >
                                                                    All
                                                                    <input
                                                                        type="radio"
                                                                        disabled={!this.props.canEditDefault && props.dataItem.isDefault || !props.dataItem.inEdit}
                                                                        checked={props.dataItem.requireAllApprovers}
                                                                        name={props.dataIndex + " requireAllApprovers " + this.props.entityType}
                                                                        onChange={(e) => this.handleChange(e, props.dataIndex)}
                                                                        value="true"
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        </td>
                                                    );
                                                }}
                                            />
                                            {canEdit && (
                                                <Column
                                                    sortable={false}
                                                    cell={this.CommandCell}
                                                    width="60px"
                                                    headerClassName="status-active"
                                                    title="Action"
                                                    headerCell={this.CustomHeaderActionCellTemplate}
                                                />
                                            )}
                                        </Grid>
                                    </div>
                                    <ConfirmationModal
                                        message={"Are you sure you want to remove this level?"}
                                        showModal={this.state.showRemoveModal}
                                        handleYes={() => this.remove(this.state.currentDataItem)}
                                        handleNo={() => {
                                            this.setState({ showRemoveModal: false });
                                        }}
                                    />
                                    <ConfirmationModal
                                        message={"Are you sure you want to remove the selected level(s)?"}
                                        showModal={this.state.showRemoveSelectedModal}
                                        handleYes={() => this.removeSelected()}
                                        handleNo={() => {
                                            this.setState({ showRemoveSelectedModal: false });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    generateLevelNo = (data) => data.reduce((acc, current) => Math.max(acc, current.order), 0) + 1;

    itemFromValue(value) {
        const { originalApprovers = [] } = this.state;
       

        if (isPresent && value !=undefined) {
            const values = value.split(",");
            const filteredValues = originalApprovers.filter((el) => {
                return values.some((f) => {
                    return f ==el.id;
                    
                });
            });
          
            return filteredValues;
        } 
        else {
            return [];
        }
        
    }
    onClose=(e)=>{
        e.target.state.text = '';
        const { permission, clientId } = this.props;
        this.getApprovers(clientId, permission);
       
    }
}

export default ApprovalsWFGrid;
