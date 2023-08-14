import * as React from "react";
import NavMenu from "./Header/NavMenu";
import BreadCrumbs from "../Shared/BreadCrumbs/BreadCrumbs";

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu />
        <BreadCrumbs/>
        {props.children}
    </React.Fragment>
);
