/**
 * Fields in a request to create a single PRODUCT item.
 */
export interface CreateProductRequest {
  name: string
  brand: string
  manufacturingDate?: string
}
