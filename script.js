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
    
    // Form submission handling
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interests = document.getElementById('interests').value;
            
            // Here you would typically send this data to your server or newsletter service
            // For now, we'll just show an alert
            alert(`Thank you, ${name}! You've been subscribed to the Reoluan newsletter.`);
            
            // Reset form
            this.reset();
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to your server
            // For now, we'll just show an alert
            alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
            
            // Reset form
            this.reset();
        });
    }
    
    // Enhanced header scroll effect for minimalist design
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(76, 175, 80, 0.15)';
            header.style.height = '60px';
        } else {
            header.style.backgroundColor = 'var(--background-color)';
            header.style.boxShadow = '0 2px 10px rgba(76, 175, 80, 0.1)';
            header.style.height = '70px';
        }
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
    }
}); 