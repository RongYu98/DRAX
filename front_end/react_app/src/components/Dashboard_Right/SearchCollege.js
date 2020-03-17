import React from "react";
import '../../gui/css/search_college.css';
import CollegeItem from "./CollegeItem";
import {DropdownButton, Dropdown} from "react-bootstrap";
import {SERVER_URL, STATUS_OK} from "../../common/Constants";

const RECOMMENDED_COLLEGE_ENDPOINT = ''; // what is the end point???

class SeachCollege extends React.Component{

    static show = {
        display : "flex"
    }

    static hide = {
        display: "None"
    }

    static sort_enum = {
        NAME: "name",
        COST: "cost",
        RANKING: "rank",
        RECOMMENDATION: "recommendation"
    }



    constructor(props) {
        super(props);
        this.state = {
            show_filter: false,
            current_page_num: 1,
            college_list: [],
            filter_data: {
                name: "",
                admission_rate: {min: "", max: ""},
                location: '-',
                sat_ebrw: {min: '', max: ''},
                max_ranking: '-',
                size: '-',
                sat_math: {min: '', max: ''},
                major: {left: '-', right: '-'},
                max_tuition: '',
                act: {min: '', max: ''},
                policy: "strict"
            }
        }
        this.button_list = [];
        this.filter_drop_down_clicked = this.filter_drop_down_clicked.bind(this);
        this.slider_input = this.slider_input.bind(this);
        this.page_clicked = this.page_clicked.bind(this);
        this.get_colleges = this.get_colleges.bind(this);
        this.fetch_new_college_list = this.fetch_new_college_list.bind(this);
        this.search_clicked = this.search_clicked.bind(this);
        this.sort_clicked = this.sort_clicked.bind(this);
    }

    sort_clicked(event){
        console.log(event);
        switch (event) {
            case SeachCollege.sort_enum.NAME:
                // sort by name
                break;
            case SeachCollege.sort_enum.COST:
                // sort by attendance
                break;
            case SeachCollege.sort_enum.RANKING:
                // sort by rank
                break;
            case SeachCollege.sort_enum.RECOMMENDATION:
                // sort by recommendation
                break;
        }
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
        this.setState({filter_data:{...this.state.filter_data, max_ranking: new_value}});
    }

