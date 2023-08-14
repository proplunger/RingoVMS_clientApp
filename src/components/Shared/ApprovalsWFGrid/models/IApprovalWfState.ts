export interface IWfApprovalVm {
    wfApprovalId?: string;
    clientId?: string;
    divisionId?: string;
    locationId?: string;
    positionId?: string;
    entityId?: string;
    isParallel?: boolean;
    isOverridePriorLevel?: boolean;
    wfApprovalLevel?: Array<IWfApprovalLevelVm>;
}

export interface IWfApprovalLevelVm {
    isLevelActive?: any;
    wfApprovalLevelId?: string;
    wfApprovalId?: number;
    role: string;
    order?: number;
    approverIds?: string;
    requireAllApprovers: boolean;
    selected?: boolean;
    inEdit?: boolean;
    wfApprovalPendingWith?: Array<IWfApprovalPendingWithVm>;
    isDefault?: boolean;
}

export interface IWfApprovalPendingWithVm {
    approverId?: string;
    isDefault?: boolean;
}
