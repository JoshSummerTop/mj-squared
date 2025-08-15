import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      this.dismiss()
    }, 5000)
  }

  dismiss() {
    this.element.style.opacity = '0'
    this.element.style.transform = 'translateX(100%)'
    setTimeout(() => {
      this.element.remove()
    }, 300)
  }
}
