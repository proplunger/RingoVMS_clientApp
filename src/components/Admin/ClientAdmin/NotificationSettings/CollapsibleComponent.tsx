import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Collapsible from "react-collapsible";
import { candTriggerName } from "../../../ReusableComponents";
import { emailPattern } from "../../../Shared/AppConstants";

export interface CollapsibleComponentProps {
    data?: any;
    handleChange?: any;
    toggleAll?: boolean;
    toggleItem?: boolean;
    index?: any;
}

export interface CollapsibleComponentState {
    toggelFirst?: boolean;
    toggleAll?: boolean;
    setting?: any;
}

export default class CollapsibleComponent extends React.Component<
    CollapsibleComponentProps,
    CollapsibleComponentState
> {
    changedData;
    constructor(props) {
        super(props);
        this.state = {
            toggelFirst: true,
            toggleAll: false,
        };
        // this.changedData = [];
    }

    componentDidMount() {
        this.props &&
            this.setState({
                toggelFirst: this.props.toggleItem,
                toggleAll: this.props.toggleAll,
                setting: this.props.data.settings,
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.toggleAll != this.props.toggleAll) {
            this.setState({
                toggleAll: nextProps.toggleAll,
                toggelFirst: nextProps.toggleItem,
            });
        }
    }

    handleChange = (e, dataValue, field) => {
        let changedFieldValue = dataValue[field]==true ? false : true;
        const data = this.state.setting.map((item) =>
            item.id ==dataValue.id
                ? { ...item, [field]: changedFieldValue }
                : item
        );
        this.setState(
            {
                setting: data,
            },
            () => this.props.handleChange(dataValue, field)
        );
    }

    render() {
        const { toggelFirst, setting } = this.state;
        const { data, toggleAll, index } = this.props;
        return (
            <Collapsible
                // trigger={candTriggerName(data.name, false, false, false, true, this.onReset)}
                trigger={data.name}
                open={toggleAll ? toggleAll : index==0 ? true: false}
                accordionPosition="1"
                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                onTriggerClosing={() => this.setState({ toggelFirst: false })}
            // triggerSibling={<div ><FontAwesomeIcon icon={faUndo} color={"#109dd2"} onClick={() => this.onReset()} className="float-right mr-4" title={"Undo Changes"} /></div>}
            >
                {/* <FontAwesomeIcon icon={faUndo} color={"#109dd2"} onClick={() => this.onReset()} className="float-right mr-2" title={"Undo Changes"} /> */}
                <div className="row mx-0">

                    <div className="col-12 px-0">
                        <div className="row mx-0">
                            <table className="table table-striped">
                                <tbody>
                                    {setting &&
                                        setting.map((i, index) => (

                                            <tr>
                                                <td className="notification-grid">
                                                    <label className="mb-1 font-weight-bold ">{i.notificationType} </label>
                                                </td>
                                                <td className="notification-grid-2">
                                                    <label className="container-R d-flex mb-0">
                                                        <span className="mb-0 font-weight-bold notificationEmail-SMS">Email</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={i.email}
                                                            name={index + " Email "}
                                                            //onChange={(e) => this.handleCheckboxChange(e, index)}
                                                            onChange={(e) => this.handleChange(e, i, "email")}
                                                            value="false"
                                                        />
                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                    </label>
                                                </td>
                                                {/* <td className="notification-grid-2 container-R-notification" aria-disabled={i.sms==null ? true : false}>
                                                    <label className="container-R  d-flex mb-0" >
                                                        <span className="mb-0 font-weight-bold notificationEmail-SMS">SMS</span>
                                                        <input
                                                            type="checkbox"
                                                            disabled={i.sms==null ? true : false}
                                                            checked={i.sms}
                                                            name={index + " SMS "}
                                                            //onChange={(e) => this.handleCheckboxChange(e, index)}
                                                            onChange={(e) => this.handleChange(e, i, "sms")}
                                                            value="false"
                                                        />

                                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                    </label>
                                                </td> */}
                                            </tr>

                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Collapsible>
        );
    }
}
