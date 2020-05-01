import Api from '@/services/Api'
export default {
  like(info) {
    return Api().get('like',info)
  },
  pass(info) {
      return Api().get('pass',info)
  }
}
