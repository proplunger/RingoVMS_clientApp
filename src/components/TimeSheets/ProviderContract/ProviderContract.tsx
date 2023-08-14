import * as React from "react";
import { Grid, GridNoRecords, GridColumn } from "@progress/kendo-react-grid";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { GridNoRecord, CellRender, DetailColumnCell } from "../../Shared/GridComponents/CommonComponents";
import { dateFormatter, history, initialDataState } from "../../../HelperMethods";
import { toODataString } from "@progress/kendo-data-query";
import axios from "axios";
import { ViewMoreComponent } from "./ViewMoreCell";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import auth from '../../Auth';
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { BillRateStatus } from "../../Shared/AppConstants";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ProviderContractProps {
    location?: any;
    match?: any;
}

export interface ProviderContractState {
    data: any;
    dataState?: any;
    showLoader?: boolean;
    total?: number;
    previousState?: any;
}

class ProviderContract extends React.Component<ProviderContractProps, ProviderContractState> {
    previousState = this.props.location.state;
    private candSubmissionId;
    private tsWeekId;
    constructor(props: ProviderContractProps) {
        super(props);
        this.state = { data: [], dataState: initialDataState, showLoader: true };
    }

    componentDidMount() {
        const { id, tsWeekId } = this.props.match.params;
        this.candSubmissionId = id;
        this.tsWeekId = tsWeekId;
        this.getCandSubDetails(id);
    }

    getCandSubDetails = (candSubmissionId) => {
        axios.get(`api/ts/jobsummary?id=${candSubmissionId}`).then((res) => {
            this.setState({
                previousState: res.data
            }, () => {
                this.getProviderContract(initialDataState);
            });
        });
    }

    getProviderContract = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        this.setState({ showLoader: true });

        axios.get(`api/ts/servicetype?tsWeekId=${this.tsWeekId}&${queryStr}&$filter=status ne '${BillRateStatus.REJECTED}' and status ne '${BillRateStatus.PENDINGAPPROVAL}'`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getProviderContractCount(dataState);
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getProviderContract(changeEvent.data);
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-11 fonFifteen paddingLeftandRight">
                        <BreadCrumbs globalData={{candSubmissionId:this.candSubmissionId,tsWeekId:this.tsWeekId}}></BreadCrumbs> 
                        </div>
                        <div className="col-1 d-flex justify-content-end">
                             {auth.hasPermissionV2(AppPermissions.CAND_SUB_BILL_RATE_UPDATE)
                                && <Link to={`/jobdetail/${this.candSubmissionId}`}>
                                    <FontAwesomeIcon icon={faPencilAlt} className="ml-1 active-icon-blue"></FontAwesomeIcon>
                                </Link>
                            }
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-3 pr-sm-0">
                            <div className="row">
                                <div className="col-auto text-right font-weight-normal pr-2">Provider :</div>
                                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {(this.state.previousState && this.state.previousState.candidateName) || "-"}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-3 pr-sm-0">
                            <div className="row">
                                <div className="col-auto text-right font-weight-normal pr-2">Position :</div>
                                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {(this.state.previousState && this.state.previousState.position) || "-"}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-3">
                            <div className="row">
                                <div className="col-auto col-sm-7 text-right font-weight-normal pr-2">Division :</div>
                                <div className="col col-sm-5 font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {(this.state.previousState && this.state.previousState.division) || "-"}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-3 pl-0">
                            <div className="row justify-content-end ml-0 mr-0">
                                <div className="col-auto col-sm text-right font-weight-normal pr-2 pl-lg-0">Location :</div>
                                <div className="col col-sm-auto font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {(this.state.previousState && this.state.previousState.location) || "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="myOrderContainer global-action-grid-onlyhead">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            pageable={{ pageSizes: true }}
                            onDataStateChange={this.onDataStateChange}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            className="kendo-grid-custom lastchild"
                            total={this.state.total}
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                            {/* <GridColumn
                                field="serviceCategory"
                                title="Service Category"
                                cell={(props) => CellRender(props, "Service Category")}
                                columnMenu={ColumnMenu}
                            /> */}
                            <GridColumn
                                field="name"
                                title="Service Type"
                                cell={(props) => CellRender(props, "Service Type")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn field="billType" title="Bill Type" columnMenu={ColumnMenu} cell={(props) => CellRender(props, "Bill Type")} />
                            <GridColumn
                                field="billRate"
                                title="Bill Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Bill Rate", true)}
                            />

                            <GridColumn
                                field="overrideBillRate"
                                title="Override Bill Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Override Bill Rate", true)}
                            />
                            <GridColumn
                                field="holidayBillRate"
                                //width="105px"
                                title="Holiday Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Holiday Rate", true)}
                            />
                            <GridColumn
                                field="overrideHolidayBillRate"
                                width="170px"
                                title="Override Holiday Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Override Holiday Rate", true)}
                            />
                            <GridColumn
                                field="guaranteedHours"
                                width="170px"
                                title="Guaranteed Hours"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Guaranteed Hours")}
                            />
                            <GridColumn
                                field="startDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Valid From"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Valid From")}
                            />
                            <GridColumn
                                field="endDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Valid To"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                let endDate = new Date(props.dataItem.endDate).getFullYear() - new Date().getFullYear() > 10 ? "-" : dateFormatter(props.dataItem.endDate)
                                return <td contextMenu="Valid To" title={endDate}>
                                    {endDate}
                                </td>
                                }}
                            />
                            <GridColumn sortable={false} field="expanded" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                    <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">

                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faArrowAltCircleLeft} className={"mr-1"} />
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getProviderContractCount = (dataState) => {
        var finalState = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        axios.get(`api/ts/servicetype?tsWeekId=${this.tsWeekId}&${queryStr}&$filter=status ne '${BillRateStatus.REJECTED}' and status ne '${BillRateStatus.PENDINGAPPROVAL}'`).then((res) => {
            this.setState({
                total: res.data.length,
            });
        });
    };
}

export default ProviderContract;
