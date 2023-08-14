import { faCircle, faMapPin, faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { faTimesCircle, faArrowAltCircleDown } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../Auth";
import * as React from "react";
import { filterBy, State, toODataString } from "@progress/kendo-data-query";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Comment } from "../../../Shared/Comment/Comment";
import { EntityType } from "../../../Shared/AppConstants";
import axios from "axios";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { GridNoRecord, CellRender } from "../../../Shared/GridComponents/CommonComponents";
import { KendoFilter, kendoLoadingPanel, NumberCell } from "../../../ReusableComponents";

export interface HoldPositionHistoryProps {
    reqPositionId: string;
    reqNumber: string;
    handleClose: any;
}

export interface HoldPositionHistoryState {
    data: any;
    dataState: any;
    total?: any;
    showLoader?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};

class HoldPositionHistory extends React.Component<HoldPositionHistoryProps, HoldPositionHistoryState> {
    constructor(props: HoldPositionHistoryProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
        };
    }

    componentDidMount() {
        this.getHoldPositionHistory(this.state.dataState);
    }

    getHoldPositionHistory(dataState) {
        this.setState({ showLoader: true });
        const { reqPositionId } = this.props;
        const queryParams = `streamId eq ${reqPositionId}`;
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({ data, dataState, showLoader: false });
            this.getHoldPositionHistoryCount(dataState);
        });
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getHoldPositionHistory(changeEvent.data);
    };

    render() {
        return (
            <div className="containerDialog">
                <div className="containerDialog-animation">
                    <div className="col-10 col-md-7 shadow containerDialoginside">
                        <div className="row blue-accordion">
                            <div className="col-12  pt-2 pb-2 fontFifteen">
                                Hold Position History : <span> {this.props.reqNumber} </span>
                                <span className="float-right cursorElement" onClick={() => this.props.handleClose()}>
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
                                expandField="expanded"
                                onDataStateChange={this.onDataStateChange}
                                pageable={true}
                                pageSize={5}
                                total={this.state.total}
                            >
                                <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                <GridColumn
                                    field="NoOfReqStaff"
                                    width="170px"
                                    title="No. of Required Positions"
                                    cell={(props) => NumberCell(props, "No. of Required Positions")}
                                />
                                <GridColumn
                                    field="NoOfHoldStaff"
                                    width="150px"
                                    title="No. of Hold Positions"
                                    cell={(props) => NumberCell(props, "No. of Hold Positions")}
                                />
                                <GridColumn
                                    field="UpdatedDate"
                                    width="100px"
                                    editor="date"
                                    title="Updated Date"
                                    cell={(props) => CellRender(props, "Updated Date")}
                                />
                                <GridColumn field="UpdatedBy" width="150px" title="Updated By" cell={(props) => CellRender(props, "Updated By")} />
                                <GridColumn field="Comment" title="Comments" cell={(props) => CellRender(props, "Comment")} />
                            </Grid>
                        </div>
                        <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                            <div className="col-12 text-center text-right font-regular">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.props.handleClose()}>
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

    getHoldPositionHistoryCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        const { reqPositionId } = this.props;
        const queryParams = `streamId eq ${reqPositionId}`;
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var finalQueryString = KendoFilter(finalState, queryStr, queryParams);

        axios.get(`api/events/details?${finalQueryString}`).then((res) => {
            console.log("res.data", res.data);
            debugger;
            let data = res.data.map((x) => JSON.parse(x.data));
            this.setState({ total: data.length });
        });
    };
}
export default HoldPositionHistory;
