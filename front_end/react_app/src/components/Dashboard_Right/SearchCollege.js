import React from "react";
import '../../gui/css/search_college.css';
import CollegeItem from "./CollegeItem";
import {SERVER_URL, STATUS_OK} from "../../common/Constants";

const RECOMMENDED_COLLEGE_ENDPOINT = ''; // what is the end point???

class SeachCollege extends React.Component{

    static show = {
        display : "flex"
    }

    static hide = {
        display: "None"
    }

    constructor(props) {
        super(props);
        this.state = {
            show_filter: false,
            ranking_value: "-",
            current_page_num: 1,
            college_list: []
        }
        this.button_list = []
        this.filter_drop_down_clicked = this.filter_drop_down_clicked.bind(this);
        this.slider_input = this.slider_input.bind(this);
        this.page_clicked = this.page_clicked.bind(this);
        this.get_colleges = this.get_colleges.bind(this);
        this.fetch_new_college_list = this.fetch_new_college_list.bind(this);
    }


    filter_drop_down_clicked(event){

        this.setState({show_filter: !this.state.show_filter});
    }

    slider_input(event){
        let new_value = event.target.value;
        if (new_value === "0"){
            new_value = "-";
        }else{
            new_value = (new_value === "601") ? "600+" : new_value;
        }
        console.log(new_value);
        this.setState({ranking_value:new_value});
    }

    page_clicked(event){
       let button = event.target;
       let number = button.innerHTML;
       this.setState({current_page_num: parseInt(number)})
    }

