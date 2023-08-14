import {
  faFilePdf,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import React from "react";
import { currencyFormatter, dateFormatter, successToastr } from "../../../../HelperMethods";
import { DownloadDocument } from "../../../TimeSheets/TimeSheet/GlobalActions";
import {
  GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import { FILE_DOWNLOAD_WAIT } from "../../../Shared/AppMessages";

export interface InvoiceDocumentDetailsGridProps {
  data?: any;
  handleClose?: any;
  candidateId?: any;
}

export interface InvoiceDocumentDetailsGridState {
  fileArray?: any;
  showLoader?: boolean;
}

export default class InvoiceDocumentDetailsGrid extends React.Component<
  InvoiceDocumentDetailsGridProps,
  InvoiceDocumentDetailsGridState
> {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      fileArray: [],
    };
  }

  componentDidMount() {
    this.props.data.expenseId != null &&
      this.getDocuments(this.props.data.expenseId);
  }

  getDocuments = (entityId) => {
    this.setState({ showLoader: true });
    axios.get(`api/ts/documents?tsWeekId=${entityId}`).then((res) => {
      if (res.data) {
        let fileArray = [...this.state.fileArray];
        res.data.forEach((doc) => {
          fileArray.push({
            candDocumentsId: doc.candDocumentsId,
            fileName: doc.fileName,
            file: undefined,
            isValid: true,
            path: doc.filePath,
            uploadedDate: doc.uploadedDate,
          });
        });
        this.setState({ fileArray: fileArray, showLoader: false });
      }
    });
  };

  DownloadDocument = (filePath) => {
    successToastr(FILE_DOWNLOAD_WAIT);
    DownloadDocument(filePath);
  };

  render() {
    return (
      <div className="col-11 col-sm-10 col-lg-9 mx-auto bg-white">
        <div className="row blue-accordion">
          <div className="col-12  pt-2 pb-2 fontFifteen">
            View Documents- {this.props.data.associate}
            <span className="float-right" onClick={this.props.handleClose}>
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
            </span>
          </div>
        </div>
        <div className="row ml-0 mr-0">
          <div className="col-12 pl-0 pr-0 mt-2">
            <div className="row mx-auto mt-2">
              <div className="col font-weight-bold">
                Pay Period: <span>{this.props.data.payPeriod}</span>
              </div>
              <div className="col text-center font-weight-bold">
                Service Type: <span>{this.props.data.serviceType}</span>
              </div>
              <div className="col text-right font-weight-bold">
                Expense Amt: <span>{currencyFormatter(this.props.data.amount)}</span>
              </div>
            </div>
          </div>
          <div className="myOrderContainer mb-4 col-12">
            <Grid
              resizable={true}
              reorderable={true}
              sortable={true}
              data={this.state.fileArray}
              className="kendo-grid-custom lastchild"
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="fileName"
                title="Document Name"
                filter="text"
              />
              <GridColumn
                field="uploadedDate"
                title="Uploaded Date"
                filter="text"
                cell={(props) => (
                  <td>{dateFormatter(props.dataItem.uploadedDate)}</td>
                )}
              />
              <GridColumn
                field="path"
                title="Attached Documents"
                cell={(props) => {
                  return (
                    <td>
                      <FontAwesomeIcon
                        className="nonactive-icon-color mr-2 cursor-pointer"
                        title="Dowload Document(s)"
                        icon={faFilePdf}
                        onClick={() =>
                          this.DownloadDocument(props.dataItem.path)
                        }
                      />
                    </td>
                  );
                }}
              />
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
