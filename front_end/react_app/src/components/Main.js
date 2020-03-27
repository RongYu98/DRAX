import React from "react";
import Logo from '../gui/img/logo.png';
import College from '../gui/img/college.png';
import Application from '../gui/img/application.png';
import MyPage from '../gui/img/mypage.png';
import Logout from '../gui/img/logout.png';
import SearchCollege from "./Dashboard_Right/SearchCollege";
import Authenticator from "../common/Authenticator";
import Track from "./Dashboard_Right/Track";
import {BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import style from '../gui/css/center.module.css';
import {NotFound} from "./NotFound";

class Main extends React.Component{
    static tab_enum =  {
            SEARCH: 'search',
            TRACK: 'track',
            MY_PAGE: 'my_page'
        }

    constructor(props) {
        super(props);
        this.logout_clicked = this.logout_clicked.bind(this);
        this.state = {
            current_tab: ""
        }
    }

    async logout_clicked(){
        let username = Authenticator.getUserName();
        await Authenticator.logout();
        this.props.history.push({
                    pathname: '/login',
                    state: { username:username }
                });
    }

    tab_button_clicked(tab){
        this.setState({current_tab: tab})
        this.props.history.push({
                    pathname: `/main/${tab}`
                });
    }

    componentDidMount() {
        let paths = this.props.location.pathname.split('/');
        let last_url = paths[paths.length - 1];
        this.setState({current_tab: last_url});
    }

    render() {
        return(
            <div className="wrap-dashboard">
                <div className="left-menu">
                    <div className="wrap-logo btm-space-main"><img className="panel-logo" src={Logo} alt="logo"/></div>
                    <div>
                        {/* put chosen="true" to corresponding menu button */}
                        {/* for each menu button, replace # with appropriate end point  */}
                        <button chosen={`${(this.state.current_tab === Main.tab_enum.SEARCH)}`}
                                onClick={() => this.tab_button_clicked(Main.tab_enum.SEARCH)}>
                            <div className="wrap-icon"><img src={College} alt="college"/></div>
                            <div>Search College</div>
                        </button>
                        <button chosen={`${(this.state.current_tab === Main.tab_enum.TRACK)}`}
                                onClick={() => this.tab_button_clicked(Main.tab_enum.TRACK)}>
                            <div className="wrap-icon"><img src={Application} alt="application"/></div>
                            <div>Track Application</div>
                        </button>
                        <button chosen={`${(this.state.current_tab === Main.tab_enum.MY_PAGE)}`}
                                onClick={() => this.tab_button_clicked(Main.tab_enum.MY_PAGE)} >
                            <div className="wrap-icon"><img src={MyPage} alt="mypage"/></div>
                            <div>My Page</div>
                        </button>
                        <button onClick={this.logout_clicked} >
                            <div className="wrap-icon"><img src={Logout}  alt="logout"/></div>
                            <div>Log out</div>
                        </button>
                    </div>
                </div>
                <Switch>
                    <Route path='/main/search' component={SearchCollege} />
                    <Route path='/main/track/' render={props => <Track {...props} /> } />
                    <Route path='/main/track/:college_id' render={props => <Track {...props} />} />
                    <Route path='/main/my_page/' render={props => <h1 className={style.center_container}>Yet to be implemented</h1>} />
                    <Route  component={NotFound}/>
                </Switch>

            </div>
        )
    }
}

export default Main;