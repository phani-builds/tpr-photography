



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

    
    const fadeElements = document.querySelectorAll('.fade-in-up, .story-images, .story-content, .vision-card, .gear-card, .team-card');
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        scrollObserver.observe(element);
    });

    
    
    
    const aboutHeaderBg = document.querySelector('.about-header-bg');

    if (aboutHeaderBg) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxSpeed = 0.5;
                    aboutHeaderBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    
    
    
    const storyImage = document.querySelector('.img-main');
    const backdropBox = document.querySelector('.img-backdrop-box');

    if (storyImage && backdropBox) {
        storyImage.addEventListener('mouseenter', () => {
            backdropBox.style.transform = 'translate(10px, 10px)';
            backdropBox.style.opacity = '0.5';
        });

        storyImage.addEventListener('mouseleave', () => {
            backdropBox.style.transform = 'translate(0, 0)';
            backdropBox.style.opacity = '0.3';
        });
    }

    
    
    
    const gearCards = document.querySelectorAll('.gear-card');

    gearCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });

        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    
    
    
    const visionCard = document.querySelector('.vision-card');

    if (visionCard) {
        const visionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const quoteIcon = entry.target.querySelector('.quote-icon');
                    if (quoteIcon) {
                        quoteIcon.style.animation = 'fadeInScale 0.8s ease forwards';
                    }
                }
            });
        }, { threshold: 0.5 });

        visionObserver.observe(visionCard);
    }

    
    
    
    const teamCard = document.querySelector('.team-card');
    const teamFeatures = document.querySelectorAll('.team-feature');

    if (teamCard) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    teamFeatures.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        teamObserver.observe(teamCard);

        
        teamFeatures.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
            feature.style.transition = 'all 0.5s ease';
        });
    }

    
    const teamIcon = document.querySelector('.team-icon');
    if (teamIcon) {
        teamCard.addEventListener('mouseenter', () => {
            teamIcon.style.animation = 'pulse 0.6s ease';
        });

        teamCard.addEventListener('mouseleave', () => {
            teamIcon.style.animation = '';
        });
    }

    
    
    
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId !== '#' && targetId !== '') {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    
    
    
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window && images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    
    
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 0.7;
                transform: scale(1);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        @keyframes shimmer {
            0% {
                background-position: -1000px 0;
            }
            100% {
                background-position: 1000px 0;
            }
        }
    `;
    document.head.appendChild(style);

    
    
    
    const signature = document.querySelector('.signature-img');

    if (signature) {
        const signatureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    signature.style.opacity = '0';
                    signature.style.transform = 'translateX(-20px)';

                    setTimeout(() => {
                        signature.style.transition = 'all 1s ease';
                        signature.style.opacity = '0.6';
                        signature.style.transform = 'translateX(0)';
                    }, 800);
                }
            });
        }, { threshold: 0.5 });

        signatureObserver.observe(signature);
    }

    
    
    
    const experienceHighlight = document.querySelector('.experience-highlight');

    if (experienceHighlight) {
        const experienceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        experienceHighlight.style.animation = 'pulse 1s ease';
                    }, 500);
                }
            });
        }, { threshold: 0.5 });

        experienceObserver.observe(experienceHighlight);
    }

    
    
    
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
        '%cAbout Page Loaded ✓',
        'font-size: 14px; font-weight: bold; color: #d4af37; padding: 5px;'
    );
    console.log(
        `%cTeam Section | Gear: ${gearCards.length}`,
        'font-size: 11px; color: #a0a0a0;'
    );

    
    
    
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        console.log('%cMobile navigation initialized', 'color: #4CAF50; font-size: 10px;');
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

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
