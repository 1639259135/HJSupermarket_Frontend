import { get, post } from '@/api/request'

export interface SaleItem {
  id: number
  saleNo: string
  storeId: number
  storeName: string
  totalAmount: number
  status: number
  createTime: string
}

export interface SaleDetail extends SaleItem {
  items: {
    id: number
    productId: number
    productName: string
    quantity: number
    price: number
  }[]
}

export function getSaleList(params: {
  saleNo?: string
  status?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: SaleItem[]; total: number }>('/api/sale/list', params)
}

export function getSaleDetail(id: number) {
  return get<SaleDetail>(`/api/sale/${id}`)
}

export function createSale(data: {
  storeId: number
  items: { productId: number; quantity: number; price: number }[]
}) {
  return post('/api/sale', data)
}
