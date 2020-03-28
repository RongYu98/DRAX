import React from "react";
import Modal from 'react-bootstrap/Modal'
import {SERVER_URL, STATUS_OK} from "../../common/Constants";
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

const PLOT_ENDPOINT = "/track_applications_plot";

class ScatterPlotModal extends React.Component{

   static graph_type_enum = {
       SAT: "SAT",
       ACT: "ACT",
       BOTH: "SAT_ACT"
   }

    constructor(props) {
        super(props);
        this.state = {
            scatter_plots: [],
            graph_type: ScatterPlotModal.graph_type_enum.ACT,
            empty: false
        }
        this.fetch_data = this.fetch_data.bind(this);
        this.on_button_click = this.on_button_click.bind(this);
        this.get_scatter_plot = this.get_scatter_plot.bind(this);
    }

    static center_title = {
        marginLeft: "37.5%"
    }

    async fetch_data(type){
        try{
            let body = {...this.props.input_json, test_type: type};
            console.log(body);
            let response = await fetch(
                SERVER_URL + PLOT_ENDPOINT,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
            if(response.status != STATUS_OK) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.result !== "OK") throw new Error(response_json.result);
            this.state.scatter_plots = response_json.coordinates;
            this.state.empty = (response_json.coordinates.length === 0) ? true : false;
        }catch (err) {
            console.log(err.stack);
            alert(err.message);
        }
    }

    async on_button_click(type){
        await this.fetch_data(type);
        this.setState({graph_type: type});
    }

    get_scatter_plot(){
       if(this.state.empty) return "no coordinates found";
       if(this.state.scatter_plots.length === 0) return "Click on a button to see scatter plot";

       let x = this.state.scatter_plots.forEach(function (coordinate) {
            return coordinate.x;
        });

       let y = this.state.scatter_plots.forEach(function (coordinate) {
            return coordinate.y;
        });

       return(
           <Plot
               data={[
                  {
                      x: x,
                      y: y,
                      type: 'scatter',
                      mode: 'markers+text',
                      marker: {color: 'red'},
                  },
                  // {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
               ]}
                layout={ {width: 450, height: 450, title: 'Scatter Plot'} }
            />
       );
    }

    render() {
        let graph = this.get_scatter_plot();
        return (
            <Modal show={this.props.show} onHide={this.props.on_hide} aria-labelledby="plot-modal-label" centered>
                <div className="modal-content">
                    <Modal.Header closeButton>
                        <Modal.Title  style={ScatterPlotModal.center_title}>Scatterplot</Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">
                      <div id="plot-modal-buttons">
                        <button onClick={(event => {this.on_button_click(ScatterPlotModal.graph_type_enum.SAT)})} style={{marginRight: "2%"}} type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">SAT (Math+EBRW)</button>
                        <button onClick={(event => {this.on_button_click(ScatterPlotModal.graph_type_enum.ACT)})} style={{marginRight: "2%"}} type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">ACT Composite</button>
                        <button onClick={(event => {this.on_button_click(ScatterPlotModal.graph_type_enum.BOTH)})} type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">SAT2+SAT/ACT</button>
                      </div>
                      <div style={{textAlign: "center"}} id="plot-modal-scatterplot">
                        {graph}
                      </div>
                    </div>
                  </div>
            </Modal>
        )
    }
}

export default ScatterPlotModal;