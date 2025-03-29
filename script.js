document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjusted for smaller header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter show/hide functionality
    const showNewsletterBtn = document.getElementById('show-newsletter');
    const hideNewsletterBtn = document.getElementById('hide-newsletter');
    const newsletterContent = document.getElementById('newsletter-full');
    
    if (showNewsletterBtn && newsletterContent) {
        showNewsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            newsletterContent.style.display = 'block';
            showNewsletterBtn.style.display = 'none';
        });
    }
    
    if (hideNewsletterBtn && newsletterContent) {
        hideNewsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            newsletterContent.style.display = 'none';
            showNewsletterBtn.style.display = 'inline-block';
        });
    });
});
