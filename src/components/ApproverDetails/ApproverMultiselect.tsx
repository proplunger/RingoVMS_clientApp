import React from 'react';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { GridCellProps, GridCell } from '@progress/kendo-react-grid';
import { DropdownOption } from './IApproverDetailsState';

export class DropdownMultiSelectCell extends React.Component
    <{ cellProps: GridCellProps, approverList: Array<DropdownOption> }, {}> {

    handleChange = (e) => {

    }

    render() {
        const { dataItem, field } = this.props.cellProps;
        const dataValue = dataItem[field] ==null ? '' : dataItem[field];

        return (
            <td>
                {dataItem.inEdit ? (
                    <MultiSelect
                        style={{ width: "100px" }}
                        onChange={this.handleChange}
                        value={dataValue}
                        data={this.props.approverList}
                        textField="text"
                    />
                ) : (
                    dataItem[field].map(x => x.label).join(', ')
                )}
            </td>
        );
    }
}

export function ApproverSingleAllRadioControl({ SelectRadioItem }) {
    return class extends GridCell {
        render() {
            const { dataItem, field } = this.props;
            const selectedValue = dataItem[field];

            return (
                <td contextMenu="One / All">
                    <input type="radio" name="group1" value="one" checked={selectedValue =='one'} onChange={SelectRadioItem} />
                    <input type="radio" name="group1" value="all" checked={selectedValue =='all'} onChange={SelectRadioItem} />
                </td>
            );
        }
    };
}