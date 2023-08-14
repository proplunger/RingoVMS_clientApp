import * as React from "react";

export interface JobPositionProps {}

export interface JobPositionState {}

class JobPosition extends React.Component<JobPositionProps, JobPositionState> {
    constructor(props: JobPositionProps) {
        super(props);
        this.state = {};
    }
    render() {
        return <div>Add Position Screen</div>;
    }
}

export default JobPosition;
