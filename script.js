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
    
    // Newsletter subscription form handling
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values and sanitize them
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const interests = document.getElementById('interests')?.value?.trim() || '';
            
            if (!name || !email) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Disable form while submitting
            const submitButton = subscribeForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';

            try {
                const response = await fetch('https://reoluan-backend.onrender.com/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        interests: interests
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || 'Successfully subscribed!');
                    subscribeForm.reset();
                } else {
                    throw new Error(data.message || 'Failed to subscribe');
                }
            } catch (error) {
                console.error('Subscription error:', error);
                alert(error.message || 'Error subscribing. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values and sanitize them
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Disable form while submitting
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch('https://reoluan-backend.onrender.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || 'Message sent successfully!');
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Contact error:', error);
                alert(error.message || 'Error sending message. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
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