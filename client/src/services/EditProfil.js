import Api from '@/services/Api'
export default {
  editPreference(info) {
    return Api().put('preference',info)
  },
  editInfos(info) {
      return Api().put('infos',info)
  },
  editDescription(info) {
    return Api().put('description',info)
  },
  updateMdp(info) {
    return Api().put('password',info)
  }
}
