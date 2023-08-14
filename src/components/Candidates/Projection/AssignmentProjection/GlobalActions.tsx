import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faDownload,
    faUpload,
    faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";

// export const CopyToAll = () => {
//     return (
//         <div className="pb-1 pt-1 w-100 myorderGlobalicons">
//             <FontAwesomeIcon icon={faCopy} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Copy To All{" "}
//         </div>
//     );
// };

export const GenerateProjection = (generate) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {generate}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add Forecast{" "}
        </div>
    );
};

export const GenerateHistory = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Generate By History{" "}
        </div>
    );
};

export const DownloadTemplate = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            
            <FontAwesomeIcon icon={faDownload} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Download Template{" "}
        </div>
    );
};

export const UploadSpreadsheet = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            
            <FontAwesomeIcon icon={faUpload} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Upload Spreadsheet{" "}
        </div>
    );
};

export const CustomMenu = (excelData, generate) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {/* <MenuItem render={() => CopyToAll()} /> */}
                <MenuItem render={() => GenerateProjection(generate)} />
                {/* <MenuItem render={() => GenerateHistory()} />
                <MenuItem render={() => DownloadTemplate()} />
                <MenuItem render={() => UploadSpreadsheet()} /> */}
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

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: "Delete",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faTrashAlt",
            //cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        }
    ];
    return defaultActions;
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
            <div className="col-12 col-lg-12 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        {/* <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Is Percentage Applied:</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.isPercentageApply}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Percentage Value :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.percentageValue ? props.percentageValue : "-"}</label>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
