import { get } from '@/api/request'

export interface DashboardSummary {
  productCount: number
  storeCount: number
  warningCount: number
  pendingPurchase: number
  pendingTransfer: number
  pendingStockCheck: number
  pendingSale: number
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return get<DashboardSummary>('/api/dashboard/summary')
}
