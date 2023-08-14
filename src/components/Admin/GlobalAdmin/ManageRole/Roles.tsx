import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord} from "../../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../Shared/Workflow/RowActions";
import { CustomMenu, DefaultActions } from "./GlobaActions";
import { State, toODataString } from "@progress/kendo-data-query";
import UpsertRole from "./CreateRole";
import { Dialog } from "@progress/kendo-react-dialogs";
import { initialDataState, successToastr } from "../../../../HelperMethods";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CREATE_ROLES } from "../../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import CreateRole from "./CreateRole";
import { COPY_ROLE_CONFIRMATION_MSG, DELETE_ROLE_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";
import { AuthRoleType } from "../../../Shared/AppConstants";
import { KendoFilter } from "../../../ReusableComponents";

export interface ManageRoleProps {
}

export interface ManageRoleState {
    role: any;
    totalRole?: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewRoleModal?: any;
    showEditModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any;
    showCopyModal?: any;
    roleName?: any;
    roleNameError?: any;
    roleType?: any;
}

class ManageRole extends React.Component<ManageRoleProps, ManageRoleState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public dataItem: any;
    constructor(props: ManageRoleProps) {
        super(props);
        this.state = {
            role: [],
            roleType: this.userObj.roleType,
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true
        };
    }

    componentDidMount() {
        this.getRole(this.state.dataState)
    }

    getRole = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;
        var finalQueryString = `${queryStr}`
        if (this.state.roleType !=AuthRoleType.SuperAdmin) {
            let queryParams = `roleType ne ${AuthRoleType.SuperAdmin}`;
            finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        }

        axios.get(`api/admin/role?${finalQueryString}`).then((res) => {
            this.setState({
                role: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getRoleCount(dataState);
        });
    }

    getRoleCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        var finalQueryString = `${queryStr}`
        if (this.state.roleType !=AuthRoleType.SuperAdmin) {
            let queryParams = `roleType ne ${AuthRoleType.SuperAdmin}`;
            finalQueryString = KendoFilter(finalState, queryStr, queryParams);
        }

        axios.get(`api/admin/role?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalRole: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getRole(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        if (property=='showCopyModal'){
            change['roleName'] = `Copy of ${dataItem.name}`;
        }
        this.setState(change);
        this.dataItem = dataItem;
    }

    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewRoleModal: true })
    }

    handleCopy = (id) => {
        if (id !=undefined && this.state.roleName !=""){
            const data = {
                roleId: id,
                roleName: this.state.roleName
            }

            axios.post(`api/admin/role/duplicate`, JSON.stringify(data)).then((res) => {
                successToastr("Role copied successfully");
                this.setState({showLoader: true, showCopyModal: false});
                this.getRole(this.state.dataState)
            });
        }
    }

    handleDelete = (id) => {
        this.setState({ showDeleteModal: false });
        axios.delete(`/api/admin/role/${id}`).then((res) => {
            successToastr("Role deleted successfully");
            this.getRole(this.state.dataState);
        });
    }

    handleRoleName = (e) => {
        this.setState({ roleName: e.target.value, roleNameError: e.target.value=="" })
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            <Link to={CREATE_ROLES}>
                                <span className="float-right text-dark">
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                    Add New Role
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getRole}
                        entityType={"ManageRole"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="ManageRole"
                    />
                    <div className="myRoleContainer">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.role}
                            {...this.state.dataState}
                            //detail={ViewMoreComponent}
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>  
                            
                            <GridColumn
                                field="role"
                                width="330px"
                                title="Role"
                                cell={(props) => CellRender(props, "Role")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="description"
                                width="490px"
                                title="Role Description"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Description")}
                                filter="text"
                            />
                            <GridColumn
                                field="roleTypeName"
                                width="330px"
                                title="User Type"
                                cell={(props) =>CellRender(props, "User Type")}
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
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalRole, this.AddNewModal)}
                            />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={DELETE_ROLE_CONFIRMATION_MSG(this.dataItem && this.dataItem.name)}
                    showModal={this.state.showDeleteModal}
                    handleYes={() => this.handleDelete(this.dataItem && this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showDeleteModal: false });
                    }}
                />

                <ConfirmationModal
                    message={COPY_ROLE_CONFIRMATION_MSG(this.dataItem && this.dataItem.name)}
                    showModal={this.state.showCopyModal}
                    txtName="Role Name"
                    commentsRequired
                    roleName={this.state.roleName}
                    commentsChange={this.handleRoleName}
                    handleYes={() => this.handleCopy(this.dataItem && this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showCopyModal: false });
                    }}
                    showError={this.state.roleNameError}
                />
            </div>
        );
    }
}

export default ManageRole;