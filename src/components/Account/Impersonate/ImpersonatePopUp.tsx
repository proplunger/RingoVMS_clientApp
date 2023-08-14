import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent, showLoader } from "../../ReusableComponents";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import { ComboBoxChangeEvent, ComboBoxPageChangeEvent, ListItemProps, MultiColumnComboBox, MultiSelect } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { filterBy } from "@progress/kendo-data-query";
import Axios from "axios";
import { AuthRole, AuthRoleType, RegistrationStatus } from "../../Shared/AppConstants";

const columns = [
    { field: 'fullName', header: <span ><strong>Name</strong></span>, width: '214px', height: '36px' },
    { field: 'role', header: <span><strong>Role</strong></span>, width: '214px', height: '36px' }
];
const pageSize = 10;
// const defaultItem = { fullName: "Select User", userId: null };

export interface ImpersonateModalProps {
    onCloseModal: any;
    onOpenModal: any;
}

export interface ImpersonateModalState {
    users: Array<IDropDownModel>;
    originalusers: Array<IDropDownModel>;
    userId?: any;
    comments?: string;
    showError?: boolean;
    showLoader?: boolean;
    userInfo: any;
    virtualData?: any;
    skip?: any;
    filteredData?: any;
    total: number;
    roles: any;
    selectedRoles: any;
    clientId?: string;
    roleName?: any;
}

