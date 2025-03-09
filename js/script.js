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

    // Add fade-in animations to elements as they scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animations to these elements
    const animatedElements = document.querySelectorAll('.philosophy-item, .app-card, h2, #hero h2, #hero p');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Make philosophy items and app cards draggable
    const makeElementDraggable = (element) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        let initialX, initialY;
        let transformX = 0, transformY = 0;
        let initialTransform = window.getComputedStyle(element).transform;
        
        // If the element already has a transform, extract the current X and Y values
        if (initialTransform !== 'none') {
            const matrix = initialTransform.match(/matrix.*\((.+)\)/)[1].split(', ');
            if (matrix.length >= 6) {
                transformX = parseFloat(matrix[4]);
                transformY = parseFloat(matrix[5]);
            }
        }

        element.classList.add('draggable');
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;
            
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
            
            isDragging = true;
            element.style.zIndex = '1000';
            element.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Set the element's new position
            transformX = transformX - pos1;
            transformY = transformY - pos2;
            element.style.transform = `translate(${transformX}px, ${transformY}px)`;
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
            
            // If it was just a click (not a drag), reset position
            if (isDragging && Math.abs(initialX - pos3) < 5 && Math.abs(initialY - pos4) < 5) {
                element.style.transform = 'translate(0, 0)';
                transformX = 0;
                transformY = 0;
            }
            
            isDragging = false;
            element.style.zIndex = '';
            element.style.cursor = 'grab';
            
            // If dragged far, animate back to original position
            if (Math.abs(transformX) > 150 || Math.abs(transformY) > 150) {
                element.style.transition = 'transform 0.5s ease-in-out';
                element.style.transform = 'translate(0, 0)';
                transformX = 0;
                transformY = 0;
                
                // Reset the transition after it's complete
                setTimeout(() => {
                    element.style.transition = '';
                }, 500);
            }
        }
    };

    // Apply draggable functionality
    document.querySelectorAll('.philosophy-item, .app-card').forEach(el => {
        makeElementDraggable(el);
    });

    // Dark mode toggle
    const createDarkModeToggle = () => {
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        toggleBtn.className = 'dark-mode-toggle';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = '1000';
        toggleBtn.style.background = 'var(--primary-color)';
        toggleBtn.style.color = 'white';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.width = '50px';
        toggleBtn.style.height = '50px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.boxShadow = 'var(--shadow-md)';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.fontSize = '1.2rem';
        toggleBtn.style.transition = 'all 0.3s ease';
        
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(toggleBtn);
        
        // We're already in dark mode, so clicking toggles to light mode
        let isDarkMode = true;
        
        toggleBtn.addEventListener('click', () => {
            if (isDarkMode) {
                // Switch to light mode
                document.documentElement.style.setProperty('--bg-color', '#ffffff');
                document.documentElement.style.setProperty('--bg-color-light', '#f5f5f5');
                document.documentElement.style.setProperty('--bg-color-lighter', '#e9ecef');
                document.documentElement.style.setProperty('--text-color', '#212529');
                document.documentElement.style.setProperty('--text-color-muted', '#6c757d');
                toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                // Switch to dark mode
                document.documentElement.style.setProperty('--bg-color', '#121212');
                document.documentElement.style.setProperty('--bg-color-light', '#1e1e1e');
                document.documentElement.style.setProperty('--bg-color-lighter', '#2d2d2d');
                document.documentElement.style.setProperty('--text-color', '#f5f5f5');
                document.documentElement.style.setProperty('--text-color-muted', '#aaaaaa');
                toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            isDarkMode = !isDarkMode;
        });
    };
    
    createDarkModeToggle();
}); 