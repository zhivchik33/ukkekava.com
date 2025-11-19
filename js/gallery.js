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
        document.querySelectorAll('.gallery-category').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.openGallery(category);
            });
        });

        // Обработчики для кнопок фильтрации по годам
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByYear(e.target.dataset.year);
            });
        });

        // Закрытие модального окна
        document.querySelector('.gallery-close').addEventListener('click', () => {
            this.closeGallery();
        });

        // Закрытие по клику вне модального окна
        document.getElementById('gallery-modal').addEventListener('click', (e) => {
            if (e.target.id === 'gallery-modal') {
                this.closeGallery();
            }
        });
    }

    loadPhotos() {
        // ПРОСТАЯ СТРУКТУРА ДЛЯ ДОБАВЛЕНИЯ ФОТОГРАФИЙ
        // Для добавления фотографий:
        // 1. Поместите фотографии в папку images/events/
        // 2. Добавьте информацию о фотографиях в этот объект
        this.photos = {
            culture: {
                2022: [
                    { src: 'images/events/culture_2022_1.jpg' },
                    { src: 'images/events/culture_2022_2.jpg' },
                    { src: 'images/events/culture_2022_3.jpg' },
                    { src: 'images/events/culture_2022_4.jpg' },
                    { src: 'images/events/culture_2022_5.jpg' },
                    { src: 'images/events/culture_2022_6.jpg' },
                    { src: 'images/events/culture_2022_7.jpg' },
                    { src: 'images/events/culture_2022_8.jpg' },
                    { src: 'images/events/culture_2022_9.jpg' },
                    { src: 'images/events/culture_2022_10.jpg' }
                ],
                2023: [
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
                ]
            },
            social: {
                2022: [
                    { src: 'images/events/social_2022_1.jpg' },
                    { src: 'images/events/social_2022_2.jpg' },
                    { src: 'images/events/social_2022_3.jpg' }
                ],
                2023: [
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
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
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
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
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
                ]
            },
            psychology: {
                2022: [
                    { src: 'images/events/psychology_2022_1.jpg' }
                ],
                2023: [
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
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
                    // Добавьте фотографии 2023 года
                ],
                2024: [
                    // Добавьте фотографии 2024 года
                ],
                2025: [
                    // Добавьте фотографии 2025 года
                ]
            }
        };
    }

    openGallery(category) {
        this.currentCategory = category;
        this.currentYear = 'all';
        
        // Установка заголовка и описания
        const categoryNames = {
            culture: 'Збереження української культури та ідентичності',
            social: 'Соціальна підтримка та інтеграція українців',
            education: 'Освітній розвиток',
            humanitarian: 'Гуманітарна місія',
            psychology: 'Психологічна підтримка',
            civic: 'Громадянська активність і партнерство'
        };

        const categoryDescriptions = {
            culture: 'Популяризація українських традицій, мови, мистецтва та історичної спадщини',
            social: 'Сприяння адаптації в новому середовищі та побудова доброзичливих міжнаціональних стосунків',
            education: 'Організація неформальної освіти для дітей і дорослих, мовних курсів та творчих проєктів',
            humanitarian: 'Допомога вразливим категоріям населення та підтримка українських родин',
            psychology: 'Створення безпечного простору для відновлення та емоційної стабілізації',
            civic: 'Розвиток громадянської свідомості та співпраця з місцевими організаціями'
        };

        document.getElementById('gallery-title').textContent = categoryNames[category];
        document.getElementById('gallery-description').textContent = categoryDescriptions[category];

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

    closeGallery() {
        document.getElementById('gallery-modal').style.display = 'none';
        this.currentCategory = null;
        this.currentYear = 'all';
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
                    <img src="${photo.src}" alt="Фото" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;

            photoElement.addEventListener('click', () => {
                this.openPhotoViewer(photosToShow, index);
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
        // Здесь можно добавить полноэкранный просмотр фотографий
        const photo = photos[currentIndex];
        alert(`Просмотр фотографии\n\nПуть: ${photo.src}`);
    }
}

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new PhotoGallery();
});

// Добавление hover эффектов для карточек категорий
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-category').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        });
    });
}); 