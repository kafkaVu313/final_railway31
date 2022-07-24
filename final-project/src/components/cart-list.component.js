import React, { useState, useEffect } from "react";
import CartDataService from "../services/cart.service";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Table, Form } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const CartsList = () => {
  const [Carts, setCarts] = useState([]);
  const [currentCart, setCurrentCart] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  const pageSizes = [4, 6, 8];

  let sumAmount = 0;

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["title"] = searchTitle;
    } else {
      params["title"] = "";
    }

    if (page) {
      params["page"] = parseInt(page) - 1;
    }

    if (pageSize) {
      params["size"] = parseInt(pageSize);
    }

    return params;
  };

  const retrieveCarts = () => {
    const params = getRequestParams(searchTitle, page, pageSize);

    CartDataService.getAll(params)
      .then((response) => {
        const { Carts, totalPages } = response.data;

        setCarts(Carts);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveCarts, [page, pageSize]);

  const refreshList = () => {
    retrieveCarts();
    setCurrentCart(null);
    setCurrentIndex(-1);
  };

  const setActiveCart = (Cart, index) => {
    setCurrentCart(Cart);
    setCurrentIndex(index);
  };

  const payment = (sumAmount) => {

    confirmAlert({
     // title: 'Confirm to payment',
      message: 'Are you sure to payment',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            CartDataService.payAll(sumAmount)
            .then((response) => {
              console.log(response.data);
              refreshList();
            })
            .catch((e) => {
              console.log(e);
            });
          }
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={retrieveCarts}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Carts List</h4>

        <div className="mt-3">
          {"Items per Page: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>

        <ul className="list-group">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Carts &&
                Carts.map((Cart, index) => (
                  sumAmount += Cart.amount,
                  <tr
                    className={
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => setActiveCart(Cart, index)}
                    key={index}
                  >
                    <td>{index + 1}</td>
                    <td>{Cart.title}</td>
                    <td>{Cart.amount} USD</td>
                  </tr>
                ))}
              <tr>
                <td colSpan="2">Sum of Amount</td>
                <td>{sumAmount} USD</td>
              </tr>
            </tbody>
          </Table>
        </ul>
        <div className="payment-type">
          <Form>
            {['radio'].map((type) => (
              <div key={`inline-${type}`} className="mb-3">
                <Form.Check
                  label="Thanh Toán bằng tiền mặt"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check
                  label="Thanh Toán bằng thẻ"
                  name="group1"
                  type={type}
                  id={`inline-${type}-2`}
                />
                <Form.Check
                  label="Thanh toán qua ví shopee"
                  name="group1"
                  type={type}
                  id={`inline-${type}-3`}
                />
              </div>
            ))}
          </Form>

        </div>
        <button  type="button" className="btn btn-primary" onClick={() => payment(sumAmount)}>
      Payment
    </button >
        
      </div>
      <div className="col-md-6">
        {currentCart ? (
          <div>
            <h4>Cart</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentCart.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentCart.description}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentCart.isPaid ? "isPaid" : "Pending"}
            </div>
            <div>
              <label>
                <strong>Image:</strong>
              </label>{" "}
              <img style={{ width: "200px" }} src={currentCart.imgUrl} alt='logo' />
            </div>
            <Link
              to={"/Carts/" + currentCart.id}
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Cart...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartsList;
