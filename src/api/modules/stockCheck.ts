import { get, post } from '@/api/request'

export interface StockCheckItem {
  id: number
  checkNo: string
  storeId: number
  storeName: string
  totalQuantity: number
  status: number
  createTime: string
  confirmTime: string
}

export interface StockCheckDetail extends StockCheckItem {
  items: {
    id: number
    productId: number
    productName: string
    systemQuantity: number
    actualQuantity: number
  }[]
}

export function getStockCheckList(params: {
  checkNo?: string
  status?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: StockCheckItem[]; total: number }>('/api/stock-check/list', params)
}

export function getStockCheckDetail(id: number) {
  return get<StockCheckDetail>(`/api/stock-check/${id}`)
}

export function createStockCheck(data: {
  storeId: number
  items: { productId: number; systemQuantity: number; actualQuantity: number }[]
}) {
  return post('/api/stock-check', data)
}

export function confirmStockCheck(id: number) {
  return post(`/api/stock-check/confirm/${id}`)
}
