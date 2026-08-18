// Фотогалерея с фильтрацией по категориям и годам

class PhotoGallery {
    constructor() {
        this.currentCategory = null;
        this.currentYear = '2025';
        this.photos = {};
        this.photosLoaded = this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadPhotos();
    }

    bindEvents() {
        // Обработчики для карточек категорий
        const galleryCategories = document.querySelectorAll('.gallery-category');
        if (galleryCategories.length > 0) {
            galleryCategories.forEach(card => {
                card.addEventListener('click', async (e) => {
                    const category = e.currentTarget.dataset.category;
                    await this.openGallery(category);
                });
            });
        }

        // Обработчики для кнопок фильтрации по годам
        const yearButtons = document.querySelectorAll('.year-btn');
        if (yearButtons.length > 0) {
            yearButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterByYear(e.currentTarget.dataset.year);
                });
            });
        }

        // Закрытие модального окна
        const galleryClose = document.querySelector('.gallery-close');
        if (galleryClose) {      
            galleryClose.addEventListener('click', () => {
                this.closeGallery();
            });
        }

        // Закрытие по клику вне модального окна
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.addEventListener('click', (e) => {
                if (e.target.id === 'gallery-modal') {
                    this.closeGallery();
                }
            });
        }
    }

    async loadPhotos() {
        const emptyPhotos = {
            culture: {},
            social: {},
            education: {},
            humanitarian: {},
            psychology: {},
            civic: {}
        };

        try {
            const response = await fetch('data/gallery-photos.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            this.photos = data.photos || emptyPhotos;
        } catch (error) {
            console.error('Помилка завантаження фото галереї:', error);
            this.photos = emptyPhotos;
        }
    }

    getLatestYearForCategory(category) {
        const years = Object.keys(this.photos[category] || {}).sort();
        return years[years.length - 1] || '2025';
    }

    async openGallery(category) {
        await this.photosLoaded;
        this.currentCategory = category;
        this.currentYear = this.getLatestYearForCategory(category);
        
        // Установка заголовка и описания с использованием переводов
        this.updateGalleryTexts(category);

        this.setActiveYearButton(this.currentYear);
        this.displayPhotos(category, this.currentYear);

        // Показ модального окна
        document.getElementById('gallery-modal').style.display = 'flex';
    }

    setActiveYearButton(year) {
        document.querySelectorAll('.year-btn').forEach(btn => {
            const isActive = btn.dataset.year === year;
            btn.classList.toggle('active', isActive);
            btn.style.background = isActive ? '#ffc400' : 'rgba(255,255,255,0.2)';
        });
    }

    updateGalleryTexts(category) {
        // Получаем текущий язык
        const currentLang = window.currentLang || 'ua';
        
        // Маппинг категорий на ключи переводов
        const categoryTranslationKeys = {
            culture: {
                title: 'events_cat_culture_title',
                desc: 'events_cat_culture_desc'
            },
            social: {
                title: 'events_cat_social_title',
                desc: 'events_cat_social_desc'
            },
            education: {
                title: 'events_cat_education_title',
                desc: 'events_cat_education_desc'
            },
            humanitarian: {
                title: 'events_cat_humanitarian_title',
                desc: 'events_cat_humanitarian_desc'
            },
            psychology: {
                title: 'events_cat_psychology_title',
                desc: 'events_cat_psychology_desc'
            },
            civic: {
                title: 'events_cat_civic_title',
                desc: 'events_cat_civic_desc'
            }
        };

        const keys = categoryTranslationKeys[category];
        if (keys && window.translations && window.translations[currentLang]) {
            const titleElement = document.getElementById('gallery-title');
            const descElement = document.getElementById('gallery-description');
            
            if (titleElement && window.translations[currentLang][keys.title]) {
                titleElement.textContent = window.translations[currentLang][keys.title];
            }
            
            if (descElement && window.translations[currentLang][keys.desc]) {
                descElement.textContent = window.translations[currentLang][keys.desc];
            }
        }
    }

    closeGallery() {
        document.getElementById('gallery-modal').style.display = 'none';
        this.currentCategory = null;
        this.currentYear = '2025';
    }

    // Метод для обновления текстов галереи при смене языка
    updateGalleryLanguage() {
        if (this.currentCategory) {
            this.updateGalleryTexts(this.currentCategory);
        }
    }

    filterByYear(year) {
        this.currentYear = year;
        this.setActiveYearButton(year);
        this.displayPhotos(this.currentCategory, year);
    }

    displayPhotos(category, year) {
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = '';

        let photosToShow = [];

        if (year === 'all') {
            Object.keys(this.photos[category] || {})
                .sort()
                .forEach((yearKey) => {
                    photosToShow = photosToShow.concat(this.photos[category][yearKey] || []);
                });
        } else {
            // Показать фотографии только для выбранного года
            photosToShow = this.photos[category][year] || [];
        }

        if (photosToShow.length === 0) {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: white; padding: 40px;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Фотографії відсутні</h3>
                    <p style="font-size: 1rem; opacity: 0.8;">Для цієї категорії та року фотографії ще не додані</p>
                    <p style="font-size: 0.9rem; opacity: 0.6; margin-top: 10px;">
                        Додайте фото у images/events/ у форматі: категорія_рік_номер.jpg
                    </p>
                </div>
            `;
            return;
        }

        photosToShow.forEach((photo) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'gallery-item';
            photoElement.style.cssText = `
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: transform 0.3s ease;
                cursor: pointer;
                min-width: 300px;
            `;

            photoElement.innerHTML = `
                <div style="height: 250px; background: #e9ecef; display: flex; align-items: center; justify-content: center; position: relative;">
                    <img src="${photo.src}" alt="Фото" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none;">
                </div>
            `;

            photoElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            photoElement.addEventListener('mouseenter', () => {
                photoElement.style.transform = 'translateY(-5px)';
            });

            photoElement.addEventListener('mouseleave', () => {
                photoElement.style.transform = 'translateY(0)';
            });

            galleryGrid.appendChild(photoElement);
        });
    }

    getYearFromPhoto(photo) {
        // Определение года из пути к фотографии
        const path = photo.src;
        const yearMatch = path.match(/\/(\d{4})\//);
        return yearMatch ? yearMatch[1] : '2025';
    }

    openPhotoViewer(photos, currentIndex) {
        // Метод залишено для сумісності, але плашка з шляхом до фото більше не показується
        // Тут можна додати повноекранний перегляд фотографій у майбутньому
    }
}

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие элементов галереи на странице
    const galleryCategories = document.querySelectorAll('.gallery-category');
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryCategories.length > 0 || galleryModal) {
        window.photoGallery = new PhotoGallery();
    }
});

// Добавление hover эффектов для карточек категорий
document.addEventListener('DOMContentLoaded', () => {
    const galleryCategories = document.querySelectorAll('.gallery-category');
    if (galleryCategories.length > 0) {
        galleryCategories.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });
    }
}); 