import type { RAGResponse } from '@/lib/api'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface ResultsDisplayProps {
    result: RAGResponse
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(result.answer)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Determine confidence level color
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-terminal-success'
        if (confidence >= 0.6) return 'text-terminal-warning'
        return 'text-terminal-error'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="terminal-box p-6 space-y-4"
        >
            {/* Header */}
            <div className="pb-3 border-b border-matrix-border flex items-center justify-between">
                <h2 className="text-matrix-bright font-bold flex items-center gap-2">
                    <span className="text-matrix-bright">╭─[</span>
                    <span className="matrix-glow">QUERY RESULTS</span>
                    <span className="text-matrix-bright">]</span>
                </h2>
                <button
                    onClick={handleCopy}
                    className="text-matrix-text hover:text-matrix-bright transition-colors flex items-center gap-2 text-sm"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>COPIED</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>COPY</span>
                        </>
                    )}
                </button>
            </div>

            {/* Answer */}
            <div className="space-y-2">
                <div className="text-sm text-matrix-dim">
                    <span className="status-ok">RESPONSE</span>
                </div>
                <div className="bg-black border-l-4 border-matrix-text p-4 text-matrix-text leading-relaxed">
                    {result.answer}
                </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-matrix-border">
                {/* Confidence Score */}
                <div className="space-y-1">
                    <div className="text-xs text-matrix-dim">
                        ╰─▸ CONFIDENCE SCORE
                    </div>
                    <div className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-black h-2 border border-matrix-border">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence * 100}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`h-full ${result.confidence >= 0.8
                                    ? 'bg-terminal-success'
                                    : result.confidence >= 0.6
                                        ? 'bg-terminal-warning'
                                        : 'bg-terminal-error'
                                }`}
                        />
                    </div>
                </div>

                {/* Processing Time */}
                <div className="space-y-1">
                    <div className="text-xs text-matrix-dim">
                        ╰─▸ PROCESSING TIME
                    </div>
                    <div className="text-2xl font-bold text-matrix-text">
                        {result.processingTime}ms
                    </div>
                    <div className="text-xs text-matrix-dim">
                        {result.processingTime < 1000 ? '⚡ FAST' : result.processingTime < 3000 ? '✓ NORMAL' : '⚠ SLOW'}
                    </div>
                </div>
            </div>

            {/* Sources */}
            {result.sources && result.sources.length > 0 && (
                <div className="pt-4 border-t border-matrix-border space-y-2">
                    <div className="text-sm text-matrix-dim">
                        <span className="status-ok">SOURCE DOCUMENTS</span>
                        <span className="ml-2">({result.sources.length})</span>
                    </div>
                    <div className="space-y-2">
                        {result.sources.map((source, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-black border-l-2 border-matrix-dim p-3 text-sm text-matrix-text hover:border-matrix-text transition-colors"
                            >
                                <span className="text-matrix-dim">╰─▸ [{index + 1}]</span> {source}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* System Info */}
            <div className="pt-4 border-t border-matrix-border">
                <div className="text-xs text-matrix-dim space-y-1">
                    <div>╰─▸ TIMESTAMP: {new Date().toISOString()}</div>
                    <div>╰─▸ STATUS: <span className="text-terminal-success">COMPLETE</span></div>
                </div>
            </div>
        </motion.div>
    )
}