    page_clicked(event){
       let button = event.target;
       let number = button.innerHTML;
       this.setState({current_page_num: parseInt(number)})
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
        let max_pages = this.state.college_list.length / 10;
        if(!this.is_whole_number(max_pages)) {
            max_pages = Math.floor(max_pages) + 1;
        }
        let next_ten_pages = this.state.current_page_num + 9;
        let old_beginning = this.button_list[0];
        let old_end = this.button_list[this.button_list.length - 1];
        if(this.state.college_list.length <= 10) {
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
        if(this.state.college_list.length === 0){
            this.button_list = [];
            return [];
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
        for(let i = 0; i < 830; i++){
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
        this.setState({current_page_num: 1, college_list: list});
    }


    get_colleges(){
        let list = [];
        let beginning = (this.state.current_page_num === 1) ? 0 : (this.state.current_page_num - 1) * 10;
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

    set_none_scores_filter_data(data){
        this.setState({filter_data: {...this.state.filter_data, ...data}});
    }

    search_clicked(event){
        console.log(this.state.filter_data);
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
                                <input onChange={(event)=>{this.set_none_scores_filter_data({name: event.target.value})}}
                                       value={this.state.filter_data.name}
                                       type="text" className="form-control shadow-none"
                                       placeholder="College Name"
                                       aria-label="College Name" aria-describedby="search-btn"
                                />
                                <div className="input-group-append">
                                    <button onClick={this.search_clicked} className="btn btn-outline-secondary shadow-none" type="button"
                                            id="search-btn">Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="filters-box">
                            <div className="filters-dropdown">
                                <button className="btn btn-secondary shadow-none" type="button" id="filters-dropdown-btn" onClick={this.filter_drop_down_clicked}>
                                    Filters
                                </button>
                                <div style={(this.state.show_filter) ? SeachCollege.show : SeachCollege.hide} ref={this.filter_dropdown_content}  id="search-filters-dropdown-content">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td><b>Admission rate (%)</b><br/>
                                                <div style={{display: "inline-flex"}} className="wrap-filter range">
                                                    <input onChange={(event)=>{
                                                        let new_min = event.target.value;
                                                        let admissionRate = this.state.filter_data.admission_rate;
                                                        this.setState({filter_data: {...this.state.filter_data, admission_rate: {...admissionRate, min: new_min}}})
                                                    }}
                                                           value={this.state.filter_data.admission_rate.min} type="number" className="form-control shadow-none" id="sat-ebrw-min" placeholder="0 - 100" min={200} max={800}
                                                    />
                                                    &nbsp;-&nbsp;
                                                    <input onChange={(event)=>{
                                                        let new_max = event.target.value;
                                                        let admissionRate = this.state.filter_data.admission_rate;
                                                        this.setState({filter_data: {...this.state.filter_data, admission_rate: {...admissionRate, max: new_max}}})
                                                    }}
                                                           value={this.state.filter_data.admission_rate.max} type="number" className="form-control shadow-none" id="sat-ebrw-max" placeholder="0 - 100" min={200} max={800}
                                                    />
                                                </div>
                                            </td>
                                            <td><b>Max ranking</b><span id="ranking-val">{this.state.filter_data.max_ranking}</span>
                                                <div className="wrap-filter">
                                                    {/* 0 means no preference, 601 means 600 + */}
                                                    <input type="range" min={0} max={601} defaultValue={0}
                                                           className="slider" id="ranking"
                                                           onChange={this.slider_input}
                                                    />
                                                </div>
                                            </td>
                                            <td><b>Major</b>
                                                <div className="wrap-filter">
                                                    <select id="major1" defaultValue={this.state.filter_data.major.left}
                                                            onChange={(event)=>{
                                                                    this.setState({filtered_data: {...this.state.filter_data, major: {left: this.state.filter_data.major.left, right: event.target.value}}});
                                                                }
                                                            }
                                                    >
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>ssssss
                                                        {/* Frontend should add option tags with the major names from here */}
                                                    </select>
                                                    &amp;
                                                    <select id="major2" defaultValue={this.state.filter_data.major.right}
                                                        onChange={(event)=>{
                                                                    this.setState({filtered_data: {...this.state.filter_data, major: {right: this.state.filter_data.major.right, left: event.target.value}}});
                                                                }
                                                            }
                                                    >
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
                                                    <select id="location"
                                                        defaultValue={this.state.filter_data.location}
                                                        onChange={event => {
                                                                this.setState({filter_data: {
                                                                        ...this.state.filter_data, location: event.target.value
                                                                    }})
                                                            }
                                                        }
                                                    >
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>
                                                        <option value="Midwest">Midwest</option>
                                                        <option value="Northeast">Northeast</option>
                                                        <option value="South">South</option>
                                                        <option value="West">West</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td><b>Size</b>
                                                <div className="wrap-filter" >
                                                    <select id="size"
                                                        defaultValue={this.state.filter_data.size}
                                                        onChange={event => {
                                                                this.setState({filter_data: {
                                                                        ...this.state.filter_data, size: event.target.value
                                                                    }})
                                                            }
                                                        }
                                                    >
                                                        {/* - means no preference */}
                                                        <option value="-">-</option>
                                                        <option value="small">small (&lt; 2,000)</option>
                                                        <option value="medium">medium (2,000 - 15,000)</option>
                                                        <option value="large">large (&gt; 15,000)</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td><b>Max cost of attendance (k $)</b>
                                                <div className="wrap-filter">
                                                    <input type="number" className="form-control shadow-none"
                                                           id="cost-of-attendance" placeholder="1 - 100" min="1"
                                                           max="100"
                                                           onChange={(event) =>{
                                                                    this.set_none_scores_filter_data({max_tuition: event.target.value})
                                                                }
                                                           }
                                                    />
                                                </div>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr style={{height: '15px'}}/>
                                        <tr>
                                            {/* frontend javascript should check whether the min is less than or eqal to max */}
                                            <td><b>SAT EBRW score</b><br/>
                                                <div style={{display: "inline-flex"}} className="wrap-filter range">
                                                    <input onChange={(event)=>{
                                                        let new_min = event.target.value;
                                                        let old_sat_ebrw = this.state.filter_data.sat_ebrw;
                                                        this.setState({filter_data: {...this.state.filter_data, sat_ebrw: {...old_sat_ebrw, min: new_min}}})
                                                    }}
                                                           value={this.state.filter_data.sat_ebrw.min} type="number" className="form-control shadow-none" id="sat-ebrw-min" placeholder="200 - 800" min={200} max={800}
                                                    />
                                                    &nbsp;-&nbsp;
                                                    <input onChange={(event)=>{
                                                        let new_max = event.target.value;
                                                        let old_sat_ebrw = this.state.filter_data.sat_ebrw;
                                                        this.setState({filter_data: {...this.state.filter_data, sat_ebrw: {...old_sat_ebrw, max: new_max}}})
                                                    }}
                                                           value={this.state.filter_data.sat_ebrw.max} type="number" className="form-control shadow-none" id="sat-ebrw-max" placeholder="200 - 800" min={200} max={800}
                                                    />
                                                </div>
                                            </td>
                                            <td><b>SAT Math score</b> <br/>
                                                <div style={ {display: "inline-flex"}} className="wrap-filter">
                                                     <input onChange={(event)=>{
                                                        let new_min = event.target.value;
                                                        let old_sat_math = this.state.filter_data.sat_math;
                                                        this.setState({filter_data: {...this.state.filter_data, sat_math: {...old_sat_math, min: new_min}}})
                                                    }}
                                                            value={this.state.filter_data.sat_math.min}
                                                            type="number" className="form-control shadow-none"
                                                            id="sat-math-min" placeholder="200 - 800" min={200}
                                                            max={800}
                                                     />
                                                     &nbsp;-&nbsp;
                                                     <input onChange={(event)=>{
                                                        let new_max = event.target.value;
                                                        let old_sat_math = this.state.filter_data.sat_math;
                                                        this.setState({filter_data: {...this.state.filter_data, sat_math: {...old_sat_math, max: new_max}}})
                                                    }}
                                                            value={this.state.filter_data.sat_math.max}
                                                            type="number" className="form-control shadow-none"
                                                            id="sat-math-max" placeholder="200 - 800" min={200}
                                                            max={800}
                                                     />
                                                </div>
                                            </td>
                                            <td><b>ACT Composite score</b><br/>
                                                <div style={{display:"inline-flex"}} className="wrap-filter">
                                                     <input onChange={(event)=>{
                                                        let new_min = event.target.value;
                                                        let old_act = this.state.filter_data.act;
                                                        this.setState({filter_data: {...this.state.filter_data, act: {...old_act, min: new_min}}})
                                                    }}
                                                            value={this.state.filter_data.act.min}
                                                            type="number" className="form-control shadow-none"
                                                            id="act-composite-min" placeholder="1 - 36" min={1}
                                                            max={36}
                                                     />
                                                     &nbsp;-&nbsp;
                                                     <input onChange={(event)=>{
                                                        let new_max = event.target.value;
                                                        let old_act = this.state.filter_data.act;
                                                        this.setState({filter_data: {...this.state.filter_data, act: {...old_act, max: new_max}}})
                                                    }}
                                                            value={this.state.filter_data.act.max}
                                                            type="number" className="form-control shadow-none"
                                                            id="act-composite-max" placeholder="1 - 36" min={1}
                                                            max={36}
                                                     />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="filters-radio">
                                <div className="custom-control custom-radio">
                                  <input type="radio" id="strict" name="customRadio" className="custom-control-input" checked={this.state.filter_data.policy === 'strict'}
                                    onChange={event => {
                                        this.set_none_scores_filter_data({policy: "strict"});
                                    }}
                                  />
                                  <label className="custom-control-label" htmlFor="strict">Strict</label>
                                </div>
                                <div className="custom-control custom-radio">
                                  <input type="radio" id="lax" name="customRadio" className="custom-control-input"
                                    onChange={event => {
                                        this.set_none_scores_filter_data({policy: "lax"});
                                    }}
                                  />
                                  <label className="custom-control-label" htmlFor="lax">Lax</label>
                                </div>
      </div>
                        </div>
                    </div>
                    <div className="wrap-result">
                        <div className="result-top">
                            <span className="result-text">Results</span>

                            {
                                (this.state.college_list.length > 1) ?
                                    <DropdownButton id="dropdown-basic-button" title="Sort By" onSelect={this.sort_clicked}>
                                      <Dropdown.Item eventKey={SeachCollege.sort_enum.NAME}>College name</Dropdown.Item>
                                      <Dropdown.Item eventKey={SeachCollege.sort_enum.COST}>Cost of Attendance</Dropdown.Item>
                                      <Dropdown.Item eventKey={SeachCollege.sort_enum.RANKING}>Ranking</Dropdown.Item>
                                        <Dropdown.Item eventKey={SeachCollege.sort_enum.RECOMMENDATION}>Recommendation Score</Dropdown.Item>
                                    </DropdownButton>
                                    :
                                    null
                            }

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

export default SeachCollege;