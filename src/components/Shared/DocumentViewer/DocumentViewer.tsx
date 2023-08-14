import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@progress/kendo-react-dialogs';
import React, { Component } from 'react';
import FileViewer from "react-file-viewer";
type FileType = 'excel' | 'pdf' | 'word' | 'video' | 'image';

interface DocumentViewerProps {
  fileType: FileType;
  fileUrl: string;
}
interface DocumentViewerState {
  showDocument?: any;
}

class DocumentViewer extends Component<DocumentViewerProps, DocumentViewerState> {
  constructor(props: DocumentViewerProps) {
    super(props);
    this.state = {
      showDocument: true
    };

  }
  componentDidMount(): void {
    this.state = {
      showDocument: true
    };
    this.disableInspectElement();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    if (event.ctrlKey && event.key =='s') {
      event.preventDefault();
    }
  }

  handleDocShow = () => {
    this.setState({
      showDocument: false,
    })
  }

  handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  handleDragStart = (e) => {
    e.preventDefault();
  };

  disableInspectElement() {
    const disableInspect = (event) => {
      if ((event.ctrlKey && (event.shiftKey || event.key =='i' || event.keyCode ==73)) ||
        (event.metaKey && event.altKey && (event.key =='u' || event.keyCode ==85)) ||
        (event.metaKey && event.altKey && (event.key =='c' || event.keyCode ==67))) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', disableInspect);
    document.addEventListener('contextmenu', disableInspect);
  }
  render() {
    const { fileType, fileUrl } = this.props;
    const typeOfFile = {
      pdf: 'application/pdf',
      excel: "xlsx",
      word: 'docx',
      image: 'image/jpeg',
      video: 'video/mp4'
    }[fileType];

    return (
      <div id="impersonate-popup" onContextMenu={this.handleContextMenu}>
        {fileUrl && this.state.showDocument && (
          <Dialog className='w-654'>
            <div className="d-print-none modal-header rounded-0 bg-blue d-flex justify-content-start align-items-center pt-1 pb-0">
              <div className="col-12  pt-2 pb-2 fontFifteen text-left modal-title text-white fontFifteen">
               <span className="doc-viewer-title">
               Document Preview
               </span>
                <span className="float-right doc-viewer-cross" onClick={this.handleDocShow}>
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                </span>
              </div>
            </div>
            <div className="col-12 mx-0 Introduction-firstHeader" id="tnc">
              {
                fileType =='pdf' ? <div className="row mx-0 pr-4 pl-4 pdf-doc-left">
                  {/* <object data={fileUrl + "#toolbar=0"}
                    width="100%"
                    height="400">
                  </object> */}
                  <div className="col-12 ">
                    <FileViewer
                      fileType={fileType}
                      filePath={fileUrl}
                    />
                  </div>
                </div>
                  : fileType =='image' ? <div className="row mx-0 pr-4 pl-4" onContextMenu={this.handleContextMenu} style={{ display: "flex", justifyContent: "center" }}>
                    <img src={fileUrl}
                      width="100%" height="auto"
                      onContextMenu={e => e.preventDefault()} draggable={false} />

                  </div>
                    : fileType =='excel' ? <div className="row mx-0 pr-4 pl-4" onContextMenu={this.handleContextMenu} style={{ height: '800px' }}>
                      <div className="col-12 pt-4 h-100">
                        <FileViewer
                          className="h-100 w-100"
                          fileType={"xlsx"}
                          filePath={fileUrl}
                        />
                      </div>
                    </div>
                      : fileType =='word' ? <div className="row mx-0 pr-4 pl-4 p-select " onContextMenu={this.handleContextMenu} style={{ display: "flex", justifyContent: "center" }}>
                        <div className="col-12">
                          <FileViewer
                            fileType={"docx"}
                            filePath={fileUrl}
                            // style={{}}
                          />
                        </div>
                      </div>
                        : fileType =='video' ?
                          <div className="col-12 text-center">
                            <video className="mx-0 pr-4 pl-4"
                              controls
                              controlsList="nodownload"
                              onContextMenu={(e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => e.preventDefault()}
                              width={600}
                              height={277}
                              style={{ marginTop: "5px" }}
                            >
                              <source src={fileUrl} type={typeOfFile} />
                            </video>
                          </div>
                          : <>This type of {fileType} file type is not supported.</>
              }
            </div>
            <div className="row mx-0 w-100 d-print-none">
              <div className="col-12">
                <div className="modal-footer justify-content-center border-0">
                  <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                    <button type="button" className="btn button button-close mr-2 shadow mb-0 mb-xl-0" onClick={() => this.handleDocShow()}>
                      <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>


    )
  }
}

export default DocumentViewer;