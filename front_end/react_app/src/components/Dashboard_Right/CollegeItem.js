import React from "react";


class CollegeItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            display : {display: "None"}
        }

        this.show_college_details = this.show_college_details.bind(this);
    }

    show_college_details(event){
        this.setState({display: {display: (this.state.display.display === "None") ? "flex" : "None"}});
    }

    render() {
        let {state, name, institution, admission_rate, tuition, debt, completion, ranking, size} = this.props.data;
        return(
            <React.Fragment>
                <button className="list-group-item list-group-item-action" onClick={this.show_college_details}>
                    <h5 className="college-name">{name}</h5>
                    <a href="#">Track Application</a>
                    <h5>{state}</h5>
                </button>
                <div className="item-info" style={this.state.display}>
                    <table>
                        <tbody>
                        <tr>
                            <td><b>{institution}</b><br/><label>Institution</label></td>
                            <td><b>{admission_rate}</b><br/><label>Admission rate</label></td>
                            <td><b>{completion}</b><br/><label>Completion rate</label></td>
                            <td/>
                        </tr>
                        <tr>
                            <td><b>{tuition}</b><br/><label>Tuition</label></td>
                            <td><b>{debt}</b><br/><label>Median debt amount</label></td>
                            <td><b>{ranking}</b><br/><label>Ranking</label></td>
                            <td><b>{size}</b><br/><label>Size</label></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }
}

export default CollegeItem;