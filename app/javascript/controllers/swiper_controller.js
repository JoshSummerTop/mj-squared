import { Controller } from "@hotwired/stimulus"

// Simplified Swiper controller - production ready
export default class extends Controller {
  static targets = ["wrapper", "slide"]
  static values = { 
    slidesPerView: { type: Number, default: 3.5 },
    spaceBetween: { type: Number, default: 16 },
    breakpoints: Object
  }

  connect() {
    this.currentSlide = 0
    this.setupResponsive()
    this.updateNavigation()
    this.setupTouchEvents()
    
    // Set equal heights after images load
    this.setEqualHeights()
    window.addEventListener('resize', () => this.handleResize())
  }

  disconnect() {
    window.removeEventListener('resize', () => this.handleResize())
  }

  setupResponsive() {
    this.updateSlidesPerView()
  }

  updateSlidesPerView() {
    const width = window.innerWidth
    let slidesPerView = this.slidesPerViewValue
    let spaceBetween = this.spaceBetweenValue

    if (width < 640) {
      slidesPerView = 1.2
      spaceBetween = 12
    } else if (width < 768) {
      slidesPerView = 2
      spaceBetween = 16
    } else if (width < 1024) {
      slidesPerView = 2.5
      spaceBetween = 20
    } else if (width < 1280) {
      slidesPerView = 3
      spaceBetween = 24
    } else {
      slidesPerView = 3.5
      spaceBetween = 24
    }

    this.currentSlidesPerView = slidesPerView
    this.currentSpaceBetween = spaceBetween
    this.updateSlideWidths()
  }

  updateSlideWidths() {
    const containerWidth = this.wrapperTarget.parentElement.offsetWidth
    const totalSpacing = (this.currentSlidesPerView - 1) * this.currentSpaceBetween
    const slideWidth = (containerWidth - totalSpacing) / this.currentSlidesPerView
    
    this.slideTargets.forEach(slide => {
      slide.style.width = `${slideWidth}px`
      slide.style.marginRight = `${this.currentSpaceBetween}px`
    })

    // Remove margin from last visible slide
    if (this.slideTargets.length > 0) {
      const lastIndex = Math.min(this.slideTargets.length - 1, Math.floor(this.currentSlidesPerView) - 1)
      if (this.slideTargets[lastIndex]) {
        this.slideTargets[lastIndex].style.marginRight = this.currentSpaceBetween + 'px'
      }
    }
  }

  setEqualHeights() {
    // Wait for images to load
    const images = this.element.querySelectorAll('img')
    let loadedImages = 0
    const totalImages = images.length

    const checkAllLoaded = () => {
      loadedImages++
      if (loadedImages === totalImages || totalImages === 0) {
        this.equalizeHeights()
      }
    }

    if (totalImages === 0) {
      this.equalizeHeights()
    } else {
      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded()
        } else {
          img.addEventListener('load', checkAllLoaded)
          img.addEventListener('error', checkAllLoaded)
        }
      })
    }
  }

  equalizeHeights() {
    let maxHeight = 0
    
    // Reset heights first
    this.slideTargets.forEach(slide => {
      const card = slide.querySelector('.your-space-card, .community-card-custom')
      if (card) card.style.height = 'auto'
    })

    // Find max height
    this.slideTargets.forEach(slide => {
      const card = slide.querySelector('.your-space-card, .community-card-custom')
      if (card) {
        maxHeight = Math.max(maxHeight, card.offsetHeight)
      }
    })

    // Apply max height to all
    this.slideTargets.forEach(slide => {
      const card = slide.querySelector('.your-space-card, .community-card-custom')
      if (card) card.style.height = `${maxHeight}px`
    })
  }

  setupTouchEvents() {
    let startX = 0
    let startY = 0
    let currentX = 0
    let isDragging = false

    this.wrapperTarget.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isDragging = true
    })

    this.wrapperTarget.addEventListener('touchmove', (e) => {
      if (!isDragging) return
      
      currentX = e.touches[0].clientX
      const diffX = startX - currentX
      const diffY = Math.abs(startY - e.touches[0].clientY)
      
      // Prevent vertical scrolling if horizontal swipe
      if (Math.abs(diffX) > diffY) {
        e.preventDefault()
      }
    })

    this.wrapperTarget.addEventListener('touchend', (e) => {
      if (!isDragging) return
      isDragging = false
      
      const diffX = startX - currentX
      const threshold = 50

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          this.slideNext()
        } else {
          this.slidePrev()
        }
      }
    })
  }

  slideNext() {
    const maxSlides = this.slideTargets.length
    const visibleSlides = Math.floor(this.currentSlidesPerView)
    const maxCurrentSlide = Math.max(0, maxSlides - visibleSlides)
    
    if (this.currentSlide < maxCurrentSlide) {
      this.currentSlide++
      this.updateSlidePosition()
      this.updateNavigation()
    }
  }

  slidePrev() {
    if (this.currentSlide > 0) {
      this.currentSlide--
      this.updateSlidePosition()
      this.updateNavigation()
    }
  }

  updateSlidePosition() {
    const slideWidth = this.slideTargets[0]?.offsetWidth || 0
    const spacing = this.currentSpaceBetween
    const translateX = -(this.currentSlide * (slideWidth + spacing))
    
    this.wrapperTarget.style.transform = `translateX(${translateX}px)`
    this.wrapperTarget.style.transition = 'transform 0.3s ease-out'
  }

  updateNavigation() {
    const prevBtn = this.element.querySelector('.swiper-button-prev')
    const nextBtn = this.element.querySelector('.swiper-button-next')
    
    if (prevBtn) {
      prevBtn.style.opacity = this.currentSlide === 0 ? '0.3' : '1'
      prevBtn.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto'
    }
    
    if (nextBtn) {
      const maxSlides = this.slideTargets.length
      const visibleSlides = Math.floor(this.currentSlidesPerView)
      const maxCurrentSlide = Math.max(0, maxSlides - visibleSlides)
      
      nextBtn.style.opacity = this.currentSlide >= maxCurrentSlide ? '0.3' : '1'
      nextBtn.style.pointerEvents = this.currentSlide >= maxCurrentSlide ? 'none' : 'auto'
    }
  }

  handleResize() {
    this.updateSlidesPerView()
    this.updateSlidePosition()
    this.updateNavigation()
    this.equalizeHeights()
  }

  // Action methods for buttons
  next() {
    this.slideNext()
  }

  prev() {
    this.slidePrev()
  }
}