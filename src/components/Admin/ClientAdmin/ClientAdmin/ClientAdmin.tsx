import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppPermissions } from '../../../Shared/Constants/AppPermissions';
import auth from "../../../Auth";
import { EntityType } from '../../../Shared/AppConstants';
import BreadCrumbs from '../../../Shared/BreadCrumbs/BreadCrumbs';

export interface ClientAdminProps {

}

export interface ClientAdminState {
    clientId?: string;
    clientName?: string;
}

class ClientAdmin extends React.Component<ClientAdminProps, ClientAdminState> {
    constructor(props: ClientAdminProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            clientName: auth.getClientName(),
        };
    }
    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0">
                <div className="container-fluid mt-2 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight"><BreadCrumbs></BreadCrumbs></div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="myOrderComponent">
                        <div className="row mt-3 mt-lg-0 align-items-center mb-3 d-flex justify-content-end">
                            <div className="col-12">
                                <div className="row">
                                    {auth.hasPermissionV2(AppPermissions.CLIENT_RATE_CARD_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/clientratecard/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-dollar-sign admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Rate Cards">Manage Rate Cards</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CLIENT_JOB_POSITION_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/clientjobcatalog/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-md admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Client Job Catalog">Client Job Catalog</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/vendortiers/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-dollar-sign admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Vendor Tiers">Manage Vendor Tiers</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/client/settings">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Client Settings">Client Settings</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/client/edit/${this.state.clientId}`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-edit admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Edit Client">Edit Client</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CLIENT_REGION_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/client/${this.state.clientId}/regions`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-map-marker-alt admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Regions">Manage Regions</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CLIENT_DIV_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/client/${this.state.clientId}/divisions`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-map-marker-alt admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Divisions">Manage Divisions</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CLIENT_LOC_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/client/${this.state.clientId}/locations?name=${this.state.clientName}`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-map-marker-alt admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Manage Locations">Manage Locations</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_REQ_RELEASE_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/releaseconfig/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-users-cog admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3 admin-text-oveflow-notuse" title="Release Configuration">Release Configuration</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_ONBOARD_TASK_UPDATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/onboarding/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-file admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3 admin-text-oveflow-notuse" title="Onboarding Configuration">Onboarding Configuration</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/${EntityType.REQUISITION}/approver/manage`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-plus admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3 admin-text-oveflow-notuse" title="Requisition Approver Configuration">Req. Approver Configuration</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to={`/admin/${EntityType.TIMESHEET}/approver/manage`}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-plus admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3 admin-text-oveflow-notuse" title="Timesheet Approver Configuration">Timesheet Approver Configuration</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/interviewcriteria/manage">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-link admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Interview Configuration">Interview Configuration</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/admin/globaldata/map">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-link admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title="Map Global Data">Map Global Data</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClientAdmin;