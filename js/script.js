document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Contact form handling with Formspree
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Formspree will handle the form submission
            // This code runs before the form submits
            
            // Get form values for validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill out all fields');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Formspree will handle the actual submission
            // The form will redirect to Formspree's thank you page
            // If you want to stay on your site, uncomment this code and update the action URL in index.html:
            
            /*
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again later.');
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            });
            */
        });
    }
    
    // Animation for app cards on scroll
    const appCards = document.querySelectorAll('.app-card');
    
    if (appCards.length > 0) {
        const animateOnScroll = () => {
            appCards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (cardTop < windowHeight - 100) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Set initial state for animation
        appCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        
        // Run on load
        animateOnScroll();
        
        // Run on scroll
        window.addEventListener('scroll', animateOnScroll);
    }
    
    // Update copyright year
    const copyrightYear = document.querySelector('footer p');
    if (copyrightYear) {
        const year = new Date().getFullYear();
        copyrightYear.textContent = copyrightYear.textContent.replace('2023', year);
    }
}); 