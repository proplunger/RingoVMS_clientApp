import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, CandidateInterviewStatusCell } from "../../Shared/GridComponents/CommonComponents";
import {
    CANCEL_INTERVIEW_CONFIRMATION_MSG,
    REMOVE_INTERVIEW_CONFIRMATION_MSG,
    RESEND_TO_VENDOR_INTERVIEW_CONFIRMATION_MSG,
    INTERVIEW_RESEND_TO_VENDOR_SUCCESS_MSG,
    INTERVIEW_CANCELLED_SUCCESS_MSG,
    INTERVIEW_REMOVED_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import { CandSubInterviewStatusIds } from "../../Shared/AppConstants";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, ViewMoreComponent, DefaultActions } from "./InterviewCells";
import { KendoFilter, kendoLoadingPanel, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import "./Interview.css";
import PageTitle from "../../Shared/Title";
import { successToastr, history, initialDataState } from "../../../HelperMethods";
import RowActions from "../../Shared/Workflow/RowActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";

export interface InterviewsProps {
    match: any;
}

export interface InterviewsState {
    search: string;
    data: any;
    candSubId: string;
    candidateName: string;
    dataState: any;
    showLoader?: boolean;
    totalCount?: number;

    showCancelSelectedInterviewsModal?: boolean;

    enableCancelInterview?: boolean;
    selectedIds: any;

    showRemoveModal?: boolean;
    showCancelInterviewModal?: boolean;
    showResendToVendorModal?: boolean;
}

class Interviews extends React.Component<InterviewsProps, InterviewsState> {
    public candSubInterviewId: string;
    public dataItem: any;
    constructor(props: InterviewsProps) {
        super(props);
        this.state = {
            search: "",
            data: [],
            dataState: initialDataState,
            candSubId: "",
            candidateName: "",
            selectedIds: [],
            showLoader: true,
        };
    }

    componentDidMount() {
        const { subId } = this.props.match.params;
        this.setState({ candSubId: subId });
        this.getInterviews(this.state.dataState, subId);
        this.getCandidateSubmissionDetails(subId);
    }

   async getCandidateSubmissionDetails(candSubmissionId) {
        this.setState({ showLoader: true });
        await   axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
            this.setState({
                candidateName: res.data.candidateName,
                showLoader: false,
            });
        });
    }

    getInterviews = (dataState, candSubId) => {
        this.setState({ showLoader: true });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        var queryParams = this.candidateQuery(candSubId);

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/candsubinterview?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
            });
            this.getInterviewsCount(dataState, candSubId);
        });
    };

    getCandSubDetails(candSubId: string) {}

    cancelInteviewRound = () => {
        this.setState({ showCancelInterviewModal: false });
        let ids = [];
        ids.push(this.candSubInterviewId);
        const data = {
            CandSubInterviewIds: ids,
            CandSubmissionId: this.state.candSubId,
            StatusIntId: CandSubInterviewStatusIds.CANCELLED,
        };
        axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
            successToastr(INTERVIEW_CANCELLED_SUCCESS_MSG);
            this.getInterviews(this.state.dataState, this.state.candSubId);
        });
    };

    candidateStatusUpdate = () => {
        this.setState({ showCancelSelectedInterviewsModal: false });
      
        const data = {
            CandSubInterviewIds:this.state.selectedIds,
            CandSubmissionId: this.state.candSubId,
            StatusIntId: CandSubInterviewStatusIds.CANCELLED,
        };
        axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
            successToastr(INTERVIEW_CANCELLED_SUCCESS_MSG);
            this.getInterviews(this.state.dataState, this.state.candSubId);
        });
    };

    removeInteviewRound = () => {
        this.setState({ showRemoveModal: false });
        axios.delete(`api/candidates/candsubinterview/${this.candSubInterviewId}`).then((res) => {
            successToastr(INTERVIEW_REMOVED_SUCCESS_MSG);
            this.getInterviews(this.state.dataState, this.state.candSubId);
        });
    };

    resendToVendor = () => {
        this.setState({ showResendToVendorModal: false });
        let ids = [];
        ids.push(this.candSubInterviewId);
        const data = {
            CandSubInterviewIds: ids,
            CandSubmissionId: this.state.candSubId,
            StatusIntId: CandSubInterviewStatusIds.RESCHEDULED,
        };
        axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
            successToastr(INTERVIEW_RESEND_TO_VENDOR_SUCCESS_MSG);
            this.getInterviews(this.state.dataState, this.state.candSubId);
        });
    };

    openModal = (prop, reqId) => {
        let change = {};
        change[prop] = true;
        this.setState(change);
        //this.reqId = reqId;
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getInterviews(changeEvent.data, this.state.candSubId);
    };

    selectionChange = (event) => {
        var checked = event.syntheticEvent.target.checked;

        let ids = this.state.selectedIds;
        const data = this.state.data.map((item) => {
            if (item.candSubInterviewId ==event.dataItem.candSubInterviewId) {
                item.selected = !event.dataItem.selected;

                if (item.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION 
                    || item.statusIntId==CandSubInterviewStatusIds.SCHEDULED 
                    || item.statusIntId==CandSubInterviewStatusIds.RESCHEDULED) {
                    if (checked==true) {
                        ids.push(item.candSubInterviewId);
                    } else if (checked==false) {
                        ids = ids.filter((o) => o !=item.candSubInterviewId);
                    }
                }
            }

            return item;
        });

        this.shouldSubmitSelectedBtnEnable(this.state.data);

        this.setState({ data, selectedIds: ids });
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let ids = [];
        const data = this.state.data.map((item) => {
            if (checked==true) {
                if (item.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION 
                    || item.statusIntId==CandSubInterviewStatusIds.SCHEDULED 
                    || item.statusIntId==CandSubInterviewStatusIds.RESCHEDULED) {
                    ids.push(item.candSubInterviewId);
                }
            }
            item.selected = checked;
            return item;
        });
        this.shouldSubmitSelectedBtnEnable(this.state.data);
        this.setState({ data, selectedIds: ids });
    };

    // dynamic action click
    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
        this.candSubInterviewId = dataItem.candSubInterviewId;
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0">
                <PageTitle title="Schedule Interview" status={this.state.candidateName && `Candidate Name: ${this.state.candidateName}`} />
                <div className="container-fluid">
                    <div className="InterviewContainer">
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
                            selectedField="selected"
                            onSelectionChange={this.selectionChange}
                            onHeaderSelectionChange={this.headerSelectionChange}
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="selected"
                                width="50px"
                                headerSelectionValue={this.state.data && this.state.data.findIndex((dataItem) => dataItem.selected ==false) ==-1}
                            />
                            <GridColumn
                                field="round"
                                width="100px"
                                title="Round"
                                cell={(props) => NumberCell(props, "Round")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="title"
                                width="180px"
                                title="Title"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Title")}
                            />
                            <GridColumn field="medium" title="Medium" columnMenu={ColumnMenu} cell={(props) => CellRender(props, "Medium")} />
                            <GridColumn
                                field="hiringManager"
                                title="Interviewer"
                                width="130px"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Interviewer")}
                            />
                            <GridColumn
                                field="interviewDate"
                                width="130px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Interview Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Interview Date")}
                            />
                            <GridColumn field="status" width="260px" title="Status" columnMenu={ColumnMenu} cell={CandidateInterviewStatusCell} />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="40px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.candSubInterviewId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() =>
                                    CustomMenu(this.state.data, this.state.candSubId, this.state.enableCancelInterview, () => {
                                        this.setState({
                                            showCancelSelectedInterviewsModal: true,
                                        });
                                    })
                                }
                            />
                            <GridColumn sortable={false} field="expanded" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                <ConfirmationModal
                    message={REMOVE_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showRemoveModal}
                    handleYes={this.removeInteviewRound}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
                <ConfirmationModal
                    message={CANCEL_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showCancelInterviewModal}
                    handleYes={this.cancelInteviewRound}
                    handleNo={() => {
                        this.setState({ showCancelInterviewModal: false });
                    }}
                />
                <ConfirmationModal
                    message={RESEND_TO_VENDOR_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showResendToVendorModal}
                    handleYes={this.resendToVendor}
                    handleNo={() => {
                        this.setState({ showResendToVendorModal: false });
                    }}
                />
                 <ConfirmationModal
                    message={CANCEL_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showCancelSelectedInterviewsModal}
                    handleYes={ this.candidateStatusUpdate}
                    handleNo={() => {
                        this.setState({ showCancelSelectedInterviewsModal: false });
                    }}
                />
            </div>
        );
    }

    // To be removed
    getInterviewsCount = (dataState, candSubId: string) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = this.candidateQuery(candSubId);

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/candsubinterview?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    private candidateQuery(candSubId): string {
        var queryParams = `candSubmissionId eq ${candSubId}`;
        return queryParams;
    }

    private shouldSubmitSelectedBtnEnable(candidateInterviewRoundList) {
        this.setState({ enableCancelInterview: false });

        var selectedRounds = candidateInterviewRoundList.filter((o) => o.selected);

        var selectedCandidatesForCancellation = selectedRounds.filter((o) => o.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION 
        || o.statusIntId==CandSubInterviewStatusIds.SCHEDULED 
        || o.statusIntId==CandSubInterviewStatusIds.RESCHEDULED);

        if (selectedCandidatesForCancellation.length > 0 && selectedRounds.length > 0) {
            if (selectedCandidatesForCancellation.length==selectedRounds.length) {
                this.setState({ enableCancelInterview: true });
            }
        }
    }
}

export default Interviews;
