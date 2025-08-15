import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "slide"]
  
  connect() {
    console.log('Swiper controller connected')
    console.log('Container target:', this.containerTarget)
    console.log('Slide targets:', this.slideTargets.length)
    
    this.currentIndex = 0
    this.slidesToShow = this.getSlidesToShow()
    this.setupSlider()
    this.updateButtons()
    this.setupDragSupport()
    
    // Handle resize
    this.boundResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.boundResize)
  }
  
  disconnect() {
    window.removeEventListener('resize', this.boundResize)
  }
  
  setupSlider() {
    const slides = this.slideTargets
    const slideWidth = 300
    const gap = 16
    
    // Set up container with enhanced styling
    this.containerTarget.style.display = 'flex'
    this.containerTarget.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    this.containerTarget.style.cursor = 'grab'
    
    // Better spacing and centering calculation
    slides.forEach((slide, index) => {
      slide.style.minWidth = `${slideWidth}px`
      slide.style.flexShrink = '0'
      slide.style.marginRight = index < slides.length - 1 ? `${gap}px` : '0px'
    })
    
    this.updateProgressBar()
  }
  
  getSlidesToShow() {
    const width = window.innerWidth
    if (width < 768) return 1
    if (width < 1024) return 2
    return 3
  }
  
  next() {
    console.log('Next clicked')
    const maxIndex = Math.max(0, this.slideTargets.length - this.slidesToShow)
    console.log('Current:', this.currentIndex, 'Max:', maxIndex)
    if (this.currentIndex < maxIndex) {
      this.currentIndex++
      this.updatePosition()
    }
  }
  
  prev() {
    console.log('Prev clicked')
    console.log('Current:', this.currentIndex)
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.updatePosition()
    }
  }
  
  updatePosition() {
    const slideWidth = 300
    const gap = 16
    const translateX = -(this.currentIndex * (slideWidth + gap))
    this.containerTarget.style.transform = `translateX(${translateX}px)`
    this.updateButtons()
    this.updateProgressBar()
  }
  
  updateButtons() {
    const prevBtn = this.element.querySelector('.swiper-button-prev')
    const nextBtn = this.element.querySelector('.swiper-button-next')
    const maxIndex = Math.max(0, this.slideTargets.length - this.slidesToShow)
    
    if (prevBtn) {
      prevBtn.style.opacity = this.currentIndex === 0 ? '0.3' : '1'
      prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto'
    }
    
    if (nextBtn) {
      nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.3' : '1'
      nextBtn.style.pointerEvents = this.currentIndex >= maxIndex ? 'none' : 'auto'
    }
  }
  
  handleResize() {
    this.slidesToShow = this.getSlidesToShow()
    this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.slideTargets.length - this.slidesToShow))
    this.updatePosition()
  }

  // Enhanced drag/touch support
  setupDragSupport() {
    this.isDragging = false
    this.startX = 0
    this.currentX = 0
    this.threshold = 50 // Minimum distance to trigger slide
    
    // Mouse events
    this.containerTarget.addEventListener('mousedown', this.handleDragStart.bind(this))
    this.containerTarget.addEventListener('mousemove', this.handleDragMove.bind(this))
    this.containerTarget.addEventListener('mouseup', this.handleDragEnd.bind(this))
    this.containerTarget.addEventListener('mouseleave', this.handleDragEnd.bind(this))
    
    // Touch events
    this.containerTarget.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: false })
    this.containerTarget.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false })
    this.containerTarget.addEventListener('touchend', this.handleDragEnd.bind(this))
    
    // Prevent text selection while dragging
    this.containerTarget.style.userSelect = 'none'
  }

  handleDragStart(e) {
    this.isDragging = true
    this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
    this.containerTarget.style.cursor = 'grabbing'
    this.containerTarget.style.transition = 'none'
  }

  handleDragMove(e) {
    if (!this.isDragging) return
    
    e.preventDefault()
    this.currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - this.startX
    
    // Apply drag transform with resistance at boundaries
    const maxIndex = Math.max(0, this.slideTargets.length - this.slidesToShow)
    let resistance = 1
    
    if ((this.currentIndex === 0 && this.currentX > 0) || 
        (this.currentIndex >= maxIndex && this.currentX < 0)) {
      resistance = 0.3 // Add resistance at boundaries
    }
    
    const slideWidth = 300
    const gap = 16
    const baseTranslate = -(this.currentIndex * (slideWidth + gap))
    const dragTranslate = baseTranslate + (this.currentX * resistance)
    
    this.containerTarget.style.transform = `translateX(${dragTranslate}px)`
  }

  handleDragEnd() {
    if (!this.isDragging) return
    
    this.isDragging = false
    this.containerTarget.style.cursor = 'grab'
    this.containerTarget.style.transition = 'transform 0.3s ease'
    
    // Determine if we should slide
    if (Math.abs(this.currentX) > this.threshold) {
      if (this.currentX > 0) {
        this.prev()
      } else {
        this.next()
      }
    } else {
      // Snap back to current position
      this.updatePosition()
    }
    
    this.currentX = 0
  }

  // Progress bar functionality
  updateProgressBar() {
    const progressBar = this.element.querySelector('.slider-progress')
    if (!progressBar) return
    
    const maxIndex = Math.max(0, this.slideTargets.length - this.slidesToShow)
    const progress = maxIndex === 0 ? 100 : (this.currentIndex / maxIndex) * 100
    progressBar.style.width = `${Math.max(15, progress)}%`
  }

  // Auto-play functionality (optional enhancement)
  startAutoPlay(interval = 5000) {
    this.stopAutoPlay()
    this.autoPlayInterval = setInterval(() => {
      const maxIndex = Math.max(0, this.slideTargets.length - this.slidesToShow)
      if (this.currentIndex >= maxIndex) {
        this.currentIndex = 0
      } else {
        this.next()
        return // next() already calls updatePosition
      }
      this.updatePosition()
    }, interval)
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }


}