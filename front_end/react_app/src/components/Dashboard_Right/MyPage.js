import React from "react";
import '../../gui/css/my_page.css';
import RejectedImg from '../../gui/img/rejected.png';
import StudentImg from '../../gui/img/student.png';
import ConfirmImg from '../../gui/img/confirmed.png';
import QuestionImg from '../../gui/img/question.png';
import FindSimilarHighSchoolsModal from "./FindSimilarHighSchoolsModal";
import {SERVER_URL} from "../../common/Constants";

const SIMILAR_HIGH_SCHOOLS_ENDPOINT = "/find_similar_highschools";
const GET_PROFILE_ENDPOINT = "/get_profile";

class MyPage extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            show_high_school_modal: false,
            current_modal_high_schools: [],
            profile: {
                username: "-",
                residence_state: "-",
                high_school_name: "-",
                high_school_city: "-",
                high_school_state: "-",
                gpa: "-",
                college_class: "",
                major_1: "-",
                major_2: "-",
                sat_math: "-",
                sat_ebrw: "-",
                act_english: "-",
                act_math: "-",
                act_reading: "-",
                act_science: "-",
                act_composite: "-",
                sat_lit: "-",
                sat_us: "-",
                sat_world: "-",
                sat_math_1: "-",
                sat_math_2: "-",
                sat_eco_bio: "-",
                sat_mol_bio: "-",
                sat_chem: "-",
                sat_physics: "-",
                ap_passed: "-",
                password: ""
            }
        }

        this.show_high_school_modal = this.show_high_school_modal.bind(this);
        this.fetch_similar_high_schools = this.fetch_similar_high_schools.bind(this);
        this.fetch_profile = this.fetch_profile.bind(this);
    }

    show_high_school_modal(){
        this.fetch_similar_high_schools().then(() =>{
             this.setState({show_high_school_modal: !this.state.show_high_school_modal});
        }).catch((err)=>{
            alert(err.message);
        });
    }

    async fetch_similar_high_schools(){
        try{
            let response = await fetch(
                SERVER_URL + SIMILAR_HIGH_SCHOOLS_ENDPOINT,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(response_json.result);
            this.state.current_modal_high_schools = response_json.data;
        }catch (err) {
            console.log(err.stack);
            throw new Error(err.message);
        }
    }

    async fetch_profile(){
        try{
            let response = await fetch(
                SERVER_URL + GET_PROFILE_ENDPOINT,
                {
                    method: "POST",
                    credentials: 'include',
                    headers:{
                        "Accept": "application/json"
                    }
                }
            );
            if(response.status !== 200) throw new Error(response.statusText);
            let response_json = await response.json();
            for (let key in response_json.profile) {
                response_json.profile[key] = (response_json.profile[key] == null) ? "-" : response_json.profile[key];
            }
            this.setState({profile: {...this.state.profile, ...response_json.profile}});
        }catch (err) {
            console.log(err.stack);
            alert(err.message);
        }
    }
    
    async componentDidMount() {
        await this.fetch_profile();
    }


    render() {
        return (
            <React.Fragment>
                <div className="right-content overflow-hidden">
                    <div className="wrap-my-page">
                        <div id="profile">
                            <div>
                                <span className="result-text">Profile</span>
                                <button type="button" id="save-btn" className="btn btn-primary shadow-none">Save
                                </button>
                            </div>
                            <div>
                                {/* put student's data as a value of input tags on the first rendering */}
                                <table className="PageTable" style={{width: '100%'}}>
                                    <tbody>
                                    <tr>
                                        <td rowSpan={2} className="wrap-student-icon"><img className="student-icon"
                                                                                           src={StudentImg}/></td>
                                        {/* put student's username inside b tag below */}
                                        <td className="profile-username"><h5><b>{this.state.profile.username}</b></h5></td>
                                    </tr>
                                    <tr>
                                        <td className="flex"><b>Class of</b><input type="number" placeholder="< 2027"
                                                                                   className="form-control shadow-none profile-number-input"
                                                                                   value={this.state.profile.college_class}
                                                                                   onChange={(event)=>{this.setState({profile: {...this.state.profile, college_class: event.target.value}})}}
                                                                                   id="profile-college-class"
                                                                                   max={2027}/></td>
                                    </tr>
                                    <tr>
                                        <td><b>Password</b></td>
                                        <td><input type="password" className="form-control shadow-none"
                                                   id="profile-password" minLength={8} maxLength={128} /></td>
                                    </tr>
                                    <tr style={{marginBottom: '10px'}}>
                                        <td><b>Residence state</b></td>
                                        <td>
                                            <select id="profile-residence-state"
                                                    value={this.state.profile.residence_state}
                                                    onChange={event => {this.setState({profile: {...this.state.profile, residence_state: event.target.value}})}}
                                            >
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                <option value="AL">AL</option>
                                                <option value="AK">AK</option>
                                                <option value="AZ">AZ</option>
                                                <option value="AR">AR</option>
                                                <option value="CA">CA</option>
                                                <option value="CO">CO</option>
                                                <option value="CT">CT</option>
                                                <option value="DE">DE</option>
                                                <option value="FL">FL</option>
                                                <option value="GA">GA</option>
                                                <option value="HI">HI</option>
                                                <option value="ID">ID</option>
                                                <option value="IL">IL</option>
                                                <option value="IN">IN</option>
                                                <option value="IA">IA</option>
                                                <option value="KS">KS</option>
                                                <option value="KY">KY</option>
                                                <option value="LA">LA</option>
                                                <option value="ME">ME</option>
                                                <option value="MD">MD</option>
                                                <option value="MA">MA</option>
                                                <option value="MI">MI</option>
                                                <option value="MN">MN</option>
                                                <option value="MS">MS</option>
                                                <option value="MO">MO</option>
                                                <option value="MT">MT</option>
                                                <option value="NE">NE</option>
                                                <option value="NV">NV</option>
                                                <option value="NH">NH</option>
                                                <option value="NJ">NJ</option>
                                                <option value="NM">NM</option>
                                                <option value="NY">NY</option>
                                                <option value="NC">NC</option>
                                                <option value="ND">ND</option>
                                                <option value="OH">OH</option>
                                                <option value="OK">OK</option>
                                                <option value="OR">OR</option>
                                                <option value="PA">PA</option>
                                                <option value="RI">RI</option>
                                                <option value="SC">SC</option>
                                                <option value="SD">SD</option>
                                                <option value="TN">TN</option>
                                                <option value="TX">TX</option>
                                                <option value="UT">UT</option>
                                                <option value="VT">VT</option>
                                                <option value="VA">VA</option>
                                                <option value="WA">WA</option>
                                                <option value="WV">WV</option>
                                                <option value="WI">WI</option>
                                                <option value="WY">WY</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={3} style={{verticalAlign: 'baseline'}}><b>High school</b></td>
                                        <td><input type="text" className="form-control shadow-none"
                                                   id="profile-high-scool-name" placeholder="Name" minLength={11}/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="text" className="form-control shadow-none"
                                                   id="profile-high-scool-city" placeholder="City" minLength={5}/>
                                            <select id="profile-high-school-state">
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                <option value="AL">AL</option>
                                                <option value="AK">AK</option>
                                                <option value="AZ">AZ</option>
                                                <option value="AR">AR</option>
                                                <option value="CA">CA</option>
                                                <option value="CO">CO</option>
                                                <option value="CT">CT</option>
                                                <option value="DE">DE</option>
                                                <option value="FL">FL</option>
                                                <option value="GA">GA</option>
                                                <option value="HI">HI</option>
                                                <option value="ID">ID</option>
                                                <option value="IL">IL</option>
                                                <option value="IN">IN</option>
                                                <option value="IA">IA</option>
                                                <option value="KS">KS</option>
                                                <option value="KY">KY</option>
                                                <option value="LA">LA</option>
                                                <option value="ME">ME</option>
                                                <option value="MD">MD</option>
                                                <option value="MA">MA</option>
                                                <option value="MI">MI</option>
                                                <option value="MN">MN</option>
                                                <option value="MS">MS</option>
                                                <option value="MO">MO</option>
                                                <option value="MT">MT</option>
                                                <option value="NE">NE</option>
                                                <option value="NV">NV</option>
                                                <option value="NH">NH</option>
                                                <option value="NJ">NJ</option>
                                                <option value="NM">NM</option>
                                                <option value="NY">NY</option>
                                                <option value="NC">NC</option>
                                                <option value="ND">ND</option>
                                                <option value="OH">OH</option>
                                                <option value="OK">OK</option>
                                                <option value="OR">OR</option>
                                                <option value="PA">PA</option>
                                                <option value="RI">RI</option>
                                                <option value="SC">SC</option>
                                                <option value="SD">SD</option>
                                                <option value="TN">TN</option>
                                                <option value="TX">TX</option>
                                                <option value="UT">UT</option>
                                                <option value="VT">VT</option>
                                                <option value="VA">VA</option>
                                                <option value="WA">WA</option>
                                                <option value="WV">WV</option>
                                                <option value="WI">WI</option>
                                                <option value="WY">WY</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button type="button" id="find-similar-high-schools-btn"
                                                    className="btn btn-danger shadow-none" data-toggle="modal"
                                                    data-target="#find-similar-high-schools-modal"
                                                    onClick={this.show_high_school_modal}
                                            >Find similar high schools
                                            </button>
                                            <FindSimilarHighSchoolsModal show={this.state.show_high_school_modal} current_modal_high_schools={this.state.current_modal_high_schools} show_high_school_modal={this.show_high_school_modal}/>                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Major 1</b></td>
                                        <td>
                                            <select id="profile-major1">
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                {/* Frontend should add option tags with the major names from here */}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Major 2</b></td>
                                        <td>
                                            <select id="profile-major1">
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                {/* Frontend should add option tags with the major names from here */}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>AP passed</b></td>
                                        <td>
                                            <input type="number"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-ap-passed" min={0}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>GPA</b></td>
                                        <td>
                                            <input type="number" placeholder="< 4.0"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-gpa" max={4} step="0.01"/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table className="PageTable">
                                    <tbody>
                                    <tr>
                                        <td><b>Exam scores</b></td>
                                    </tr>
                                    <tr>
                                        <td>SAT Math</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat-math" min={200} max={800}/>
                                        </td>
                                        <td>SAT EBRW</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat-ebrw" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ACT Composite</td>
                                        <td>
                                            <input type="number" placeholder="1 - 36"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-act-composite" min={1} max={36}/>
                                        </td>
                                        <td>ACT English</td>
                                        <td>
                                            <input type="number" placeholder="1 - 36"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-act-english" min={1} max={36}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ACT Math</td>
                                        <td>
                                            <input type="number" placeholder="1 - 36"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-act-math" min={1} max={36}/>
                                        </td>
                                        <td>ACT Reading</td>
                                        <td>
                                            <input type="number" placeholder="1 - 36"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-act-reading" min={1} max={36}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ACT Science</td>
                                        <td>
                                            <input type="number" placeholder="1 - 36"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-act-science" min={1} max={36}/>
                                        </td>
                                        <td>SAT2 Chemistry</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-chemistry" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>SAT2 Eco-Bio</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-eco-bio" min={200} max={800}/>
                                        </td>
                                        <td>SAT2 Literature</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-literature" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>SAT2 Math I</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-math1" min={200} max={800}/>
                                        </td>
                                        <td>SAT2 Math II</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-math2" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>SAT2 Mol-Bio</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-mol-bio" min={200} max={800}/>
                                        </td>
                                        <td>SAT2 Physics</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-physics" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>SAT2 US History</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-us-history" min={200} max={800}/>
                                        </td>
                                        <td>SAT2 World History</td>
                                        <td>
                                            <input type="number" placeholder="200 - 800"
                                                   className="form-control shadow-none profile-number-input"
                                                   id="profile-sat2-world-history" min={200} max={800}/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div id="application">
                            <div>
                                <span className="result-text">Admission Decisions</span>
                            </div>
                            <div>
                                <table className="PageTable">
                                    <tbody>
                                    <tr>
                                        <td><b>College</b></td>
                                        <td>
                                            <select id="college" required>
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                {/* Frontend should add option tags with the major names from here */}
                                            </select>
                                        </td>
                                        <td rowSpan={2}>
                                            <button type="button" id="register-btn"
                                                    className="btn btn-primary shadow-none">Submit
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Status</b></td>
                                        <td>
                                            <select id="status" required>
                                                {/* - means no choice */}
                                                <option value="-">-</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Denied">Denied</option>
                                                <option value="Deferred">Deferred</option>
                                                <option value="Wait-listed">Wait-listed</option>
                                                <option value="Withdrawn">Withdrawn</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table className="PageTable">
                                    <tbody>
                                    <tr>
                                        <td className="wrap-admin-check"><img src={RejectedImg}
                                                                              className="admin-check"
                                                                              data-toggle="tooltip" data-placement="top"
                                                                              title="Decision marked as questionable"/>
                                        </td>
                                        <td className="college">Harvard University</td>
                                        <td className="status">Declined</td>
                                    </tr>
                                    <tr>
                                        <td className="wrap-admin-check"><img src={ConfirmImg}
                                                                              className="admin-check"
                                                                              data-toggle="tooltip" data-placement="top"
                                                                              title="Decision successfully processed"/>
                                        </td>
                                        <td className="college">State University of New York, Albany</td>
                                        <td className="status">Accepted</td>
                                    </tr>
                                    <tr>
                                        <td className="wrap-admin-check"><img src={QuestionImg}
                                                                              className="admin-check"
                                                                              data-toggle="tooltip" data-placement="top"
                                                                              title="Decision under review"/></td>
                                        <td className="college">Massachusetts Institute of Technology</td>
                                        <td className="status">Wait-listed</td>
                                    </tr>
                                    </tbody>
                                </table>
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
            </React.Fragment>

        );
    }
}

export default MyPage;