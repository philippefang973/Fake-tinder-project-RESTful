import Api from '@/services/Api'
export default {
  editPreference(info) {
    return Api().post('preference',info)
  },
  editInfos(info) {
      return Api().post('infos',info)
  },
  editDescription(info) {
    return Api().post('description',info)
  },
  updateMdp(info) {
    return Api().post('password',info)
  }
}
