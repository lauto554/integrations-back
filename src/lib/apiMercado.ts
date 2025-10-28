import axios from "axios";

const apiMercado = axios.create({
  baseURL: process.env.API_URL_MERCADOPAGO,
});

export default apiMercado;
