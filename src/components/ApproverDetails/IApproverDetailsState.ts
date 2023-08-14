export interface IApproverDetailsState{
    approvers?: Array<IApproverRow>;
    approvalFlowProcess?: number;
    overridePriorLevel?: boolean;
    resetConfirm?: boolean;
    IsAllChecked?: boolean;
    approverList?: Array<DropdownOption>;
}

export interface IApproverRow{
    isChecked?:boolean;
    levelId?: number;
    levelName?:string;
    approvers?: Array<DropdownOption>;
    allOrSingle?: string;
}

export interface DropdownOption{
    label?:string;
    value?: string;
}