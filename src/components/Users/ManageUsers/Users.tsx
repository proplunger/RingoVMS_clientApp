import * as React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, ManageCandidateStatusCell, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import RowActions from "../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../HelperMethods";
import { hideLoader, KendoFilter, NumberCell, PhoneNumberCell, showLoader } from "../../ReusableComponents";
import { CREATE_USERS } from "../../Shared/ApiUrls";
import { AuthRoleType, RecordStatus } from "../../Shared/AppConstants";
import userService from "../DataService";
import { USER_AUTO_REGISTER_CONFIRMATION_MSG, USER_AUTO_REGISTER_SUCCESS_MSG } from "../../Shared/AppMessages";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface UsersProps {
    match: any;
}

export interface UsersState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalUser?: any;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showResetModal?: boolean;
    showDeactivateModal?: boolean;
    showActivateModal?: boolean;
    showDeleteModal?: boolean;
    showInviteUserModal?: boolean;
    showAutoRegisterUserModal?: boolean;
    dataState: any;
    roleId?: any;
}

class Users extends React.Component<UsersProps, UsersState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public userId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: UsersProps) {
        super(props);
        const { roleId } = this.props.match.params;
        this.state = {
            data: [],
            roleId: roleId,
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount() {
    }

    // getUsers = (dataState) => {
    //     var queryStr = `${toODataString(dataState)}`;
    //     userService.getUsers(queryStr).then((res) => {
    //         this.setState({
    //             data: res.data,
    //             showLoader: false,
    //             dataState: dataState,
    //             onFirstLoad: false,
    //         });
    //         this.getUserCount(dataState);
    //     });
    // }

    getUsers = (dataState) => {
        var roleType = this.userObj.roleType;
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var finalQueryString = `${queryStr}`   
        if(this.state.roleId){
            if(roleType !=AuthRoleType.SuperAdmin)
             {
                let queryParams = `roleId eq ${this.state.roleId} and roleType ne ${AuthRoleType.SuperAdmin}`;
                finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
             }else{
                let queryParams = `roleId eq ${this.state.roleId}`;
                finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
             }
        }else if (roleType !=AuthRoleType.SuperAdmin)
        {
            let queryParams = `roleType ne ${AuthRoleType.SuperAdmin}`;
            finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
        }
        
        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };
        
        var url = `api/users/$query`;

        axios.post(`${url}`, (`${finalQueryString}&$orderby=modifiedDate desc`), config).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
                onFirstLoad: false,
            });
            this.getUserCount(dataState);
        });
    };

    getUserCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var roleType = this.userObj.roleType;
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var finalQueryString = `${queryStr}`

        if(this.state.roleId){
            if(roleType !=AuthRoleType.SuperAdmin)
             {
                 let queryParams = `roleId eq ${this.state.roleId} and roleType ne ${AuthRoleType.SuperAdmin}`;
                 finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
             }else{
                 let queryParams = `roleId eq ${this.state.roleId}`;
                 finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
             }
         }else if (roleType !=AuthRoleType.SuperAdmin)
         {
             let queryParams = `roleType ne ${AuthRoleType.SuperAdmin}`;
             finalQueryString = KendoFilter(dataState, queryStr, queryParams); 
         }
        // var queryStr = `${toODataString(finalState)}`;

        // userService.getUsers(queryStr).then((res) => {
        //     this.setState({
        //         totalCount: res.data.length,
        //         totalUser: res.data,
        //     });
        // });

        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };
        
        var url = `api/users/$query`;

        axios.post(`${url}`, (`${finalQueryString}&$orderby=modifiedDate desc`), config).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalUser: res.data,
            });
        });
    };

    deleteUser = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false, showDeactivateModal: false, showActivateModal: false });
        userService.deleteUser(id, statusId).then((res) => {
            successToastr(msg);
            this.getUsers(this.state.dataState);
        });
    };

    resetUser = (id) => {
        let url = id==null ? `/api/accounts/tnc/reset` : `/api/accounts/tnc/reset?id=${id}`
        this.setState({ showResetModal: false });
        axios.put(url).then((res) => {
            if (id) {
                successToastr("User terms & conditions reset successfully!");
            } else {
                successToastr("All Users terms & conditions reset successfully!");
            }
            this.getUsers(this.state.dataState);
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getUsers(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        if (action=="Reset Terms & Conditions") {
            property = `showResetModal`
        }
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    inviteCandidate = (id) => {
        this.setState({ showInviteUserModal: false });
        showLoader();
        axios.get(`/api/accounts/invite/${id}`)
            .then(res => {
                hideLoader();
                this.getUsers(this.state.dataState);
                successToastr("Invitation Sent");
            });
    }

    autoRegisterUser = (dataItem) => {
        this.setState({ showAutoRegisterUserModal: false });
        let data = {
            userId: dataItem.userId,
            userType: dataItem.roleType,
            candidateId: dataItem.candidateId,
            vendorId: dataItem.vendorId,
            clientIds: dataItem.clientIds
        };
        showLoader();
        axios.put(`/api/users/${dataItem.userId}/autoregister`, JSON.stringify(data)).then((res) => {
                hideLoader();
                successToastr(USER_AUTO_REGISTER_SUCCESS_MSG);
                this.getUsers(this.state.dataState);
        });
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs globalData={{rolePermissionsId:this.state.roleId}}></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            <Link to={CREATE_USERS}>
                                <span className="float-right text-dark">
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                    Add New User
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageUser"
                        entityType={"User"}
                        placeholder="Search text here!"
                        handleSearch={this.getUsers}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageUserContainer global-action-grid">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="lastName"
                                title="Last Name"
                                cell={(props) => CellRender(props, "Last Name")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="firstName"
                                title="First Name"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "First Name")}
                                filter="text"
                            />
                            <GridColumn
                                field="userName"
                                title="Username"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Username")}
                                filter="text"
                            />
                            <GridColumn
                                field="role"
                                title="Role"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Role")}
                            />
                            <GridColumn
                                field="contactNum1"
                                title="Mobile Number"
                                sortable={false}
                                filterable={false}
                                cell={(props) => PhoneNumberCell(props, "Mobile Number")}
                            />
                            <GridColumn
                                field="email"
                                title="Email"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Email")}
                            />
                            <GridColumn
                                field="registrationStatus"
                                title="Registration Status"
                                columnMenu={ColumnMenu}
                                //cell={StatusCell}
                                cell={(props) => CellRender(props, "Registration Status")}
                            />
                            <GridColumn
                                field="status"
                                title="Account Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.userId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalUser, () => this.setState({ showResetModal: true }))}
                            />
                            <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={USER_AUTO_REGISTER_CONFIRMATION_MSG()}
                    showModal={this.state.showAutoRegisterUserModal}
                    handleYes={() => this.autoRegisterUser(this.dataItem)}
                    handleNo={() => {
                        this.setState({ showAutoRegisterUserModal: false });
                    }}
                />

                <ConfirmationModal
                    message={"Are you sure you want to invite user?"}
                    showModal={this.state.showInviteUserModal}
                    handleYes={() => this.inviteCandidate(this.dataItem.userId)}
                    handleNo={() => {
                        this.setState({ showInviteUserModal: false });
                    }}
                />

                <ConfirmationModal
                    message={this.dataItem ? "Are you sure you want to reset terms & conditions for this user?" : "Are you sure you want to reset terms & conditions for all users?"}
                    showModal={this.state.showResetModal}
                    handleYes={() => this.resetUser(this.dataItem ? this.dataItem.userId : null)}
                    handleNo={() => {
                        this.setState({ showResetModal: false });
                    }}
                />

                <ConfirmationModal
                    message={"Are you sure you want to remove this user?"}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteUser(this.dataItem.userId, RecordStatus.DELETE, "User deleted successfully")}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={"Are you sure you want to activate this user?"}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteUser(this.dataItem.userId, RecordStatus.ACTIVE, "User actived successfully")}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={"Are you sure you want to deactivate this user?"}
                    showModal={this.state.showDeactivateModal}
                    handleYes={() => this.deleteUser(this.dataItem.userId, RecordStatus.INACTIVE, "User deactivated successfully")}
                    handleNo={() => {
                        this.setState({ showDeactivateModal: false });
                    }}
                />

            </div>
        );
    }
}
export default Users;

