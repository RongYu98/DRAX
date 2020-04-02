import React from "react";

class HighSchoolButtons extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            display: "None"
        }
        this.clicked= this.clicked.bind(this);
        this.sanitized_list = this.sanitized_list.bind(this);
        this.page_clicked = this.page_clicked.bind(this);
    }

    page_clicked(event){
       let button = event.target;
       let number = button.innerHTML;
       this.setState({current_page_num: parseInt(number)})
    }


    clicked(event){
        let new_display = (this.state.display === "None") ? "flex" : "None";
         this.setState({display: new_display});
    }

    sanitized_list(){
        for (let property in this.props.data){
            this.props.data[property] = (this.props.data[property] == null) ? "-" : this.props.data[property];
        }
    }

    render() {
        this.sanitized_list();
        let {location} = this.props.data;

        return (
            <React.Fragment>
                <button onClick={this.clicked} className="list-group-item list-group-item-action similar-applicant-name">{"Test"}</button>
                  <div style={{display: this.state.display}} className="similar-applicant-info item-info">
                    <ul>
                      <li>{`Location: ${"Test"}`}</li>
                      <li>{`Average graduation rate: ${"Test"}%`}</li>
                      <li>{`Average SAT: ${"Test"}`}</li>
                      <li> {`Average ACT: ${"Test"}`}</li>
                      <li>{`AP enrollment: ${"Test"}%`}</li>
                      <li>{`Percent proficient - Reading: ${"Test"}%`}</li>
                      <li>{`Percent proficient - Math: ${"Test"}%`}</li>
                    </ul>
                  </div>
            </React.Fragment>
        )
    }
}

export default HighSchoolButtons;