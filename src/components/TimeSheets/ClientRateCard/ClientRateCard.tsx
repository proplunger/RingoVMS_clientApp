import * as React from "react";
import axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { State, toODataString } from "@progress/kendo-data-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faPencilAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { history, initialDataState } from "../../../HelperMethods";
import auth from "../../Auth";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ClientRateCardProps {
    match: any;
}

export interface ClientRateCardState {
    data: any;
    dataState: any;
    provider?:string;
    candSubmissionId?:string;
    clientId?: string;
    divisionId?: string;
    locationId?: string;
    positionId?:string;
    division?: string;
    location?: string;
    position?:string;
    showLoader?: boolean;
    tsWeekId?: string;
    total?:any;
}

class ClientRateCard extends React.Component<ClientRateCardProps, ClientRateCardState> {
    constructor(props: ClientRateCardProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            showLoader: true,
        };
       
    }

    getCandSubDetails=(candSubmissionId)=>{
        axios.get(`api/ts/jobsummary?id=${candSubmissionId}`).then((res) => {
            this.setState({
                clientId:res.data.clientId,
                positionId:res.data.positionId,
                divisionId:res.data.divisionId,
                locationId:res.data.locationId,
                division:res.data.division,
                location:res.data.location,
                position:res.data.position,
                provider:res.data.candidateName
            }, () => {
                this.getClientRateCard(this.state.dataState);
            });
        });
    }

    getClientRateCard = (dataState) => {
        this.setState({ showLoader: true });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        const queryParams = `clientId eq ${this.state.clientId} and positionId eq ${this.state.positionId} and divisionId eq ${this.state.divisionId} and locationId eq ${this.state.locationId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        axios.get(`api/ts/ratecard?${finalQueryString}`)
        .then((res) => {
            this.setState({ data: res.data });
            this.getClientRateCardCount(dataState);
        })
    }

    getClientRateCardCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        const queryParams = `clientId eq ${this.state.clientId} and positionId eq ${this.state.positionId} and divisionId eq ${this.state.divisionId} and locationId eq ${this.state.locationId}`;
        var finalQueryString = `$filter=${queryParams}&${queryStr}`;
        if (dataState.filter) {
            if (dataState.filter.filters.length > 0) {
                var splitQueryArr = queryStr.split("$filter=");
                splitQueryArr[1] = queryParams + " and " + splitQueryArr[1];
                finalQueryString = splitQueryArr.join("$filter=");
            }
        }
        axios.get(`api/ts/ratecard?${finalQueryString}`).then((res) => {
            this.setState({
                total: res.data.length,
                showLoader:false
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getClientRateCard(changeEvent.data);
    };

    componentDidMount() {
        const { id, tsWeekId } = this.props.match.params;
        this.setState({ candSubmissionId: id, tsWeekId:tsWeekId });
        this.getCandSubDetails(id);
    }

    render() {
        const { provider, division, location, position } = this.state;
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-11 fonFifteen paddingLeftandRight">
                            <BreadCrumbs globalData={{candSubmissionId:this.state.candSubmissionId,tsWeekId:this.state.tsWeekId}}></BreadCrumbs> 
                            </div>
                            <div className="col-1 d-flex justify-content-end">
                            {auth.hasPermissionV2(AppPermissions.CLIENT_RATE_CARD_UPDATE)
                             && <Link to={`/admin/clientratecard/manage`}>
                                    <FontAwesomeIcon icon={faPencilAlt} className="ml-1 active-icon-blue"></FontAwesomeIcon>
                                </Link> 
                            }
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-6">
                            <div className="row">
                                <div className="col-auto text-right font-weight-normal pr-2">Provider :</div>
                                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {provider || "-"}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-auto text-right font-weight-normal pr-2">Division :</div>
                                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {division || "-"}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="row">
                                <div className="col-auto col-sm-7 text-right font-weight-normal pr-2">Position :</div>
                                <div className="col col-sm-5 font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {position || "-"}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-auto col-sm-7 text-right font-weight-normal pr-2">Location :</div>
                                <div className="col col-sm-5 font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {location || "-"}
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
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            total={this.state.total}
                            {...this.state.dataState}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="serviceType"
                                title="Service Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Service Type")}
                                filter="text"
                            />
                            <GridColumn
                                field="billType"
                                title="Bill Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Bill Type")}
                                filter="text"
                            />
                            <GridColumn
                                field="billRate"
                                title="Bill Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Bill Rate", true)}
                                filter="text"
                            />
                            <GridColumn
                                field="holidayBillRate"
                                title="Holiday Bill Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Holiday Bill Rate", true)}
                            />
                           
                            
                            <GridColumn
                                field="validFrom"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Rate Valid From"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Rate Valid From")}
                            />
                            <GridColumn
                                field="validTo"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Rate Valid To"
                                headerClassName="text-left"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Rate Valid To")}
                            />
                        </Grid>
                    </div>
                    <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">
                            
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                onClick={()=>history.goBack()}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                    Close
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
export default ClientRateCard;
