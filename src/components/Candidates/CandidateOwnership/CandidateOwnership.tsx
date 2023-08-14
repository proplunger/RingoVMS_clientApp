import * as React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, DateTimeRender, StatusBadgeCellRender, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridColumnMenuFilter, GridColumnMenuProps, GridColumnMenuSort, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { ViewMoreComponent } from "../ManageCandidateWF/WFCells";
import { NumberCell, KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { kendoLoadingPanel } from "../../ReusableComponents";
import { initialDataState, successToastr } from "../../../HelperMethods";
import RowActions from "../../Shared/Workflow/RowActions";
import { CustomMenu, DefaultActions } from "./GlobalActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { CAND_END_OWNERSHIP_CONFIRMATION_MSG, CAND_END_OWNERSHIP_SUCCESS_MSG } from "../../Shared/AppMessages";

export interface CandidateOwnershipProps {
    candidateId: any;
    handleNo: any;
}

export interface CandidateOwnershipState {
    search: string;
    data: any;
    candidateId: string;
    dataState: any;
    showLoader?: boolean;
    totalCount?: number;
    showEndOwnershipModal?: boolean;
    totalCandidate?:any;
}

class CandidateOwnership extends React.Component<CandidateOwnershipProps, CandidateOwnershipState> {
    public dataItem: any;
    public candSubmissionId:any;
    public candOwnershipId:any;
    public ownershipType:any;
    constructor(props: CandidateOwnershipProps) {
        super(props);
        this.state = {
            search: "",
            data: [],
            dataState: initialDataState,
            candidateId: "",
            showLoader: true
        };
    }

    componentDidMount() {
        this.setState({ candidateId: this.props.candidateId });
        this.getCandidateOwnership(this.state.dataState, this.props.candidateId);
    }

    getCandidateOwnership(dataState, candidateId: string) {
        this.setState({ showLoader: true });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        var queryParams = `candidateId eq ${candidateId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/ownership?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false
            });
            this.getCandidateOwnershipCount(dataState, candidateId);
        });
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getCandidateOwnership(changeEvent.data, this.state.candidateId);
    };

    selectionChange = (event) => {
        const data = this.state.data.map((item) => {
            if (item.reqId ==event.dataItem.reqId) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ data });
    };
    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.data.map((item) => {
            item.selected = checked;
            return item;
        });
        this.setState({ data });
    };
    isColumnActive =(field: string, dataState: State) => {
        return (
          GridColumnMenuFilter.active(field, dataState.filter)
        );
      }
      handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        debugger
        this.candOwnershipId=dataItem.candOwnershipId
        this.candSubmissionId=dataItem.candSubmissionId
        this.ownershipType=dataItem.ownershipType
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }
    render() {
        return (
            <div>
                <div className="containerDialog">
                    <div className="containerDialog-animation">
                        <div className="col-11 col-sm-8 col-md-9 shadow containerDialoginside containerDialoginside-height" id="Candidate-Grid-Popup">
                            <div className="row blue-accordion">
                                <div className="col-12  pt-2 pb-2 fontFifteen font-weight-normal">
                                    Ownership History
                                    <span className="float-right cursorElement" onClick={this.props.handleNo}>
                                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                    </span>
                                </div>
                            </div>
                            <div className="row mt-2 mb-2 mt-lg-3 mb-lg-3">
                                <Grid
                                    sortable={true}
                                    onDataStateChange={this.onDataStateChange}
                                    pageable={true}
                                        pageSize={5}
                                    data={this.state.data}
                                    {...this.state.dataState}
                                    detail={ViewMoreComponent}
                                    expandField="expanded"
                                    total={this.state.totalCount}
                                    className="kendo-grid-custom lastchild col-12 k-grid-table-candidate heighty_formobile font-weight-normal global-action-grid-onlyhead"
                                    selectedField="selected"
                                    onSelectionChange={this.selectionChange}
                                    onHeaderSelectionChange={this.headerSelectionChange}
                                >
                                    <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                    <GridColumn
                                        field="reqNumber"
                                        width="120px"
                                        title="Requisition#"
                                        cell={(props) => CellRender(props, "Requisition#")}
                                        columnMenu={ColumnMenu}
                                        //headerClassName= {this.isColumnActive("reqNo", this.state.dataState)? "active-filter": ""}
                                    />
                                    <GridColumn
                                        field="submittedVendorName"
                                        title="Submitted By Vendor"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Submitted By Vendor")}                                        
                                    />
                                    <GridColumn
                                        field="ownershipType"
                                        title="Ownership Type"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Ownership Type")}                                        
                                    />
                                    <GridColumn
                                        field="ownershipDate"
                                        title="Ownership Date"
                                        filter="date"
                                        format="{0:d}"
                                        editor="date"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Ownership Date")}
                                    />                                   
                                    <GridColumn
                                        field="ownershipDays"
                                        filter="numeric"
                                        title="Ownership Days"
                                        columnMenu={ColumnMenu}
                                        sortable={true}
                                        cell={(props) => NumberCell(props, "Ownership Days")}                                        
                                    />
                                    <GridColumn
                                        field="expirationDate"
                                        width="190px"
                                        filter="date"
                                        format="{0:d}"
                                        editor="date"
                                        title="Ownership Expiration"
                                        columnMenu={ColumnMenu}
                                        cell={(props) => CellRender(props, "Ownership Expiration")}
                                    />
                                    <GridColumn
                                        field="status"
                                        title="Status"
                                        columnMenu={ColumnMenu}
                                        cell={StatusCell}                                         
                                    />
                                    <GridColumn
                                        title="Action"
                                        sortable={false}
                                        width="70px"
                                        cell={(props) => (
                                            <RowActions
                                                dataItem={props.dataItem}
                                                currentState={""}
                                                rowId={props.dataItem.candidateId}
                                                handleClick={this.handleActionClick}
                                                defaultActions={DefaultActions(props)}
                                            />
                                        )}
                                        headerCell={() => CustomMenu(this.state.totalCandidate)}
                                    />
                                </Grid>
                            </div>
                            <div className="btn-bottom pt-2 pb-2 pt-lg-4 pb-lg-4 mt-1 mb-1 mt-lg-0 mb-lg-0">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.handleNo}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    message={CAND_END_OWNERSHIP_CONFIRMATION_MSG}
                    showModal={this.state.showEndOwnershipModal}
                    handleYes={(e) => this.shareRequestStatusUpdate(CAND_END_OWNERSHIP_SUCCESS_MSG, "showEndOwnershipModal")}
                    handleNo={() => {
                        this.setState({ showEndOwnershipModal: false });
                    }}
                />
            </div>
        );
    }

    // To be removed
    getCandidateOwnershipCount = (dataState, candidateId: string) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `candidateId eq ${candidateId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/ownership?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalCandidate:res.data
            });
        });
    };

    shareRequestStatusUpdate(successMsg, modal, props?) {
        this.setState({ showLoader: true });
        const data = {
            candOwnershipId: this.candOwnershipId,
            candSubmissionId: this.candSubmissionId,
            ownershipType: this.ownershipType,
            ...props,
        };
        axios.patch("api/candidates/ownership", JSON.stringify(data)).then((res) => {
            successToastr(successMsg);
            this.setState({ showLoader: false });
            this.getCandidateOwnership(this.state.dataState, this.props.candidateId);
        });
        let change = {};
        change[modal] = false;
        this.setState(change);
    }
}

export default CandidateOwnership;
