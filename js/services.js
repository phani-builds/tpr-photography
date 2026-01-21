document.addEventListener('DOMContentLoaded', () => {


    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            const answer = question.nextElementSibling;


            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    const a = q.nextElementSibling;
                    if (a) {
                        a.style.maxHeight = '0';
                    }
                }
            });


            if (isActive) {
                question.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    const observerOptions = {
        threshold: 0.1, rootMargin: '0px 0px -50px 0px'
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


    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        scrollObserver.observe(card);
    });


    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
        scrollObserver.observe(item);
    });


    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
        scrollObserver.observe(card);
    });


    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(item);
    });


    const servicesHeaderBg = document.querySelector('.services-header-bg');

    if (servicesHeaderBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            servicesHeaderBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }


    const pricingSection = document.querySelector('.pricing-section');

    if (pricingSection) {
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const featuredCard = entry.target.querySelector('.pricing-card.featured');
                    if (featuredCard) {
                        setTimeout(() => {
                            featuredCard.style.transform = 'scale(1.05)';
                        }, 500);
                    }
                }
            });
        }, {threshold: 0.3});

        pricingObserver.observe(pricingSection);
    }


    const timelineLine = document.querySelector('.timeline-line');

    if (timelineLine) {

        timelineLine.style.height = '100%';
    }


    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const counter = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.ceil(start);
            }
        }, 16);
    }


    const statsElements = document.querySelectorAll('[data-count]');
    if (statsElements.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {threshold: 0.5});

        statsElements.forEach(stat => {
            statsObserver.observe(stat);
        });
    }


    const pricingLinks = document.querySelectorAll('a[href="#pricing"]');

    pricingLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pricingSection = document.querySelector('.pricing-section');
            if (pricingSection) {
                pricingSection.scrollIntoView({
                    behavior: 'smooth', block: 'start'
                });
            }
        });
    });


    const serviceCardsForHover = document.querySelectorAll('.service-card');

    serviceCardsForHover.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });


    /*
    if (faqQuestions.length > 0) {
        const firstQuestion = faqQuestions[0];
        const firstAnswer = firstQuestion.nextElementSibling;
        firstQuestion.classList.add('active');
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
    */


    faqQuestions.forEach((question, index) => {
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextQuestion = faqQuestions[index + 1];
                if (nextQuestion) nextQuestion.focus();
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevQuestion = faqQuestions[index - 1];
                if (prevQuestion) prevQuestion.focus();
            }
        });
    });


    const pricingButtons = document.querySelectorAll('.pricing-btn');

    pricingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planName = btn.closest('.pricing-card').querySelector('h3').textContent;


            if (typeof (Storage) !== "undefined") {
                sessionStorage.setItem('selectedPlan', planName);
            }
        });
    });


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


    console.log('%cServices Page Loaded ✓', 'font-size: 14px; font-weight: bold; color: #d4af37; padding: 5px;');
    console.log(`%cService Cards: ${serviceCards.length} | FAQ Items: ${faqItems.length}`, 'font-size: 11px; color: #a0a0a0;');


    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        console.log('%cMobile navigation initialized', 'color: #4CAF50; font-size: 10px;');
    }

});


function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}


function smoothScrollTo(element, offset = 80) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition, behavior: 'smooth'
    });
}
