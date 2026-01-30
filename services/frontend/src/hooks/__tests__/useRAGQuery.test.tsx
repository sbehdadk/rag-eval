import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRAGQuery, useHealthCheck } from '../useRAGQuery'
import { apiClient } from '@/lib/api'
import type { ReactNode } from 'react'

// Mock the API client
vi.mock('@/lib/api', () => ({
    apiClient: {
        queryRAG: vi.fn(),
        healthCheck: vi.fn(),
    },
}))

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client= { queryClient } > { children } </QueryClientProvider>
    )
}

describe('useRAGQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('successfully queries RAG API', async () => {
        const mockResponse = {
            answer: 'Test answer',
            sources: ['source1'],
            confidence: 0.95,
            processingTime: 100,
        }

        vi.mocked(apiClient.queryRAG).mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useRAGQuery(), {
            wrapper: createWrapper(),
        })

        result.current.mutate({ query: 'test query' })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toEqual(mockResponse)
    })

    it('handles API errors', async () => {
        vi.mocked(apiClient.queryRAG).mockRejectedValue(new Error('API Error'))

        const { result } = renderHook(() => useRAGQuery(), {
            wrapper: createWrapper(),
        })

        result.current.mutate({ query: 'test query' })

        await waitFor(() => expect(result.current.isError).toBe(true))
        expect(result.current.error).toBeDefined()
    })
})

describe('useHealthCheck', () => {
    it('fetches health status', async () => {
        const mockHealth = { status: 'healthy' }
        vi.mocked(apiClient.healthCheck).mockResolvedValue(mockHealth)

        const { result } = renderHook(() => useHealthCheck(), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toEqual(mockHealth)
    })
})
