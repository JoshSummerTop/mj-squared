import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

console.log("Rich composer controller file loaded!")

export default class extends Controller {
  static targets = ["hidden"]
  static values = { 
    uploadUrl: String, 
    placeholder: String, 
    submitOnEnter: { type: Boolean, default: true }
  }

  connect() {
    console.log("Rich composer controller connected!")
    console.log("Placeholder:", this.placeholderValue)
    console.log("Hidden target:", this.hiddenTarget)
    
    // Check if hidden target exists
    if (!this.hasHiddenTarget) {
      console.error("Rich composer: No hidden target found!")
      return
    }
    
    // Store reference to this controller on the element for external access
    this.element.richComposerController = this
    
    // Keep the hidden input in place; append our shell after it
    this.hidden = this.hiddenTarget

    const container = document.createElement('div')
    container.className = 'rich-composer-shell h-full flex flex-col'
    container.innerHTML = `
      <!-- Enhanced Main Toolbar -->
      <div class="flex items-center justify-between p-3 border-b border-gray-100 bg-white rounded-t-xl">
        <!-- Left side: Media and formatting tools -->
        <div class="flex items-center space-x-1">
          <!-- Media Buttons Group -->
          <div class="flex items-center space-x-1 pr-3 border-r border-gray-200">
            <button type="button" data-role="btn-image" data-action="click->rich-composer#showImageUploadModal" data-controller="tooltip" data-tooltip-content-value="📷 Upload Images" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Upload Images">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </button>
            
            <button type="button" data-role="btn-video" data-action="click->rich-composer#showVideoLinkModal" data-controller="tooltip" data-tooltip-content-value="🎥 Add Video" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Add Video">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23,7 16,12 23,17 23,7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </button>
            
            <button type="button" data-role="btn-link" data-action="click->rich-composer#showLinkModal" data-controller="tooltip" data-tooltip-content-value="🔗 Add Link" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Add Link">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>
          </div>
          
          <!-- Text Formatting Group -->
          <div class="flex items-center space-x-1 pl-3">
            <button type="button" data-role="btn-bold" data-action="mousedown->rich-composer#bold" data-controller="tooltip" data-tooltip-content-value="Bold (Ctrl+B)" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Bold">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              </svg>
            </button>
            <button type="button" data-role="btn-italic" data-action="mousedown->rich-composer#italic" data-controller="tooltip" data-tooltip-content-value="Italic (Ctrl+I)" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Italic">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="4" x2="10" y2="4"/>
                <line x1="14" y1="20" x2="5" y2="20"/>
                <line x1="15" y1="4" x2="9" y2="20"/>
              </svg>
            </button>
            <button type="button" data-role="btn-underline" data-action="mousedown->rich-composer#underline" data-controller="tooltip" data-tooltip-content-value="Underline (Ctrl+U)" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Underline">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
                <line x1="4" y1="21" x2="20" y2="21"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Right side: More formatting options -->
        <div class="flex items-center space-x-1">
          <!-- Lists Group -->
          <div class="flex items-center space-x-1 pr-3 border-r border-gray-200">
            <button type="button" data-role="btn-bullet" data-action="mousedown->rich-composer#bulletList" data-controller="tooltip" data-tooltip-content-value="Bullet List" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Bullet List">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button type="button" data-role="btn-ordered" data-action="mousedown->rich-composer#orderedList" data-controller="tooltip" data-tooltip-content-value="Numbered List" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors group" aria-label="Numbered List">
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="10" y1="6" x2="21" y2="6"/>
                <line x1="10" y1="12" x2="21" y2="12"/>
                <line x1="10" y1="18" x2="21" y2="18"/>
                <path d="M4 6h1v4"/>
                <path d="M4 10h2"/>
                <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
              </svg>
            </button>
          </div>
          
          <!-- Advanced Formatting Toggle -->
          <button type="button" data-role="btn-formatting-toggle" data-action="click->rich-composer#toggleFormattingPanel" data-controller="tooltip" data-tooltip-content-value="More formatting options" class="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 transition-all duration-200 group" aria-label="More Formatting">
            <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-transform duration-200" data-role="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Enhanced Secondary Formatting Panel -->
      <div class="hidden overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 border-b border-gray-100" data-role="formatting-panel">
        <div class="flex flex-wrap items-center gap-1 p-3">
          <!-- Headings -->
          <div class="flex items-center space-x-1 pr-3 border-r border-gray-200">
            <button type="button" data-role="btn-h1" data-action="mousedown->rich-composer#heading1" data-controller="tooltip" data-tooltip-content-value="Heading 1" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors text-xs font-bold text-gray-700" aria-label="Heading 1">
              H1
            </button>
            <button type="button" data-role="btn-h2" data-action="mousedown->rich-composer#heading2" data-controller="tooltip" data-tooltip-content-value="Heading 2" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors text-xs font-bold text-gray-700" aria-label="Heading 2">
              H2
            </button>
            <button type="button" data-role="btn-h3" data-action="mousedown->rich-composer#heading3" data-controller="tooltip" data-tooltip-content-value="Heading 3" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors text-xs font-bold text-gray-700" aria-label="Heading 3">
              H3
            </button>
          </div>
          
          <!-- Text Style -->
          <div class="flex items-center space-x-1 pl-3 pr-3 border-r border-gray-200">
            <button type="button" data-role="btn-strikethrough" data-action="mousedown->rich-composer#strikethrough" data-controller="tooltip" data-tooltip-content-value="Strikethrough" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors" aria-label="Strikethrough">
              <svg class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4H9a3 3 0 0 0-2.83 4"/>
                <path d="M14 12a4 4 0 0 1 0 8H6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
              </svg>
            </button>
            <button type="button" data-role="btn-code" data-action="mousedown->rich-composer#codeBlock" data-controller="tooltip" data-tooltip-content-value="Code Block" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors" aria-label="Code Block">
              <svg class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16,18 22,12 16,6"/>
                <polyline points="8,6 2,12 8,18"/>
              </svg>
            </button>
            <button type="button" data-role="btn-quote" data-action="mousedown->rich-composer#blockquote" data-controller="tooltip" data-tooltip-content-value="Quote" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors" aria-label="Quote">
              <svg class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              </svg>
            </button>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-1 pl-3">
            <button type="button" data-role="btn-undo" data-action="mousedown->rich-composer#undo" data-controller="tooltip" data-tooltip-content-value="Undo (Ctrl+Z)" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors" aria-label="Undo">
              <svg class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7v6h6"/>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
              </svg>
            </button>
            <button type="button" data-role="btn-redo" data-action="mousedown->rich-composer#redo" data-controller="tooltip" data-tooltip-content-value="Redo (Ctrl+Y)" class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 transition-colors" aria-label="Redo">
              <svg class="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 7v6h-6"/>
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Editor Area -->
      <div class="flex-1 min-h-0">
        <div class="h-full">
          <div contenteditable="true" 
               class="w-full h-full p-4 border-0 focus:outline-none text-gray-900 leading-relaxed resize-none overflow-y-auto" 
               data-role="editable-content" 
               placeholder="${this.placeholderValue || 'Write something...'}"
               style="min-height: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          </div>
        </div>
      </div>
      
      <!-- Enhanced Image Upload Modal -->
      <div data-role="image-upload-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">Upload Images</h3>
            <button type="button" data-action="click->rich-composer#closeImageUploadModal" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            <!-- Drag & Drop Area -->
            <div data-role="drop-zone" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="mt-4 text-sm text-gray-600">
                <span class="font-medium">Drag and drop images here</span> or 
                <button type="button" data-action="click->rich-composer#triggerImageFileInput" class="text-blue-600 hover:text-blue-500 font-medium">browse files</button>
              </p>
              <p class="text-xs text-gray-500 mt-2">PNG, JPG, GIF, WebP up to 10MB</p>
            </div>
            
            <input type="file" data-role="image-file-input" class="hidden" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" multiple>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Video Link Modal -->
      <div data-role="video-link-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">Add Video</h3>
            <button type="button" data-action="click->rich-composer#closeVideoLinkModal" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input type="url" data-role="video-url-input" placeholder="https://www.youtube.com/watch?v=..." class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" data-action="click->rich-composer#closeVideoLinkModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="button" data-action="click->rich-composer#insertVideoLink" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Insert Video
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Link Modal -->
      <div data-role="link-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">Add Link</h3>
            <button type="button" data-action="click->rich-composer#closeLinkModal" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
              <input type="text" data-role="link-text-input" placeholder="Link text..." class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input type="url" data-role="link-url-input" placeholder="https://..." class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" data-action="click->rich-composer#closeLinkModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button type="button" data-action="click->rich-composer#insertLink" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Insert Link
              </button>
            </div>
          </div>
        </div>
      </div>
    `

    // Insert the container after the hidden input
    this.hidden.parentNode.insertBefore(container, this.hidden.nextSibling)
    
    // Set up event listeners  
    this.setupEventListeners(container)
  }

