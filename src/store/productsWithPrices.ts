// src/store/slices/productsWithPrices.slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import useAxios from "../helper/useAxios";

// Interfaces for Products With Prices slice
export interface IPriceHistoryData {
  _id: string;
  shopName: string;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;
  createDate: string;
}

interface AddPriceHistoryCredentials {
  productId: string;
  shopName: string;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;
}

interface RemovePriceHistoryCredentials {
  productId: string;
  historyId: string;
}

export interface CreateProductWithPricesCredentials {
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}

interface IUpdateProductData {
  id: string;
  updateData: Partial<{
    name: string;
    description?: string;
    imageUrl?: string;
    category?: string;
  }>;
}

export interface IProductWithPricesData {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: { _id: string; name: string };
  history: IPriceHistoryData[];
  createDate: string;
  updateDate: string;
}

// Thunks
export const getProductsWithPrices = createAsyncThunk<IProductWithPricesData[]>(
  "productsWithPrices/getAll",
  async (_, { rejectWithValue }) => {
    const { getData } = useAxios();
    try {
      const response: { products: IProductWithPricesData[] } = await getData(
        `products-with-prices/getProducts`
      );
      return response.products;
    } catch (error) {
      toast.error("შეცდომაა! პროდუქტების მიღება ვერ მოხერხდა.");
      return rejectWithValue(error);
    }
  }
);

export const getProductById = createAsyncThunk<IProductWithPricesData, string>(
  "productsWithPrices/getById",
  async (id, { rejectWithValue }) => {
    const { getData } = useAxios();
    try {
      const response: { product: IProductWithPricesData } = await getData(
        `products-with-prices/getProduct/${id}`
      );
      return response.product;
    } catch (error) {
      toast.error("შეცდომაა! პროდუქტის მიღება ვერ მოხერხდა.");
      return rejectWithValue(error);
    }
  }
);

export const addProductWithPrices = createAsyncThunk<
  IProductWithPricesData,
  CreateProductWithPricesCredentials
>("productsWithPrices/add", async (credentials, { rejectWithValue }) => {
  const { postData } = useAxios();
  try {
    const response: { product: IProductWithPricesData } = await postData(
      `products-with-prices/addProduct`,
      credentials
    );
    return response.product;
  } catch (error) {
    toast.error("შეცდომაა! პროდუქტის დამატება ვერ მოხერხდა.");
    return rejectWithValue(error);
  }
});

export const updateProductWithPrices = createAsyncThunk<
  IProductWithPricesData,
  IUpdateProductData
>("productsWithPrices/update", async (updateData, { rejectWithValue }) => {
  const { patchRequest } = useAxios();
  try {
    const response: { product: IProductWithPricesData } = await patchRequest(
      `products-with-prices/updateProduct`,
      updateData
    );
    return response.product;
  } catch (error) {
    toast.error("შეცდომაა! პროდუქტის განახლება ვერ მოხერხდა.");
    return rejectWithValue(error);
  }
});

export const removeProductWithPrices = createAsyncThunk<
  { id: string },
  { id: string }
>("productsWithPrices/remove", async ({ id }, { rejectWithValue }) => {
  const { deleteData } = useAxios();
  try {
    await deleteData(`products-with-prices/removeProduct/${id}`);
    return { id };
  } catch (error) {
    toast.error("შეცდომაა! პროდუქტის წაშლა ვერ მოხერხდა.");
    return rejectWithValue(error);
  }
});

export const addPriceHistory = createAsyncThunk<
  { productId: string; history: IPriceHistoryData[] },
  AddPriceHistoryCredentials
>("productsWithPrices/addHistory", async (credentials, { rejectWithValue }) => {
  const { postData } = useAxios();
  try {
    const response: { history: IPriceHistoryData[] } = await postData(
      `products-with-prices/addHistory/${credentials.productId}`,
      {
        shopName: credentials.shopName,
        purchasePrice: credentials.purchasePrice,
        sellingPrice: credentials.sellingPrice,
        description: credentials.description,
      }
    );
    return { productId: credentials.productId, history: response.history };
  } catch (error) {
    toast.error("შეცდომაა! ისტორიის დამატება ვერ მოხერხდა.");
    return rejectWithValue(error);
  }
});

export const removePriceHistory = createAsyncThunk<
  { productId: string; history: IPriceHistoryData[] },
  RemovePriceHistoryCredentials
>(
  "productsWithPrices/removeHistory",
  async ({ productId, historyId }, { rejectWithValue }) => {
    const { deleteData } = useAxios();
    try {
      await deleteData(
        `products-with-prices/removeHistory/${productId}/${historyId}`
      );
      return { productId, history: [] }; // or return some other default value
    } catch (error) {
      toast.error("შეცდომაა! ისტორიის წაშლა ვერ მოახერხდა.");
      return rejectWithValue(error);
    }
  }
);

// Slice state interface
interface ProductsWithPricesState {
  list: IProductWithPricesData[];
  detail: IProductWithPricesData | null;
}

const initialState: ProductsWithPricesState = {
  list: [],
  detail: null,
};

export const productsWithPricesSlice = createSlice({
  name: "productsWithPrices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsWithPrices.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(addProductWithPrices.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProductWithPrices.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.detail?._id === action.payload._id) {
          state.detail = action.payload;
        }
      })
      .addCase(removeProductWithPrices.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload.id);
        if (state.detail?._id === action.payload.id) {
          state.detail = null;
        }
      })
      .addCase(addPriceHistory.fulfilled, (state, action) => {
        if (state.detail && state.detail._id === action.payload.productId) {
          state.detail.history = action.payload.history;
        }
        const idx = state.list.findIndex(
          (p) => p._id === action.payload.productId
        );
        if (idx !== -1) {
          state.list[idx].history = action.payload.history;
        }
      })
      .addCase(removePriceHistory.fulfilled, (state, action) => {
        if (state.detail && state.detail._id === action.payload.productId) {
          state.detail.history = action.payload.history;
        }
        const idx = state.list.findIndex(
          (p) => p._id === action.payload.productId
        );
        if (idx !== -1) {
          state.list[idx].history = action.payload.history;
        }
      });
  },
});

export default productsWithPricesSlice.reducer;
