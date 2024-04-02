import { ProductStatuses } from "../../constants/product-statuses.constants";
import { ICategoryData } from "./category-data.interface";
import { IPurchaseLocationData } from "./purchase-location-data.interface";

export interface IProductData {
  name: string;
  description?: string;
  imageUrls?: string[];
  status: ProductStatuses;
  lastStatusUpdateAt: Date;
  category: ICategoryData;
  purchaseLocations: IPurchaseLocationData[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
