import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { HashRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store as reduxStore } from "./store/reduxStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={reduxStore}>
        <>
          <App />
          <ToastContainer autoClose={3000} hideProgressBar />
        </>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
