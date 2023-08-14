import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppPermissions } from '../../../Shared/Constants/AppPermissions';
import auth from "../../../Auth";
import BreadCrumbs from '../../../Shared/BreadCrumbs/BreadCrumbs';
import { MANAGE_ROLE_PERMISSIONS, MANAGE_NOTIFICATIONS, COMMUNICATION_CENTER, MANAGE_CONTENT_LIBRARY } from '../../../Shared/ApiUrls';

export interface GlobalAdminProps {

}

export interface GlobalAdminState {

}

class GlobalAdmin extends React.Component<GlobalAdminProps, GlobalAdminState> {
    constructor(props: GlobalAdminProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0">
                <div className="container-fluid mt-2 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight"><BreadCrumbs ></BreadCrumbs></div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="myOrderComponent">
                        <div className="row mt-3 mt-lg-0 align-items-center mb-3 d-flex justify-content-end">
                            <div className="col-12">
                                <div className="row">
                                    {auth.hasPermissionV2(AppPermissions.CLIENT_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/client/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Clients">Manage Clients</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.VENDOR_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/vendor/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-users admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Vendors">Manage Vendors</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.USER_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/users/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-users-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Users">Manage Users</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.GLOBAL_JOB_CAT_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/globaljobcatalog/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-file admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Global Job Catalog">Global Job Catalog</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/candidate/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-users-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Candidates">Manage Candidates</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.USER_CREATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/users/create">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-plus admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Add User">Add User</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.ADMIN_GLOBAL_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/global/settings">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Global Settings">Global Settings</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CAND_SHARE_APPROVE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/cand/share/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-link admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Candidate Share Requests">Candidate Share Requests</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CAND_SHARE_APPROVE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={MANAGE_ROLE_PERMISSIONS}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-users admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Roles & Permissions">Roles & Permissions</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.GLOBAL_SERV_TYPE_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/globalservicetype/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Service Types">Manage Service Types</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                     {/* {auth.hasPermissionV2(AppPermissions.GLOBAL_SERV_TYPE_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/eventslogs/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-file admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Events Logs">Events Logs</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )} */}
                                    {auth.hasPermissionV2(AppPermissions.NOTIFICATION_TEMPLATE_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={MANAGE_NOTIFICATIONS}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-bell admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Notifications">Manage Notifications</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                     {auth.hasPermissionV2(AppPermissions.AUTHENTICATED) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/globalactionreason/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                        <i className="fas fa-comments admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Action Reason">Manage Action Reason</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.AUTHENTICATED) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={COMMUNICATION_CENTER}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-commenting admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Communication Center">Communication Center</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {/* {auth.hasPermissionV2(AppPermissions.CONTENT_LIBRARY_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={MANAGE_CONTENT_LIBRARY}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-book admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Content Library">Manage Content Library</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default GlobalAdmin;