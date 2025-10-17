export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}