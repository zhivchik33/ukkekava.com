// Календарь событий для просмотра с возможностью добавления в системный календарь
class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = {};
        this.init();
    }

    async init() {
        this.events = await this.loadEvents();
        this.renderCalendar();
        this.bindEvents();
        this.addHoverEffects();
    }

    bindEvents() {
        // Навигация по месяцам
        const prevMonthBtn = document.getElementById('prevMonth');
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }

        const nextMonthBtn = document.getElementById('nextMonth');
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }

        // Модальное окно событий
        const eventModalClose = document.getElementById('eventModalClose');
        if (eventModalClose) {
            eventModalClose.addEventListener('click', () => {
                this.closeEventModal();
            });
        }

        // Закрытие модального окна по клику вне его
        const eventModal = document.getElementById('eventModal');
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target.id === 'eventModal') {
                    this.closeEventModal();
                }
            });
        }
        
        // Обновление стилей модального окна при изменении размера окна
        window.addEventListener('resize', () => {
            if (this.selectedDate && eventModal && eventModal.style.display !== 'none') {
                this.openEventModal(this.selectedDate);
            }
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Проверяем наличие элементов календаря на странице
        const currentMonthEl = document.getElementById('currentMonth');
        const calendarGrid = document.getElementById('calendarGrid');
        
        if (!currentMonthEl || !calendarGrid) {
            // Календарь не найден на этой странице, выходим
            return;
        }
        
        // Обновляем заголовок месяца по текущему языку
        const lang = (window.currentLang || 'ua');
        const monthNames = (window.translations && window.translations[lang] && window.translations[lang].months) || ['January','February','March','April','May','June','July','August','September','October','November','December'];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;

        // Получаем первый день месяца и количество дней
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        
        // Начинаем с понедельника (0 = воскресенье, 1 = понедельник)
        const dayOfWeek = firstDay.getDay();
        const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - startOffset);

        calendarGrid.innerHTML = '';

        // Генерируем дни календаря
        for (let i = 0; i < 42; i++) { // 6 недель * 7 дней
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayElement = this.createDayElement(currentDate, year, month);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(date, currentYear, currentMonth) {
        const dayElement = document.createElement('div');
        const dayNumber = date.getDate();
        const isCurrentMonth = date.getMonth() === currentMonth;
        const isToday = this.isToday(date);
        const hasEvents = this.hasEvents(date);

        dayElement.className = 'calendar-day';
        dayElement.style.cssText = `
            aspect-ratio: 1;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            background: ${isToday ? '#ffc400' : isCurrentMonth ? 'white' : '#f8f9fa'};
            color: ${isToday ? 'white' : isCurrentMonth ? '#2c3e50' : '#6c757d'};
            font-weight: ${isToday ? 'bold' : 'normal'};
        `;

        dayElement.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">${dayNumber}</div>
            ${hasEvents ? '<div style="font-size: 0.8rem; color: #ff6b6b;">📅</div>' : ''}
        `;

        // Добавляем события только для дней текущего месяца
        if (isCurrentMonth) {
            dayElement.addEventListener('click', () => {
                this.openEventModal(date);
            });
        }

        return dayElement;
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    hasEvents(date) {
        const dateString = this.formatDate(date);
        return this.events[dateString] && this.events[dateString].length > 0;
    }

    openEventModal(date) {
        this.selectedDate = date;
        const dateString = this.formatDate(date);
        const existingEvents = this.events[dateString] || [];

        if (existingEvents.length === 0) {
            const lang = (window.currentLang || 'ua');
            const msg = (window.translations && window.translations[lang] && window.translations[lang].no_events) || 'No events scheduled for this date';
            this.showNotification(msg);
            return;
        }

        // Показываем первое событие (можно расширить для показа всех событий)
        const event = existingEvents[0];
        const lang = (window.currentLang || 'ua');
        
        // Получаем переводы заголовка и описания
        const title = event[`title_${lang}`] || event.title_ua || event.title || '';
        const description = event[`description_${lang}`] || event.description_ua || event.description || '';
        
        document.getElementById('eventModalTitle').textContent = title;
        document.getElementById('eventDate').textContent = this.formatDateForDisplay(date);
        document.getElementById('eventTime').textContent = event.time;
        const locTbd = (window.translations && window.translations[lang] && window.translations[lang].location_tbd) || 'Location to be confirmed';
        document.getElementById('eventLocation').textContent = event.location || locTbd;
        document.getElementById('eventDescription').textContent = description;

        // Сохраняем текущее событие для добавления в календарь
        this.currentEvent = event;

        const modal = document.getElementById('eventModal');
        const modalContent = modal.querySelector('.modal-content');
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        // Устанавливаем правильные стили для центрирования
        modal.style.display = 'flex';
        if (isMobile) {
            modal.style.alignItems = 'flex-start';
            modal.style.justifyContent = 'center';
            modal.style.padding = isSmallMobile ? '5px' : '10px 5px';
            modal.style.overflowY = 'auto';
        } else {
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        }
        
        // Убираем абсолютное позиционирование из modal-content
        modalContent.style.position = 'relative';
        modalContent.style.top = 'auto';
        modalContent.style.left = 'auto';
        modalContent.style.transform = 'none';
        
        // Оптимизация для мобильных устройств - квадратная форма
        if (isSmallMobile) {
            modal.style.padding = '8px';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            const viewportWidth = window.innerWidth;
            modalContent.style.maxWidth = '92vw';
            modalContent.style.width = '92vw';
            modalContent.style.minHeight = '92vw';
            modalContent.style.aspectRatio = '1';
            modalContent.style.padding = '18px 15px';
            modalContent.style.maxHeight = '92vh';
            modalContent.style.margin = '0 auto';
            modalContent.style.display = 'flex';
            modalContent.style.flexDirection = 'column';
        } else if (isMobile) {
            modal.style.padding = '10px';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            const viewportWidth = window.innerWidth;
            modalContent.style.maxWidth = '90vw';
            modalContent.style.width = '90vw';
            modalContent.style.minHeight = '90vw';
            modalContent.style.aspectRatio = '1';
            modalContent.style.padding = '20px 18px';
            modalContent.style.maxHeight = '90vh';
            modalContent.style.margin = '0 auto';
            modalContent.style.display = 'flex';
            modalContent.style.flexDirection = 'column';
        } else {
            modalContent.style.margin = '0';
            modalContent.style.aspectRatio = 'auto';
            modalContent.style.minHeight = 'auto';
        }
    }

    closeEventModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.selectedDate = null;
        this.currentEvent = null;
    }

    createGoogleCalendarLink() {
        if (!this.currentEvent || !this.selectedDate) {
            const lang = (window.currentLang || 'ua');
            const msg = (window.translations && window.translations[lang] && window.translations[lang].error_no_event) || 'Error: no event selected';
            this.showNotification(msg);
            return;
        }

        const startDate = new Date(this.selectedDate);
        const [hours, minutes] = this.currentEvent.time.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        // Форматируем даты для Google Calendar
        const formatDateForGoogle = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const startDateFormatted = formatDateForGoogle(startDate);
        const endDateFormatted = formatDateForGoogle(endDate);

        // Создаем URL для Google Calendar с настройками напоминаний
        const lang = (window.currentLang || 'ua');
        const locTbd = (window.translations && window.translations[lang] && window.translations[lang].location_tbd) || 'Location to be confirmed';
        const title = this.currentEvent[`title_${lang}`] || this.currentEvent.title_ua || this.currentEvent.title || '';
        const description = this.currentEvent[`description_${lang}`] || this.currentEvent.description_ua || this.currentEvent.description || '';
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(this.currentEvent.location || locTbd)}&sf=true&output=xml&add=true&popup=true&reminders=email,1440,60`;

        // Открываем Google Calendar в новом окне
        window.open(googleCalendarUrl, '_blank');
    }

    downloadICSFile() {
        if (!this.currentEvent || !this.selectedDate) {
            const lang = (window.currentLang || 'ua');
            const msg = (window.translations && window.translations[lang] && window.translations[lang].error_no_event) || 'Error: no event selected';
            this.showNotification(msg);
            return;
        }

        const icsContent = this.generateICSFile(this.currentEvent, this.selectedDate);
        
        // Создаем blob и скачиваем файл
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        const lang = (window.currentLang || 'ua');
        const msg = (window.translations && window.translations[lang] && window.translations[lang].ics_downloaded) || 'Calendar file downloaded!';
        this.showNotification(msg);
    }

    generateICSFile(event, date) {
        const startDate = new Date(date);
        const [hours, minutes] = event.time.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // Событие длится 2 часа по умолчанию

        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const lang = (window.currentLang || 'ua');
        const title = event[`title_${lang}`] || event.title_ua || event.title || '';
        const description = event[`description_${lang}`] || event.description_ua || event.description || '';
        const locTbd = (window.translations && window.translations[lang] && window.translations[lang].location_tbd) || 'Місце буде уточнено';
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ukrainian Community//Calendar Event//UK
BEGIN:VEVENT
UID:${Date.now()}@ukrainian-community.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${event.location || locTbd}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    }

    formatDate(date) {
            // Используем локальные компоненты даты, чтобы избежать проблем с часовыми поясами
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateForDisplay(date) {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        const locale = (window.currentLang === 'ua') ? 'uk-UA' : (window.currentLang === 'en') ? 'en-US' : 'lv-LV';
        return date.toLocaleDateString(locale, options);
    }

    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            const data = await response.json();
            return data.events || {};
        } catch (error) {
            console.error('Помилка завантаження подій:', error);
            // Fallback на встроенные события
            return {
                '2024-12-15': [{
                    title: 'Український культурний вечір',
                    time: '18:00',
                    location: 'Культурний центр Кекаві',
                    description: 'Вечір української культури з традиційними танцями, піснями та стравами. Всі охочі запрошуються!'
                }],
                '2024-12-20': [{
                    title: 'Зустріч української спільноти',
                    time: '19:00',
                    location: 'Міська рада Кекаві',
                    description: 'Щомісячна зустріч членів української громади для обговорення поточних питань та планування майбутніх заходів.'
                }]
            };
        }
    }

    addHoverEffects() {
        // Добавляем hover эффекты для кнопок навигации
        document.querySelectorAll('.calendar-nav-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 5px 15px rgba(255, 196, 0, 0.4)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });

        // Добавляем hover эффекты для кнопки добавления в календарь
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 1rem;
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Инициализация календаря при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем наличие элементов календаря на странице
    const calendarContainer = document.getElementById('calendarGrid');
    if (calendarContainer) {
        window.calendar = new EventCalendar();
    }
}); 