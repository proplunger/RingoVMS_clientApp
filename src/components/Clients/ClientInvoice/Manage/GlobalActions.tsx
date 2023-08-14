import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { amountFormatter, currencyFormatter, dateFormatter, datetimeFormatter } from "../../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faColumns,
  faList,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CellRender, GridNoRecord, MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { MANAGE_VENDOR_INVOICES, VIEW_VENDOR_INVOICE } from "../../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import { ClientInvoiceStatusLegendDictionary, VendorInvoiceStatusLegendDictionary } from "../../../Shared/ReqStatusCard/HelperComponent";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import auth from "../../../Auth";
import { CIAccountingReport, CIDetailReport, CISummaryReport, ClientInvoiceStatusIds, TimesheetDetailReport } from "../../../Shared/AppConstants";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { ExcelExport, ExcelExportColumn } from "@progress/kendo-react-excel-export";
import { AggregateDescriptor, GroupDescriptor } from "@progress/kendo-data-query";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
  <ExcelFile
    element={
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        Export to Excel
      </div>
    }
    filename="Consolidated Billing Invoice"
  >
    <ExcelSheet data={data} name="Consolidated Billing Invoice">
      <ExcelColumn label="Invoice #" value="clientInvoiceNumber" />
      <ExcelColumn
        label="Run Date"
        value={(col) => col.cbiReRunDate ? dateFormatter(col.cbiReRunDate) : ""}
      />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Amount ($)" value="amount" />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>
);

export const CIAccountingExportExcel = (data, ciNumber, isRowAction = false) => (
  <ExcelFile
    filename={`CI Accounting Export_${ciNumber}`} element={isRowAction ? <button id="ciAccountingBtn" hidden={true}>Download</button> : (
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        CI Accounting Export
      </div>
    )}
  >
    <ExcelSheet data={data} name={ciNumber}>
      <ExcelColumn label="Invoice #" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Job Start Date" value={(col) => col.jobStartDate ? dateFormatter(col.jobStartDate) : ""} />
      <ExcelColumn label="Job End Date" value={(col) => col.jobEndDate ? dateFormatter(col.jobEndDate) : ""} />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Associate" value="associate" />
      <ExcelColumn label="Zone" value="zone" />
      <ExcelColumn label="Region" value="region" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Pay Period Start Date" value={(col) => col.payPeriodStartDate ? dateFormatter(col.payPeriodStartDate) : ""} />
      <ExcelColumn label="Pay Period End Date" value={(col) => col.payPeriodEndDate ? dateFormatter(col.payPeriodEndDate) : ""} />
      <ExcelColumn label="Service Category" value="serviceCategory" />
      <ExcelColumn label="Service Type" value="serviceType" />
      <ExcelColumn label="Bill Type" value="billType" />
      <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
      <ExcelColumn label="Billable Hours" value="billableHours" />
      <ExcelColumn label="Client Billable ($)" value={(col) => amountFormatter(col.clientBillable)} />
      <ExcelColumn label="Fees ($)" value={(col) => amountFormatter(col.fees)} />
      <ExcelColumn label="Payment to Vendor ($)" value={(col) => amountFormatter(col.paymentToClient)} />
      <ExcelColumn label="Purchase Order" value="purchaseOrder" />
    </ExcelSheet>
  </ExcelFile >
);

export const CIDetailExportExcel = (data, ciNumber, isRowAction = false) => (
  <ExcelFile
    filename={`CI Detail Export_${ciNumber}`} element={isRowAction ? <button id="ciDetailBtn" hidden={true}>Download</button> : (
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        CI Detail Export
      </div>
    )}
  >
    <ExcelSheet data={data} name={ciNumber}>
      <ExcelColumn label="Invoice #" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Job Start Date" value={(col) => col.jobStartDate ? dateFormatter(col.jobStartDate) : ""} />
      <ExcelColumn label="Job End Date" value={(col) => col.jobEndDate ? dateFormatter(col.jobEndDate) : ""} />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Associate" value="associate" />
      <ExcelColumn label="Zone" value="zone" />
      <ExcelColumn label="Region" value="region" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Pay Period Start Date" value={(col) => col.payPeriodStartDate ? dateFormatter(col.payPeriodStartDate) : ""} />
      <ExcelColumn label="Pay Period End Date" value={(col) => col.payPeriodEndDate ? dateFormatter(col.payPeriodEndDate) : ""} />
      <ExcelColumn label="Service Category" value="serviceCategory" />
      <ExcelColumn label="Service Type" value="serviceType" />
      <ExcelColumn label="Bill Type" value="billType" />
      <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
      <ExcelColumn label="Billable Hours" value="billableHours" />
      <ExcelColumn label="Client Billable ($)" value={(col) => amountFormatter(col.clientBillable)} />
      <ExcelColumn label="Purchase Order" value="purchaseOrder" />
    </ExcelSheet>
  </ExcelFile >
);

