import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface GlobalState {
    LoginUserName: string;
    UserClientName: string;
    CurrentPageName: string;
    CurrentPageTitle: string;
}

interface UpdateUserDetails {
    type: "UPDATE_USER";
    payload: any;
}

interface UpdatePageName {
    type: "UPDATE_PAGENAME";
    pageName: string;
}
interface UpdatePageTitle {
    type: "UPDATE_PAGETITLE";
    pageTitle: string;
}

type KnownAction = UpdateUserDetails | UpdatePageName | UpdatePageTitle;

export const actionCreators = {
    updateUserDetails: (updateData: GlobalState): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "UPDATE_USER", payload: updateData });
    },
    updatePageName: (pageName: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "UPDATE_PAGENAME", pageName: pageName });
    },
    updatePageTitle: (pageTitle: string): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: "UPDATE_PAGETITLE", pageTitle: pageTitle });
    },
};

var unloadedState: GlobalState = { LoginUserName: "Mark Hawking", UserClientName: "NAPA", CurrentPageName: "Home" , CurrentPageTitle:""};
const userObj = JSON.parse(localStorage.getItem("user"));
if (userObj) {
    unloadedState = { LoginUserName: userObj.userFullName, UserClientName: userObj.clientName, CurrentPageName: "Home", CurrentPageTitle:"" };
}

export const reducer: Reducer<GlobalState> = (state: GlobalState | undefined, incomingAction: Action): GlobalState => {
    if (state ==undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "UPDATE_USER":
            return {
                ...action.payload,
            };
        case "UPDATE_PAGENAME":
            return {
                ...state,
                CurrentPageName: action.pageName,
            };
            // case "UPDATE_PAGETITLE":
            // return {
            //     ...state,
            //     CurrentPageTitle: action.pageTitle,
            // };
        default:
            return state;
    }
};
