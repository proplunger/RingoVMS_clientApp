import * as React from "react";
import {

    faTimes,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimesCircle,
    faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { filterBy, State, toODataString } from "@progress/kendo-data-query";
import axios from "axios";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import {
    GridNoRecord,
    CellRender,
} from "../../Shared/GridComponents/CommonComponents";
import {
    KendoFilter,
} from "../../ReusableComponents";
import { dateFormatter, initialDataState } from "../../../HelperMethods";

export interface PatchRequisitionHistoryProps {
    reqId: string;
    reqNumber: string;
    handleClose: any;
}

export interface PatchRequisitionHistoryState {
    data: any;
    dataState: any;
    total?: any;
    showLoader?: boolean;
}

class PatchRequisitionHistory extends React.Component<
    PatchRequisitionHistoryProps,
    PatchRequisitionHistoryState
> {
    constructor(props: PatchRequisitionHistoryProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            showLoader: true,
        };
    }

    componentDidMount() {
        this.getPatchRequisitionHistory(this.state.dataState);
    }

    getPatchRequisitionHistory(dataState) {
        const { reqId } = this.props;
        const queryParams = `streamId eq ${reqId} and type eq 'requisition_patched'`;
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({ data: data, showLoader: false });
            this.getPatchRequisitionHistoryCount(dataState);
        });
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getPatchRequisitionHistory(changeEvent.data);
    };
    render() {
        const { reqNumber, handleClose } = this.props;
        return (
            <div className="containerDialog">
                <div className="containerDialog-animation">
                    <div className="col-10 col-md-7 shadow containerDialoginside">
                        <div className="row blue-accordion">
                            <div className="col-12  pt-2 pb-2 fontFifteen">
                                Requisition History : <span> {reqNumber} </span>
                                <span
                                    className="float-right cursorElement"
                                    onClick={() => this.props.handleClose()}
                                >
                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                </span>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                            <Grid
                                sortable={false}
                                className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                data={this.state.data}
                                {...this.state.dataState}
                                onDataStateChange={this.onDataStateChange}
                                pageable={true}
                                total={this.state.total}
                            >
                                <GridNoRecords>
                                    {GridNoRecord(this.state.showLoader)}
                                </GridNoRecords>
                                <GridColumn
                                    field="Values"
                                    width="250px"
                                    title="Update"
                                    cell={(props) => {
                                        let data = props.dataItem.Values
                                            ? JSON.parse(props.dataItem.Values.replaceAll("'", '"'))
                                            : {};
                                        let keys = Object.keys(data);
                                        return (
                                            <td contextMenu={"Update"}>
                                                {keys.map((i, index) =>
                                                    typeof data[i]=="object" ? (
                                                        Object.keys(data[i]).map((j, index) => (
                                                            j.indexOf("Date") !=-1 ? <p
                                                                style={{ paddingBottom: "2px" }}
                                                                title={dateFormatter(
                                                                    data[i][Object.keys(data[i])[index]]
                                                                )}
                                                            >
                                                                {Object.keys(data[i])[index]} :{" "}
                                                                {dateFormatter(
                                                                    data[i][Object.keys(data[i])[index]]
                                                                )}
                                                            </p> : <p
                                                                style={{ paddingBottom: "2px" }}
                                                                title={
                                                                    data[i][Object.keys(data[i])[index]]
                                                                }
                                                            >
                                                                {Object.keys(data[i])[index]} :{" "}
                                                                {
                                                                    data[i][Object.keys(data[i])[index]]
                                                                }
                                                            </p>
                                                        ))
                                                    ) : (
                                                        <span
                                                            style={{ paddingBottom: "2px" }}
                                                            title={data[i]}
                                                        >
                                                            {" "}
                                                            {keys[index]} : {data[i]}
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                        );
                                    }}
                                />
                                <GridColumn
                                    field="UpdatedDate"
                                    width="130px"
                                    editor="date"
                                    title="Updated Date"
                                    cell={(props) => CellRender(props, "Updated Date")}
                                />
                                <GridColumn
                                    field="UpdatedBy"
                                    width="120px"
                                    title="Updated By"
                                    cell={(props) => CellRender(props, "Updated By")}
                                />
                                <GridColumn
                                    field="Comment"
                                    title="Comments"
                                    cell={(props) => CellRender(props, "Comment")}
                                />
                            </Grid>
                        </div>
                        <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                            <div className="col-12 text-center text-right font-regular">
                                <button
                                    type="button"
                                    className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => handleClose()}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getPatchRequisitionHistoryCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        const { reqId } = this.props;
        const queryParams = `streamId eq ${reqId} and type eq 'requisition_patched'`;
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var finalQueryString = KendoFilter(finalState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({ total: data.length });
        });
    };
}
export default PatchRequisitionHistory;
