import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { CandidateStatus, ReqStatus } from "../../../../Shared/AppConstants";
import { history } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { FormatPhoneNumber } from "../../../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Candidates"
    >

        <ExcelSheet data={data} name="Manage Candidates">
            <ExcelColumn label="Candidate Number" value="candidateNumber" />
            <ExcelColumn label="Last Name" value="lastName" />
            <ExcelColumn label="First Name" value="firstName" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="NPI#" value="npi" />
            <ExcelColumn label="SSN" value="ssn" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.mobileNumber)} />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Address 1" value="address1" />
            <ExcelColumn label="Address 2" value="address2" />
            <ExcelColumn label="Postal Code" value="postalCode" />
            <ExcelColumn label="Country" value="country" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);


export const AddNewCandidate = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/candidate/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Candidate{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={AddNewCandidate} />
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props, vendorId) {
    const { dataItem } = props;
    var defaultActions = [
      {
        action: "Edit",
        permCode: AppPermissions.CANDIDATE_UPDATE,
        nextState: "",
        icon: "faPencilAlt",
        linkUrl: `/candidate/edit/${dataItem.id}`,
        cssStyle: {
          display: vendorId
            ? dataItem.status==CandidateStatus.ALLOCATED
              ? dataItem.submittedVendorId==vendorId
                ? "block"
                : "none"
              : "block"
            : "block",
        },
      },
      {
        action: "Work History",
        permCode: AppPermissions.AUTHENTICATED,
        nextState: "",
        icon: "faHistory",
        cssStyle: {
          display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none",
        },
        linkUrl: `/timesheets/provider/${dataItem.id}/workhistory`,
      },
      {
        action: "Invite Candidate",
        permCode: AppPermissions.AUTHENTICATED,
        nextState: "",
        icon: "faEnvelope",
        cssStyle: {
          display:
            dataItem.status==CandidateStatus.ALLOCATED && !dataItem.userId
              ? "block"
              : "none",
        },
      },
      {
        action: "Remove",
        permCode: AppPermissions.CANDIDATE_DELETE,
        nextState: "",
        icon: "faTrashAlt",
        cssStyle: {
          display: vendorId
            ? dataItem.status==CandidateStatus.ALLOCATED
              ? dataItem.submittedVendorId==vendorId
                ? "block"
                : "none"
              : "block"
            : "block",
        },
      },
    ];
    return defaultActions;
}

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
                                <label className='mb-0'>Candidate Number:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'
                                    title={props.candidateNumber}>{props.candidateNumber}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>SSN:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'
                                    title={props.ssn}>{props.ssn}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Job Category  :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.jobCategory}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 1 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address1}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 2 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address2}</label>
                            </div>
                        </div>



                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>City :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.city}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>State :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.state}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Postal Code :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.postalCode}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Country :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.country}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Tags :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.tags || "-"}</label>
                            </div>
                        </div>



                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Candidate Number :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">SSN# :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Category :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Address 1 :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">City :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">State :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Postal Code :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Country :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 " title={props.candidateNumber}>{props.candidateNumber}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.ssn}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobCategory}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.address1}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.address2}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.city}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.state}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.postalCode}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.country}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};