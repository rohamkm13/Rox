// ------------------------------------------------------------
// سیستم مدیریت Cleanup صفحات
// Page cleanup management system
// ------------------------------------------------------------
window.__pageCleanup = {
    tasks: [],

    // افزودن یک تابع پاک‌سازی
    // Add a cleanup function
    add: function(fn) {
        this.tasks.push(fn);
    },

    // اجرای تمام پاک‌سازی‌ها و ریست لیست
    // Run all cleanup tasks and reset list
    run: function() {
        this.tasks.forEach(fn => {
            try { fn(); } catch (e) { console.warn('Cleanup error:', e); }
        });
        this.tasks = [];
    }
};


// ------------------------------------------------------------
// تبدیل مسیر نسبی به مسیر درست برای index.html
// Resolve relative paths correctly for index.html
// ------------------------------------------------------------
function resolveHref(href, pageBase) {

    // اگر لینک کامل یا ریشه‌دار باشد، همان را برگردان
    // If absolute/external path, return as-is
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('/'))
        return href;

    // اصلاح مسیر فایل‌های داخل پوشه pages
    // Fix paths for files inside "pages" folder
    if (pageBase === 'pages') {
        return href.replace(/^\.\.\//, '').replace(/ /g, '%20');
    }

    return href;
}


// ------------------------------------------------------------
// فعال کردن لینک سایدبار مطابق صفحه فعلی
// Highlight active sidebar link based on current page
// ------------------------------------------------------------
function setActiveSidebarLink(pageName) {
    if (!pageName) return;

    const normalized = pageName.toLowerCase();

    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
        const linkPage = (link.getAttribute('data-page') || '').toLowerCase();
        link.classList.toggle('active', linkPage === normalized);
    });
}


// ------------------------------------------------------------
// لود صفحه با Fetch + مدیریت اسکریپت‌ها و استایل‌ها
// Load page via Fetch + script/style injection
// ------------------------------------------------------------
function loadPage(url, skipTransition) {

    // استخراج نام صفحه از URL
    // Extract page name from URL
    const pageName = url.split('/').pop().replace('.html', '');

    // استخراج پوشه صفحه (مثلاً pages)
    // Extract base folder (e.g., "pages")
    const pageBase = url.includes('/') ? url.split('/')[0] : '';

    const content = document.getElementById('content');


    // تابع اصلی لود
    // Main load function
    function doLoad() {

        // اجرای Cleanup قبلی
        // Run previous cleanup tasks
        window.__pageCleanup?.run();

        // حذف فایل‌های داینامیک قبلی
        // Remove previous dynamic assets
        document.querySelectorAll('[data-dynamic-page]').forEach(el => el.remove());

        fetch(url)
        .then(res => res.text())
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // -------------------------------
            // محتوای صفحه
            // Page content
            // -------------------------------
            const newContent = doc.querySelector('#page-content');
            if (!newContent) return;

            content.innerHTML = newContent.innerHTML;


            // -------------------------------
            // استایل‌ها با مسیر اصلاح‌شده
            // Stylesheets with resolved paths
            // -------------------------------
            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                const resolved = resolveHref(href, pageBase);

                if (resolved && !document.querySelector(`link[href="${resolved}"]`)) {
                    const newLink = document.createElement('link');
                    newLink.rel = "stylesheet";
                    newLink.href = resolved;
                    newLink.setAttribute('data-dynamic-page', pageName);
                    document.head.appendChild(newLink);
                }
            });


            // -------------------------------
            // اسکریپت‌ها
            // Scripts
            // -------------------------------
            const scripts = doc.querySelectorAll('script');

            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.setAttribute('data-dynamic-page', pageName);

                if (script.src) {
                    newScript.src = resolveHref(script.getAttribute('src'), pageBase);
                } else {
                    newScript.textContent = script.textContent;
                }

                document.body.appendChild(newScript);
            });


            // -------------------------------
            // فعال‌سازی لینک سایدبار
            // Update active sidebar link
            // -------------------------------
            setActiveSidebarLink(pageName);


            // -------------------------------
            // اجرای init صفحه
            // Run page init function
            // -------------------------------
            function runPageInit() {

                // اجرای init مخصوص صفحه (مثلاً initHome)
                // Run page-specific init function
                const initFn = window['init' + pageName.charAt(0).toUpperCase() + pageName.slice(1)];
                if (typeof initFn === "function") initFn();

                // صفحات پروژه/تمپلیت/کامپوننت → رندر اجباری
                // Force render for Projects/Templates/Components pages
                if (['Projects', 'Templates', 'Components'].includes(pageName)) {
                    if (typeof createFilterButtons === 'function' && typeof renderProjects === 'function') {
                        createFilterButtons();
                        renderProjects();
                    }
                }

                // اعمال زبان
                // Apply language
                const lang = localStorage.getItem('lang') || 'en';
                if (typeof updateTexts === 'function') updateTexts(lang);
            }

            // اجرای init بعد از رندر DOM
            // Run init after DOM render
            requestAnimationFrame(() => requestAnimationFrame(runPageInit));

            content.style.opacity = '1';
        })
        .catch(err => {
            console.error("Error loading page:", err);
            content.style.opacity = '1';
        });
    }


    // اگر انیمیشن لازم نیست
    // Skip transition if needed
    if (skipTransition || !content.innerHTML.trim()) {
        doLoad();
        return;
    }

    // انیمیشن fade-out
    // Fade-out animation
    content.style.opacity = '0';
    setTimeout(doLoad, 220);
}


// ------------------------------------------------------------
// کلیک روی لینک‌های سایدبار
// Sidebar link click handler
// ------------------------------------------------------------
document.addEventListener("click", function(e) {

    const link = e.target.closest("[data-page]");
    if (!link) return;

    e.preventDefault();

    const page = link.getAttribute("data-page");

    // تغییر URL بدون رفرش
    // Update URL without reload
    history.pushState({ page }, "", `#${page}`);

    // لود صفحه
    // Load page
    loadPage(`pages/${page}.html`);
});


// ------------------------------------------------------------
// لود اولیه + پشتیبانی از رفرش
// Initial load + reload support
// ------------------------------------------------------------
window.addEventListener("load", async () => {

    // لود زبان
    // Load language data
    if (typeof loadLanguageData === 'function') {
        await loadLanguageData();
    }

    const hash = location.hash.replace("#", "");
    const page = hash || "home";

    // لود بدون انیمیشن
    // Load without transition
    loadPage(`pages/${page}.html`, true);
});


// ------------------------------------------------------------
// دکمه Back/Forward مرورگر
// Browser back/forward navigation
// ------------------------------------------------------------
window.addEventListener("popstate", (e) => {

    const page = (e.state?.page || location.hash.replace("#", "") || "home");

    loadPage(`pages/${page}.html`);
});