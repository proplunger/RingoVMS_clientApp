import React, { Component } from 'react';
import Shimmer from "react-shimmer-effect";

class ApproveTimesheetShimmer extends Component {
    render() {
        return (
            <div>
                 <Shimmer>
                        <div className="line" id="line1" key="line1">
                        </div>
                        <div className="line" id="line2" key="line2">
                        </div>
                        <div className="line" id="line3" key="line3">
                        </div>
                        <div className="line" id="line4" key="line4">
                        </div>
                        <div className="line nextShimmerDiv" id="line5" key="line5">
                        </div>
                        <div className="line" id="line6" key="line6">
                        </div>
                        <div className="line" id="line7" key="line7">
                        </div>
                        <div className="line" id="line8" key="line8">
                        </div>
                        <div className="line nextShimmerDiv" id="line10" key="line10">
                        </div>
                        <div className="line" id="line9" key="line9">
                        </div>
                        <div className="line" id="line11" key="line11">
                        </div>
                    </Shimmer>
            </div>
        );
    }
}

export default ApproveTimesheetShimmer;