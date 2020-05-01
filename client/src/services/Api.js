import axios from 'axios'

export default () => {
  axios.defaults.withCredentials = true;
  return axios.create({ baseURL: 'http://localhost:8081/' })
}
