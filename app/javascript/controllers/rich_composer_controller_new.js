import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

console.log("Rich composer controller (TipTap) file loaded!")

export default class extends Controller {
  static targets = ["hidden"]
  static values = { 
    uploadUrl: String, 
    placeholder: String, 
    submitOnEnter: { type: Boolean, default: true }
  }

  connect() {
    console.log("Rich composer controller (TipTap) connected!")
    
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
    container.className = 'rich-composer-shell px-0'
    container.innerHTML = `
      <!-- Main Toolbar -->
      <div class="relative flex items-center gap-1 py-1 text-gray-500 select-none">
        <!-- Media Buttons -->
        <button type="button" data-role="btn-image" data-action="click->rich-composer#showImageUploadModal" data-controller="tooltip" data-tooltip-content-value="📷 Upload Images" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Upload Images">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        </button>
        
        <button type="button" data-role="btn-video" data-action="click->rich-composer#showVideoLinkModal" data-controller="tooltip" data-tooltip-content-value="🎥 Add Video" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Add Video">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23,7 16,12 23,17 23,7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        </button>
        
        <button type="button" data-role="btn-link" data-action="click->rich-composer#showLinkModal" data-controller="tooltip" data-tooltip-content-value="🔗 Add Link" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Add Link">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
        
        <!-- Divider -->
        <div class="w-px h-6 bg-gray-300 mx-1"></div>
        
        <!-- Formatting Toggle Button -->
        <button type="button" data-role="btn-formatting-toggle" data-action="click->rich-composer#toggleFormattingPanel" data-controller="tooltip" data-tooltip-content-value="⚙️ Text Formatting" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-all duration-200" aria-label="Formatting Options">
          <svg class="w-4 h-4 transition-transform duration-200" data-role="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>
      
      <!-- Secondary Formatting Panel -->
      <div class="hidden overflow-hidden transition-all duration-300 ease-in-out" data-role="formatting-panel">
        <div class="flex flex-wrap items-center gap-1 py-2 px-1 bg-gray-50 border-t border-gray-200">
          <!-- Headings -->
          <button type="button" data-role="btn-h1" data-action="click->rich-composer#heading1" data-controller="tooltip" data-tooltip-content-value="📝 Heading 1" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Heading 1">
            <span class="text-sm font-bold">H1</span>
          </button>
          <button type="button" data-role="btn-h2" data-action="click->rich-composer#heading2" data-controller="tooltip" data-tooltip-content-value="📝 Heading 2" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Heading 2">
            <span class="text-sm font-bold">H2</span>
          </button>
          <button type="button" data-role="btn-h3" data-action="click->rich-composer#heading3" data-controller="tooltip" data-tooltip-content-value="📝 Heading 3" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Heading 3">
            <span class="text-sm font-bold">H3</span>
          </button>
          
          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300 mx-2"></div>
          
          <!-- Text Formatting -->
          <button type="button" data-role="btn-bold" data-action="click->rich-composer#bold" data-controller="tooltip" data-tooltip-content-value="Bold (Ctrl+B)" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Bold">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>
          <button type="button" data-role="btn-italic" data-action="click->rich-composer#italic" data-controller="tooltip" data-tooltip-content-value="Italic (Ctrl+I)" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Italic">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="4" x2="10" y2="4"/>
              <line x1="14" y1="20" x2="5" y2="20"/>
              <line x1="15" y1="4" x2="9" y2="20"/>
            </svg>
          </button>
          <button type="button" data-role="btn-underline" data-action="click->rich-composer#underline" data-controller="tooltip" data-tooltip-content-value="Underline (Ctrl+U)" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Underline">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
              <line x1="4" y1="21" x2="20" y2="21"/>
            </svg>
          </button>
          <button type="button" data-role="btn-strikethrough" data-action="click->rich-composer#strikethrough" data-controller="tooltip" data-tooltip-content-value="Strikethrough" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Strikethrough">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4H9a3 3 0 0 0-2.83 4"/>
              <path d="M14 12a4 4 0 0 1 0 8H6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
            </svg>
          </button>
          
          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300 mx-2"></div>
          
          <!-- Lists -->
          <button type="button" data-role="btn-bullet" data-action="click->rich-composer#bulletList" data-controller="tooltip" data-tooltip-content-value="Bullet List" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Bullet List">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button type="button" data-role="btn-ordered" data-action="click->rich-composer#orderedList" data-controller="tooltip" data-tooltip-content-value="Numbered List" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Numbered List">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="10" y1="6" x2="21" y2="6"/>
              <line x1="10" y1="12" x2="21" y2="12"/>
              <line x1="10" y1="18" x2="21" y2="18"/>
              <path d="M4 6h1v4"/>
              <path d="M4 10h2"/>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
            </svg>
          </button>
          
          <!-- Divider -->
          <div class="w-px h-6 bg-gray-300 mx-2"></div>
          
          <!-- Quote and Code -->
          <button type="button" data-role="btn-quote" data-action="click->rich-composer#blockquote" data-controller="tooltip" data-tooltip-content-value="Quote" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Quote">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            </svg>
          </button>
          <button type="button" data-role="btn-code" data-action="click->rich-composer#codeBlock" data-controller="tooltip" data-tooltip-content-value="Code Block" class="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Code Block">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"/>
              <polyline points="8,6 2,12 8,18"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="editor px-0 py-1 leading-relaxed">
        <div data-role="editable-content" class="min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div>
      </div>
      
      <!-- Modals (same as before) -->
      <div data-role="image-upload-modal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Upload Images</h3>
            <button type="button" data-action="click->rich-composer#closeImageUploadModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          <div data-role="drop-zone" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              <span class="font-medium">Drag and drop images here</span> or 
              <button type="button" data-action="click->rich-composer#triggerImageFileInput" class="text-blue-600 hover:text-blue-500">browse files</button>
            </p>
          </div>
          <input type="file" data-role="image-file-input" class="hidden" accept="image/*" multiple>
        </div>
      </div>
      
      <div data-role="video-link-modal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Add Video</h3>
            <button type="button" data-action="click->rich-composer#closeVideoLinkModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input type="url" data-role="video-url-input" placeholder="https://www.youtube.com/watch?v=..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" data-action="click->rich-composer#closeVideoLinkModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
              <button type="button" data-action="click->rich-composer#insertVideoLink" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Insert Video</button>
            </div>
          </div>
        </div>
      </div>
      
      <div data-role="link-modal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Add Link</h3>
            <button type="button" data-action="click->rich-composer#closeLinkModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
              <input type="text" data-role="link-text-input" placeholder="Link text..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input type="url" data-role="link-url-input" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" data-action="click->rich-composer#closeLinkModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
              <button type="button" data-action="click->rich-composer#insertLink" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Insert Link</button>
            </div>
          </div>
        </div>
      </div>
    `

    // Insert the container after the hidden input
    this.hiddenTarget.parentNode.insertBefore(container, this.hiddenTarget.nextSibling)
    
    // Initialize TipTap editor
    this.initializeTipTapEditor(container)
    
    // Set up event listeners  
    this.setupEventListeners(container)
  }

