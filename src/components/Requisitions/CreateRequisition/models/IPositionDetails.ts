import { IDropDownModel } from "../../../Shared/Models/IDropDownModel";

export interface IPositionDetails {
    reqId?: string;
    reqPositionId?: string;
    noOfReqStaff?: number;
    noOfHoldStaff?: number;
    startDate?: Date;
    endDate?: Date;
    shiftStartTime?: Date;
    shiftEndTime?: Date;
    positionDesc?: string;
    assignType?: IDropDownModel;
    jobWf?: IDropDownModel;
    jobCategory?: IDropDownModel;
    jobPosition?: IDropDownModel;
    positionSkillMapping?: Array<IDropDownModel>;
    hiringManager?: IDropDownModel;
    billRate?: number;
    budget?: number;
}
