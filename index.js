document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Function to show slides
    function showSlides() {
        slides.forEach((slide, index) => {
            slide.style.opacity = (index === slideIndex) ? '1' : '0';
            slide.style.display = (index === slideIndex) ? 'block' : 'none';
        });
        slideIndex = (slideIndex + 1) % slides.length;
        setTimeout(showSlides, 3000); // Change image every 3 seconds
    }
    
    showSlides();
    
    // Function to toggle dropdowns
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the event from bubbling up to the document
            // Close other dropdowns
            navItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            item.classList.toggle('active');
        });
    });
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', () => {
        navItems.forEach(item => item.classList.remove('active'));
    });
});

// Function to show slides with previous/next buttons
function plusSlides(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    slideIndex += n;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    slides.forEach((slide, index) => {
        slide.style.opacity = (index === slideIndex) ? '1' : '0';
        slide.style.display = (index === slideIndex) ? 'block' : 'none';
    });
}


