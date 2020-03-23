import React from "react";

class Application extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            carousel_display: {display: "none"},
            current_carousel_slide: 0
        }
        this.toggle_carousel = this.toggle_carousel.bind(this);
        this.next_carousel = this.next_carousel.bind(this);
        this.previous_carousel = this.previous_carousel.bind(this);
    }

    toggle_carousel(event){
        if(this.state.carousel_display.display === "none"){
            this.setState({carousel_display: {display: "flex"}});
        }else{
            this.setState({carousel_display: {display: "none"}});
        }
    }

    next_carousel(event){
        if((this.state.current_carousel_slide + 1) > 2){
            this.setState({current_carousel_slide : 0});
        }else{
            this.setState({current_carousel_slide : this.state.current_carousel_slide + 1});
        }
    }

    previous_carousel(event){
        if((this.state.current_carousel_slide - 1) < 0){
            this.setState({current_carousel_slide : 2});
        }else{
            this.setState({current_carousel_slide : this.state.current_carousel_slide - 1});
        }
    }


    render() {
        return (
            <React.Fragment>
                <button className="list-group-item list-group-item-action" onClick={this.toggle_carousel}>
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
                <div id="username1" style={this.state.carousel_display} className="carousel slide">
                    <ol className="carousel-indicators">
                        {/* every "li" tags' "data-target" property values should be the student's username*/}
                        <li
                            className={(this.state.current_carousel_slide === 0) ? "active" : ""}
                            onClick={event => {this.setState({current_carousel_slide: 0})}}
                        />
                        <li
                            className={(this.state.current_carousel_slide === 1) ? "active" : ""}
                            onClick={event => {this.setState({current_carousel_slide: 1})}}
                        />
                        <li
                            className={(this.state.current_carousel_slide === 2) ? "active" : ""}
                            onClick={event => {this.setState({current_carousel_slide: 2})}}
                        />
                    </ol>
                    <div className="carousel-inner">
                        <div className={`carousel-item personal ${(this.state.current_carousel_slide === 0) ? "active" : ""}`}>
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
                        <div className={`carousel-item sat2 ${(this.state.current_carousel_slide === 1) ? "active" : ""}`}>
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
                        <div className={`carousel-item act ${(this.state.current_carousel_slide === 2) ? "active" : ""}`}>
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
                    <a
                        onClick={this.previous_carousel}
                        className="carousel-control-prev" role="button"
                        data-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"/>
                        <span className="sr-only">Previous</span>
                    </a>
                    {/* "a" tag's "href" property value should be "#" + student's username*/}
                    <a
                        onClick={this.next_carousel}
                        className="carousel-control-next" role="button"
                        data-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"/>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </React.Fragment>
        )
    }
}

export default Application;