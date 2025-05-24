import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/main";
import AddPerson from "./pages/AddPerson";
import EachPerson from "./pages/EachPerson";
import HistoryForm from "./components/addPerson/historyForm";
import UpdatePerson from "./pages/UpdatePerson";
import { useAppSelector, useAppDispatch } from "./store/reduxStore";
import Security from "./pages/Security";
import { getPersons as fetchPersons, login, logOut } from "./store/debts";
import { getHistoryPersons } from "./store/history";
import Statistics from "./pages/Statistics";
import Note from "./pages/Note";
import AddProduct from "./pages/productsToBring/AddProduct";
import ProductsToBringIntro from "./pages/productsToBring/Intro";
import CategoriesPage from "./pages/productsToBring/categories";
import PurchaseLocations from "./pages/productsToBring/purchaseLocations";
import ActiveProducts from "./pages/productsToBring/ActiveProducts";
import EditProduct from "./pages/productsToBring/EditProduct";
import DoneProducts from "./pages/productsToBring/doneProducts";
import RemoveProducts from "./pages/productsToBring/removeProducts";
import Books from "./pages/productsToBring/Books";

function App() {
  const { userStatus } = useAppSelector((state) => state.persons);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("mixToken")) {
      dispatch(fetchPersons({}));
      dispatch(getHistoryPersons({}));
    }
  }, [userStatus]);
  // auth

  useEffect(() => {
    if (localStorage.getItem("mixToken")) {
      dispatch(login());
    } else {
      dispatch(logOut());
    }
  }, []);

  const authCheck = localStorage.getItem("mixToken") && userStatus;

  return (
    <div className="mb-[10px]">
      <Routes>
        <Route path="/" element={authCheck ? <Main /> : <Security />} />
        <Route
          path="/person/:personId"
          element={authCheck ? <EachPerson /> : <Security />}
        />
        <Route
          path="/addPerson"
          element={authCheck ? <AddPerson /> : <Security />}
        />
        <Route
          path="/statistics"
          element={authCheck ? <Statistics /> : <Security />}
        />
        <Route path="/notes" element={authCheck ? <Note /> : <Security />} />
        <Route
          path="/addPerson/:historyId"
          element={authCheck ? <HistoryForm /> : <Security />}
        />
        <Route
          path="/updatePersonInfo/:personId"
          element={authCheck ? <UpdatePerson /> : <Security />}
        />
        <Route
          path="/productsToBring"
          element={authCheck ? <ProductsToBringIntro /> : <Security />}
        />
        <Route
          path="/productsToBring/categories"
          element={authCheck ? <CategoriesPage /> : <Security />}
        />
        <Route
          path="/productsToBring/locations"
          element={authCheck ? <PurchaseLocations /> : <Security />}
        />
        <Route
          path="/productsToBring/add"
          element={authCheck ? <AddProduct /> : <Security />}
        />
        <Route
          path="/productsToBring/active-products"
          element={authCheck ? <ActiveProducts /> : <Security />}
        />
        <Route
          path="/productsToBring/books"
          element={authCheck ? <Books /> : <Security />}
        />
        <Route
          path="/productsToBring/edit/:productId"
          element={authCheck ? <EditProduct /> : <Security />}
        />
        <Route
          path="/productsToBring/done-products"
          element={authCheck ? <DoneProducts /> : <Security />}
        />
        <Route
          path="/productsToBring/remove-products"
          element={authCheck ? <RemoveProducts /> : <Security />}
        />
      </Routes>
    </div>
  );
}

export default App;
