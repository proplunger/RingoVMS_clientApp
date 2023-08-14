import * as React from "react";
import axios from "axios";
import auth from "../../../../Auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, ManageCandidateStatusCell, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { errorToastr, initialDataState, successToastr } from "../../../../../HelperMethods";
import { hideLoader, KendoFilter, NumberCell, PhoneNumberCell, showLoader } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { CANDIDATE_REMOVE_SUCCESS_MSG, REMOVE_CANDIDATE_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { AuthRoleType } from "../../../../Shared/AppConstants";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface CandidatesProps {

}

export interface CandidatesState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalCandidate?: any;
    showLoader?: boolean;
    showAddNewCandidateModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    showInviteCandidateModal?: boolean;
    dataState: any;
    vendorId?: string;
}

class Candidates extends React.Component<CandidatesProps, CandidatesState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public candId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: CandidatesProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
            vendorId: auth.getVendor()
        };
    }

    getCandidates = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });

        var queryStr = `${toODataString(dataState)}`;
        var finalQueryString = queryStr;
        var queryParams = '';
        if (this.state.vendorId) {
            queryParams = `contains(vendors,'${this.state.vendorId}')`;
            finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        }
        axios.get(`api/candidates?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getCandidatesCount(dataState);
        });
    }

    getCandidatesCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        var finalQueryString = queryStr;
        var queryParams = '';
        if (this.state.vendorId) {
            queryParams = `contains(vendors,'${this.state.vendorId}')`;
            finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        }
        axios.get(`api/candidates?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalCandidate: res.data,
            });
        });
    };

    deleteCandidate = (id) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false });
        axios.delete(`/api/candidates/${id}`).then((res) => {
            successToastr(CANDIDATE_REMOVE_SUCCESS_MSG);
            this.getCandidates(this.state.dataState);
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getCandidates(changeEvent.data);
        localStorage.setItem("ManageCandidate-GridDataState", JSON.stringify(changeEvent.data));
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    inviteCandidate = (data) => {
        this.setState({ showInviteCandidateModal: false });
        if (data.userId) {
            showLoader();
            axios.get(`/api/accounts/invite/${data.userId}`)
                .then(res => {
                    hideLoader();
                    successToastr("Invitation Sent");
                })
        } else {
            let userData = {
                userId: data.userId,
                userType: AuthRoleType.Provider,
                lastName: data.lastName,
                firstName: data.firstName,
                roleId: data.roleId,
                candidateId: data.id,
                address: {
                    addressId: data.addressId,
                    email: data.email,
                    addressLine1: data.address1,
                    addressLine2: data.address2,
                    contactNum1: data.mobileNumber.replace(/\D+/g, ""),
                    contactNum2: data.phoneNumber ? data.phoneNumber.replace(/\D+/g, "") : "",
                    pinCodeId: data.postalCode,
                    cityId: data.cityId,
                    stateId: data.stateId,
                    countryId: data.countryId,

                },
                sendInvite: true
            };
            axios.post("api/users", JSON.stringify(userData)).then((res) => {
                if (res.data.succeeded) {
                    successToastr("Invitation sent successfully");
                } else {
                    errorToastr(res.data.errors[0]);
                }
            });
        }
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                            <BreadCrumbs ></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.CANDIDATE_CREATE) && (
                                <Link to="/candidate/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Candidate
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageCandidate"
                        entityType={"Candidate"}
                        placeholder="Search text here!"
                        handleSearch={this.getCandidates}
                        onFirstLoad={this.state.onFirstLoad}
                        persistSearchData={true}
                    />
                    <div className="manageCandidateContainer table_responsive table_responsive-TABcandidates">
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
                                field="position"
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="npi"
                                width="130px"
                                title="NPI#"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "NPI#")}
                            />
                            <GridColumn
                                field="mobileNumber"
                                width="130px"
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
                            {/* <GridColumn
                                field="jobCategory"
                                width="150px"
                                title="Job Category"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Job Category")}
                            /> */}
                            <GridColumn
                                field="status"
                                width="200px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={ManageCandidateStatusCell}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                headerClassName="tab-action"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.candId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props, this.state.vendorId)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalCandidate)}
                            />
                            <GridColumn sortable={false} field="expanded"
                                width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={"Are you sure you want to invite candidate?"}
                    showModal={this.state.showInviteCandidateModal}
                    handleYes={() => this.inviteCandidate(this.dataItem)}
                    handleNo={() => {
                        this.setState({ showInviteCandidateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={REMOVE_CANDIDATE_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteCandidate(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

            </div>
        );
    }
}
export default Candidates;

