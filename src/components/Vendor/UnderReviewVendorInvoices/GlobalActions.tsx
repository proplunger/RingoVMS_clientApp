import * as React from "react";
import ReactExport from "react-data-export";
import {
  amountFormatter,
  dateFormatter,
} from "../../../HelperMethods";
import _ from "lodash";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faList } from "@fortawesome/free-solid-svg-icons";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
  <ExcelFile
    element={
      <span
        title="Export to Excel"
        className="mr-2 float-right text-dark shadow invoice cursor-pointer"
      >
        <img
          src={require("../../../assets/images/export_to_excel.png")}
          className=""
          alt="logo"
          style={{ width: "37px" }}
        />
      </span>
    }
    filename="Vendor Invoice Under Review"
  >
    <ExcelSheet data={data} name="Vendor_Invoice_Under_Review">
      <ExcelColumn label="Invoice #" value="vendorInvoiceNumber" />
      <ExcelColumn label="Vendor Name" value="vendorName" />
      <ExcelColumn
        label="Billing Period Start Date"
        value={(col) => dateFormatter(col.billingPeriodStart)}
      />
      <ExcelColumn
        label="Billing Period End Date"
        value={(col) => dateFormatter(col.billingPeriodEnd)}
      />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Amount ($)" value={(col) => amountFormatter(col.amount)} />
      <ExcelColumn label="Open Days" value="openDays" />
      <ExcelColumn
        label="Authorized Date"
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

export class ViewMoreComponent extends GridDetailRow {
  render() {
    const dataItem = this.props.dataItem;
    return <DialogBox {...dataItem} />;
  }
}
export const CustomMenu = (excelData) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        {/* <MenuItem render={() => ExportExcel(excelData)} /> */}
      </MenuItem>
    </Menu>
  );

};

export const DialogBox = (props) => {
  return (
    <div className="row">
      <div className="col-12 col-lg-11 text-dark">
        <div className="row ml-0 mr-0 mt-1">
          <div className="col-12 pl-0 text-right">
            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Authorized Date:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {props.clientAuthorizedDate !=null ? dateFormatter(props.clientAuthorizedDate) : "-"}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any }> {
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
export function DefaultActions(props) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "Expense Details",
      permCode: AppPermissions.AUTHENTICATED,
      nextState: "",
      icon: "faFileAlt",
      linkUrl: `/vendor/invoices/${dataItem.vendorInvoiceId}/expenses`,
    },

  ];
  return defaultActions;
}