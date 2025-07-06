// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('#header').offsetHeight; // Get header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Update active class for navigation
            document.querySelectorAll('.main-nav ul li a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Set active class on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('#header').offsetHeight;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Handle header background on scroll
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 15, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });

    // Testimonial Slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? testimonialItems.length - 1 : currentIndex - 1;
        showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === testimonialItems.length - 1) ? 0 : currentIndex + 1;
        showTestimonial(currentIndex);
    });

    // Initial display of the first testimonial
    showTestimonial(currentIndex);

    // Auto-slide testimonials
    let slideInterval = setInterval(() => {
        currentIndex = (currentIndex === testimonialItems.length - 1) ? 0 : currentIndex + 1;
        showTestimonial(currentIndex);
    }, 7000); // Change slide every 7 seconds

    // Pause auto-slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    testimonialSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentIndex = (currentIndex === testimonialItems.length - 1) ? 0 : currentIndex + 1;
            showTestimonial(currentIndex);
        }, 7000);
    });


    // Scroll-to-Top Button functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Chatbot Placeholder functionality
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbotBtn = document.querySelector('.close-chatbot');
    const chatbotInput = chatbotWindow.querySelector('input[type="text"]');
    const chatbotSendBtn = chatbotWindow.querySelector('.chatbot-footer button');
    const chatbotBody = chatbotWindow.querySelector('.chatbot-body');

    chatbotIcon.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    // Simulate sending/receiving messages (visual only)
    chatbotSendBtn.addEventListener('click', () => {
        sendMessage();
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText !== '') {
            const sentMessageDiv = document.createElement('div');
            sentMessageDiv.classList.add('message', 'sent');
            sentMessageDiv.textContent = messageText;
            chatbotBody.appendChild(sentMessageDiv);
            chatbotInput.value = '';
            chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom

            // Simulate a response after a short delay
            setTimeout(() => {
                const receivedMessageDiv = document.createElement('div');
                receivedMessageDiv.classList.add('message', 'received');
                receivedMessageDiv.textContent = "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.";
                chatbotBody.appendChild(receivedMessageDiv);
                chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom
            }, 1500);
        }
    }

    // Intersection Observer for "How It Works" timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length > 0) {
        // Añadir clase animate para preparar la animación
        timelineItems.forEach(item => {
            item.classList.add('animate');
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of the item is visible (más sensible)
        };

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('animate');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Lazy loading for images (if any were added beyond placeholders)
    // For this specific project, placeholders are used, but for real images:
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        lazyLoadObserver.observe(img);
    });

    // js/script.js (dentro de document.addEventListener('DOMContentLoaded', () => { ... }); )

    // FAQ Section Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle the clicked FAQ item
            item.classList.toggle('active');
        });
    });

    // js/script.js (dentro de document.addEventListener('DOMContentLoaded', () => { ... }); )

    // Contact Form Modal functionality
    const contactModal = document.getElementById('contact-modal');
    const openContactModalBtn = document.querySelector('.btn-contact'); // Assuming this is the button in the header
    const closeContactModalBtn = contactModal.querySelector('.close-modal');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const honeypotField = document.getElementById('website'); // Honeypot field

    // Function to open modal
    function openModal(modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Function to close modal
    function closeModal(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
        formMessage.style.display = 'none'; // Hide any previous messages
        contactForm.reset(); // Clear form fields
    }

    // Event listeners for contact modal
    openContactModalBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        openModal(contactModal);
    });

    closeContactModalBtn.addEventListener('click', () => {
        closeModal(contactModal);
    });

    // Close modal if clicking outside the content
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal(contactModal);
        }
    });

    // Form submission handling
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const phone = document.getElementById('phone').value.trim(); // Optional, so no 'required' check

        // Anti-bot check (honeypot)
        if (honeypotField.value !== '') {
            console.warn('Bot detected via honeypot field.');
            formMessage.textContent = 'Error al enviar. Por favor, inténtalo de nuevo.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return; // Stop submission
        }

        if (!fullName || !email || !message) {
            formMessage.textContent = 'Por favor, completa todos los campos obligatorios (Nombre, Email, Consulta).';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formMessage.textContent = 'Por favor, introduce un email válido.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }

        // If all checks pass, simulate success
        console.log('Formulario enviado:', { fullName, email, phone, message });

        // Psychological success message
        formMessage.textContent = '¡Éxito! Tu visión es nuestra misión. Hemos recibido tu consulta y estamos ansiosos por transformar tu negocio. En breve, un experto se pondrá en contacto contigo para dar el siguiente paso hacia tu administración inteligente.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';

        // Close modal and clear form after a short delay
        setTimeout(() => {
            closeModal(contactModal);
        }, 5000); // Give user time to read success message
    });
    // js/script.js (dentro de document.addEventListener('DOMContentLoaded', () => { ... }); )

    // Privacy Policy Modal functionality
    const privacyModal = document.getElementById('privacy-modal');
    const openPrivacyModalBtn = document.querySelector('#footer .footer-links a[href="#"]'); // Selects the first link in footer-links
    const closePrivacyModalBtn = privacyModal.querySelector('.close-modal');

    // Make sure to select the correct link for Privacy Policy.
    // If you have multiple links, give them unique IDs or better selectors.
    // For now, assuming the first link in footer-links is Privacy Policy.
    if (openPrivacyModalBtn) {
        openPrivacyModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    }

    closePrivacyModalBtn.addEventListener('click', () => {
        closeModal(privacyModal);
    });

    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            closeModal(privacyModal);
        }
    });
