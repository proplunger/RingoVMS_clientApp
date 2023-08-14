import React, { Component } from "react";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export interface ExtensionStatusCardProps {
    dataItem: any;
}

export interface ExtensionStatusCardState {
    data?: any;
    isDataLoaded: boolean;
}

export default class ExtensionStatusCard extends Component<
    ExtensionStatusCardProps,
    ExtensionStatusCardState
> {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
        };
    }

    render() {
        const {
            newStatus,
            actionDate,
            actionBy
        } = this.props.dataItem;
        return (
            <div className="row mt-0 ml-0 mr-0">
                <div className="col-12 tooltippoup pl-0 pr-0 pt-0 max-auto mb-0 he">
                    <div className="row mt-1 ml-0 mr-0">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-12 text-left text-sm-left">
                                    <p className="hold-position_font-size">Extension History:</p>
                                </div>
                                <div className="col-12 text-left">
                                    <p className="hold-position_font-size font-weight-normal">
                                        {newStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col-12 text-left text-sm-left">
                                    <p className="hold-position_font-size">Action Date:</p>
                                </div>
                                <div className="col-12 text-left">
                                    <p className="hold-position_font-size font-weight-normal">
                                        {dateFormatter(new Date(actionDate))} {convertShiftDateTime(actionDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-1 ml-0 mr-0">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-12 text-left text-sm-left">
                                    <p className="hold-position_font-size">Action By:</p>
                                </div>
                                <div className="col-12 text-left">
                                    <p className="hold-position_font-size font-weight-normal">
                                        {actionBy}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}