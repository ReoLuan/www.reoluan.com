document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = this.name.value;
      const email = this.email.value;
      const message = this.message.value;

      try {
        const response = await fetch("https://your-render-app.onrender.com/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        alert(result.message);
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }

      this.reset(); // Reset the form
    });
  }
});
