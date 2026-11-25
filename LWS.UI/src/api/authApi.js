import { apiRequest } from './apiClient'

export async function loginApi({ email, password }) {
  return apiRequest('/api/Auth/Login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerApi({ firstName, lastName, phoneNumber, email, password }) {
  return apiRequest('/api/Auth/Register', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    }),
  })
}
