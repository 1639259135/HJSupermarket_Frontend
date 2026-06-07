import { get, post, put, del } from '@/api/request'

export interface CategoryItem {
  id: number
  name: string
  parentId: number
  sortOrder: number
  status: number
  children: CategoryItem[]
}

export interface CategoryTreeNode extends CategoryItem {
  children: CategoryTreeNode[]
}

export function getCategoryTree() {
  return get<CategoryTreeNode[]>('/api/category/tree')
}

export function createCategory(data: { name: string; parentId?: number; sortOrder?: number }) {
  return post('/api/category', data)
}

export function updateCategory(id: number, data: Record<string, any>) {
  return put(`/api/category/${id}`, data)
}

export function deleteCategory(id: number) {
  return del(`/api/category/${id}`)
}
