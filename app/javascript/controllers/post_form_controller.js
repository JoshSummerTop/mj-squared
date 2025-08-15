import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submitButton"]

  connect() {
    console.log("Post form controller connected!")
  }

  // Title field updates
  updateTitle() {
    console.log("Title updated")
  }

  // Image upload handling
  handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB.')
        return
      }
      
      console.log("Image uploaded:", file.name)
    }
  }

  // Form submission handling
  beforeSubmit(event) {
    // Update submit button
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.textContent = "Publishing..."
    }
  }

  // Keyboard shortcuts
  handleKeydown(event) {
    // Ctrl/Cmd + Enter to submit
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      if (this.hasSubmitButtonTarget && !this.submitButtonTarget.disabled) {
        this.submitButtonTarget.click()
      }
    }
  }
}
