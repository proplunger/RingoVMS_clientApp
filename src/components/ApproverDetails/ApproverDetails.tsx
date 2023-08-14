import React, { Component } from 'react'
import { Grid, GridColumn as Column, GridCell } from '@progress/kendo-react-grid';
import { IApproverDetailsState, IApproverRow, DropdownOption } from './IApproverDetailsState';
import { DropdownMultiSelectCell } from './ApproverMultiselect';


export function CheckCellTemplate({ CheckOrder }) {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;

            return (
                <td contextMenu="Check Item">
                    {
                        dataItem.isEdit ?
                            <input type="checkbox" checked={dataItem.isChecked}
                                onChange={(event) => CheckOrder(dataItem)} />
                            :
                            <input type="checkbox" checked={dataItem.isChecked}
                                disabled />
                    }

                </td>
            );
        }
    };
}


export default class ApproverDetails extends Component<{}, IApproverDetailsState> {
    CustomLevelCheckBox: any;
    editField = "inEdit";
    approverList: Array<DropdownOption>;
    constructor(props) {
        super(props);
        this.state = {
            approvalFlowProcess: 1,
            approvers: [],
            overridePriorLevel: false,
            resetConfirm: false
        };

        this.CustomLevelCheckBox = CheckCellTemplate({
            CheckOrder: this.handleLevelCheck.bind(this)
        });

        this.approverList = [
            { label: 'John Elwis', value: "John Elwis" },
            { label: 'Paul Wesley', value: "Paul Wesley" },
            { label: 'Marcel Tim', value: "Marcel Tim" }
        ];
    }

    handleLevelCheck(dataItem: IApproverRow) {
        console.log(dataItem);
        var checkAllStatus = this.state.IsAllChecked;
        var slicedApprovers = this.state.approvers.slice();
        var targetOrderIndex = slicedApprovers.findIndex(o => o.levelId==dataItem.levelId);
        if (targetOrderIndex !=-1) {
            slicedApprovers[targetOrderIndex].isChecked = !slicedApprovers[targetOrderIndex].isChecked;
            var checkItems = slicedApprovers.filter(c => c.isChecked==true);
            var uncheckedItems = slicedApprovers.filter(c => c.isChecked==false);
            if (checkItems.length==slicedApprovers.length || uncheckedItems.length==slicedApprovers.length) {
                checkAllStatus = slicedApprovers[targetOrderIndex].isChecked;
            }
            else {
                checkAllStatus = false;
            }
            this.setState({
                approvers: slicedApprovers,
                IsAllChecked: checkAllStatus
            });
        }
    }

    handleAllOrSingleRadio = (e) => {
        console.log(e);
    }

    render() {
        return (
            <div className="container-fluid">
                <Grid
                    className="kendo-grid-custom"
                    editField={this.editField}
                    data={this.state.approvers}>
                    <Column field="isChecked" title="Check" width="100px" cell={this.CustomLevelCheckBox} />
                    <Column field="levelName" title="Level" width="100px" editable={false} />
                    <Column field="approvers" title="Approvers" width="100px" cell={(props) => {
                        return (
                            <DropdownMultiSelectCell cellProps={props} approverList={this.approverList} />
                        )
                    }} />

                </Grid>
            </div>
        )
    }
}