const aggregates: AggregateDescriptor[] = [{ field: 'adjustmentAmount', aggregate: 'sum' }];

const group: GroupDescriptor[] = [{
  field: 'vendor',
  aggregates: aggregates
}];

const CustomTitleGroupFooter = (props: any) => {
  return (
    `Adjustments:`
  );
}

const CustomBillGroupFooter = (props: any) => {
  return (
    `${props.aggregates.adjustmentAmount.sum.toFixed(2)}`
  );
}

const getNewExcelRow = () => {
  var cell = { background: '#dfdfdf', color: '#333' };
  const emptyRow = { cells: [], type: 'group-footer', level: null }
  //Array.from({ length: 14 }).forEach(x => {
    Array.from({ length: 16 }).forEach(x => {
    emptyRow.cells.push({ ...cell });
  });
  return emptyRow;
}
const _exporter = React.createRef<ExcelExport>();
export const excelExport = (ciNumber) => {
  if (_exporter.current) {
    //this._exporter.current.save();
    const options = _exporter.current.workbookOptions();
    const rows = options.sheets[0].rows;
    options.sheets[0].name = ciNumber;//this.dataItem.clientInvoiceNumber;

    let grandTotal = 0;
    let total = 0;
    for (let index = 0; index < rows.length; index++) {
      let row = rows[index];
      if (row.type =="data") {
        //total += (row.cells[12].value ? Number(row.cells[12].value) : 0);
        total += (row.cells[14].value ? Number(row.cells[14].value) : 0);
        //row.cells[9].value = dateFormatter(row.cells[9].value);
        row.cells[11].value = dateFormatter(row.cells[11].value);
        //row.cells[10].value = dateFormatter(row.cells[10].value);
        row.cells[12].value = dateFormatter(row.cells[12].value);
        row.cells[4].value = dateFormatter(row.cells[4].value);
        row.cells[3].value = dateFormatter(row.cells[3].value);
      }
      if (row.type =="group-footer") {
        rows.splice(index + 1, 0, getNewExcelRow());
        //rows[index + 1].cells[11].value = `Subtotal: ${rows[index - 1].cells[2].value}`;
        rows[index + 1].cells[13].value = `Subtotal: ${rows[index - 1].cells[2].value}`;
        //let subTotal = total + Number(rows[index].cells[12].value);
        let subTotal = total + Number(rows[index].cells[14].value);
        //rows[index].cells[12].format = "$#,##0.00";
        rows[index].cells[14].format = "$#,##0.00";
        //rows[index + 1].cells[12].value = subTotal;
        rows[index + 1].cells[14].value = subTotal;
        //rows[index + 1].cells[12].format = "$#,##0.00";
        rows[index + 1].cells[14].format = "$#,##0.00";
        grandTotal += subTotal;
        index++;
        total = 0;
      }
    }

    rows.push(getNewExcelRow());
    //rows[rows.length - 1].cells[11].value = 'GRAND TOTAL';
    rows[rows.length - 1].cells[13].value = 'GRAND TOTAL';
    //rows[rows.length - 1].cells[12].value = grandTotal;
    rows[rows.length - 1].cells[14].value = grandTotal;
    //rows[rows.length - 1].cells[12].format = "$#,##0.00";
    rows[rows.length - 1].cells[14].format = "$#,##0.00";
    _exporter.current.save(options);
  }
}

