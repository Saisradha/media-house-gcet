/**
 * Media House GCET - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Three.js Background Canvas
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 30;

        const mediaObjects = [];
        const loader = typeof THREE.GLTFLoader !== 'undefined' ? new THREE.GLTFLoader() : null;

        // Load 3D GLB Models if available
        if (loader) {
            // Media House Logo Model
            loader.load(
                'models/media-house.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(-25, 0, -5);
                    model.scale.set(2, 2, 2);
                    model.userData = { type: 'glb-model', modelName: 'media-house', rotSpeed: 0.004 };
                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
                        model.userData.mixer = mixer;
                    }
                    scene.add(model);
                    mediaObjects.push(model);
                },
                undefined,
                (error) => console.log('Notice: GLB media-house model loader fallback active', error)
            );

            // Geetanjali Logo Model
            loader.load(
                'models/geetanjali.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(25, 0, -5);
                    model.scale.set(2, 2, 2);
                    model.userData = { type: 'glb-model', modelName: 'geetanjali', rotSpeed: -0.004 };
                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
                        model.userData.mixer = mixer;
                    }
                    scene.add(model);
                    mediaObjects.push(model);
                },
                undefined,
                (error) => console.log('Notice: GLB geetanjali model loader fallback active', error)
            );
        }

        // Floating particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 800;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xef4444,
            transparent: true,
            opacity: 0.8
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const keyLight = new THREE.PointLight(0xef4444, 5, 50);
        keyLight.position.set(0, 10, 10);
        scene.add(keyLight);

        const fillLight = new THREE.PointLight(0xffffff, 4, 40);
        fillLight.position.set(-10, 5, 15);
        scene.add(fillLight);

        const backLight = new THREE.PointLight(0x4444ff, 3, 35);
        backLight.position.set(10, -5, -10);
        scene.add(backLight);

        // Resize handler
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            const isMobile = window.innerWidth < 768;
            mediaObjects.forEach((obj) => {
                if (isMobile) {
                    if (obj.userData.modelName === 'media-house') {
                        obj.position.set(-15, 0, -3);
                        obj.scale.set(1, 1, 1);
                    } else if (obj.userData.modelName === 'geetanjali') {
                        obj.position.set(15, 0, -3);
                        obj.scale.set(1, 1, 1);
                    }
                } else {
                    if (obj.userData.modelName === 'media-house') {
                        obj.position.set(-25, 0, -5);
                        obj.scale.set(2, 2, 2);
                    } else if (obj.userData.modelName === 'geetanjali') {
                        obj.position.set(25, 0, -5);
                        obj.scale.set(2, 2, 2);
                    }
                }
            });
        }
        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        // Animation Loop
        let time = 0;
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;
            const delta = clock.getDelta();

            particlesMesh.rotation.y += 0.0008;
            particlesMesh.rotation.x = Math.sin(time * 0.3) * 0.05;

            mediaObjects.forEach((obj) => {
                if (obj.userData.mixer) {
                    obj.userData.mixer.update(delta);
                }
                if (obj.userData.type === 'glb-model') {
                    obj.rotation.z += obj.userData.rotSpeed || 0.003;
                    obj.position.y += Math.sin(time * 1.0) * 0.01;
                }
            });

            keyLight.intensity = 4 + Math.sin(time * 2) * 1.5;
            renderer.render(scene, camera);
        }
        animate();
    }

    // 2. Scroll Animation Observers
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .slide-left, .slide-right, .scale-up, .rotate-in').forEach(el => {
        observer.observe(el);
    });

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .team-card').forEach(card => {
        cardObserver.observe(card);
    });

    // 3. Team Card Modal Listener
    const teamModal = document.getElementById('team-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalRole = document.getElementById('modal-role');
    const modalDepartment = document.getElementById('modal-department');
    const modalBio = document.getElementById('modal-bio');

    if (teamModal) {
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                
                modalName.textContent = this.dataset.name || '';
                modalRole.textContent = this.dataset.role || '';
                modalDepartment.textContent = this.dataset.department || '';
                modalBio.textContent = this.dataset.bio || '';
                modalImage.src = this.dataset.image || '';
                modalImage.alt = this.dataset.name || 'Team Member';
                
                teamModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            teamModal.classList.add('closing');
            setTimeout(() => {
                teamModal.classList.remove('active', 'closing');
                document.body.style.overflow = '';
            }, 500);
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);
        teamModal.addEventListener('click', (e) => {
            if (e.target === teamModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && teamModal.classList.contains('active')) closeModal();
        });
    }

    // 4. Lucide Icons & Mobile Menu
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scroll for Nav Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // 5. Recruitment Countdown Timer
    const countdownElementMain = document.getElementById('countdown');
    const countdownFinishedElement = document.getElementById('countdown-finished');
    if (countdownElementMain) {
        const recruitmentDate = new Date('2026-02-20T09:00:00').getTime();
        const createCountdownBox = (value, label) => `
            <div class="countdown-box text-center p-3 md:p-4 rounded-lg min-w-[70px] md:min-w-[90px]">
                <p class="text-2xl md:text-4xl font-bold text-white">${value}</p>
                <p class="text-xs md:text-sm text-gray-400 uppercase">${label}</p>
            </div>
        `;

        const countdownIntervalMain = setInterval(() => {
            const now = new Date().getTime();
            const distance = recruitmentDate - now;

            if (distance < 0) {
                clearInterval(countdownIntervalMain);
                countdownElementMain.classList.add('hidden');
                if (countdownFinishedElement) countdownFinishedElement.classList.remove('hidden');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElementMain.innerHTML = 
                createCountdownBox(String(days).padStart(2, '0'), 'Days') +
                createCountdownBox(String(hours).padStart(2, '0'), 'Hours') +
                createCountdownBox(String(minutes).padStart(2, '0'), 'Minutes') +
                createCountdownBox(String(seconds).padStart(2, '0'), 'Seconds');
        }, 1000);
    }

    // 6. Contact Form Mailto Handler
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const subject = document.getElementById('subject')?.value || '';
            const message = document.getElementById('message')?.value || '';
            
            const mailtoLink = `mailto:mediahouse@gcet.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            
            if (formMessage) {
                formMessage.textContent = 'Opening your email client...';
                formMessage.className = 'mt-4 text-center text-green-400 font-semibold';
                formMessage.classList.remove('hidden');
                setTimeout(() => {
                    contactForm.reset();
                    formMessage.classList.add('hidden');
                }, 3000);
            }
        });
    }

    // 7. Portfolio Carousel Controls
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (track && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('carousel-indicator');
                if (i === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
        }

        const indicators = document.querySelectorAll('.carousel-indicator');

        function updateCarousel() {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        setInterval(nextSlide, 5000);
    }

    // 8. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        let hasAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target || '0');
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                stat.textContent = Math.floor(current) + '+';
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.textContent = target + '+';
                            }
                        };
                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stat-box');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // 9. Subtle Cursor Accent Trail
    function createMagicParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.background = 'rgba(239, 68, 68, 0.6)';
        particle.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.4)';
        particle.style.transition = 'all 0.8s ease-out';
        particle.style.opacity = '0.6';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
        }, 50);
        
        setTimeout(() => particle.remove(), 800);
    }

    let lastParticleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastParticleTime > 120) {
            createMagicParticle(e.clientX, e.clientY);
            lastParticleTime = now;
        }
    });
});
