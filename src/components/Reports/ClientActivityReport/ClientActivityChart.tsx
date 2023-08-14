import * as React from "react";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { currencyFormatter } from "../../../HelperMethods";
import Chart from "react-google-charts";
import ReactToPdf from "react-to-pdf";
import _ from "lodash";
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { ShimmerEffectTabChart, ShimmerEffectTabChartReq } from "../../ReusableComponents";
//const colorCode = ['#66a3f9', '#6ae853', '#da8e2e', '#ffd025'];
const colorCode = [
    "#ffa500",
    "#64c2a6",
    "#f47a1f",
    "#007cc3",
    "#3e7cc3",
    "gray",
    "orange",
    "lightblue",
];
const hAxis = {
    title: 'Total Billable ($)',
    titleTextStyle: { fontSize: 12, bold: true, italic: false, fontName: 'open sans' },
    minValue: 0,
    format: 'short'
};
const vAxixTextStyle = { fontSize: 12, bold: true, italic: false, fontName: 'open sans' };


export interface ClientActivityChartProps {
    data?: any;
}

export interface ClientActivityChartState {
    divsionGroup?: any[];
    locationGroup?: any[];
    positionGroup?: any[];
    divsionGroupChart?: any[];
    locationGroupChart?: any[];
    positionGroupChart?: any[];
    divisionGroupData?: any[];
    locationGroupData?: any[];
    positionGroupData?: any[];
    showLoader?: boolean;
    firstLoad?: boolean;
}

const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};

const groupByData = (byName) => {
    return Object.keys(byName).map(name => {
        const hours = byName[name].reduce((acc, it) => acc + it.totalHours, 0)
        const amount = byName[name].reduce((acc, it) => acc + it.totalAmount, 0)
        return {
            'name': name,
            totalHours: hours,
            totalAmount: amount
        }
    })
}

