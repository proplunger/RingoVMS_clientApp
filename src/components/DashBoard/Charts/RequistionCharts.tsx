import { toODataString } from "@progress/kendo-data-query";
import axios from "axios";
import _ from "lodash";
import { extend } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Chart from "react-google-charts";
import { currencyFormatter } from "../../../HelperMethods";
import { KendoFilter, ShimmerEffectTabChart, ShimmerEffectTabChartReq } from "../../ReusableComponents";
import auth from "../../Auth";
import { AuthRole, ReqStatus } from "../../Shared/AppConstants";

const colorCode = [
    "#ffa500",
    "#ffdd00",
    "#008000",
    "#9eeea1",
    "#3e7cc3",
    "gray",
    "orange",
    "lightblue",
];
const hAxis = {
    titleTextStyle: {
        fontSize: 12,
        bold: true,
        italic: false,
        fontName: "open sans",
    },

};
const vAxixTextStyle = {
    titleTextStyle: {
        fontSize: 12,
        bold: true,
        italic: false,
        fontName: "open sans",
    },
    minValue: 0,
    format: 'short',
    gridlines: { count: 4 },
    // title: "%"
};

export interface DataChartProps { }
export interface DataChartState {
    data?: any;
    originalData?: any;
    clientId?: any;
    vendorId?: any;
    user?: any;
    firstLoad?: any;
}
const dataState = {
    skip: 0,
    take: null,
};
export default class DataChartContainer extends React.Component<
    DataChartProps,
    DataChartState
> {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                [
                    'status',
                    'number',
                    { role: 'tooltip', p: { 'html': true } },
                    { role: "style" },

                ],
            ],
            firstLoad: true,
            originalData: [],
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            user: auth.getUser(),
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = this.candidateQuery();
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams[1]);
        axios
            .get(`${queryParams[0]}?${finalQueryString}`)
            .then((res) => this.setState({ originalData: res.data, firstLoad: false }))
            .then(() => this.setData());
    };

    setData = () => {
        var result = _.countBy(this.state.originalData, "status");
        var arr = _.entries(result);
        let filteredData = arr.filter(i => i[0] != ReqStatus.DRAFT && i[0] != ReqStatus.FILLED && i[0] != ReqStatus.REJECTED && i[0] != ReqStatus.CLOSED)
        let filteredArray = [];
        let dataSequence = [[ReqStatus.PENDINGAPPROVAL], [ReqStatus.ONHOLD], [ReqStatus.APPROVED], [ReqStatus.RELEASED], [ReqStatus.CANDIDATEUNDERREVIEW]]
        dataSequence.map((i, index) => filteredData.map((j) => j[0]==i[0] ? (j.push(this.createCustomHTMLContent(j[1]), colorCode[index]), filteredArray.push(j)) : null))
        this.setState({
            data: [...this.state.data, ...filteredArray],
        });
        this.setState(this.state);
    };

    createCustomHTMLContent = (totalCount,) => {
        return '<div style="padding:5px 5px 5px 5px;">' +
            '<div class="font-weight-bold no-wrap">Total  :' + totalCount + '</div>' +
            '</div>';
    }

    render() {
        const { firstLoad } = this.state
        return (
            !firstLoad && this.state.data.length==1 ? <div className="dashboard-no-record-found-notuse font-weight-bold dash-header-no-data">No Records Found!</div> :
                this.state.data.length > 1 ? <Chart
                  
                    className="chart-size"
                    chartType="ColumnChart"
                    loader={ShimmerEffectTabChartReq()}
                    // data={this.state.data.length > 1 ? this.state.data : [["status", "count"], ["  ", 0]]}
                    data={this.state.data}
                    options={{
                        tooltip: { isHtml: true },
                        bar: { groupWidth: "70%" },
                        legend: { position: "none", textStyle: "open sans", },
                        hAxis: hAxis,
                        vAxis: vAxixTextStyle,
                    }}
                    legendToggle={true}
                    legend_toggle={true}
                /> : ShimmerEffectTabChartReq()

        );
    }

    candidateQuery = () => {
        var queryParams;
        let apiUrl;
        const { clientId, vendorId, user } = this.state;
        if (clientId) {
            apiUrl = "api/requisitions";
            queryParams = `clientId eq ${clientId}`
        }
        if (vendorId) {
            apiUrl = 'api/requisitions/candidatesubmissions';
            queryParams = `clientId eq ${clientId} and vendorUserId eq ${vendorId}`;
        }
        if (user.role==AuthRole.HiringManager) {
            apiUrl = "api/requisitions";
            queryParams = `clientId eq ${clientId} and hiringManagerId eq ${user.userId}`
        }
        return [apiUrl, queryParams];
    }
}