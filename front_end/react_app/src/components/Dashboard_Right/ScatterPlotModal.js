import React from "react";
import Modal from 'react-bootstrap/Modal'

class ScatterPlotModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            scatter_plots: []
        };
    }

    static center_title = {
        marginLeft: "37.5%"
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.on_hide} aria-labelledby="plot-modal-label" centered>
                <div className="modal-content">
                    <Modal.Header closeButton>
                        <Modal.Title  style={ScatterPlotModal.center_title}>Scatterplot</Modal.Title>
                    </Modal.Header>
                    <div className="modal-body">
                      <div id="plot-modal-buttons">
                        <button style={{marginRight: "2%"}} type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">SAT (Math+EBRW)</button>
                        <button style={{marginRight: "2%"}} type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">ACT Composite</button>
                        <button type="button"  className="btn btn-primary shadow-none plot-modal-option-btn">SAT2+SAT/ACT</button>
                      </div>
                      <div id="plot-modal-scatterplot">
                        {/* put graph here */}
                      </div>
                    </div>
                  </div>
            </Modal>
        )
    }
}

export default ScatterPlotModal;