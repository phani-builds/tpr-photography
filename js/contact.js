



document.addEventListener('DOMContentLoaded', () => {

    
    
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    
    const fadeElements = document.querySelectorAll('.fade-in-up, .info-box, .glass-form');
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        scrollObserver.observe(element);
    });

    
    
    
    const contactHeaderBg = document.querySelector('.contact-header-bg');

    if (contactHeaderBg) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxSpeed = 0.5;
                    contactHeaderBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    
    
    
    const contactForm = document.getElementById('contactForm');
    const formInputs = {
        name: document.getElementById('name'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        date: document.getElementById('date'),
        service: document.getElementById('service'),
        message: document.getElementById('message')
    };

    
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        phone: /^[6-9]\d{9}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    
    function validateField(field, pattern) {
        const inputGroup = field.parentElement;
        const errorSpan = inputGroup.querySelector('.form-error');

        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (pattern && field.value.trim() && !pattern.test(field.value.trim())) {
            isValid = false;

            if (field.id === 'name') {
                errorMessage = 'Please enter a valid name (2-50 characters)';
            } else if (field.id === 'phone') {
                errorMessage = 'Please enter a valid 10-digit Indian mobile number';
            } else if (field.id === 'email') {
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            inputGroup.classList.add('error');
            if (errorSpan) errorSpan.textContent = errorMessage;
            return false;
        } else {
            field.classList.remove('error');
            inputGroup.classList.remove('error');
            if (errorSpan) errorSpan.textContent = '';
            return true;
        }
    }

    
    Object.keys(formInputs).forEach(key => {
        const field = formInputs[key];
        if (field) {
            field.addEventListener('blur', () => {
                validateField(field, patterns[key]);
            });

            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field, patterns[key]);
                }
            });
        }
    });

    
    const serviceSelect = formInputs.service;
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            if (this.value) {
                this.style.color = 'var(--text-light)';
            }
        });
    }

    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            
            let isFormValid = true;

            ['name', 'phone', 'service', 'message'].forEach(key => {
                const field = formInputs[key];
                if (field && !validateField(field, patterns[key])) {
                    isFormValid = false;
                }
            });

            
            if (formInputs.email && formInputs.email.value.trim()) {
                if (!validateField(formInputs.email, patterns.email)) {
                    isFormValid = false;
                }
            }

            if (!isFormValid) {
                
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';

            
            await new Promise(resolve => setTimeout(resolve, 800));

            
            const formData = {
                name: formInputs.name.value.trim(),
                phone: formInputs.phone.value.trim(),
                email: formInputs.email.value.trim(),
                date: formInputs.date.value || 'Not specified',
                service: formInputs.service.options[formInputs.service.selectedIndex].text,
                message: formInputs.message.value.trim()
            };

            
            let whatsappMessage = `Hi! I'm *${formData.name}*\n\n`;
            whatsappMessage += `Phone: ${formData.phone}\n`;

            if (formData.email) {
                whatsappMessage += `Email: ${formData.email}\n`;
            }

            whatsappMessage += `Event Date: ${formData.date}\n`;
            whatsappMessage += `Service: *${formData.service}*\n\n`;
            whatsappMessage += `Message:\n${formData.message}`;

            
            const whatsappUrl = `https://wa.me/919494627744?text=${encodeURIComponent(whatsappMessage)}`;

            
            console.log('Redirecting to WhatsApp with message:', formData);

            
            submitBtn.disabled = false;
            btnText.style.display = 'inline-flex';
            btnLoader.style.display = 'none';

            
            window.open(whatsappUrl, '_blank');

            
            setTimeout(() => {
                contactForm.reset();
                serviceSelect.style.color = 'rgba(255, 255, 255, 0.5)';
            }, 1000);
        });
    }

    
    
    
    const infoBoxes = document.querySelectorAll('.info-box');

    infoBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.6s ease';
            }
        });

        box.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.info-icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });

    
    
    
    const waCta = document.querySelector('.wa-cta');

    if (waCta) {
        
        setInterval(() => {
            waCta.style.animation = 'pulse 0.8s ease';
            setTimeout(() => {
                waCta.style.animation = '';
            }, 800);
        }, 3000);
    }

    
    
    
    const mapContainer = document.querySelector('.map-container');

    if (mapContainer) {
        const mapIframe = mapContainer.querySelector('iframe');

        mapContainer.addEventListener('mouseenter', () => {
            mapIframe.style.pointerEvents = 'auto';
        });

        mapContainer.addEventListener('mouseleave', () => {
            mapIframe.style.pointerEvents = 'none';
        });

        
        mapContainer.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                mapIframe.style.pointerEvents = 'auto';
                setTimeout(() => {
                    mapIframe.style.pointerEvents = 'none';
                }, 3000);
            }
        });
    }

    
    
    
    
    if (typeof(Storage) !== "undefined") {
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        if (selectedPlan && serviceSelect) {
            
            const planMapping = {
                'Silver': 'wedding',
                'Gold': 'wedding',
                'Platinum': 'wedding'
            };

            const serviceValue = planMapping[selectedPlan] || 'wedding';
            serviceSelect.value = serviceValue;
            serviceSelect.style.color = 'var(--text-light)';

            
            if (formInputs.message) {
                formInputs.message.value = `I'm interested in the ${selectedPlan} package.`;
            }

            
            sessionStorage.removeItem('selectedPlan');
        }
    }

    
    
    
    const formFields = contactForm.querySelectorAll('.form-input');

    formFields.forEach((field, index) => {
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && field.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const nextField = formFields[index + 1];
                if (nextField) {
                    nextField.focus();
                } else {
                    contactForm.querySelector('.form-submit-btn').click();
                }
            }
        });
    });

    
    
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    
    
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    
    const debouncedScroll = debounce(() => {
        
    }, 100);

    window.addEventListener('scroll', debouncedScroll);

    
    
    
    console.log(
        '%cContact Page Loaded ✓',
        'font-size: 14px; font-weight: bold; color: #d4af37; padding: 5px;'
    );
    console.log(
        `%cForm validation enabled | WhatsApp ready`,
        'font-size: 11px; color: #a0a0a0;'
    );

    
    
    
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        console.log('%cMobile navigation initialized', 'color: #4CAF50; font-size: 10px;');
    }

    
    
    
    const messageField = formInputs.message;
    if (messageField) {
        const maxLength = 500;

        messageField.setAttribute('maxlength', maxLength);

        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; color: var(--text-gray); font-size: 0.75rem; margin-top: 5px;';
        messageField.parentElement.appendChild(counter);

        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;

            if (remaining < 50) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = 'var(--text-gray)';
            }
        }

        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }

});






function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


function smoothScrollTo(element, offset = 80) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}


function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.slice(0, 10);
}
