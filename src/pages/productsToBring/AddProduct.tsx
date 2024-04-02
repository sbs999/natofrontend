import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import { getCategories } from "../../store/productsToBring/categories";
import { getPurchaseLocations } from "../../store/productsToBring/locations";
import { ProductForm } from "../../components/productsToBring";
import { createProduct } from "../../store/productsToBring/products";
import { ProductFormSubmitCredentials } from "../../interfaces";

export const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.ProductCategories);
  const { locations } = useAppSelector(
    (state) => state.productPurchaseLocations
  );

  useEffect(() => {
    dispatch(getCategories({}));
    dispatch(getPurchaseLocations({}));
  }, []);

  const onSubmit = async (credentials: ProductFormSubmitCredentials) => {
    const result = await dispatch(createProduct(credentials));
    return result as { payload: object };
  };

  return (
    <div className="">
      <button
        onClick={() => navigate(-1)}
        type="submit"
        className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
      >
        უკან გასვლა
      </button>

      <div className="mx-auto w-[90%] mt-[20px]">
        <ProductForm
          onSubmit={onSubmit}
          categories={categories}
          locations={locations}
        />
      </div>
    </div>
  );
};

export default AddProduct;
