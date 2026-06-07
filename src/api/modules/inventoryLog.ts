import { get } from '@/api/request'

export interface InventoryLogItem {
  id: number
  productId: number
  productName: string
  storeId: number
  storeName: string
  changeType: number
  changeQuantity: number
  beforeQuantity: number
  afterQuantity: number
  relatedNo: string
  createTime: string
}

export function getInventoryLogList(params: {
  productName?: string
  changeType?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: InventoryLogItem[]; total: number }>('/api/inventory-log/list', params)
}
