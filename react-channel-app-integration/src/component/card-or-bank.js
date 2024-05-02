import React from "react";

export default class CardOrBank extends React.Component {
  constructor(props) {
    super(props)
    this.onTrigger = this.onTrigger.bind(this);
  }
  onTrigger = (event) => {
    this.props.parentCallback(event);
    event.preventDefault();
  }
  render() {
    return <div>

      <form id="CardOrBank">
        <div className="form-check">
          <input className="form-check-input" type="radio" name="exampleRadios" onChange={this.onTrigger} value="CardOnly" />
          <label className="form-check-label" >
            <strong>Credit or debit card</strong>
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="exampleRadios" onChange={this.onTrigger} value="Achonly" />
          <label className="form-check-label" >
            <strong>Bank account</strong>
          </label>
        </div>

      </form>

    </div>
  }
};

