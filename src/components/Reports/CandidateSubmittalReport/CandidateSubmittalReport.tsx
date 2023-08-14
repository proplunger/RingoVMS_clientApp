import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CandidateStatusCell, CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, PayPeriodCell, ExportExcel, ReqNumberCell, ProviderCell } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, initialDataState } from "../../../HelperMethods";
import { errorToastr, history, successToastr } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";


export interface CandidateSubmittalReportProps {
    location?: any;
}

export interface CandidateSubmittalReportState {
    searchString: string;
    data: any;
    allData?: any;
    clientId?: string;
    vendorId?: string;
    dataState: any;
    showRemoveModal?: boolean;
    showCopyModal?: boolean;
    showLoader?: boolean;
    totalCount?: number;
    showHoldPositionModal?: any;
    showReqHistoryModal?: any;
    onFirstLoad: boolean;
}

class CandidateSubmittalReport extends React.Component<CandidateSubmittalReportProps, CandidateSubmittalReportState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: CandidateSubmittalReportProps) {
        super(props);
        this.state = {
            searchString: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getCandidateSubmittalReport = (dataState) => {
        dataState = { sort: [{ field: "reqNumber", dir: "desc" }], ...dataState };
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        let finalQueryString = CreateQueryString(dataState,this.state.clientId, this.state.vendorId);
        axios.get(`api/report/cs?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getCandidateSubmittalReportCount(dataState);
        });
    };


    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getCandidateSubmittalReport(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    advancedSearchStates = () => {
        let states = {
            division: "",
            originalDivision: [],
            location: "",
        };
        return states;
    };

    render() {
        var params = new URLSearchParams(this.props.location.search);
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-block">
                    <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
                        <BreadCrumbs></BreadCrumbs>
                            <span className="float-right text-dark cursor-pointer">
                                {ExportExcel(this.state.allData)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getCandidateSubmittalReport}
                        entityType={"Candidate"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="CandidateSubmittalReport"
                    />
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead">
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
                            className="kendo-grid-custom lastchild report-grid"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn field="reqNumber" 
                           // width="150px" 
                            title="Req#" cell={ReqNumberCell} columnMenu={ColumnMenu} />
                            {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&<GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                            />
                            }
                            <GridColumn
                                field="candidateName"
                                title="Candidate Name"
                                cell={(props) => ProviderCell(props)}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="email"
                              //  width="160px"
                                title="Email"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Email")}
                            />
                            <GridColumn
                                field="submittedOn"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                //width="110px" 
                                title="Submitted On"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Submitted On")}
                            />
                            <GridColumn
                                field="vendor"
                                //width="150px" 
                                title="Submitted By"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Submitted By")}
                            />
                            <GridColumn field="status" 
                            //width="250px" 
                            title="Status" columnMenu={ColumnMenu} cell={CandidateStatusCell} />
                            <GridColumn sortable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                    {params.get('filter') && <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                Close
                            </button>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
    getCandidateSubmittalReportCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
        axios.get(`api/report/cs?${finalQueryString}`).then((res) => {
            this.setState({
                allData: res.data,
                totalCount: res.data.length,
            });
        });
    };
}
export default CandidateSubmittalReport;