  async initializeTipTapEditor(container) {
    const editableContent = container.querySelector('[data-role="editable-content"]')
    
    // Initialize TipTap editor
    this.editor = new Editor({
      element: editableContent,
      extensions: [
        StarterKit.configure({
          bulletList: { keepMarks: true },
          orderedList: { keepMarks: true },
        }),
        Placeholder.configure({ 
          placeholder: this.placeholderValue || 'Write something...' 
        }),
        Link.configure({ openOnClick: false }),
        Image.configure({ inline: false }),
        Underline,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
      ],
      content: this.getInitialContent(),
      onUpdate: ({ editor }) => {
        // Update hidden input when content changes
        let content = editor.getHTML()
        
        // Wrap content in ActionText format if needed
        if (!content.includes('trix-content')) {
          content = `<div class="trix-content">${content}</div>`
        }
        
        this.hiddenTarget.value = content
      },
      onSelectionUpdate: () => {
        // Update button states when selection changes
        this.updateButtonStates()
      },
      onFocus: () => {
        this.updateButtonStates()
      },
      editorProps: {
        attributes: {
          class: 'min-h-[200px] p-3 border-0 focus:outline-none prose prose-sm max-w-none',
        },
      },
    })

    // Store button references for faster access
    this.cacheButtonReferences(container)
    
    // Initial button state update
    this.updateButtonStates()
  }

  cacheButtonReferences(container) {
    this.btnBold = container.querySelector('[data-role="btn-bold"]')
    this.btnItalic = container.querySelector('[data-role="btn-italic"]')
    this.btnUnderline = container.querySelector('[data-role="btn-underline"]')
    this.btnStrikethrough = container.querySelector('[data-role="btn-strikethrough"]')
    this.btnH1 = container.querySelector('[data-role="btn-h1"]')
    this.btnH2 = container.querySelector('[data-role="btn-h2"]')
    this.btnH3 = container.querySelector('[data-role="btn-h3"]')
    this.btnBullet = container.querySelector('[data-role="btn-bullet"]')
    this.btnOrdered = container.querySelector('[data-role="btn-ordered"]')
    this.btnQuote = container.querySelector('[data-role="btn-quote"]')
    this.btnCode = container.querySelector('[data-role="btn-code"]')
  }

