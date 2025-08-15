import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggleable"]

  connect() {
    this.boundHandleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.boundHandleResize)
  }

  disconnect() {
    window.removeEventListener('resize', this.boundHandleResize)
  }

  toggle() {
    this.toggleableTargets.forEach(target => {
      target.classList.toggle('hidden')
    })
  }

  handleResize() {
    // If screen is large (lg breakpoint and above), ensure menu is visible
    if (window.innerWidth >= 1024) {
      this.toggleableTargets.forEach(target => {
        target.classList.remove('hidden')
      })
    } else {
      // If screen is small, ensure menu is hidden by default
      this.toggleableTargets.forEach(target => {
        target.classList.add('hidden')
      })
    }
  }
}
