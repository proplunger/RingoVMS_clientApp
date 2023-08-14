import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import {  GridHeaderCell } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { State, toODataString } from "@progress/kendo-data-query";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../../../Shared/AppMessages";
import { downloadExcel, successToastr } from "../../../../../HelperMethods";
import axios from "axios";
import { KendoFilter } from "../../../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (dataState?, streamId?) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <span onClick={() => downloadEventsLogExcel(dataState, streamId)}><FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"} ></FontAwesomeIcon> Export to Excel{" "}</span>
        </div>
        )
};

const downloadEventsLogExcel = (dataState, streamId?) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    let queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var finalQueryString = queryStr;

    if (streamId){
        let queryParams = `streamId eq ${streamId}`
        finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    }
    
    successToastr(EXCEL_DOWNLOAD_INPROGRESS);
    axios.get(`/api/grid/elexcel?${finalQueryString}`).then((res: any) => {
        if (res) {
            downloadExcel("Events Log.xlsx", res.data);
        }
    });
  }

export const CustomMenu = (dataState, streamId?) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => ExportExcel(dataState, streamId)} />
            </MenuItem>
        </Menu>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/admin/eventslogs/view/${dataItem.id}`,
        }
    ];
    return defaultActions;
}
