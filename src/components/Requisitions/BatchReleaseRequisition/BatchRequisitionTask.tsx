import React, { Component } from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import WithoutFilterColumnMenu from "../../Shared/GridComponents/WithoutFilterColumnMenu";
import {BatchReleaseLog} from "../ManageRequisitions/GlobalActions";


export interface IBatchRequisitionTaskProps {
    showDialog: boolean;
    handleNo: any;
    clientId: string;
    batchReleaseReqIds: any;
    title: string;
    url: string;
    distributionType?: string;
    releaseDate?: Date;
}

let initialDataState = {
    skip: 0,
    take: 10,
    filter: undefined,
};

export interface IBatchRequisitionTaskState {
    filter: undefined;
    dataState?: any;
    data: any;
    total?: any;
    clientId: string;
    batchReleaseReqIds: any;
    showLoader?: boolean;
}

export default class BatchRequisitionTask extends Component<IBatchRequisitionTaskProps, IBatchRequisitionTaskState> {
    constructor(props) {
        super(props);

        this.state = {
            filter: undefined,
            dataState: initialDataState,
            total: 0,
            clientId: "",
            batchReleaseReqIds: [],
            data: [],
            showLoader: true,
        };
    }

    componentDidMount() {
        this.setState({
            clientId: this.props.clientId,
            batchReleaseReqIds: this.props.batchReleaseReqIds,
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
                                        {this.props.title}
                                        <span className="float-right cursorElement" onClick={() => this.onCancel()}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>                                    
                                </div>
                                <div className="row">
                                    <div className="col-12 pt-2 pb-2 conflictMsg mt-2">
                                        Batch release completed successfully for distribution type <b>{this.props.distributionType}</b> and release date <b>{Intl.DateTimeFormat("en-US").format(this.props.releaseDate)}</b>. Please find the report below:
                                    </div>                                    
                                </div>
                                <div className="col-12 pl-0 pr-0">
                                    <div className="row mx-auto align-items-center">
                                        <div className="col-12 text-right">
                                            {BatchReleaseLog(this.props.batchReleaseReqIds)}                                  
                                        </div>
                                    </div>
                                </div>
                                <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
                                    <Grid                                       
                                        className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
                                        data={this.props.batchReleaseReqIds.slice(
                                            this.state.dataState.skip,
                                            this.state.dataState.take + this.state.dataState.skip
                                          )}
                                        {...this.state.dataState}
                                        expandField="expanded"
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={true}
                                        pageSize={5}
                                        total={this.state.batchReleaseReqIds.length}
                                        filterable={false}
                                        sortable={false}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>                                       
                                        {/* <GridColumn
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
                                        /> */}
                                        <GridColumn
                                            field="reqNumber"
                                            title="Req Number"
                                            cell={(props) => {
                                                return (
                                                    <td contextMenu="Req #">
                                                      <Link target="_blank" className="orderNumberTd orderNumberTdBalck" to={`${this.props.url + props.dataItem.reqId}`} style={{ color: "#007bff" }}>
                                                        {" "}
                                                        {props.dataItem.reqNumber}{" "}
                                                      </Link>
                                                    </td>
                                                  )
                                            }}
                                            // columnMenu={WithoutFilterColumnMenu}
                                            // filter="text"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="vendor"
                                            title="Vendor"
                                            cell={(props) => CellRender(props, "Vendor")}
                                            // columnMenu={WithoutFilterColumnMenu}
                                            // filter="text"
                                            filterable={false}
                                            sortable={false}
                                        />
                                        <GridColumn
                                            field="status"
                                            title="Batch Release Status"
                                            cell={(props) => CellRender(props, "Status")}
                                            // columnMenu={WithoutFilterColumnMenu}
                                            // filter="text"
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
}