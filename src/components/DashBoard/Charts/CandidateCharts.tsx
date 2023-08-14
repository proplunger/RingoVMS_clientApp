import { toODataString } from '@progress/kendo-data-query';
import axios from 'axios';
import _ from 'lodash';
import { extend } from 'lodash';
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Chart from 'react-google-charts'

import auth from "../../Auth";
import { KendoFilter, ShimmerEffectTabChart } from '../../ReusableComponents';
import { AuthRole, CandidateStatusSequence, CandSubStatusIds, colorCode } from '../../Shared/AppConstants';

const hAxis = {
    title: 'Total Billable($)',
    titleTextStyle: { fontSize: 12, bold: true, italic: false, fontName: 'open sans' },
    minValue: 0,
    format: 'short'
};
const vAxixTextStyle = { fontSize: 12, bold: true, italic: false, fontName: 'open sans' };

export interface CandidateChartProps {

}
export interface CandidateChartState {
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

export default class CandidateChartContainer extends React.Component<CandidateChartProps, CandidateChartState>{
    constructor(props) {
        super(props)
        this.state = {
            data: [["Status", "Count", { role: 'tooltip', p: { 'html': true } }]],
            originalData: [],
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            user: auth.getUser(),
            firstLoad: true,
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = this.candidateQuery();
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        axios.get(`api/candidates/workflow?${finalQueryString}`).then((res) => this.setState({ originalData: res.data, firstLoad: false })).then(() => this.setData())
    }

    setData = () => {
        var result = _.countBy(this.state.originalData, 'status');
        var arr = _.entries(result);
        let filteredArray = [];
        CandidateStatusSequence.map((i, indexVal) => arr.map((j, index) => j[0]==i[0] ? filteredArray.push(j) : null))
        let dataArr = filteredArray.map((i, index) => {
            i.push(this.createCustomHTMLContent(i[1], i[0]));
            return i;
        });
        this.setState({
            data: [...this.state.data, ...dataArr],
        });
        this.setState(this.state);
    }

    createCustomHTMLContent = (totalCount, name) => {
        return '<div style="padding:10px 5px 5px 5px;">' +
            '<div class="font-weight-bold no-wrap">' + name + '</div>' +
            '<div class="font-weight-bold no-wrap">Total  :' + totalCount + '</div>' +
            '</div>';
    }

    private candidateQuery(): string {
        var queryParams;
        var defaultQueryParams = `statusIntId ne ${CandSubStatusIds.PENDINGSUBMISSION} and statusIntId ne ${CandSubStatusIds.ASSIGNMENTCREATED} and statusIntId ne ${CandSubStatusIds.REJECTED} and statusIntId ne ${CandSubStatusIds.WITHDRAWN}`;
        const { clientId, vendorId, user } = this.state;
        if (clientId) {
            queryParams = `clientId eq ${clientId} and `
        }
        if (vendorId) {
            queryParams = `clientId eq ${clientId} and vendorId eq ${vendorId} and `;
        }
        if (user.role==AuthRole.HiringManager) {
            queryParams = `clientId eq ${clientId} and hiringManagerId eq ${user.userId} and `
        }
        return `${queryParams}${defaultQueryParams}`;
    }

    render() {
        return (
            !this.state.firstLoad && this.state.data.length==1 ? <div className="dashboard-no-record-found-notuse font-weight-bold dash-header-no-data" >  No Pending Candidate Submission! </div> :
                this.state.data.length > 1 ? <Chart
                    
                    className="chart-size-Candidate-Workflow"
                    chartType="PieChart"
                    loader={ShimmerEffectTabChart()}
                    data={this.state.data}
                    options={{
                        tooltip: { isHtml: true },
                        legend: { position: 'right'},
                        chartArea: { width: '100%' },
                        slices: colorCode,
                    }}
                    legendToggle={true}
                    legend_toggle={true}
                /> : <div style={{
                    width: '530px',
                    height: '350px'
                }}>
                    {ShimmerEffectTabChart()}
                </div>
        )
    }
}