  getInitialContent() {
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
      
      return content
    }
    return ''
  }

  // Formatting actions using TipTap - PROPER TOGGLE DETECTION!
  bold() { 
    this.editor?.chain().focus().toggleBold().run()
  }
  
  italic() { 
    this.editor?.chain().focus().toggleItalic().run()
  }
  
  underline() { 
    this.editor?.chain().focus().toggleUnderline().run()
  }
  
  strikethrough() { 
    this.editor?.chain().focus().toggleStrike().run()
  }
  
  heading1() { 
    this.editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }
  
  heading2() { 
    this.editor?.chain().focus().toggleHeading({ level: 2 }).run()
  }
  
  heading3() { 
    this.editor?.chain().focus().toggleHeading({ level: 3 }).run()
  }
  
  bulletList() { 
    this.editor?.chain().focus().toggleBulletList().run()
  }
  
  orderedList() { 
    this.editor?.chain().focus().toggleOrderedList().run()
  }
  
  blockquote() { 
    this.editor?.chain().focus().toggleBlockquote().run()
  }
  
  codeBlock() { 
    this.editor?.chain().focus().toggleCodeBlock().run()
  }

  // UPDATE BUTTON STATES - THE PROPER WAY!
  updateButtonStates() {
    if (!this.editor) return
    
    const ed = this.editor
    
    // Text formatting - using TipTap's isActive()
    this.setActive(this.btnBold, ed.isActive('bold'))
    this.setActive(this.btnItalic, ed.isActive('italic'))
    this.setActive(this.btnUnderline, ed.isActive('underline'))
    this.setActive(this.btnStrikethrough, ed.isActive('strike'))
    
    // Headings
    this.setActive(this.btnH1, ed.isActive('heading', { level: 1 }))
    this.setActive(this.btnH2, ed.isActive('heading', { level: 2 }))
    this.setActive(this.btnH3, ed.isActive('heading', { level: 3 }))
    
    // Lists and blocks
    this.setActive(this.btnBullet, ed.isActive('bulletList'))
    this.setActive(this.btnOrdered, ed.isActive('orderedList'))
    this.setActive(this.btnQuote, ed.isActive('blockquote'))
    this.setActive(this.btnCode, ed.isActive('codeBlock'))
  }

  setActive(button, isActive) {
    if (!button) return
    
    // Clear all states first
    button.classList.remove('bg-blue-100', 'text-blue-700', 'shadow-sm', 'hover:bg-gray-100')
    button.style.borderColor = 'transparent'
    
    if (isActive) {
      // Active state - exactly like Google Docs
      button.classList.add('bg-blue-100', 'text-blue-700', 'shadow-sm')
      button.setAttribute('aria-pressed', 'true')
      button.style.borderColor = '#3b82f6'
    } else {
      // Inactive state
      button.classList.add('hover:bg-gray-100')
      button.setAttribute('aria-pressed', 'false')
    }
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

  // Modal methods (same as before but simplified)
  showImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.remove('hidden')
  }

  closeImageUploadModal() {
    const modal = this.element.querySelector('[data-role="image-upload-modal"]')
    modal.classList.add('hidden')
  }

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

  showLinkModal() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    modal.classList.remove('hidden')
    
    // Pre-fill with selected text
    const selection = this.editor?.state.selection
    if (selection && !selection.empty) {
      const selectedText = this.editor.state.doc.textBetween(selection.from, selection.to)
      const textInput = modal.querySelector('[data-role="link-text-input"]')
      textInput.value = selectedText
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

  insertVideoLink() {
    const modal = this.element.querySelector('[data-role="video-link-modal"]')
    const input = modal.querySelector('[data-role="video-url-input"]')
    const url = input.value.trim()
    
    if (!url) return
    
    const videoEmbed = this.createVideoEmbed(url)
    if (videoEmbed) {
      this.editor?.chain().focus().insertContent(videoEmbed.outerHTML).run()
    }
    
    this.closeVideoLinkModal()
  }

  insertLink() {
    const modal = this.element.querySelector('[data-role="link-modal"]')
    const textInput = modal.querySelector('[data-role="link-text-input"]')
    const urlInput = modal.querySelector('[data-role="link-url-input"]')
    
    const text = textInput.value.trim()
    const url = urlInput.value.trim()
    
    if (!text || !url) return
    
    this.editor?.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`).run()
    this.closeLinkModal()
  }

  createVideoEmbed(url) {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      const videoId = youtubeMatch[1]
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
      return wrapper
    }
    
    // Generic video link
    const link = document.createElement('a')
    link.href = url
    link.textContent = url
    link.className = 'text-blue-600 hover:text-blue-800 underline break-all'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    return link
  }

  triggerImageFileInput() {
    const fileInput = this.element.querySelector('[data-role="image-file-input"]')
    fileInput.click()
  }

  async handleImageUpload(files) {
    for (const file of files) {
      try {
        const upload = new DirectUpload(file, '/rails/active_storage/direct_uploads')
        
        upload.create((error, attributes) => {
          if (error) {
            console.error('Upload error:', error)
            return
          }
          
          // Insert image using TipTap
          const url = `/rails/active_storage/blobs/redirect/${attributes.signed_id}/${attributes.filename}`
          this.editor?.chain().focus().setImage({ src: url, alt: file.name }).run()
        })
      } catch (error) {
        console.error('Image upload failed:', error)
      }
    }
    
    this.closeImageUploadModal()
  }

  setupEventListeners(container) {
    // Image upload modal
    const dropZone = container.querySelector('[data-role="drop-zone"]')
    const fileInput = container.querySelector('[data-role="image-file-input"]')
    
    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.classList.add('border-blue-500')
    })
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-500')
    })
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-blue-500')
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
  }

  disconnect() {
    // Clean up TipTap editor
    this.editor?.destroy()
    console.log("Rich composer controller (TipTap) disconnected")
  }
}
