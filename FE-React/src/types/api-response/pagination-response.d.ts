export interface PaginationResponse<T> {
  data: T[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
