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
    
    // Handle resize
    this.boundResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.boundResize)
  }
  
  disconnect() {
    window.removeEventListener('resize', this.boundResize)
  }
  
  setupSlider() {
    const slides = this.slideTargets
    const slideWidth = 300 // Fixed width per slide
    const gap = 16
    
    // Set up container
    this.containerTarget.style.display = 'flex'
    this.containerTarget.style.transition = 'transform 0.3s ease'
    
    // Set up slides with proper spacing
    slides.forEach((slide, index) => {
      slide.style.minWidth = `${slideWidth}px`
      slide.style.flexShrink = '0'
      slide.style.marginRight = index < slides.length - 1 ? `${gap}px` : '0px'
    })
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
}