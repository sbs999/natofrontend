// src/pages/ManageProductsWithPrices.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import {
  getProductsWithPrices,
  IProductWithPricesData,
} from "../../store/productsWithPrices";
import { getCategories } from "../../store/productsToBring/categories";
import { ReactSelectStyles } from "../../styles";

const ManageProductsWithPricesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const products = useAppSelector((state) => state.productWithPrices.list);
  const categories = useAppSelector(
    (state) => state.ProductCategories.categories
  );

  // Local filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [sortByDate, setSortByDate] = useState(false);
  const [filtered, setFiltered] = useState<IProductWithPricesData[]>([]);

  // Fetch on mount
  useEffect(() => {
    dispatch(getProductsWithPrices());
    dispatch(getCategories({}));
  }, []);

  // Apply filters
  useEffect(() => {
    let list = [...products];
    if (categoryFilter) {
      list = list.filter((p) => p.category?._id === categoryFilter.value);
    }
    if (search) {
      const q = search.toLowerCase().replace(/\s+/g, "");
      list = list.filter((p) =>
        (p.name + (p.description || "")).toLowerCase().includes(q)
      );
    }
    if (sortByDate) {
      list.sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
    }
    setFiltered(list);
  }, [products, categoryFilter, search, sortByDate]);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter(null);
    setSortByDate(false);
  };

  return (
    <div className="mx-auto w-[90%] mt-[20px]">
      <button
        onClick={() => navigate(-1)}
        className="border bg-[#3498db] p-2 rounded text-white mb-2"
      >
        უკან გასვლა
      </button>
      <button
        onClick={() => navigate("/productsWithPrices/addProduct")}
        className="border bg-[#3498db] p-2 rounded text-white ml-2 mb-4"
      >
        პროდუქტის დამატება
      </button>

      {/* Filters */}
      <div className="grid gap-2 md:grid-cols-3 mb-4">
        <input
          type="text"
          placeholder="გაფილტვრა"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <ReactSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categories.map((c) => ({ label: c.name, value: c._id }))}
          placeholder="კატეგორია"
          styles={ReactSelectStyles}
          isClearable
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={sortByDate}
            onChange={(e) => setSortByDate(e.target.checked)}
            className="mr-2"
          />
          თარიღით
        </label>
      </div>
      <p
        onClick={clearFilters}
        className="text-right text-sm text-gray-600 cursor-pointer mb-2"
      >
        ფილტრის გასუფთავება
      </p>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="border p-1 rounded cursor-pointer hover:shadow"
            onClick={() => navigate(`/productsWithPrices/${p._id}`)}
          >
            <h3 className="font-bold mb-2">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.category?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProductsWithPricesList;