    // this will depend on the colleges
    get_page_buttons(){
        let page_list = [];
        let new_button_list = [];
        let max_pages = this.state.college_list.length / 10;
        let next_ten_pages = this.state.current_page_num + 9;
        let old_beginning = this.button_list[0];
        let old_end = this.button_list[this.button_list.length - 1];

        if(this.state.current_page_num === 1){
            console.log("1");
            for(let i = 1 ; i <= max_pages && i <= next_ten_pages; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }else if(this.state.current_page_num === old_end && !(this.button_list.length < 10)){
            console.log("old end");
            for(let i = old_end; i <= max_pages && i <= next_ten_pages; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }else if(this.state.current_page_num === old_beginning){
            console.log("old beginning");
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
        }else if((this.state.current_page_num in this.button_list) || (this.button_list.length < 10)){
            console.log("unchanged");
            for(let i = old_beginning ; i <= old_end; i++){
                new_button_list.push(i);
                page_list.push(
                    <li  key={`key-${i}`} className="page-item">
                        <button onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                    </li>
                )
            }
        }

        this.button_list = new_button_list;
        return page_list;
    }

    // dont know where to pull this data from, using a dummy list for testing
    async fetch_new_college_list(){
        // try{
        //     let response = await fetch(SERVER_URL + RECOMMENDED_COLLEGE_ENDPOINT);
        //     if(response.status !== STATUS_OK) throw new Error(response.statusText);
        //     let response_json = await response.json();
        //     console.log(response_json.data);
        //     this.setState({college_list: response_json.data});
        // }catch (err) {
        //     alert(`failed to fetch new college list, err msg: ${err.message}`);
        // }
        let list = [];
        for(let i = 0; i < 831; i++){
            list.push({
                institution: `test ${i + 1}`,
                tuition: `test ${i + 1}`,
                admission_rate: `test ${i + 1}`,
                debt: `test ${i + 1}`,
                completion_rate: `test ${i + 1}`,
                rank: `test ${i + 1}`,
                region: `test ${i + 1}`,
                name: `test ${i + 1}`,
                college_id: `test_${i + 1}`,
                size: `test_${i + 1}`
            });
        }
        this.setState({college_list: list});
    }


    get_colleges(){
        let list = [];
        let beginning = (this.state.current_page_num === 1) ? 0 : this.state.current_page_num * 10;
        let end_index = beginning + 10;
        for(let i = beginning; (i < this.state.college_list.length) && (i < end_index); i++){
            let college = this.state.college_list[i];
            list.push(
               <CollegeItem key={`college_key-${i}`} data= {
                   {
                       name: college.name,
                       state: college.region,
                       institution: college.institution,
                       admission_rate: college.admission_rate,
                       tuition: college.tuition,
                       debt: college.debt,
                       completion: college.completion_rate,
                       ranking: college.rank,
                       size: college.size,
                       college_id: college.college_id
                    }
               }/>
            )
        }
        return list;
    }

    async componentDidMount() {
        await this.fetch_new_college_list();
    }


    render() {
        let dummy_college_list = this.get_colleges();
        let page_lists = this.get_page_buttons();
        return (
            <div className="right-content">
                <div className="wrap-search-result">
                    <div className="wrap-search-filters">
                        <div className="search-box">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control shadow-none" placeholder="College Name"
                                       aria-label="College Name" aria-describedby="search-btn"/>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary shadow-none" type="button"
                                            id="search-btn">Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="filters-box">
                            <div className="filters-dropdown">
                                <button className="btn btn-secondary shadow-none" type="button" id="filters-dropdown-btn" onClick={this.filter_drop_down_clicked}>
                                    filters
                                </button>
                                <div style={(this.state.show_filter) ? SeachCollege.show : SeachCollege.hide} ref={this.filter_dropdown_content}  id="filters-dropdown-content">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td><b>Max admission rate (%)</b>
                                                <div className="wrap-filter">
                                                    <input type="number" className="form-control shadow-none"
                                                           id="admission-rate" placeholder="0 - 100" min={0}
                                                           max={100}/>
                                                </div>
                                            </td>
                                            <td><b>Max ranking</b><span id="ranking-val">{this.state.ranking_value}</span>
                                                <div className="wrap-filter">
                                                    {/* 0 means no preference, 601 means 600 + */}
                                                    <input type="range" min={0} max={601} defaultValue={0}
                                                           className="slider" id="ranking" onInput={this.slider_input}/>
                                                </div>
                                            </td>
                                            <td><b>Major</b>
                                                <div className="wrap-filter">
                                                    <select id="major1">
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>
                                                        {/* Frontend should add option tags with the major names from here */}
                                                    </select>
                                                    &amp;
                                                    <select id="major2">
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>
                                                        {/* Frontend should add option tags with the major names from here */}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style={{height: '15px'}}/>
                                        <tr>
                                            <td><b>Location</b>
                                                <div className="wrap-filter">
                                                    <select id="location">
                                                        {/* - means no preference */}
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
                                                </div>
                                            </td>
                                            <td><b>Size</b>
                                                <div className="wrap-filter">
                                                    <select id="size">
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>
                                                        <option value="small">small (&lt; 2,000)</option>
                                                        <option value="medium">medium (2,000 - 15,000)</option>
                                                        <option value="large">large (&gt; 15,000)</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td><b>Max tuition (k $)</b>
                                                <div className="wrap-filter">
                                                    <input type="number" className="form-control shadow-none"
                                                           id="tuition" placeholder="1 - 100" min={1} max={100}/>
                                                </div>
                                            </td>
                                            <td/>
                                        </tr>
                                        <tr style={{height: '15px'}}/>
                                        <tr>
                                            {/* frontend javascript should check whether the min is less than or eqal to max */}
                                            <td><b>SAT EBRW score</b>
                                                <div className="wrap-filter">
                                                    min <input type="number" className="form-control shadow-none"
                                                               id="sat-ebrw-min" placeholder="200 - 800" min={200}
                                                               max={800}/>
                                                    max <input type="number" className="form-control shadow-none"
                                                               id="sat-ebrw-max" placeholder="200 - 800" min={200}
                                                               max={800}/>
                                                </div>
                                            </td>
                                            <td><b>SAT Math score</b>
                                                <div className="wrap-filter">
                                                    min <input type="number" className="form-control shadow-none"
                                                               id="sat-math-min" placeholder="200 - 800" min={200}
                                                               max={800}/>
                                                    max <input type="number" className="form-control shadow-none"
                                                               id="sat-math-max" placeholder="200 - 800" min={200}
                                                               max={800}/>
                                                </div>
                                            </td>
                                            <td><b>ACT Composite score</b>
                                                <div className="wrap-filter">
                                                    min <input type="number" className="form-control shadow-none"
                                                               id="act-composite-min" placeholder="1 - 36" min={1}
                                                               max={36}/>
                                                    max <input type="number" className="form-control shadow-none"
                                                               id="act-composite-max" placeholder="1 - 36" min={1}
                                                               max={36}/>
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
                                    <label className="custom-control-label" htmlFor="strict">strict</label>
                                </div>
                                <div className="custom-control custom-radio">
                                    <input type="radio" id="lax" name="customRadio"
                                           className="custom-control-input"/>
                                    <label className="custom-control-label" htmlFor="lax">lax</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wrap-result">
                        <div className="result-top">
                            <span className="result-text">Results</span>
                            <button type="button" id="sort-btn" className="btn btn-secondary shadow-none">sort by
                                college recommendation
                            </button>
                        </div>
                        {/* Initially, there should be no tags inside the tag below. */}
                        {/* Frontend ajax should add tags with data inside the tag below */}
                        <div className="list-group" id="college-list">
                            {
                                dummy_college_list
                            }
                        </div>
                        <nav>
                            {/* Initially, there should be no tags inside the tag below. */}
                            <ul className="pagination" id="pagination">
                                {/* "active" class below means the current active page button  */}
                                {/* first page button must be active in default after completing search */}
                                {
                                    page_lists
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

export default SeachCollege