document.addEventListener('DOMContentLoaded', () => {

    // ── Software Logo Map (for pill rendering in design approach section) ──
    const softwareLogoMap = {
        'Notion':          'Softwarelogos/Notion.png',
        'FigJam':          'Softwarelogos/Figma.png',
        'Figma':           'Softwarelogos/Figma.png',
        'Figma Inspect':   'Softwarelogos/Figma.png',
        'Illustrator':     'Softwarelogos/Illustrator.png',
        'Photoshop':       'Softwarelogos/Photoshop.png',
        'Office 365':      'Softwarelogos/Microsoft365.png',
        'Microsoft 365':   'Softwarelogos/Microsoft365.png',
        'Google Stitch':   'Softwarelogos/Antigravity.png',
        'Netlify':         'Softwarelogos/Netlify.png',
        'GitHub':          'Softwarelogos/github.png',
        'Affinity':        'Softwarelogos/Afinity.png',
        'Afinity':         'Softwarelogos/Afinity.png',
        'Premiere Pro':    'Softwarelogos/PremierePro.png',
        'Visual Studio Code': 'Softwarelogos/VisualStudioCode.png',
        'Cursor':          'Softwarelogos/cursor.png',
        'Zeplin':          null,
        'Balsamiq':        null,
        'Miro':            null,
        'Whimsical':       null,
        'Evernote':        null,
        'MS Teams':        null,
        'Maze':            null,
        'Useberry':        null,
        'Google Forms':    null,
        'Principle':       null,
    };

    // Pill renderer helpers
    function renderSkillPills(str) {
        if (!str) return '';
        return str.split('|').map(s =>
            `<span class="pill skill-pill">${s.trim()}</span>`
        ).join('');
    }

    function renderSoftPills(str) {
        if (!str) return '';
        return str.split('|').map(name => {
            name = name.trim();
            const logo = softwareLogoMap[name];
            if (logo) {
                return `<span class="pill icon-pill no-proficiency"><span class="circle-icon"><img src="${logo}" class="software-logo"></span>${name}</span>`;
            }
            return `<span class="pill">${name}</span>`;
        }).join('');
    }

    // Track which timeline step is currently active
    let currentStep = 'empathy';

    function renderStepDetails(stepKey, lang) {
        const strings = (window.translations && window.translations[lang]) || window.translations['ENG'];
        const tSkills = document.getElementById('t_skills');
        const tSoft   = document.getElementById('t_software');
        if (tSkills) tSkills.innerHTML = renderSkillPills(strings[`tl_${stepKey}_skills`]);
        if (tSoft)   tSoft.innerHTML   = renderSoftPills(strings[`tl_${stepKey}_soft`]);
    }

    // ── Mobile Burger Menu ──────────────────────────────────
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (burgerBtn && mobileNavOverlay) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.toggle('open');
            burgerBtn.classList.toggle('open', isOpen);
            burgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
        });

        // Close overlay when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    mobileNavOverlay.classList.remove('open');
                    burgerBtn.classList.remove('open');
                    burgerBtn.setAttribute('aria-expanded', false);
                    document.body.classList.remove('menu-open');
                    setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth' }), 150);
                }
            });
        });

        // Language switcher inside mobile overlay
        document.querySelectorAll('.mob-lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                document.getElementById('currentLang').textContent = lang;
                applyTranslations(lang);
                mobileNavOverlay.classList.remove('open');
                burgerBtn.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Smooth Scrolling & Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Click to scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for highlighting current section in Navigation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const topNav = document.getElementById('topNav');
    const headerProfile = document.getElementById('headerProfile');
    const siteType = document.getElementById('siteType');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to current links
                const currentLinks = document.querySelectorAll(`.nav-link[data-target="${id}"]`);
                currentLinks.forEach(link => link.classList.add('active'));

                // Handle header visibility changes
                if (id === 'home') {
                    if (topNav) topNav.classList.add('hidden');
                    if (headerProfile) headerProfile.classList.add('hidden');
                    if (siteType) siteType.classList.remove('hidden');
                } else {
                    if (topNav) topNav.classList.remove('hidden');
                    if (headerProfile) headerProfile.classList.remove('hidden');
                    if (siteType) siteType.classList.add('hidden');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Reveal on Scroll Logic ---
    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Handle staggered items if present
                const staggers = entry.target.querySelectorAll('.stagger-item');
                staggers.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.1}s`;
                });
                
                // Once revealed, we can stop observing this specific element
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Timeline Interaction Logic ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const tMethods       = document.getElementById('t_methods');
    const stepTitleOuter = document.querySelector('.active-step-title');

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            timelineItems.forEach(t => t.classList.remove('active'));
            // Add active
            item.classList.add('active');

            // Add click pulse animation
            item.classList.remove('click-pulse');
            void item.offsetWidth; // trigger reflow
            item.classList.add('click-pulse');

            // Get data step
            const stepKey = item.getAttribute('data-step');
            currentStep = stepKey;

            // Update methodologies data-i18n key
            if (tMethods) tMethods.setAttribute('data-i18n', `tl_${stepKey}_methods`);

            // Build title key
            let titleKey = `step_${stepKey.replace('-', '')}`;
            if (stepKey === 'test-design') titleKey = 'step_test';
            if (stepKey === 'dev-handover') titleKey = 'step_dev';
            if (stepTitleOuter) stepTitleOuter.setAttribute('data-i18n', titleKey);

            // Re-apply immediately for the new active item
            const currentLang = document.getElementById('currentLang').textContent;
            if (window.translations && window.translations[currentLang]) {
                const strings = window.translations[currentLang];
                if (tMethods) tMethods.innerHTML = strings[`tl_${stepKey}_methods`] || '';
                if (stepTitleOuter) stepTitleOuter.innerHTML = strings[titleKey] || '';
            }

            // Render skill + soft pills for active step
            renderStepDetails(stepKey, currentLang);
        });
    });

    // --- Language Switcher Logic ---
    const langSelectorOptions = document.querySelectorAll('.lang-dropdown li');
    const currentLangDisplay = document.getElementById('currentLang');
    const langContainer = document.querySelector('.lang-switcher-container');
    const langDropdown = document.querySelector('.lang-dropdown');

    // Toggle dropdown on click
    langContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langContainer.contains(e.target)) {
            langDropdown.classList.remove('show');
        }
    });

    // --- Skills Radar Chart ---
    let skillsChart;
    const ctx = document.getElementById('skillsChart');

    function initChart(lang) {
        if (!ctx) return;
        const strings = window.translations[lang] || window.translations['ENG'];
        const isMobile = window.innerWidth <= 768;

        const labels = [
            strings['skill_label_ux'],
            strings['skill_label_ui'],
            strings['skill_label_graphic'],
            strings['skill_label_pm'],
            strings['skill_label_tm'],
            strings['skill_label_art'],
            strings['skill_label_prompt'],
            strings['skill_label_frontend']
        ].map(label => {
            // Split labels with two or more words on mobile
            if (isMobile && label.includes(' ')) {
                return label.split(' ');
            }
            return label;
        });

        const data = {
            labels: labels,
            datasets: [{
                label: 'Skill Level',
                data: [75, 80, 80, 50, 40, 60, 30, 40],
                fill: true,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderColor: '#000000',
                pointBackgroundColor: '#000000',
                pointBorderColor: '#000000',
                pointRadius: isMobile ? 2 : 3,
                borderWidth: 1.5
            }]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true, color: 'rgba(0,0,0,0.1)' },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { display: false },
                        pointLabels: {
                            font: { 
                                size: isMobile ? 9 : 11, // Slightly larger on desktop
                                family: 'Outfit', 
                                weight: '400' 
                            },
                            color: '#000000',
                            padding: isMobile ? 5 : 20
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        };

        if (skillsChart) skillsChart.destroy();
        skillsChart = new Chart(ctx, config);
    }

    // Initial load
    initChart('ENG');
    applyTranslations('ENG');
    renderStepDetails('empathy', 'ENG');

    function applyTranslations(lang) {
        if (!window.translations || !window.translations[lang]) return;
        const strings = window.translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (strings[key]) {
                el.innerHTML = strings[key];
            }
        });

        // Re-render skill + soft pills for current step
        renderStepDetails(currentStep, lang);

        // Re-init chart with new labels
        initChart(lang);
    }

    langSelectorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedLang = e.target.getAttribute('data-lang');
            currentLangDisplay.textContent = selectedLang;
            applyTranslations(selectedLang);
        });
    });

    // --- Audio Hover Effects ---
    const homeNavLinks = document.querySelectorAll('.home-nav .nav-link');
    const sounds = [
        new Audio('Chord/sound1.wav'),
        new Audio('Chord/sound2.wav'),
        new Audio('Chord/sound3.wav'),
        new Audio('Chord/sound4.wav')
    ];

    // Preload sounds for better response time
    sounds.forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.5; // subtle volume
    });

    homeNavLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            // Map link index (0 to 3) to corresponding sound
            const soundIndex = index % sounds.length;
            const audio = sounds[soundIndex];

            // Reset to beginning to allow rapid sequential playing
            audio.currentTime = 0;
            audio.play().catch(e => {
                // Ignore silent failure if user hasn't interacted with document yet
                console.log('Audio autoplay prevented silently');
            });
        });
    });

    // Profile Hover Sound
    const profileSound = new Audio('Chord/chord.wav');
    profileSound.preload = 'auto';
    profileSound.volume = 0.5;

    const profileLink = document.querySelector('.home-profile-link');
    if (profileLink) {
        profileLink.addEventListener('mouseenter', () => {
            profileSound.currentTime = 0;
            profileSound.play().catch(e => console.log('Profile audio play prevented'));
        });
    }

    // --- Projects Carousel Arrow Navigation ---
    const carouselWrapper = document.querySelector('.projects-carousel-wrapper');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (carouselWrapper && prevBtn && nextBtn) {
        // Scroll one card width at a time
        const getScrollAmount = () => {
            const firstCard = carouselWrapper.querySelector('.project-card-link');
            return firstCard ? firstCard.offsetWidth + 120 : 320; // card width + gap
        };

        const updateArrows = () => {
            const atStart = carouselWrapper.scrollLeft <= 0;
            const atEnd = carouselWrapper.scrollLeft + carouselWrapper.clientWidth >= carouselWrapper.scrollWidth - 2;
            prevBtn.style.opacity = atStart ? '0.3' : '1';
            prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
            nextBtn.style.opacity = atEnd ? '0.3' : '1';
            nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        };

        prevBtn.addEventListener('click', () => {
            carouselWrapper.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carouselWrapper.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        carouselWrapper.addEventListener('scroll', updateArrows, { passive: true });

        // Initial state
        updateArrows();
    }

    // --- Timeline Carousel Arrow Navigation ---
    const timelineWrapper = document.querySelector('.timeline-container');
    const tPrevBtn = document.getElementById('timelinePrev');
    const tNextBtn = document.getElementById('timelineNext');

    if (timelineWrapper && tPrevBtn && tNextBtn) {
        const getTScrollAmount = () => {
            const firstItem = timelineWrapper.querySelector('.timeline-item');
            return firstItem ? firstItem.offsetWidth + 20 : 120;
        };

        const updateTArrows = () => {
            const atStart = timelineWrapper.scrollLeft <= 2;
            const atEnd = timelineWrapper.scrollLeft + timelineWrapper.clientWidth >= timelineWrapper.scrollWidth - 2;
            tPrevBtn.style.opacity = atStart ? '0.3' : '1';
            tPrevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
            tNextBtn.style.opacity = atEnd ? '0.3' : '1';
            tNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
        };

        tPrevBtn.addEventListener('click', () => {
            timelineWrapper.scrollBy({ left: -getTScrollAmount(), behavior: 'smooth' });
        });

        tNextBtn.addEventListener('click', () => {
            timelineWrapper.scrollBy({ left: getTScrollAmount(), behavior: 'smooth' });
        });

        timelineWrapper.addEventListener('scroll', updateTArrows, { passive: true });
        updateTArrows();
    }

});
