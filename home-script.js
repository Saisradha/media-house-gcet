// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

function syncThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    const label = themeToggle.querySelector('span');

    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        label.textContent = 'Light Mode';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        label.textContent = 'Dark Mode';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

function setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('media-house-theme', isDark ? 'dark' : 'light');
    syncThemeToggle(isDark ? 'dark' : 'light');
}

// Three.js 3D Background Animation with Media-Related Elements
function init3DBackground() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create 3D Camera Icon
    const cameraGroup = new THREE.Group();
    
    // Camera body
    const bodyGeometry = new THREE.BoxGeometry(3, 2, 2);
    const bodyMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const cameraBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    cameraGroup.add(cameraBody);
    
    // Camera lens
    const lensGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const lensMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff3333, 
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const cameraLens = new THREE.Mesh(lensGeometry, lensMaterial);
    cameraLens.rotation.z = Math.PI / 2;
    cameraLens.position.z = 1.5;
    cameraGroup.add(cameraLens);
    
    scene.add(cameraGroup);
    cameraGroup.position.set(-15, 5, 0);

    // Create 3D Microphone Icon
    const micGroup = new THREE.Group();
    
    // Mic capsule
    const micGeometry = new THREE.SphereGeometry(1, 16, 16);
    const micMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const micCapsule = new THREE.Mesh(micGeometry, micMaterial);
    micGroup.add(micCapsule);
    
    // Mic stand
    const standGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const standMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x33ff33, 
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const micStand = new THREE.Mesh(standGeometry, standMaterial);
    micStand.position.y = -2;
    micGroup.add(micStand);
    
    scene.add(micGroup);
    micGroup.position.set(15, -5, 0);

    // Create Film Reel
    const filmReelGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const filmReelMaterial = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const filmReel = new THREE.Mesh(filmReelGeometry, filmReelMaterial);
    scene.add(filmReel);
    filmReel.position.set(0, 10, -20);

    camera.position.z = 30;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Animate camera icon
        cameraGroup.rotation.y += 0.01;
        cameraGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;

        // Animate microphone
        micGroup.rotation.y -= 0.01;
        micGroup.position.y = -5 + Math.sin(Date.now() * 0.002) * 2;

        // Animate film reel
        filmReel.rotation.z += 0.02;
        filmReel.rotation.x += 0.01;

        // Mouse interaction
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    });
}

// Visitor Counter
function updateVisitorCount() {
    // Get current count from localStorage or start at 0
    let count = localStorage.getItem('visitorCount');
    
    if (!count) {
        count = Math.floor(Math.random() * 500) + 1000; // Start with a random number between 1000-1500
    } else {
        count = parseInt(count);
    }
    
    // Increment the count
    count++;
    
    // Save to localStorage
    localStorage.setItem('visitorCount', count);
    
    // Animate the counter
    animateCounter(count);
}

function animateCounter(target) {
    const counterElement = document.getElementById('visitorCount');
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counterElement.textContent = current.toLocaleString();
    }, 20);
}

// Initialize visitor counter on page load
window.addEventListener('load', () => {
    updateVisitorCount();
    init3DBackground();
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('media-house-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 3D card tilt effect
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.work-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Auto-play carousel with pause on hover
const carousel = document.querySelector('#photoCarousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        bootstrap.Carousel.getInstance(carousel).pause();
    });
    carousel.addEventListener('mouseleave', () => {
        bootstrap.Carousel.getInstance(carousel).cycle();
    });
}
