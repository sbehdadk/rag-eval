import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { QueryInput } from '../QueryInput'

describe('QueryInput', () => {
    it('renders query input form', () => {
        const onSubmit = vi.fn()
        render(<QueryInput onSubmit={onSubmit} />)

        expect(screen.getByLabelText(/your question/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/ask anything/i)).toBeInTheDocument()
    })

    it('shows validation error for short query', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<QueryInput onSubmit={onSubmit} />)

        const textarea = screen.getByLabelText(/your question/i)
        await user.type(textarea, 'ab')
        await user.click(screen.getByRole('button', { name: /submit query/i }))

        await waitFor(() => {
            expect(screen.getByText(/query must be at least 3 characters/i)).toBeInTheDocument()
        })
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('submits valid query', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<QueryInput onSubmit={onSubmit} />)

        const textarea = screen.getByLabelText(/your question/i)
        await user.type(textarea, 'What is RAG?')
        await user.click(screen.getByRole('button', { name: /submit query/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled()
        })

        const callArgs = onSubmit.mock.calls[0][0]
        expect(callArgs.query).toBe('What is RAG?')
        expect(callArgs.context).toBe('')
    })

    it('shows character count', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<QueryInput onSubmit={onSubmit} />)

        const textarea = screen.getByLabelText(/your question/i)
        await user.type(textarea, 'Test query')

        expect(screen.getByText(/10\/500/)).toBeInTheDocument()
    })

    it('shows loading state', () => {
        const onSubmit = vi.fn()
        render(<QueryInput onSubmit={onSubmit} isLoading={true} />)

        expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
})
