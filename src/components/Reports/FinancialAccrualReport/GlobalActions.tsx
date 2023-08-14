import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faColumns
} from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { Link } from "react-router-dom";
import { MANAGE_VENDOR_INVOICES } from "../../Shared/ApiUrls";

export const JobDetailCell = (props) => {
    var pageUrl = "/jobdetail/" + props.dataItem.candSubmissionId;
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    return (
        <td contextMenu="Provider Name">
            <Link className="clientInvoiceNumberTd orderNumberTdBalck" to={pageUrl}>               
                {(props.dataItem.providerName)}{" "}
            </Link>
        </td>
    );
};

export const ClientInvoiceNumberCell = (props) => {
    var pageUrl = `${MANAGE_VENDOR_INVOICES}/${props.dataItem.clientInvoiceId}`;
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    return (
        <td contextMenu="Client Invoice Number">
            <Link className="clientInvoiceNumberTd orderNumberTdBalck" to={pageUrl}>
                {props.dataItem.clientInvoiceNumber}
            </Link>
        </td>
    );
};

export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any; style:any;rowType: any}> {
    render() {
        let dataItem = this.props.dataItem;
        if (this.props.rowType=="groupHeader") {
            return <td colSpan={0} className="d-none"></td>;
        }
        return (
            <td contextMenu="View More" style={this.props && this.props.style} className={'k-grid-content-sticky text-center'}>
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
                                <label className='mb-0'>Client :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.client ? props.client : "-"}
                                </label>
                            </div>
                        </div>
                        {/* <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Division :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.division ? props.division : "-"}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Position :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.position ? props.position : "-"}
                                </label>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export enum ALLSELECTED {
    ALLPROVIDERS = "All Providers",
    ALLLOCATIONS = "All Locations",
    ALLVENDORS = "All Vendors",
}