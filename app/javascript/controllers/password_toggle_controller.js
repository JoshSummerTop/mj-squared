import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["password", "toggle"]

  toggle() {
    const passwordField = this.passwordTarget
    const toggleButton = this.toggleTarget
    
    if (passwordField.type === "password") {
      passwordField.type = "text"
      toggleButton.innerHTML = this.hideIcon()
    } else {
      passwordField.type = "password"
      toggleButton.innerHTML = this.showIcon()
    }
  }

  showIcon() {
    return `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `
  }

  hideIcon() {
    return `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `
  }
}
