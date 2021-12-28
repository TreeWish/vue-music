import { get } from '@/service/base.js';

export function getRecommend() {
  return get('/api/getRecommend');
}

export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  });
}
