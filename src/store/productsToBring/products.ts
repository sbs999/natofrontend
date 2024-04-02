import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateProductCredentials,
  IProductData,
  IUpdateProductData,
} from "../../interfaces";
import useAxios from "../../helper/useAxios";
import { toast } from "react-toastify";
import { ProductStatuses } from "../../constants/product-statuses.constants";

export const getProducts = createAsyncThunk(
  "products-to-bring/products",
  async (value: { productStatus: ProductStatuses }) => {
    const { getData } = useAxios();

    try {
      const productsData: { products: IProductData[] } = await getData(
        `products-to-bring/products?status=${value.productStatus}`
      );

      return {
        products: productsData.products,
        productStatus: value.productStatus,
      };
    } catch {
      toast.error("შეცდომაა! თავიდან შემოდით!");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products-to-bring/product/create",
  async (value: CreateProductCredentials) => {
    const { postData } = useAxios();

    try {
      const result: { message: string; product: IProductData } = await postData(
        `products-to-bring/product`,
        value
      );

      return result.product;
    } catch {
      toast.error("შეცდომაა! პროდუქტი ვერ შეიქმნა!");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products-to-bring/product/update",
  async (value: IUpdateProductData) => {
    const { patchRequest } = useAxios();

    try {
      const result: { message: string; product: IProductData } =
        await patchRequest(`products-to-bring/product`, value);

      return {
        product: result.product,
        oldStatus: value.productStatus,
        updatedData: value.updateData,
      };
    } catch {
      toast.error("შეცდომაა! პროდუქტი ვერ განახლდა!");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products-to-bring/product/delete",
  async (value: { id: string }) => {
    const { deleteData } = useAxios();

    try {
      await deleteData(`products-to-bring/product/${value.id}`);

      return { id: value.id };
    } catch {
      toast.error("შეცდომაა! პროდუქტი ვერ წაიშალა!");
    }
  }
);

const initialState: {
  activeProducts: IProductData[];
  removeProducts: IProductData[];
  doneProducts: IProductData[];
} = {
  activeProducts: [],
  removeProducts: [],
  doneProducts: [],
};

export const ProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        if (action.payload) {
          switch (action.payload.productStatus) {
            case ProductStatuses.BROUGHT:
              state.doneProducts = action.payload.products;
              break;
            case ProductStatuses.ACTIVE:
              state.activeProducts = action.payload.products;
              break;
            case ProductStatuses.REMOVED:
              state.removeProducts = action.payload.products;
              break;
          }
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        console.error("Failed Fetching done Products.");
        state.activeProducts = [];
      });

    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProducts.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        console.error("Failed Creating Product.");
      });

    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload) {
          console.log("action.payload)", action.payload);
          let productIndex;
          if (!action.payload.updatedData?.status) {
            switch (action.payload.product.status) {
              // if status is not updated. just update the product in the same list as it was.
              case ProductStatuses.ACTIVE:
                productIndex = state.activeProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.activeProducts[productIndex] = action.payload.product;
                }
                break;
              case ProductStatuses.BROUGHT:
                productIndex = state.activeProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.activeProducts[productIndex] = action.payload.product;
                }
                break;
              case ProductStatuses.REMOVED:
                productIndex = state.removeProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.removeProducts[productIndex] = action.payload.product;
                }
                break;
            }
          } else {
            switch (action.payload.oldStatus) {
              // If status updated, remove from previous list
              case ProductStatuses.ACTIVE:
                productIndex = state.activeProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.activeProducts.splice(productIndex, 1);
                }
                break;
              case ProductStatuses.BROUGHT:
                productIndex = state.doneProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.doneProducts.splice(productIndex, 1);
                }
                break;
              case ProductStatuses.REMOVED:
                productIndex = state.removeProducts.findIndex(
                  (product) => product._id === action.payload?.product._id
                );
                if (productIndex !== -1) {
                  state.removeProducts.splice(productIndex, 1);
                }
                break;
            }

            switch (action.payload.product.status) {
              // If status updated, add product in new list
              case ProductStatuses.ACTIVE:
                state.activeProducts.unshift(action.payload.product);
                break;
              case ProductStatuses.BROUGHT:
                state.doneProducts.unshift(action.payload.product);
                break;
              case ProductStatuses.REMOVED:
                state.removeProducts.unshift(action.payload.product);
                break;
            }
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        console.error("Failed Updating Product.");
      });

    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        if (action.payload) {
          const productIndex = state.activeProducts.findIndex(
            (location) => location._id === action.payload?.id
          );

          if (productIndex !== -1) {
            state.activeProducts.splice(productIndex, 1);
          }
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        console.error("Failed Deleting Product.");
      });
  },
});

export default ProductsSlice.reducer;
