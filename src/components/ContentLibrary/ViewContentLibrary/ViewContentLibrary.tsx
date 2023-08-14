import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@progress/kendo-react-inputs";
import axios from "axios";
import * as React from "react";
import { errorToastr, history, initialDataState } from "../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { toODataString } from "@progress/kendo-data-query";
import ContentLibraryDataService from "../Services/DataService";
import { KendoFilter } from "../../ReusableComponents";
import { ContentLibStatus, ContentType, DocFileType } from "../../Shared/AppConstants";
import { NOT_DOWNLOADABLE } from "../../Shared/AppMessages";
import DocumentViewer from "../../Shared/DocumentViewer/DocumentViewer";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ViewcontentLibLibraryProps { }
export interface ViewcontentLibLibraryState {
  onFirstLoad: boolean;
  CheckBoxData?: boolean;
  contentData: any;
  showLoader: boolean;
  dataState: any;
  fileType?: any;
  fileUrl?: any;
}
class ViewcontentLibLibrary extends React.Component<
  ViewcontentLibLibraryProps,
  ViewcontentLibLibraryState
> {
  constructor(props: ViewcontentLibLibraryProps) {
    super(props);
    this.state = {
      onFirstLoad: true,
      CheckBoxData: false,
      contentData: [],
      showLoader: true,
      dataState: initialDataState,
    };
  }

  componentDidMount() {
    this.getContentLibrary(this.state.dataState);
  }

  handleChange = (e, field) => {
    var stateObj = {};
    stateObj[field] =
      e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
  };

  getContentLibrary = (dataState) => {
    this.setState({ showLoader: true, onFirstLoad: false });
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    let queryParams = `(statusIntId eq ${ContentLibStatus.PUBLISHED})`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    ContentLibraryDataService.getContentLibraryView(finalQueryString).then((res) => {
      this.setState({
        contentData: res.data,
        showLoader: false,
        dataState: dataState,
      });
    });
  }

  fileIcon = (fileType) => {
    var icon = "";
    var iconColor = "";
    switch (fileType) {
      case DocFileType.WORD:
        icon = "fas fa-file-word"
        iconColor = "#0045A6"
        break;
      case DocFileType.WORD_DOC:
        icon = "fas fa-file-word"
        iconColor = "#0045A6"
        break;
      case DocFileType.WORD_DOCX:
        icon = "fas fa-file-word"
        iconColor = "#0045A6"
        break;
      case DocFileType.VIDEO:
        icon = "fas fa-video"
        iconColor = "#5BC0F8"
        break;
      case DocFileType.VIDEO_MKV:
        icon = "fas fa-video"
        iconColor = "#5BC0F8"
        break;
      case DocFileType.PDF:
        icon = "fas fa-file-pdf"
        iconColor = "#AE030D"
        break;
      case DocFileType.EXCEL:
        icon = "fas fa-file-excel"
        iconColor = "#1C6C40"
        break;
      case DocFileType.EXCEL_XLS:
        icon = "fas fa-file-excel"
        iconColor = "#1C6C40"
        break;
      case DocFileType.EXCEL_XLSX:
        icon = "fas fa-file-excel"
        iconColor = "#1C6C40"
        break;
      case DocFileType.IMAGE_PNG:
        icon = "fas fa-image"
        iconColor = "#28AAE5"
        break;
      case DocFileType.IMAGE_JPEG:
        icon = "fas fa-image"
        iconColor = "#28AAE5"
        break;
      case DocFileType.IMAGE_JPG:
        icon = "fas fa-image"
        iconColor = "#28AAE5"
        break;
      default:
        icon = "fas fa-file"
        iconColor = "#5BC0F8"
        break;
    }
    return { icon, iconColor };
  };

  cardTextColor = (contentType) => {
    var textColor = "";
    var textBgColor = "";
    switch (contentType) {
      case ContentType.BLOG:
        textColor = "#109dd2"
        textBgColor = "#def0fa"
        break;
      case ContentType.TRAININGVIDEOS:
        textColor = "#285430"
        textBgColor = "#def0fa"
        break;
      case ContentType.RELEASENOTES:
        textColor = "#FF8B13"
        textBgColor = "#fcebdb"
        break;
      case ContentType.USERGUIDE:
        textColor = "#3D1766"
        textBgColor = "#dadded"
        break;
      default:
        textColor = "#3D1766"
        textBgColor = "#dadded"
        break;
    }
    return { textColor, textBgColor };
  };

  groupIcon = (notes) => {
    var icon = "";
    switch (notes) {
      case ContentType.BLOG:
        icon = "fas fa-blog"
        break;
      case ContentType.TRAININGVIDEOS:
        icon = "fas fa-video"
        break;
      case ContentType.RELEASENOTES:
        icon = "fa fa-sticky-note-o"
        break;
      case ContentType.USERGUIDE:
        icon = "fas fa-book"
        break;
      default:
        icon = "fas fa-book"
        break;
    }
    return { icon };
  };

  innerGroupIcon = (fileType) => {
    var cardIcon = "";
    var cardIconColor = "";
    switch (fileType) {
      case DocFileType.WORD:
        cardIcon = "fas fa-file-word"
        cardIconColor = "#0045A6"
        break;
      case DocFileType.WORD_DOC:
        cardIcon = "fas fa-file-word"
        cardIconColor = "#0045A6"
        break;
      case DocFileType.WORD_DOCX:
        cardIcon = "fas fa-file-word"
        cardIconColor = "#0045A6"
        break;
      case DocFileType.VIDEO:
        cardIcon = "fas fa-video"
        cardIconColor = "#5BC0F8"
        break;
      case DocFileType.VIDEO_MKV:
        cardIcon = "fas fa-video"
        cardIconColor = "#5BC0F8"
        break;
      case DocFileType.PDF:
        cardIcon = "fas fa-file-pdf"
        cardIconColor = "#AE030D"
        break;
      case DocFileType.EXCEL:
        cardIcon = "fas fa-file-excel"
        cardIconColor = "#1C6C40"
        break;
      case DocFileType.EXCEL_XLS:
        cardIcon = "fas fa-file-excel"
        cardIconColor = "#1C6C40"
        break;
      case DocFileType.EXCEL_XLSX:
        cardIcon = "fas fa-file-excel"
        cardIconColor = "#1C6C40"
        break;
      case DocFileType.IMAGE_PNG:
        cardIcon = "fas fa-image"
        cardIconColor = "#28AAE5"
        break;
      case DocFileType.IMAGE_JPEG:
        cardIcon = "fas fa-image"
        cardIconColor = "#28AAE5"
        break;
      case DocFileType.IMAGE_JPG:
        cardIcon = "fas fa-image"
        cardIconColor = "#28AAE5"
        break;
      default:
        cardIcon = "fas fa-file"
        cardIconColor = "#5BC0F8"
        break;
    }
    return { cardIcon, cardIconColor };
  };

  // downloadFile = (filePath) => {
  //   this.setState({ fileUrl:""});
  //   if (filePath ==undefined) {
  //     errorToastr(NOT_DOWNLOADABLE);
  //   } else {
      
  //     axios
  //     .get(`/api/home/documenturl?fileName=${filePath}`)
  //     .then((res: any) => {
  //         if (res) {
  //           console.log(res.data);
  //           let fileExt = filePath.split('.')[1].toLowerCase();
  //           let fileType;
  //           if (fileExt=='jpg' || fileExt=='png' || fileExt=='jpeg') {
  //               fileType = 'image';
  //           }
  //           else if(fileExt=='pdf'){
  //               fileType = 'pdf'
  //           }
  //           else if(fileExt=='docx'){
  //               fileType = 'word'
  //           }
  //           else if(fileExt=='xlsx'){
  //               fileType = 'excel'
  //           }
  //           else if(fileExt=='mp4'){
  //               fileType = 'video'
  //           }
  //           else {
  //               fileType = 'application'
  //           }
  //           this.setState({ fileUrl: res.data,fileType: fileType });
  //         }
  //       })
  //   }
  // };

  render() {
    const element = this.state.CheckBoxData;

    const notes = [];
    this.state.contentData.forEach((item) => {
      let isNoteExist = false;
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].notes ==item.contentType) {
          isNoteExist = true;
          break;
        }
      }
      if (!isNoteExist) {
        notes.push({ notes: item.contentType });
      }
    });
    return ( 
      <div className="col-11 mx-auto pl-0 pr-0 mt-3 mt-md-0">
       {this.state.fileUrl && (<DocumentViewer fileType={this.state.fileType} fileUrl={this.state.fileUrl} />)}
        <div className="container-fluid mt-3 mb-4 d-md-block d-none">
          <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-10 fonFifteen paddingLeftandRight">
              <BreadCrumbs></BreadCrumbs>
            </div>
            <div className="col-2">
              <span className="float-right text-dark">
                <div>
                  <Switch
                    onLabel={""}
                    offLabel={""}
                    checked={this.state.CheckBoxData}
                    onChange={(e) => this.handleChange(e, "CheckBoxData")}
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            page="ViewContentLibrary"
            entityType={"Content Library"}
            placeholder="Search text here!"
            handleSearch={this.getContentLibrary}
            onFirstLoad={this.state.onFirstLoad}
          />
          {this.state.showLoader &&
            Array.from({ length: 4 }).map((item, i) => (
              <div className="row mx-auto mt-2" key={i}>
                {Array.from({ length: 3 }).map((item, j) => (
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                    <Skeleton width={50} />
                    <Skeleton height={100} />
                  </div>
                ))}
              </div>
            ))}
          {!this.state.showLoader &&
            <div className="row ">
              {!element
                ? this.state.contentData.map((i) => {
                  let fileIcon = this.fileIcon(i.fileType);
                  let cardTextColor = this.cardTextColor(i.contentType);
                  return (
                    <div
                      className="col-sm-6 col-md-4 col-lg-3 px-1 contentLib_custome_card mb-3"
                      key={i.id}
                    >
                      <div className="card-body shadow-sm contentLib_border d-flex flex-column">
                        <div className="d-flex align-items-start justify-content-start">
                          <i
                            className={fileIcon.icon}
                            style={{ color: fileIcon.iconColor, fontSize: "25px" }}
                          ></i>
                          <div className="pl-3">
                            <h5
                              className="card-text mt-0"
                              style={{
                                textDecoration: "underline",
                                fontWeight: "bold",
                                fontFamily: " 'Noto Sans', sans-serif",
                                fontSize: "15px",
                                overflow: "hidden",
                                textOverflow: "clip",
                                display: "block",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                cursor: "pointer"
                              }}
                              //onClick={() => this.downloadFile(i.path)}
                            >
                              {i.title}
                            </h5>
                            <p
                              className="card-btn-style mt-0 ml-0 mr-0"
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                                fontFamily: " 'Noto Sans', sans-serif",
                                color: `${cardTextColor.textColor}`,
                                backgroundColor: `${cardTextColor.textBgColor}`,
                              }}
                            >
                              {i.contentType}
                            </p>
                          </div>
                        </div>
                        <p className="contentLib_Desc" title={i.description}>{i.description}</p>
                      </div>
                    </div>
                  );
                })
                : notes.map((item) => {
                  let icons = this.groupIcon(item.notes);
                  return (
                    <>
                      <div className="col-12 contentLib_title mb-2 mt-4">
                        <span>
                          <i className={icons.icon} style={{ fontSize: "18px" }}></i>
                        </span>
                        <h6
                          style={{
                            fontWeight: "bold",
                            fontFamily: " 'Noto Sans', sans-serif",
                            display: "inline",
                            fontSize: "15px",
                          }}
                        >
                          {" "}
                          {item.notes}
                        </h6>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          {this.state.contentData
                            .filter((x) => x.contentType==item.notes)
                            .map((i) => {
                              let innerGroupIcon = this.innerGroupIcon(i.fileType);
                              return (
                              <div
                                className="col-sm-6 col-md-4 col-lg-3 px-1 contentLib_custome_card mb-3"
                                key={i.id}
                              >
                                <div className="card-body shadow-sm contentLib_border d-flex flex-column">
                                  <div className="d-flex align-items-start justify-content-start">
                                    <i
                                      className={innerGroupIcon.cardIcon}
                                      style={{
                                        color: innerGroupIcon.cardIconColor,
                                        fontSize: "25px",
                                      }}
                                    ></i>
                                    <div className="pl-3">
                                      <h5
                                        className="card-text mt-0"
                                        style={{
                                          textDecoration: "underline",
                                          fontWeight: "bold",
                                          fontFamily: " 'Noto Sans', sans-serif",
                                          fontSize: "14px",
                                          overflow: "hidden",
                                          textOverflow: "clip",
                                          display: "block",
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                          cursor: "pointer"
                                        }}
                                      >
                                        {i.title}
                                      </h5>
                                    </div>
                                  </div>
                                  <p
                                    className="contentLib_Desc"
                                    style={{
                                      position: "relative",
                                      top: "11px",
                                    }}
                                    title={i.description}
                                  >
                                    {i.description}
                                  </p>
                                </div>
                              </div>
                            );
                            })}
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          }
          <div className="modal-footer justify-content-center border-0">
            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
              <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ViewcontentLibLibrary;