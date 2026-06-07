import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { snakeToCamel } from '@/utils/snakeToCamel'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

// 业务错误码 → 中文提示映射
const errorCodeMap: Record<string | number, string> = {
  400: '请检查输入',
  401: '登录已过期',
  403: '权限不足',
  1001: '用户名或密码错误',
  1002: 'Token 无效或已过期',
  2002: '库存不足',
  5002: '已确认不可删除',
}

function resolveMessage(code: number, message?: string): string {
  if (message && message !== 'Success') return message
  return errorCodeMap[code] || `请求失败 (code=${code})`
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30_000,
})

// ---- 请求拦截器：注入 Token ----
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// ---- 响应拦截器：蛇形转驼峰 + 业务码处理 ----
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 递归蛇形转驼峰
    if (response.data) {
      response.data = snakeToCamel(response.data)
    }
    const body = response.data
    // 业务码判断
    if (body && typeof body.code === 'number') {
      if (body.code === 200) {
        // 成功 → 返回 data 字段
        response.data = body.data ?? body
        return response
      }
      // 401 / 1002 → 清 Token 跳登录
      if (body.code === 401 || body.code === 1002) {
        const auth = useAuthStore()
        auth.clearAuth()
        router.push('/login')
        return Promise.reject(new Error(body.message || '登录已过期'))
      }
      // 其他业务错误
      ElMessage.error(resolveMessage(body.code, body.message))
      return Promise.reject(new Error(body.message || `业务错误 ${body.code}`))
    }
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        const auth = useAuthStore()
        auth.clearAuth()
        router.push('/login')
      }
      ElMessage.error(resolveMessage(status, data?.message))
    } else {
      ElMessage.error('网络异常，请检查网络连接')
    }
    return Promise.reject(error)
  },
)

// ---- 泛型封装 ----
export async function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await instance.get<T>(url, { params })
  return res.data
}

export async function post<T = any>(url: string, data?: any): Promise<T> {
  const res = await instance.post<T>(url, data)
  return res.data
}

export async function put<T = any>(url: string, data?: any): Promise<T> {
  const res = await instance.put<T>(url, data)
  return res.data
}

export async function del<T = any>(url: string): Promise<T> {
  const res = await instance.delete<T>(url)
  return res.data
}

export default instance
