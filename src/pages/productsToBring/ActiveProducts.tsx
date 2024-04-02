import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import { ProductStatuses } from "../../constants/product-statuses.constants";
import { getCategories } from "../../store/productsToBring/categories";
import { getPurchaseLocations } from "../../store/productsToBring/locations";
import ProductList from "../../components/productsToBring/product-list";
import { getProducts } from "../../store/productsToBring/products";

export const ActiveProducts = () => {
  const navigate = useNavigate();

  const { activeProducts } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.ProductCategories);
  const { locations } = useAppSelector(
    (state) => state.productPurchaseLocations
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProducts({ productStatus: ProductStatuses.ACTIVE }));
    dispatch(getCategories({}));
    dispatch(getPurchaseLocations({}));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/productsToBring")}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>

        <p
          onClick={() => {
            navigate("/productsToBring/add");
          }}
          className="mr-[10px]  pt-3 cursor-pointer"
        >
          შექმნა
        </p>
      </div>

      <ProductList
        productStatus={ProductStatuses.ACTIVE}
        products={activeProducts}
        categories={categories}
        locations={locations}
      />
    </div>
  );
};

export default ActiveProducts;
