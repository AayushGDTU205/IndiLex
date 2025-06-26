import axios from "axios";

const instance = axios.create({
    baseURL: "https://indilex-backend.onrender.com",
    withCredentials:true
})

export default instance;