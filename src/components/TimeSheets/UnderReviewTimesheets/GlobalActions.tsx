import * as React from "react";
import ReactExport from "react-data-export";
import {
  dateFormatter,
} from "../../../HelperMethods";
import _ from "lodash";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
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
        filename="Timesheet Under Review"
  >
    <ExcelSheet data={data} name="Timesheet_Under_Review">
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Provider" value="provider" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Division" value="division" />      
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Job End Date" value={(value) =>{ return  dateFormatter(value.jobEndDate)}}/>
      <ExcelColumn label="Total Amount ($)" value={(value) => value.totalAmount}/>
      <ExcelColumn label="Total Hours" value={(value) =>{return value.totalHours}}/>
      <ExcelColumn label="Start Date" value={(value) =>{ return  dateFormatter(value.startDate)}}/>
      <ExcelColumn label="End Date" value={(value) =>{ return  dateFormatter(value.endDate)}}/>
      <ExcelColumn label="Review Reason" value="reviewReason" />
      <ExcelColumn label="Client" value="client" />
      <ExcelColumn label="Region" value="region" />
      <ExcelColumn label="Zone" value="zone" />
      <ExcelColumn label="Hiring Manager" value="hiringManager" />
    </ExcelSheet>
  </ExcelFile>
);

export const CustomMenu = () => {
  return (
      <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
          <MenuItem render={MenuRender}>
              {/* <MenuItem render={() => ExportExcel(excelData)} /> */}
          </MenuItem>
      </Menu>
  );
};

export function DefaultActions(props) {
  const { dataItem } = props;
  var defaultActions = [
      {
          action: "Timesheet Details",
          permCode: AppPermissions.AUTHENTICATED,
          nextState: "",
          icon: "faFileAlt",
          linkUrl: `/timesheets/submitted/${dataItem.tsWeekId}`,
      }
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
                              <label className='mb-0'>Client:</label>
                          </div>
                          <div className="col-6 text-left pl-0 pr-0">
                              <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                  {props.client}
                              </label>
                          </div>
                      </div>

                      <div className="row mb-2">
                          <div className="col-6">
                              <label className='mb-0'>Region:</label>
                          </div>
                          <div className="col-6 text-left pl-0 pr-0">
                              <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                  {props.region}
                              </label>
                          </div>
                      </div>

                      <div className="row mb-2">
                          <div className="col-6">
                              <label className='mb-0'>Zone:</label>
                          </div>
                          <div className="col-6 text-left pl-0 pr-0">
                              <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                  {props.zone}
                              </label>
                          </div>
                      </div>

                      <div className="row mb-2">
                          <div className="col-6">
                              <label className='mb-0'>Hiring Manager:</label>
                          </div>
                          <div className="col-6 text-left pl-0 pr-0">
                              <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                  {props.hiringManager}
                              </label>
                          </div>
                      </div>

                      <div className="row mb-2">
                          <div className="col-6">
                              <label className='mb-0'>Timesheet Approvers:</label>
                          </div>
                          <div className="col-6 text-left pl-0 pr-0">
                              <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                  {props.timesheetApprovers}
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};