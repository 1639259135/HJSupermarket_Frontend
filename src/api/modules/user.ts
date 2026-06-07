import { get, post, put, del } from '@/api/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userId: number
  realName: string
}

export function login(data: LoginParams): Promise<LoginResult> {
  return post<LoginResult>('/api/user/login', data)
}

export interface UserItem {
  id: number
  username: string
  realName: string
  phone: string
  email: string
  roleId: number
  status: number
  createTime: string
}

export interface UserListParams {
  username?: string
  roleId?: number
  status?: number
  pageNum: number
  pageSize: number
}

export interface UserListResult {
  list: UserItem[]
  total: number
}

export function getUserList(params: UserListParams) {
  return get<UserListResult>('/api/user/list', params)
}

export function createUser(data: Record<string, any>) {
  return post('/api/user', data)
}

export function updateUser(id: number, data: Record<string, any>) {
  return put(`/api/user/${id}`, data)
}

export function deleteUser(id: number) {
  return del(`/api/user/${id}`)
}
