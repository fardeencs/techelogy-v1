export class PaginationModel {
  public totalItems: number;
  public itemsPerPage: number;
  public data: any;

	/**
   *
   * @param totalItems
   * @param itemsPerPage
   * @param data
   * @returns {PaginationModel}
   */
  public static toResponse(totalItems: number, itemsPerPage: number, data: any = []): PaginationModel {
    const model = new PaginationModel();
    model.totalItems = totalItems;
    model.itemsPerPage = itemsPerPage;
    model.data = data;
    return model;
  }
}