export class ImpersonatePopUp extends React.Component<ImpersonateModalProps, ImpersonateModalState> {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            originalusers: [],
            userId: null,
            showError: false,
            showLoader: true,
            comments: "",
            userInfo: JSON.parse(localStorage.getItem("user")),
            virtualData: [],
            skip: 0,
            filteredData: [],
            total: 0,
            roles:[],
            selectedRoles:[],
            clientId: auth.getClient(),
        };
    }

    componentDidMount() {
        this.getRole();
    }

    onPageChange = (event: ComboBoxPageChangeEvent) => {
        const skip = event.page.skip;
        const take = event.page.take;
        const newVirtualData = this.state.filteredData.slice(skip, skip + take);
        this.setState({
            virtualData: newVirtualData,
            skip: skip
        });
    }

    getUsers(roleIds?) {
        let queryParams = `roleType ne ${AuthRoleType.SuperAdmin} and role ne '${AuthRole.MSP}' and fullName ne '${this.state.userInfo.userFullName}' and status eq 'Active' and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))&$orderby=username`;
        if (roleIds !=null && roleIds !=undefined) {
            queryParams = `(roleType ne ${AuthRoleType.SuperAdmin} and role ne '${AuthRole.MSP}' and fullName ne '${this.state.userInfo.userFullName}' and status eq 'Active' and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))) and roleId in (${roleIds})&$orderby=username`;
        }
        axios.get(`api/users/associatedclients?$filter=${queryParams}`)
            .then(async res => {
                this.setState({
                    users: res.data,
                    virtualData: res.data.slice(0, pageSize),
                    filteredData: res.data.slice(),
                    total: res.data.length,
                    originalusers: res.data,
                    showLoader: false
                });
            });
    }

    handleUserChange = (e) => {
        const Id = e.target.value;
        this.setState({ userId: Id });
    };

    itemRender = (li: React.ReactElement<HTMLLIElement, string | React.JSXElementConstructor<any>>, itemProps: ListItemProps) => {
        const children = columns.map((col, i) => {
            return (
                <>
                    <span title={`${itemProps.dataItem.userName} | ${itemProps.dataItem.role} | ${itemProps.dataItem.email}`}
                        className="k-table-td" style={{ width: col.width, height: col.height, borderRight: "1px solid rgba(0,0,0,.1)", }} key={col.width + i} >
                        <div style={{ padding: "8px 8px" }}>{itemProps.dataItem[col.field]} </div>
                    </span>
                </>
            )
        });
        return React.cloneElement(li, li.props, children);
    }

    handleCommentChange = (e) => {
        this.setState({ comments: e.target.value });
    };

    handleFilterChange = (event) => {
        let value = event.filter.value;
        var filters = [event.filter];
        var additionalFilters = [{ field: 'email', ignoreCase: true, operator: 'contains', value: value },
        { field: 'role', ignoreCase: true, operator: 'contains', value: value }, { field: 'fullName', ignoreCase: true, operator: 'contains', value: value }
        ]
        filters.push(...additionalFilters);
        var finalFilter = { logic: 'or', filters: filters };
        var name = event.target.props.id;
        var originalArray = "original" + name;
        (this.state.filteredData as any) = this.filterData(finalFilter, originalArray)
        const data = this.state.filteredData.slice(0, pageSize);
        this.setState({
            virtualData: data,
            skip: 0,
            total: this.state.filteredData.length
        });
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    public onImpersonate(toUserId, comment) {
       // debugger;
        //  "c2ead77b-b7e0-46f4-afdc-58b14ad8ba85","4d7ede71-f279-4608-b3f5-2d9991568aad"
        //debugger;
        const data = {
            fromUserId: this.state.userInfo.userId,
            fromUser: this.state.userInfo.userFullName,
            toUserId: toUserId.userId,
            comment: comment
        };
        Axios.post("api/accounts/internal/user/impersonate", JSON.stringify(data), {
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + this.state.userInfo.token,
            },
        }).then((res) => {
            showLoader();
            if (res.data) {
                let userInfo = res.data;
                auth.setUserContext(userInfo);
                window.location.href = '/';
            }
        });
    }

    getRole = () => {
        axios.get(`api/admin/role?$filter=role ne '${AuthRole.MSP}' and roleType ne ${AuthRoleType.SuperAdmin} and roleType ne ${AuthRoleType.SystemAdmin}`)
            .then(async res => {
                this.setState({ 
                    roles: res.data,
                    selectedRoles:res.data.filter(i => i.role !=AuthRole.Staff_1)
                });
                let selected = res.data.filter(i => i.role !=AuthRole.Staff_1).map(x => x.id);
                this.getUsers(selected);
            });
    }

    handleRolesChange = (e) => {
        this.setState({ selectedRoles: e.value.filter(
            (x) => x.id !=undefined && x.id !=null
          )});

        var roles = e.value.filter(
            (x) => x.id !=undefined && x.id !=null
          );
        let roleIds = roles.map((role) => role.id);

        if (roleIds !=null && roleIds.length > 0) {
            this.getUsers(roleIds);
          } else {
            this.setState({ users: [], virtualData: [] });
            this.getUsers()
          }
    }

    itemRenderForRoles = (li, itemProps) => {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    checked={itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    handleSave = () => {
        this.setState({ showError: true })
        let data = {
            userId: this.state.userId,
            comments: this.state.comments,
        };
        if ((this.state.userId !=undefined && this.state.userId !=null)) {
            this.onImpersonate(this.state.userId, this.state.comments)
        }
    }

    openNew = () => {
        this.props.onOpenModal();
    };

    
    tagRender = (
        tagData,
        li: React.ReactElement<
            HTMLLIElement,
            string | React.JSXElementConstructor<any>
        >
    ) => {
        let selectedRolesIds = this.state.selectedRoles.map((role) => role.name);
        let totalSelectedRoles = selectedRolesIds.length;
        let roleName = tagData.data[0].role;
        let lastRole = selectedRolesIds[totalSelectedRoles - 1];

        if (roleName==lastRole) {
            return React.cloneElement(li, li.props, ([(<span className="custom-tag">
                {totalSelectedRoles} roles selected
            </span>)]));
        } else {
            return null;
        }
    };

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-widthh Impersonate-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Impersonate User
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>

                    <div>
                        <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-2 mt-lg-2 multiselect">
                            <label className="mb-1 font-weight-bold required">Select Roles</label>
                            <MultiSelect
                                className="form-control disabled"
                                textField="role"
                                dataItemKey="id"
                                id="role"
                                itemRender={this.itemRenderForRoles}
                                data={this.state.roles}
                                value={this.state.selectedRoles}
                                onChange={(e) => this.handleRolesChange(e)}
                                placeholder="Select Roles..."
                                //onFilterChange={this.filterChange}
                                filterable={false}
                                autoClose={false}
                                tagRender={this.tagRender}
                            />

                            {this.state.showError && (this.state.selectedRoles =="" || this.state.selectedRoles ==null) ? <ErrorComponent /> : null}
                        </div>
                        <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-2 mt-lg-2">
                            <label className="mb-1 font-weight-bold required">Select User</label>
                            <MultiColumnComboBox
                                disabled={this.state.showLoader}
                                className="form-control disabled"
                                name={`userId`}
                                data={this.state.virtualData}
                                columns={columns}
                                textField={'fullName'}
                                id="users"                                
                                value={this.state.userId}
                                placeholder={"Select User"}
                                onChange={this.handleUserChange}
                                suggest={true}
                                virtual={{
                                    skip: this.state.skip,
                                    pageSize: pageSize,
                                    total: this.state.total
                                }}
                                onPageChange={this.onPageChange}
                                itemRender={this.itemRender}
                                filterable={this.state.originalusers.length > 5 ? true : false}
                                onFilterChange={this.handleFilterChange}
                            />

                            {this.state.showError && (this.state.userId =="" || this.state.userId ==null) ? <ErrorComponent /> : null}
                        </div>

                        <div className="col-12 col-sm-11 mx-auto mt-sm-2">
                            <label className="mb-1 font-weight-bold ">Comments</label>
                            <textarea
                                name="comment"
                                maxLength={2000}
                                placeholder="Enter Comments"
                                className="form-control"
                                value={this.state.comments}
                                onChange={(e) => this.handleCommentChange(e)}
                            />
                            {/* {this.state.showError && this.state.comments =="" ? <ErrorComponent /> : null} */}
                        </div>

                        <div className="modal-footer justify-content-center border-0 mt-2 mb-2">
                            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                </button>
                                <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave} disabled={this.state.userId ? false : true}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Impersonate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImpersonatePopUp;