import { apiClient, type RAGQuery } from '@/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useRAGQuery() {
    return useMutation({
        mutationFn: (data: RAGQuery) => apiClient.queryRAG(data),
    })
}

export function useHealthCheck() {
    return useQuery({
        queryKey: ['health'],
        queryFn: () => apiClient.healthCheck(),
        refetchInterval: 30000, // Check every 30 seconds
        retry: 3,
    })
}
