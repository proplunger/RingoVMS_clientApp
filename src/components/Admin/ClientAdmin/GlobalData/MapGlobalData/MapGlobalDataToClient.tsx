import * as React from "react";
import Collapsible from "react-collapsible";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faChevronCircleDown, faChevronCircleUp, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AssignmentTypes from "../AssignmentTypes";
import RequisitionReasons from "../RequisitionReasons";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface MapGlobalDataToClientProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface MapGlobalDataToClientState {
    clientId?: string;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    onFirstLoad: boolean;
}

class MapGlobalDataToClient extends React.Component<MapGlobalDataToClientProps, MapGlobalDataToClientState> {
    public assignmentType: any;
    public requisitionReasons: any;
    constructor(props: MapGlobalDataToClientProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggleFirst: true,
            toggleSecond: true,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false,
        });
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 col-md-4 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                            <BreadCrumbs></BreadCrumbs>
                             </div>
                        </div>

                        <div className="col-2 col-md-8 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
                            {(this.state.toggleFirst && this.state.toggleSecond ) ||
                                this.state.toggleAll ? (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleUp}
                                    onClick={
                                        this.state.toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            ) : (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleDown}
                                    onClick={
                                        this.state.toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            )}
                        </div>
                    </div>
                </div>

                            <div className="col-12">
                                <Collapsible
                                    trigger="Assignment Types"
                                    open={this.state.toggleFirst}
                                    onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                    onTriggerClosing={() => this.setState({ toggleFirst: false })}
                                >

                                    <AssignmentTypes
                                        ref={(instance) => {
                                            this.assignmentType = instance;
                                        }}
                                        entityType="AssignmentType"
                                        clientId={this.state.clientId}
                                        canEdit={true}
                                        key="AssignmentType"
                                    />
                                </Collapsible>

                                <Collapsible
                                    trigger="Requisition Reasons"
                                    open={this.state.toggleSecond}
                                    onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                    onTriggerClosing={() => this.setState({ toggleSecond: false })}
                                >
                                    <RequisitionReasons
                                        ref={(instance) => {
                                            this.requisitionReasons = instance;
                                        }}
                                        entityType="requisitionReasons"
                                        clientId={this.state.clientId}
                                        canEdit={true}
                                        key="Requisition Reasons"
                                    />
                                </Collapsible>
                            </div>

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <Link to="/admin/client">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                        </button>
                                    </Link>
                                </div>
                            </div>
            </div>
        );
    }

}

export default MapGlobalDataToClient;