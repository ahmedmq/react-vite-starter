import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('App', () => {
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