  connectTooltipControllers(container) {
    // Stimulus automatically discovers controllers when elements are added to the DOM
    // But sometimes we need to force a rescan for dynamically created content
    if (this.application) {
      // Small delay to ensure DOM is ready, then force Stimulus to rescan
      setTimeout(() => {
        try {
          // Force Stimulus to scan for new controllers
          this.application.start()

        } catch (error) {
          console.warn('Error connecting Stimulus controllers:', error)
        }
      }, 10)
    }
  }

  initializeContentEditable(container) {
    const editableContent = container.querySelector('[data-role="editable-content"]')
    
    // Set initial content - handle ActionText wrapped content
    if (this.hiddenTarget.value) {
      // Extract content from ActionText wrapper if present
      let content = this.hiddenTarget.value
      
      // If it's ActionText content, extract the inner content
      if (content.includes('trix-content')) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content
        const trixContent = tempDiv.querySelector('.trix-content')
        if (trixContent) {
          content = trixContent.innerHTML
        }
      }
      
      editableContent.innerHTML = content
    }
    
    // Update hidden input when content changes
    editableContent.addEventListener('input', () => {
      // Auto-link URLs
      this.autoLinkUrls(editableContent)
      
      // Wrap content in ActionText format if needed
      let content = editableContent.innerHTML
      
      // Check if we need to wrap in ActionText format
      if (!content.includes('trix-content')) {
        content = `<div class="trix-content">${content}</div>`
      }
      
      this.hiddenTarget.value = content
    })
    
