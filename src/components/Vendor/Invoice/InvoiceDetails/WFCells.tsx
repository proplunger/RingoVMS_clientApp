import { GridHeaderCell } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import React from "react";
import { ServiceCategoryIds, VendorInvoiceServiceTypeId, VendorInvoiceStatusIds } from "../../../Shared/AppConstants";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";

export function DefaultActions(dataItem, isVendorRole) {
  var defaultActions = [
    {
      action: "Debit/Credit Adjustment",
      permCode: AppPermissions.DEBIT_CREDIT_CREATE,
      nextState: "",
      icon: "faPlusMinus",
      cssStyle: {
        display:
          dataItem.serviceCatIntId==ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.REJECTED)
            ? "block"
            : "none",
      },
    },

    {
      action: "Add Expenses",
      permCode: AppPermissions.EXPENSE_CREATE,
      nextState: "",
      icon: "faPlusCircle",
      cssStyle: {
        display:
          dataItem.serviceCatIntId==ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.REJECTED)

            ? "block"
            : "none",
      },
    },
    {
      action: "Edit",
      permCode: AppPermissions.EXPENSE_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      cssStyle: {
        display:
          ((dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.DEBIT
            || dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.CREDIT
            || dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.DEBIT
            || dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.CREDIT
          )
            && dataItem.serviceCatIntId != ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.REJECTED)
          )
            ? "block"
            : "none",
      },
    },
    {
      action: "Remove",
      permCode: AppPermissions.EXPENSE_UPDATE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
          ((dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.DEBIT
            || dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.CREDIT
            || dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.DEBIT
            || dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.CREDIT
          )
            && dataItem.serviceCatIntId != ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.REJECTED)
          )
            ? "block"
            : "none",
      },
    },
    {
      action: "Move Timesheet",
      permCode: AppPermissions.EXPENSE_UPDATE,
      nextState: "",
      icon: "faShare",
      cssStyle: {
        display:
          (dataItem.serviceCatIntId==ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.UNDERVENDORREVIEW)
          )
            ? "block"
            : "none",
      },
    },
    {
      action: "Reset Timesheet",
      permCode: AppPermissions.TS_RESET,
      nextState: "",
      icon: "faUndo",
      cssStyle: {
        display:
          (dataItem.serviceCatIntId==ServiceCategoryIds.TIME
            && (dataItem.statusIntId==VendorInvoiceStatusIds.ACTIVE || dataItem.statusIntId==VendorInvoiceStatusIds.UNDERVENDORREVIEW)
          )
            ? "block"
            : "none",
      },
    },

  ];
  return defaultActions;
}

export function customeHeaderCell() {
  return class extends GridHeaderCell {
    render() {
      const menuRender = (props) => {
        return (
          <span
            className="k-icon k-i-more-horizontal"
            style={{ color: "white" }}
          ></span>
        );
      };
      return (
        <Menu
          openOnClick={false}
          className="actionItemMenu actionItemMenuThreeDots"
        >
          <MenuItem render={menuRender} key={"parentMenu"}></MenuItem>
        </Menu>
      );
    }
  };
}
