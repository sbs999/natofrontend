// src/pages/AddProductWithPrices.tsx
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useFileUpload } from "../../helper/useFileUpload";
import { useAppDispatch, useAppSelector } from "../../store/reduxStore";
import {
  addProductWithPrices,
  CreateProductWithPricesCredentials,
  IProductWithPricesData,
} from "../../store/productsWithPrices";
import { productFormValidateSchema } from "../../validations";
import Input from "../../Reusable/form/input";
import TextArea from "../../Reusable/form/textArea";
import ReactSelect from "react-select";
import { ReactSelectStyles } from "../../styles";
import { getCategories } from "../../store/productsToBring/categories";
import useAxios from "../../helper/useAxios";

export const AddProductWithPrices: React.FC = (data: {
  product?: IProductWithPricesData;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedFiles,
    uploadFileUrls,
    submitStatus,
    handleFileChange,
    removeImage,
  } = useFileUpload({
    selectedFiles: [],
    uploadFileUrls: [],
  });

  const { getData } = useAxios();

  const { categories } = useAppSelector((state) => state.ProductCategories);
  const [category, setCategory] = useState<string | undefined>();
  const initialValues = {
    name: data?.product?.name || "",
    description: data?.product?.description || "",
  };

  const onSubmit = async (values: typeof initialValues) => {
    const credentials: CreateProductWithPricesCredentials = {
      name: values.name,
      description: values.description,
      imageUrl: uploadFileUrls[0] || undefined,
      category: category,
    };

    const action = await dispatch(addProductWithPrices(credentials));
    if (addProductWithPrices.fulfilled.match(action)) {
      toast.success("პროდუქტი დაემატა");
      navigate("/productsWithPrices", { replace: true });
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!categories?.length) {
      dispatch(getCategories({}));
      getData("products-with-prices/ok");
    }
  }, []);

  return (
    <div className="mx-auto w-[90%] mt-[20px]">
      <button
        onClick={() => navigate("/productsWithPrices", { replace: true })}
        className="border-[1px] bg-[#3498db] p-[10px] rounded-[12px] text-white mb-[20px]"
      >
        უკან გასვლა
      </button>

      <Formik
        initialValues={initialValues}
        validationSchema={productFormValidateSchema}
        onSubmit={onSubmit}
      >
        <Form className="space-y-4">
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
            placeholder="აღწერა"
            type="text"
          />

          <div>
            <label className="text-[19px]" htmlFor={"ადგილი"}>
              კატეგორია:
            </label>
            <ReactSelect
              className="basic-single mb-[25px] mt-[5px] border-black"
              classNamePrefix="select"
              isClearable
              defaultValue={
                data?.product?.category
                  ? {
                      label: data?.product?.category.name,
                      value: data?.product?.category._id,
                    }
                  : null
              }
              onChange={(categoryData) =>
                setCategory(categoryData ? categoryData.value : undefined)
              }
              name="category"
              options={categories.map((category) => ({
                label: category.name,
                value: category._id,
              }))}
              placeholder="კატეგორია"
              styles={ReactSelectStyles}
            />
          </div>

          {/* File Upload Section */}
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

export default AddProductWithPrices;
