// Add your own Custom Turbo StreamActions
// Define Rails helpers in `app/helpers/turbo_stream_actions_helper.rb`
//
// These actions run in the context of a turbo-stream element. You have access to methods like the following:
//
//   this.action - The action attribute value (for example: "append")
//   this.target - The target attribute value (the target element ID)
//   this.targetElements - An array of target elements the template will be rendered to
//   this.templateContent - The contents of the main `<template>`
//
// Source code for the stream element can be found here:
// https://github.com/hotwired/turbo/blob/main/src/elements/stream_element.ts

// Remove elements after X milliseconds
// <%= turbo_stream.remove_later, target: "my-id", after: "2000" %>
Turbo.StreamActions.remove_later = function() {
  setTimeout(() => {
    this.targetElements.forEach((element) => element.remove())
  }, this.getAttribute("after"))
}

// Resets a form
// <%= turbo_stream.reset_form "new_post"
Turbo.StreamActions.reset_form = function() {
  this.targetElements.forEach((element) => element.reset())
}

// Scrolls an element into view
// <%= turbo_stream.scroll_to "comment_1"
Turbo.StreamActions.scroll_to = function() {
  this.targetElements.forEach((element) => element.scrollIntoView({behavior: 'smooth'}))
}

// NEW: Modal Success State
// <%= turbo_stream.modal_success "modal_content", title: "Success!", message: "...", actions: [...] %>
Turbo.StreamActions.modal_success = function() {
  const title = this.getAttribute("title")
  const message = this.getAttribute("message")
  const actions = JSON.parse(this.getAttribute("actions") || "[]")
  
  const successHtml = `
    <div data-modal-content class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-8 text-center">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <!-- Title and Message -->
        <h3 class="text-xl font-bold text-gray-900 mb-3">${title}</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">${message}</p>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 justify-center">
          ${actions.map(action => `
            <a href="${action.url || '#'}" 
               class="${action.class || 'btn-primary'}"
               ${action.action ? `data-action="${action.action}"` : ''}
               ${action.turbo_frame ? `data-turbo-frame="${action.turbo_frame}"` : ''}
               ${action.method ? `data-turbo-method="${action.method}"` : ''}>
              ${action.text}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `
  
  this.targetElements.forEach(element => {
    element.innerHTML = successHtml
  })
}

// Modal Error State
// <%= turbo_stream.modal_error "modal_content", title: "Error", message: "...", errors: [...] %>
Turbo.StreamActions.modal_error = function() {
  const title = this.getAttribute("title")
  const message = this.getAttribute("message") 
  const errors = JSON.parse(this.getAttribute("errors") || "[]")
  
  const errorHtml = `
    <div data-modal-content class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="p-8 text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <!-- Title and Message -->
        <h3 class="text-xl font-bold text-gray-900 mb-3">${title}</h3>
        <p class="text-gray-600 mb-4">${message}</p>
        
        <!-- Error List -->
        ${errors.length > 0 ? `
          <ul class="text-sm text-red-600 mb-6 text-left bg-red-50 rounded-md p-4">
            ${errors.map(error => `<li class="mb-1">• ${error}</li>`).join('')}
          </ul>
        ` : ''}
        
        <!-- Close Button -->
        <button type="button" 
                data-action="turbo-modal#close" 
                class="btn-secondary">
          Close
        </button>
      </div>
    </div>
  `
  
  this.targetElements.forEach(element => {
    element.innerHTML = errorHtml
  })
}

// Flash Message Action
// <%= turbo_stream.flash_message "Success!", type: "success" %>
Turbo.StreamActions.flash_message = function() {
  const message = this.getAttribute("message")
  const type = this.getAttribute("type") || "success"
  const duration = parseInt(this.getAttribute("duration")) || 5000
  const dismissible = this.getAttribute("dismissible") !== "false"
  
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const flashHtml = `
    <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div class="flash-message p-4 rounded-lg shadow-lg border ${typeClasses[type] || typeClasses.info}">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">${message}</p>
          ${dismissible ? `
            <button class="ml-4 text-lg leading-none hover:opacity-70 transition-opacity" 
                    onclick="this.parentElement.parentElement.parentElement.remove()">
              ×
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', flashHtml)
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      const flashElement = document.querySelector('.flash-message:last-child')?.parentElement?.parentElement
      if (flashElement) {
        flashElement.style.opacity = '0'
        flashElement.style.transform = 'translateX(100%)'
        setTimeout(() => flashElement.remove(), 300)
      }
    }, duration)
  }
}

// Loading State Action  
// <%= turbo_stream.loading_state "form_container", show: true %>
Turbo.StreamActions.loading_state = function() {
  const show = this.getAttribute("show") === "true"
  
  this.targetElements.forEach(element => {
    if (show) {
      element.style.pointerEvents = "none"
      element.style.opacity = "0.7"
      element.classList.add("loading")
      
      // Add loading spinner if not present
      if (!element.querySelector('.loading-spinner')) {
        const spinner = document.createElement('div')
        spinner.className = 'loading-spinner absolute inset-0 flex items-center justify-center bg-white/75'
        spinner.innerHTML = `
          <svg class="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `
        element.style.position = 'relative'
        element.appendChild(spinner)
      }
    } else {
      element.style.pointerEvents = ""
      element.style.opacity = ""
      element.classList.remove("loading")
      
      // Remove loading spinner
      const spinner = element.querySelector('.loading-spinner')
      if (spinner) spinner.remove()
    }
  })
}

// Redirect to Path Action
// <%= turbo_stream.redirect_to_path root_path, delay: 100 %>
Turbo.StreamActions.redirect_to_path = function() {
  const path = this.getAttribute("path")
  const delay = parseInt(this.getAttribute("delay") || "0", 10)
  
  // First, close any open modals
  const openDialogs = document.querySelectorAll('dialog[open]')
  openDialogs.forEach(dialog => dialog.close())
  
  // Then navigate to the path
  setTimeout(() => {
    Turbo.visit(path)
  }, delay)
}
