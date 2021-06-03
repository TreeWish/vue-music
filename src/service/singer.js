import { get } from '@/service/base.js'

export function getSingerList() {
  return get('/api/getSingerList')
}
