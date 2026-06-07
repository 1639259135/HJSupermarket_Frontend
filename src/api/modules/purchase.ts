import { get, post, del } from '@/api/request'

export interface PurchaseItem {
  id: number
  purchaseNo: string
  supplierId: number
  supplierName: string
  storeId: number
  storeName: string
  totalAmount: number
  status: number
  createTime: string
  confirmTime: string
}

export interface PurchaseDetail extends PurchaseItem {
  items: {
    id: number
    productId: number
    productName: string
    quantity: number
    price: number
  }[]
}

export function getPurchaseList(params: {
  purchaseNo?: string
  status?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: PurchaseItem[]; total: number }>('/api/purchase/list', params)
}

export function getPurchaseDetail(id: number) {
  return get<PurchaseDetail>(`/api/purchase/${id}`)
}

export function createPurchase(data: {
  supplierId: number
  storeId: number
  items: { productId: number; quantity: number; price: number }[]
}) {
  return post('/api/purchase', data)
}

export function confirmPurchase(id: number) {
  return post(`/api/purchase/confirm/${id}`)
}

export function deletePurchase(id: number) {
  return del(`/api/purchase/${id}`)
}
