import * as React from "react";
import _ from "lodash";
import { AggregateDescriptor, GroupDescriptor, process } from "@progress/kendo-data-query";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { amountFormatter, currencyFormatter } from "../../../HelperMethods";
import { format } from "util";

const aggregates: AggregateDescriptor[] =
    [{ field: 'forecastTimeProvider1', aggregate: 'sum' }, { field: 'forecastExpenseProvider1', aggregate: 'sum' },
    { field: 'forecastDivision1', aggregate: 'sum' }, { field: 'forecastFacility1', aggregate: 'sum' },
    , { field: 'forecastPosition1', aggregate: 'sum' }];

const group: GroupDescriptor[] = [{
    field: 'region',
    aggregates: aggregates
},
{
    field: 'division',
    aggregates: aggregates
},
{
    field: 'location',
    aggregates: aggregates
},
{
    field: 'position',
    aggregates: aggregates
},
{
    field: 'provider',
    aggregates: aggregates
}];

const CustomTitleGroupFooter = (props: any) => {
    return (
        <>
            {props.group.field=="division" ? "Division Total" : ""}
            {props.group.field=="location" ? "Location Total" : ""}
            {props.group.field=="position" ? "Position Total" : ""}
            {props.group.field=="provider" ? "Sub Total" : ""}
        </>
    );
}

const CustomBaseGroupFooter = (props: any) => {
    var base = props.group.field=="provider" ? props.aggregates.forecastTimeProvider1.sum.toFixed(2) : 0;
    return (
        <>
            {props.group.field=="division" ? (props.aggregates.forecastDivision1.sum).toFixed(2) :0}
            {props.group.field=="location" ? (props.aggregates.forecastFacility1.sum).toFixed(2):0}
            {props.group.field=="position" ? (props.aggregates.forecastPosition1.sum).toFixed(2):0 }
            {props.group.field=="provider" ? base : 0 }
        </>
    );
}

const CustomLoadedGroupFooter = (props: any) => {
    var loaded = !isNaN(props.aggregates.forecastExpenseProvider1.sum) ? (props.aggregates.forecastExpenseProvider1.sum).toFixed(2) : 0;
    return (
        <>
            {props.group.field=="division" ? loaded: 0}
            {props.group.field=="location" ? loaded : 0}
            {props.group.field=="position" ? loaded : 0}
            {props.group.field=="provider" ? loaded : 0 }
        </>
    );
}

const getNewExcelRow = () => {
    var cell = { background: '#dfdfdf', color: '#333' };
    const emptyRow = { cells: [], type: 'group-footer', level: null }
    Array.from({ length: 16 }).forEach(x => {
        emptyRow.cells.push({ ...cell });
    });
    return emptyRow;
}

const _exporter = React.createRef<ExcelExport>();
export const excelExport = (data, ciNumber) => {
   
    if (_exporter.current) {
        const options = _exporter.current.workbookOptions();
        const rows = options.sheets[0].rows;
        options.sheets[0].name = ciNumber;

        let grandTotal = 0;
        let totalFcTime = 0;
        let totalFcExpense = 0;
        for (let index = 0; index < rows.length; index++) {
            let row = rows[index];
            // let deleteRowIndex = null;
            for (let j = 0; j < row.cells.length; j++) {
                let cell = row.cells[j];
                cell.value = cell.value ==0 ? null : cell.value;
            }
            // if (rows.length > index + 2) {
            //     if (row.type =="group-header" && rows[index + 1].type =="data") {
            //         let sub = rows[index + 1]
            //         let allValues = []
            //         let allValuesForecast = []
            //         // if (sub.type =="data") {
            //         //     for (let j = 12; j < 14; j++) {
            //         //         allValues.push(sub.cells[j].value =="" || sub.cells[j].value ==null || sub.cells[j].value ==0 ? null : sub.cells[j].value);
            //         //     }
            //         //     for (let j = 14; j < 15; j++) {
            //         //         allValuesForecast.push(sub.cells[j].value =="" || sub.cells[j].value ==null || sub.cells[j].value ==0 ? null : sub.cells[j].value);
            //         //     }
            //         // }
            //         // row.cells[row.cells.length - 1].colSpan -= 6
                    
            //         // for (let i = 5; i < 9; i++) {
            //         //     if (!row.cells[i]) {
            //         //         row.cells[i] = { value: "", background: "#dfdfdf", color: "#333", format: "#,##0.00" };
            //         //     }
            //         //     if (allValues.length > i - 5)
            //         //         row.cells[i].value = allValues[i - 5];
            //         // }
            //         // for (let i = 9; i < 11; i++) {
            //         //     if (!row.cells[i]) {
            //         //         row.cells[i] = { value: "", background: "#dfdfdf", color: "#333", format: "#,##0.00" };
            //         //     }
            //         //     row.cells[i].value = allValuesForecast[i - 9];
            //         // }
            //         //rows.splice(index+1, 1);
            //         // deleteRowIndex = index + 1;
            //     }

            //     if (row.type =="group-footer") {
                  
            //         rows[index].cells[14].format = "$#,##0.00";
            //         rows[index].cells[15].format = "$#,##0.00";
            //       }
            // }           
        }

        rows.push(getNewExcelRow());
        // rows[rows.length - 1].cells[11].value = 'GRAND TOTAL';
        // rows[rows.length - 1].cells[12].value = grandTotal;
        // rows[rows.length - 1].cells[12].format = "$#,##0.00";
        _exporter.current.save(options);
    }
}

export const ForecastReportExcelExport = (data, forecastData, client, isRowAction = false) => {
    return (
        <ExcelExport
            data={process(data, {
                group: group
            }).data}
            group={group}
            fileName={`Spend Forecast Report_Test`}
            ref={_exporter}
        >
            <ExcelExportColumn field="region" title="Region" />
            <ExcelExportColumn field="division" title="Division" />
            <ExcelExportColumn field="location" title="Location" />
            <ExcelExportColumn field="position" title="Position" />
            <ExcelExportColumn field="provider" title="Associate" />
            <ExcelExportColumn field="serviceCategory" title="Service Category" />
            <ExcelExportColumn field="month" title="Month" />
            <ExcelExportColumn field="maxBillRate" title="Bill Rate ($)" cellOptions={{ format: "#,##0.00" }}/>
            <ExcelExportColumn field="billableHours" title="Hours" groupFooter={CustomTitleGroupFooter} />
            <ExcelExportColumn
                field="clientBillable"
                title="Base Forecast ($)" cellOptions={{ format: "#,##0.00" }}
                groupFooter={CustomBaseGroupFooter} footerCellOptions={{  format: "#,##0.00",wrap: false, textAlign: "center" }}
            />
            <ExcelExportColumn field="loadedForecast"
                title="Loaded Forecast ($)" cellOptions={{ format: "#,##0.00" }}
                groupFooter={CustomLoadedGroupFooter} footerCellOptions={{ format: "#,##0.00",wrap: false, textAlign: "center" }}/>

        </ExcelExport>
    )
};