import React, { Component } from "react";
import CartDataService from "../services/cart.service";

export default class AddCart extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveCart = this.saveCart.bind(this);
    this.newCart = this.newCart.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "", 
      isPaid: false,
      amount: "",

      submitted: false
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeAmount(e) {
    this.setState({
      amount: e.target.value
    });
  }
  saveCart() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      amount: this.state.amount
    };

    CartDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          isPaid: response.data.isPaid,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCart() {
    this.setState({
      id: null,
      title: "",
      description: "",
      isPaid: false,
      amount: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newCart}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Amount</label>
              <input
                type="text"
                className="form-control"
                id="amount"
                required
                value={this.state.amount}
                onChange={this.onChangeAmount}
                name="amount"
              />
            </div>

            <button onClick={this.saveCart} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