    // Handle keyboard shortcuts
    editableContent.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            this.bold()
            break
          case 'i':
            e.preventDefault()
            this.italic()
            break
          case 'u':
            e.preventDefault()
            this.underline()
            break
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault()
              this.undo()
            }
            break
          case 'y':
            e.preventDefault()
            this.redo()
            break
        }
      }
    })
    
    // Update button states when selection changes - more controlled approach
    const updateStatesDelayed = () => {
      // Use a longer delay to ensure DOM updates have processed
      setTimeout(() => this.updateButtonStates(), 150)
    }
    
    // Only listen to selection changes for real-time updates when not clicking buttons
    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (editableContent.contains(range.commonAncestorContainer)) {
          updateStatesDelayed()
        }
      }
    })
    
    // Update when focus changes or keyboard navigation happens
    editableContent.addEventListener('keyup', (e) => {
      // Only update on navigation keys, not on formatting shortcuts
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
        updateStatesDelayed()
      }
    })
    
    editableContent.addEventListener('click', () => {
      updateStatesDelayed()
    })

    // Force update button states when focus is lost
    editableContent.addEventListener('blur', () => {
      setTimeout(() => {
        this.updateButtonStates()
      }, 50)
    })

    // Force update button states when focus is gained
    editableContent.addEventListener('focus', () => {
      setTimeout(() => {
        this.updateButtonStates()
      }, 50)
    })
  }

  setupEventListeners(container) {
    // Image upload modal
    const imageModal = container.querySelector('[data-role="image-upload-modal"]')
    const dropZone = container.querySelector('[data-role="drop-zone"]')
    const fileInput = container.querySelector('[data-role="image-file-input"]')
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.classList.add('border-blue-500', 'bg-blue-50')
    })
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-500', 'bg-blue-50')
    })
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-blue-500', 'bg-blue-50')
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      if (files.length > 0) {
        this.handleImageUpload(files)
      }
    })
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files)
      if (files.length > 0) {
        this.handleImageUpload(files)
      }
    })

    // Add tooltip event listeners
    const tooltipButtons = container.querySelectorAll('[data-controller="tooltip"]')
    tooltipButtons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        const tooltipController = this.application.getControllerForElementAndIdentifier(button, 'tooltip')
        if (tooltipController) {
          tooltipController.show(e)
        }
      })
      
      button.addEventListener('mouseleave', () => {
        const tooltipController = this.application.getControllerForElementAndIdentifier(button, 'tooltip')
        if (tooltipController) {
          tooltipController.hide()
        }
      })
    })

    // Initialize content editable
    this.initializeContentEditable(container)
  }

  // Modal actions
  showImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.remove('hidden')
  }

  closeImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.add('hidden')
  }

  triggerImageFileInput() {
    const fileInput = this.element.querySelector('[data-role="image-file-input"]')
    fileInput.click()
  }

  showVideoLinkModal() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    modal.classList.remove('hidden')
  }

  closeVideoLinkModal() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    modal.classList.add('hidden')
  }

  showLinkModal() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    modal.classList.remove('hidden')
  }

  closeLinkModal() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    modal.classList.add('hidden')
  }

  // Toolbar actions
  toggleFormattingPanel() {
    const panel = this.element.querySelector('[data-role="formatting-panel"]')
    const chevron = this.element.querySelector('[data-role="chevron-icon"]')
    
    if (panel.classList.contains('hidden')) {
      panel.classList.remove('hidden')
      chevron.style.transform = 'rotate(180deg)'
    } else {
      panel.classList.add('hidden')
      chevron.style.transform = 'rotate(0deg)'
    }
  }

  // Formatting actions
  bold() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('bold', false, null)
    
    // Force update after DOM processes the change
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  italic() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('italic', false, null)
    
    // Force update after DOM processes the change
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  underline() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('underline', false, null)
    
    // Force update after DOM processes the change
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  strikethrough() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('strikeThrough', false, null)
    
    // Force update after DOM processes the change
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  heading1() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('formatBlock', false, 'h1')
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  heading2() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('formatBlock', false, 'h2')
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  heading3() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('formatBlock', false, 'h3')
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  bulletList() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('insertUnorderedList', false, null)
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  orderedList() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('insertOrderedList', false, null)
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  blockquote() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('formatBlock', false, 'blockquote')
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  codeBlock() { 
    // More Google Docs-like behavior for code blocks
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    
    // Check if we're already in a code block
    let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container
    let codeElement = null
    
    while (element && element !== this.element) {
      if (element.nodeType === Node.ELEMENT_NODE && (element.tagName === 'PRE' || element.tagName === 'CODE')) {
        codeElement = element
        break
      }
      element = element.parentNode
    }
    
    if (codeElement) {
      // We're in a code block - remove it (toggle off)
      const parent = codeElement.parentNode
      const textContent = codeElement.textContent
      const textNode = document.createTextNode(textContent)
      parent.replaceChild(textNode, codeElement)
      
      // Restore selection
      const newRange = document.createRange()
      newRange.selectNodeContents(textNode)
      selection.removeAllRanges()
      selection.addRange(newRange)
    } else {
      // Not in a code block - create one (toggle on)
      if (range.collapsed) {
        // If no selection, create a new code block with placeholder
        const pre = document.createElement('pre')
        pre.style.cssText = 'background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 8px; font-family: monospace; white-space: pre-wrap; margin: 8px 0;'
        pre.textContent = 'Enter your code here...'
        
        range.insertNode(pre)
        
        // Select the placeholder text
        const newRange = document.createRange()
        newRange.selectNodeContents(pre)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        // If there's a selection, wrap it in a code block
        const selectedText = range.toString()
        const pre = document.createElement('pre')
        pre.style.cssText = 'background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 8px; font-family: monospace; white-space: pre-wrap; margin: 8px 0;'
        pre.textContent = selectedText
        
        range.deleteContents()
        range.insertNode(pre)
        
        // Place cursor at the end of the code block
        const newRange = document.createRange()
        newRange.setStartAfter(pre)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    
    // Update button states after the DOM has processed the changes
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  undo() { 
    document.execCommand('undo', false, null)
    this.updateButtonStates()
  }
  
  redo() { 
    document.execCommand('redo', false, null)
    this.updateButtonStates()
  }
  
  // Alignment
  alignLeft() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('justifyLeft', false, null)
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  alignCenter() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('justifyCenter', false, null)
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }
  
  alignRight() { 
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    document.execCommand('justifyRight', false, null)
    
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }

  // Image upload
  showImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.remove('hidden')
  }

  closeImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.add('hidden')
  }

  triggerImageFileInput() {
    const fileInput = this.element.querySelector('[data-role="image-file-input"]')
    fileInput.click()
  }

  async handleImageUpload(files) {
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    
    for (const file of files) {
      try {
        // Show loading state
        const loadingText = document.createElement('div')
        loadingText.className = 'text-gray-500 text-sm italic'
        loadingText.textContent = `Uploading ${file.name}...`
        editableContent.appendChild(loadingText)
        
        // Upload to ActiveStorage
        const upload = new DirectUpload(file, '/rails/active_storage/direct_uploads')
        
        upload.create((error, attributes) => {
          // Remove loading text
          loadingText.remove()
          
          if (error) {
            console.error('Upload error:', error)
            // Show error message
            const errorText = document.createElement('div')
            errorText.className = 'text-red-500 text-sm'
            errorText.textContent = `Failed to upload ${file.name}`
            editableContent.appendChild(errorText)
            return
          }
          
          // Create image element with smaller size
          const img = document.createElement('img')
          img.src = `/rails/active_storage/blobs/redirect/${attributes.signed_id}/${attributes.filename}`
          img.alt = file.name
          img.className = 'max-w-full h-auto rounded-lg my-2'
          img.style.maxHeight = '300px'
          img.style.maxWidth = '100%'
          
          // Insert image at cursor position or at end
          const selection = window.getSelection()
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.deleteContents()
            range.insertNode(img)
            // Add a line break after the image
            range.setStartAfter(img)
            range.insertNode(document.createElement('br'))
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            // If no selection, append to end
            editableContent.appendChild(img)
            editableContent.appendChild(document.createElement('br'))
          }
          
          // Update hidden input with ActionText wrapper
          let content = editableContent.innerHTML
          if (!content.includes('trix-content')) {
            content = `<div class="trix-content">${content}</div>`
          }
          this.hiddenTarget.value = content
        })
      } catch (error) {
        console.error('Image upload failed:', error)
        // Show error message
        const errorText = document.createElement('div')
        errorText.className = 'text-red-500 text-sm'
        errorText.textContent = `Failed to upload ${file.name}`
        editableContent.appendChild(errorText)
      }
    }
    
    this.closeImageUploadModal()
  }

  // Video link
  showVideoLinkModal() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    modal.classList.remove('hidden')
  }

  closeVideoLinkModal() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    modal.classList.add('hidden')
    const input = modal.querySelector('[data-role="video-url-input"]')
    input.value = ''
  }

  insertVideoLink() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    const input = modal.querySelector('[data-role="video-url-input"]')
    const url = input.value.trim()
    
    console.log('Inserting video link:', url)
    
    if (!url) {
      console.log('No URL provided')
      return
    }
    
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    const videoEmbed = this.createVideoEmbed(url)
    
    console.log('Created video embed:', videoEmbed)
    
    if (videoEmbed) {
      // Focus the editable content first
      editableContent.focus()
      
      const selection = window.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        // Check if the range is within our editable content
        if (editableContent.contains(range.commonAncestorContainer)) {
          range.deleteContents()
          range.insertNode(videoEmbed)
          range.setStartAfter(videoEmbed)
          range.insertNode(document.createElement('br'))
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
          console.log('Inserted video at cursor position')
        } else {
          // If selection is not in our content, append to end
          editableContent.appendChild(videoEmbed)
          editableContent.appendChild(document.createElement('br'))
          console.log('Inserted video at end (selection not in content)')
        }
      } else {
        // No selection, append to end
        editableContent.appendChild(videoEmbed)
        editableContent.appendChild(document.createElement('br'))
        console.log('Inserted video at end (no selection)')
      }
      
      // Force a reflow to ensure the video is visible
      videoEmbed.offsetHeight
      
      // Add a small delay to ensure the video is rendered
      setTimeout(() => {
        console.log('Video element after insertion:', videoEmbed)
        console.log('Video element visible:', videoEmbed.offsetHeight > 0)
        console.log('Video element in DOM:', document.contains(videoEmbed))
      }, 100)
      
      // Update hidden input with ActionText wrapper
      let content = editableContent.innerHTML
      if (!content.includes('trix-content')) {
        content = `<div class="trix-content">${content}</div>`
      }
      this.hiddenTarget.value = content
      console.log('Updated hidden input with video')
      console.log('Final content:', content)
    } else {
      console.log('Failed to create video embed')
    }
    
    this.closeVideoLinkModal()
  }

  createVideoEmbed(url) {
    console.log('Creating video embed for URL:', url)
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      const videoId = youtubeMatch[1]
      console.log('YouTube video ID:', videoId)
      
      // Create a wrapper div for better styling
      const wrapper = document.createElement('div')
      wrapper.className = 'video-embed-wrapper my-4'
      wrapper.style.cssText = 'max-width: 600px; width: 100%; margin: 10px 0;'
      
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.youtube.com/embed/${videoId}`
      iframe.width = '100%'
      iframe.height = '315'
      iframe.frameBorder = '0'
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      iframe.allowFullscreen = true
      iframe.className = 'rounded-lg'
      iframe.style.cssText = 'width: 100%; height: 315px; border: none; display: block;'
      
      wrapper.appendChild(iframe)
      console.log('Created YouTube wrapper with iframe:', wrapper)
      return wrapper
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      const videoId = vimeoMatch[1]
      console.log('Vimeo video ID:', videoId)
      
      // Create a wrapper div for better styling
      const wrapper = document.createElement('div')
      wrapper.className = 'video-embed-wrapper my-4'
      wrapper.style.cssText = 'max-width: 600px; width: 100%; margin: 10px 0;'
      
      const iframe = document.createElement('iframe')
      iframe.src = `https://player.vimeo.com/video/${videoId}`
      iframe.width = '100%'
      iframe.height = '315'
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen; picture-in-picture'
      iframe.allowFullscreen = true
      iframe.className = 'rounded-lg'
      iframe.style.cssText = 'width: 100%; height: 315px; border: none; display: block;'
      
      wrapper.appendChild(iframe)
      console.log('Created Vimeo wrapper with iframe:', wrapper)
      return wrapper
    }
    
    // Generic video link
    console.log('Creating generic video link')
    const link = document.createElement('a')
    link.href = url
    link.textContent = url
    link.className = 'text-blue-600 hover:text-blue-800 underline break-all'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    console.log('Created generic link:', link)
    return link
  }

  // Link
  showLinkModal() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    modal.classList.remove('hidden')
    
    // Pre-fill with selected text
    const selection = window.getSelection()
    if (selection.toString()) {
      const textInput = modal.querySelector('[data-role="link-text-input"]')
      textInput.value = selection.toString()
    }
  }

  closeLinkModal() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    modal.classList.add('hidden')
    const textInput = modal.querySelector('[data-role="link-text-input"]')
    const urlInput = modal.querySelector('[data-role="link-url-input"]')
    textInput.value = ''
    urlInput.value = ''
  }

  insertLink() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    const textInput = modal.querySelector('[data-role="link-text-input"]')
    const urlInput = modal.querySelector('[data-role="link-url-input"]')
    
    const text = textInput.value.trim()
    const url = urlInput.value.trim()
    
    console.log('Inserting link:', { text, url })
    
    if (!text || !url) {
      console.log('Missing text or URL')
      return
    }
    
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    
    // Focus the editable content first
    editableContent.focus()
    
    const link = document.createElement('a')
    link.href = url
    link.textContent = text
    link.className = 'text-blue-600 hover:text-blue-800 underline'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      // Check if the range is within our editable content
      if (editableContent.contains(range.commonAncestorContainer)) {
        range.deleteContents()
        range.insertNode(link)
        range.setStartAfter(link)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
        console.log('Inserted link at cursor position')
      } else {
        // If selection is not in our content, append to end
        editableContent.appendChild(link)
        console.log('Inserted link at end (selection not in content)')
      }
    } else {
      // No selection, append to end
      editableContent.appendChild(link)
      console.log('Inserted link at end (no selection)')
    }
    
    // Update hidden input with ActionText wrapper
    let content = editableContent.innerHTML
    if (!content.includes('trix-content')) {
      content = `<div class="trix-content">${content}</div>`
    }
    this.hiddenTarget.value = content
    console.log('Updated hidden input with link')
    this.closeLinkModal()
  }

  updateButtonStates() {
    // Make sure we have focus on the content editable first
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    if (!editableContent) return

    // Force a small delay to ensure DOM is updated before checking states  
    setTimeout(() => {
      const buttons = {}
      
      // Check each formatting state with proper error handling
      try { 
        buttons['btn-bold'] = document.queryCommandState('bold')
      } catch (e) { 
        buttons['btn-bold'] = false 
      }
      
      try { 
        buttons['btn-italic'] = document.queryCommandState('italic')
      } catch (e) { 
        buttons['btn-italic'] = false 
      }
      
      try { 
        buttons['btn-underline'] = document.queryCommandState('underline')
      } catch (e) { 
        buttons['btn-underline'] = false 
      }
      
      try { 
        buttons['btn-strikethrough'] = document.queryCommandState('strikeThrough')
      } catch (e) { 
        buttons['btn-strikethrough'] = false 
      }
      
      // For block-level formatting, we need to check if cursor is actually within the block
      const selection = window.getSelection()
      const hasSelection = selection.rangeCount > 0
      
      if (hasSelection) {
        const range = selection.getRangeAt(0)
        const isInEditable = editableContent.contains(range.commonAncestorContainer)
        
        if (isInEditable) {
          try { buttons['btn-h1'] = this.isHeadingActive(1) } catch (e) { buttons['btn-h1'] = false }
          try { buttons['btn-h2'] = this.isHeadingActive(2) } catch (e) { buttons['btn-h2'] = false }
          try { buttons['btn-h3'] = this.isHeadingActive(3) } catch (e) { buttons['btn-h3'] = false }
          try { buttons['btn-bullet'] = this.isListActive('ul') } catch (e) { buttons['btn-bullet'] = false }
          try { buttons['btn-ordered'] = this.isListActive('ol') } catch (e) { buttons['btn-ordered'] = false }
          try { buttons['btn-quote'] = this.isBlockActive('blockquote') } catch (e) { buttons['btn-quote'] = false }
          try { buttons['btn-code'] = this.isBlockActive('pre') } catch (e) { buttons['btn-code'] = false }
          try { buttons['btn-align-left'] = this.isAlignmentActive('left') } catch (e) { buttons['btn-align-left'] = false }
          try { buttons['btn-align-center'] = this.isAlignmentActive('center') } catch (e) { buttons['btn-align-center'] = false }
          try { buttons['btn-align-right'] = this.isAlignmentActive('right') } catch (e) { buttons['btn-align-right'] = false }
        } else {
          // If selection is not in editable content, all block formatting should be false
          buttons['btn-h1'] = false
          buttons['btn-h2'] = false
          buttons['btn-h3'] = false
          buttons['btn-bullet'] = false
          buttons['btn-ordered'] = false
          buttons['btn-quote'] = false
          buttons['btn-code'] = false
          buttons['btn-align-left'] = false
          buttons['btn-align-center'] = false
          buttons['btn-align-right'] = false
        }
      } else {
        // No selection, all block formatting should be false
        buttons['btn-h1'] = false
        buttons['btn-h2'] = false
        buttons['btn-h3'] = false
        buttons['btn-bullet'] = false
        buttons['btn-ordered'] = false
        buttons['btn-quote'] = false
        buttons['btn-code'] = false
        buttons['btn-align-left'] = false
        buttons['btn-align-center'] = false
        buttons['btn-align-right'] = false
      }
      
      // Update button visual states
      Object.entries(buttons).forEach(([role, isActive]) => {
        const button = this.element.querySelector(`[data-role="${role}"]`)
        if (button) {
          // Always clear all states first to ensure clean toggle
          button.classList.remove('bg-blue-100', 'text-blue-700', 'shadow-sm', 'hover:bg-gray-100')
          button.style.borderColor = 'transparent'
          
          if (isActive) {
            // Active state - more prominent like Google Docs
            button.classList.add('bg-blue-100', 'text-blue-700', 'shadow-sm')
            button.setAttribute('aria-pressed', 'true')
            button.style.borderColor = '#3b82f6'
          } else {
            // Inactive state
            button.classList.add('hover:bg-gray-100')
            button.setAttribute('aria-pressed', 'false')
          }
        }
      })
    }, 100) // Increased delay to ensure DOM updates are processed
  }

  isHeadingActive(level) {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return false
    
    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    
    // Check if we're in a heading element
    let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container
    while (element && element !== this.element) {
      if (element.nodeType === Node.ELEMENT_NODE && element.tagName === `H${level}`) {
        // Check if the selection spans the entire heading or is collapsed within it
        const headingElement = element
        const rangeStart = range.startContainer
        const rangeEnd = range.endContainer
        
        // If selection is collapsed (cursor position), check if it's within the heading
        if (range.collapsed) {
          return headingElement.contains(rangeStart) || headingElement === rangeStart
        }
        
        // If selection spans multiple elements, check if it starts and ends within the heading
        return headingElement.contains(rangeStart) && headingElement.contains(rangeEnd)
      }
      element = element.parentNode
    }
    return false
  }

  isListActive(listType) {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return false
    
    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    
    let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container
    while (element && element !== this.element) {
      if (element.nodeType === Node.ELEMENT_NODE && element.tagName === listType.toUpperCase()) {
        // Check if the selection is within the list
        const listElement = element
        const rangeStart = range.startContainer
        const rangeEnd = range.endContainer
        
        // If selection is collapsed (cursor position), check if it's within the list
        if (range.collapsed) {
          return listElement.contains(rangeStart) || listElement === rangeStart
        }
        
        // If selection spans multiple elements, check if it starts and ends within the list
        return listElement.contains(rangeStart) && listElement.contains(rangeEnd)
      }
      element = element.parentNode
    }
    return false
  }

  isBlockActive(blockType) {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) return false
    
    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    
    let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container
    while (element && element !== this.element) {
      if (element.nodeType === Node.ELEMENT_NODE) {
        // For code blocks, check both PRE and CODE elements
        const tagName = element.tagName
        const targetTag = blockType.toUpperCase()
        
        if (tagName === targetTag || 
            (targetTag === 'PRE' && (tagName === 'PRE' || tagName === 'CODE'))) {
          // Check if the selection is within the block
          const blockElement = element
          const rangeStart = range.startContainer
          const rangeEnd = range.endContainer
          
          // If selection is collapsed (cursor position), check if it's within the block
          if (range.collapsed) {
            return blockElement.contains(rangeStart) || blockElement === rangeStart
          }
          
          // If selection spans multiple elements, check if it starts and ends within the block
          return blockElement.contains(rangeStart) && blockElement.contains(rangeEnd)
        }
      }
      element = element.parentNode
    }
    return false
  }

  isAlignmentActive(alignment) {
    try {
      // Use document.queryCommandState for more reliable alignment detection
      switch(alignment) {
        case 'left':
          return document.queryCommandState('justifyLeft')
        case 'center':
          return document.queryCommandState('justifyCenter')
        case 'right':
          return document.queryCommandState('justifyRight')
        case 'justify':
          return document.queryCommandState('justifyFull')
        default:
          return false
      }
    } catch (error) {
      // Fallback to style checking if queryCommandState fails
      const selection = window.getSelection()
      if (selection.rangeCount === 0) return false
      
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      
      let element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container
      while (element && element !== this.element) {
        if (element.nodeType === Node.ELEMENT_NODE && element instanceof Element) {
          try {
            const style = window.getComputedStyle(element)
            const textAlign = style.textAlign
            // Handle different alignment values
            if ((alignment === 'left' && (textAlign === 'left' || textAlign === 'start')) ||
                (alignment === 'center' && textAlign === 'center') ||
                (alignment === 'right' && (textAlign === 'right' || textAlign === 'end')) ||
                (alignment === 'justify' && textAlign === 'justify')) {
              return true
            }
          } catch (styleError) {
            console.warn('Error getting computed style:', styleError)
          }
        }
        element = element.parentNode
      }
      return false
    }
  }

  autoLinkUrls(element) {
    // Find text nodes that contain URLs
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )
    
    const textNodes = []
    let node
    while (node = walker.nextNode()) {
      textNodes.push(node)
    }
    
    textNodes.forEach(textNode => {
      const text = textNode.textContent
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const matches = text.match(urlRegex)
      
      if (matches) {
        const parent = textNode.parentNode
        if (parent.nodeName === 'A') return // Already a link
        
        const fragment = document.createDocumentFragment()
        let lastIndex = 0
        
        matches.forEach(match => {
          const matchIndex = text.indexOf(match, lastIndex)
          
          // Add text before the URL
          if (matchIndex > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)))
          }
          
          // Create link element
          const link = document.createElement('a')
          link.href = match
          link.textContent = match
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          fragment.appendChild(link)
          
          lastIndex = matchIndex + match.length
        })
        
        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
        }
        
        parent.replaceChild(fragment, textNode)
      }
    })
  }

  // Content insertion methods
  handleImageUpload(files) {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = document.createElement('img')
          img.src = e.target.result
          img.style.maxWidth = '100%'
          img.style.height = 'auto'
          img.style.margin = '10px 0'
          
          this.insertAtCursor(img)
          this.closeImageUploadModal()
        }
        reader.readAsDataURL(file)
      }
    })
  }

  insertVideoLink() {
    const urlInput = this.element.querySelector('[data-role="video-url-input"]')
    const url = urlInput.value.trim()
    
    if (url) {
      const video = document.createElement('div')
      video.innerHTML = `<iframe src="${url}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`
      video.style.margin = '10px 0'
      
      this.insertAtCursor(video)
      this.closeVideoLinkModal()
      urlInput.value = ''
    }
  }

  insertLink() {
    const textInput = this.element.querySelector('[data-role="link-text-input"]')
    const urlInput = this.element.querySelector('[data-role="link-url-input"]')
    const text = textInput.value.trim()
    const url = urlInput.value.trim()
    
    if (text && url) {
      const link = document.createElement('a')
      link.href = url
      link.textContent = text
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      this.insertAtCursor(link)
      this.closeLinkModal()
      textInput.value = ''
      urlInput.value = ''
    }
  }

  insertAtCursor(element) {
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    const selection = window.getSelection()
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(element)
      range.setStartAfter(element)
      range.setEndAfter(element)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editableContent.appendChild(element)
    }
    
    editableContent.focus()
  }

  // Additional formatting methods
  heading1() {
    this.toggleBlockFormat('h1')
  }

  heading2() {
    this.toggleBlockFormat('h2')
  }

  heading3() {
    this.toggleBlockFormat('h3')
  }

  bulletList() {
    this.toggleBlockFormat('ul')
  }

  orderedList() {
    this.toggleBlockFormat('ol')
  }

  blockquote() {
    this.toggleBlockFormat('blockquote')
  }

  codeBlock() {
    this.toggleBlockFormat('pre')
  }

  toggleBlockFormat(tagName) {
    const editableContent = this.element.querySelector('[data-role="editable-content"]')
    editableContent.focus()
    
    if (this.isBlockActive(tagName)) {
      // Remove formatting
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        document.execCommand('formatBlock', false, '<p>')
      } else if (tagName === 'ul' || tagName === 'ol') {
        document.execCommand('outdent', false, null)
      } else if (tagName === 'blockquote') {
        document.execCommand('formatBlock', false, '<p>')
      } else if (tagName === 'pre') {
        document.execCommand('formatBlock', false, '<p>')
      }
    } else {
      // Apply formatting
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        document.execCommand('formatBlock', false, `<${tagName}>`)
      } else if (tagName === 'ul') {
        document.execCommand('insertUnorderedList', false, null)
      } else if (tagName === 'ol') {
        document.execCommand('insertOrderedList', false, null)
      } else if (tagName === 'blockquote') {
        document.execCommand('formatBlock', false, '<blockquote>')
      } else if (tagName === 'pre') {
        document.execCommand('formatBlock', false, '<pre>')
      }
    }
    
    // Force a longer delay to ensure DOM updates are processed
    setTimeout(() => {
      this.updateButtonStates()
    }, 150)
  }

  undo() {
    document.execCommand('undo', false, null)
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }

  redo() {
    document.execCommand('redo', false, null)
    setTimeout(() => {
      this.updateButtonStates()
    }, 100)
  }

  disconnect() {
    console.log("Rich composer controller disconnected")
  }
} 
