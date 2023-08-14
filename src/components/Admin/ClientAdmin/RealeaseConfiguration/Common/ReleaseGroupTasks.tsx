import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { CellRender, GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import { Link } from "react-router-dom";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import { PROFILE_ALREADY_EXISTS } from "../../../../Shared/AppMessages";

export interface IReleaseGroupTaskProps {
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

export interface IReleaseGroupTaskState {
    filter: undefined;
    dataState?: any;
    data: any;
    total?: any;
    clientId: string;
    exisitingGroupIds: any;
    showLoader?: boolean;
}

export default class ReleaseGroupTask extends Component<IReleaseGroupTaskProps, IReleaseGroupTaskState> {
    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            dataState: initialDataState,
            total: 0,
            clientId: "",
            exisitingGroupIds: [],
            data: [],
            showLoader: true,
        };
    }

    componentDidMount() {
        this.setState({
            clientId: this.props.clientId,
            exisitingGroupIds: this.props.exisitingGroupIds,
            data: [],
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
                                    {PROFILE_ALREADY_EXISTS}
                                    </div>                                    
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid                                       
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                        data={this.props.exisitingGroupIds.slice(
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
        this.setState({ data: [] });
    }

    private removeAndSave() {
        this.props.handleYes();
        this.setState({ data: [] });
    }
}
