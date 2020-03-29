import React from "react";

class ProfileButtons extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            display: "None"
        }
        this.clicked= this.clicked.bind(this);
    }


    clicked(event){
        let new_display = (this.state.display === "None") ? "flex" : "None";
         this.setState({display: new_display});
    }

    render() {
        for (let property in this.props.data){
            this.props.data[property] = (this.props.data[property] == null) ? "-" : this.props.data[property];
        }
        let {application_status, username, residence_state, high_school_name, high_school_city, high_school_state, gpa, college_class } = this.props.data;
            let {major_1, major_2, sat_math, sat_ebrw, act_english, act_math, act_reading, act_science, act_composite, sat_lit, sat_us, sat_world, sat_math_1, sat_math_2, sat_eco_bio, sat_mol_bio, sat_chem, sat_physics, ap_passed} = this.props.data;

        return (
            <React.Fragment>
                <button onClick={this.clicked} className="list-group-item list-group-item-action similar-applicant-name">{username}</button>
                  <div style={{display: this.state.display}} className="similar-applicant-info item-info">
                    <ul>
                      <li>{`College class: ${college_class}`}</li>
                      <li>{`Residence state: ${residence_state}`}</li>
                      <li>{`High School: ${high_school_name}, ${high_school_city}, ${high_school_state}`}</li>
                      <li> {`Major 1: Theology Religious Vocation`}</li>
                      <li>{`Major 2: ${"-"}`}</li>
                      <li>{`APs Passed: ${"-"}`}</li>
                      <li>{`GPA: ${3.8}`}</li>
                      <li>{`SAT Math: ${sat_math}`}</li>
                      <li>{`SAT EBRW: ${sat_ebrw}`}</li>
                      <li>{`ACT Composite: ${"-"}`}</li>
                      <li>{`ACT English: ${"-"}`}</li>
                      <li>{`ACT Math: ${"-"}`}</li>
                      <li>{`ACT Reading: ${"-"}`}</li>
                      <li>{`ACT Science: ${"-"}`}</li>
                      <li>{`SAT2 Chemistry: ${"-"}`}</li>
                      <li>{`SAT2 Eco-Bio: ${"-"}`}</li>
                      <li>{`SAT2 Literature: ${"-"}`}</li>
                      <li>{`SAT2 Math I: ${"-"}`}</li>
                      <li>{`SAT2 Math II: ${"-"}`}</li>
                      <li>{`SAT2 Mol-Bio: ${"-"}`}</li>
                      <li>{`SAT2 Physics: ${"-"}`}</li>
                      <li>{`SAT2 US History: ${"-"}`}</li>
                      <li>{`SAT2 World History: ${"-"}`}</li>
                    </ul>
                  </div>
            </React.Fragment>
        )
    }
}

export default ProfileButtons;