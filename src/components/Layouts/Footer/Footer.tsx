import * as React from 'react';
import { appVersion } from '../../../HelperMethods';
class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 footer gradient text-white justify-content-center text-center pt-2 pb-2">
                            <div className="font-regular">Copyright {new Date().getFullYear()}, All rights reserved by Ringo Version {appVersion()}</div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;