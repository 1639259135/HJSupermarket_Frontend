import { get, post, put, del } from '@/api/request'

export interface StoreItem {
  id: number
  name: string
  address: string
  phone: string
  managerName: string
  status: number
  createTime: string
}

export interface StoreListParams {
  name?: string
  status?: number
  pageNum: number
  pageSize: number
}

export function getStoreList(params: StoreListParams) {
  return get<{ list: StoreItem[]; total: number }>('/api/store/list', params)
}

export function getAllStores() {
  return get<StoreItem[]>('/api/store/all')
}

export function createStore(data: Record<string, any>) {
  return post('/api/store', data)
}

export function updateStore(id: number, data: Record<string, any>) {
  return put(`/api/store/${id}`, data)
}

export function deleteStore(id: number) {
  return del(`/api/store/${id}`)
}
