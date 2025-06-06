import { useState } from "react";
import {
  ICategoryData,
  IProductData,
  IPurchaseLocationData,
  ProductFormSubmitCredentials,
  ProductsToBringFormValues,
} from "../../interfaces";
import { Formik, Form } from "formik";
import Input from "../../Reusable/form/input";
import ReactSelect from "react-select";
import { ReactSelectStyles } from "../../styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productFormValidateSchema } from "../../validations";
import TextArea from "../../Reusable/form/textArea";
import { ProductTypes } from "../../constants/productTypes.constants";
import { useFileUpload } from "../../helper/useFileUpload";

export const ProductForm = ({
  categories,
  locations,
  product,
  onSubmit,
  productType,
}: {
  categories: ICategoryData[];
  locations: IPurchaseLocationData[];
  product?: IProductData;
  onSubmit: (
    credentials: ProductFormSubmitCredentials
  ) => Promise<{ payload: object }>;
  productType?: ProductTypes;
}) => {
  const { uploadFileUrls, handleFileChange, selectedFiles, removeImage } =
    useFileUpload({
      selectedFiles: product?.imageUrls || [],
      uploadFileUrls: product?.imageUrls || [],
    });

  const [category, setCategory] = useState<string | null>();
  const [productPurchaseLocations, setProductPurchaseLocations] = useState<
    string[]
  >([]);
  const [submitStatus, setSubmitStatus] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values: ProductsToBringFormValues) => {
    setSubmitStatus(true);

    const result = await onSubmit({
      ...values,
      ...(category ? { category } : {}),
      purchaseLocations: productPurchaseLocations,
      imageUrls: uploadFileUrls,
    });

    if (result.payload) {
      toast.success("წარმატებით აიტვირთა პროდუქტი.");
      if (!product) {
        if (productType === ProductTypes.BOOK) {
          navigate("/productsToBring/books");
        } else {
          navigate("/productsToBring/active-products");
        }
      } else {
        navigate(-1);
      }
    }
    setSubmitStatus(false);
  };

  return (
    <div className="mx-auto w-[90%] mt-[20px]">
      <Formik
        initialValues={{
          name: product?.name || "",
          description: product?.description || "",
        }}
        onSubmit={submitHandler}
        validationSchema={productFormValidateSchema}
      >
        <Form>
          <Input
            label="დასახელება"
            name="name"
            id="name"
            type="text"
            placeholder="სახელი"
          />
          <TextArea
            label="აღწერა"
            name="description"
            id="description"
            type="text"
            placeholder="აღწერა"
          />

          {locations?.length ? (
            <div>
              <label className="text-[19px]" htmlFor={"ადგილი"}>
                ადგილი:
              </label>
              <ReactSelect
                isMulti
                defaultValue={
                  product?.purchaseLocations
                    ? product.purchaseLocations.map((location) => ({
                        label: location.name,
                        value: location._id,
                      }))
                    : null
                }
                name="colors"
                id="ადგილი"
                options={locations.map((location) => ({
                  label: location.name,
                  value: location._id,
                }))}
                className="basic-multi-select mb-[25px] mt-[5px]"
                classNamePrefix="select"
                placeholder="ადგილი"
                onChange={(productPurchaseLocations) =>
                  setProductPurchaseLocations(
                    productPurchaseLocations.map((data) => data.value)
                  )
                }
                styles={ReactSelectStyles}
              />
            </div>
          ) : null}

          <div>
            <label className="text-[19px]" htmlFor={"ადგილი"}>
              კატეგორია:
            </label>
            <ReactSelect
              className="basic-single mb-[25px] mt-[5px] border-black"
              classNamePrefix="select"
              isClearable
              defaultValue={
                product?.category
                  ? {
                      label: product?.category.name,
                      value: product?.category._id,
                    }
                  : null
              }
              onChange={(categoryData) =>
                setCategory(categoryData ? categoryData.value : null)
              }
              name="category"
              options={categories.map((category) => ({
                label: category.name,
                value: category._id,
              }))}
              placeholder="კატეგორია"
              styles={ReactSelectStyles}
              required={productType === ProductTypes.BOOK}
            />
          </div>

          <div className="mt-[5px] mb-[10px] flex justify-center items-center">
            <div className="w-[90%]">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div className="flex flex-col text-center items-center justify-center pt-2 pb-2">
                    <svg
                      className="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>

                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                      დააჭირეთ რომ ატვირთოთ ფოტო
                    </p>
                  </div>
                  <input
                    onChange={handleFileChange}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-3 mb-2">
            {selectedFiles.length ? (
              selectedFiles.map((file, index) => {
                return (
                  <div
                    key={index}
                    className="relative w-48 flex flex-col items-end"
                  >
                    <div
                      className="bg-red-500 text-white rounded-full mb-[1px] px-[4px] py-[1px] z-10"
                      onClick={() => removeImage(index)}
                    >
                      წაშლა
                    </div>
                    <img
                      alt="not found"
                      className="w-full"
                      src={
                        typeof file === "string"
                          ? file
                          : URL.createObjectURL(file)
                      }
                    />
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>

          <div className="grid place-content-center">
            <button
              disabled={submitStatus}
              type="submit"
              className="relative border-[1px] bg-[#2ecc71] w-[220px] h-[50px] rounded-[12px] text-white flex justify-center items-center overflow-hidden"
            >
              {submitStatus ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  იტვირთება
                </>
              ) : (
                "შენახვა"
              )}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProductForm;
