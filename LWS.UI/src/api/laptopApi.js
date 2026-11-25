import { apiRequest } from './apiClient'

export async function getAllLaptopsApi() {
  return apiRequest('/api/Laptop/GetAllLaptops')
}

export async function getLaptopsByBrandApi(brand) {
  return apiRequest(`/api/Laptop/GetAllLaptopsByBrand/${encodeURIComponent(brand)}`)
}

export async function getLaptopsByModelApi(model) {
  return apiRequest(`/api/Laptop/GetAllLaptopsByModel/${encodeURIComponent(model)}`)
}

export async function getLaptopBySerialNoApi(serialNo) {
  return apiRequest(`/api/Laptop/GetLaptopBySerialNo/${encodeURIComponent(serialNo)}`)
}

export async function getLaptopsByPriceRangeApi(minPrice, maxPrice) {
  return apiRequest(
    `/api/Laptop/GetAllLaptopsByPriceRange/${encodeURIComponent(minPrice)}/${encodeURIComponent(maxPrice)}`
  )
}

export async function addLaptopApi(laptopDto) {
  return apiRequest('/api/Laptop/AddLaptop', {
    method: 'POST',
    body: JSON.stringify(laptopDto),
  })
}

export async function updateLaptopApi(laptopDto) {
  return apiRequest('/api/Laptop/UpdateLaptop', {
    method: 'PUT',
    body: JSON.stringify(laptopDto),
  })
}

export async function deleteLaptopApi(serialNo) {
  return apiRequest(`/api/Laptop/DeleteLaptop/${encodeURIComponent(serialNo)}`, {
    method: 'DELETE',
  })
}
