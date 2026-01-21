



document.addEventListener('DOMContentLoaded', () => {

    
    
    
    const BASE_URL = 'https://cdn.jsdelivr.net/gh/tpr-photography/images@main';
    const JSON_URL = `${BASE_URL}/gallery.json`;
    const CATEGORIES = ['weddings', 'preweddings', 'birthdays', 'halfsarees', 'dhoti', 'realestate'];
    const PAGE_SIZE = 24;

    let ALL_ITEMS = [];
    let CURRENT_VIEW = [];
    let CURRENT_INDEX = 0;

    
    
    
    const gallery = document.getElementById('galleryMasonry');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    
    const filterTrigger = document.getElementById('filterTrigger');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterOptions = document.querySelectorAll('.filter-option');

    
    const bottomSheet = document.getElementById('bottomSheet');
    const bottomSheetOverlay = document.getElementById('bottomSheetOverlay');
    const bottomSheetClose = document.getElementById('bottomSheetClose');

    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let visibleItems = [];
    let currentLightboxIndex = 0;

    
    let touchStartX = 0;
    let touchEndX = 0;

    
    
    
    let imageObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const img = e.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');

                    img.addEventListener('load', () => {
                        img.style.filter = 'brightness(0.92)';
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    
    
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    
    
    
    function formatCategory(slug) {
        const map = {
            weddings: 'Weddings',
            preweddings: 'Pre Weddings',
            birthdays: 'Birthdays',
            halfsarees: 'Half Sarees',
            dhoti: 'Dhoti',
            realestate: 'Real Estate'
        };
        return map[slug] || slug;
    }

    function imageUrl(category, file) {
        return `${BASE_URL}/${category}/${file}`;
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

    
    
    
    function createItem(category, file) {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.dataset.category = category;

        
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';

        const img = document.createElement('img');
        img.dataset.src = imageUrl(category, file);
        img.alt = file.replace(/\.[^/.]+$/, '');
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'masonry-overlay';

        const info = document.createElement('div');
        info.className = 'masonry-info';

        const cat = document.createElement('span');
        cat.className = 'masonry-category';
        cat.textContent = formatCategory(category);

        info.appendChild(cat);
        overlay.appendChild(info);
        item.appendChild(img);
        item.appendChild(overlay);

        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(item);
        });

        
        imageObserver.observe(img);
        revealObserver.observe(item);

        return item;
    }

    
    
    
    function renderNext() {
        const slice = CURRENT_VIEW.slice(CURRENT_INDEX, CURRENT_INDEX + PAGE_SIZE);
        slice.forEach(i => {
            const item = createItem(i.category, i.file);
            gallery.appendChild(item);
        });
        CURRENT_INDEX += slice.length;
        updateLoadMore();
    }

    function updateLoadMore() {
        if (!loadMoreBtn) return;
        loadMoreBtn.style.display = CURRENT_INDEX < CURRENT_VIEW.length ? 'inline-block' : 'none';
    }

    function showEmpty(filterValue) {
        const categoryName = filterValue === 'all' ? 'all' : formatCategory(filterValue);

        
        gallery.innerHTML = '';

        
        const emptyContainer = document.createElement('div');
        emptyContainer.className = 'gallery-empty';

        
        const emptyText = document.createElement('p');
        emptyText.textContent = `${categoryName === 'all' ? 'Gallery' : categoryName} images will be added soon`;

        emptyContainer.appendChild(emptyText);
        gallery.appendChild(emptyContainer);

        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    
    
    
    function applyFilter(filter) {
        
        gallery.innerHTML = '';
        CURRENT_INDEX = 0;

        if (filter === 'all') {
            CURRENT_VIEW = ALL_ITEMS.slice();
        } else {
            CURRENT_VIEW = ALL_ITEMS.filter(i => i.category === filter);
        }

        if (CURRENT_VIEW.length === 0) {
            showEmpty(filter);
            return;
        }

        renderNext();
    }

    
    
    
    function openBottomSheet() {
        if (bottomSheet) {
            bottomSheet.classList.add('active');
        }
        if (filterTrigger) {
            filterTrigger.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeBottomSheet() {
        if (bottomSheet) {
            bottomSheet.classList.remove('active');
        }
        if (filterTrigger) {
            filterTrigger.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    
    
    
    function openLightbox(clickedItem) {
        
        visibleItems = Array.from(document.querySelectorAll('.masonry-item'));
        currentLightboxIndex = visibleItems.indexOf(clickedItem);

        if (currentLightboxIndex === -1) {
            console.error('Item not found in visible items');
            return;
        }

        const img = clickedItem.querySelector('img');
        const cat = clickedItem.querySelector('.masonry-category');

        if (!img || !cat) {
            console.error('Image or category not found');
            return;
        }

        
        const imgSrc = img.src && img.src !== window.location.href ? img.src : img.dataset.src;

        if (lightboxImg && imgSrc) {
            lightboxImg.src = imgSrc;
        }

        if (lightboxCaption && cat) {
            lightboxCaption.textContent = cat.textContent;
        }

        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        updateNav();
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
        }
        document.body.style.overflow = '';
        if (lightboxImg) {
            lightboxImg.src = '';
        }
    }

    function showNext() {
        if (currentLightboxIndex < visibleItems.length - 1) {
            currentLightboxIndex++;
            openLightbox(visibleItems[currentLightboxIndex]);
        }
    }

    function showPrev() {
        if (currentLightboxIndex > 0) {
            currentLightboxIndex--;
            openLightbox(visibleItems[currentLightboxIndex]);
        }
    }

    function updateNav() {
        if (!prevBtn || !nextBtn) return;

        prevBtn.style.opacity = currentLightboxIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentLightboxIndex === 0 ? 'not-allowed' : 'pointer';

        nextBtn.style.opacity = currentLightboxIndex === visibleItems.length - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentLightboxIndex === visibleItems.length - 1 ? 'not-allowed' : 'pointer';
    }

    
    
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext(); 
            } else {
                showPrev(); 
            }
        }
    }

    
    
    

    
    if (filterTrigger) {
        filterTrigger.addEventListener('click', openBottomSheet);
    }

    
    if (bottomSheetClose) {
        bottomSheetClose.addEventListener('click', closeBottomSheet);
    }

    if (bottomSheetOverlay) {
        bottomSheetOverlay.addEventListener('click', closeBottomSheet);
    }

    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });

    
    filterOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            filterOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            const filterValue = opt.dataset.filter;
            const filterText = opt.querySelector('span').textContent;

            if (filterTrigger) {
                const triggerSpan = filterTrigger.querySelector('span');
                if (triggerSpan) {
                    triggerSpan.textContent = filterText;
                }
            }

            applyFilter(filterValue);

            setTimeout(() => {
                closeBottomSheet();
            }, 300);
        });
    });

    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderNext);
    }

    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', e => {
            e.stopPropagation();
            showPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', e => {
            e.stopPropagation();
            showNext();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    
    document.addEventListener('keydown', e => {
        
        if (e.key === 'Escape' && bottomSheet && bottomSheet.classList.contains('active')) {
            closeBottomSheet();
            return;
        }

        
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    
    if (bottomSheet) {
        bottomSheet.addEventListener('keydown', (e) => {
            if (!bottomSheet.classList.contains('active')) return;

            const focusableElements = bottomSheet.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    
    const handleResize = debounce(() => {
        
        if (window.innerWidth >= 768 && bottomSheet && bottomSheet.classList.contains('active')) {
            closeBottomSheet();
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    
    
    
    async function init() {
        try {
            const res = await fetch(JSON_URL);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            CATEGORIES.forEach(cat => {
                if (data[cat] && Array.isArray(data[cat])) {
                    data[cat].forEach(file => {
                        ALL_ITEMS.push({ category: cat, file });
                    });
                }
            });

            CURRENT_VIEW = ALL_ITEMS.slice();

            if (CURRENT_VIEW.length === 0) {
                showEmpty('all');
                return;
            }

            renderNext();

            
            console.log(
                '%cGallery Loaded Successfully ✓',
                'font-size: 14px; font-weight: bold; color: #d4af37; padding: 5px;'
            );
            console.log(
                `%cTotal Items: ${ALL_ITEMS.length} | Categories: ${CATEGORIES.length}`,
                'font-size: 11px; color: #a0a0a0;'
            );

        } catch (error) {
            console.error('Failed to load gallery:', error);
            gallery.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'gallery-empty';
            errorDiv.innerHTML = '<p>Failed to load gallery. Please try again later.</p>';
            gallery.appendChild(errorDiv);

            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    init();

});