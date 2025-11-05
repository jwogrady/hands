import { render, screen } from '@testing-library/react'
import App from '../app'

describe('App', () => {
  it('renders the application title', () => {
    render(<App />)
    expect(screen.getByText(/Hands - Driver Screening Platform/i)).toBeInTheDocument()
  })
})
