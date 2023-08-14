import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { CellRender, GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { Link } from "react-router-dom";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { currencyFormatter } from "../../../../../HelperMethods";

export interface IRateCardGroupTaskProps {
    showDialog: boolean;
    handleNo: any;
    handleYes: any;
    clientId: string;
    exisitingGroupIds: any;
    Title: string;
    Url: string;
}

let initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};

export interface IRateCardGroupTaskState {
    filter: undefined;
    dataState?: any;
    clientId: string;
    exisitingGroupIds: any;
    showLoader?: boolean;
}

export default class RateCardGroupTask extends Component<IRateCardGroupTaskProps, IRateCardGroupTaskState> {
    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            dataState: initialDataState,
            clientId: "",
            exisitingGroupIds: [],
            showLoader: true,
        };
    }

    componentDidMount() {
        this.setState({
            clientId: this.props.clientId,
            exisitingGroupIds: this.props.exisitingGroupIds,
        });
    }

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
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
                                        {this.props.Title}
                                        <span className="float-right cursorElement" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>                                    
                                </div>
                                <div className="row">
                                    <div className="col-12 pt-2 pb-2 conflictMsg mt-2">
                                    Following client rate cards already exist for the selected division, location and position. Are you sure you want to remove existing rate cards and save the current one?
                                    </div>                                    
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid                                       
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                        data={this.state.exisitingGroupIds.slice(
                                            this.state.dataState.skip,
                                            this.state.dataState.take + this.state.dataState.skip
                                          )}
                                        {...this.state.dataState}
                                        expandField="expanded"
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={true}
                                        pageSize={5}
                                        total={this.state.exisitingGroupIds.length}
                                        filterable={false}
                                        sortable={false}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>                                       
                                        <GridColumn
                                            field="division"
                                            title="Division"
                                            cell={(props) => {
                                                return (
                                                    <td contextMenu="Req #">
                                                      <Link target="_blank" className="orderNumberTd orderNumberTdBalck" to={`${this.props.Url + props.dataItem.profileGroupId}`} style={{ color: "#007bff" }}>
                                                        {" "}
                                                        {props.dataItem.division}{" "}
                                                      </Link>
                                                    </td>
                                                  )
                                            }}
                                            columnMenu={WithoutFilterColumnMenu}
                                            filter="text"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="location"
                                            title="Location"
                                            cell={(props) => CellRender(props, "Location")}
                                            columnMenu={WithoutFilterColumnMenu}
                                            filter="text"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="position"
                                            title="Position"
                                            cell={(props) => CellRender(props, "Position")}
                                            columnMenu={WithoutFilterColumnMenu}
                                            filter="text"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="serviceType"
                                            title="Service Type"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Service Type")}
                                            filter="text"
                                            width="140px"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="billType"
                                            title="Bill Type"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Bill Type")}
                                            filter="text"
                                            width="100px"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="billRate"
                                            title="Max Bill Rate"
                                            width="120px"
                                            filter="numeric"
                                            filterable={false}
                                            sortable={false}
                                            cell={(props) => {
                                                return (
                                                    <td contextMenu="Max Bill Rate"
                                                        className="pr-3 text-right"
                                                        title={props.dataItem.billRate}
                                                    >
                                                        {currencyFormatter(props.dataItem.billRate)}
                                                    </td>
                                                );
                                            }}
                                            columnMenu={ColumnMenu}
                                        />
                                        <GridColumn
                                            field="validFrom"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            title="Valid From"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Valid From")}
                                            width="100px"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="validTo"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            title="Valid To"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Valid To")}
                                            width="100px"
                                            filterable={false}
                                            sortable={false}
                                        />
                                    </Grid>
                                </div>
                                <div className="row mb-2 mb-lg-4 ml-0 mr-0">
                                    <div className="col-12 text-center text-right font-regular">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                            Close
                                        </button>
                                        <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={(e) => this.removeAndSave()}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Remove and Save
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

    // on cancel
    private onCancel() {
        this.props.handleNo();
        this.setState({ exisitingGroupIds: [] });
    }
   
    // On Save and Remove
    private removeAndSave() {
        this.props.handleYes();
        this.setState({ exisitingGroupIds: [] });
    }
}
