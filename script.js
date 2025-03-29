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
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter subscribe (just a confirmation alert for now)
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interests = document.getElementById('interests').value;

            alert(`Thank you, ${name}! You've been subscribed to the Reoluan newsletter.`);
            this.reset();
        });
    }

    // Contact form — send data to live backend
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.querySelector('#contact-form input[name="name"]').value;
            const email = document.querySelector('#contact-form input[name="email"]').value;
            const message = document.querySelector('#contact-form textarea[name="message"]').value;

            try {
                const res = await fetch("https://email-backend-60fil.onrender.com/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await res.json();
                alert(result.message);
            } catch (error) {
                alert("Failed to send message. Please try again later.");
            }

            this.reset();
        });
    }

    // Header scroll effect
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

    // Show/hide newsletter content
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
