import Skeleton from "react-loading-skeleton";
import * as React from "react";

export interface SkeletonWidgetProps {
  length?: any;
  breadth?: any;
}

class SkeletonWidget extends React.Component<SkeletonWidgetProps> {
  length;
  breadth;
  constructor(props: SkeletonWidgetProps) {
    super(props);
     this.length = props.length;
    this.breadth = props.breadth;
  }
  render() {
    return Array.from({ length: this.length !=null && this.length !=undefined ? this.length : 3 }).map((item, i) => (
      <div className="row mx-auto mt-2" key={i}>
        {Array.from({ length: this.breadth !=null && this.breadth !=undefined ? this.breadth : 3 }).map((item, j) => (
          <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
            <Skeleton width={100} />
            <Skeleton height={30} />
          </div>

        ))}
      </div>
    ));
  }
}

export default SkeletonWidget;
