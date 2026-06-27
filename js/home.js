// src/home.js - مثال برای صفحه Home
// src/home.js - Example for Home page

function initHome() {

    // ============================================================
    // ============ Three.js مثال / Three.js Example ============
    // ============================================================

    const canvas = document.getElementById('three-canvas');

    // اگر canvas وجود داشت و Three.js لود شده بود
    // If canvas exists and Three.js is loaded
    if (canvas && typeof THREE !== 'undefined') {

        // ساخت صحنه، دوربین و رندرر
        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ canvas });

        // ... تنظیمات Three.js ...
        // ... Three.js setup ...

        let animationId;

        // حلقه انیمیشن
        // Animation loop
        function animate() {
            animationId = requestAnimationFrame(animate);

            // ... render logic ...
            renderer.render(scene, camera);
        }

        animate();

        // ثبت cleanup برای جلوگیری از Memory Leak
        // Register cleanup to prevent memory leaks
        if (window.PageState) {
            PageState.addAnimation(animationId);
            PageState.addCleanup(() => {
                renderer.dispose();
                scene.clear();
            });
        }
    }


    // ============================================================
    // ============ Chart.js مثال / Chart.js Example ============
    // ============================================================

    const chartCanvas = document.getElementById('myChart');

    // اگر canvas وجود داشت و Chart.js لود شده بود
    // If canvas exists and Chart.js is loaded
    if (chartCanvas && typeof Chart !== 'undefined') {

        // ساخت چارت
        // Create chart
        const chart = new Chart(chartCanvas, {
            type: 'line',
            data: { /* ... chart data ... */ },
            options: { /* ... chart options ... */ }
        });

        // ثبت برای cleanup
        // Register for cleanup
        if (window.PageState) {
            PageState.addChart(chart);
        }
    }


    // ============================================================
    // ============ Event Listeners / رویدادها ============
    // ============================================================

    const button = document.getElementById('some-button');

    if (button) {

        // هندلر کلیک
        // Click handler
        const handler = () => {
            /* ... */
        };

        button.addEventListener('click', handler);

        // ثبت برای cleanup (حذف لیسنر هنگام خروج از صفحه)
        // Register for cleanup (remove listener when leaving page)
        if (window.PageState && PageState.currentPage) {
            PageState.currentPage.listeners.push({
                element: button,
                event: 'click',
                handler: handler
            });
        }
    }
}