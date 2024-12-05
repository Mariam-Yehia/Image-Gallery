let currentSlide = 0; 
const slides = document.querySelectorAll('.slide');
const smallImages = document.querySelectorAll('.small-image');
const overlayTexts = document.querySelectorAll('.overlay-text');
const dots = document.querySelectorAll('.dot');
const slider = document.querySelector('.slider');
const sliderContainer = document.querySelector('.slider-container');

let startX = 0; 
let currentX = 0; 
let isDragging = false; 

// to show the current slide
function showSlide(index) {
  const totalSlides = slides.length;

  currentSlide = (index + totalSlides) % totalSlides;

  slider.style.transform = `translateX(${-currentSlide * 100}%)`;

  smallImages.forEach((image, i) => {
    image.style.transform = i === currentSlide ? 'translateX(0)' : 'translateX(-100%)';
    image.style.opacity = i === currentSlide ? 1 : 0;
  });

  overlayTexts.forEach((text, i) => {
    text.style.transform = i === currentSlide ? 'translateY(0)' : 'translateY(-100%)';
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

// to change the slide (next or previous)
function changeSlide(offset = 1) {
  showSlide(currentSlide + offset);
}

// auto-slide every 5 seconds
let slideInterval = setInterval(() => changeSlide(1), 5000);

// to reset the slide interval after manual navigation
function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => changeSlide(1), 5000); 
}

// listeners for navigation buttons
document.querySelector('.next').addEventListener('click', () => {
  changeSlide(1);
  resetSlideInterval();
});

document.querySelector('.prev').addEventListener('click', () => {
  changeSlide(-1);
  resetSlideInterval();
});

// listeners for dots
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i);
    resetSlideInterval();
  });
});

// to pause the auto-slide
function pauseAutoSlide() {
    clearInterval(slideInterval);
}
  
// to resume the auto-slide
function resumeAutoSlide() {
   slideInterval = setInterval(() => changeSlide(1), 5000); 
}

// event listeners for desktop hover
sliderContainer.addEventListener('mouseover', pauseAutoSlide);
sliderContainer.addEventListener('mouseout', resumeAutoSlide);

// event listeners for mobile touch
sliderContainer.addEventListener('touchstart', pauseAutoSlide);
sliderContainer.addEventListener('touchend', resumeAutoSlide);
  

// touch event listeners for mobile
sliderContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearInterval(slideInterval); 
});

sliderContainer.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
});

sliderContainer.addEventListener('touchend', () => {
  if (!isDragging) return;
  const deltaX = startX - currentX;
  if (deltaX > 50) {
    changeSlide(1);
  } else if (deltaX < -50) {
    changeSlide(-1);
  }
  isDragging = false;
  resetSlideInterval();
});

// initialize the first slide transition when the page loads
window.onload = () => showSlide(currentSlide);
