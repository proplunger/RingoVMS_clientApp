import * as React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import auth from "../../Auth";
import { getIcon } from "./icon";
import { AuthRole } from "../AppConstants";
export interface FormActionsProps {
    currentState: string;
    handleClick?: any;
    wfCode: string;
    jobWfTypeId?: string;
    entityId?: string;
    cancelUrl?: string;
    handleClose?: any;
    isloaded?: Function;
    hideBtn?: any;
    disabBtn?: any;
}

export interface FormActionsState {
    actions: any;
    clientId?: string;
}

class FormActions extends React.Component<FormActionsProps, FormActionsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props: FormActionsProps) {
        super(props);
        this.state = { actions: [], clientId: auth.getClient() };
    }

    componentDidMount() {
        this.getCurrentStateActions(this.props.currentState);
    }

    getCurrentStateActions = (state: string) => {
        let queryParam = `previousState eq '${state}' and wfCode eq '${this.props.wfCode}'`;
        if (this.state.clientId && this.props.wfCode !='WF_CAND_SHARE' && this.props.wfCode !='WF_ASSIGNMENT_EXTENSION') {
            queryParam += ` and clientId eq ${this.state.clientId}`;
        }
        if (this.props.jobWfTypeId) {
            queryParam += ` and jobWfTypeId eq ${this.props.jobWfTypeId}`;
        }
        // add clientid, client lobId, wfType, position
        axios.get(`api/workflow/transitions?$filter=${queryParam}`).then((res) => {
            // if (this.userObj.role==AuthRole.MSP) {
            //     res.data = res.data.filter((v, i, a) => a.findIndex(t => (t.action ==v.action)) ==i)
            // }
            this.setState({ actions: res.data });
        });
    }

    render() {
        const { handleClick, cancelUrl } = this.props;
        return (
            <div className="col-12">
                <div className="col-sm-12 col-12 p-2">
                    <div className="row text-center">
                        <div className="col-12 mt-4 mb-4 heello">
                            <div className="row ml-sm-0 mr-sm-0 justify-content-center">
                                {cancelUrl &&
                                    <Link to={cancelUrl}>
                                        <button type="button" className="btn button button-close mr-2 mr-sm-2 mr-lg-2 shadow col-auto mb-2">
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                            Close
                                        </button>
                                    </Link>
                                }
                                {!cancelUrl &&
                                    <button type="button" className="btn button button-close mr-2 mr-sm-2 mr-lg-2 shadow col-auto mb-2" onClick={this.props.handleClose}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                            Close
                                        </button>
                                }

                                {this.state.actions.map(
                                    (action) =>
                                        auth.hasPermissionV2(action.permCode) &&
                                        (this.props.hideBtn ? this.props.hideBtn.filter((o) => o==action.action.replace(/ +/g, "")).length==0 : true) &&
                                        (
                                            <button
                                                key={action.actionId}
                                                disabled={(this.props.disabBtn ? this.props.disabBtn.filter((o) => o==action.action.replace(/ +/g, "")).length != 0 : false)}
                                                type="button"
                                                id={action.action.replace(/ +/g, "")}
                                                onClick={() => handleClick(action.action, action.nextStateId, action.eventName, action.actionId)}
                                                className={"btn button mr-2 shadow col-auto mb-2 mr-sm-2 mr-lg-2 " + action.classes}
                                            >
                                                {getIcon(action.icon)}
                                                {action.action}
                                            </button>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormActions;
