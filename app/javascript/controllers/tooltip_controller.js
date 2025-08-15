// Example usage:
// <div data-controller="tooltip" data-tooltip-content-value="Hello world"></div>

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { content: String }
  static targets = ["tooltip"]

  connect() {
    this.tooltip = null
    this.timeout = null
  }

  disconnect() {
    this.hideTooltip()
  }

  show(event) {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.createTooltip(event)
    }, 500) // Show after 500ms delay
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.hideTooltip()
  }

  createTooltip(event) {
    if (this.tooltip) {
      this.hideTooltip()
    }

    const content = this.contentValue || this.element.getAttribute('aria-label') || ''
    if (!content) return

    this.tooltip = document.createElement('div')
    this.tooltip.className = 'fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg pointer-events-none transition-opacity duration-200'
    this.tooltip.textContent = content

    document.body.appendChild(this.tooltip)

    // Position the tooltip
    const rect = this.element.getBoundingClientRect()
    const tooltipRect = this.tooltip.getBoundingClientRect()
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2)
    let top = rect.top - tooltipRect.height - 8

    // Adjust if tooltip goes off screen
    if (left < 8) left = 8
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8
    }
    if (top < 8) {
      top = rect.bottom + 8
    }

    this.tooltip.style.left = `${left}px`
    this.tooltip.style.top = `${top}px`
    this.tooltip.style.opacity = '0'
    
    // Fade in
    requestAnimationFrame(() => {
      this.tooltip.style.opacity = '1'
    })
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0'
      setTimeout(() => {
        if (this.tooltip && this.tooltip.parentNode) {
          this.tooltip.parentNode.removeChild(this.tooltip)
        }
        this.tooltip = null
      }, 200)
    }
  }
}
