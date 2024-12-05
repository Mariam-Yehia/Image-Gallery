let currentSlide = 0; // Track the index of the current slide
const slides = document.querySelectorAll('.slide');
const smallImages = document.querySelectorAll('.small-image');
const overlayTexts = document.querySelectorAll('.overlay-text');
const dots = document.querySelectorAll('.dot');
const slider = document.querySelector('.slider');
const sliderContainer = document.querySelector('.slider-container');

let startX = 0; // To track the starting X position of a touch
let currentX = 0; // To track the current X position during touch move
let isDragging = false; // To check if a swipe is happening

// Function to show the current slide
function showSlide(index) {
  const totalSlides = slides.length;

  // Ensure the index loops back when it goes past the last or first slide
  currentSlide = (index + totalSlides) % totalSlides;

  // Move the slider to the correct position
  slider.style.transform = `translateX(${-currentSlide * 100}%)`;

  // Handle small image transition for the current slide
  smallImages.forEach((image, i) => {
    image.style.transform = i === currentSlide ? 'translateX(0)' : 'translateX(-100%)';
    image.style.opacity = i === currentSlide ? 1 : 0;
  });

  // Handle overlay text transition for the current slide
  overlayTexts.forEach((text, i) => {
    text.style.transform = i === currentSlide ? 'translateY(0)' : 'translateY(-100%)';
  });

  // Update active dot
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

// Function to change the slide (next or previous)
function changeSlide(offset = 1) {
  showSlide(currentSlide + offset); // Move to the next or previous slide by offset
}

// Auto-slide every 5 seconds
let slideInterval = setInterval(() => changeSlide(1), 5000);

// Function to reset the slide interval after manual navigation
function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => changeSlide(1), 5000); // Restart auto-slide
}

// Event listeners for navigation buttons
document.querySelector('.next').addEventListener('click', () => {
  changeSlide(1); // Move to the next slide
  resetSlideInterval();
});

document.querySelector('.prev').addEventListener('click', () => {
  changeSlide(-1); // Move to the previous slide
  resetSlideInterval();
});

// Event listeners for dots
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i); // Navigate to the corresponding slide
    resetSlideInterval();
  });
});

// Function to pause the auto-slide
function pauseAutoSlide() {
    clearInterval(slideInterval); // Stop auto-slide
}
  
// Function to resume the auto-slide
function resumeAutoSlide() {
   slideInterval = setInterval(() => changeSlide(1), 5000); // Restart auto-slide
}

// Add event listeners for desktop hover
sliderContainer.addEventListener('mouseover', pauseAutoSlide);
sliderContainer.addEventListener('mouseout', resumeAutoSlide);

// Add event listeners for mobile touch
sliderContainer.addEventListener('touchstart', pauseAutoSlide);
sliderContainer.addEventListener('touchend', resumeAutoSlide);
  

// Add touch event listeners for mobile swipe
sliderContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX; // Get the starting X position
  isDragging = true;
  clearInterval(slideInterval); // Pause auto-slide during swipe
});

sliderContainer.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX; // Update the current X position
});

sliderContainer.addEventListener('touchend', () => {
  if (!isDragging) return;
  const deltaX = startX - currentX; // Calculate the distance swiped
  if (deltaX > 50) {
    // Swipe left to move to the next slide
    changeSlide(1);
  } else if (deltaX < -50) {
    // Swipe right to move to the previous slide
    changeSlide(-1);
  }
  isDragging = false;
  resetSlideInterval(); // Restart auto-slide after swipe
});

// Initialize the first slide transition when the page loads
window.onload = () => showSlide(currentSlide);
