import axios from 'axios'

const API_BASE_URL = '/api/let-it-cook/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  config => {
    const fullUrl = config.baseURL + config.url
    console.log('🚀 请求地址:', fullUrl)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const dishAPI = {
  getDishes(pageNum = 1, pageSize = 10) {
    return apiClient.post('/dishes/list', { pageNum, pageSize })
  },

  addDish(data) {
    return apiClient.post('/dishes/add', data)
  },

  updateDish(data) {
    return apiClient.post('/dishes/update', data)
  },

  deleteDish(id) {
    return apiClient.post('/dishes/delete', { id })
  },

  addImageToDish(id, image) {
    return apiClient.post('/dishes/addImage', { id, image })
  },

  getTutorialsByDishId(dishId) {
    return apiClient.post('/dishes/tutorials/list', { dishId })
  },

  addTutorial(data) {
    return apiClient.post('/dishes/tutorials/add', data)
  },

  updateTutorial(data) {
    return apiClient.post('/dishes/tutorials/update', data)
  },

  deleteTutorial(id) {
    return apiClient.post('/dishes/tutorials/delete', { id })
  }
}

export const uploadAPI = {
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    const url = '/api/minio/upload'
    console.log('🚀 请求地址:', url)
    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default apiClient