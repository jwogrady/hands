import { render, screen } from '@testing-library/react'
import { HomePage } from '../features/home/pages/HomePage'
import { RouterProvider, createRouter, createRootRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => <HomePage />,
})

const router = createRouter({ routeTree: rootRoute })

describe('HomePage', () => {
  it('renders the application title', () => {
    render(<RouterProvider router={router} />)
    expect(screen.getByText(/Hands - Driver Screening Platform/i)).toBeInTheDocument()
  })
})
