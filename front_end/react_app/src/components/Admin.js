import React from "react";
import "../gui/css/admin.css";
import LogoImg from "../gui/img/logo.png";
import LogoutImg from "../gui/img/logout.png";
import Authenticator from "../common/Authenticator";

class Admin extends React.Component{
    static admin_tab_enum={
        SCRAPE_DATA: "Scrape Data",
        IMPORT_DATA: "Import Data",
        DELETE_ALL: "Delete all student profiles",
        REVIEW: "Review questionable acceptance decisions"
    }

    constructor(props) {
        super(props);
        this.state = {
            current_tab: Admin.admin_tab_enum.SCRAPE_DATA
        }
        this.on_logout = this.on_logout.bind(this);
    }

    async on_logout(){
        let username = Authenticator.getUserName();
        await Authenticator.logout();
        this.props.history.push({
                    pathname: '/login',
                    state: { username:username }
                });
    }

    render() {
        return (
            <div className="wrap-dashboard">
                <div className="left-menu">
                    <div className="wrap-logo"><img className="logo" src={LogoImg} alt="logo"/></div>
                    <div>
                        {/* replace # with appropriate end point  */}
                        <button onClick={this.on_logout} >
                            <div className="wrap-icon"><img src={LogoutImg} alt="logout"/></div>
                            <div>Log out</div>
                        </button>
                    </div>
                </div>
                <div className="right-content">
                    <div className="nav-tabs">
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.SCRAPE_DATA) ? "active" : ""} scrape`}
                                >
                                    Scrape Data
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.IMPORT_DATA) ? "active" : ""} import`}>Import Data</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.DELETE_ALL) ? "active" : ""} delete`}>Delete all student profiles</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.REVIEW) ? "active" : ""} review`}>Review questionable acceptance decisions</button>
                            </li>
                        </ul>
                    </div>
                    <div className="nav-content">
                        <div className="scrape" style={
                            {display: (this.state.current_tab === Admin.admin_tab_enum.SCRAPE_DATA) ?
                                "" : "None"
                            }}
                        >
                            <div>
                                <div>
                                    <h3>Scrape college rankings</h3>
                                    <button className="btn btn-primary">Scrape</button>
                                </div>
                                <span>Scrape WSJ/THE 2020 rankings of all colleges</span>
                            </div>
                            <div>
                                <div>
                                    <h3>Scrape CollegeData.com</h3>
                                    <button className="btn btn-primary">Scrape</button>
                                </div>
                                <span>Scrape information about all colleges from CollegeData.com</span>
                            </div>
                        </div>
                        <div className="import" style={
                            {display: (this.state.current_tab === Admin.admin_tab_enum.IMPORT_DATA) ?
                                "" : "None"
                            }}>
                            <div>
                                <div>
                                    <h3>Import College Scorecard data file</h3>
                                    <button className="btn btn-primary">Import</button>
                                </div>
                                <span>Import information about all colleges from College Scorecard</span>
                            </div>
                            <div>
                                <div>
                                    <h3>Import student profile and application dataset</h3>
                                    <button className="btn btn-primary">Import</button>
                                </div>
                                <span>Import previously collected student profile and application dataset </span>
                            </div>
                        </div>
                        <div className="delete" style={
                            {display: (this.state.current_tab === Admin.admin_tab_enum.DELETE_ALL) ?
                                "" : "None"
                            }}>
                            <div>
                                <h3>Are you sure you want to delete all student profiles?</h3>
                                <button className="btn btn-danger">Yes, Delete ALL</button>
                            </div>
                        </div>
                        <div className="review" style={
                            {display: (this.state.current_tab === Admin.admin_tab_enum.REVIEW) ?
                                "" : "None"
                            }}>
                            <div>
                                <button className="btn btn-danger">Still Questionable</button>
                                <button className="btn btn-primary">Acceptable</button>
                            </div>
                            <div className="list-group" id="questionable-list">
                                <div className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        {/* student's username should be mentioned as a value of "value" attribute so that frontend can easily recognize which students were chosen.  */}
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username1"/>
                                    </div>
                                    {/* student's username should be included inside h5 tag */}
                                    <h5 className="username">username1<br/>
                                        {/* accpeted: badge-success | denied: badge-danger | rest: badge-warning */}
                                        {/* college name should be included in the second span tag */}
                                        <span className="badge badge-success">Accepted</span> by <span>Stony Brook University</span>
                                    </h5>
                                    {/* high school name should be one the left side of br tag
                                    high school city  should be combined with high school state by comma and this combination should be on the right side of br tag and inside h5 tag */}
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </div>
                                {/* "div" tag's "id" property value should be the student's username*/}
                                <div id="username1" className="carousel slide">
                                    <ol className="carousel-indicators">
                                        {/* every "li" tags' "data-target" property values should be the student's username*/}
                                        <li data-target="#username1" data-slide-to={0} className="active"/>
                                        <li data-target="#username1" data-slide-to={1}/>
                                        <li data-target="#username1" data-slide-to={2}/>
                                    </ol>
                                    <div className="carousel-inner">
                                        <div className="carousel-item personal active">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    {/* add data in b tags */}
                                                    {/* if there is no data, add dash in b tags */}
                                                    <td><b>NY</b><br/><label>Residence state</label></td>
                                                    <td><b>800</b><br/><label>SAT Math</label></td>
                                                    <td><b>5</b><br/><label>APs Passed</label></td>
                                                    <td><b>Theology Religious Vocation</b><br/><label>Major 1</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    {/* add data in b tags */}
                                                    {/* if there is no data, add dash in b tags */}
                                                    <td><b>2023</b><br/><label>College class</label></td>
                                                    <td><b>800</b><br/><label>SAT EBRW</label></td>
                                                    <td><b>3.8</b><br/><label>GPA</label></td>
                                                    <td><b>Public Administration Social Service</b><br/><label>Major
                                                        2</label></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="carousel-item sat2">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    {/* add data in b tags */}
                                                    {/* if there is no data, add dash in b tags */}
                                                    <td><b>800</b><br/><label>SAT2 Chemistry</label></td>
                                                    <td><b>800</b><br/><label>SAT2 Eco-Bio</label></td>
                                                    <td><b>800</b><br/><label>SAT2 Literature</label></td>
                                                    <td><b>800</b><br/><label>SAT2 Mol-Bio</label></td>
                                                </tr>
                                                <tr>
                                                    {/* add data in b tags */}
                                                    {/* if there is no data, add dash in b tags */}
                                                    <td><b>-</b><br/><label>SAT2 Math I</label></td>
                                                    <td><b>800</b><br/><label>SAT2 Math II</label></td>
                                                    <td><b>800</b><br/><label>SAT2 Physics</label></td>
                                                    <td><b>800</b><br/><label>SAT2 US History</label></td>
                                                    <td><b>800</b><br/><label>SAT2 World History</label></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="carousel-item act">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    {/* add data in b tags */}
                                                    {/* if there is no data, add dash in b tags */}
                                                    <td><b>-</b><br/><label>ACT English</label></td>
                                                    <td><b>60</b><br/><label>ACT Math</label></td>
                                                    <td><b>40</b><br/><label>ACT Reading</label></td>
                                                    <td><b>40</b><br/><label>ACT Science</label></td>
                                                    <td><b>36</b><br/><label>ACT Composite</label></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* "a" tag's "href" property value should be "#" + student's username*/}
                                    <a className="carousel-control-prev" href="#username1" role="button"
                                       data-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"/>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                    {/* "a" tag's "href" property value should be "#" + student's username*/}
                                    <a className="carousel-control-next" href="#username1" role="button"
                                       data-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"/>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </div>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username2"/>
                                    </div>
                                    <h5 className="username">username2<br/>
                                        <span className="badge badge-danger">Denied</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username3"/>
                                    </div>
                                    <h5 className="username">username3<br/>
                                        <span className="badge badge-warning">Wait-listed</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username2"/>
                                    </div>
                                    <h5 className="username">username2<br/>
                                        <span className="badge badge-danger">Denied</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username3"/>
                                    </div>
                                    <h5 className="username">username3<br/>
                                        <span className="badge badge-warning">Wait-listed</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username2"/>
                                    </div>
                                    <h5 className="username">username2<br/>
                                        <span className="badge badge-danger">Denied</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <div className="wrap-questionable-checkbox">
                                        <input type="checkbox" className="questionable-checkbox"
                                               defaultValue="username3"/>
                                    </div>
                                    <h5 className="username">username3<br/>
                                        <span className="badge badge-warning">Wait-listed</span> by <span>Stony Brook University</span>
                                    </h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Admin;