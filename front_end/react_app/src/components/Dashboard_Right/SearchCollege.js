import React from "react";
import '../../gui/css/search_college.css';
import CollegeItem from "./CollegeItem";

class SeachCollege extends React.Component{

    static show = {
        display : "flex"
    }

    static hide = {
        display: "None"
    }

    constructor(props) {
        super(props);
        this.filter_dropdown_content = React.createRef();
        this.state = {
            show_filter: false,
            ranking_value: "-",
            current_page_num: 1
        }

        this.filter_drop_down_clicked = this.filter_drop_down_clicked.bind(this);
        this.slider_input = this.slider_input.bind(this);
        this.page_clicked = this.page_clicked.bind(this);

        this.current_page_btn = React.createRef();
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
        for(let i = 1 ; i <= 3; i++){
            page_list.push(
                <li  key={`key-${i}`} className="page-item">
                    <button ref={(ref) => {
                        if(this.state.current_page_num === i){
                            this.current_page_btn = ref;
                        }
                    }}onClick={this.page_clicked} className={`page-link shadow-none ${(i === this.state.current_page_num) ? "active" : ""}`}>{i}</button>
                </li>
            )
        }
        return page_list;
    }

    // dont know where to pull this data from
    get_colleges(){

    }



    render() {
        let dummy_page_lists = this.get_page_buttons();

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
                            <CollegeItem data= { {name: "test", state: "nowhere", institution: "public" , admission_rate: "50%", tuition:"$2000", debt:"$20000", completion: "90%", ranking: "100", size: "5000"}}/>
                        </div>
                        <nav>
                            {/* Initially, there should be no tags inside the tag below. */}
                            <ul className="pagination" id="pagination">
                                {/* "active" class below means the current active page button  */}
                                {/* first page button must be active in default after completing search */}
                                {
                                    dummy_page_lists
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