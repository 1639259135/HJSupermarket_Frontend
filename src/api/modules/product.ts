import { get, post, put, del } from '@/api/request'

export interface ProductItem {
  id: number
  name: string
  categoryId: number
  categoryName: string
  barcode: string
  spec: string
  unit: string
  purchasePrice: number
  salePrice: number
  status: number
  createTime: string
}

export interface ProductListParams {
  name?: string
  categoryId?: number
  barcode?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface ProductListResult {
  list: ProductItem[]
  total: number
}

export function getProductList(params: ProductListParams) {
  return get<ProductListResult>('/api/product/list', params)
}

export function getProductDetail(id: number) {
  return get<ProductItem>(`/api/product/${id}`)
}

export function createProduct(data: Record<string, any>) {
  return post('/api/product', data)
}

export function updateProduct(id: number, data: Record<string, any>) {
  return put(`/api/product/${id}`, data)
}

export function deleteProduct(id: number) {
  return del(`/api/product/${id}`)
}
