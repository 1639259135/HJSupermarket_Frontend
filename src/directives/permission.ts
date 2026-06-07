import type { Directive } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * 权限指令 v-permission
 * 传入允许的角色 ID 数组，当前用户角色不在其中则隐藏元素
 *
 * 用法：
 *   <el-button v-permission="[1, 2]">管理员可见</el-button>
 *   <el-button v-permission="[1]">仅超管可见</el-button>
 */
export const vPermission: Directive<HTMLElement, number[]> = {
  mounted(el: HTMLElement, binding) {
    const auth = useAuthStore()
    const allowedRoles = binding.value
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(auth.roleId)) {
      el.style.display = 'none'
    }
  },
}
