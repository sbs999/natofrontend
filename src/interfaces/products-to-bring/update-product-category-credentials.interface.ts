export interface IUpdateProductCategoryCredentials {
  id: string;
  updateData: {
    name: string;
    description?: string;
  };
}