class ClientActivityChart extends React.Component<ClientActivityChartProps, ClientActivityChartState> {
    componentRef1: HTMLDivElement;
    componentRef2: HTMLDivElement;
    componentRef3: HTMLDivElement;
    constructor(props: ClientActivityChartProps) {
        super(props);
        this.state = {
            firstLoad: true,
            divisionGroupData: [[
                'Element',
                'Density',
                { role: 'tooltip', p: { 'html': true } },
                { role: 'style' },
                {
                    sourceColumn: 0,
                    role: 'annotation',
                    type: 'string',
                    calc: 'stringify',
                },
            ]],
            locationGroupData: [[
                'Element',
                'Density',
                { role: 'tooltip', p: { 'html': true } },
                { role: 'style' },
                {
                    sourceColumn: 0,
                    role: 'annotation',
                    type: 'string',
                    calc: 'stringify',
                },
            ]],
            positionGroupData: [[
                'Element',
                'Density',
                { role: 'tooltip', p: { 'html': true } },
                { role: 'style' },
                {
                    sourceColumn: 0,
                    role: 'annotation',
                    type: 'string',
                    calc: 'stringify',
                },
            ]],
        };

    }
    public componentDidMount() {
        if (this.props.data) {
            const data = this.props.data;
            this.setState({
                divsionGroup: groupByData(groupBy(data, "division")).sort((a, b) => b.totalAmount - a.totalAmount),
                locationGroup: groupByData(groupBy(data, "location")).sort((a, b) => b.totalAmount - a.totalAmount),
                positionGroup: groupByData(groupBy(data, "position")).sort((a, b) => b.totalAmount - a.totalAmount),
                divsionGroupChart: groupByData(groupBy(data, "division")).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5),
                locationGroupChart: groupByData(groupBy(data, "location")).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5),
                positionGroupChart: groupByData(groupBy(data, "position")).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5),
                firstLoad: false
            }, () => {
                this.state.divsionGroupChart.forEach((element, index) => {
                    this.state.divisionGroupData.push([element.name, element.totalAmount, this.createCustomHTMLContent(element.totalAmount, element.totalHours), colorCode[index], null])
                });
                this.state.locationGroupChart.forEach((element, index) => {
                    this.state.locationGroupData.push([element.name, element.totalAmount, this.createCustomHTMLContent(element.totalAmount, element.totalHours), colorCode[index], null])
                });
                this.state.positionGroupChart.forEach((element, index) => {
                    this.state.positionGroupData.push([element.name, element.totalAmount, this.createCustomHTMLContent(element.totalAmount, element.totalHours), colorCode[index], null])
                });
                this.setState(this.state);

                //console.log(this.state.divsionGroup,this.state.locationGroup,this.state.positionGroup)
            })
        }
    }

    createCustomHTMLContent = (totalAmount, totalHours) => {
        return '<div style="padding:5px 5px 5px 5px;">' +
            '<div class="font-weight-bold no-wrap">Total Hours (' + totalHours.toFixed(2) + ')</div>' +
            '<div class="font-weight-bold no-wrap">Total Billable (' + currencyFormatter(totalAmount.toFixed(2)) + ')</div>'
            + '</div>';
    }

    render() {
        const { divsionGroup, positionGroup, locationGroup, divisionGroupData, positionGroupData, locationGroupData } = this.state;
        const ref = React.createRef();
        return (
            <div className="container-fluid px-0" ref={() => ref}>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="row mx-2">
                            <div className="col-sm-6 col-lg-4 px-2">
                                <div className="col-sm-12 graphh report-shadow" ref={el => (this.componentRef1 = el)}>

                                    <ReactToPrint
                                        trigger={() => {
                                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                            // to the root node of the returned component as it will be overwritten.
                                            return <div className={`row justify-content-between pt-3`}>
                                                <div className={'col-auto'}>
                                                    <label className="chart-header">Activity By Divisions</label>
                                                </div>
                                                <div className={`mr-3 float-right text-dark shadow invoice cursor-pointer print`}
                                                    title="Print">
                                                    {" "}
                                                    <FontAwesomeIcon
                                                        className="faclock_size d-block"
                                                        icon={faFilePdf}
                                                        style={{ color: "white" }}
                                                    />{" "}
                                                </div>
                                            </div>;
                                        }}
                                        documentTitle="Client Activity Report_By Divisions"
                                        content={() => this.componentRef1}
                                    ></ReactToPrint>
                                    {!this.state.firstLoad && this.state.divisionGroupData.length==1 ? <div style={{ height: "100px", paddingTop: "40px", textAlign: "center" }}>No records found!</div> :
                                        this.state.divisionGroupData.length > 1 ?
                                            <Chart
                                                className="chart_heighty mt-3 w-100"
                                                chartType="BarChart"
                                                loader={<div style={{
                                                    transform: "rotate(90deg)"
                                                }}>
                                                    {ShimmerEffectTabChartReq()}
                                                </div>}
                                                data={divisionGroupData}
                                                options={{
                                                    tooltip: { isHtml: true },
                                                    //title: 'Activity By Division',
                                                    bar: { groupWidth: '50%', height: "20px" },
                                                    legend: { position: 'none' },
                                                    hAxis: hAxis,
                                                    vAxis: {
                                                        title: 'Division',
                                                        titleTextStyle: vAxixTextStyle,
                                                    },
                                                    chartArea: {
                                                        left: 120,
                                                        height: 250,
                                                        width: 480,
                                                    }
                                                }}
                                            />
                                            : <div style={{
                                                width: '530px',
                                                height: '350px',
                                                transform: "rotate(90deg)"
                                            }}>
                                                {ShimmerEffectTabChartReq()}
                                            </div>
                                    }
                                    <div className="chart-summary border-top" >
                                        <label className="mb-0">Summary</label>
                                    </div>

                                    <div className="myOrderContainer gridshadow-chart  pb-3 chart-table mt-0">
                                        <Grid
                                            style={{ height: "auto" }}
                                            data={divsionGroup}
                                            className="kendo-grid-custom lastchild chart-grid global-action-grid-onlyhead"
                                        >
                                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                            <GridColumn
                                                field="name"
                                                title="Division"
                                                width="180px"
                                                cell={(props) => CellRender(props, "Division")}
                                            />
                                            <GridColumn
                                                field="totalHours"
                                                title="Total Hours"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Hours"}
                                                            className="pr-4 text-right"
                                                            title={props.dataItem.totalHours}
                                                        >
                                                            {props.dataItem.totalHours ? props.dataItem.totalHours.toFixed(2) : "0.00"}
                                                        </td>
                                                    );
                                                }}
                                            />
                                            <GridColumn
                                                field="totalAmount"
                                                title="Total Billable"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Billable"}
                                                            className="pr-3 text-right"
                                                            title={props.dataItem.totalAmount}
                                                        >
                                                            {currencyFormatter(props.dataItem.totalAmount)}
                                                        </td>
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4  px-2 mt-4 mt-sm-0">
                                <div className="col-sm-12 report-shadow graphh" ref={el => (this.componentRef2 = el)}>
                                    <ReactToPrint
                                        trigger={() => {
                                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                            // to the root node of the returned component as it will be overwritten.
                                            return <div className={`row justify-content-between pt-3`}
                                                title="Print">
                                                <div className={'col-auto'}>
                                                    <label className="chart-header">Activity By Locations</label>
                                                </div>
                                                <div className={`mr-3 float-right text-dark shadow invoice cursor-pointer print`}
                                                    title="Print">
                                                    {" "}
                                                    <FontAwesomeIcon
                                                        className="faclock_size d-block"
                                                        icon={faFilePdf}
                                                        style={{ color: "white" }}
                                                    />{" "}
                                                </div>
                                            </div>;
                                            // return <div className={`row justify-content-end pt-3`}
                                            //     title="Print"><div className={`mr-3 float-right text-dark shadow invoice cursor-pointer print`}
                                            //         title="Print">
                                            //         {" "}
                                            //         <FontAwesomeIcon
                                            //             className="faclock_size d-block"
                                            //             icon={faFilePdf}
                                            //             style={{ color: "white" }}
                                            //         />{" "}
                                            //     </div>
                                            // </div>;
                                        }}
                                        documentTitle="Client Activity Report_By Locations"
                                        content={() => this.componentRef2}
                                    />
                                    {!this.state.firstLoad && this.state.locationGroupData.length==1 ? <div style={{ height: "100px", paddingTop: "40px", textAlign: "center" }}>No records found!</div> :
                                        this.state.locationGroupData.length > 1 ? <Chart
                                            className="chart_heighty mt-3"
                                            chartType="BarChart"
                                            loader={<div style={{
                                                transform: "rotate(90deg)"
                                            }}>
                                                {ShimmerEffectTabChartReq()}
                                            </div>}
                                            data={locationGroupData}
                                            options={{
                                                tooltip: { isHtml: true },
                                                //   title: 'Activity By Location',
                                                bar: { groupWidth: '50%', height: 10 },
                                                legend: { position: 'none' },
                                                hAxis: hAxis,
                                                vAxis: {
                                                    title: 'Location',
                                                    titleTextStyle: vAxixTextStyle,
                                                },
                                                chartArea: {
                                                    left: 120,
                                                    height: 250,
                                                    width: 480,
                                                }
                                            }}
                                        /> : <div style={{
                                            width: '530px',
                                            height: '350px',
                                            transform: "rotate(90deg)"
                                        }}>
                                            {ShimmerEffectTabChartReq()}
                                        </div>
                                    }
                                    <div className="chart-summary border-top" >
                                        <label className="mb-0">Summary</label>
                                    </div>
                                    <div className="myOrderContainer gridshadow-chart  pb-3 chart-table mt-0">
                                        <Grid
                                            style={{ height: "auto" }}
                                            data={locationGroup}
                                            className="kendo-grid-custom lastchild chart-grid global-action-grid-onlyhead"
                                        >
                                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                            <GridColumn
                                                field="name"
                                                title="Location"
                                                width="180px"
                                                cell={(props) => CellRender(props, "Division")}
                                            />
                                            <GridColumn
                                                field="totalHours"
                                                title="Total Hours"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Hours"}
                                                            className="pr-4 text-right"
                                                            title={props.dataItem.totalHours}
                                                        >
                                                            {props.dataItem.totalHours ? props.dataItem.totalHours.toFixed(2) : "0.00"}
                                                        </td>
                                                    );
                                                }}
                                            />
                                            <GridColumn
                                                field="totalAmount"
                                                title="Total Billable"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Billable"}
                                                            className="pr-3 text-right"
                                                            title={props.dataItem.totalAmount}
                                                        >
                                                            {currencyFormatter(props.dataItem.totalAmount)}
                                                        </td>
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4  px-2 mt-4 mt-sm-4 mt-lg-0">
                                <div className="col-sm-12 report-shadow graphh" ref={el => (this.componentRef3 = el)}>
                                    <ReactToPrint
                                        trigger={() => {
                                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                            // to the root node of the returned component as it will be overwritten.
                                            // return <span className={`mr-2 float-right text-dark shadow invoice cursor-pointer print`}
                                            //     title="Print">
                                            //     {" "}
                                            //     <FontAwesomeIcon
                                            //         className="faclock_size d-block"
                                            //         icon={faFilePdf}
                                            //         style={{ color: "white" }}
                                            //     />{" "}
                                            // </span>;
                                            return <div className={`row justify-content-between pt-3`}
                                                title="Print">
                                                <div className={'col-auto'}>
                                                    <label className="chart-header">Activity By Positions</label>
                                                </div>
                                                <div className={`mr-3 float-right text-dark shadow invoice cursor-pointer print`}
                                                    title="Print">
                                                    {" "}
                                                    <FontAwesomeIcon
                                                        className="faclock_size d-block"
                                                        icon={faFilePdf}
                                                        style={{ color: "white" }}
                                                    />{" "}
                                                </div>
                                            </div>;
                                        }}
                                        documentTitle="Client Activity Report_By Positions"
                                        content={() => this.componentRef3}
                                    />

                                    {!this.state.firstLoad && this.state.positionGroupData.length==1 ? <div style={{ height: "100px", paddingTop: "40px", textAlign: "center" }}>No records found!</div> :
                                        this.state.positionGroupData.length > 1 ?
                                            <Chart
                                                className="chart_heighty mt-3"
                                                chartType="BarChart"
                                                loader={<div style={{
                                                    transform: "rotate(90deg)"
                                                }}>
                                                    {ShimmerEffectTabChartReq()}
                                                </div>}
                                                data={positionGroupData}
                                                options={{
                                                    tooltip: { isHtml: true },
                                                    //    title: 'Activity By Position',
                                                    bar: { groupWidth: '50%', height: "20px" },
                                                    legend: { position: 'none' },
                                                    hAxis: hAxis,
                                                    vAxis: {
                                                        title: 'Position',
                                                        titleTextStyle: vAxixTextStyle,
                                                    },
                                                    chartArea: {
                                                        left: 120,
                                                        height: 250,
                                                        width: 480,
                                                    }
                                                }}
                                            /> : <div style={{
                                                width: '530px',
                                                height: '340px',
                                                transform: "rotate(90deg)"
                                            }}>
                                                {ShimmerEffectTabChartReq()}
                                            </div>
                                    }
                                    <div className="chart-summary border-top" >
                                        <label className="mb-0">Summary</label>
                                    </div>
                                    <div className="myOrderContainer gridshadow-chart  pb-3 chart-table mt-0">
                                        <Grid
                                            style={{ height: "auto" }}
                                            data={positionGroup}
                                            className="kendo-grid-custom lastchild chart-grid global-action-grid-onlyhead"
                                        >
                                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                            <GridColumn
                                                field="name"
                                                title="Position"
                                                width="180px"
                                                cell={(props) => CellRender(props, "Division")}
                                            />
                                            <GridColumn
                                                field="totalHours"
                                                title="Total Hours"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Hours"}
                                                            className="pr-4 text-right"
                                                            title={props.dataItem.totalHours}
                                                        >
                                                            {props.dataItem.totalHours ? props.dataItem.totalHours.toFixed(2) : "0.00"}
                                                        </td>
                                                    );
                                                }}
                                            />
                                            <GridColumn
                                                field="totalAmount"
                                                title="Total Billable"
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"Total Billable"}
                                                            className="pr-3 text-right"
                                                            title={props.dataItem.totalAmount}
                                                        >
                                                            {currencyFormatter(props.dataItem.totalAmount)}
                                                        </td>
                                                    );
                                                }}
                                            />
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}
export default ClientActivityChart;
