import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import { ProductTypes } from "../../constants/productTypes.constants";
import { bookCategoriesIds } from "../../constants/book-categories.constants";
import { getProducts } from "../../store/productsToBring/products";
import { getPurchaseLocations } from "../../store/productsToBring/locations";
import { getCategories } from "../../store/productsToBring/categories";
import { ProductStatuses } from "../../constants/product-statuses.constants";
import ProductList from "../../components/productsToBring/product-list";

export const Books = () => {
  const navigate = useNavigate();

  const { activeProducts } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.ProductCategories);
  const books = activeProducts?.filter((product) =>
    bookCategoriesIds.includes(product?.category?._id)
  );
  const bookCategories = categories.filter((category) =>
    bookCategoriesIds.includes(category._id)
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
        {/*  */}
        <button
          onClick={() => navigate("/productsToBring")}
          type="submit"
          className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mt-[10px] ml-[10px]"
        >
          უკან გასვლა
        </button>
        {/*  */}

        {/*  */}
        <p
          onClick={() => {
            navigate(`/productsToBring/add/?type=${ProductTypes.BOOK}`);
          }}
          className="mr-[10px]  pt-3 cursor-pointer"
        >
          შექმნა
        </p>
      </div>

      {/*  */}

      <ProductList
        productStatus={ProductStatuses.ACTIVE}
        products={books}
        categories={bookCategories}
        locations={[]}
        productType={ProductTypes.BOOK}
      />
    </div>
  );
};

export default Books;
