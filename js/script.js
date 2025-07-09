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

    // Global variable to store conversation history for context
    let conversationHistory = [{ role: "system", content: "Eres un asistente de atención al cliente para AdminPro Online. Tu objetivo es responder preguntas sobre nuestros servicios (automatización inteligente, gestión de clientes CRM, estrategias personalizadas, análisis de datos predictivo), calificar leads interesados en 'precios', 'demo', 'contacto' o 'presupuesto', y si el usuario pide hablar con un 'agente' o 'humano', debes indicarle que un experto se pondrá en contacto. Mantén las respuestas concisas y profesionales." }];

    async function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;

        // 1. Mostrar mensaje del usuario
        const sentMessageDiv = document.createElement('div');
        sentMessageDiv.classList.add('message', 'sent');
        sentMessageDiv.textContent = messageText;
        chatbotBody.appendChild(sentMessageDiv);
        chatbotInput.value = '';
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Añadir mensaje del usuario al historial de conversación
        conversationHistory.push({ role: "user", content: messageText });

        // 2. Mostrar indicador de "escribiendo"
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'received', 'typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatbotBody.appendChild(typingIndicator);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // 3. Enviar mensaje a la API de chat de n8n
    // ¡IMPORTANTE! Reemplaza 'URL_BASE_DE_TU_INSTANCIA_N8N' con la URL real de tu n8n
    // Ej: 'https://your-n8n-instance.com' o 'http://localhost:5678'
    const n8nChatApiUrl = 'https://atiliosaas.app.n8n.cloud/webhook/3223efb9-b5c0-4688-9db9-5664f8f88ef6/chat';

    // Generar un ID de sesión único para esta conversación
    // Esto es CRUCIAL para que n8n pueda usar la memoria del chat
    let sessionId = localStorage.getItem('n8n_chat_session_id' );
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('n8n_chat_session_id', sessionId);
    }

    try {
        const response = await fetch(n8nChatApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // No necesitas Access-Control-Allow-Origin aquí, n8n lo maneja
            },
            body: JSON.stringify({
                message: messageText,
                chatType: 'n8n Chat', // Indica a n8n que es un chat de n8n
                chatId: sessionId, // ID de la sesión para la memoria
                // No necesitas enviar 'history' desde aquí, n8n lo gestiona con la memoria
            })
        });

        if (response.ok) {
            const data = await response.json();
            const botResponse = data.response || "Lo siento, no pude obtener una respuesta en este momento.";

            // Eliminar indicador de "escribiendo"
            chatbotBody.removeChild(typingIndicator);

            // Mostrar respuesta del bot
            const receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.classList.add('message', 'received');
            receivedMessageDiv.textContent = botResponse;
            chatbotBody.appendChild(receivedMessageDiv);
            chatbotBody.scrollTop = chatbotBody.body.scrollHeight;

            // Añadir respuesta del bot al historial de conversación (para la UI local)
            conversationHistory.push({ role: "assistant", content: botResponse });

        } else {
            console.error('Error al conectar con la API de chat de n8n:', response.status, response.statusText);
            const errorData = await response.json();
            console.error('Detalles del error:', errorData);

            // Eliminar indicador de "escribiendo"
            chatbotBody.removeChild(typingIndicator);

            const receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.classList.add('message', 'received');
            receivedMessageDiv.textContent = "Lo siento, hubo un problema al conectar con el asistente. Por favor, inténtalo de nuevo.";
            chatbotBody.appendChild(receivedMessageDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }
    } catch (error) {
        console.error('Error de red o inesperado al enviar mensaje al chatbot:', error);

        // Eliminar indicador de "escribiendo"
        chatbotBody.removeChild(typingIndicator);

        const receivedMessageDiv = document.createElement('div');
        receivedMessageDiv.classList.add('message', 'received');
        receivedMessageDiv.textContent = "No se pudo conectar con el asistente. Verifica tu conexión a internet.";
        chatbotBody.appendChild(receivedMessageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
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
    contactForm.addEventListener('submit', async (e) => { // Añade 'async' aquí
        e.preventDefault(); // Evita el envío por defecto del formulario

        // Muestra un mensaje de "enviando" y deshabilita el botón
        formMessage.textContent = 'Enviando tu consulta...';
        formMessage.className = 'form-message'; // Quita clases de éxito/error previas
        formMessage.style.display = 'block';
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Recopilación de datos del formulario
        const formData = new FormData(contactForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim(); // Elimina espacios en blanco
        }

        // Validación básica (mantén tu lógica de validación)
        if (data.website !== '') { // Honeypot check
            console.warn('Bot detected via honeypot field.');
            formMessage.textContent = 'Error al enviar. Por favor, inténtalo de nuevo.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Consulta';
            return;
        }

        if (!data.fullName || !data.email || !data.message) {
            formMessage.textContent = 'Por favor, completa todos los campos obligatorios (Nombre, Email, Consulta).';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Consulta';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            formMessage.textContent = 'Por favor, introduce un email válido.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Consulta';
            return;
        }

        // === URL DE TU WEBHOOK DE N8N ===
        // ¡IMPORTANTE! Reemplaza 'TU_WEBHOOK_URL_DE_N8N' con la URL real de tu webhook de n8n
        const n8nWebhookUrl = 'https://atiliosaas.app.n8n.cloud/webhook/contact-form'; 
        // =================================

        try {
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Opcional, pero buena práctica
                },
                body: JSON.stringify(data) // Envía los datos como JSON
            });

            if (response.ok) {
                // Si la respuesta es exitosa (código 2xx)
                formMessage.textContent = '¡Éxito! Tu visión es nuestra misión. Hemos recibido tu consulta y estamos ansiosos por transformar tu negocio. En breve, un experto se pondrá en contacto contigo para dar el siguiente paso hacia tu administración inteligente.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                contactForm.reset(); // Limpia el formulario
                // Cierra el modal después de un breve retraso
                setTimeout(() => {
                    closeModal(contactModal);
                }, 5000);
            } else {
                // Si la respuesta no es exitosa
                console.error('Error al enviar a n8n:', response.status, response.statusText);
                const errorData = await response.json(); // Intenta leer el cuerpo del error
                console.error('Detalles del error:', errorData);
                formMessage.textContent = 'Hubo un problema al enviar tu consulta. Por favor, inténtalo de nuevo más tarde.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        } catch (error) {
            // Error de red o cualquier otro error durante la petición
            console.error('Error de red o inesperado:', error);
            formMessage.textContent = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            // Restablece el botón de envío
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Consulta';
        }
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

    
