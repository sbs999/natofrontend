import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import {
  getProductById,
  removeProductWithPrices,
  addPriceHistory,
  removePriceHistory,
  IPriceHistoryData,
} from "../../store/productsWithPrices";
import { toast } from "react-toastify";

const ProductWithPricesDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.productWithPrices.detail);

  const [shopName, setShopName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }
  }, [productId]);

  const handleRemoveProduct = async () => {
    if (!product) {
      return;
    }
    await dispatch(removeProductWithPrices({ id: product._id })).unwrap();
    navigate(-1);
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    if (!product) {
      return;
    }
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(
        addPriceHistory({
          productId: product._id,
          shopName,
          purchasePrice,
          sellingPrice,
          description,
        })
      ).unwrap();
      setShopName("");
      setSellingPrice(0);
      setPurchasePrice(0);
      setDescription("");
    } catch {
      toast.error("შეცდომაა, სცადეთ თავიდან!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveHistory = async (historyId: string) => {
    if (!product) {
      return;
    }
    try {
      await dispatch(
        removePriceHistory({ productId: product._id, historyId })
      ).unwrap();

      dispatch(getProductById(product._id));
    } catch {
      toast.error("შეცდომაა, სცადეთ თავიდან!");
    }
  };

  return !product ? (
    <></>
  ) : (
    <div className="mx-auto w-[90%] mt-[20px]">
      <button
        onClick={() => navigate(-1)}
        className="border bg-[#3498db] p-2 rounded text-white mb-4"
      >
        უკან გასვლა
      </button>

      <div className="border p-4 rounded mb-6">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="mb-4 max-w-xs"
          />
        )}
        {product.description && (
          <p className="text-gray-700 mb-2">
            დამატებითი ინფორმაცია: {product.description}
          </p>
        )}
        {product.category && (
          <p className="text-gray-600 mb-2">
            კატეგორია: {product.category.name}
          </p>
        )}
        <p className="text-gray-500 text-sm mb-2">
          შექმნის თარიღი: {new Date(product.createDate).toLocaleDateString()}
        </p>
        <button
          onClick={handleRemoveProduct}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          წაშლა
        </button>
      </div>

      <div className="border p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">ისტორია</h2>
        <form onSubmit={handleAddHistory} className="grid gap-2 mb-4">
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="მაღაზიის დასახელება"
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={sellingPrice === 0 ? "" : sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            placeholder="გასაყიდი ფასი"
            defaultValue={undefined}
            min="0.05"
            step="0.05"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            min="0.05"
            step="0.05"
            value={purchasePrice || ""}
            onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
            placeholder="შესასყიდი ფას(ი)"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="დატებითი ინფორმაცია"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#2ecc71] text-white p-2 rounded"
          >
            {submitting ? "იტვირთება..." : "ისტორიაში დამატება"}
          </button>
        </form>

        <ul className="space-y-2">
          {product.history.map((h: IPriceHistoryData) => (
            <li
              key={h._id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{h.shopName}</p>
                <p>შესყიდვის ფასი: {h.purchasePrice}</p>
                <p>გასაყიდი ფასი: {h.sellingPrice}</p>

                {h.description && (
                  <p className="text-sm">
                    დამატებითი იმფორმაცია: {h.description}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  {`${new Date(h.createDate).getDate()}/${
                    new Date(h.createDate).getMonth() + 1
                  }/${new Date(h.createDate).getFullYear()}`}
                </p>
              </div>
              <button
                onClick={() => handleRemoveHistory(h._id)}
                className="text-red-500"
              >
                წაშლა
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductWithPricesDetail;
