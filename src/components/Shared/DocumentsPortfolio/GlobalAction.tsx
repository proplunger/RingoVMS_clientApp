import * as React from "react";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

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
                                <label className='mb-0'>Uploaded By :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                    {props.uploadedBy !=null ? props.uploadedBy : "-"} </label>
                            </div>
                        </div>
                        {props.description && props.description.ApprovedByClient &&
                            <>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className='mb-0'>Approved By Client :</label>
                                    </div>
                                    <div className="col-6 text-left pl-0 pr-0">
                                        <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                            {props.description && props.description.ApprovedByClient || "-"}</label>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className='mb-0'>Approved By Client User :</label>
                                    </div>
                                    <div className="col-6 text-left pl-0 pr-0">
                                        <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                            {props.description && props.description.ApprovedByClientUser || "-"}</label>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-6">
                                        <label className='mb-0'>Approved By Client Date :</label>
                                    </div>
                                    <div className="col-6 text-left pl-0 pr-0">
                                        <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                            {props.description && `${dateFormatter(props.description.ApprovedByClientDate)} ${convertShiftDateTime(props.description.ApprovedByClientDate)}` || "-"} </label>
                                    </div>
                                </div>

                                {props.description && (props.status =="Executed" ||
                                    props.status =="Inactive") && props.description.ApprovedByVendor &&
                                    <>
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <label className='mb-0'>Approved By Vendor :</label>
                                            </div>
                                            <div className="col-6 text-left pl-0 pr-0">
                                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                                    {props.description && props.description.ApprovedByVendor || "-"}</label>
                                            </div>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <label className='mb-0'>Approved By Vendor User :</label>
                                            </div>
                                            <div className="col-6 text-left pl-0 pr-0">
                                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                                    {props.description && props.description.ApprovedByVendorUser || "-"}</label>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <label className='mb-0'>Approved By Vendor Date :</label>
                                            </div>
                                            <div className="col-6 text-left pl-0 pr-0">
                                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                                    {props.description !=null ? `${dateFormatter(props.description.ApprovedByVendorDate)} ${convertShiftDateTime(props.description.ApprovedByVendorDate)}` : "-"} </label>
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};