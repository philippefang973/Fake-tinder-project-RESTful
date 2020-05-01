import Api from '@/services/Api'
export default {
  signIn(info) {
    return Api().post('login',info)
  },
  signUp(info) {
      return Api().post('creation',info)
  }
}