export const CISummaryExportExcel = (data, ciNumber, isRowAction = false) => {
  return (
    <ExcelExport
      data={data}
      group={group}
      fileName={`CI Summary Export_${ciNumber}`}
      ref={_exporter}
    >
      <ExcelExportColumn field="vendorInvoiceNumber" title="Invoice #" />
      <ExcelExportColumn field="vendor" title="Vendor" />
      <ExcelExportColumn field="jobStartDate" title="Job Start Date" cellOptions={{ format: "MM/dd/yyyy" }} width={100} />
      <ExcelExportColumn field="jobEndDate" title="Job End Date" cellOptions={{ format: "MM/dd/yyyy" }} width={100} />
      <ExcelExportColumn field="position" title="Position" />
      <ExcelExportColumn field="associate" title="Associate" />
      <ExcelExportColumn field="zone" title="Zone" />
      <ExcelExportColumn field="region" title="Region" />
      <ExcelExportColumn field="division" title="Division" />
      <ExcelExportColumn field="location" title="Location" />
      <ExcelExportColumn field="payPeriodStartDate" title="Pay Period Start Date" width={140} />
      <ExcelExportColumn field="payPeriodEndDate" title="Pay Period End Date" width={140} />
      <ExcelExportColumn field="billableHours" title="Hours" groupFooter={CustomTitleGroupFooter} />
      <ExcelExportColumn
        field="clientBillable"
        title="Billable ($)" cellOptions={{ format: "#,##0.00" }}
        groupFooter={CustomBillGroupFooter} footerCellOptions={{ format: "#,##0.00", wrap: false, textAlign: "center" }}
      />
      <ExcelExportColumn field="purchaseOrder" title="Purchase Order" />
    </ExcelExport>
  )
};

export const Columns = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
      <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
    </div>
  );
};

export class DetailColumnCell extends React.Component<{
  dataItem: any;
  expandChange: any;
}> {
  render() {
    let dataItem = this.props.dataItem;
    return (
      <td contextMenu="View More" style={{ textAlign: "center" }}>
        <FontAwesomeIcon
          icon={faList}
          style={{ marginLeft: "0px!important", marginTop: "0", fontSize: "16px" }}
          className={"active-icon-blue left-margin cursorPointer"}
          onClick={() => this.props.expandChange(dataItem)}
        />
      </td>
    );
  }
}

export class ViewMoreComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return <DialogBox {...dataItem} />;
  }
}

export const DialogBox = (props) => {
  return (
    <div className="row">
      <div className="col-12 col-lg-11 text-dark">
        <div className="row ml-0 mr-0 mt-1">
          <div className="col-12 pl-0 text-right">
            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">First-Run Date :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.cbiRunDate && datetimeFormatter(props.cbiRunDate)}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RunCBI = (runCBI) => {
  return <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => runCBI()} >
    <FontAwesomeIcon icon={faCheckCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Run CBI{" "}
  </div>
}

export const CustomMenu = (excelData, runCBI) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        {auth.hasPermissionV2(AppPermissions.CLIENT_INVOICE_CREATE) && (
          <MenuItem render={() => RunCBI(runCBI)} />)}
        <MenuItem render={() => ExportExcel(excelData)} />
      </MenuItem>
    </Menu>
  );
};

export const ClientInvoiceNumberCell = (props) => {
  var pageUrl = `${MANAGE_VENDOR_INVOICES}/${props.dataItem.clientInvoiceId}`;
  return (
    <td contextMenu="Client Invoice Number">
      <Link
        className="vendorInvoiceNumberTd orderNumberTdBalck"
        to={pageUrl}
      >
        {props.dataItem.clientInvoiceNumber}
      </Link>
    </td>
  );
};

export function DefaultActions(props) {
  const { dataItem } = props;
  var defaultActions = [
    {
      permCode: AppPermissions.CLIENT_INVOICE_VIEW,
      action: "View Client Invoice",
      nextState: "",
      icon: "faEye",
      linkUrl: `${MANAGE_VENDOR_INVOICES}/${dataItem.clientInvoiceId}`,
    },
    {
      permCode: AppPermissions.CLIENT_INVOICE_PAY_HISTORY_VIEW,
      action: "Payment History",
      nextState: "",
      icon: "faHistory",
      cssStyle: {
        display:
          dataItem.statusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
          dataItem.statusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS ||
          dataItem.statusIntId==ClientInvoiceStatusIds.REMITTANCECOMPLETE
            ? "block"
            : "none",
      }
    },
    {
      permCode: AppPermissions.REPORT_CI_ACCOUNTING,
      action: CIAccountingReport,
      nextState: "",
      icon: "faFileExcel",
    },
    {
      permCode: AppPermissions.REPORT_CI_DETAIL,
      action: CIDetailReport,
      nextState: "",
      icon: "faFileExcel",
    },
    {
      permCode: AppPermissions.REPORT_CI_SUMMARY,
      action: CISummaryReport,
      nextState: "",
      icon: "faFileExcel",
    },
    {
      permCode: AppPermissions.REPORT_TS_DETAIL,
      action: TimesheetDetailReport,
      nextState: "",
      icon: "faFileExcel",
    },
    {
      permCode: AppPermissions.CLIENT_INVOICE_VIEW,
      action: "Remit Payment",
      nextState: "",
      icon: "faCheckCircle",
      cssStyle: {
        display:
          dataItem.statusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
          (dataItem.statusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS &&
            dataItem.remittedBalance !=0)
            ? "block"
            : "none",
      }
    },
    {
      permCode: AppPermissions.EVENT_VIEW,
      action: "View Events",
      nextState: "",
      icon: "faEye",
      linkUrl: `/admin/eventslogs/manage/${dataItem.clientInvoiceId}`,
    },
  ];
  return defaultActions;
}


