import storage from 'good-storage'

export function save(item, key, compare) {
  const list = load(key)
  insertArray(list, item, compare)
  storage.set(key, list)
  return list
}

export function remove(key, compare) {
  const list = load(key)
  deleteFromArray(list, compare)
  storage.set(key, list)
  return list
}
function insertArray(arr, val, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function load(key) {
  return storage.get(key, [])
}
