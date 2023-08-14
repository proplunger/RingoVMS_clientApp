import axios from 'axios';
import * as React from 'react';
import Collapsible from 'react-collapsible';
import { candTriggerName, convertShiftDateTime, eventdateFormatter } from '../../../../ReusableComponents';
import PageTitle from '../../../../Shared/Title';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { history } from '../../../../../HelperMethods';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export interface ViewEventsLogsProps {
    match: any;
}

export interface ViewEventsLogsState {
    toggelFirst: boolean;
    showLoader?: boolean;
    eventData?: string;
    eventDate?: string
    eventType?: string;
    entityType?: string;
    entityData?: string;
    eventVersion?: string;
}

export default class ViewEventsLog extends React.Component<ViewEventsLogsProps, ViewEventsLogsState> {
    constructor(props: ViewEventsLogsProps) {
        super(props);
        this.state = {
            toggelFirst: true,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.getEventsLogsDetails(id);
    }
    
    getEventsLogsDetails(id) {
        this.setState({ showLoader: true });
        axios.get(`api/events/${id}`).then((res) => {
                this.setState({
                    eventData: res.data.eventData,
                    eventType: res.data.eventType,
                    eventDate: res.data.eventDate,
                    entityData: res.data.entityData,
                    entityType: res.data.entityType,
                    eventVersion: res.data.eventVersion,
                    showLoader: false,
                });
            });
    }

    render() {
        const { id } = this.props.match.params;
        const JSONPrettyMon = require('react-json-pretty/dist/monikai');
        const eventDate = `${eventdateFormatter(this.state.eventDate)} ${convertShiftDateTime(this.state.eventDate)}`;
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        <PageTitle
                            eventId={id}
                            title="Events Logs"
                        />
                        <div className="col-12">
                            <Collapsible
                                trigger={candTriggerName(
                                    "Event Log Information"
                                )}
                                open={this.state.toggelFirst}
                                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                onTriggerClosing={() => this.setState({ toggelFirst: false })}
                            >
                                <div className='col-12'>
                                    <div className="row">
                                        <div className="col-4 col-md-2 text-right">Event Type :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div">
                                            {this.state.eventType}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4 col-md-2 text-right">Entity Type :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div">
                                            {this.state.entityType}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4 col-md-2 text-right">Entity Data :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div">
                                            {this.state.entityData}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4 col-md-2 text-right">Event Date :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div">
                                            {eventDate}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4 col-md-2 text-right">Event Version :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div">
                                            {this.state.eventVersion}
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-4 col-md-2 text-right">Event Data :</div>
                                        <div className="col-8 col-md-10 font-weight-bold pl-0 text-left word-break-div data-logs">
                                            <p style={{ "width": "100vw" }}> <JSONPretty style={{ fontSize: "1em" }} theme={JSONPrettyMon} id="json-pretty" data={this.state.eventData}
                                                space="4" mainStyle="padding:0.5em"></JSONPretty></p>
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}