import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { dateFormatter, errorToastr } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faFileExcel,
    faColumns,
    faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridCell, GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";
import { NOT_DOWNLOADABLE } from "../../Shared/AppMessages";
import axios from "axios";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
            </div>
        }
        filename="Expiring Credential Report"
    >
        <ExcelSheet data={data} name="Expiring Credential Report">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Vendor" value="vendor" />
            <ExcelColumn label="Provider" value="candidateName" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Credential" value="credential" />
            <ExcelColumn label="Expires On" value={(col) => dateFormatter(col.expiresOn)} />
            <ExcelColumn label="Days To Expiration" value="daysToExpiration" />
            <ExcelColumn label="Documents" value="documents" />
            <ExcelColumn label="Hiring Manager" value="hiringManager"/>
            <ExcelColumn label="Credential By" value="credentialBy" />
            <ExcelColumn label="Credential On" value={(col) => col.credentialOn? dateFormatter(col.credentialOn) : "-"} />
        </ExcelSheet>
    </ExcelFile>
);

export function CustomHeaderActionCell({ send, canSend }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
        };

        render() {
            const contentSubmitRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => send(props.dataItem)}>
                        <FontAwesomeIcon icon={faEnvelope} className={"nonactive-icon-color ml-2 mr-2"} />
                        Run Email Alerts
                    </div>
                );
            };
            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };

            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        <MenuItem render={contentSubmitRender} disabled={!canSend} key={"submitBtn"} />
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export function CommandCell({ send }) {
    return class extends GridCell {
        uploadControl: HTMLInputElement;
        render() {
            const { dataItem } = this.props;
            const sendRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => send(dataItem)}>
                        <FontAwesomeIcon icon={faEnvelope} className={"nonactive-icon-color ml-1 mr-2"} />
                        Run Email Alert
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal"></span>;
            };

            return (
                <td contextMenu="Action">
                    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                        <MenuItem render={menuRender} key={"parentMenu"}>
                            {<MenuItem render={sendRender} key={"editBtn"} />}
                        </MenuItem>
                    </Menu>
                </td>
            )
        }
    };
}

export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => ExportExcel(excelData)} />
                <MenuItem render={Columns} />
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
const downloadFile = (filePath, key, props) => {
    if (filePath ==undefined) {
        errorToastr(NOT_DOWNLOADABLE);
    } else {
        axios
            .get(`/api/candidates/documents/download?filePath=${key}`)
            .then((res: any) => {
                if (res) {
                    let fileExt = filePath.split(".")[1].toLowerCase();
                    let fileType;
                    if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
                        fileType = "image";
                    } else {
                        fileType = "application";
                    }
                    const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                    const downloadLink = document.createElement("a");
                    let fileName = filePath.split("/")[1];

                    downloadLink.href = linkSource;
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            });
    }
};

export const DialogBox = (props) => {
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                    <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Zone :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {(props.zone)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Region :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {(props.region)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Division :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {(props.division)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Location :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {(props.location)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Hiring Manager  :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {(props.hiringManager)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Documents :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                <span
                                    title={props.fileName}
                                    onClick={() => downloadFile(props.path, props.keyName, props)}
                                    className="valid-file"
                                >
                                    {props.fileName}
                                </span>
                            </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Credential By :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.credentialBy}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Credential On :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.credentialOn ? dateFormatter(props.credentialOn):"-"}</label>
                            </div>
                        </div>

                        
                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Division :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Location :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Documents :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Credential By :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Credential On :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.division}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.location}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.hiringManager}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">
                                <span
                                    title={props.fileName}
                                    onClick={() => downloadFile(props.path, props.keyName, props)}
                                    className="valid-file"
                                >
                                    {props.fileName}
                                </span>
                            </label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.credentialBy}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.credentialOn ? dateFormatter(props.credentialOn) : "-"}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};