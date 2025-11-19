document.addEventListener('DOMContentLoaded', function() {
  // --- LANGUAGE SWITCHER ---
  const langBtns = document.querySelectorAll('.lang-btn');
  // Загружаем сохраненный язык из localStorage или используем 'ua' по умолчанию
  let currentLang = localStorage.getItem('selectedLanguage') || 'ua';
  window.currentLang = currentLang;
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      window.currentLang = currentLang;
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem('selectedLanguage', currentLang);
      setLanguage(currentLang);
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  // --- LANGUAGE DROPDOWN ---
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const langMenu = document.getElementById('langMenu');
  const langOptions = document.querySelectorAll('.lang-option');
  
  // Функция для обновления текста кнопки языка
  function updateLangButton(lang) {
    setTimeout(function() {
      const btn = document.getElementById('langDropdownBtn');
      if (btn) {
        const langMap = {
          'ua': 'UA',
          'lv': 'LV',
          'en': 'EN'
        };
        const langText = langMap[lang] || 'UA';
        btn.innerHTML = langText + ' <span class="arrow">▼</span>';
        console.log('Updated lang button to:', langText, 'for lang:', lang);
      } else {
        console.log('langDropdownBtn not found!');
      }
    }, 10);
  }
  
  if (langDropdownBtn && langMenu) {
    // Обработчик для кнопки переключения языка
    langDropdownBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      const isOpen = langMenu.classList.contains('show');
      if (isOpen) {
        langMenu.classList.remove('show');
      } else {
        langMenu.classList.add('show');
      }
    });
    
    // Обработчики для опций языка
    langOptions.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang) {
          currentLang = selectedLang;
          window.currentLang = currentLang;
          
          // Сохраняем выбранный язык в localStorage
          localStorage.setItem('selectedLanguage', selectedLang);
          
          // Обновляем кнопку сразу
          const langMap = {
            'ua': 'UA',
            'lv': 'LV',
            'en': 'EN'
          };
          const langText = langMap[selectedLang] || 'UA';
          langDropdownBtn.innerHTML = langText + ' <span class="arrow">▼</span>';
          
          setLanguage(currentLang);
          langMenu.classList.remove('show');
        }
      });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
      if (langMenu && langDropdownBtn) {
        const clickedElement = e.target;
        const isClickInsideMenu = langMenu.contains(clickedElement);
        const isClickOnButton = langDropdownBtn.contains(clickedElement) || clickedElement === langDropdownBtn;
        
        if (!isClickInsideMenu && !isClickOnButton) {
          langMenu.classList.remove('show');
        }
      }
    });
  }
  function setLanguage(lang) {
    if (!window.translations) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (window.translations[lang] && window.translations[lang][key]) {
        el.textContent = window.translations[lang][key];
      }
    });

    // placeholders and inputs in contact form
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');
    const formTitle = document.querySelector('#contactForm .title');
    const formSubmit = document.querySelector('#contactForm button[type="submit"]');
    if (formTitle && window.translations[lang].contact_us) formTitle.textContent = window.translations[lang].contact_us;
    if (nameInput && window.translations[lang].donor_name) nameInput.placeholder = window.translations[lang].donor_name;
    if (emailInput && window.translations[lang].donor_email) emailInput.placeholder = window.translations[lang].donor_email;
    if (messageInput && window.translations[lang].comment) messageInput.placeholder = window.translations[lang].comment;
    if (formSubmit && window.translations[lang].send_message) formSubmit.textContent = window.translations[lang].send_message;

    // donate modal labels
    const donateTitle = document.querySelector('#donate-modal h2');
    const donateName = document.getElementById('donateName');
    const donateAmount = document.getElementById('donateAmount');
    const donateComment = document.getElementById('donateComment');
    const donateSubmitBtn = document.querySelector('#donateForm button[type="submit"]');
    if (donateTitle && window.translations[lang].donate_title) donateTitle.textContent = window.translations[lang].donate_title;
    if (donateName && window.translations[lang].donor_name) donateName.placeholder = window.translations[lang].donor_name;
    if (donateAmount && window.translations[lang].donate_amount) donateAmount.placeholder = window.translations[lang].donate_amount;
    if (donateComment) donateComment.placeholder = '';
    if (donateSubmitBtn && window.translations[lang].donate_submit) donateSubmitBtn.textContent = window.translations[lang].donate_submit;

    // calendar weekdays
    const weekdays = (window.translations[lang] && window.translations[lang].weekdays_short) || [];
    if (weekdays.length === 7) {
      document.querySelectorAll('#calendarWeekdays .weekday').forEach((el, idx) => {
        const index = parseInt(el.getAttribute('data-weekday-index'), 10);
        if (!isNaN(index)) {
          el.textContent = weekdays[index];
        } else if (idx < 7) {
          el.textContent = weekdays[idx];
        }
      });
    }

    // force calendar re-render month title
    if (window.calendar && typeof window.calendar.renderCalendar === 'function') {
      window.calendar.renderCalendar();
    }

    // Обновляем модальное окно событий, если оно открыто
    const eventModal = document.getElementById('eventModal');
    if (eventModal && eventModal.style.display !== 'none' && window.calendar && window.calendar.selectedDate) {
      // Повторно открываем модальное окно с обновленными переводами
      window.calendar.openEventModal(window.calendar.selectedDate);
    }
    
    // Обновляем кнопку языка
    updateLangButton(lang);
  }
  // Устанавливаем язык при загрузке страницы (из localStorage или 'ua' по умолчанию)
  setLanguage(currentLang);
  window.currentLang = currentLang;
  updateLangButton(currentLang);
  feather.replace();
  // --- МОДАЛЬНОЕ ОКНО ---
  const openContactModalBtn = document.getElementById('openContactModal');
  const contactModal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');
  if (openContactModalBtn && contactModal && modalClose) {
    openContactModalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      contactModal.style.display = 'block';
      if (window.feather) feather.replace();
    });
    modalClose.addEventListener('click', function() {
      contactModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  // Formspree AJAX отправка
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      formStatus.textContent = '';
      const data = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formStatus.textContent = (window.translations[currentLang] && window.translations[currentLang].form_success) || 'Sent successfully';
          formStatus.style.color = 'green';
          contactForm.reset();
        } else {
          formStatus.textContent = (window.translations[currentLang] && window.translations[currentLang].form_error) || 'Error sending. Try later.';
          formStatus.style.color = 'red';
        }
      } catch (err) {
        formStatus.textContent = (window.translations[currentLang] && window.translations[currentLang].network_error) || 'Network error. Try later.';
        formStatus.style.color = 'red';
      }
    });
  }
});

