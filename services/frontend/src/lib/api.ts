const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export interface RAGQuery {
    query: string
    context?: string
}

export interface RAGResponse {
    answer: string
    sources: string[]
    confidence: number
    processingTime: number
}

export interface ApiError {
    message: string
    status: number
}

class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            })

            if (!response.ok) {
                const error: ApiError = {
                    message: `HTTP error! status: ${response.status}`,
                    status: response.status,
                }
                throw error
            }

            return await response.json()
        } catch (error) {
            if (error instanceof Error) {
                throw {
                    message: error.message,
                    status: 0,
                } as ApiError
            }
            throw error
        }
    }

    async queryRAG(data: RAGQuery): Promise<RAGResponse> {
        return this.request<RAGResponse>('/query', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async healthCheck(): Promise<{ status: string }> {
        return this.request<{ status: string }>('/health')
    }
}

export const apiClient = new ApiClient()
