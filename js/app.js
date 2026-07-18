/**
 * Media House GCET - 60 FPS Interaction & WebGL Engine
 */

// Global Google Apps Script Endpoint
const REGISTRATION_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXi06opwP1jtf4LwyMKFPMbHa5zdeGGKfDNN1a_SGJ856PKXrw4UlEsT4bjTFTm4M/exec';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.glass-navbar');

    function handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Mobile Menu Drawer Handler
    const menuBtn = document.getElementById('menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    function toggleMobileDrawer(open) {
        if (!mobileDrawer) return;
        if (open) {
            mobileDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileDrawer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', () => toggleMobileDrawer(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => toggleMobileDrawer(false));

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', () => toggleMobileDrawer(false));
    });

    // 3. Three.js 3D WebGL Background Engine
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 25;

        const mediaObjects = [];
        const loader = typeof THREE.GLTFLoader !== 'undefined' ? new THREE.GLTFLoader() : null;

        // Load 3D GLB Models
        if (loader) {
            loader.load(
                'models/media-house.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(-22, 0, -5);
                    model.scale.set(2, 2, 2);
                    model.userData = { rotSpeed: 0.003 };
                    scene.add(model);
                    mediaObjects.push(model);
                },
                undefined,
                (err) => console.log('Notice: GLB media-house loader active fallback', err)
            );

            loader.load(
                'models/geetanjali.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(22, 0, -5);
                    model.scale.set(2, 2, 2);
                    model.userData = { rotSpeed: -0.003 };
                    scene.add(model);
                    mediaObjects.push(model);
                },
                undefined,
                (err) => console.log('Notice: GLB geetanjali loader active fallback', err)
            );
        }

        // Particle System
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 75;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.14,
            color: 0xef4444,
            transparent: true,
            opacity: 0.75
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Ambient Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const pointLightRed = new THREE.PointLight(0xef4444, 4, 45);
        pointLightRed.position.set(0, 10, 10);
        scene.add(pointLightRed);

        // Resize Listener
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize, { passive: true });

        // Animation Loop
        let time = 0;
        function animateScene() {
            requestAnimationFrame(animateScene);
            time += 0.01;

            particlesMesh.rotation.y += 0.0006;
            particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.04;

            mediaObjects.forEach(obj => {
                obj.rotation.z += obj.userData.rotSpeed || 0.002;
                obj.position.y += Math.sin(time * 1.2) * 0.008;
            });

            pointLightRed.intensity = 4 + Math.sin(time * 2) * 1.2;
            renderer.render(scene, camera);
        }
        animateScene();
    }

    // 4. Scroll Reveal & Counter Observers
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-up, section').forEach(el => {
        revealObserver.observe(el);
    });

    // Stats Counter Animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
                let count = 0;
                const speed = Math.max(1, Math.floor(target / 40));
                
                const updateCounter = () => {
                    count += speed;
                    if (count >= target) {
                        entry.target.textContent = `${target}+`;
                    } else {
                        entry.target.textContent = `${count}+`;
                        requestAnimationFrame(updateCounter);
                    }
                };
                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-count').forEach(counter => counterObserver.observe(counter));

    // 5. Card 3D Tilt Physics
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * -12;
            const tiltY = (x / rect.width) * 12;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    // 6. Portfolio Showcase Filters & Lightbox Modal
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active', 'bg-red-600', 'text-white'));
            filterBtns.forEach(b => b.classList.add('bg-white/5', 'text-gray-400'));
            btn.classList.add('active', 'bg-red-600', 'text-white');
            btn.classList.remove('bg-white/5', 'text-gray-400');

            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img')?.src || '';
            const title = item.dataset.title || 'Project Showcase';
            const desc = item.dataset.desc || 'Media House GCET Coverage';
            
            if (lightboxModal && lightboxImg) {
                lightboxImg.src = img;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxDesc) lightboxDesc.textContent = desc;
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 7. Team Search & Department Filter Bar
    const teamSearch = document.getElementById('team-search');
    const teamCards = document.querySelectorAll('.team-flip-card, .committee-card-spotlight');

    if (teamSearch) {
        teamSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            teamCards.forEach(card => {
                const name = (card.dataset.name || '').toLowerCase();
                const role = (card.dataset.role || '').toLowerCase();
                const dept = (card.dataset.department || '').toLowerCase();

                if (name.includes(query) || role.includes(query) || dept.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 8. Lucide Icons Initialization
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ===== Multi-Step Recruitment Modal & Google Apps Script Engine =====

let currentFormStep = 1;

function openRegistrationModal() {
    const modal = document.getElementById('multiStepModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('multiStepModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function goToStep(step) {
    currentFormStep = step;
    document.querySelectorAll('.form-step').forEach((s, idx) => {
        s.classList.toggle('active', idx + 1 === step);
    });

    document.querySelectorAll('.step-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx + 1 === step);
        dot.classList.toggle('completed', idx + 1 < step);
    });
}

function nextStep(current) {
    // Basic Step Validation
    const currentStepEl = document.getElementById(`step-${current}`);
    if (currentStepEl) {
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        for (let input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return;
            }
        }
    }
    goToStep(current + 1);
}

function prevStep(current) {
    goToStep(current - 1);
}

async function handleRecruitmentSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('recruitmentSubmitBtn');
    const form = document.getElementById('multiStepForm');

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Application...';
    }

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    data.timestamp = new Date().toISOString();

    try {
        await fetch(REGISTRATION_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast('✅ Application Submitted Successfully! We will contact you soon.', 'success');
        form.reset();
        setTimeout(() => {
            closeRegistrationModal();
        }, 2000);

    } catch (err) {
        console.error('Submission error:', err);
        showToast('❌ Submission failed. Please try again.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
        }
    }
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
