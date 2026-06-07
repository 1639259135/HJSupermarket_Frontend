import { post } from '@/api/request'

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
