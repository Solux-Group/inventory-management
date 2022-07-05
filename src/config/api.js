import axios from "axios";

// export const ENDPOINT = "https://inventory-mern-app.herokuapp.com";
// export const ENDPOINT = process.env.API_ENDPOINT || "http://localhost:5000";
export const ENDPOINT = process.env.API_ENDPOINT;

export default axios.create({
  baseURL: ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});
