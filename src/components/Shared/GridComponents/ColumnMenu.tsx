import React from "react";
import { GridColumnMenuSort, GridColumnMenuFilter, GridColumnMenuProps } from "@progress/kendo-react-grid";

class ColumnMenu extends React.Component<GridColumnMenuProps, {}> {
    render() {
        console.log("this.props from column menu", this.props, "filter oprerators", this.props.filterOperators)
        return (
            <div className="columnMenu">
                <GridColumnMenuSort column={this.props.column} {...this.props} />
                <GridColumnMenuFilter
                    // column={this.props.column}
                    // filterOperators={this.props.filterOperators}
                    expanded={true}
                    {...this.props}
                // filter={{ logic: "or", filters: [{ ignoreCase: false, value: "", field: "", operator: "contains" }] }}
                />
            </div>
        );
    }
}

export default ColumnMenu;
