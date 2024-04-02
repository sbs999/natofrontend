import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  ICategoryData,
  IProductData,
  IPurchaseLocationData,
} from "../../interfaces";
import { ReactSelectStyles } from "../../styles";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/reduxStore";
import { updateProduct } from "../../store/productsToBring/products";
import { ProductStatuses } from "../../constants/product-statuses.constants";

const ProductList = ({
  categories,
  locations,
  products,
  productStatus,
}: {
  categories: ICategoryData[];
  locations: IPurchaseLocationData[];
  products: IProductData[];
  productStatus: ProductStatuses;
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<{
    label: string;
    value: string;
  } | null>();
  const [filterLocations, setFilterLocations] = useState<
    | {
        label: string;
        value: string;
      }[]
    | []
  >([]);
  const [state, setState] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clearFilter = () => {
    setSearch("");
    setCategory(null);
    setFilterLocations([]);
  };

  const deleteProductHandle = async (id: string) => {
    await dispatch(
      updateProduct({
        productId: id,
        productStatus: ProductStatuses.ACTIVE,
        updateData: { status: ProductStatuses.REMOVED },
      })
    );

    setSelectedProduct(null);
  };

  const doneProductHandle = async (id: string) => {
    await dispatch(
      updateProduct({
        productId: id,
        productStatus: ProductStatuses.ACTIVE,
        updateData: { status: ProductStatuses.BROUGHT },
      })
    );

    setSelectedProduct(null);
  };

  const MoveToActiveList = async (id: string) => {
    await dispatch(
      updateProduct({
        productId: id,
        productStatus: selectedProduct.status,
        updateData: { status: ProductStatuses.ACTIVE },
      })
    );

    setSelectedProduct(null);
  };

  useEffect(() => {
    setState(products);
  }, [products]);

  useEffect(() => {
    let result = products;

    if (category) {
      result = result.filter(
        (product) => product?.category?._id === category.value
      );
    }

    if (filterLocations.length) {
      result = result.filter(
        (product) =>
          filterLocations.filter((locationData) =>
            product.purchaseLocations.some(
              (location) => location?._id === locationData.value
            )
          ).length
      );
    }

    if (search) {
      result = result.filter((a) =>
        [a.name, a.description]
          .join("")
          .toLowerCase()
          .includes(search.toString().toLocaleLowerCase().split(" ").join(""))
      );
    }

    setState(result);
  }, [search, category, filterLocations]);

  return (
    <div>
      <div>
        <div className="w-[90%] mx-auto mt-3 border-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[1px]  px-[10px] py-[10px] w-[100%] rounded-[10px] border-black"
            placeholder="გაფილტვრა"
          />

          <ReactSelect
            className="basic-single mt-[5px] border-black"
            classNamePrefix="select"
            onChange={(categoryData) => setCategory(categoryData)}
            name="color"
            options={categories.map((category) => ({
              label: category.name,
              value: category._id,
            }))}
            value={category}
            isClearable={true}
            placeholder="კატეგორია"
            styles={ReactSelectStyles}
          />

          <ReactSelect
            isMulti
            name="colors"
            id="ლოკაცია"
            options={locations.map((category) => ({
              label: category.name,
              value: category._id,
            }))}
            className="basic-multi-select  mt-[5px]"
            classNamePrefix="select"
            placeholder="ლოკაცია"
            onChange={(productPurchaseLocations) =>
              setFilterLocations(productPurchaseLocations.map((data) => data))
            }
            value={filterLocations}
            styles={ReactSelectStyles}
          />

          <div>
            <p
              onClick={clearFilter}
              className="text-[15px]  text-end mt-2 cursor-pointer text-gray-800 mr-1"
            >
              ფილტრის გასუფთავება
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-4">
          {state.map((product) => (
            <div
              key={product._id}
              className="border border-black px-4 py-[2px] rounded-lg cursor-pointer hover:shadow-lg text-[20px]"
              onClick={() => setSelectedProduct(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
        {selectedProduct && (
          <ProductModal
            onEditHandle={(id: string) =>
              navigate(`/productsToBring/edit/${id}`)
            }
            onDelete={deleteProductHandle}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onDone={
              productStatus === ProductStatuses.ACTIVE
                ? doneProductHandle
                : MoveToActiveList
            }
            productStatus={productStatus}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;

const ProductModal = ({
  product,
  onClose,
  onDelete,
  onDone,
  onEditHandle,
  productStatus,
}: {
  product: IProductData;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onDone: (id: string) => Promise<void>;
  onEditHandle: (id: string) => void;
  productStatus: ProductStatuses;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      return product.imageUrls
        ? prevIndex === product.imageUrls?.length - 1
          ? 0
          : prevIndex + 1
        : 0;
    });
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (product.imageUrls?.length || 0) - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto  px-3 border shadow-lg rounded-md bg-white w-11/12 md:w-9/12 lg:w-5/6 xl:w-4/5 2xl:w-3/4"
        style={{ maxWidth: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-0 mt-1 mr-1 text-gray-700 hover:text-gray-900 transition-colors duration-150"
          onClick={onClose}
        >
          <MdClose color="red" size="33" />
        </button>

        <button
          className="absolute top-0 left-0 mt-1 ml-2 text-gray-700 hover:text-gray-900 transition-colors duration-150"
          onClick={() => onEditHandle(product._id)}
        >
          <FiEdit size="30" />
        </button>

        <div className="mt-7">
          <p className=" leading-6 font-medium text-gray-900 text-center text-[21px]">
            {product.name}
          </p>
          <div className="mt-2 py-3 ">
            {product.description && (
              <p className=" text-gray-500 text-[17px]">
                <span className="font-medium text-gray-900 ">აღწერა: </span>
                {product.description}.
              </p>
            )}
            {product.category ? (
              <p className="text-gray-500 text-[17px]">
                <span className="font-medium text-gray-900 ">კატეგორია: </span>
                {product.category.name}.
              </p>
            ) : (
              ""
            )}

            {product.purchaseLocations?.length ? (
              <p className=" text-gray-500 text-[17px]">
                <span className="font-medium text-gray-900 ">ლოკაციები: </span>
                {product.purchaseLocations
                  .map((location) => location.name)
                  .join(", ")}
                .
              </p>
            ) : (
              ""
            )}

            <div className="mt-4 relative">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <>
                  {product.imageUrls?.length > 1 ? (
                    <div className="w-[90%] mx-auto">
                      {`${currentImageIndex + 1} / ${product.imageUrls.length}`}
                    </div>
                  ) : (
                    ""
                  )}

                  <img
                    src={product.imageUrls[currentImageIndex]}
                    alt="Product"
                    width="80%"
                    style={{ maxHeight: "400px" }}
                    className="max-w-xs  mx-auto"
                  />
                  {product.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute top-1/2 left-[-10px] transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full focus:outline-none"
                      >
                        <MdChevronLeft size="24" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-[-10px] transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full focus:outline-none"
                      >
                        <MdChevronRight size="24" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex justify-evenly items-center mb-1">
            {productStatus === ProductStatuses.ACTIVE ? (
              <>
                <button
                  className="text-white bg-green-500 hover:bg-green-700 focus:outline-none font-bold py-2 px-3 rounded text-[18px]"
                  onClick={() => onDone(product._id)}
                >
                  მოტანილია
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-700 focus:outline-none font-bold py-2 px-3 rounded"
                  onClick={() => onDelete(product._id)}
                >
                  წაშლა
                </button>
              </>
            ) : (
              <button
                className="text-white bg-green-500 hover:bg-green-700 focus:outline-none font-bold py-2 px-3 rounded"
                onClick={() => onDone(product._id)}
              >
                მოსატანში გადატანა
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
