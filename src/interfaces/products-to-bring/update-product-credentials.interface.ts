import { ProductStatuses } from "../../constants/product-statuses.constants";

export interface IUpdateProductData {
  productId: string;
  productStatus: ProductStatuses;
  updateData: {
    imageUrls?: string[];
    category?: string;
    purchaseLocations?: string[];
    description?: string;
    name?: string;
    status?: string;
  };
}
