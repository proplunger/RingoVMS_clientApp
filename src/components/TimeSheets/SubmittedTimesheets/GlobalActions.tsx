import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import {
  currencyFormatter,
  dateFormatter,
  dateFormatter2,
} from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

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
    filename="Timesheet_Pending_Approval"
  >
    <ExcelSheet data={data} name="Timesheet_Pending_Approval">
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Dept/Location" value="location" />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Hiring Manager" value="hiringManager" />
      <ExcelColumn label="End Date" value="endDate" />
      <ExcelColumn label="Candidate" value="candidateName" />
      <ExcelColumn
        label="Pay Period"
        value={(value) =>{debugger;
        return  dateFormatter(value.tsWeek[0].startDate) +
          "-" +
          dateFormatter(value.tsWeek[0].endDate)
        }}
      />
      <ExcelColumn
        label="Total Hr."
        value={(value) =>{debugger; return value.tsWeek[0].totalHours}}
      />
      <ExcelColumn
        label="Billable Amount ($)"
        value={(value) => value.tsWeek[0].totalAmount}
      />
    </ExcelSheet>
  </ExcelFile>
);
