import { Github } from 'lucide-react'
import { useState } from 'react'
import { QueryInput } from './components/QueryInput'
import { ResultsDisplay } from './components/ResultsDisplay'
import { useRAGQuery } from './hooks/useRAGQuery'
import type { RAGResponse } from './lib/api'

function App() {
    const [result, setResult] = useState<RAGResponse | null>(null)
    const ragMutation = useRAGQuery()

    const handleQuerySubmit = (data: { query: string; context?: string }) => {
        ragMutation.mutate(data, {
            onSuccess: (response) => {
                setResult(response)
            },
        })
    }

    return (
        <div className="min-h-screen bg-matrix-bg font-mono p-4 md:p-8">
            {/* ASCII Art Header */}
            <header className="mb-8">
                <pre className="text-matrix-text text-xs md:text-sm matrix-glow leading-tight">
                    {`╔═══════════════════════════════════════════════════════════════════╗
║  ██████╗  █████╗  ██████╗     ███████╗██╗   ██╗ █████╗ ██╗       ║
║  ██╔══██╗██╔══██╗██╔════╝     ██╔════╝██║   ██║██╔══██╗██║       ║
║  ██████╔╝███████║██║  ███╗    █████╗  ██║   ██║███████║██║       ║
║  ██╔══██╗██╔══██║██║   ██║    ██╔══╝  ╚██╗ ██╔╝██╔══██║██║       ║
║  ██║  ██║██║  ██║╚██████╔╝    ███████╗ ╚████╔╝ ██║  ██║███████╗  ║
║  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝     ╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝  ║
╚═══════════════════════════════════════════════════════════════════╝`}
                </pre>

                <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="text-matrix-text">
                        <span className="text-matrix-bright animate-blink">▮</span>
                        <span className="ml-2">RETRIEVAL AUGMENTED GENERATION EVALUATION SYSTEM v1.0</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs">
                            <span className="text-terminal-success status-ok">SYSTEM ONLINE</span>
                        </div>
                        <a
                            href="https://github.com/yourusername/rag-eval"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-matrix-text hover:text-matrix-bright transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto space-y-6">
                {/* System Info */}
                <div className="terminal-box p-4 text-xs">
                    <div className="space-y-1 font-mono">
                        <div><span className="text-matrix-dim">$</span> <span className="text-matrix-text">system.info()</span></div>
                        <div className="text-matrix-dim ml-4">
                            → Evaluating RAG systems with precision and speed<br />
                            → Query your documents with AI-powered retrieval<br />
                            → Get confidence scores and source attribution
                        </div>
                    </div>
                </div>

                {/* Query Input */}
                <QueryInput
                    onSubmit={handleQuerySubmit}
                    isLoading={ragMutation.isPending}
                />

                {/* Error Display */}
                {ragMutation.isError && (
                    <div className="terminal-box p-4 border-terminal-error">
                        <div className="text-terminal-error status-error">
                            {ragMutation.error instanceof Error
                                ? ragMutation.error.message
                                : 'An error occurred while processing your query'}
                        </div>
                    </div>
                )}

                {/* Results Display */}
                {result && <ResultsDisplay result={result} />}

                {/* Loading State */}
                {ragMutation.isPending && (
                    <div className="terminal-box p-6">
                        <div className="flex items-center gap-3 text-terminal-warning">
                            <div className="flex gap-1">
                                <span className="animate-blink">▮</span>
                                <span className="animate-blink" style={{ animationDelay: '0.2s' }}>▮</span>
                                <span className="animate-blink" style={{ animationDelay: '0.4s' }}>▮</span>
                            </div>
                            <span className="status-loading">PROCESSING QUERY</span>
                        </div>
                        <div className="mt-2 text-xs text-matrix-dim">
                            → Retrieving relevant documents...<br />
                            → Generating response...<br />
                            → Calculating confidence scores...
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center text-xs text-matrix-dim">
                <div className="border-t border-matrix-border pt-4">
                    <p>╰─▸ RAG EVAL TERMINAL v1.0.0 | UPTIME: {new Date().toISOString()}</p>
                    <p className="mt-1">╰─▸ POWERED BY OPENAI GPT-4 | STATUS: <span className="text-terminal-success">OPERATIONAL</span></p>
                </div>
            </footer>
        </div>
    )
}

export default App
