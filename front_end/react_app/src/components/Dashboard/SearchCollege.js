import React from "react";
import '../../gui/css/search_college.css';

class SeachCollege extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
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
                                <button className="btn btn-secondary shadow-none" type="button"
                                        id="filters-dropdown-btn">
                                    filters
                                </button>
                                <div id="filters-dropdown-content">
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
                                            <td><b>Max ranking</b><span id="ranking-val">-</span>
                                                <div className="wrap-filter">
                                                    {/* 0 means no preference, 601 means 600 + */}
                                                    <input type="range" min={0} max={601} defaultValue={0}
                                                           className="slider" id="ranking"/>
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
                            <button className="list-group-item list-group-item-action">
                                {/* data should be included inside h5 tag */}
                                <h5 className="college-name">State University of New York, Albany</h5>
                                {/* replace # with Track Application menu end point  */}
                                <a href="#">Track Application</a>
                                {/* data should be included inside h5 tag */}
                                <h5>NY</h5>
                            </button>
                            <div className="item-info">
                                <table>
                                    <tbody>
                                    <tr>
                                        {/* data should be included inside b tags */}
                                        <td><b>Public</b><br/><label>Institution</label></td>
                                        <td><b>50%</b><br/><label>Admission rate</label></td>
                                        <td><b>90%</b><br/><label>Completion rate</label></td>
                                        <td/>
                                    </tr>
                                    <tr>
                                        <td><b>$20000</b><br/><label>Tuition</label></td>
                                        <td><b>$20000</b><br/><label>Median debt amount</label></td>
                                        <td><b>100</b><br/><label>Ranking</label></td>
                                        <td><b>5000</b><br/><label>Size</label></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="list-group-item list-group-item-action">
                                <h5 className="college-name">State University of New York, Stony Brook</h5>
                                <a href="#">Track Application</a>
                                <h5>NY</h5>
                            </button>
                            <div className="item-info">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td><b>Public</b><br/><label>Institution</label></td>
                                        <td><b>50%</b><br/><label>Admission rate</label></td>
                                        <td><b>90%</b><br/><label>Completion rate</label></td>
                                        <td/>
                                    </tr>
                                    <tr>
                                        <td><b>$20000</b><br/><label>Tuition</label></td>
                                        <td><b>$20000</b><br/><label>Median debt amount</label></td>
                                        <td><b>100</b><br/><label>Ranking</label></td>
                                        <td><b>5000</b><br/><label>Size</label></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
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

export default SeachCollege