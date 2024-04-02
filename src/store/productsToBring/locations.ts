import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import useAxios from "../../helper/useAxios";
import {
  ICreateProductPurchaseLocation,
  IPurchaseLocationData,
  IUpdateProductPurchaseLocation,
} from "../../interfaces";
import { toast } from "react-toastify";

export const getPurchaseLocations = createAsyncThunk(
  "products-to-bring/purchase-locations",
  async (value: {}) => {
    const { getData } = useAxios();

    try {
      const categoriesData: { locations: IPurchaseLocationData[] } =
        await getData(`products-to-bring/purchase-locations`);

      return categoriesData.locations;
    } catch {
      toast.error("შეცდომაა! თავიდან შემოდით!");
    }
  }
);

export const createPurchaseLocation = createAsyncThunk(
  "products-to-bring/purchase-locations/create",
  async (value: ICreateProductPurchaseLocation) => {
    const { postData } = useAxios();

    try {
      const result: { message: string; location: IPurchaseLocationData } =
        await postData(`products-to-bring/purchase-location`, value);

      return result.location;
    } catch {
      toast.error("შეცდომაა! ლოკაცია ვერ შეიქმნა!");
    }
  }
);

export const updatePurchaseLocation = createAsyncThunk(
  "products-to-bring/purchase-locations/update",
  async (value: IUpdateProductPurchaseLocation) => {
    const { patchRequest } = useAxios();

    try {
      const result: { message: string; location: IPurchaseLocationData } =
        await patchRequest(`products-to-bring/purchase-location`, value);

      return result.location;
    } catch {
      toast.error("შეცდომაა! ლოკაცია ვერ განახლდა!");
    }
  }
);

export const deletePurchaseLocation = createAsyncThunk(
  "products-to-bring/purchase-locations/delete",
  async (value: { id: string }) => {
    const { deleteData } = useAxios();

    try {
      await deleteData(`products-to-bring/purchase-location/${value.id}`);

      return { id: value.id };
    } catch {
      toast.error("შეცდომაა! ლოკაცია ვერ წაიშალა!");
    }
  }
);

const initialState: { locations: IPurchaseLocationData[] } = {
  locations: [],
};

export const productsPurchaseLocationSlice = createSlice({
  name: "purchaseLocations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPurchaseLocations.fulfilled, (state, action) => {
        if (action.payload) {
          state.locations = action.payload;
        }
      })
      .addCase(getPurchaseLocations.rejected, (state, action) => {
        console.error("Failed Fetching Purchase Locations.");
        state.locations = [];
      });

    builder
      .addCase(createPurchaseLocation.fulfilled, (state, action) => {
        if (action.payload) {
          state.locations.unshift(action.payload);
        }
      })
      .addCase(createPurchaseLocation.rejected, (state, action) => {
        console.error("Failed Creating Purchase Location.");
      });

    builder
      .addCase(updatePurchaseLocation.fulfilled, (state, action) => {
        if (action.payload) {
          const locationIndex = state.locations.findIndex(
            (location) => location._id === action.payload?._id
          );

          if (locationIndex !== -1) {
            state.locations[locationIndex] = action.payload;
          }
        }
      })
      .addCase(updatePurchaseLocation.rejected, (state, action) => {
        console.error("Failed Updating Purchase Location.");
      });

    builder
      .addCase(deletePurchaseLocation.fulfilled, (state, action) => {
        if (action.payload) {
          const locationIndex = state.locations.findIndex(
            (location) => location._id === action.payload?.id
          );

          if (locationIndex !== -1) {
            state.locations.splice(locationIndex, 1);
          }
        }
      })
      .addCase(deletePurchaseLocation.rejected, (state, action) => {
        console.error("Failed Deleting Location.");
      });
  },
});

export default productsPurchaseLocationSlice.reducer;
