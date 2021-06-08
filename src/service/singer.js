import { get } from '@/service/base.js'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
      mid: singer.mid
  })
}
