import React from "react";
import '../../gui/css/track_application.css';
import Application from "./Application";
let badge_enum = Application.badge_enum;

const SUMMARY_ENDPOINT = "";
const HIGHSCHOOL_ENDPOINT = "";

class Track extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show_filtered: false,
            summary: {
                avg_gpa: "",
                avg_sat_ebrw: "",
                avg_sat_math: "",
                avg_act_composite: ""
            },
            filter_data: {
                college_class: {from: "" , to: ""},
                checked_high_schools: [],
                application_status: [],
                name: ""
            },
            high_schools: [],
            applications: [],
            current_page_num: 1
        }
        this.button_list = [];
        this.fetch_summary = this.fetch_summary.bind(this);
        this.searchClicked = this.searchClicked.bind(this);
        this.fetch_highschool = this.fetch_highschool.bind(this);
        this.get_high_school = this.get_high_school.bind(this);
        this.high_school_checked = this.high_school_checked.bind(this);
        this.application_checked = this.application_checked.bind(this);
        this.fetch_applications = this.fetch_applications.bind(this);
        this.get_applications = this.get_applications.bind(this);
    }

    // dummy fetch
    async fetch_summary(){
        this.setState({summary:{
                avg_gpa: "3.8",
                avg_sat_ebrw: '700',
                avg_sat_math: '740',
                avg_act_composite: '34'
            }});
    }

    // dummy fetch
    async fetch_highschool() {
        let result = [];
        for(let i = 1; i <= 5; i++){
            result.push(`High School ${i}`);
        }
        this.setState({high_schools: result});
    }

    // dummy fetch
    async fetch_applications(){
        let application_list = [1,2,3];
        this.setState({applications: application_list});
    }

    // dummy get
    get_applications(){
        let applications = [];
        applications.push(
            <Application
                btn_info={{
                    style: badge_enum.SUCCESS,
                    username: "test1",
                    acceptance: "Accepted",
                    high_school: "test1",
                    high_school_location: "test1"
                }}
                personal={{
                    state: "test1",
                    math: "test1",
                    ap: "test1",
                    majors1: "test1",
                    class: "test1",
                    ebrw: "test1",
                    gpa: "test1",
                    majors2: "test1"
                }}
                sat2={{
                    chemistry: "test1",
                    eco_bio: "test1",
                    literature: "test1",
                    mol_bio: "test1",
                    math_I: "test1",
                    math_II: "test1",
                    physics: "test1",
                    us_history: "test1",
                    world_history: "test1"
                }}
                act={{
                    english: "test1",
                    math: "test1",
                    reading: "test1",
                    science: "test1",
                    composite: "test1"
                }}
            />
        );

        applications.push(
            <Application
                btn_info={{
                    style: badge_enum.WARNING,
                    username: "test1",
                    acceptance: "wait-listed",
                    high_school: "test1",
                    high_school_location: "test1"
                }}
                personal={{
                    state: "test1",
                    math: "test1",
                    ap: "test1",
                    majors1: "test1",
                    class: "test1",
                    ebrw: "test1",
                    gpa: "test1",
                    majors2: "test1"
                }}
                sat2={{
                    chemistry: "test1",
                    eco_bio: "test1",
                    literature: "test1",
                    mol_bio: "test1",
                    math_I: "test1",
                    math_II: "test1",
                    physics: "test1",
                    us_history: "test1",
                    world_history: "test1"
                }}
                act={{
                    english: "test1",
                    math: "test1",
                    reading: "test1",
                    science: "test1",
                    composite: "test1"
                }}
            />
        );

        applications.push(
            <Application
                btn_info={{
                    style: badge_enum.DANGER,
                    username: "test1",
                    acceptance: "denied",
                    high_school: "test1",
                    high_school_location: "test1"
                }}
                personal={{
                    state: "test1",
                    math: "test1",
                    ap: "test1",
                    majors1: "test1",
                    class: "test1",
                    ebrw: "test1",
                    gpa: "test1",
                    majors2: "test1"
                }}
                sat2={{
                    chemistry: "test1",
                    eco_bio: "test1",
                    literature: "test1",
                    mol_bio: "test1",
                    math_I: "test1",
                    math_II: "test1",
                    physics: "test1",
                    us_history: "test1",
                    world_history: "test1"
                }}
                act={{
                    english: "test1",
                    math: "test1",
                    reading: "test1",
                    science: "test1",
                    composite: "test1"
                }}
            />
        );
        return applications;
    }

    high_school_checked(event){
        let current_high_schools = this.state.filter_data.checked_high_schools;
        let school = event.target.id;
        if(current_high_schools.includes(school)){
            let index = current_high_schools.indexOf(school);
            current_high_schools.splice(index, 1);
        }else{
            current_high_schools.push(school);
        }
        this.setState({filter_data:{...this.state.filter_data, checked_high_schools: current_high_schools}})
    }

    get_high_school(){
            let result = []
            for(let i = 0; i < this.state.high_schools.length; i+=3){
                result.push(this.state.high_schools.slice(i, i+3));
            }

            result = result.map((tr_array, index) => {
                return(
                    <tr key={`tr-key-${index}`}>
                        {
                            tr_array.map((element)=>{
                                return(
                                    <td key={element}>
                                        <div className="custom-control custom-checkbox">
                                            {/* IMPORTANT! "input" tag's "id" property value and "label" tag's "for" property value should be matched */}
                                            <input type="checkbox"
                                                   className="custom-control-input"
                                                   id={element}
                                                   checked={this.state.filter_data.checked_high_schools.includes(element)}
                                                   onChange={this.high_school_checked}
                                            />
                                                   <label className="custom-control-label"
                                                          htmlFor={element}>{element}
                                                   </label>
                                        </div>
                                    </td>
                                    )
                                }
                            )
                        }
                    </tr>
                );
            });
        return result;
    }

    is_whole_number(n) {
        let result = (n - Math.floor(n)) !== 0;

        if (result)
            return false;
        else
            return true;
    }

    // this will depend on the colleges
    get_page_buttons(){
        let page_list = [];
        let new_button_list = [];
        let max_pages = this.state.applications.length / 10;
        if(!this.is_whole_number(max_pages)) {
            max_pages = Math.floor(max_pages) + 1;
        }
        let next_ten_pages = this.state.current_page_num + 9;
        let old_beginning = this.button_list[0];
        let old_end = this.button_list[this.button_list.length - 1];
        if(this.state.applications.length <= 10) {
            max_pages = 1;
        }

        if(this.state.current_page_num === 1){
            for(let i = 1 ; i <= max_pages && i <= next_ten_pages; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }else if(this.state.current_page_num === old_end && !(this.button_list.length < 10) && (this.state.current_page_num !== max_pages)){
            for(let i = old_end; i <= max_pages && i <= next_ten_pages; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }else if(this.state.current_page_num === old_beginning){
            let previous_ten = this.state.current_page_num - 9;
            if(previous_ten < 1) previous_ten = 1;
            for(let i = previous_ten ; i <= max_pages && i <= old_beginning; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }else if((this.button_list.includes(this.state.current_page_num)) || (this.button_list.length < 10)){
            for(let i = old_beginning ; i <= old_end; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }
        if(this.state.applications.length === 0){
            this.button_list = [];
            return [];
        }
        this.button_list = new_button_list;
        return page_list;
    }

    application_checked(event){
        let current_application = this.state.filter_data.application_status;
        let status = event.target.id;
        if(current_application.includes(status)){
            let index = current_application.indexOf(status);
            current_application.splice(index, 1);
        }else{
            current_application.push(status);
        }
        this.setState({filter_data:{...this.state.filter_data, application_status: current_application}})
    }


    componentDidMount() {
        this.fetch_summary();
        this.fetch_highschool();
    }

    searchClicked(event){
        console.log(this.state.filter_data);
    }

    render() {
        let high_schools = this.get_high_school();
        let page_buttons = this.get_page_buttons();
        let applications = this.get_applications();
        return (
            <div className="right-content">
                    <div className="wrap-search-result">
                        <div className="wrap-search-filters">
                            <div className="search-box">
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control shadow-none" placeholder="College name"
                                           aria-label="College name" aria-describedby="search-btn"
                                           value={this.state.filter_data.name}
                                           onChange={(event)=>{
                                                this.setState({filter_data:{...this.state.filter_data, name: event.target.value}});
                                           }}
                                    />
                                    <div className="input-group-append">
                                        <button onClick={this.searchClicked}
                                            className="btn btn-outline-secondary shadow-none" type="button"
                                            id="search-btn">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="filters-box">
                                <div className="filters-dropdown">
                                    <button onClick={()=>{
                                        this.setState({show_filter: !this.state.show_filter});
                                    }}
                                        className="btn btn-secondary shadow-none" type="button"
                                        id="filters-dropdown-btn"
                                    >
                                        Filters
                                    </button>
                                    <div style={{display: (this.state.show_filter) ? "flex" : "None"}} id="filters-dropdown-content" >
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td id="wrap-college-class"><b>College class</b>
                                                    <div className="wrap-filter">
                                                        <input type="number" className="form-control shadow-none"
                                                               id="college-class-min" placeholder="< 2027" max={2027}
                                                               value={this.state.filter_data.college_class.from}
                                                               onChange={(event)=> {
                                                                   this.setState({filter_data: {...this.state.filter_data,
                                                                           college_class: {...this.state.filter_data.college_class,
                                                                               from:event.target.value}}});
                                                               }}
                                                        />
                                                        - <input type="number" className="form-control shadow-none"
                                                                 id="college-class-max" placeholder="< 2027"
                                                                 max={2027}
                                                                 value={this.state.filter_data.college_class.to}
                                                                 onChange={(event)=> {
                                                                   this.setState({filter_data: {...this.state.filter_data,
                                                                           college_class: {...this.state.filter_data.college_class,
                                                                               to:event.target.value}}});
                                                               }}
                                                    />
                                                    </div>
                                                </td>

                                                <td id="wrap-application-status"><b>Application status</b>
                                                    <div className="wrap-filter">
                                                        <table>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="accepted"
                                                                               checked={this.state.filter_data.application_status.includes("accepted")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="accepted">Accepted</label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="denied"
                                                                               checked={this.state.filter_data.application_status.includes("denied")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="denied">Denied</label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="deferred"
                                                                               checked={this.state.filter_data.application_status.includes("deferred")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="deferred">Deferred</label>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="wait-listed"
                                                                               checked={this.state.filter_data.application_status.includes("wait-listed")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="wait-listed">Wait-listed</label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="withdrawn"
                                                                               checked={this.state.filter_data.application_status.includes("withdrawn")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="withdrawn">Withdrawn</label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input"
                                                                               id="pending"
                                                                               checked={this.state.filter_data.application_status.includes("pending")}
                                                                               onChange={this.application_checked}
                                                                        />
                                                                        <label className="custom-control-label"
                                                                               htmlFor="pending">Pending</label>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{height: '15px'}}/>
                                            <tr>
                                                <td id="wrap-high-school"><b>High school</b>
                                                    <div className="wrap-filter">
                                                        <table>
                                                            <tbody>
                                                                {high_schools}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="filters-radio">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id="strict" name="customRadio"
                                               className="custom-control-input"/>
                                        <label className="custom-control-label" htmlFor="strict">Strict</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id="lax" name="customRadio"
                                               className="custom-control-input"/>
                                        <label className="custom-control-label" htmlFor="lax">Lax</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wrap-result">
                            <div className="result-top">
                                <span className="result-text">Results</span>
                                <button type="button" id="plot-btn" className="btn btn-primary shadow-none"
                                        data-toggle="modal" data-target="#plot-modal">View scatterplot
                                </button>
                                <div className="modal fade" id="plot-modal" tabIndex={-1} role="dialog"
                                     aria-labelledby="plot-modal-label" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="plot-modal-label">Scatterplot</h5>
                                                <button type="button" className="close" data-dismiss="modal"
                                                        aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {/* put graph here */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Initially, there should be no tags inside the "#summary" tag below. */}
                            <div className="list-group" id="summary">
                                <h4><b>Summary</b></h4>
                                {/* The table tag below must be shown whenever the user gets the result in the track application menu */}
                                <table>
                                    <tbody>
                                    <tr>
                                        {/* Frontend ajax should put data inside the b tags below */}
                                        {/* If there's no application list, then put dash inside the b tags */}
                                        <td><b>{this.state.summary.avg_gpa}</b><br/><label>Average GPA</label></td>
                                        <td><b>{this.state.summary.avg_sat_ebrw}</b><br/><label>Average SAT EBRW</label></td>
                                        <td><b>{this.state.summary.avg_sat_math}</b><br/><label>Average SAT Math</label></td>
                                        <td><b>{this.state.summary.avg_act_composite}</b><br/><label>Average ACT Composite</label></td>
                                        <td/>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Initially, there should be no tags inside the "#application-list" tag below. */}
                            {/* "button" tag with class="list-group-item list-group-item-action" and "div" tag with class="carousel slide" are a pair */}
                            {/* Frontend ajax should add these pairs with data inside the tag below */}
                            <div className="list-group" id="application-list">
                                {applications}
                            </div>
                            <nav>
                                {/* Initially, there should be no tags inside the tag below. */}
                                <ul className="pagination" id="pagination">
                                    {page_buttons}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Track;