// Функциональность для секции "Заходи"
document.addEventListener('DOMContentLoaded', function() {
  // Данные галереи для каждой категории
  const galleryData = {
    creativity: {
      title: 'Творчість',
      description: 'Мастер-класи, творчі гуртки та культурні заходи для дітей та дорослих',
      images: [
        { src: 'images/creativity-1.jpg', title: 'Мастер-клас з писанкарства', description: 'Діти створюють традиційні українські писанки' },
        { src: 'images/creativity-2.jpg', title: 'Художній гурток', description: 'Розвиваємо творчі здібності дітей' },
        { src: 'images/creativity-3.jpg', title: 'Театральна студія', description: 'Підготовка до вистави українською мовою' },
        { src: 'images/creativity-4.jpg', title: 'Музичний гурток', description: 'Вивчення українських народних пісень' },
        { src: 'images/creativity-5.jpg', title: 'Танцювальний ансамбль', description: 'Традиційні українські танці' },
        { src: 'images/creativity-6.jpg', title: 'Рукоділля', description: 'Виготовлення традиційних виробів' }
      ]
    },
    support: {
      title: 'Психологічна підтримка',
      description: 'Групи підтримки, консультації та психологічна допомога для української спільноти',
      images: [
        { src: 'images/support-1.jpg', title: 'Група підтримки', description: 'Спільні зустрічі української спільноти' },
        { src: 'images/support-2.jpg', title: 'Психологічні консультації', description: 'Індивідуальна робота з психологом' },
        { src: 'images/support-3.jpg', title: 'Сімейні заходи', description: 'Підтримка українських сімей' },
        { src: 'images/support-4.jpg', title: 'Дитячі групи', description: 'Психологічна підтримка дітей' },
        { src: 'images/support-5.jpg', title: 'Тренинги', description: 'Розвиток емоційного інтелекту' },
        { src: 'images/support-6.jpg', title: 'Арт-терапія', description: 'Творчі методи психологічної підтримки' }
      ]
    },
    education: {
      title: 'Освіта',
      description: 'Мовні курси, освітні програми та навчальні заходи для всіх вікових груп',
      images: [
        { src: 'images/education-1.jpg', title: 'Українська мова', description: 'Заняття з української мови для всіх рівнів' },
        { src: 'images/education-2.jpg', title: 'Історія України', description: 'Вивчення історії та культури України' },
        { src: 'images/education-3.jpg', title: 'Література', description: 'Читання української літератури' },
        { src: 'images/education-4.jpg', title: 'Комп\'ютерні курси', description: 'Навчання роботи з комп\'ютером' },
        { src: 'images/education-5.jpg', title: 'Англійська мова', description: 'Курси англійської мови' },
        { src: 'images/education-6.jpg', title: 'Підготовка до школи', description: 'Підготовка дітей до навчання' }
      ]
    },
    events: {
      title: 'Заходи',
      description: 'Свята, фестивалі, паради та інші громадські заходи української спільноти',
      images: [
        { src: 'images/events-1.jpg', title: 'День Незалежності', description: 'Святкування Дня Незалежності України' },
        { src: 'images/events-2.jpg', title: 'Різдвяні святкування', description: 'Традиційні різдвяні заходи' },
        { src: 'images/events-3.jpg', title: 'Великдень', description: 'Святкування Великодня' },
        { src: 'images/events-4.jpg', title: 'День Матері', description: 'Святкування Дня Матері' },
        { src: 'images/events-5.jpg', title: 'Фестиваль культури', description: 'Фестиваль української культури' },
        { src: 'images/events-6.jpg', title: 'Спортивні змагання', description: 'Українські народні ігри та спортивні заходи' }
      ]
    }
  };

  // Обработчики для категорий событий
  const eventCategories = document.querySelectorAll('.event-category');
  eventCategories.forEach(category => {
    category.addEventListener('click', function() {
      const categoryType = this.getAttribute('data-category');
      const categoryData = galleryData[categoryType];
      
      if (categoryData) {
        showGallery(categoryData);
      }
    });
  });

  // Обработчик для кнопки "Зв'язатися з нами" в секции заходов
  const contactEventsBtn = document.querySelector('.contact-events-btn');
  if (contactEventsBtn) {
    contactEventsBtn.addEventListener('click', function() {
      // Открываем модальное окно контактов
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) {
        contactModal.style.display = 'block';
      }
    });
  }

  // Анимация появления карточек категорий
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  eventCategories.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});

