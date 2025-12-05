// Фотогалерея с фильтрацией по категориям и годам
class PhotoGallery {
    constructor() {
        this.currentCategory = null;
        this.currentYear = 'all';
        this.photos = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPhotos();
    }

    bindEvents() {
        // Обработчики для карточек категорий
        const galleryCategories = document.querySelectorAll('.gallery-category');
        if (galleryCategories.length > 0) {
            galleryCategories.forEach(card => {
                card.addEventListener('click', (e) => {
                    const category = e.currentTarget.dataset.category;
                    this.openGallery(category);
                });
            });
        }

        // Обработчики для кнопок фильтрации по годам
        const yearButtons = document.querySelectorAll('.year-btn');
        if (yearButtons.length > 0) {
            yearButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterByYear(e.target.dataset.year);
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

    loadPhotos() {
        // ПРОСТАЯ СТРУКТУРА ДЛЯ ДОБАВЛЕНИЯ ФОТОГРАФИЙ
        // Для добавления фотографий:
        // 1. Поместите фотографии в папку images/events/
        // 2. Добавьте информацию о фотографиях в этот объект
        this.photos = {
            culture: {
                2022: [
                    { src: 'images/events/culture_2022_1.jpeg' },
                    { src: 'images/events/culture_2022_2.jpeg' },
                    { src: 'images/events/culture_2022_3.jpeg' },
                    { src: 'images/events/culture_2022_4.jpeg' },
                    { src: 'images/events/culture_2022_5.jpeg' }
                ],
                2023: [
                    { src: 'images/events/culture_2023_1.jpeg' },
                    { src: 'images/events/culture_2023_2.jpeg' },
                    { src: 'images/events/culture_2023_3.jpeg' },
                    { src: 'images/events/culture_2023_4.jpeg' },
                    { src: 'images/events/culture_2023_5.jpeg' },
                    { src: 'images/events/culture_2023_6.jpeg' }
                ],
                2024: [
                    { src: 'images/events/culture_2024_1.jpg' },
                    { src: 'images/events/culture_2024_2.jpg' },
                    { src: 'images/events/culture_2024_3.jpg' },
                    { src: 'images/events/culture_2024_4.jpg' }
                    
                ],
                2025: [
                    { src: 'images/events/culture_2025_1.jpg' },
                    { src: 'images/events/culture_2025_2.jpg' },
                    { src: 'images/events/culture_2025_3.jpg' },
                    { src: 'images/events/culture_2025_4.jpg' },
                    { src: 'images/events/culture_2025_5.jpg' },
                    { src: 'images/events/culture_2025_6.jpg' },
                    { src: 'images/events/culture_2025_7.jpeg' },
                    { src: 'images/events/culture_2025_8.jpeg' },
                    { src: 'images/events/culture_2025_9.jpeg' },
                    { src: 'images/events/culture_2025_10.jpeg' }
                ]
            },
            social: {
                2022: [
                    
                    { src: 'images/events/culture_2022_6.jpg' },
                    { src: 'images/events/culture_2022_7.jpg' },
                    { src: 'images/events/culture_2022_8.jpg' },
                    { src: 'images/events/culture_2022_9.jpg' },
                    { src: 'images/events/culture_2022_10.jpg' }
                ],
                2023: [
                    { src: 'images/events/social_2023_1.jpeg' },
                    { src: 'images/events/social_2023_2.jpeg' },
                    { src: 'images/events/social_2023_3.jpeg' },
                    { src: 'images/events/social_2023_4.jpeg' },
                    { src: 'images/events/social_2023_5.jpeg' },
                    { src: 'images/events/social_2023_6.jpeg' },
                    { src: 'images/events/social_2023_7.jpeg' },
                    { src: 'images/events/social_2023_8.jpeg' }
                ],
                2024: [
                    { src: 'images/events/social_2024_1.jpg' },
                    { src: 'images/events/social_2024_2.jpg' },
                    { src: 'images/events/social_2024_3.jpg' },
                    { src: 'images/events/social_2024_4.jpg' },
                    { src: 'images/events/social_2024_5.jpg' },
                    { src: 'images/events/social_2024_6.jpg' },
                    { src: 'images/events/social_2024_7.jpg' },
                    { src: 'images/events/social_2024_8.jpg' }
                    
                ],
                2025: [
                    { src: 'images/events/social_2025_1.jpg' },
                    { src: 'images/events/social_2025_2.jpg' },
                    { src: 'images/events/social_2025_3.jpg' },
                    { src: 'images/events/social_2025_4.jpg' },
                    { src: 'images/events/social_2025_5.jpg' },
                    { src: 'images/events/social_2025_6.jpg' },
                    { src: 'images/events/social_2025_7.jpg' },
                    { src: 'images/events/social_2025_8.jpg' },
                    { src: 'images/events/social_2025_9.jpeg' },
                    { src: 'images/events/social_2025_10.jpeg' },
                    { src: 'images/events/social_2025_11.jpeg' },
                    { src: 'images/events/social_2025_12.jpeg' },
                    { src: 'images/events/social_2025_13.jpeg' },
                    { src: 'images/events/social_2025_14.jpeg' },
                    { src: 'images/events/social_2025_15.jpeg' },
                    { src: 'images/events/social_2025_16.jpeg' },
                    { src: 'images/events/social_2025_17.jpeg' },
                    { src: 'images/events/social_2025_18.jpeg' },
                    { src: 'images/events/social_2025_19.jpeg' },
                    { src: 'images/events/social_2025_20.jpeg' },
                    { src: 'images/events/social_2025_21.jpeg' },
                    { src: 'images/events/social_2025_22.jpeg' },
                    { src: 'images/events/social_2025_23.jpeg' }
                ]
            },
            education: {
                2022: [
                    { src: 'images/events/education_2022_1.jpg' },
                    { src: 'images/events/education_2022_2.jpg' },
                    { src: 'images/events/education_2022_3.jpg' },
                    { src: 'images/events/education_2022_4.jpg' },
                    { src: 'images/events/education_2022_5.jpg' },
                    { src: 'images/events/education_2022_6.jpg' }
                ],
                2023: [
                    { src: 'images/events/education_2023_1.jpeg' },
                    { src: 'images/events/education_2023_2.jpeg' },
                    { src: 'images/events/education_2023_3.jpeg' },
                    { src: 'images/events/education_2023_4.jpeg' },
                    { src: 'images/events/education_2023_5.jpeg' }
                ],
                2024: [
                    { src: 'images/events/education_2024_1.jpg' },
                    { src: 'images/events/education_2024_2.jpg' }
                  
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    { src: 'images/events/edukation_2025_1.jpg' },
                    { src: 'images/events/edukation_2025_2.jpg' },
                    { src: 'images/events/edukation_2025_3.jpg' },
                    { src: 'images/events/edukation_2025_4.jpg' },
                    { src: 'images/events/edukation_2025_5.jpg' },
                    { src: 'images/events/edukation_2025_6.jpeg' },
                    { src: 'images/events/edukation_2025_7.jpeg' },
                    { src: 'images/events/edukation_2025_8.jpeg' },
                    { src: 'images/events/edukation_2025_9.jpeg' },
                    { src: 'images/events/education_2025_10.jpeg' }
                ]
            },
            humanitarian: {
                2022: [
                    { src: 'images/events/humanitarian_2022_1.jpg' },
                    { src: 'images/events/humanitarian_2022_2.jpg' },   
                    { src: 'images/events/humanitarian_2022_3.jpg' },  
                    { src: 'images/events/humanitarian_2022_4.jpg' },    
                    { src: 'images/events/humanitarian_2022_5.jpg' },   
                    { src: 'images/events/humanitarian_2022_6.jpg' },    
                    { src: 'images/events/humanitarian_2022_7.jpg' },   
                    { src: 'images/events/humanitarian_2022_8.jpg' },    
                    { src: 'images/events/humanitarian_2022_9.jpg' },    
                    { src: 'images/events/humanitarian_2022_10.jpg' }   
                      
                ],
                2023: [
                    { src: 'images/events/humanitarian_2023_1.jpeg' },
                    { src: 'images/events/humanitarian_2023_2.jpeg' },
                    { src: 'images/events/humanitarian_2023_3.jpeg' }
                    
                ],
                2024: [
                    { src: 'images/events/humanitarian_2024_1.jpeg' }
                ],
                2025: [
                    { src: 'images/events/humanitarian_2025_1.jpg' },
                    { src: 'images/events/humanitarian_2025_2.jpg' },
                    { src: 'images/events/humanitarian_2025_3.jpg' },
                    { src: 'images/events/humanitarian_2025_4.jpeg' }
                ]
            },
            psychology: {
                2022: [
                    { src: 'images/events/psychology_2022_1.jpg' }
                ],
                2023: [
                    { src: 'images/events/psychology_2023_1.jpeg' },
                    { src: 'images/events/psychology_2023_2.jpeg' },
                    { src: 'images/events/psychology_2023_3.jpeg' },
                    { src: 'images/events/psychology_2023_4.jpeg' },
                    { src: 'images/events/psychology_2023_5.jpeg' },
                    { src: 'images/events/psychology_2023_6.jpeg' }
                ],
                2024: [
                    { src: 'images/events/psychology_2024_1.jpg' },
                    { src: 'images/events/psychology_2024_2.jpg' },
                    { src: 'images/events/psychology_2024_3.jpg' },
                    { src: 'images/events/psychology_2024_4.jpg' },
                    { src: 'images/events/psychology_2024_5.jpg' },
                    { src: 'images/events/psychology_2024_6.jpg' },
                    { src: 'images/events/psychology_2024_7.jpg' }
                 
                    
                ],
                2025: [
                    { src: 'images/events/psychologiy_2025_1.jpg.jpeg' }
                ]
            },
            civic: {
                2022: [
                    { src: 'images/events/civic_2022_1.jpg' },
                    { src: 'images/events/civic_2022_2.jpg' },
                    { src: 'images/events/civic_2022_3.jpg' },
                    { src: 'images/events/civic_2022_4.jpg' },
                    { src: 'images/events/civic_2022_5.jpg' },
                    { src: 'images/events/civic_2022_6.jpg' },
                    { src: 'images/events/civic_2022_7.jpg' }
                ],
                2023: [
                    { src: 'images/events/civic_2023_1.jpeg' },
                    { src: 'images/events/civic_2023_2.jpeg' },
                    { src: 'images/events/civic_2023_3.jpeg' },
                    { src: 'images/events/civic_2023_4.jpeg' },
                    { src: 'images/events/civic_2023_5.jpeg' },
                    { src: 'images/events/civic_2023_6.jpeg' }
                ],
                2024: [
                    { src: 'images/events/civic_2024_1.jpg' },
                    { src: 'images/events/civic_2024_2.jpg' },
                    { src: 'images/events/civic_2024_3.jpg' },
                    { src: 'images/events/civic_2024_4.jpg' },
                    { src: 'images/events/civic_2024_5.jpg' }
                   
                ],
                2025: [
                    { src: 'images/events/civic_2025_1.jpg' },
                    { src: 'images/events/civic_2025_2.jpg' },
                    { src: 'images/events/civic_2025_3.jpeg' },
                    { src: 'images/events/civic_2025_4.jpeg' },
                    { src: 'images/events/civic_2025_5.jpeg' },
                    { src: 'images/events/civic_2025_6.jpeg' }
                ]
            }
        };
    }

    openGallery(category) {
        this.currentCategory = category;
        this.currentYear = 'all';
        
        // Установка заголовка и описания с использованием переводов
        this.updateGalleryTexts(category);

        // Сброс активной кнопки года
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'rgba(255,255,255,0.2)';
        });
        document.querySelector('[data-year="all"]').classList.add('active');
        document.querySelector('[data-year="all"]').style.background = '#ffc400';

        // Отображение фотографий
        this.displayPhotos(category, 'all');

        // Показ модального окна
        document.getElementById('gallery-modal').style.display = 'flex';
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
        this.currentYear = 'all';
    }

