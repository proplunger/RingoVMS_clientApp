import * as React from "react";
import { Breadcrumb } from '@progress/kendo-react-layout';
import { Link } from "react-router-dom";

interface DataModel {
    id: string;
    text?: string;
    icon?: React.ReactNode;
    iconClass?: string;
    disabled?: boolean;
    pageUrl?: string;
}

export interface CustomBreadCrumbsProps {
    data?: DataModel[];
}

export interface CustomBreadCrumbsState {
    breadCrumbData?: DataModel[];
}

const initialData = [{
    id: 'Home',
    text: 'Home',
    icon: <i className="fas fa-home" />,
    pageUrl: "/",
    disabled: false
}];

class CustomBreadCrumbs extends React.Component<CustomBreadCrumbsProps, CustomBreadCrumbsState> {
    public clientId = localStorage.UserClientId
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbData: initialData,
        }
    };

    componentDidMount() {
        this.setState({breadCrumbData: [...initialData, ...this.props.data]});
    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.setState({breadCrumbData: [...initialData, ...this.props.data]});
        }
    }

    breadCrumbLink = (props) => {
        var pageObj = props.data.filter(x => x.id==props.id);
        var pageUrl = pageObj[0] !=null ? pageObj[0].pageUrl : null;
        pageUrl = pageUrl !=null && pageUrl !=undefined ? pageUrl : '#'

        if (props.disabled) {
            return <Link to={pageUrl} onClick={e => e.preventDefault()}>
                <span className="float-right text-dark cursorDisabled">{props.text}</span>
            </Link>;
        }
        else {
            return <Link to={pageUrl!=undefined?pageUrl:"#"}>
                <span className="float-right text-dark"> {props.icon} {props.text}</span>
            </Link>;
        }
    }

    render() {
        return (
            <>
                <Breadcrumb
                    breadcrumbLink={this.breadCrumbLink}
                    data={this.state.breadCrumbData}
                />
            </>
        )
    }
}

export default CustomBreadCrumbs;