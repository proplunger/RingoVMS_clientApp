import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faList,
  faColumns,
  faFileExcel,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import ReactExport from "react-data-export";
import {
  GridDetailRow,
} from "@progress/kendo-react-grid";
import auth from "../../../Auth";
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { currencyFormatter, dateFormatter } from "../../../../HelperMethods";
import { AuthRoleType, isRoleType, ServiceCategoryIds, VendorInvoiceServiceTypeId, VendorInvoiceStatusIds } from "../../../Shared/AppConstants";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
  <ExcelFile
    element={
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel
      </div>
    }
    filename="VendorInvoiceDetails"
  >
    <ExcelSheet data={data} name="Vendor Invoice Details">
      <ExcelColumn label="Associate" value="associate" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Region" value="region" />
      <ExcelColumn label="Zone" value="zone" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Pay Period" value="payPeriod" />
      <ExcelColumn label="Type" value={(col) => col.serviceType=="-" ? "Timesheet" : col.adjustmentServiceType !=null && (col.serviceTypeIntId==VendorInvoiceServiceTypeId.DEBIT || col.serviceTypeIntId==VendorInvoiceServiceTypeId.CREDIT) ? col.adjustmentServiceType : col.serviceType} />
      <ExcelColumn label="Billable ($)" value="amount" />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="Fees ($)" value="transFee" />
      <ExcelColumn label="Remit Amount ($)" value="netAdjBalance" />
      <ExcelColumn label="PO" value="purchaseOrder" />
    </ExcelSheet>
  </ExcelFile>
);
export const ExportExcelforClientAndAdmin = (data?) => (
  <ExcelFile
    element={
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel
      </div>
    }
    filename="VendorInvoiceDetails"
  >
    <ExcelSheet data={data} name="Vendor Invoice Details">
      <ExcelColumn label="Associate" value="associate" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Zone" value="zone" />
      <ExcelColumn label="Region" value="region" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Pay Period" value="payPeriod" />
      <ExcelColumn label="Service Type" value={(col) => col.serviceType=="-" ? "Timesheet" : col.adjustmentServiceType !=null && (col.serviceTypeIntId==VendorInvoiceServiceTypeId.DEBIT || col.serviceTypeIntId==VendorInvoiceServiceTypeId.CREDIT) ? col.adjustmentServiceType : col.serviceType} />
      <ExcelColumn label="Amount ($)" value="amount" />
      <ExcelColumn label="Hours" value="hours" />
      <ExcelColumn label="PO" value="purchaseOrder" />
    </ExcelSheet>
  </ExcelFile>
);

export const AddExpenses = (addExpense) => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => addExpense()}>
      <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon>Add Expense
    </div>
  );
};

export const DebitCreditMemo = (DebitCredit) => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => DebitCredit()}>
      <span className="fa-stack mr-0 position-relative  ml-2" style={{ fontSize: "10px" }}>
        <FontAwesomeIcon className="faclock_size d-block nonactive-icon-color" icon={faPlus} style={{ position: "absolute", top: "4px" }} />
        <FontAwesomeIcon className="faclock_size nonactive-icon-color" icon={faMinus} style={{ position: "absolute", top: "14px" }} />
      </span>Debit / Credit Adjustment </div>
  );
};

export const Columns = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
      <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns
    </div>
  );
};

export const CustomMenu = (statusIntId, excelData, AddExpense, DebitCredit) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        {auth.hasPermissionV2(AppPermissions.EXPENSE_CREATE) && (statusIntId==VendorInvoiceStatusIds.ACTIVE || statusIntId==VendorInvoiceStatusIds.REJECTED) && <MenuItem render={() => AddExpenses(AddExpense)} />}
        {auth.hasPermissionV2(AppPermissions.DEBIT_CREDIT_CREATE) && (statusIntId==VendorInvoiceStatusIds.ACTIVE || statusIntId==VendorInvoiceStatusIds.REJECTED) && <MenuItem render={() => DebitCreditMemo(DebitCredit)} />}
        <MenuItem render={() => !(isRoleType(AuthRoleType.Vendor) ||  isRoleType(AuthRoleType.SystemAdmin)) ? ExportExcelforClientAndAdmin(excelData) : ExportExcel(excelData)} />
      </MenuItem>
    </Menu>
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
                <label className='mb-0'>Associate:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.associate}</label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Zone:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.zone}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Region:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.region}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Division:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.division}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Location:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.location}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Position:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.position}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Pay Period:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.payPeriodYear}</label>
              </div>
            </div>


            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Billable:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {currencyFormatter(props.amount)}
                </label>
              </div>
            </div>

            {props.serviceType=="-" && <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Hours:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.hours.toFixed(2)}</label>
              </div>
            </div>}

            {props.serviceType != "-" && <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Notes:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.expenseNotes}</label>
              </div>
            </div>}

            {props.serviceType != "-" && <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Expense Date:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {props.expenseDate !="" &&
                    props.expenseDate !=null &&
                    props.expenseDate !=undefined
                    ? dateFormatter(props.expenseDate)
                    : ""}
                </label>
              </div>
            </div>}
            {props.serviceCatIntId==ServiceCategoryIds.EXPENSE && <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>{props.billTypeName=="Weekly" ? "No. of Weeks:" : props.billTypeName=="Hourly" ? "No. of Hours:" : "No. of Days:"}</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.expenseQuantity}</label>
              </div>
            </div>}
            {/* {this.state.billType=="Weekly" ? "No. of Weeks" : this.state.billType=="Hourly" ? "No. of Hours" : "No. of Days"} */}
          </div>


          {/* <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper">
              Expense Date :
              </div> */}

          {/* <div className="col-6 d-none col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.associate}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.position}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.location}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.division}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.payPeriodYear}</label>
            </div>

            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {currencyFormatter(props.amount)}
              </label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.hours}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.expenseNotes}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {props.expenseDate !="" &&
                  props.expenseDate !=null &&
                  props.expenseDate !=undefined
                  ? dateFormatter(props.expenseDate)
                  : ""}
              </label>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};