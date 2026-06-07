import { get } from '@/api/request'

export interface InventoryItem {
  id: number
  productId: number
  productName: string
  storeId: number
  storeName: string
  quantity: number
  warningQuantity: number
  createTime: string
}

export interface InventoryListParams {
  productName?: string
  productId?: number
  storeId?: number
  pageNum: number
  pageSize: number
}

export function getInventoryList(params: InventoryListParams) {
  return get<{ list: InventoryItem[]; total: number }>('/api/inventory/list', params)
}

export function getWarningInventory(params: { pageNum: number; pageSize: number }) {
  return get<{ list: InventoryItem[]; total: number }>('/api/inventory/warning', params)
}