    // Метод для обновления текстов галереи при смене языка
    updateGalleryLanguage() {
        if (this.currentCategory) {
            this.updateGalleryTexts(this.currentCategory);
        }
    }

    filterByYear(year) {
        this.currentYear = year;

        // Обновление активной кнопки
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'rgba(255,255,255,0.2)';
        });
        event.target.classList.add('active');
        event.target.style.background = '#ffc400';

        // Отображение отфильтрованных фотографий
        this.displayPhotos(this.currentCategory, year);
    }

    displayPhotos(category, year) {
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = '';

        let photosToShow = [];

        if (year === 'all') {
            // Показать все фотографии для категории
            Object.values(this.photos[category]).forEach(yearPhotos => {
                photosToShow = photosToShow.concat(yearPhotos);
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
                        Щоб додати фотографії, відредагуйте файл js/gallery.js
                    </p>
                </div>
            `;
            return;
        }

        photosToShow.forEach((photo, index) => {
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
                <div style="height: 250px; background: linear-gradient(135deg, #ffc400 0%, #ff8c00 100%); display: flex; align-items: center; justify-content: center; position: relative;">
                    <img src="${photo.src}" alt="Фото" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; user-select: none; -webkit-user-drag: none;">
                </div>
            `;

            photoElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Прибрано відображення плашки з шляхом до фото
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