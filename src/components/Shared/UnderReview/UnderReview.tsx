import * as React from "react";
import auth from "../../Auth";
import { TabStrip, TabStripTab, TabStripSelectEventArguments } from '@progress/kendo-react-layout';
import UnderReviewTimesheets from "../../TimeSheets/UnderReviewTimesheets/UnderReviewTimesheets";
import UnderReviewVendorInvoices from "../../Vendor/UnderReviewVendorInvoices/UnderReviewVendorInvoices";
import { AppPermissions } from "../Constants/AppPermissions";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs";

export interface UnderReviewProps { }

export interface UnderReviewState {
    selected: number;
}

class UnderReview extends React.Component<UnderReviewProps, UnderReviewState> {
    constructor(props: UnderReviewProps) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    handleSelect = (e: TabStripSelectEventArguments) => {
        this.setState({ selected: e.selected })
    }

    render() {
        return (
            <div className="col-11 mx-auto" id="searchCard">
                <div className="mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                        </div>
                    </div>
                </div>
                <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
                    {auth.hasPermissionV2(AppPermissions.TS_UNDER_REVIEW_CREATE) && (
                    <TabStripTab title="Timesheet">
                        <UnderReviewTimesheets />
                    </TabStripTab>
                    )}
                    {auth.hasPermissionV2(AppPermissions.VI_UNDER_REVIEW_CREATE) && (
                    <TabStripTab title="Vendor Invoice">
                        <UnderReviewVendorInvoices />
                    </TabStripTab>
                    )}
                </TabStrip>
            </div>
        );
    }
}

export default UnderReview;