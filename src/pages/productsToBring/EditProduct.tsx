import { useEffect, useState } from "react";
import useAxios from "../../helper/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import { getCategories } from "../../store/productsToBring/categories";
import { getPurchaseLocations } from "../../store/productsToBring/locations";
import { toast } from "react-toastify";
import { ProductForm } from "../../components/productsToBring";
import { updateProduct } from "../../store/productsToBring/products";
import { ProductFormSubmitCredentials } from "../../interfaces";

export const EditProduct = () => {
  const [product, setProduct] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.ProductCategories);
  const { locations } = useAppSelector(
    (state) => state.productPurchaseLocations
  );
  const { productId } = useParams();
  const { getData } = useAxios();

  useEffect(() => {
    if (!categories?.length) {
      dispatch(getCategories({}));
    }
    if (!locations?.length) {
      dispatch(getPurchaseLocations({}));
    }
  }, []);

  useEffect(() => {
    (async () => {
      await findProduct();
    })();
  }, [productId]);

  const onSubmit = async (credentials: ProductFormSubmitCredentials) => {
    const result = await dispatch(
      updateProduct({
        productId: productId as string,
        updateData: credentials,
        productStatus: product?.status,
      })
    );

    return result as { payload: object };
  };

  const findProduct = async () => {
    try {
      const productData = await getData(
        `products-to-bring/product/${productId}`
      );
      setProduct(productData.product);
    } catch (error) {
      toast.error("პროდუქტი ვერ მოიძებნა.");
    }
  };

  if (!product) {
    return (
      <div>
        {" "}
        <button
          onClick={() => navigate(-1)}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>
        <p>პროდუქტი ვერ მოიძებნა.</p>
      </div>
    );
  }

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
          product={product}
        />
      </div>
    </div>
  );
};

export default EditProduct;
