import { camelCase, isArray, isPlainObject } from 'lodash'

/**
 * 递归将对象的蛇形 key 转为驼峰 key
 * 用于 Axios 响应拦截器处理后端返回的 JSON
 */
export function snakeToCamel<T = any>(obj: T): T {
  if (isArray(obj)) {
    return obj.map((item) => snakeToCamel(item)) as unknown as T
  }
  if (isPlainObject(obj)) {
    const result: Record<string, any> = {}
    for (const key of Object.keys(obj as object)) {
      const camelKey = camelCase(key)
      result[camelKey] = snakeToCamel((obj as Record<string, any>)[key])
    }
    return result as T
  }
  return obj
}
