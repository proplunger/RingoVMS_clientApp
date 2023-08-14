import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Collapsible from "react-collapsible";
import { candTriggerName } from "../../../ReusableComponents";
import { data } from "./data";
import SettingFields from "./SettingFields";

export interface CollapsibleComponentProps {
    data?: any;
    handleChange?: any;
    toggleAll?: boolean;
    toggleItem?: boolean;
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
        this.changedData = {};
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
    handleChange = (dataonchange) => {
        Object.assign(this.changedData, {
            [dataonchange.settingId]: dataonchange.value,
        });
        const data = this.state.setting.map((item) =>
            item.settingId ==dataonchange.settingId
                ? { ...item, value: dataonchange.value }
                : item
        );
        this.setState(
            {
                setting: data,
            },
            () =>
                this.props.handleChange({ [this.props.data.name]: this.changedData })
        );
    };

    onReset = () => {
        this.changedData = {};
        this.setState({ setting: this.props.data.settings, toggelFirst: true }, () =>
            this.props.handleChange(
                { [this.props.data.name]: this.changedData },
                { reset: true, name: this.props.data.name }
            )
        );
    };
    render() {
        const { toggelFirst, setting } = this.state;
        const { data, toggleAll } = this.props;
        console.log("data1",this.state.setting)
        return (
            <Collapsible
                // trigger={candTriggerName(data.name, false, false, false, true, this.onReset)}
                trigger={data.name}
                open={toggleAll ? toggleAll : toggelFirst}
                accordionPosition="1"
                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                onTriggerClosing={() => this.setState({ toggelFirst: false })}
            // triggerSibling={<div ><FontAwesomeIcon icon={faUndo} color={"#109dd2"} onClick={() => this.onReset()} className="float-right mr-4" title={"Undo Changes"} /></div>}
            >
                <div className="row mx-0 justify-content-end" style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faUndo} color={"#109dd2"} onClick={() => this.onReset()} className="float-right mr-2" title={"Undo Changes"} />
                </div>
                <div className="row mt-3">

                    <div className="col-12 px-0">
                        <div className="row mx-0">

                            {setting &&
                                setting.map((i) => 
                                (
                                  
                                    // <div className="col-sm-4 pb-2">
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 pb-2 mt-1">
                                        <label className="mb-1 font-weight-bold ">{i.name} </label>

                                        <SettingFields
                                            data={i}
                                            onHandleChange={this.handleChange}
                                        />
                                    </div>
                                    // </div>
                                ))}
                        </div>
                    </div>
                </div>
            </Collapsible>
        );
    }
}
