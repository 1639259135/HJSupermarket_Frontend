import { get, put } from '@/api/request'

export interface SettingsMap {
  [key: string]: string
}

export function getSettings() {
  return get<SettingsMap>('/api/settings')
}

export function updateSettings(data: SettingsMap) {
  return put('/api/settings', data)
}
