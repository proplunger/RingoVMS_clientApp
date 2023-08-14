import * as React from "react";
import Collapsible from "react-collapsible";
import PageTitle from "../../Shared/Title";

export interface ICreateCandidateProps {}

export interface ICreateCandidateState {}

class CreateCandidate extends React.Component<ICreateCandidateProps, ICreateCandidateState> {
    constructor(props: ICreateCandidateProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        <PageTitle title="Create Candidate"/>
                        <div className="col-12">
                            <Collapsible trigger={"Create Candidates"} open={true}>
                                <div className="mt-5 text-center">
                                    <img src={require("../../../assets/images/under_const.png")} />
                                </div>
                            </Collapsible>
                            
                        </div>
                    </div>
                </div>
                
            </React.Fragment>
        );
    }
}

export default CreateCandidate;