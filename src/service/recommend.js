import { get } from '@/service/base.js'

export function getRecommend() {
  return get('/api/getRecommend')
}
