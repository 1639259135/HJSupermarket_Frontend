import { get, post, del } from '@/api/request'

export interface TransferItem {
  id: number
  transferNo: string
  fromStoreId: number
  fromStoreName: string
  toStoreId: number
  toStoreName: string
  totalQuantity: number
  status: number
  createTime: string
  confirmTime: string
}

export interface TransferDetail extends TransferItem {
  items: {
    id: number
    productId: number
    productName: string
    quantity: number
  }[]
}

export function getTransferList(params: {
  transferNo?: string
  status?: number
  pageNum: number
  pageSize: number
}) {
  return get<{ list: TransferItem[]; total: number }>('/api/transfer/list', params)
}

export function getTransferDetail(id: number) {
  return get<TransferDetail>(`/api/transfer/${id}`)
}

export function createTransfer(data: {
  fromStoreId: number
  toStoreId: number
  items: { productId: number; quantity: number }[]
}) {
  return post('/api/transfer', data)
}

export function confirmTransfer(id: number) {
  return post(`/api/transfer/confirm/${id}`)
}

export function deleteTransfer(id: number) {
  return del(`/api/transfer/${id}`)
}
