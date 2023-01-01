import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter,HashRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Store from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Store>
      <>
    <App />
    <ToastContainer  autoClose={3000} hideProgressBar />
    </>
    </Store>
    </BrowserRouter>
  </React.StrictMode>
);