// Функция для показа галереи
function showGallery(categoryData) {
  const galleryModal = document.getElementById('gallery-modal');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryDescription = document.getElementById('gallery-description');
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryClose = document.querySelector('.gallery-close');

  // Заполняем заголовок и описание
  galleryTitle.textContent = categoryData.title;
  galleryDescription.textContent = categoryData.description;

  // Очищаем и заполняем галерею
  galleryGrid.innerHTML = '';
  
  categoryData.images.forEach(image => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="${image.src}" alt="${image.title}" onerror="this.src='images/placeholder.jpg'">
      <div class="gallery-item-caption">
        <h4>${image.title}</h4>
        <p>${image.description}</p>
      </div>
    `;
    galleryGrid.appendChild(galleryItem);
  });

  // Показываем модальное окно
  galleryModal.style.display = 'block';

  // Обработчик закрытия
  galleryClose.addEventListener('click', () => {
    galleryModal.style.display = 'none';
  });

  // Закрытие по клику вне галереи
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      galleryModal.style.display = 'none';
    }
  });

  // Навигация по галерее (опционально)
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  
  if (prevBtn && nextBtn) {
    let currentIndex = 0;
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + categoryData.images.length) % categoryData.images.length;
      updateGalleryView();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % categoryData.images.length;
      updateGalleryView();
    });
    
    function updateGalleryView() {
      // Здесь можно добавить логику для показа одной фотографии
      // Пока оставляем как есть - показываем все фотографии в сетке
    }
  }
} 