document.addEventListener('DOMContentLoaded', () => {
    
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
                    if(topNav) topNav.classList.add('hidden');
                    if(headerProfile) headerProfile.classList.add('hidden');
                    if(siteType) siteType.classList.remove('hidden');
                } else {
                    if(topNav) topNav.classList.remove('hidden');
                    if(headerProfile) headerProfile.classList.remove('hidden');
                    if(siteType) siteType.classList.add('hidden');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Timeline Interaction Logic ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const cols = document.querySelectorAll('.detail-col p'); // 0: Methodologies, 1: Skills, 2: Software
    const stepTitleOuter = document.querySelector('.active-step-title');

    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            timelineItems.forEach(t => t.classList.remove('active'));
            // Add active
            item.classList.add('active');

            // Get data step
            const stepKey = item.getAttribute('data-step');
            
            // Set dynamic keys based on step so applyTranslations hits them automatically later
            cols[0].setAttribute('data-i18n', `tl_${stepKey}_methods`);
            cols[1].setAttribute('data-i18n', `tl_${stepKey}_skills`);
            cols[2].setAttribute('data-i18n', `tl_${stepKey}_soft`);
            let titleKey = `step_${stepKey.replace('-', '')}`;
            if (stepKey === 'test-design') titleKey = 'step_test';
            if (stepKey === 'dev-handover') titleKey = 'step_dev';
            stepTitleOuter.setAttribute('data-i18n', titleKey);

            // Re-apply immediately for the new active item
            const currentLang = document.getElementById('currentLang').textContent;
            if (window.translations && window.translations[currentLang]) {
                const strings = window.translations[currentLang];
                cols[0].innerHTML = strings[`tl_${stepKey}_methods`] || '';
                cols[1].innerHTML = strings[`tl_${stepKey}_skills`] || '';
                cols[2].innerHTML = strings[`tl_${stepKey}_soft`] || '';
                stepTitleOuter.innerHTML = strings[titleKey] || '';
            }
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

    function applyTranslations(lang) {
        if (!window.translations || !window.translations[lang]) return;
        const strings = window.translations[lang];
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (strings[key]) {
                el.innerHTML = strings[key];
            }
        });
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

});
