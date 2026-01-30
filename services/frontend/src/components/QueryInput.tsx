import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const querySchema = z.object({
    query: z.string().min(3, 'Query must be at least 3 characters').max(500, 'Query too long'),
    context: z.string().optional(),
})

type QueryFormData = z.infer<typeof querySchema>

interface QueryInputProps {
    onSubmit: (data: QueryFormData) => void
    isLoading?: boolean
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<QueryFormData>({
        resolver: zodResolver(querySchema),
    })

    const queryValue = watch('query', '')

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="terminal-box p-6"
        >
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-matrix-border">
                <h2 className="text-matrix-bright font-bold flex items-center gap-2">
                    <span className="text-matrix-bright">╭─[</span>
                    <span className="matrix-glow">QUERY INPUT</span>
                    <span className="text-matrix-bright">]</span>
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Query Input */}
                <div>
                    <label htmlFor="query" className="block text-sm mb-2 text-matrix-text">
                        <span className="text-matrix-dim">╰─▸</span> YOUR QUESTION
                    </label>
                    <div className="relative">
                        <textarea
                            id="query"
                            {...register('query')}
                            className="w-full px-4 py-3 bg-black border-2 border-matrix-border rounded-none font-mono text-matrix-text placeholder-matrix-dim focus:outline-none focus:border-matrix-bright focus:shadow-matrix transition-all resize-none"
                            placeholder="> Enter your query here..."
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Character Count & Error */}
                    <div className="flex justify-between items-center mt-2 text-xs">
                        {errors.query ? (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-terminal-error status-error"
                            >
                                {errors.query.message}
                            </motion.span>
                        ) : (
                            <span className="text-matrix-dim">
                                {queryValue.length > 0 && `╰─▸ ${queryValue.length}/500 characters`}
                            </span>
                        )}
                    </div>
                </div>

                {/* Context Input (Optional) */}
                <div>
                    <label htmlFor="context" className="block text-sm mb-2 text-matrix-text">
                        <span className="text-matrix-dim">╰─▸</span> ADDITIONAL CONTEXT <span className="text-matrix-dim">(OPTIONAL)</span>
                    </label>
                    <input
                        id="context"
                        {...register('context')}
                        className="w-full px-4 py-2 bg-black border-2 border-matrix-border rounded-none font-mono text-matrix-text placeholder-matrix-dim focus:outline-none focus:border-matrix-bright focus:shadow-matrix transition-all"
                        placeholder="> Additional context or constraints..."
                        disabled={isLoading}
                    />
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-matrix-bg border-2 border-matrix-text text-matrix-text font-bold hover:bg-matrix-text hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-matrix"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-blink">▮</span>
                            <span>PROCESSING...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>EXECUTE QUERY</span>
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    )
}
