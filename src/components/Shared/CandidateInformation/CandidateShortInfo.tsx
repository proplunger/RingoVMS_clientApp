import * as React from "react";
import SkeletonWidget from "../../Shared/Skeleton";
import axios from "axios";

export interface CandidateShortInfoProps {
  candidateId: any;
  location: any;
}

export interface CandidateShortInfoState {
  showLoader?: boolean;
  candDetails: any;
}

export class CandidateShortInfo extends React.Component<
  CandidateShortInfoProps,
  CandidateShortInfoState
> {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      candDetails: {},
    };
  }

  componentDidMount() {
    this.getCandidateDetails(this.props.candidateId);
  }

  getCandidateDetails(candidateId) {
    this.setState({ showLoader: true });
    if (candidateId) {
      axios.get(`api/candidates/${candidateId}`).then((res) => {
        this.setState({
          candDetails: res.data,
          showLoader: false,
        });
      });
    }
  }

  render() {
    return (
      <div>
        {/* {this.state.showLoader && <SkeletonWidget length={1} breadth={3}  />} */}
        {!this.state.showLoader && (
          <div className="mb-4">
            <div className="row text-dark">
              <div className="col-12 col-sm-4">
                <div className="row">
                  <div className="col-6 col-sm-auto text-left font-weight-bold">Candidate Name:</div>
                  <div className="col-6 col-sm font-weight-bold pl-0 pr-0 text-left">
                    {this.state.candDetails.candidateName}
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-sm-4 mt-2 mt-sm-0">
                <div className="row">
                  <div className="col-6 col-sm-auto text-left font-weight-bold">Position :</div>
                  <div className="col-6 col-sm font-weight-bold pl-0 pr-0 text-left">
                    {this.state.candDetails.jobPosition}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 mt-2 mt-sm-0">
                <div className="row">
                  <div className="col-6 col-sm-auto text-left font-weight-bold">Location :</div>
                  <div className="col-6 col-sm font-weight-bold pl-0 pr-0 text-left">
                    {this.props.location}
                  </div>
                </div>
              </div>
            </div>
            </div>
        )}
      </div>
    );
  }
}

export default CandidateShortInfo;
