import { get, post, put, del } from '@/api/request'

export interface SupplierItem {
  id: number
  name: string
  contactPerson: string
  phone: string
  address: string
  status: number
  createTime: string
}

export interface SupplierListParams {
  name?: string
  status?: number
  pageNum: number
  pageSize: number
}

export function getSupplierList(params: SupplierListParams) {
  return get<{ list: SupplierItem[]; total: number }>('/api/supplier/list', params)
}

export function getAllSuppliers() {
  return get<SupplierItem[]>('/api/supplier/all')
}

export function createSupplier(data: Record<string, any>) {
  return post('/api/supplier', data)
}

export function updateSupplier(id: number, data: Record<string, any>) {
  return put(`/api/supplier/${id}`, data)
}

export function deleteSupplier(id: number) {
  return del(`/api/supplier/${id}`)
}
