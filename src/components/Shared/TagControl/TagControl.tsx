import * as React from "react";
import * as ReactDOM from 'react-dom';
import axios from "axios";
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { CompositeFilterDescriptor, toODataString, State } from "@progress/kendo-data-query";
import { filterBy } from "@progress/kendo-data-query";
import "../TagControl/TagControl.css";
import { errorToastr, successToastr } from "../../../HelperMethods";
import { KendoFilter } from "../../ReusableComponents";

export interface TagControlProps {
    fieldName?: string;
    tagData?: any;
    entityId?: string;
    entityTypeId?: string;
    isTaggingDisabled?: boolean;
    defaultText: string;
}

export interface TagControlState {
    originalValue: any;
    dataValue: any;
    savedValue: any;
    dataState?: any;
    value: any;
    isFocused: boolean;
    isSaving?: boolean;
    isAvailable?: boolean;
    selectedValues?: any;
}
let initialDataState = {
    skip: 0,
    take: 50,
    filter: undefined,
};
let dataState = initialDataState;
class TagControl extends React.Component<TagControlProps, TagControlState> {
    constructor(props: TagControlProps) {
        super(props);
        this.state = { originalValue: [], dataValue: [], savedValue: [], value: [], isFocused: false, dataState: initialDataState, isSaving: false, isAvailable: false };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    isCustom = (item) => { return item.id ==undefined; }
    addKey = (item) => { item.id = undefined }

    handleChange = (event) => {
        
        const values = event.target.value;
        const lastItem = values[values.length - 1];

        if (lastItem && this.isCustom(lastItem)) {
            // values.pop();
            let existingValue = this.state.dataValue.filter(i => i.text.trim().toLowerCase()==lastItem.text.trim().toLowerCase())
            let selectedValue = values.filter(i => i.text.trim().toLowerCase()==lastItem.text.trim().toLowerCase())
            
            if (existingValue.length==0 && selectedValue.length==1 && lastItem.text.trim() !='') {
                this.addKey(lastItem);
                // values.push(lastItem);
            }else{
                values.pop();
            }

            // const sameItem = values.find(v => v.text ==lastItem.text);
            // if (sameItem ==undefined) {
            //     this.addKey(lastItem);
            //     values.push(lastItem);
            // }
            // let existingTag = this.state.dataValue.filter(i => i.text.trim().toLowerCase()==lastItem.text.trim().toLowerCase())
            // let selecTag = values.filter(i => i.text.trim().toLowerCase()==lastItem.text.trim().toLowerCase())
            
            // if (existingTag.length==0 && selecTag.length==1) {
            //     this.addKey(lastItem);
            // } else{
            //     values.pop();
            // }
        }

        this.setState({
            value: values
        });
    }

    // getFilteredTags = (searchText) => {
    //     if (searchText=="" || searchText==null) {
    //         var tagState = {
    //             ...this.state.dataState,
    //             skip: 0,
    //             filter: null,
    //         };
    //         this.getTags(tagState);
    //     } else {
    //         var filterObj: CompositeFilterDescriptor = {
    //             logic: "or",
    //             filters: this.searchFilterOperation(searchText),
    //         };

    //         dataState = {
    //             ...this.state.dataState,
    //             skip: 0,
    //             filter: filterObj,
    //         };

    //         this.getTags(dataState);
    //     }
    // };

    // public searchFilterOperation(searchText: string) {
    //     var filterArray: Array<CompositeFilterDescriptor> = [
    //         {
    //             logic: "or",
    //             filters: [
    //                 { field: "text", operator: "contains", value: searchText, ignoreCase: true }
    //             ],
    //         },
    //     ];

    //     return filterArray;
    // }

    handleFocus = () => { this.setState({ isFocused: true }) }
    doNothing = () => { return false }

    handleSave = () => {
        this.saveTags();
        this.setState({ savedValue: this.state.value, isFocused: this.state.isAvailable ? true : false })
    }

    handleCancel = () => { this.setState({ value: this.state.savedValue, isFocused: false }); }

    handleFilterChange(event) {
        var name = "dataValue"
        var originalArray = "originalValue"
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
        // this.getFilteredTags(event.filter.value);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    componentDidMount() {
        // this.setState({originalValue:sports, dataValue:sports})
    }
    componentWillMount() {
        this.getTags(initialDataState);
        if (this.props.entityId) {
            this.getEntityTagMaps();
        }

    }

    render() {
        const { fieldName } = this.props;
        return (
            <div className="forCandidate-TagControl">
                <div style={{ display: this.props.fieldName !=undefined ? 'block' : 'none' }} className="col-6 col-sm-6 text-right">{fieldName}:</div>
                <div className="font-weight-bold pl-0 text-left col-6 col-sm-6 forCandidate-TagControl-popup">
                    <div onClick={this.props.isTaggingDisabled ? this.doNothing : this.handleFocus} className="selected-tag justify-content-end justify-content-xl-start" style={{ display: this.state.isFocused ? 'none' : 'block' }}>
                        {this.state.value.length==0 && <span className="no-tag">{this.props.defaultText}</span>}
                        {this.state.value.length > 0 && this.state.value.map(v =>
                            <span className="dis-tag pt-0 pb-0 mb-1 mr-1 accordianTitleClr text-dark  font-weight-normal">{v.text}</span>
                        )}
                    </div>
                    <MultiSelect
                        //id="tagControl"
                        data={this.state.dataValue}
                        onChange={this.handleChange}
                        value={this.state.value}
                        textField="text"
                        dataItemKey="id"
                        allowCustom={true}
                        className="multi-select-tag-control" {...this.state.isFocused ? "k-state-focused" : ""}
                        style={{ display: !this.state.isFocused ? 'none' : 'block' }}
                        filterable={true}
                        onFilterChange={this.handleFilterChange}
                    />
                    {this.state.isFocused &&
                        <div className="tag-button">
                            <button onClick={this.handleSave}><span className="k-icon k-i-check"></span></button>
                            <button onClick={this.handleCancel}><span className="k-icon k-i-close"></span></button>
                        </div>
                    }
                </div>
            </div>
        );
    }

    getTags = (dataState) => {
        this.setState({
            isSaving: true,
        });
        var queryStr = `${toODataString(dataState)}`;
        const queryParams = `entityTypeId eq ${this.props.entityTypeId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/tags?${finalQueryString}`).then((res) => {
            if (res.data) {
                this.setState({ originalValue: res.data, dataValue: res.data })
            }
        });
    };
    getEntityTagMaps = () => {
        axios.get(`api/tags/maps?entityId=${this.props.entityId}&entityTypeId=${this.props.entityTypeId}`).then((res) => {
            if (res.data) {
                this.setState({ value: res.data, savedValue: res.data })
            }
        });
    }


    saveTags = () => {
        const data = {
            entityId: this.props.entityId,
            entityTypeId: this.props.entityTypeId,
            tags: this.state.value,
        };

        if (this.props.entityId){
            if (data.tags.filter(x => x.id==undefined).length > 0) {
                axios.post(`/api/tags`, JSON.stringify(data)).then((res) => {
                    if (res.data) {
                        this.getTags(dataState)
                        this.getEntityTagMaps()
                    }
                });
            }
            else {
                axios.put(`/api/tags/maps`, JSON.stringify(data)).then((res) => {
                    if (res.data) {
                    }
                });
            }
        }else{
            this.setState({selectedValues: this.state.value})
        }

    }
}

export default TagControl;
