import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { amountFormatter, currencyFormatter, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
                <span title="Export to Excel" className="mr-2 float-right text-dark shadow invoice cursor-pointer">
                <FontAwesomeIcon icon={faFileExcel} style={{ color: "white" }} className={"faclock_size d-block"}></FontAwesomeIcon>
            </span>
        }
        filename="Client Activity Report"
    >
        <ExcelSheet data={data} name="Client Activity Report">
            <ExcelColumn label="Candidate Name" value="provider" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Pay Period" value={(col) =>dateFormatter2(col.startDate) + " - " + dateFormatter2(col.endDate)} />
            <ExcelColumn label="Hours" value="totalHours" />
            <ExcelColumn label="Amount ($)" value={(col) => amountFormatter(col.totalAmount)} />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);