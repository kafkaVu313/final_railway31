import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api";


const getAll = (params) => {
    return axios.get(API_URL + "/carts?title=" + params.title + "&page=" + params.page+ "&size=" + params.size, { headers: authHeader() });
  };


  const get = (id) => {
    return axios.get(API_URL + `/carts/${id}`, { headers: authHeader() });
  }

  const create = (data) => {
    return axios.post(API_URL + "/carts", data, { headers: authHeader() });
  }

  const update = (id, data) => {
    return axios.put(API_URL + `/carts/${id}`, data, { headers: authHeader() });
  }

  const deleteProduct = (id) => {
    return axios.delete(API_URL + `/carts/${id}`, { headers: authHeader() });
  }

  const payAll = (sumAmount) => {
    const data = {};
    return axios.put(API_URL + `/payment/${sumAmount}`, data, { headers: authHeader() });
  }

  const findByTitle = (title) => {
    return axios.get(API_URL + `/carts?title=${title}`, { headers: authHeader() });
  }

  export default {
    getAll,
    get,
    create,
    update,
    deleteProduct,
    payAll,
    findByTitle,
  };