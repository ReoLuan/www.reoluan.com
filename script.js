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
    
    // Add subtle fade-in animation for sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
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
    
    // Add pulsating shadow effect to cards
    document.querySelectorAll('.preview-card, .testimonial').forEach(element => {
        element.classList.add('pulse-shadow');
    });
    
    // Add subtle animation to form containers
    document.querySelectorAll('#subscribe-form, #contact-form').forEach(form => {
        form.parentElement.classList.add('pulse-shadow');
    });
    
    // Apply text animations
    document.querySelectorAll('.hero-content h1, .hero-content h2, .hero-content p, .hero-content .cta-buttons').forEach(el => {
        el.classList.add('fade-in-text');
    });
    
    // Add highlight-text class to important phrases
    document.querySelectorAll('h1 span, .newsletter-content h5, .highlight-box').forEach(el => {
        el.classList.add('highlight-text');
    });
    
    // Adjust animation timing for sections
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.animationDelay = (0.2 * index) + 's';
    });
}); 