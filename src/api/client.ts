import { ofetch } from 'ofetch'

const baseClient = ofetch.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  onResponseError({ error }) {
    console.error('API Error:', error)
  }
})

const apiClient = {
  get<T>(url: string, options?: { params?: Record<string, string | number | boolean | undefined> }) {
    return baseClient<T>(url, {
      method: 'GET',
      query: options?.params
    })
  },
  post<T>(url: string, body?: Record<string, unknown> | BodyInit | null) {
    return baseClient<T>(url, {
      method: 'POST',
      body
    })
  }
}

export default apiClient
