import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './Navigation'

const renderWithRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Navigation Component', () => {
  it('should render all navigation links', () => {
    renderWithRouter(<Navigation />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Review Wrong')).toBeInTheDocument()
  })

  it('should highlight active link on home page', () => {
    renderWithRouter(<Navigation />, { route: '/' })
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('active')
  })

  it('should highlight active link on stats page', () => {
    renderWithRouter(<Navigation />, { route: '/stats' })
    const statsLink = screen.getByText('Statistics')
    expect(statsLink).toHaveClass('active')
  })

  it('should highlight active link on review page', () => {
    renderWithRouter(<Navigation />, { route: '/review-wrong' })
    const reviewLink = screen.getByText('Review Wrong')
    expect(reviewLink).toHaveClass('active')
  })

  it('should not render on session page', () => {
    renderWithRouter(<Navigation />, { route: '/session' })
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })
})

