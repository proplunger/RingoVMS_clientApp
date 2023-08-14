import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppPermissions } from '../../../Shared/Constants/AppPermissions';
import auth from "../../../Auth";
import BreadCrumbs from '../../../Shared/BreadCrumbs/BreadCrumbs';

export interface VendorAdminProps {

}

export interface VendorAdminState {
    vendorId?: string;
}

class VendorAdmin extends React.Component<VendorAdminProps, VendorAdminState> {
    constructor(props: VendorAdminProps) {
        super(props);
        this.state = {
            vendorId: auth.getVendor(),
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

                                <div className="row ">
                                    {auth.hasPermissionV2(AppPermissions.ADMIN_VENDOR_VIEW) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">  
                                            <Link to={this.state.vendorId ? `/admin/vendor/edit/${this.state.vendorId}` : "/admin/vendor/manage"}>
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                        <i className="fas fa-user-edit admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title ="Edit Vendor">Edit Vendor</h3>
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
                                                        <h3 className="card-text admin_card_text mt-3" title ="Manage Candidates">Manage Candidates</h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {auth.hasPermissionV2(AppPermissions.CANDIDATE_CREATE) && (
                                        <div className="col-sm-6 col-md-4 col-lg-3 py-2 mb-3">
                                            <Link to="/candidate/create">
                                                <div className="card h-100 admin_border shadow">
                                                    <div className="card-body">
                                                        <h3 className="card-title mt-2">
                                                            <i className="fas fa-user-plus admin_fontFace"></i>
                                                        </h3>
                                                        <h3 className="card-text admin_card_text mt-3" title ="Add New Candidate">Add New Candidate</h3>
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

export default VendorAdmin;