import React, { Component } from "react";
import "../../assets/css/App.css";
import './DashBoardStyles.css'
import KPI from "./KPI";
import MyTask from "./MyTasks";
import auth from '../Auth'
import CandidateChartContainer from './Charts/CandidateCharts'
import DataChartContainer from "./Charts/RequistionCharts";
import { AppPermissions } from "../Shared/Constants/AppPermissions";
export interface DashBoardComponentProps {
    match?: any;
    location?: any;
}
export interface DashBoardComponentState {
    key?: any;
}
class DashBoardComponent extends Component<DashBoardComponentProps, DashBoardComponentState> {

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount() {
        if (this.props.location.key) {
            this.setState({ key: this.props.location.key })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.key != this.props.location.key) {
            this.setState({ key: nextProps.location.key })
        }
    }
    render() {
        return (
            <div className="container-fluid mt-0 dashboard-bgcolor" key={this.state.key}>
                {/* KPI's Starts */}
                <div className="row">
                    <div className="col-md-12 mb-0">
                        <div className="col-12 col-sm-11 mx-auto text-center my-0 mt-0 mb-0 pl-0 pr-0 for-dashboard">
                            <div className="row text-left mt-3 mb-2 underline border-bottom mx-0 align-items-center mx-1 ">
                                <div className="col px-0">
                                    <h5 className="mb-2 font-weight-bold">DASHBOARD</h5>
                                </div>
                                {/* <div className="col-auto pr-0">
                                    <small className="d-flex align-items-center" style={{ fontSize: "12px" }}>Filter Your Dashboard <span>
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown  far fa-ellipsis-h px-2 border-0 mb-0 pb-1 ffilter-dashboard" type="button"
                                                id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="false" style={{ fontSize: "22px", backgroundColor: "transparent", color: "#4987ec" }}></button>
                                            <div className="dropdown-menu dropdown-primary">
                                                <a className="dropdown-item text-black" href="#"><i
                                                    className="far fa-envelope ml-2"></i>&nbsp;&nbsp;Dashboard 1</a>
                                                <a className="dropdown-item text-black" href="#"><i
                                                    className="far fa-envelope ml-2"></i>&nbsp;&nbsp;Dashboard 2</a>
                                                <a className="dropdown-item text-black" href="#"><i
                                                    className="far fa-envelope ml-2"></i>&nbsp;&nbsp;Dashboard 3</a>
                                            </div>
                                        </div>
                                    

                                    </span></small>
                                </div> */}

                            </div>
                            <KPI />

                        </div>

                    </div>
                </div>
                {/* KPI's Ends */}

                {/* Tasks Starts */}
                <div className="row mt-3">
                    <div className="col-md-12 mb-0">
                        <div className="col-12 col-sm-11 mx-auto text-center my-0 mt-0 mb-0 pl-0 pr-0">
                            <div className="row text-left mt-0 mb-2 underline border-bottom mx-0 align-items-center mx-1">
                                <div className="col-12 text-left px-0">
                                    <h5 className="mb-2 font-weight-bold">MY TASKS</h5>
                                </div>
                            </div>
                            <MyTask />
                        </div>

                    </div>
                </div>
                {/* Tasks Ends */}

                {/* Chart Starts */}
                <div className="row mx-0 mt-2">
                    <div className="col-12 col-sm-11 mx-auto text-center my-0 mt-0 mb-0">

                        <div className="row">



                            {auth.hasPermissionV2(AppPermissions.REQ_VIEW) && <div className="col-sm-6 py-2 px-1">
                                <div className="card h-100 shadow-sm">
                                   
                                        <h5 className="mb-0 font-weight-bold text-left chartHeader_font-size dash-header">Requisition Workflow</h5>
                                   
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        <div className="row mt-0 justify-content-center align-items-center">
                                            <DataChartContainer />
                                        </div>

                                        {/* <div className="row mt-3 justify-content-center">
                                        <img src="https://i.ibb.co/hWytPGf/first.png" className="w-75" />

                                    </div>
                                    <div className="row mt-3 align-items-center justify-content-start mx-0">
                                        <div className="col-auto">
                                            <div className="row align-items-center">
                                                <div className="shadow-sm graph_name_cleared">
                                                </div>
                                                <div className="col pl-2"> Name Cleared</div>
                                            </div>
                                        </div>

                                        <div className="col-auto">
                                            <div className="row align-items-center">
                                                <div className="shadow-sm graphs-div graph_name_not_cleared">
                                                </div>
                                                <div className="col  pl-2"> Name Not Cleared</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="row align-items-center">
                                                <div className="shadow-sm graphs-div graph-delegate-not-cleared">
                                                </div>
                                                <div className="col  pl-2"> Delegate Not Cleared</div>
                                            </div>
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                            </div>}
                            {auth.hasPermissionV2(AppPermissions.CAND_SUB_VIEW) && <div className="col-sm-6 py-2 px-1">
                                <div className="card h-100 shadow-sm">
                                <h5 className="mb-0 font-weight-bold text-left chartHeader_font-size dash-header">Candidate Workflow</h5>
                                    <div className="card-body d-flex align-items-center justify-content-center">
                                        
                                        <div className="row mt-0 justify-content-center align-items-center">
                                            <CandidateChartContainer />
                                        </div>

                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="row mt-2 d-none">
                    <div className="col-12">
                        <div className="col-12 col-sm-11 mx-auto text-center my-0 mt-0 mb-0 pl-0 pr-0">
                            <div className="row text-left mt-0 mb-2 underline border-bottom mx-0 align-items-center mx-0">
                                <div className="col-sm-6 py-2 px-2">
                                    <div className="card card-body h-100 shadow-sm">
                                        <div style={{ fontWeight: 600 }}>Candidate</div>
                                        {/* <DataChartContainer /> */}
                                        {/* <div className="card-body">

                                            <div className="row mt-3 justify-content-center">
                                                <img src="https://i.ibb.co/8B0j5zq/Second.png" className="w-75" />
                                            </div>
                                            <div className="row mt-3 align-items-center justify-content-start mx-0">
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graphs-div">
                                                        </div>
                                                        <div className="col pl-2"> Presentation Submitted By Vendor</div>
                                                    </div>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graphs-div graph-review-by-client">
                                                        </div>
                                                        <div className="col  pl-2"> Reviewed By Client</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto mt-2">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graphs-div graph_interview-schedule">
                                                        </div>
                                                        <div className="col  pl-2"> Interview Schedule</div>
                                                    </div>
                                                </div>
                                            </div>
                                          
                                        </div> */}

                                    </div>
                                </div>
                                <div className="col-sm-6 py-2 px-2">
                                    <div className="card card-body h-100 shadow-sm">
                                        <div style={{ fontWeight: 600 }}>Requistions</div>
                                        <div className="card-body">
                                            <div className="row mt-3 justify-content-center">
                                                <img src="https://i.ibb.co/hWytPGf/first.png" className="w-75" />

                                            </div>
                                            <div className="row mt-3 align-items-center justify-content-start mx-0">
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graph_name_cleared">
                                                        </div>
                                                        <div className="col pl-2"> Name Cleared</div>
                                                    </div>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graphs-div graph_name_not_cleared">
                                                        </div>
                                                        <div className="col  pl-2"> Name Not Cleared</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm graphs-div graph-delegate-not-cleared">
                                                        </div>
                                                        <div className="col  pl-2"> Delegate Not Cleared</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* <div className="col-sm-6 py-2">
                                    <div className="card card-body h-100 shadow-sm">
                                        <div style={{ fontWeight: 600 }}>Interview Screening Results</div>
                                        <div className="card-body">
                                            <div className="row mt-3 justify-content-center">
                                                <img src="https://i.ibb.co/SPzmWJJ/Third.png" className="w-75" />
                                            </div>
                                            <div className="row mt-3 align-items-center justify-content-start mx-0">
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#6de564", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col pl-2"> Make Offer</div>
                                                    </div>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#109dd2", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> Save For Later</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#ff6962", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> Rejected Candidates</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto mt-2">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#dddfe1", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> Screening In-Progress</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-sm-6 py-2 pl-lg-0">
                                    <div className="card card-body h-100 shadow-sm">
                                        <div style={{ fontWeight: 600 }}>Overall Fill Positions</div>
                                        <div className="card-body">

                                            <div className="row mt-3 justify-content-center">
                                                <img src="https://i.ibb.co/3WRF7Qz/Fourth.png" className="w-75" />
                                            </div>
                                            <div className="row mt-3 align-items-center justify-content-start mx-0">
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#89e894", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col pl-2"> Filled Positions</div>
                                                    </div>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#e9d869", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> On Hold Positions</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#ff6962", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> Rejected Positions</div>
                                                    </div>
                                                </div>
                                                <div className="col-auto mt-2">
                                                    <div className="row align-items-center">
                                                        <div className="shadow-sm"
                                                            style={{ width: "16px", height: "16px", backgroundColor: "#5c8fec", borderRadius: "100px" }}>
                                                        </div>
                                                        <div className="col  pl-2"> Withdrawn</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Chart Ends */}

            </div>
        );
    }
}

export default DashBoardComponent;
