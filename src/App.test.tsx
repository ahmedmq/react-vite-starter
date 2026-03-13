import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

import confetti from 'canvas-confetti'
const mockConfetti = confetti as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers()
    mockConfetti.mockClear()
  })

  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })

  it('renders the counter button starting at 0', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
  })

  it('increments the counter on click', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('renders Vite and React logo links', () => {
    render(<App />)
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
  })

  it('triggers confetti and shows celebration message when reaching milestone 10', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })

    for (let i = 0; i < 10; i++) {
      fireEvent.click(button)
    }

    expect(mockConfetti).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('Milestone reached!')
  })

  it('celebration message disappears after 2.5 seconds', () => {
    vi.useFakeTimers()
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })

    for (let i = 0; i < 10; i++) {
      fireEvent.click(button)
    }

    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(2500) })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('confetti only triggers once per milestone', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })

    for (let i = 0; i < 12; i++) {
      fireEvent.click(button)
    }

    // Milestone 10 fires once; clicking to 11 and 12 should not fire again
    expect(mockConfetti).toHaveBeenCalledTimes(1)
  })

  it('triggers confetti for milestones 10 and 25', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })

    for (let i = 0; i < 25; i++) {
      fireEvent.click(button)
    }

    expect(mockConfetti).toHaveBeenCalledTimes(2)
  })
})

describe('Reset button', () => {
  it('is not visible when counter is 0', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  it('is visible when counter is greater than 0', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /count is 0/i }))
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('resets counter to 0 when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /count is 0/i }))
    await user.click(screen.getByRole('button', { name: /count is 1/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  it('allows milestones to fire again after reset', async () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    for (let i = 0; i < 10; i++) fireEvent.click(button)
    expect(mockConfetti).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    for (let i = 0; i < 10; i++) fireEvent.click(screen.getByRole('button', { name: /count is/i }))
    expect(mockConfetti).toHaveBeenCalledTimes(2)
  })
})

describe('Theme toggle', () => {
  it('renders a theme toggle button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('switches theme when toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const initialTheme = document.documentElement.getAttribute('data-theme')
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    const newTheme = document.documentElement.getAttribute('data-theme')

    expect(newTheme).not.toBe(initialTheme)
    expect(['light', 'dark']).toContain(newTheme)
  })

  it('persists selected theme to localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    const stored = localStorage.getItem('theme')

    expect(stored).toBe(document.documentElement.getAttribute('data-theme'))
  })

  it('restores theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light')
    render(<App />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('restores dark theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark')
    render(<App />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
