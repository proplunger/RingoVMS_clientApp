import * as React from "react";
import auth from "../../../Auth";
import axios from "axios";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { initialDataState, successToastr } from "../../../../HelperMethods";
import "../../../../assets/css/App.css";
import "../../../../assets/css/KendoCustom.css";
import RejectModal from "../../../Shared/RejectModal";
import RowActions from "../../../Shared/Workflow/RowActions";
import { CustomHeaderActionCell, DefaultActions } from "./GlobalActions";
import { CAND_SHARE_APPROVE_CONFIRMATION_MSG, CAND_SHARE_APPROVE_SUCCESS_MSG, CAND_SHARE_REJECTED_SUCCESS_MSG, CAND_SHARE_RESET_SUCCESS_MSG, REJECT_CAND_SHARE_CONFIRMATION_MSG, CAND_SHARE_RESET_CONFIRMATION_MSG, REJECT_BILLRATE_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { CandidateWorkflow } from "../../../Shared/AppConstants";
import CompleteSearch from "../../../Shared/Search/CompleteSearch";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";
//import { DefaultActions } from "./WFCells";

export interface CandidateShareWFProps {

}

export interface CandidateShareWFState {
    data: any;
    showLoader?: boolean;
    dataItem?: any;
    dataState: any;
    showResetModal?:boolean;
    showRejectModal?: boolean;
    showApproveModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    totalCount?:any;
    candShareRequestId?:any;
    onFirstLoad:boolean;
    totalData?:any;
}

class CandidateShareWF extends React.Component<CandidateShareWFProps, CandidateShareWFState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public billRateId: string;
    public CustomHeaderActionCellTemplate: any;
    public dataItem: any;
    constructor(props: CandidateShareWFProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            showLoader: true,
            onFirstLoad:true,
            totalData:[]
        };
    }
    action: string;
    actionId: string;
    statusId: string;
    eventName: string;
    subBillRateId: string;

    getCandShareRequest = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        this.setState({ showLoader: true, data: [], onFirstLoad: false });
        axios.get(`api/candidates/candsharerequest?${queryStr}`).then((res) => {
            console.log("res.data", res.data);
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState
            });
            this.getCandShareRequestCount(dataState);
        });
    };

    getCandShareRequestCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        axios.get(`api/candidates/candsharerequest?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalData: res.data
            });
        });
    };
    onDataStateChange = (changeEvent) => {
        this.getCandShareRequest(changeEvent.data);
    };

    shareRequestStatusUpdate = (successMsg, modal, props?) => {
        this.setState({ showLoader: true});
        const data = {
            //candSubmissionIds: this.state.selectedIds,
            candShareRequestId: this.dataItem.candShareRequestId,
            statusId: this.statusId,
            action :this.action,
            eventName: this.eventName,
            ...props,
        };
        axios.put("api/candidates/share/workflow", JSON.stringify(data)).then((res) => {
            successToastr(successMsg);
            this.getCandShareRequest(this.state.dataState);
            this.setState({ showLoader: false });
        });
        
        let change = {};
        change[modal] = false;
        this.setState(change);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.action = action;
        this.actionId = actionId;
        this.statusId = nextStateId;
        this.eventName = eventName;
        this.subBillRateId = rowId;
        this.dataItem = dataItem;
    };

    MyCustomCell = (props: GridCellProps) => (
    <RowActions {...props} wfCode={CandidateWorkflow.CANDSHARE}
      props={props}
      isClientCheck={true}
      key={props.dataItem.candShareRequestId}
      dataItem={props.dataItem}
      currentState={props.dataItem.status}
      jobWfTypeId={""}
      entityId={props.dataItem.candShareRequestId}
      rowId={props.dataItem.candShareRequestId}
      handleClick={this.handleActionClick}
      defaultActions={DefaultActions(props)} />
      );

    render() {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell(this.state.totalData);

        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
                        <BreadCrumbs></BreadCrumbs>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                <CompleteSearch
                        page="CandidateShareWF"
                        entityType={"candiDateShare"}
                        placeholder="Search text here!"
                        handleSearch={this.getCandShareRequest}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="myOrderContainer gridshadow CandidateShareRequest global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            pageable={{ pageSizes: true }}
                            onDataStateChange={this.onDataStateChange}
                            data={this.state.data}
                            {...this.state.dataState}
                            total={this.state.totalCount}
                            expandField="expanded"
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="candidateName"
                                //width="150px"
                                title="Candidate Name"
                                cell={(props) => CellRender(props, "Candidate Name")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="vendorName"
                                title="Vendor Name"
                                cell={(props) => CellRender(props, "Vendor Name")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="actionBy"
                                title="Action By"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Action By")}
                            />
                            <GridColumn
                                field="actionDate"
                                format="{0:d}"
                                filter="date"
                                title="Action Date"
                                editor="date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Action Date")}
                            />
                            <GridColumn field="status" 
                           // width="170px" 
                            title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={this.MyCustomCell}
                                //cell={CustomCell({ openDeleteConfirm: this.openModal, openEdit:this.openEdit, openNew:this.openNew  })}
                                headerCell={this.CustomHeaderActionCellTemplate}
                            />
                        </Grid>
                        
                    </div>
                </div>
                {this.state.showRejectModal && this.actionId && (
                    <RejectModal
                        action="Reject"
                        actionId={this.actionId}
                        message={REJECT_CAND_SHARE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showRejectModal}
                        handleYes={(data) => this.shareRequestStatusUpdate(CAND_SHARE_REJECTED_SUCCESS_MSG, "showRejectModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectModal: false });
                        }}
                    />
                )}
                
                <ConfirmationModal
                    message={CAND_SHARE_APPROVE_CONFIRMATION_MSG}
                    showModal={this.state.showApproveModal}
                    handleYes={(e) => this.shareRequestStatusUpdate(CAND_SHARE_APPROVE_SUCCESS_MSG, "showApproveModal")}
                    handleNo={() => {
                        this.setState({ showApproveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={CAND_SHARE_RESET_CONFIRMATION_MSG}
                    showModal={this.state.showResetModal}
                    handleYes={(e) => this.shareRequestStatusUpdate(CAND_SHARE_RESET_SUCCESS_MSG, "showResetModal")}
                    handleNo={() => {
                        this.setState({ showResetModal: false });
                    }}
                />
            </div>
        );
    }
}
export default CandidateShareWF;
