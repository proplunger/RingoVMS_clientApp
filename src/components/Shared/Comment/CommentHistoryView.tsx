import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, toODataString, State } from "@progress/kendo-data-query";
import Axios from "axios";
import { CellRender, GridNoRecord } from "../GridComponents/CommonComponents";
import { kendoLoadingPanel, KendoFilter } from "../../ReusableComponents";
import ReactTooltip from "react-tooltip";

import { Tooltip } from "@progress/kendo-react-tooltip";
import { dateFormatter } from "../../../HelperMethods";
import { PositionItemTemplate as CommentItemTemplate } from "./CommentCell";

export interface ICommentHistoryViewProps {
    showDialog: boolean;
    entityId: string;
    entityType: string;
    isPrivate?: boolean;
}

export interface CommentHistoryViewRow {
    CommentHistoryViewId: string;
    comments: string;
    createdDate: Date;
    createdBy: string;
    entityId: string | null;
    userType: string | null;
}

let initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};

let dataState = initialDataState;

export interface ICommentHistoryViewState {
    filter: undefined;
    searchString: string;
    dataState?: any;
    data: any;
    total?: any;
    entityId: string;
    entityType: string;
    showLoader?: boolean;
}

export default class CommentHistoryView extends Component<ICommentHistoryViewProps, ICommentHistoryViewState> {
    CommentItemCellTemplate;

    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            searchString: "",
            dataState: initialDataState,
            total: 0,
            entityId: "",
            entityType: "",
            data: [],
            showLoader: true,
        };

        this.CommentItemCellTemplate = CommentItemTemplate();
    }

    componentDidMount() {
        this.setState({
            entityId: this.props.entityId,
            entityType: this.props.entityType,
            searchString: "",
            data: [],
        });
        this.onCommentsViewClick(initialDataState);
    }

    componentWillUnmount() { }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.onCommentsViewClick(changeEvent.data);
    };

    render() {
        return (
            <div>
                {this.props.showDialog && (
                    <div className="row">
                        <div className="col-12 col-md-12">
                            <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                <Grid
                                    style={{ margin: "0" }}
                                    // onScroll={this.scrollHandler.bind(this)}
                                    className="timesheetTblGrid"
                                    data={this.state.data}
                                >
                                    <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                    <GridColumn field="comment" title="Comment" cell={this.CommentItemCellTemplate} headerClassName="positionHeader" />
                                </Grid>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    private onCommentsViewClick(dataState) {
        var queryStr = `${toODataString(dataState)}`;
        const { entityId, entityType } = this.props;
        let isPrivate = this.props.isPrivate;
        if (!isPrivate) {
            isPrivate = null;
        }

        const queryParams = `entityid eq ${entityId} and entitytype eq '${entityType}' and isPrivate eq ${isPrivate}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        Axios.get(`api/comments?${`$count=true & `}${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data.value,
                total: res.data["@odata.count"],
                showLoader: false,
            });
        });
    }
}
