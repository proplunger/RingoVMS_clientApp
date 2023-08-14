import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { toODataString, State } from "@progress/kendo-data-query";
import { CellRender, GridNoRecord } from "../GridComponents/CommonComponents";
import { KendoFilter } from "../../ReusableComponents";
import { TicketEventsType } from "../AppConstants";
import axios from "axios";

export interface TicketAttributeHistoryProps {
    showDialog: boolean;
    handleNo: any;
    entityId: string;
    ticketAssignTo?: boolean;
    ticketQue?: boolean;
}

let initialDataState = {
    skip: 0,
    take: 5
};

export interface TicketAttributeHistoryState {
    dataState?: any;
    data: any;
    totalCount?: number;
    showLoader?: boolean;
}

export default class TicketAttributeHistory extends Component<TicketAttributeHistoryProps, TicketAttributeHistoryState> {
    constructor(props) {
        super(props);

        this.state = {
            dataState: initialDataState,
            data: [],
            showLoader: true,
        };
    }

    componentDidMount() {
        this.getTktAttributesHist(this.state.dataState);
    }

    getTktAttributesHist(dataState) {
        this.setState({ showLoader: true });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `streamId eq ${this.props.entityId} & $orderby=timestamp`;
        if (this.props.ticketAssignTo) {
            queryParams = `streamId eq ${this.props.entityId} and type eq '${TicketEventsType.TICKETASSIGNTOEVENT}' & $orderby=timestamp desc`;
        }
        else if (this.props.ticketQue) {
            queryParams = `streamId eq ${this.props.entityId} and type eq '${TicketEventsType.TICKETQUEUEEVENT}' & $orderby=timestamp desc`;
        }
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({
                data: data,
                showLoader: false,
                dataState: dataState,
            });
            this.getTktAttributesHistCount(dataState);
        });
    }

    getTktAttributesHistCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `streamId eq ${this.props.entityId} & $orderby=timestamp`;
        if (this.props.ticketAssignTo) {
            queryParams = `streamId eq ${this.props.entityId} and type eq '${TicketEventsType.TICKETASSIGNTOEVENT}' & $orderby=timestamp`;
        }
        else if (this.props.ticketQue) {
            queryParams = `streamId eq ${this.props.entityId} and type eq '${TicketEventsType.TICKETQUEUEEVENT}' & $orderby=timestamp`;
        }
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({
                totalCount: data.length,
            });
        });
    };

    // on cancel
    onCancel() {
        this.props.handleNo();
        this.setState({ data: [] });
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getTktAttributesHist(changeEvent.data);
    };

    render() {
        return (
            <div>
                {this.props.showDialog && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-md-7 shadow containerDialoginside containerDialoginside-height">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        {this.props.ticketAssignTo==true ? "Ticket Assign To History" : this.props.ticketQue ? "Ticket Queue History" : ""}
                                        <span className="float-right cursorElement" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid
                                        style={{ height: "auto" }}
                                        sortable={false}
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                        data={this.state.data}
                                        {...this.state.dataState}
                                        expandField="expanded"
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={{ pageSizes: true }}
                                        total={this.state.totalCount}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>

                                        <GridColumn
                                            field="TktStatus"
                                            width="110px"
                                            title="Ticket Status"
                                            cell={(props) => CellRender(props, "Ticket Status")}
                                        />
                                        {this.props.ticketAssignTo==true &&
                                            <GridColumn
                                                field="NewAssignTo"
                                                width="112px"
                                                title="Assign To"
                                                cell={(props) => CellRender(props, "Assign To")}
                                            />
                                        }
                                        {this.props.ticketQue==true &&
                                            <GridColumn
                                                field="NewQueue"
                                                width="112px"
                                                title="Queue"
                                                cell={(props) => CellRender(props, "Queue")}
                                            />
                                        }
                                        <GridColumn
                                            field="ActionDate"
                                            width="100px"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            title="Action Date"
                                            cell={(props) => CellRender(props, "Action Date", null, true)}
                                        />
                                        <GridColumn
                                            field="ActionBy"
                                            width="100px"
                                            title="Action By"
                                            cell={(props) => CellRender(props, "Action By")}
                                        />
                                    </Grid>
                                </div>
                                <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                                    <div className="col-12 text-center text-right font-regular">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
