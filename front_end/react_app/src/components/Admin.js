import React from "react";
import "../gui/css/admin.css";
import LogoImg from "../gui/img/logo.png";
import LogoutImg from "../gui/img/logout.png";
import Authenticator from "../common/Authenticator";
import {Redirect} from "react-router-dom";
import {account_enum} from "../common/Authenticator";
import Reviews from "./Admin_Dashboards/Reviews";
import {SERVER_URL} from "../common/Constants";
import axios, { post } from 'axios';

const DELETE_ALL_STUDENT_ENDPOINT = "/delete_all_students";
const DECIDE_ENDPOINT =  "/decide_admission_decision";
const IMPORT_SCORE_CARD_ENDPOINT = "/import_college_scorecard";
const SCRAP_COLLEGE_DATA_ENDPOINT = "/update_all_college_data";
const UPDATE_RANKING_ENDPOINT = "/update_rankings";

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
            current_tab: Admin.admin_tab_enum.SCRAPE_DATA,
            decisions: [],
            college_score_card_form_data: null
        }
        this.on_logout = this.on_logout.bind(this);
        this.get_reviews = this.get_reviews.bind(this);
        this.on_delete_all_click = this.on_delete_all_click.bind(this);
        this.post_questionable_decisions = this.post_questionable_decisions.bind(this);
        this.on_still_questionable = this.on_still_questionable.bind(this);
        this.on_scrap_college_ranking = this.on_scrap_college_ranking.bind(this);
        this.on_scrap_college_data = this.on_scrap_college_data.bind(this);
        this.on_submit_score_card_file = this.on_submit_score_card_file.bind(this);
        this.on_import_college_score_card = this.on_import_college_score_card.bind(this);
    }

    async on_logout(){
        let username = Authenticator.getUserName();
        await Authenticator.logout();
        this.props.history.push({
                    pathname: '/login',
                    state: { username:username }
                });
    }

    async post_questionable_decisions(body){
        try{

            let response = await fetch(
                SERVER_URL + DECIDE_ENDPOINT,
                {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(`Recieved ${response_json.result} for {${body.student_name}, ${body.college_name}, ${body.status}`);
            return null;
        }catch (err) {
            return err;
        }
    }

    async on_still_questionable(event){

    }

    async on_scrap_college_data(event){
        try{
            alert("this may take a couple minutes so please wait patiently until you see a success popup");
            let response = await fetch(
                SERVER_URL + SCRAP_COLLEGE_DATA_ENDPOINT,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(response_json.result);
            alert("Success!")
        }catch (err) {
            console.log(err.stack);
            alert(err.message);
        }
    }

    async on_scrap_college_ranking(event){
        try{
            let response = await fetch(
                SERVER_URL + UPDATE_RANKING_ENDPOINT,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(response_json.result);
            alert("Success!")
        }catch (err) {
            console.log(err.stack);
            alert(err.message);
        }
    }

    get_reviews(){
        // if(this.state.not_found){
        //     return (<h1 style={SearchCollege.not_found_style}>No profiles found</h1>);
        // }
        // let applications = [];
        // let beginning = (this.state.current_page_num === 1) ? 0 : (this.state.current_page_num - 1) * 10;
        // let end_index = beginning + 10;
        // let displayItems = this.state.applications.slice(beginning, end_index);
        // displayItems.forEach((element, index)=>{
        //     let {application_status, username, residence_state, high_school_name, high_school_city, high_school_state, gpa, college_class } = element;
        //     let {major_1, major_2, sat_math, sat_ebrw, act_english, act_math, act_reading, act_science, act_composite, sat_lit, sat_us, sat_world, sat_math_1, sat_math_2, sat_eco_bio, sat_mol_bio, sat_chem, sat_physics, ap_passed} = element;
        //     applications.push(
        //         <Application
        //             key={index}
        //             btn_info={{
        //                 username: (username == null) ? "-" : username,
        //                 acceptance: (application_status == null) ? "-" : application_status,
        //                 high_school: (high_school_name == null) ? "-" : high_school_name,
        //                 high_school_location: (high_school_state == null || high_school_city == null) ? "-" : `${high_school_city}, ${high_school_state}`
        //             }}
        //             personal={{
        //                 state: (residence_state == null) ? "-" : residence_state,
        //                 math: (sat_math == null) ? "-" : sat_math,
        //                 ap: (ap_passed == null) ? "-" : ap_passed,
        //                 majors1: (major_1 == null) ? "-" : major_1,
        //                 class: (college_class == null) ? "-"  : college_class,
        //                 ebrw: (sat_ebrw == null) ? "-" : sat_ebrw,
        //                 gpa: (gpa == null) ? "-" : gpa,
        //                 majors2: (major_2 == null) ? "-" : major_2
        //             }}
        //             sat2={{
        //                 chemistry: (sat_chem == null) ? "-" : sat_chem,
        //                 eco_bio: (sat_eco_bio == null) ? "-" : sat_eco_bio,
        //                 literature: (sat_lit == null) ? "-" : sat_lit,
        //                 mol_bio: (sat_mol_bio == null) ? "-" : sat_mol_bio,
        //                 math_I: (sat_math_1 == null) ? "-" : sat_math_1,
        //                 math_II: (sat_math_2 == null) ? "-" : sat_math_2,
        //                 physics: (sat_physics == null) ? "-" : sat_physics,
        //                 us_history: (sat_us == null) ? "-" : sat_us,
        //                 world_history: (sat_world == null) ? "-" : sat_world
        //             }}
        //             act={{
        //                 english: (act_english == null) ? "-" : act_english,
        //                 math: (act_math == null) ? "-" : act_math,
        //                 reading: (act_reading == null) ? "-" : act_reading,
        //                 science: (act_science == null) ? "-" : act_science,
        //                 composite: (act_composite == null) ? "-" : act_composite
        //             }}
        //         />
        //     );
        // });
        return (
                <Reviews
                    key={"test"}
                    btn_info={{
                        username: "test",
                        acceptance: "wait",
                        high_school: "test",
                        high_school_location: "test"
                    }}
                    personal={{
                        state: "test",
                        math: "test",
                        ap: "test",
                        majors1: "test",
                        class:"test",
                        ebrw: "test",
                        gpa: "test",
                        majors2: "test"
                    }}
                    sat2={{
                        chemistry: "test",
                        eco_bio: "test",
                        literature: "test",
                        mol_bio: "test",
                        math_I: "test",
                        math_II: "test",
                        physics: "test",
                        us_history: "test",
                        world_history: "test"
                    }}
                    act={{
                        english: "test",
                        math: "test",
                        reading: "test",
                        science: "test",
                        composite: "test"
                    }}
                />);
    }

    on_submit_score_card_file(event){
        let files = event.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e)=>{
            console.warn("file data ", e.target.result);
            let form_data = {file: e.target.result};
            this.state.college_score_card_form_data = form_data;
        }
    }

    async on_delete_all_click(){
        try{
            let response = await fetch(
                SERVER_URL + DELETE_ALL_STUDENT_ENDPOINT,
                {
                    method : "GET",
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(response_json.result);
            alert("Success!");
        }catch (err) {
            console.log(err.stack);
            alert(err);
        }
    }

    async on_import_college_score_card(event){
        try{
            if(this.state.college_score_card_form_data == null) throw new Error("Choose a score card to import")
            let response = await post(SERVER_URL + IMPORT_SCORE_CARD_ENDPOINT, this.state.college_score_card_form_data);
            if(response.status !== 200) throw new Error("Failed, server returned: " + response.result);
        }catch (err) {
            console.log(err.stack);
            alert(err.message);
        }
    }

    render() {
        let from = this.props.location;
        if(Authenticator.getAccountType() === account_enum.STUDENT){
            return (<Redirect to={
                        {
                            pathname: "/main",
                            state: {
                                from: from
                            }
                        }
                    }/>);
        }

        let reviews = this.get_reviews();
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
                                    onClick={()=>{
                                        this.setState({current_tab: Admin.admin_tab_enum.SCRAPE_DATA});
                                    }}
                                >
                                    Scrape Data
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.IMPORT_DATA) ? "active" : ""} import`}
                                    onClick={()=>{
                                        this.setState({current_tab: Admin.admin_tab_enum.IMPORT_DATA});
                                    }}
                                >
                                    Import Data
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.DELETE_ALL) ? "active" : ""} delete`}
                                    onClick={()=>{
                                        this.setState({current_tab: Admin.admin_tab_enum.DELETE_ALL});
                                    }}
                                >
                                    Delete all student profiles
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${(this.state.current_tab === Admin.admin_tab_enum.REVIEW) ? "active" : ""} review`}
                                    onClick={()=>{
                                        this.setState({current_tab: Admin.admin_tab_enum.REVIEW});
                                    }}
                                >
                                    Review questionable acceptance decisions
                                </button>
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
                                    <button onClick={this.on_scrap_college_ranking} className="btn btn-primary">Scrape</button>
                                </div>
                                <span>Scrape WSJ/THE 2020 rankings of all colleges</span>
                            </div>
                            <div>
                                <div>
                                    <h3>Scrape CollegeData.com</h3>
                                    <button onClick={this.on_scrap_college_data} className="btn btn-primary">Scrape</button>
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
                                     <input type="file" onChange={this.on_submit_score_card_file} name="file"/>
                                     <button id={"submit_college_score_card_btn"} onClick={this.on_import_college_score_card} className="btn btn-primary">Import</button>
                                </div>
                                <span>Import information about all colleges from College Scorecard</span>
                            </div>

                            <div>
                                <div>
                                    <h3>Import student profile and application dataset</h3>
                                    <button  className="btn btn-primary">Import</button>
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
                                <button
                                    className="btn btn-danger"
                                    onClick={this.on_delete_all_click}
                                >
                                    Yes, Delete ALL
                                </button>
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

                                {reviews}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Admin;