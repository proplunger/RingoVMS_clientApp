
import { BillRateStatus, isAssignmentInProgress } from "../../Shared/AppConstants";
import {
  Controllers,
  CandidateControllerActions,
} from "../../Shared/AppPermissions";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
export function DefaultActions(props, stateId, stateIntId) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "View",
      // controllerName: Controllers.CANDIDATE,
      // methodName: CandidateControllerActions.READBILLRATE,
      permCode: AppPermissions.CAND_SUB_BILL_RATE_VIEW,
      nextState: "",
      icon: "faEye",
      cssStyle: {
        display:
          dataItem.status !=BillRateStatus.DRAFT
            ? "block"
            : "none",
      },
    },
    {
      action: "Edit",
      // controllerName: Controllers.CANDIDATE,
      // methodName: CandidateControllerActions.PUTBILLRATE,
      permCode: AppPermissions.CAND_SUB_BILL_RATE_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      cssStyle: {
        display:
          dataItem.status==BillRateStatus.DRAFT
            ? "block"
            : "none",
      },
    },
    {
      action: "Remove",
      // controllerName: Controllers.CANDIDATE,
      // methodName: CandidateControllerActions.PUTBILLRATE,
      permCode: AppPermissions.CAND_SUB_BILL_RATE_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
          dataItem.status==BillRateStatus.DRAFT
            ? "block"
            : "none",
      },
    },
    {// THIS SECTION IS FOR HR MANAGER IN MAKE IN OFFER For PENDING OFFER STATE
      action: "Edit",
      // controllerName: Controllers.CANDIDATE,
      // methodName: CandidateControllerActions.POSTCANDSUBINTERVIEW,
      permCode: AppPermissions.CAND_SUB_BILL_RATE_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      cssStyle: {
        display:
              dataItem.status==BillRateStatus.APPROVED && (stateId=="Ready for Offer" || isAssignmentInProgress(stateIntId))
            ? "block"
            : "none",
      },
    },
    {// THIS SECTION IS FOR HR MANAGER IN MAKE IN OFFER For PENDING OFFER STATE
      action: "Remove",
      // controllerName: Controllers.CANDIDATE,
      // methodName: CandidateControllerActions.DELETEBILLRATE,
      permCode: AppPermissions.CAND_SUB_BILL_RATE_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
              dataItem.status==BillRateStatus.APPROVED && (stateId=="Ready for Offer" || isAssignmentInProgress(stateIntId))
            ? "block"
            : "none",
      },
    }
  ];
  return defaultActions;
}
