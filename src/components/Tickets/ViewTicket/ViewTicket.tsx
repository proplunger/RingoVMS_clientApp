import { faChevronCircleDown, faChevronCircleUp, faClock, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { history } from "../../../HelperMethods";
import Collapsible from "react-collapsible";
import ticketService from "../Services/DataService";
import ViewTicketInformation from "./ViewTicketInformation";
import ViewResolution from "./ViewResolution";
import TicketData from "../CreateTicket/TicketData";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import CommentHistoryView from "../../Shared/Comment/CommentHistoryView";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
import axios from "axios";

export interface ViewTicketProps {
    match: any;
}

export interface ViewTicketState {
    ticketId: string;
    ticketDetails: any;
    toggleAll: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    toggleThird: boolean;
    toggleFourth: boolean;
    showCommentModal?: boolean;
    isPrivate?: boolean;
    fileArray: any;
}

class ViewTicket extends React.Component<ViewTicketProps, ViewTicketState> {
    constructor(props: ViewTicketProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            ticketId: id,
            ticketDetails: {},
            toggleAll: false,
            toggleFirst: true,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
            fileArray: []
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ ticketId: id });
        this.getTicketDetails(id);
        this.getDocuments(id);
    }

    getTicketDetails(ticketId) {
        let queryParams = `ticketId eq ${ticketId}`;
        ticketService.viewTicketDetails(queryParams).then((res) => {
            const { data } = res;
            const ticketDetails = { ...data };
            this.setState({ ticketDetails: ticketDetails[0] });
        });
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
            toggleThird: true,
            toggleFourth: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
        });
    };

    getDocuments = (entityId) => {
        axios.get(`api/ts/documents?tsWeekId=${entityId}`).then((res) => {
            if (res.data) {
                let fileArray = [];
                res.data.forEach((doc) => {
                    fileArray.push({
                        candDocumentsId: doc.candDocumentsId,
                        fileName: doc.fileName,
                        file: undefined,
                        isValid: true,
                        path: doc.filePath,
                    });
                });
                this.setState({ fileArray: fileArray });
            }
        });
    };

    download = (filePath) => {
        axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
            if (res) {
                let fileExt = filePath.split('.')[1].toLowerCase();
                let fileType;
                if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
                    fileType = "image";
                } else {
                    fileType = "application";
                }
                const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                const downloadLink = document.createElement("a");
                let fileName = filePath.split("/")[2];

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        });
    };

    render() {
        const { ticketId, ticketDetails, fileArray } = this.state;
        const {
            toggleAll,
            toggleFirst,
            toggleSecond,
            toggleThird,
            toggleFourth
        } = this.state;

        const ticketTriggerName = (
            <span>
                Ticket Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status : {ticketDetails.tktStatus}
                </span>
            </span>
        );

        return (
            <React.Fragment>
                <div>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                    <div className="col-12 ml-0 mr-0">
                        <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                            <div className="col-9 col-md-9 fonFifteen paddingLeftandRight">
                                <div className="d-none d-md-block"><BreadCrumbs globalData={{ticketId:ticketId}}></BreadCrumbs></div>
                            </div>
                            <div className="col-3 col-md-3 text-right mt-sm-1 mt-md-0 txt-orderno paddingRight d-flex align-items-center justify-content-end">
                                Ticket #: {ticketDetails.ticketNumber}
                                {(toggleFirst && toggleSecond && toggleThird && toggleFourth) ||
                                    toggleAll ? (
                                    <FontAwesomeIcon
                                        className="ml-2 mt-0 text-primary collapseExpandIcon globalExpandCursor"
                                        icon={faChevronCircleUp}
                                        onClick={
                                            toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                        }
                                    ></FontAwesomeIcon>
                                ) : (
                                    <FontAwesomeIcon
                                        className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                        icon={faChevronCircleDown}
                                        onClick={
                                            toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                        }
                                    ></FontAwesomeIcon>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        {this.state.ticketId && (
                            <React.Fragment>
                                <span className="d-block d-md-none text-right">
                                    Status : {ticketDetails.tktStatus}
                                </span>

                                <Collapsible
                                    trigger={ticketTriggerName}
                                    open={toggleFirst}
                                    onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                    onTriggerClosing={() => this.setState({ toggleFirst: false })}
                                >
                                    <ViewTicketInformation
                                        ticketId={this.state.ticketId}
                                        ticketDetails={ticketDetails}
                                        documents={fileArray}
                                        download={this.download}
                                    />
                                </Collapsible>

                                <Collapsible
                                    trigger="Resolution"
                                    open={toggleSecond}
                                    onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                    onTriggerClosing={() =>
                                        this.setState({ toggleSecond: false })
                                    }
                                >
                                    <ViewResolution
                                        ticketId={this.state.ticketId}
                                        ticketDetails={ticketDetails}
                                    />
                                </Collapsible>

                                {/* <Collapsible
                                    trigger="Case Data"
                                    lazyRender={true}
                                    open={toggleThird}
                                    onTriggerOpening={() => this.setState({ toggleThird: true })}
                                    onTriggerClosing={() => this.setState({ toggleThird: false })}
                                >
                                    <TicketData
                                        data={ticketDetails}
                                        ticketId={ticketId}
                                    />
                                </Collapsible> */}

                                <Collapsible
                                    trigger="Activity"
                                    lazyRender={true}
                                    open={toggleFourth}
                                    onTriggerOpening={() => this.setState({ toggleFourth: true })}
                                    onTriggerClosing={() => this.setState({ toggleFourth: false })}
                                >
                                    <div className="row mb-0 align-items-center">
                                        <div className="col-12 col-sm-6 col-xl-6 text-center text-sm-left font-weight-bold"
                                            //onClick={() => this.setState({ showCommentModal: true, isPrivate: null })}
                                            >
                                            <span className="cursor-pointer pl-1">
                                                Comments
                                            </span>
                                            {/* <span>
                                                <FontAwesomeIcon icon={faClock} className="ml-2 active-icon-blue ClockFontSize cursor-pointer" />
                                            </span> */}
                                            <CommentHistoryView
                                                    entityType={"Ticket"}
                                                    entityId={ticketId}
                                                    showDialog={true}
                                                    isPrivate={this.state.isPrivate}
                                                />
                                        </div>
                                    </div>
                                </Collapsible>
                            </React.Fragment>
                        )}
                    </div>
                    </div>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                        </div>
                    </div>

                    {this.state.showCommentModal && (
                        <CommentHistoryBox
                            entityType={"Ticket"}
                            entityId={ticketDetails.ticketId}
                            showDialog={this.state.showCommentModal}
                            handleNo={() => {
                                this.setState({ showCommentModal: false });
                                document.body.style.position = "";
                            }}
                            isPrivate={this.state.isPrivate}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default ViewTicket;
