import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch } from "@progress/kendo-react-inputs";
import _ from "lodash";
import React from "react";

export interface SettingFieldsProps {
    data?: any;
    onHandleChange?: any;
}

export interface SettingFieldsState {
    inputBoxData?: any;
    dropDownData?: any;
    CheckBoxData?: boolean;
}

export default class SettingFields extends React.Component<
    SettingFieldsProps,
    SettingFieldsState
> {
    changed;
    constructor(props) {
        super(props);
        this.state = {
            CheckBoxData: false,

        }
    }


    handleChange = (value, field) => {
        if (field=="CheckBoxData") {
            this.props.onHandleChange({ value: this.props.data.value=="true" ? "false" : "true", settingId: this.props.data.settingId })
        } else {
            this.props.onHandleChange({ value: value, settingId: this.props.data.settingId })
        }
    };

    renderDropDown = () => {
        let data = this.props.data.listOption.split(',')
        console.log("data", data, this.props.data.listOption)
        return (
            <DropDownList
                data={data}
                value={this.props.data.value}
                onChange={(e) => this.props.onHandleChange({ value: e.target.value, settingId: this.props.data.settingId })}
                className="form-control mr-3"
            />
        );
    };
    renderRadio = () => {
        return (
            <div style={{ width: "20px", height:"20px"}}>
                <label className="container-R d-flex mb-0 pb-3">
                    <input
                        type="checkbox"
                        checked={this.props.data.value=="true" ? true : false}
                        onChange={(e) => this.handleChange(e, "CheckBoxData")}
                        className="pl-2"
                    />
                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                </label>
            </div>
        );
    };
    renderTextField = (type) => {
        return (
            <input
                type={type=="decimal" ? "number" : type}
                maxLength={2000}
                className={type=="number"? "form-control text-right": "form-control"}
                value={this.props.data.value==null ? "" : this.props.data.value}
                onChange={(e) => this.handleChange(e.target.value, "inputBoxData")}
                placeholder={type=="decimal" ? '0.00' : null}
            />
        );
    };
    renderToggle = ()=>{
        return(
            <div>
                 <Switch 
                  checked={this.props.data.value=="true" ? true : false}
                  onChange={(e) => this.handleChange(e, "CheckBoxData")}
                  />
            </div>
        )
    }

    renderSwitch(param) {
        switch (param) {
            case 'text':
                return this.renderTextField(param);
            case 'decimal':
                return this.renderTextField(param);
            case 'number':
                return this.renderTextField(param);
            case 'boolean':
                return this.renderRadio();
            case 'list':
                return this.renderDropDown();
            case 'switch':
                return this.renderToggle();
            default:
                return '';
        }
    }

    render() {
        const { data } = this.props;
        return (
            <>
                {this.renderSwitch(data.settingDataType)}
            </>
        );
    }
}
