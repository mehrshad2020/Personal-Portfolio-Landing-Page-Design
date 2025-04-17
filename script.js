// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get header element
    const header = document.querySelector('header');
    
    // Function to handle scroll event
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header-shadow');
        } else {
            header.classList.remove('header-shadow');
        }

        // Check elements in viewport and animate them
        animateElementsInViewport();
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Adjust section heights for better responsive layout
    function adjustSectionHeights() {
        const heroSection = document.getElementById('home');
        if (heroSection) {
            // Set the hero section height based on viewport
            if (window.innerWidth < 1130) {
                // On mobile, use auto height instead of viewport height
                heroSection.style.height = 'auto';
                heroSection.style.minHeight = 'auto';
            } else {
                // On desktop, use viewport height minus header height
                const headerHeight = document.querySelector('header').offsetHeight;
                heroSection.style.minHeight = `calc(100vh - ${headerHeight}px)`;
            }
        }
    }
    
    // Call on page load and resize
    adjustSectionHeights();
    window.addEventListener('resize', adjustSectionHeights);
    
    // Set active nav item based on current section
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    
    function setActiveNavItem() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(navItem => {
            navItem.classList.remove('nav-item-active');
            if (navItem.getAttribute('href').substring(1) === current) {
                navItem.classList.add('nav-item-active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavItem);
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('menu-open');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('menu-open');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking a nav link
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('menu-open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Check if an element is in viewport
    function isInViewport(element, offset = 100) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= 0 &&
            rect.left <= window.innerWidth &&
            rect.right >= 0
        );
    }

    // Animate elements when they come into viewport
    function animateElementsInViewport() {
        // Elements to animate (add more as needed)
        animateSkillBars();
        animateServiceCards();
        animateProjectCards();
        animateSectionHeadings();
    }

    // Skill progress bar animation
    function animateSkillBars() {
        const progressBars = document.querySelectorAll('.skill-progress-bar');
        
        progressBars.forEach(bar => {
            if (isInViewport(bar)) {
                const width = bar.getAttribute('data-width');
                
                if (bar.style.width === '0%' || bar.style.width === '') {
                    // Animate the progress bar
                    setTimeout(() => {
                        bar.style.width = width + '%';
                        
                        // Move the indicator
                        const indicator = bar.nextElementSibling;
                        if (indicator && indicator.classList.contains('skill-progress-indicator')) {
                            indicator.style.left = width + '%';
                        }
                    }, 200);
                }
            }
        });
    }
    
    // Service cards animation
    function animateServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            if (isInViewport(card)) {
                // Add animation class with delay based on index
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            }
        });
    }
    
    // Project cards animation
    function animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            if (isInViewport(card) && !card.classList.contains('animated')) {
                // Add animation class with delay based on index
                setTimeout(() => {
                    card.classList.add('animated');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }

    // Section headings animation
    function animateSectionHeadings() {
        const headings = document.querySelectorAll('section h2');
        
        headings.forEach(heading => {
            if (isInViewport(heading) && !heading.classList.contains('animated')) {
                heading.classList.add('animated');
                heading.style.opacity = '1';
                heading.style.transform = 'translateY(0)';
            }
        });
    }

    // Call animation functions on page load
    setTimeout(() => {
        animateElementsInViewport();
    }, 500);

    // Initialize skill bars to 0 width
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });

    // Create IntersectionObserver for elements that need to be animated when they enter the viewport
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to the element
                entry.target.classList.add('in-viewport');
                
                // Unobserve after animation
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(element => {
        animationObserver.observe(element);
    });
    
    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Initialize projects - show all on page load
    projectCards.forEach(card => {
        card.classList.add('show');
    });
    
    // Filter button click handler
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(filterBtn => {
                filterBtn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Get selected filter
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                card.classList.remove('show');
                card.classList.add('hide');
                
                // If "all" is selected or card matches filter category
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    setTimeout(() => {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    }, 300);
                }
            });
            
            // Refresh AOS animations
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        });
    });

    // Testimonials Slider
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-nav-btn.prev');
    const nextBtn = document.querySelector('.slider-nav-btn.next');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    let currentIndex = 0;
    let slideWidth = 0;
    let autoSlideInterval;
    
    // Initialize slider
    function initTestimonialsSlider() {
        if (!testimonialsWrapper || testimonialCards.length === 0) return;
        
        // Calculate slide width based on viewport
        function updateSlideWidth() {
            if (window.innerWidth < 1130) {
                slideWidth = testimonialsWrapper.parentElement.clientWidth;
            } else {
                slideWidth = testimonialsWrapper.parentElement.clientWidth / 3;
            }
            
            // Apply initial position
            goToSlide(currentIndex);
        }
        
        // Initial calculation
        updateSlideWidth();
        
        // Update on window resize
        window.addEventListener('resize', updateSlideWidth);
        
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoSlide();
            });
        }
        
        // Event listeners for pagination dots
        paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });
        
        // Start auto slide
        startAutoSlide();
    }
    
    // Go to specified slide index
    function goToSlide(index) {
        if (!testimonialsWrapper) return;
        
        // Handle edge cases
        if (index < 0) {
            index = testimonialCards.length - 1;
        } else if (index >= testimonialCards.length) {
            index = 0;
        }
        
        // Update current index
        currentIndex = index;
        
        // Move slider
        testimonialsWrapper.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
        
        // Update pagination dots
        updatePaginationDots();
    }
    
    // Update active pagination dot
    function updatePaginationDots() {
        paginationDots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-primary');
            } else {
                dot.classList.remove('active');
                dot.classList.remove('bg-primary');
                dot.classList.add('bg-gray-300');
            }
        });
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Initialize testimonials slider
    initTestimonialsSlider();

    // Contact Form Validation
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Add form submission event listener
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            
            // Name validation
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            // Email validation
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Message validation
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // If form is valid, submit
            if (isValid) {
                // Simulate form submission
                submitButton.disabled = true;
                submitButton.classList.add('opacity-75');
                submitButton.textContent = 'Sending...';
                
                // Simulate API request
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                    successMessage.innerHTML = '<strong>Success!</strong> Your message has been sent.';
                    contactForm.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.classList.remove('opacity-75');
                    submitButton.textContent = 'Submit';
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
        
        // Helper functions for form validation
        function showError(input, message) {
            // Remove any existing error message
            removeError(input);
            
            // Add error class to input
            input.classList.add('border-red-500');
            
            // Create error message element
            const errorElement = document.createElement('p');
            errorElement.className = 'text-red-500 text-sm mt-1 error-message';
            errorElement.textContent = message;
            
            // Insert error message after input
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        function removeError(input) {
            // Remove error class from input
            input.classList.remove('border-red-500');
            
            // Remove error message if it exists
            const errorElement = input.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
    
    // Setup AOS with custom options
    if (typeof AOS !== 'undefined') {
        // Customize AOS options
        AOS.refresh();
        
        // Add event listener for when animations complete
        document.addEventListener('aos:in', ({ detail }) => {
            // You can do something when an element animates in
            const animatedElement = detail;
            
            // Special handling for certain elements if needed
            if (animatedElement.classList.contains('service-card')) {
                animatedElement.classList.add('animate-in');
            }
        });
        
        // AOS is already initialized in the HTML, but we can do additional setup here
        window.addEventListener('resize', () => {
            // Refresh AOS on window resize
            AOS.refresh();
        });
    }

    // Implement smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll to top button functionality
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '&uarr;';
    document.body.appendChild(scrollTopBtn);

    // Add styles for the scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #ffcc00;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: none;
            z-index: 999;
            transition: all 0.3s ease;
            opacity: 0.8;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .scroll-top-btn:hover {
            opacity: 1;
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        
        /* Initial states for animations */
        .project-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section h2 {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .animate-in {
            animation: fadeInUp 0.6s forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial call to handle scroll
    handleScroll();
}); 