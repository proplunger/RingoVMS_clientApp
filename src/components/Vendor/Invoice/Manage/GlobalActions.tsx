import * as React from "react";
import auth from "../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { amountFormatter, currencyFormatter, dateFormatter, datetimeFormatter } from "../../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faColumns,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { VIEW_VENDOR_INVOICE } from "../../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import { AuthRoleType, ClientInvoiceStatusIds, isRoleType, TimesheetDetailReport, VendorInvoiceStatusIds } from "../../../Shared/AppConstants";
import { CIAccountingExportExcel, CIDetailExportExcel, TsDetailExportExcel } from "../../../Clients/ClientInvoice/Manage/GlobalActions";

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
    filename="Vendor Invoice"
  >
    <ExcelSheet data={data} name="Vendor Invoice">
      <ExcelColumn label="Vendor Invoice#" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor" value="vendorName" />
      <ExcelColumn
        label="Billing Period Start Date"
        value={(col) => dateFormatter(col.billingPeriodStart)}
      />
      <ExcelColumn
        label="Billing Period End Date"
        value={(col) => dateFormatter(col.billingPeriodEnd)}
      />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Billable ($)" value={(col) => amountFormatter(col.amount)} />
      <ExcelColumn label="Open Days" value="openDays" />
      <ExcelColumn
        label="Client Authorized Date"
        value={(col) =>
          col.clientAuthorizedDate !=null &&
            col.clientAuthorizedDate !="" &&
            col.clientAuthorizedDate !=undefined
            ? dateFormatter(col.clientAuthorizedDate)
            : ""
        }
      />
      <ExcelColumn label="Client Invoice#" value="clientInvoiceNumber" />
      <ExcelColumn
        label="Run Date"
        value={(col) =>
          col.cbiRunDate !=null &&
            col.cbiRunDate !="" &&
            col.cbiRunDate !=undefined
            ? dateFormatter(col.cbiRunDate)
            : ""
        }
      />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>
);

export const ClientInvoiceDetail = (data?) => (
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
    filename="Vendor Invoice"
  >
    <ExcelSheet data={data} name="Vendor Invoice">
      <ExcelColumn label="Vendor Invoice#" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor" value="vendorName" />
      <ExcelColumn
        label="Billing Period Start Date"
        value={(col) => dateFormatter(col.billingPeriodStart)}
      />
      <ExcelColumn
        label="Billing Period End Date"
        value={(col) => dateFormatter(col.billingPeriodEnd)}
      />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Billable ($)" value={(col) => amountFormatter(col.amount)} />
      <ExcelColumn
        label="Client Authorized Date"
        value={(col) =>
          col.clientAuthorizedDate !=null &&
            col.clientAuthorizedDate !="" &&
            col.clientAuthorizedDate !=undefined
            ? dateFormatter(col.clientAuthorizedDate)
            : ""
        }
      />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>

);

export const ExportExcelVendor = (data?) => (
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
    filename="Vendor Invoice"
  >
    <ExcelSheet data={data} name="Vendor Invoice">
      <ExcelColumn label="Vendor Invoice#" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor" value="vendorName" />
      <ExcelColumn
        label="Billing Period Start Date"
        value={(col) => dateFormatter(col.billingPeriodStart)}
      />
      <ExcelColumn
        label="Billing Period End Date"
        value={(col) => dateFormatter(col.billingPeriodEnd)}
      />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Billable ($)" value={(col) => amountFormatter(col.amount)} />
      <ExcelColumn label="Open Days" value="openDays" />
      <ExcelColumn
        label="Client Authorized Date"
        value={(col) =>
          col.clientAuthorizedDate !=null &&
            col.clientAuthorizedDate !="" &&
            col.clientAuthorizedDate !=undefined
            ? dateFormatter(col.clientAuthorizedDate)
            : ""
        }
      />
      <ExcelColumn label="Client Invoice#" value="clientInvoiceNumber" />
      <ExcelColumn
        label="Run Date"
        value={(col) =>
          col.cbiRunDate !=null &&
            col.cbiRunDate !="" &&
            col.cbiRunDate !=undefined
            ? dateFormatter(col.cbiRunDate)
            : ""
        }
      />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>
);

export const Columns = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
      <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
    </div>
  );
};

