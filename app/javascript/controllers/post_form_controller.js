import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submitButton"]

  connect() {
    console.log("Post form controller connected!")
    this.autoSaveTimeout = null
    this.lastSavedContent = ""
    this.lastSavedTitle = ""
  }

  disconnect() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }
  }

  // Auto-save functionality
  autoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft()
    }, 1000) // Save after 1 second of inactivity
  }

  saveDraft() {
    const formData = new FormData(this.element)
    const title = formData.get('post[title]') || ""
    const content = formData.get('post[content]') || ""
    
    // Only save if content has changed
    if (title !== this.lastSavedTitle || content !== this.lastSavedContent) {
      // Store in localStorage for now (could be enhanced with server-side drafts)
      const draft = {
        title: title,
        content: content,
        timestamp: new Date().toISOString(),
        spaceId: this.getSpaceId()
      }
      
      localStorage.setItem('post_draft', JSON.stringify(draft))
      
      this.lastSavedTitle = title
      this.lastSavedContent = content
      
      console.log("Draft saved")
    }
  }

  // Title field updates
  updateTitle() {
    // Update word count or other title-related functionality
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

  // Load draft from localStorage
  loadDraft() {
    const draftData = localStorage.getItem('post_draft')
    if (draftData) {
      try {
        const draft = JSON.parse(draftData)
        const spaceId = this.getSpaceId()
        
        // Only load draft if it's for the same space
        if (draft.spaceId === spaceId) {
          const titleField = this.element.querySelector('input[name="post[title]"]')
          const contentField = this.element.querySelector('input[name="post[content]"], textarea[name="post[content]"]')
          
          if (titleField && draft.title) {
            titleField.value = draft.title
          }
          
          if (contentField && draft.content) {
            contentField.value = draft.content
          }
          
          console.log("Draft loaded")
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }

  // Clear draft after successful submission
  clearDraft() {
    localStorage.removeItem('post_draft')
  }

  // Get current space ID from URL or form
  getSpaceId() {
    const url = window.location.pathname
    const match = url.match(/\/spaces\/([^\/]+)/)
    return match ? match[1] : null
  }

  // Form submission handling
  beforeSubmit(event) {
    // Clear draft on successful submission
    this.clearDraft()
    
    // Update submit button
    this.submitButtonTarget.disabled = true
    this.submitButtonTarget.textContent = "Publishing..."
  }

  // Keyboard shortcuts
  handleKeydown(event) {
    // Ctrl/Cmd + Enter to submit
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      if (!this.submitButtonTarget.disabled) {
        this.submitButtonTarget.click()
      }
    }
    
    // Ctrl/Cmd + S to save draft
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      this.saveDraft()
      console.log("Draft saved manually")
    }
  }
}
