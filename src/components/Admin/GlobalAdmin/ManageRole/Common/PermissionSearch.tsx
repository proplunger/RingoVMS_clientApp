
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import axios from "axios";
import * as React from "react";

export interface PermissionSearchProps {
    placeholder?: string;
    onSearch?: Function;
    category?: string;
    basicSearchValue?: string;
    selectedOption?: string;
    entityType: string;
    sendData?: Function;
    inputedValue?: any;
    optionChange?: any;
    page?: string;
}

export interface PermissionSearchState {
    options: any;
    optionValue?: any;
    filteredArray?: any;
    searchString?: string;
}
   

class PermissionSearch extends React.Component<PermissionSearchProps, PermissionSearchState> {
    constructor(props: PermissionSearchProps) {
        super(props);
        this.state = {
            options: [],
            optionValue: {id: '', name: 'All'},
            searchString: ''
        }
           
    }

    componentDidMount(){
        this.getPermissionCategory();
        this.searchFilterOperation();
    }

    // getOptionValues = () => {
    //     const option = this.props.entityType =="CreateRole"
    //         ? this.getPermissionCategory()
    //         : [];
    // }

    handleInputChange = (e) => {
        this.setState({ searchString: e ? e.target.value : this.state.searchString }, () => this.searchFilterOperation());
        setTimeout(() => {
            return this.state.searchString=="" ? this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString) : null, 300;
        });
    }

    OnOptionChange = (e) => {
        this.setState({ optionValue: e.target.value }, () => this.searchFilterOperation());
        setTimeout(() => {
            return this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString), 300;
        });
    }

    getPermissionCategory = () => {
        axios.get(`api/tags/permission/category`).then((res) => {
            var data = [{
                id: '',
                name: 'All'
            }];
            res.data.filter(x => x.hasPermissions==true).map(x => {
                data.push({
                    id: x.permissionCategoryId,
                    name: x.name
                })
            })
            this.setState({
                options: data
            });
        });
    }

    searchFilterOperation = () => {
        const option = this.state.options.filter((i) => i.name != "All");
        var filterArray: Array<CompositeFilterDescriptor>;
        let SelectedOption = this.state.optionValue;
        let ignoreCase = true;
        let SearchText
        // if (SelectedOption.name =="All") {
        //     let filtered = option.map((item) => {
        //         SearchText = this.state.searchString.toLowerCase();
        //         let field, operator;

        //         field = "name";
        //         ignoreCase = null;
        //         operator = "contains";

        //         return {
        //             field: field,
        //             operator: operator,
        //             value: SearchText,
        //             ignoreCase: ignoreCase,
        //         };
        //     });

        //     filterArray = [
        //         {
        //             logic: "or",
        //             filters: filtered,
        //         },
        //     ];
        // }else {
        SearchText = this.state.searchString.toLowerCase();
        var filedName = "name";
        filterArray = [
            {
                logic: "or",
                filters: [
                    {
                        field: filedName,
                        operator: "contains",
                        value: SearchText,
                        ignoreCase: ignoreCase,
                    },
                ],
            },
        ];

        // }
        this.setState({filteredArray : filterArray})
        return filterArray;
    }

    render() {
        return (
            <div className="input-group col pl-0 pr-sm-0 forSearchPopup">
                <div className="input-group-prepend" id="forSearchPoupWidth_scroll">
                    <DropDownList
                        style={{ height: "33.5px", width: "auto" }}
                        className="btn btn-sm buttonAll for-remove-shadow p-0 forSearchPoupWidth"
                        textField="name"
                        dataItemKey="id"
                        data={this.state.options}
                        onChange={(e) => this.OnOptionChange(e)}
                        value={this.state.optionValue}
                        popupSettings={{ width: "auto" }}
                    />
                </div>
                <input
                    type="search"
                    className="AdvacneBorderSearch AdvacneBorderSearch_new  AdvacneBorderSearch_borderright form-control placeholder-mobile searchText"
                    placeholder={this.props.placeholder}
                    title={this.props.placeholder}
                    onChange={(e) => this.handleInputChange(e)}
                    onKeyPress={(event) => {
                        if (event.key =="Enter") {
                            event.preventDefault();

                            this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString);
                        }
                    }}
                    value={this.state.searchString}
                />
                <div className="input-group-append">
                    <button
                        className="btn-secondary Advancesearch-icon border-left-0 search-button-focus basicsearch-mobile"
                        type="button"
                        onClick={() => this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString)}
                    >
                        <FontAwesomeIcon icon={faSearch} className={"mr-2"} />
                    </button>
                </div>
            </div>
        )
    }
}

export default PermissionSearch;