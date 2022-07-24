import React, { useState, useEffect } from "react";
import CartDataService from "../services/cart.service";
import { useParams, useNavigate } from 'react-router-dom';

const Cart = (props) => {

  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [currentCart, setcurrentCart] = useState({});
  let idCarts = useParams().id;
  let navigate = useNavigate();

  useEffect(() => {
    getCart(idCarts);
  }, [idCarts]);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  }

  const onChangeDescription = (e) => {
    const description = e.target.value;
    
    setDescription(description);
  }
  
  const onChangeAmount = (e) => {
    const amount = e.target.value;
    
    setAmount(amount);
  }
  const getCart = (id) => {
    CartDataService.get(id)
      .then(response => {
        setId(response.data.id);
        setDescription(response.data.description);
        setTitle(response.data.title);
        setAmount(response.data.amount);
        setIsPaid(response.data.isPaid);
        setcurrentCart(
          {
              id: response.data.id,
              title: response.data.title,
              description: response.data.description,
              isPaid: response.data.isPaid,
              amount: response.data.amount
            }
      )
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const updateisPaid = (status) => {
    var data = {
      id: id,
      title: title,
      description: description,
      isPaid: status,
      amount: amount
    };

    CartDataService.update(id, data)
      .then(response => {
        setIsPaid(response.data.isPaid);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const updateCart = () => {
    const currentCart = {
      id: id,
      title: title,
      description: description,
      isPaid: isPaid,
      amount: amount
    }
    CartDataService.update(
      id,
      currentCart
    )
      .then(response => {
        console.log(response.data);
        setMessage("The Cart was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  }

  const deleteCart = () => {    
    CartDataService.deleteProduct(id)
      .then(response => {
        console.log(response.data);
        return navigate("/home");
        // props.history.push('/home')
      })
      .catch(e => {
        console.log(e);
      });
      // return <Navigate to="/" />;
  }


    return (
      <div>
        {currentCart ? (
          <div className="edit-form">
            <h4>Cart</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentCart.isPaid ? "isPaid" : "Pending"}
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="text"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={onChangeAmount}
                />
              </div>

              
            </form>

            {isPaid ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => updateisPaid(false)}
              >
                UnPay
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => updateisPaid(true)}
              >
                Pay
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={deleteCart}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={updateCart}
            >
              Update
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Cart...</p>
          </div>
        )}
      </div>
    );
}

export default Cart;
