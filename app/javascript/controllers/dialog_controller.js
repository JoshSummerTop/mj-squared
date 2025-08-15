import { Controller } from "@hotwired/stimulus"

// Simple, proven dialog controller based on hotfin/hanny pattern
export default class extends Controller {
  connect() {
    // Add click handler for backdrop clicks
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close()
      }
    })
  }

  disconnect() {
    this.element.remove()
  }

  open() {
    this.element.show()
    requestAnimationFrame(() => this.element.classList.add("open"))
    // Prevent body scroll
    document.body.classList.add("overflow-hidden")
  }

  close() {
    this.element.classList.remove("open")
    this.element.close()
    // Restore body scroll
    document.body.classList.remove("overflow-hidden")
  }
}