export const clientInvoiceStatusCell = (props) => {
  var clientInvoiceId = props.dataItem.clientInvoiceId;
  var legendClass = "legend-grey";
  var filteredRows = ClientInvoiceStatusLegendDictionary.filter((s) => s.levelNumber==props.dataItem.statusIntId);
  if (filteredRows.length > 0) {
    legendClass = filteredRows[0].className;
  }
  return (
    <td contextMenu="Status">
      <div className="d-none d-xl-block">
        <div className="d-flex">
          <div data-tip data-for={clientInvoiceId} style={{ margin: "0" }}>
            <div className={legendClass + " legend-forall"}  ></div>
          </div>
          <div className="gridStatusSpan-vendor-invoice" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
            {props.dataItem[props.field]}
          </div>
        </div>
      </div>

      <div className="d-block d-xl-none">
        <div data-tip data-for={clientInvoiceId} style={{ margin: "0" }}>
          <span className={legendClass} style={{ margin: "0" }}></span>
          <span
            className="gridStatusSpan-vendor-invoice">
            {props.dataItem[props.field]}
          </span>
        </div>
      </div>
    </td>
  );
};

export const TsDetailExportExcel = (data, ciNumber, isRowAction = false) => (
  <ExcelFile
    filename={`Timesheet Detail Export_${ciNumber}`} element={isRowAction ? <button id="tsDetailReportBtn" hidden={true}>Download</button> : (
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        Timesheet Detail Export
      </div>
    )}
  >
    <ExcelSheet data={data} name={ciNumber}>
      <ExcelColumn label="Client Invoice Number" value="clientInvoiceNumber" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Associate" value="associate" />
      <ExcelColumn label="Pay Period Start" value={(col) => col.payPeriodEnd ? dateFormatter(col.payPeriodStart) : ""} />
      <ExcelColumn label="Pay Period End" value={(col) => col.payPeriodEnd ? dateFormatter(col.payPeriodEnd): ""} />
      <ExcelColumn label="Date" value={(col) => col.date ? dateFormatter(col.date): ""}  />
      <ExcelColumn label="Service Type" value="serviceType" />
      <ExcelColumn label="Bill Type" value="billType" />
      <ExcelColumn label="Bill Rate ($)" value={(col) => col.billRate} />
      <ExcelColumn label="Time In" value="timeIn" />
      <ExcelColumn label="Time Out" value="timeOut" />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Is Working" value="isWorking" />
      <ExcelColumn label="Hiring Manager" value="hiringManager" />
      <ExcelColumn label="TimeSheet Approvers" value="timesheetApprovers" />
    </ExcelSheet>
  </ExcelFile >
);


export const ClientPaymentHistoryExcel = (data?) => (
  <ExcelFile
    element={
      <span
        title="Export to Excel"
        className="mr-2 float-right invoice_excel-icon cursor-pointer"
      >
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
      </span>
    }
    filename="Payment_History"
  >
    <ExcelSheet data={data} name="Payment_History">
      <ExcelColumn label="Pay Date" value={(value) => dateFormatter(value.payDate)} />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Amount ($)" value={(value) => value.amount} />
      <ExcelColumn label="Created By" value="createdBy" />
      <ExcelColumn label="Status" value="status" />
      <ExcelColumn label="Notes" value="comments" />
    </ExcelSheet>
  </ExcelFile>
);

export const VendorPaymentHistoryExcel = (data?) => (
  <ExcelFile
    element={
      <span
        title="Export to Excel"
        className="mr-2 float-right invoice_excel-icon cursor-pointer"
      >
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
      </span>
    }
    filename="Remittance_History"
  >
    <ExcelSheet data={data} name="Remittance_History">
      <ExcelColumn label="Pay Date" value={(value) => dateFormatter(value.payDate)} />
      <ExcelColumn label="Amount ($)" value={(value) => value.amount} />
      <ExcelColumn label="Created By" value="createdBy" />
      <ExcelColumn label="Status" value="status" />
      <ExcelColumn label="Notes" value="comments" />
    </ExcelSheet>
  </ExcelFile>
);

