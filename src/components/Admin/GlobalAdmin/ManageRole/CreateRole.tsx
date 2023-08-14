import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import axios from "axios";
import { errorToastr, successToastr, updateFilteredArray } from "../../../../HelperMethods";
import { Form, Formik } from "formik";
import { roleValidation } from "./validations/validation";
import { ErrorComponent, KendoFilter } from "../../../ReusableComponents";
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from "@progress/kendo-react-listbox";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { AuthRoleType } from "../../../Shared/AppConstants";
import withValueField from "../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { history } from "../../../../HelperMethods";
import clientAdminService from "../Service/DataService";
import Skeleton from "react-loading-skeleton";
import { CREATE_ROLE_CONFIRMATION_MSG, DELETE_ROLE_CONFIRMATION_MSG, UPDATE_ROLE_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { MANAGE_ROLE_PERMISSIONS } from "../../../Shared/ApiUrls";
import PermissionSearch from "./Common/PermissionSearch";
import { CompositeFilterDescriptor, toODataString } from "@progress/kendo-data-query";
import Collapsible from "react-collapsible";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";
import auth from "./../../../Auth";

const defaultItem = { name: "Select..", id: null };
const CustomDropDownList = withValueField(DropDownList);

export interface CreateRoleProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateRoleState {
    roleId?: string;
    name: string;
    description: string;
    submitted: boolean;
    allPermissions: any;
    selectedPermissions: any;
    draggedItem: {};
    permissionId: any;
    showDeleteModal?: boolean;
    roles: Array<any>;
    originalroles: Array<any>;
    roleTypeId?: number;
    roleTypes: any;
    userDetails?: any;
    showLoader?: boolean;
    showCreateRoleConfirmationModal?: boolean;
    showDeleteRoleConfirmationModal?: boolean;
    showUpdateRoleConfirmationModal?: boolean;
    dataState?: any;
    originalSelectedPermissions?: any;
    toggelFirst: boolean;
    toggelSecond: boolean;
}

const SELECTED_FIELD = 'selected';

class CreateRole extends React.Component<CreateRoleProps, CreateRoleState> {
    public dataItem: any;
    public selectedPermissionIds: any;

    constructor(props: CreateRoleProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            name: "",
            description: "",
            submitted: false,
            allPermissions: [],
            selectedPermissions: [],
            roleId: id,
            draggedItem: {},
            permissionId: [],
            roleTypes:  [],
            roles: [],
            originalroles: [],
            userDetails: auth.getUser(),
            showLoader: true,
            dataState: {
                skip: 0,
                take: null
            },
            originalSelectedPermissions: [],
            toggelFirst: true,
            toggelSecond: true,
        };

    }
    lastSelectedIndex;

    componentDidMount() {

        const { id } = this.props.match.params;
        this.getRoleTypes();
        this.getAllPermissions(id, this.state.dataState);
    }

    getRoleTypes= () => {
        let roleTypes = [{ name: "System Admin", id: AuthRoleType.SystemAdmin }, { name: "Client", id: AuthRoleType.Client }, { name: "Vendor", id: AuthRoleType.Vendor }, { name: "Provider", id: AuthRoleType.Provider }];

        if(this.state.userDetails.roleType== AuthRoleType.SuperAdmin){
            roleTypes = [{ name: "Super Admin", id: AuthRoleType.SuperAdmin }, { name: "System Admin", id: AuthRoleType.SystemAdmin }, { name: "Client", id: AuthRoleType.Client }, { name: "Vendor", id: AuthRoleType.Vendor }, { name: "Provider", id: AuthRoleType.Provider }];
        }
        this.setState({ roleTypes: roleTypes });
    }

    openNew = () => {
        this.props.onOpenModal();
    };


    handleSave = () => {
        // this.setState({ submitted: true, showCreateRoleConfirmationModal: false, showUpdateRoleConfirmationModal: false })
        let data = {
            roleName: this.state.name,
            description: this.state.description,
            permissionIds: this.state.originalSelectedPermissions.map(x => x.permissionId),
            roleType: this.state.roleTypeId
        };

        if (this.state.roleId==undefined) {
            if ((this.state.name !=undefined && this.state.name !=null && this.state.name !="") && (this.state.description !=undefined && this.state.description !=null && this.state.description !="") && (this.state.roleTypeId !=undefined && this.state.roleTypeId !=null)) {

                axios.post(`api/admin/role`, JSON.stringify(data)).then((res) => {
                    successToastr("Role added successfully");
                    history.push(MANAGE_ROLE_PERMISSIONS);
                });
            }
        } else {
            data['roleId'] = this.state.roleId;
            axios.put(`api/admin/role/${this.state.roleId}`, JSON.stringify(data)).then((res) => {
                if (res.data.isSuccess) {
                    successToastr(res.data.statusMessage);
                    history.push(MANAGE_ROLE_PERMISSIONS);
                } else {
                    errorToastr(res.data.statusMessage);
                }
            });
        }
    }

    handleItemClick = (event) => {
        this.setState({
            allPermissions: (this.state.allPermissions.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
            selectedPermissions: (this.state.selectedPermissions.map(item => {
                console.log(event.dataItem.name, item)
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item
            })),
        });
    }

    handleDragStart = (e) => {
        this.setState({
            draggedItem: e.dataItem,
        });
    }

    handleDrop = (e) => {
        let result = processListBoxDragAndDrop(this.state.allPermissions, this.state.selectedPermissions, this.state.draggedItem, e.dataItem, 'role');
        this.setState({
            allPermissions: result.listBoxOneData,
            selectedPermissions: result.listBoxTwoData
        });
    }

    handleToolBarClick = (e) => {
        let result = processListBoxData(this.state.allPermissions, this.state.selectedPermissions, e.toolName, SELECTED_FIELD);
        this.setState({
            allPermissions: result.listBoxOneData,
            selectedPermissions: result.listBoxTwoData,
            originalSelectedPermissions: result.listBoxTwoData
        });
        this.selectedPermissionIds = result.listBoxTwoData.map(x => x.permissionId);
    }

    getAllPermissions = (id, dataState, categoryId?) => {
        var queryParams = `recordstatus eq 1`;
        var queryStr = `${toODataString(dataState)}`;

        if (categoryId) {
            queryParams += `and permissionCategoryId eq ${categoryId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        axios.get(`api/tags/permissions?${finalQueryString}`)
            .then(async res => {
                var data = []
                if (this.selectedPermissionIds && this.selectedPermissionIds.length) {
                    data = res.data.filter(x => !this.selectedPermissionIds.includes(x.permissionId));
                } else {
                    data = res.data;
                }
                this.setState({
                    allPermissions: data,
                    showLoader: false
                }, () => {
                    if (id) {
                        this.getRoleDetails(id);
                    }
                });
            });
    }

    getRoleDetails = (id) => {
        clientAdminService.getRoleDetails(id).then((res) => {
            const { data } = res;
            this.selectedPermissionIds = data.permissionIds.map(x => x.permissionId)

            this.setState({
                name: data.name,
                description: data.description,
                roleTypeId: data.roleType,
                showLoader: false,
                selectedPermissions: data.permissionIds,
                originalSelectedPermissions: data.permissionIds,
                allPermissions: this.state.allPermissions.filter(x => !this.selectedPermissionIds.includes(x.permissionId))
            })
        });
    }



    handleDelete = () => {
        this.setState({ showDeleteRoleConfirmationModal: false });
        axios.delete(`/api/admin/role/${this.state.roleId}`).then((res) => {
            successToastr("Role deleted successfully");
            history.push(MANAGE_ROLE_PERMISSIONS);
        });
    };

    getRole = () => {
        axios.get(`api/admin/role`)
            .then(async res => {
                this.setState({ roles: res.data, originalroles: res.data });
            });
    }

    onHandleChange = (e, field) => {
        let change = {}
        change[field] = e.target.value;
        this.setState(change);
    }

    onSearch = (selectedOption, filteredArray, searchString) => {
        this.handleSearchFunction(filteredArray, selectedOption, searchString);
    }

    handleSearchFunction = (filteredArray, selectedOption, searchString) => {
        filteredArray = updateFilteredArray(filteredArray);
        var dataState = {}
        var categoryId = "";

        if (searchString=="" || searchString==null) {
            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: null,
            };
        } else {
            var filterObj: CompositeFilterDescriptor = {
                logic: "and",
                filters: filteredArray,
            };
            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: filterObj,
            };
        }

        categoryId = selectedOption.id;

        this.getAllPermissions(undefined, dataState, categoryId);
    }

    onClientSearch = (selectedOption, filteredArray, searchString) => {
        var data = this.state.originalSelectedPermissions;
        if (searchString !=undefined && (searchString !="" || searchString !=null)) {

            if (selectedOption && selectedOption.id) {
                data = data.filter(x => x.permissionCategoryId==selectedOption.id);
            }
            data = data.filter(x => x.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
            this.setState({ selectedPermissions: data })
        } else {
            if (selectedOption && selectedOption.id) {
                data = data.filter(x => x.permissionCategoryId==selectedOption.id);
            }
            this.setState({ selectedPermissions: data })
        }
        // this.selectedPermissionIds = data.map(x => x.permissionId)
    }

    render() {
        const {
            toggelFirst,
            toggelSecond,
        } = this.state;
        const RoleTriggerName = (
            <span>
                Role
            </span>
        );
        const RolePermission = (
            <span>
                Permission
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
                            <div className="row mx-0 align-items-center">
                                <div>
                                    {/* {this.state.roleId != undefined ? "Edit Role" : "Add New Role"} */}
                                    <BreadCrumbs globalData={{rolePermissionsId:this.state.roleId}}></BreadCrumbs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 ml-0 mr-0">
                    <Formik
                        validateOnMount={this.state.submitted}
                        initialValues={this.state}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={roleValidation}
                        validateOnBlur={false}
                        onSubmit={(fields) => this.handleSave()}
                        render={(formikProps) => (
                            <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                                {this.state.showLoader &&
                                    Array.from({ length: 1 }).map((item, i) => (
                                        <div className="row mx-auto mt-2" key={i}>
                                            {Array.from({ length: 3 }).map((item, j) => (
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                                    <Skeleton width={100} />
                                                    <Skeleton height={30} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                {!this.state.showLoader &&
                                    <div className="row mt-2">
                                        <div className="col-12 px-0 mt-2 ml-0 mr-0">
                                            <Collapsible
                                                trigger={RoleTriggerName}
                                                open={toggelFirst}
                                                accordionPosition="1"
                                                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                                onTriggerClosing={() => this.setState({ toggelFirst: false })}
                                            >
                                                <div className="col-12 px-0">
                                                    <div className="row mt-0 mx-0 map-job-catalog">
                                                        <div className="col-sm mr-5 px-sm-0">
                                                            <label className="mb-1 font-weight-bold required">User Type</label>
                                                            <CustomDropDownList
                                                                className={"form-control disabled "}
                                                                data={this.state.roleTypes}
                                                                textField="name"
                                                                valueField="id"
                                                                name="roleTypeId"
                                                                id="roleType"
                                                                defaultItem={defaultItem}
                                                                value={this.state.roleTypeId}
                                                                onChange={(e) => this.onHandleChange(e, "roleTypeId")}
                                                            />
                                                            {this.state.submitted && (this.state.roleTypeId==undefined || this.state.roleTypeId==null) && <ErrorComponent />}

                                                        </div>
                                                        <div className="col-sm mr-5 px-sm-0">
                                                            <label className="mb-1 font-weight-bold required">Role Name</label>
                                                            <input
                                                                type="text"
                                                                id="role"
                                                                name="name"
                                                                className="form-control "
                                                                placeholder="Enter Role"
                                                                value={this.state.name}
                                                                maxLength={100}
                                                                onChange={(e) => {
                                                                    this.onHandleChange(e, "name");
                                                                }}
                                                            />
                                                            {this.state.submitted && (this.state.name==undefined || this.state.name==null || this.state.name=="") && <ErrorComponent />}
                                                        </div>

                                                        <div className=" col-sm px-sm-0">
                                                            <label className="mb-1 font-weight-bold required">Description</label>
                                                            <textarea
                                                                rows={1}
                                                                id="description"
                                                                name="description"
                                                                value={this.state.description}
                                                                className="form-control"
                                                                placeholder="Enter Description"
                                                                maxLength={200}
                                                                onChange={(e) => {
                                                                    this.onHandleChange(e, "description");
                                                                }}
                                                            />
                                                            {this.state.submitted && (this.state.description==undefined || this.state.description==null || this.state.description=="") && <ErrorComponent />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Collapsible>
                                        </div>
                                    </div>
                                }
                                <div className="row">
                                    <div className="col-12 px-0 ml-0 mr-0">
                                        <Collapsible
                                            trigger={RolePermission}
                                            open={toggelSecond}
                                            accordionPosition="1"
                                            onTriggerOpening={() => this.setState({ toggelSecond: true })}
                                            onTriggerClosing={() => this.setState({ toggelSecond: false })}
                                        >
                                            <div className="col-12 px-0">
                                                <div className="row mt-0 mx-0 map-job-catalog">
                                                    <div className='col col-sm px-sm-0 shadow-sm'>
                                                        <PermissionSearch
                                                            onSearch={this.onSearch}
                                                            placeholder={"Search text here!"}
                                                            entityType={"CreateRole"}
                                                        />
                                                        <div className="col-12 bg-blue mt-3">
                                                            <label className="mb-0 text-white">Permissions</label>
                                                        </div>
                                                        <ListBox
                                                            style={{ height: 250, width: '100%', overflow: "auto" }}
                                                            data={this.state.allPermissions}
                                                            textField="name"
                                                            selectedField={SELECTED_FIELD}
                                                            onItemClick={(e) => this.handleItemClick(e)}
                                                            onDragStart={this.handleDragStart}
                                                            onDrop={this.handleDrop}
                                                        />
                                                    </div>

                                                    <div className="d-flex align-items-center listboxicon col-auto">
                                                        <ListBoxToolbar
                                                            tools={['transferTo', 'transferFrom']}
                                                            data={this.state.allPermissions}
                                                            dataConnected={this.state.selectedPermissions}
                                                            onToolClick={this.handleToolBarClick}
                                                        />
                                                    </div>

                                                    <div className='col col-sm px-sm-0 shadow-sm'>
                                                        <PermissionSearch
                                                            onSearch={this.onClientSearch}
                                                            //handleSearch={this.getRole}
                                                            placeholder={"Search text here!"}
                                                            entityType={"CreateRole"}
                                                        />
                                                        <div className="col-12 bg-blue mt-3">
                                                            <label className="mb-0 text-white">Selected Permissions</label>
                                                        </div>
                                                        <ListBox
                                                            style={{ height: 250, width: '100%', overflow: "auto" }}
                                                            data={this.state.selectedPermissions}
                                                            textField="name"
                                                            selectedField={SELECTED_FIELD}
                                                            onItemClick={(e) => this.handleItemClick(e)}
                                                            onDragStart={this.handleDragStart}
                                                            onDrop={this.handleDrop}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Collapsible>
                                    </div>
                                </div>

                                <div className="modal-footer justify-content-center border-0 mt-2">
                                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                        </button>
                                        {this.state.roleId != undefined
                                            ?
                                            <div>
                                                <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update Role
                                                </button>
                                                <button type="button" className="btn button button-reject mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ showDeleteRoleConfirmationModal: true })}>
                                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Delete
                                                </button>
                                            </div>
                                            : <div>
                                                <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })} disabled={this.state.selectedPermissions.length > 0 ? false : true}>
                                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                                </button>
                                            </div>}
                                    </div>
                                </div>
                            </Form>
                        )}
                    />

                    {/* <ConfirmationModal
                    message={CREATE_ROLE_CONFIRMATION_MSG(this.state.name)}
                    showModal={this.state.showCreateRoleConfirmationModal}
                    handleYes={() => this.handleSave()}
                    handleNo={() => {
                        this.setState({ showCreateRoleConfirmationModal: false });
                    }}
                /> */}

                    {this.state.showDeleteRoleConfirmationModal &&
                        <ConfirmationModal
                            message={DELETE_ROLE_CONFIRMATION_MSG(this.state.name)}
                            showModal={this.state.showDeleteRoleConfirmationModal}
                            handleYes={() => this.handleDelete()}
                            handleNo={() => {
                                this.setState({ showDeleteRoleConfirmationModal: false });
                            }}
                        />
                    }

                    {/* <ConfirmationModal
                    message={UPDATE_ROLE_CONFIRMATION_MSG(this.state.name)}
                    showModal={this.state.showUpdateRoleConfirmationModal}
                    handleYes={() => this.handleSave()}
                    handleNo={() => {
                        this.setState({ showUpdateRoleConfirmationModal: false });
                    }}
                /> */}

                </div>
            </div >

        );
    }
}
export default CreateRole;