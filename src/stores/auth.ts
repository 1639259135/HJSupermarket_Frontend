import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: number
  roleId: number
  exp?: number
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userId = ref<number>(Number(localStorage.getItem('userId')) || 0)
  const realName = ref<string>(localStorage.getItem('realName') || '')
  const roleId = ref<number>(0)

  // 从 Token 解码 roleId
  function parseRoleId(): number {
    if (!token.value) return 0
    try {
      const payload = jwtDecode<TokenPayload>(token.value)
      return payload.roleId || 0
    } catch {
      return 0
    }
  }

  // 初始化时解析
  roleId.value = parseRoleId()

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(t: string, id: number, name: string) {
    token.value = t
    userId.value = id
    realName.value = name
    roleId.value = parseRoleId()
    localStorage.setItem('token', t)
    localStorage.setItem('userId', String(id))
    localStorage.setItem('realName', name)
  }

  function clearAuth() {
    token.value = ''
    userId.value = 0
    realName.value = ''
    roleId.value = 0
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('realName')
  }

  return { token, userId, realName, roleId, isLoggedIn, setAuth, clearAuth }
})
