import React from "react";
import '../gui/css/main.css';
import '../gui/css/common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../gui/img/logo.png';
import College from '../gui/img/college.png';
import Application from '../gui/img/application.png';
import MyPage from '../gui/img/mypage.png';
import Logout from '../gui/img/logout.png';
import SeachCollege from "./Dashboard/SearchCollege";


class Main extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="wrap-dashboard">
                <div className="left-menu">
                    <div className="wrap-logo btm-space-main"><img className="panel-logo" src={Logo} alt="logo"/></div>
                    <div>
                        {/* put chosen="true" to corresponding menu button */}
                        {/* for each menu button, replace # with appropriate end point  */}
                        <button onClick="location.href='#'" chosen="true">
                            <div className="wrap-icon"><img src={College} alt="college"/></div>
                            <div>Search College</div>
                        </button>
                        <button onClick="location.href='#'">
                            <div className="wrap-icon"><img src={Application} alt="application"/></div>
                            <div>Track Application</div>
                        </button>
                        <button onClick="location.href='#'">
                            <div className="wrap-icon"><img src={MyPage} alt="mypage"/></div>
                            <div>My Page</div>
                        </button>
                        <button onClick="location.href='#'">
                            <div className="wrap-icon"><img src={Logout} alt="logout"/></div>
                            <div>Log out</div>
                        </button>
                    </div>
                </div>
                <SeachCollege />
            </div>
        )
    }
}

export default Main;