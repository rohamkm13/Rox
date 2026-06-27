// بارگذاری تم و تنظیمات ذخیره‌شده
function loadSavedTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}
loadSavedTheme();

       document.querySelectorAll(".close-bar").forEach(icon => icon.style.display = "none");
       
    // وضعیت active سایدبار توسط routes.js مدیریت می‌شود
    // کلیک فوری برای بازخورد بصری
    document.querySelectorAll(".sidebar-link[data-page]").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-link.active").forEach(a => a.classList.remove("active"));
        link.classList.add("active");
        if (window.innerWidth <= 1024 && sidebar.classList.contains("open")) {
          toggleSidebar();
        }
      });
    });
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");
    

    function toggleSidebar() {
      const isOpen = sidebar.classList.contains("open");
      if (isOpen) {
        sidebar.classList.remove("open");
        content.classList.remove("content-shift");
      
        toggleBtn.classList.remove("active");
  document.querySelectorAll(".close-bar").forEach(icon => icon.style.display = "block");
      

      } else {
        sidebar.classList.add("open");
        content.classList.add("content-shift");
      
        toggleBtn.classList.add("active");
         document.querySelectorAll(".close-bar").forEach(icon => icon.style.display = "none");

       
      }
    }

    toggleBtn.addEventListener("click", toggleSidebar);

    if (window.innerWidth <= 1024) {
      sidebar.classList.remove("open");
      content.classList.remove("content-shift");
      content.classList.add("content-unshift");
      toggleBtn.classList.remove("active");
      document.querySelectorAll(".close-bar").forEach(icon => icon.style.display = "block");
    }

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", toggleSidebar);
    }
  

    // ESC برای بستن
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
        if (sidebar.classList.contains("open")) {
          toggleSidebar();
        }
        else
          toggleSidebar();
        
      }
    });


const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // حرکت آنی نقطه مرکزی
  cursorDot.style.translate = `${posX}px ${posY}px`;
  
  // حرکت دایره بیرونی (با کمی تاخیر به کمک transition در CSS)
  cursorOutline.style.left =` ${posX - 17}px`; // 20 نصف عرض دایره است برای مرکزیت
  cursorOutline.style.top = `${posY - 17}px`;
});

// اضافه کردن افکت وقتی روی دکمه‌ها یا لینک‌ها می‌روی
const clickables = document.querySelectorAll('a, button, .tech-item, .counter-card');

clickables.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursorOutline.classList.add('cursor-active');
    cursorDot.style.transform = 'scale(0.5)';
  });
  
  link.addEventListener('mouseleave', () => {
    cursorOutline.classList.remove('cursor-active');
    cursorDot.style.transform = 'scale(1)';
  });
});




window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 1000);
  }
});



function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('live-clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// به‌روزرسانی تعداد پروژه‌ها، تمپلیت‌ها، کامپوننت‌ها و فیوریت در سایدبار
function updateSidebarBadges() {
  document.querySelectorAll('.badge[data-count]').forEach(badge => {
    const key = badge.getAttribute('data-count');
    let count = 0;
    if (key === 'favorites') {
      try {
        const fav = JSON.parse(localStorage.getItem('myFavorites') || '[]');
        count = Array.isArray(fav) ? fav.length : 0;
      } catch (e) {}
    } else if (typeof APP_DATA !== 'undefined') {
      count = APP_DATA[key]?.length ?? 0;
    }
    badge.textContent = count;
  });
}
updateSidebarBadges();