export const CustomMenu = (handleClick, excelData, ciAccountingData, ciNumber, excelExport, tsDetailReportData, clientStatusIntId, totalBalance) => {
  const markRemittanceGlobal = () => {
    return (
        <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => handleClick('Remit Payment Global')}>
            <FontAwesomeIcon icon={faCheckCircle} className={"nonactive-icon-color ml-2 mr-2"} />
            Remit Payment
        </div>
    );
  };

  const makePaymentGlobal = () => {
    return (
      <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => handleClick('Receive Payment')}>
          <FontAwesomeIcon icon={faCheckCircle} className={"nonactive-icon-color ml-2 mr-2"} />
          Receive Payment
      </div>
  );
  }
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
         <MenuItem render={() => ciNumber ? ClientInvoiceDetail(excelData) : ExportExcel(excelData)}/>
        {auth.hasPermissionV2(AppPermissions.REPORT_CI_ACCOUNTING) &&
          ciAccountingData && <MenuItem render={() => CIAccountingExportExcel(ciAccountingData, ciNumber)} />}
        {auth.hasPermissionV2(AppPermissions.REPORT_CI_DETAIL) &&
          ciAccountingData && <MenuItem render={() => CIDetailExportExcel(ciAccountingData, ciNumber)} />}
        {auth.hasPermissionV2(AppPermissions.REPORT_CI_SUMMARY) &&
          ciAccountingData && <MenuItem render={() =>
            <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => excelExport(ciNumber)}>
              <FontAwesomeIcon
                icon={faFileExcel}
                className={"nonactive-icon-color ml-2 mr-2"}
              ></FontAwesomeIcon>
              CI Summary Export
            </div>

          } />}
        {auth.hasPermissionV2(AppPermissions.REPORT_TS_DETAIL) && ciNumber &&
          tsDetailReportData && <MenuItem render={() => TsDetailExportExcel(tsDetailReportData, ciNumber)} />}

        {ciNumber && totalBalance !=0 && (
          clientStatusIntId==ClientInvoiceStatusIds.CBIAUTHORIZED ||
          clientStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
          clientStatusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS) &&
            <MenuItem render={() => makePaymentGlobal()} />
        }

        {((clientStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
        clientStatusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS ) && excelData &&
        excelData.filter(x => x.statusIntId !=VendorInvoiceStatusIds.PAIDINFULLREMITTANCE).length) &&
          ciNumber &&
            <MenuItem render={() => markRemittanceGlobal()} />
        }
      </MenuItem>
    </Menu>
  );
};

export const VendorInvoiceNumberCell = (props, clientInvoiceId,isGroup?) => {
  var pageUrl = clientInvoiceId != undefined ? `${VIEW_VENDOR_INVOICE}${props.dataItem.vendorInvoiceId}/${clientInvoiceId}` : `${VIEW_VENDOR_INVOICE}${props.dataItem.vendorInvoiceId}`;
  if (props.rowType=="groupHeader" && isGroup==true) {
         return <td colSpan={0} className="d-none"></td>;
       }
  return (
    <td contextMenu="Vendor Invoice#" title={props.dataItem.vendorInvoiceNumber}>
      <Link
        className="vendorInvoiceNumberTd orderNumberTdBalck"
        to={pageUrl}
      >
        {props.dataItem.vendorInvoiceNumber}
      </Link>
    </td>
  );
};

export function DefaultActions(props, clientInvoiceId) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "View Invoice",
      permCode: AppPermissions.VENDOR_INVOICE_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: clientInvoiceId != undefined ? `${VIEW_VENDOR_INVOICE}${dataItem.vendorInvoiceId}/${clientInvoiceId}` : `${VIEW_VENDOR_INVOICE}${dataItem.vendorInvoiceId}`,
    },
    {
      action: "Activity History",
      permCode: AppPermissions.VENDOR_INVOICE_WF_HISTORY_VIEW,
      nextState: "",
      icon: "faHistory",
    },
    {
      action: "Remittance History",
      permCode: AppPermissions.VENDOR_INVOICE_PAY_HISTORY,
      nextState: "",
      icon: "faHistory",
      cssStyle: {
        display:
          dataItem.statusIntId==VendorInvoiceStatusIds.REMITTANCESENT ||
          dataItem.statusIntId==VendorInvoiceStatusIds.PAIDINFULLREMITTANCE
            ? "block"
            : "none",
      }
    },
    {
      action: "View Events",
      permCode: AppPermissions.EVENT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: clientInvoiceId != undefined ? `/admin/eventslogs/manage/${dataItem.vendorInvoiceId}/${clientInvoiceId}` : `/admin/eventslogs/manage/${dataItem.vendorInvoiceId}`,
    },
  ];
  return defaultActions;
}

export const RemittanceExcelExport = (data) => (
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
    filename="Vendor_Remittance"
  >
    <ExcelSheet data={data} name="Vendor_Remittance">
      <ExcelColumn label="Invoice Number" value="vendorInvoiceNumber" />
      <ExcelColumn label="Payment Date" value={(value) => value.payDate !=null ? datetimeFormatter(value.payDate) : datetimeFormatter(new Date())} />
      <ExcelColumn label="Vendor" value="vendorName" />
      <ExcelColumn label="Billed Amount ($)" value={(value) => value.amount} />
      <ExcelColumn label="Fees ($)" value="transFee" />
      <ExcelColumn label="Remittance Amount ($)" value="remittanceAmount" />
      <ExcelColumn label="Remitted Amount ($)" value="receivedAmount" />
      <ExcelColumn label="Balance Amount ($)" value="balanceAmount" />
      <ExcelColumn label="Notes" value="comments" />
      <ExcelColumn label="Status" value="paymentStatus" />
    </ExcelSheet>
  </ExcelFile>
)