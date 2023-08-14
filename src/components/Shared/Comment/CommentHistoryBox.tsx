import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { CompositeFilterDescriptor, toODataString, State } from "@progress/kendo-data-query";
import Axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { kendoLoadingPanel, KendoFilter } from "../../ReusableComponents";
import ReactTooltip from "react-tooltip";

import { Tooltip } from "@progress/kendo-react-tooltip";

export interface ICommentHistoryProps {
    showDialog: boolean;
    handleNo: any;
    entityId: string;
    entityType: string;
    isPrivate?: boolean;
}

export interface CommentHistoryRow {
    commentHistoryId: string;
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

export interface ICommentHistoryState {
    filter: undefined;
    searchString: string;
    dataState?: any;
    data: any;
    total?: any;
    entityId: string;
    entityType: string;
    showLoader?: boolean;
}

export default class CommentHistoryBox extends Component<ICommentHistoryProps, ICommentHistoryState> {
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

        this.searchComments = this.searchComments.bind(this);
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

    searchComments = () => {
        if (this.state.searchString=="" || this.state.searchString==null) {
            var gridState = {
                ...this.state.dataState,
                skip: 0,
                filter: null,
            };
            this.onCommentsViewClick(gridState);
        } else {
            var filterObj: CompositeFilterDescriptor = {
                logic: "or",
                filters: this.searchFilterOperation(),
            };

            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: filterObj,
            };

            this.onCommentsViewClick(dataState);
        }
    };

    searchBtnChange = (e) => {
        var value = e.target.value;
        if (value==null || value=="") {
            var gridState = {
                ...this.state.dataState,
                filter: null,
            };
            this.onCommentsViewClick(gridState);
        }
        this.setState({ searchString: e.target.value });
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.onCommentsViewClick(changeEvent.data);
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
                                        Comment History
                                        <span className="float-right cursorElement" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 ">
                                        <div className="input-group mt-3">
                                            <input
                                                type="search"
                                                value={this.state.searchString}
                                                onChange={this.searchBtnChange.bind(this)}
                                                className="BorderSearch border-right-0 form-control placeholder-mobile searchText border-left-radius"
                                                title="Search comments"
                                                placeholder="Search comments"
                                                onKeyPress={(event) => {
                                                    if (event.key =="Enter") {
                                                        event.preventDefault();
                                                        this.searchComments();
                                                    }
                                                }}
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    style={{ border: "1px solid #109dd2" }}
                                                    className="btn btn-secondary BorderSearch border-left-0"
                                                    type="button"
                                                    onClick={(e) => this.searchComments()}
                                                >
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid
                                        sortable={true}
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                        data={this.state.data}
                                        {...this.state.dataState}
                                        expandField="expanded"
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={true}
                                        pageSize={5}
                                        total={this.state.total}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                                        <GridColumn
                                            field="createdDate"
                                            width="100px"
                                            editor="date"
                                            title="Date Created"
                                            cell={(props) => CellRender(props, "Created Date")}
                                        />
                                        <GridColumn
                                            field="commentedBy"
                                            width="150px"
                                            title="Commented By"
                                            cell={(props) => CellRender(props, "Commented By")}
                                        />
                                        <GridColumn field="comment" title="Comments"
                                            cell={(props) => {
                                                return (
                                                    <td contextMenu="Comments" >
                                                        {/* <Tooltip anchorElement="target" position="top"> */}
                                                        
                                                        <div style={{ cursor: "pointer" }} data-tip data-for={`${props.dataItem.commentHistoryId}`} className="my-task-desciption" >{props.dataItem.comment}</div>
                                                        <ReactTooltip 
                                                        id={`${props.dataItem.commentHistoryId}`} 
                                                        place={"top"} effect="solid" multiline={true}
                                                            backgroundColor={"white"}
                                                            type={"success"}
                                                            border={true}
                                                            className="tooltip-comments"
                                                            borderColor={"#FE988D"}
                                                            textColor="black">
                                                            {props.dataItem.comment}
                                                        </ReactTooltip>
                                                        {/* </Tooltip> */}
                                                    </td>
                                                )
                                            }}
                                        //cell={(props) => CellRender(props, "comment")} 
                                        />
                                        <GridColumn
                                            field="userRole"
                                            width="150px"
                                            title="User Role"
                                            cell={(props) => {
                                                return (
                                                    <td contextMenu="User Role" title={props.dataItem.userRole}>
                                                        <span className="my-task-desciption">{props.dataItem.userRole}</span>
                                                    </td>
                                                )
                                            }}
                                        //  cell={(props) => CellRender(props, "userRole")}
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

    public searchFilterOperation() {
        var filterArray: Array<CompositeFilterDescriptor> = [
            {
                logic: "or",
                filters: [
                    {
                        field: "comment",
                        operator: "contains",
                        value: this.state.searchString,
                        ignoreCase: true,
                    },
                    {
                        field: "commentedBy",
                        operator: "contains",
                        value: this.state.searchString,
                        ignoreCase: true,
                    },
                    {
                        field: "userRole",
                        operator: "contains",
                        value: this.state.searchString,
                        ignoreCase: true,
                    },
                ],
            },
        ];

        return filterArray;
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

    // on cancel
    private onCancel() {
        this.props.handleNo();
        this.setState({ searchString: "", data: [] });
    }
}
