import * as React from "react";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcelAuditLog = (data?) => (
    <ExcelFile
        element={
            <span
            title="Export to Excel"
            className="mr-1 float-right invoice_excel-icon cursor-pointer"
            style={{"right": "2px"}}
            >
            <FontAwesomeIcon
                icon={faFileExcel}
                className={"nonactive-icon-color ml-2 mr-2"}
            ></FontAwesomeIcon>
            </span>
        }
        filename="Audit Log"
    >
        <ExcelSheet data={data} name="Manage Locations">
            <ExcelColumn label="Field" value="fieldName" />
            <ExcelColumn label="Current Value" value="oldValue" />
            <ExcelColumn label="New Value" value="newValue" />
            <ExcelColumn label="Valid From" value={(val) => val.validFrom !=null ? `${dateFormatter(val.validFrom)} ${convertShiftDateTime(val.validFrom)}` : ""} />
            <ExcelColumn label="Valid To" value={(val) => val.validTo !=null ? `${dateFormatter(val.validTo)} ${convertShiftDateTime(val.validTo)}` : ""} />
            <ExcelColumn label="Action By" value="createdBy" />
        </ExcelSheet>
    </ExcelFile>
);