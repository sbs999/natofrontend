import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import useAxios from "../../helper/useAxios";
import {
  ICategoryData,
  ICreateProductCategoryCredentials,
  IUpdateProductCategoryCredentials,
} from "../../interfaces";
import { toast } from "react-toastify";

export const getCategories = createAsyncThunk(
  "products-to-bring/categories",
  async (value: {}) => {
    const { getData } = useAxios();

    try {
      const categoriesData: { categories: ICategoryData[] } = await getData(
        `products-to-bring/categories`
      );

      return categoriesData.categories;
    } catch {
      toast.error("შეცდომაა! თავიდან შემოდით!");
    }
  }
);

export const createCategory = createAsyncThunk(
  "products-to-bring/category/create",
  async (value: ICreateProductCategoryCredentials) => {
    const { postData } = useAxios();

    try {
      const result: { message: string; category: ICategoryData } =
        await postData(`products-to-bring/category`, value);

      return result.category;
    } catch {
      toast.error("შეცდომაა! კატეგორია ვერ შეიქმნა!");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "products-to-bring/category/update",
  async (value: IUpdateProductCategoryCredentials) => {
    const { patchRequest } = useAxios();

    try {
      const result: { message: string; category: ICategoryData } =
        await patchRequest(`products-to-bring/category`, value);

      return result.category;
    } catch {
      toast.error("შეცდომაა! კატეგორია ვერ განახლდა!");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "products-to-bring/category/delete",
  async (value: { id: string }) => {
    const { deleteData } = useAxios();

    try {
      await deleteData(`products-to-bring/category/${value.id}`);

      return { id: value.id };
    } catch {
      toast.error("შეცდომაა! კატეგორია ვერ წაიშალა!");
    }
  }
);

const initialState: { categories: ICategoryData[] } = {
  categories: [],
};

export const productsCategorySlice = createSlice({
  name: "productCategories",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories = action.payload;
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categories = [];
      });

    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories.unshift(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        console.log("Failed Creating Category.");
      });

    builder
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload) {
          const categoryIndex = state.categories.findIndex(
            (location) => location._id === action.payload?._id
          );

          if (categoryIndex !== -1) {
            state.categories[categoryIndex] = action.payload;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        console.error("Failed Updating Category.");
      });

    builder
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload) {
          const categoryIndex = state.categories.findIndex(
            (location) => location._id === action.payload?.id
          );

          if (categoryIndex !== -1) {
            state.categories.splice(categoryIndex, 1);
          }
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        console.error("Failed Deleting Category.");
      });
  },
});

export default productsCategorySlice.reducer;
