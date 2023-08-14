import React from "react";
import { GridColumnMenuSort, GridColumnMenuFilter, GridColumnMenuProps } from "@progress/kendo-react-grid";

class WithoutSortingColumnMenu extends React.Component<GridColumnMenuProps, {}> {
    render() {
        return (
            <div className="columnMenu">
                <GridColumnMenuFilter
                    column={this.props.column}
                    filterOperators={this.props.filterOperators}
                    {...this.props}
                />
            </div>
        );
    }
}

export default WithoutSortingColumnMenu;