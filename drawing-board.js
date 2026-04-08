(function() {
    // --- Configuration ---
    const BG_COLOR = '#f7f7f7';
    const FADE_SPEED = 0.05; // Fades out over a few seconds
    const BRUSH_COLOR = '#111111';
    const BRUSH_SIZE = 4;

    // --- State ---
    let isActive = false;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // --- Styles Injection ---
    const style = document.createElement('style');
    style.textContent = `
        .brush-toggle-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px;
            display: none; /* Desktop only via media query */
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease, opacity 0.2s ease;
            color: var(--text-main);
            opacity: 0.6;
        }
        .brush-toggle-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .brush-toggle-btn.active {
            opacity: 1;
            color: var(--accent-color, #111);
        }
        
        #magicCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 0; /* Above grid (-1) but below UI (content container has z-index or is higher in stack) */
            pointer-events: auto;
            visibility: hidden;
            background: transparent;
        }
        #magicCanvas.active {
            visibility: visible;
        }

        /* Visibility Constraints */
        @media (min-width: 1024px) {
            .brush-toggle-btn.home-only {
                display: flex;
            }
        }

        /* Architectural Safeguard: Ensure UI is above canvas */
        .content-container, .main-header, .mobile-nav-overlay {
            position: relative;
            z-index: 10;
        }
        
        /* Ensure specific interactive glass containers are above */
        .glass-container {
            z-index: 15;
        }
    `;
    document.head.appendChild(style);

    // --- Component Initialization ---
    function init() {
        const langContainer = document.querySelector('.lang-switcher-container');
        if (!langContainer) return;

        // Create Brush Button
        const brushBtn = document.createElement('button');
        brushBtn.className = 'brush-toggle-btn home-only';
        brushBtn.id = 'magicBrushBtn';
        brushBtn.setAttribute('title', 'Magic Drawing Board');
        brushBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l5 2"></path>
                <path d="M8 8l5 5"></path>
            </svg>
        `;
        langContainer.parentNode.insertBefore(brushBtn, langContainer);

        // Create Canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'magicCanvas';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d', { alpha: true });

        // Resize Canvas
        function resize() {
            const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.putImageData(temp, 0, 0);
        }
        window.addEventListener('resize', resize);
        resize();

        // --- Drawing Logic ---
        function getCoords(e) {
            return [e.clientX, e.clientY];
        }

        function startDrawing(e) {
            if (!isActive) return;
            isDrawing = true;
            [lastX, lastY] = getCoords(e);
        }

        function draw(e) {
            if (!isDrawing || !isActive) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            const [x, y] = getCoords(e);
            ctx.lineTo(x, y);
            ctx.strokeStyle = BRUSH_COLOR;
            ctx.lineWidth = BRUSH_SIZE;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            [lastX, lastY] = [x, y];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        // --- Fading Mechanism ---
        function fadeLoop() {
            if (isActive) {
                // This creates the trails effect. 
                // Note: It will eventually fill the dots behind it if solid,
                // but we follow the user requirement for this specific clearing method.
                ctx.fillStyle = `rgba(247, 247, 247, ${FADE_SPEED})`; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            requestAnimationFrame(fadeLoop);
        }
        fadeLoop();

        // --- Toggle Logic ---
        brushBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isActive = !isActive;
            brushBtn.classList.toggle('active', isActive);
            canvas.classList.toggle('active', isActive);
            
            if (isActive) {
                // Ensure canvas starts clear but with the background color base for fading
                ctx.clearRect(0,0, canvas.width, canvas.height);
                ctx.fillStyle = BG_COLOR;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });

        // --- Visibility Logic (Home Section Only) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isHome = entry.isIntersecting;
                if (isHome) {
                    brushBtn.style.opacity = '0.6';
                    brushBtn.style.pointerEvents = 'auto';
                } else {
                    brushBtn.style.opacity = '0';
                    brushBtn.style.pointerEvents = 'none';
                    isActive = false;
                    brushBtn.classList.remove('active');
                    canvas.classList.remove('active');
                }
            });
        }, { threshold: 0.1 });

        const homeSec = document.getElementById('home');
        if (homeSec) observer.observe(homeSec);
    }

    // Run on Load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
