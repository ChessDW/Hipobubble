// Navegación responsive
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Smooth scrolling para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// Contador de estadísticas
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Velocidad en milisegundos

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    });
}

// FAQ toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Animación de elementos al hacer scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Si es la sección de stats, iniciar el contador
            if (entry.target.classList.contains('stats')) {
                animateCounter();
            }
        }
    });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.ps-box, .product-card, .value-item, .process-step, .stats, .faq-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// Cambiar estilo de navbar al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--blanco)';
        navbar.style.backdropFilter = 'none';
    }
});

// Contador de estadísticas - VERSIÓN CON requestAnimationFrame (más suave)
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2500; // 3 segundos de duración
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Función de easing para suavizar la animación
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = Math.floor(start + (target - start) * easeOutQuart);
            counter.innerText = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

/* BARRA DE PROGRESO SCROLL */

function updateScrollProgress(){
    const scrollProgress = document.querySelector(".scroll-progress-bar");
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollPosition = window.scrollY;

    const scrollPercentage = (scrollPosition / documentHeight) * 100;
    scrollProgress.style.width = scrollPercentage + "%";
}

/* MODO OSCURO */
function toggleDarkMode(){
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');

    localStorage.setItem('darkMode', isDarkMode);

    updateThemeIcon(isDarkMode);
}

function updateThemeIcon(isDarkMode){
    const themeToggle = document.querySelector('.theme-toggle')
}

function loadThemePreference(){
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches;

    if(savedTheme !== null){
        if(savedTheme === 'true') {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
    } else if (prefersDark){
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
}

document.addEventListener('DOMContentLoaded', function(){
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', toggleDarkMode);

    loadThemePreference();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e)=>{
        if(localStorage.getItem('darkMode') === null){
            if(e.matches){
                document.body.classList.add('dark-mode');
                updateThemeIcon(true);
            } else{
                document.body.classList.remove('dark-mode');
                updateThemeIcon(false);
            }
        }
    });
});