// js/script.js (dentro de document.addEventListener('DOMContentLoaded', () => { ... }); )

    // Terms and Conditions Modal functionality
    const termsModal = document.getElementById('terms-modal');
    // Assuming the second link in footer-links is Terms and Conditions.
    const openTermsModalBtn = document.querySelector('#footer .footer-links a:nth-child(2)');
    const closeTermsModalBtn = termsModal.querySelector('.close-modal');

    if (openTermsModalBtn) {
        openTermsModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(termsModal);
        });
    }

    closeTermsModalBtn.addEventListener('click', () => {
        closeModal(termsModal);
    });

    termsModal.addEventListener('click', (e) => {
        if (e.target === termsModal) {
            closeModal(termsModal);
        }
    });

    // Funcionalidad del Menú Hamburguesa
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace (en móvil)
        const navLinksHamburger = document.querySelectorAll('.main-nav ul li a');
        navLinksHamburger.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburgerMenu.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!hamburgerMenu.contains(e.target) && !mainNav.contains(e.target)) {
                    hamburgerMenu.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }
        });

        // Cerrar menú al cambiar el tamaño de la ventana (si se pasa a desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }

    // ===================================
    // LANGUAGE DROPDOWN FUNCTIONALITY
    // ===================================

    const languageDropdown = document.querySelector('.language-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (languageDropdown && dropdownToggle && dropdownMenu && dropdownItems.length > 0) {
        // Function to open/close the dropdown
        function toggleDropdown() {
            languageDropdown.classList.toggle('active');
            dropdownToggle.setAttribute('aria-expanded', languageDropdown.classList.contains('active'));
        }

        // Event listener for the dropdown toggle button
        dropdownToggle.addEventListener('click', toggleDropdown);

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!languageDropdown.contains(event.target)) {
                languageDropdown.classList.remove('active');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle keyboard navigation for accessibility
        dropdownToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'ArrowDown' && languageDropdown.classList.contains('active')) {
                e.preventDefault();
                dropdownItems[0].focus();
            }
        });

        dropdownItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0'); // Make items focusable
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click(); // Simulate click on Enter/Space
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % dropdownItems.length;
                    dropdownItems[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + dropdownItems.length) % dropdownItems.length;
                    dropdownItems[prevIndex].focus();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    languageDropdown.classList.remove('active');
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                    dropdownToggle.focus();
                }
            });
        });

        // Set active language in dropdown based on current URL
        const currentPath = window.location.pathname;
        let currentLang = 'es'; // Default

        if (currentPath.includes('/en/')) {
            currentLang = 'en';
        } else if (currentPath.includes('/de/')) {
            currentLang = 'de';
        } else if (currentPath.includes('/es/')) {
            currentLang = 'es';
        }

        dropdownItems.forEach(item => {
            const itemLang = item.getAttribute('data-lang');
            if (itemLang === currentLang) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
                // Optional: Update the toggle button to show the current language (e.g., its flag or text)
                // For this design, we just have the globe icon, so no change needed on toggle.
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
    }

});

    
