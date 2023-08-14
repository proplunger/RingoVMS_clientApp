import * as React from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import isEqual from 'lodash/isEqual';

export interface DropwDownContainerProps {
    data: any;
    onChange: any;
    className: any;
    name: string;
    id:string;
    onFocus?:any;
    onNodeToggle?:any;
}

export interface DropwDownContainerState {
    data: any;
}

class DropwDownContainer extends React.Component<DropwDownContainerProps, DropwDownContainerState> {
    constructor(props) {
        super(props)
        this.state = { data: props.data }
    }
    componentWillReceiveProps = (nextProps) => {
        if (!isEqual(nextProps.data, this.state.data)) {
            this.setState({ data: nextProps.data })
        }
    }

    shouldComponentUpdate = (nextProps) => {
        return !isEqual(nextProps.data, this.state.data)
    }

    render() {
        const { data, ...rest } = this.props
        return (
            <DropdownTreeSelect id={this.props.id} onFocus={this.props.onFocus} onNodeToggle={this.props.onNodeToggle} keepChildrenOnSearch={true} texts={{ placeholder: 'Select Vendor' }} showPartiallySelected={true} data={this.state.data} {...rest} keepTreeOnSearch={true} />
        )
    }
}

export default React.memo(DropwDownContainer);
