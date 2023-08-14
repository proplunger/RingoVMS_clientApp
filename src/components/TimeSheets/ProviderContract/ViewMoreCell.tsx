import { GridDetailRow } from "@progress/kendo-react-grid";
import * as React from "react";
import { currencyFormatter } from "../../../HelperMethods";

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
                                <label className='mb-0'>Overtime Bill Type :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.overtimeBillType}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Guaranteed Bill Type :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.guaranteedBillType}</label>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
