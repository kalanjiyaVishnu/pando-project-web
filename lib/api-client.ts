const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    const result = await response.json()

    if (result.success === false) {
        const errorMsg = Array.isArray(result.error)
            ? result.error.map((e: any) => e.message).join(', ')
            : result.error || 'API request failed'
        throw new Error(errorMsg)
    }

    return result
}

export const crud = {
    getAll: (model: string, params?: Record<string, string | number>) => {
        const query = params
            ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
            : ''
        return apiRequest(`/${model}${query}`)
    },
    getById: (model: string, id: string | number) => apiRequest(`/${model}/${id}`),
    create: (model: string, data: any) => apiRequest(`/${model}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (model: string, id: string | number, data: any) => apiRequest(`/${model}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (model: string, id: string | number) => apiRequest(`/${model}/${id}`, { method: 'DELETE' }),
}
