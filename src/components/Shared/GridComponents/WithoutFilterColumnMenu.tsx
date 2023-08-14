import React from "react";
import { GridColumnMenuSort, GridColumnMenuFilter, GridColumnMenuProps } from "@progress/kendo-react-grid";

class WithoutFilterColumnMenu extends React.Component<GridColumnMenuProps, {}> {
    render() {
        return (
            <div className="columnMenu">
                <GridColumnMenuSort column={this.props.column} {...this.props} />
            </div>
        );
    }
}

export default WithoutFilterColumnMenu;
