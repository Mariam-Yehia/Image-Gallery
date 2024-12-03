const slides = document.querySelector('.slides');
const slideImages = document.querySelectorAll('.slides img');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');

let currentIndex = 0;
let slideWidth = slideImages[0].clientWidth;
let interval;

// Variables for swipe functionality
let startX = 0;
let endX = 0;
let isTouching = false;

// Update the slide position
function updateSlide() {
  slides.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  updateActiveDot(); // Update the active dot
}

// Move to the next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % slideImages.length;
  updateSlide();
}

// Move to the previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + slideImages.length) % slideImages.length;
  updateSlide();
}

// Update the active dot
function updateActiveDot() {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

// Start the automatic sliding
function startSlider() {
  interval = setInterval(nextSlide, 3000);
}

// Stop the automatic sliding
function stopSlider() {
  clearInterval(interval);
}

// Update slideWidth dynamically on window resize
window.addEventListener('resize', () => {
    slideWidth = slideImages[0].clientWidth; // Recalculate width
    updateSlide(); // Reapply the transform to maintain current position
});

// Event listeners for navigation buttons
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Event listeners for pagination dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlide();
  });
});

// Pause sliding on mouse enter, resume on mouse leave
document.querySelector('.slider').addEventListener('mouseenter', stopSlider);
document.querySelector('.slider').addEventListener('mouseleave', startSlider);

// Initialize the slider and set the first dot as active
window.addEventListener('load', () => {
  updateSlide(); // Ensure the first slide is visible and the first dot is active
  dots[0].classList.add('active'); // Add 'active' class to the first dot on load
});

// Initialize the slider
startSlider();

// Swipe functionality
slides.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX; // Record the initial touch position
  isTouching = true;
});

slides.addEventListener('touchmove', (e) => {
  if (!isTouching) return;
  endX = e.touches[0].clientX; // Track the touch movement
});

slides.addEventListener('touchend', () => {
  if (isTouching) {
    const swipeThreshold = 50; // Minimum swipe distance to trigger navigation
    const swipeDistance = startX - endX;

    // If swiped left, go to the next slide
    if (swipeDistance > swipeThreshold) {
      nextSlide();
    }
    // If swiped right, go to the previous slide
    if (swipeDistance < -swipeThreshold) {
      prevSlide();
    }

    isTouching = false; // Reset touch tracking
  }
});
