import { get, post } from '@/api/request'

export interface DamagedItem {
  id: number
  damagedNo: string
  storeId: number
  storeName: string
  totalQuantity: number
  status: number
  createTime: string
}

export interface DamagedDetail extends DamagedItem {
  items: {
    id: number
    productId: number
    productName: string
    quantity: number
    reason: string
  }[]
}

export function getDamagedList(params: {
  damagedNo?: string
  status?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: DamagedItem[]; total: number }>('/api/damaged/list', params)
}

export function getDamagedDetail(id: number) {
  return get<DamagedDetail>(`/api/damaged/${id}`)
}

export function createDamaged(data: {
  storeId: number
  items: { productId: number; quantity: number; reason: string }[]
}) {
  return post('/api/damaged', data)
}
