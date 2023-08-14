import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import auth from "../Auth";
import { Helmet } from "react-helmet";
import { RINGO_NEXTGEN } from "../Shared/AppConstants";

export interface IProps extends RouteProps {
    layout: React.ComponentClass<any>;
    pageTitle?: string;
}

export const ProtectedRoute = ({ component: Component, layout: Layout, pageTitle: pageTitle, ...rest }: IProps) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (auth.isAuthenticated()) {
                    return (
                        <Layout title={pageTitle}>
                            <Helmet>
                                <title>{RINGO_NEXTGEN} - {pageTitle}</title>
                            </Helmet>
                            <Component {...props} />
                        </Layout>
                    );
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location,
                                },
                            }}
                        />
                    );
                }
            }}
        />
    );
};
