import React from "react";
import '../../gui/css/track_application.css';

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

        }

        this.fetch_summary = this.fetch_summary.bind(this);
        this.searchClicked = this.searchClicked.bind(this);
        this.fetch_highschool = this.fetch_highschool.bind(this);
        this.get_high_school = this.get_high_school.bind(this);
        this.high_school_checked = this.high_school_checked.bind(this);
        this.application_checked = this.application_checked.bind(this);
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
                                <button className="list-group-item list-group-item-action">
                                    {/* student's username should be included inside h5 tag */}
                                    <h5 className="username">username1<br/>
                                        {/* accpeted: badge-success | denied: badge-danger | rest: badge-warning */}
                                        <span className="badge badge-success">Accepted</span>
                                    </h5>
                                    {/* high school name should be one the left side of br tag
                                    high school city  should be combined with high school state by comma and this combination should be on the right side of br tag and inside h5 tag */}
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
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
                                    <h5 className="username">username2<br/><span
                                        className="badge badge-danger">Denied</span></h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                                <button className="list-group-item list-group-item-action">
                                    <h5 className="username">username3<br/><span
                                        className="badge badge-warning">Wait-listed</span></h5>
                                    <h5 className="high-school">Stony Brook High School<br/>Stony Brook, NY</h5>
                                </button>
                            </div>
                            <nav>
                                {/* Initially, there should be no tags inside the tag below. */}
                                <ul className="pagination" id="pagination">
                                    {/* "active" class below means the current active page button  */}
                                    {/* first page button must be active in default after completing search */}
                                    <li className="page-item">
                                        <button className="page-link shadow-none active">1</button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link shadow-none">2</button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link shadow-none">3</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Track;