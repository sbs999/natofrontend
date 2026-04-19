import React from "react";
import axios from "axios";

const useAxios = () => {
  // Dev: REACT_APP_BACKEND_URL in .env.development → talk to API directly (no CRA proxy).
  // Dev with empty URL → same-origin; setupProxy.js forwards to Render.
  const devBase = (process.env.REACT_APP_BACKEND_URL || "")
    .trim()
    .replace(/\/$/, "");
  const backendUrl =
    process.env.NODE_ENV === "development"
      ? devBase || ""
      : "https://natobackend.onrender.com";

  const postData = async (url: string, data: object) => {
    const token = localStorage.getItem("mixToken");
    const header = { headers: { Authorization: token } };

    const api = await axios.post(`${backendUrl}/${url}`, data, header);
    return api.data;
  };
  const getData = async (url: string) => {
    const token = localStorage.getItem("mixToken");
    const header = { headers: { Authorization: token } };
    const api = await axios.get(`${backendUrl}/${url}`, header);
    return api.data;
  };
  const deleteData = async (url: string) => {
    const token = localStorage.getItem("mixToken");
    const header = { headers: { Authorization: token } };
    await axios.delete(`${backendUrl}/${url}`, header);
  };
  const patchRequest = async (url: string, data: object) => {
    const token = localStorage.getItem("mixToken");
    const header = { headers: { Authorization: token } };
    const api = await axios.patch(`${backendUrl}/${url}`, data, header);
    return api.data;
  };

  return { postData, getData, deleteData, patchRequest };
};

export default useAxios;
