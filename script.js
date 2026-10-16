/* ============================================
   HARI SIDDARTH J.R. — PORTFOLIO SCRIPT
   Features:
   - Dynamic typing animation
   - Scroll progress indicator
   - Navbar scroll & active section tracking
   - Responsive mobile navigation
   - Intersection Observer (fade-in transitions)
   - Working mailto contact dispatch & validation
   - Smooth anchor scrolling with error prevention
   - Card tilt and hover physics
   ============================================ */

/* ── TYPING ANIMATION ── */
const typedEl = document.getElementById('typed');
const roles = [
    'Software Development Intern Candidate',
    'Second-Year B.Tech CSE (AI & ML) Student',
    'Full-Stack Developer (React & Node.js)',
    'AI & RAG System Builder'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350;
    }

    setTimeout(typeLoop, typingSpeed);
}

if (typedEl) {
    setTimeout(typeLoop, 600);
}


/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('scroll-progress');

function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress, {
    passive: true
});


/* ── NAVBAR: scroll behavior + active link tracking ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateNavbar, {
    passive: true
});
updateNavbar();


/* ── HAMBURGER MENU TOGGLE ── */
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');

if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinksList.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinksList.classList.remove('open');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinksList.classList.remove('open');
        }
    });
}


/* ── INTERSECTION OBSERVER: fade-in ── */
const fadeEls = document.querySelectorAll('.fade-in, .fade-in-up');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeEls.forEach(el => fadeObserver.observe(el));

// Skill bars observer (if present)
const skillBars = document.querySelectorAll('.skill-bar');
if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.4
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
}


/* ── BACK TO TOP BUTTON ── */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, {
        passive: true
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ── CONTACT FORM: WORKING MAILTO DISPATCH WITH VALIDATION ── */
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formInfoBox = document.getElementById('form-info-box');
const submitBtn = document.getElementById('submit-btn');

function showError(input, errorId, msg) {
    if (!input) return;
    input.classList.add('error');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = msg;
}

function clearError(input, errorId) {
    if (!input) return;
    input.classList.remove('error');
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, 'name-error'));
if (emailInput) emailInput.addEventListener('input', () => clearError(emailInput, 'email-error'));
if (messageInput) messageInput.addEventListener('input', () => clearError(messageInput, 'message-error'));

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const msgVal = messageInput ? messageInput.value.trim() : '';

        // Validate Name
        if (nameVal.length < 2) {
            showError(nameInput, 'name-error', 'Please enter your full name (at least 2 characters).');
            isValid = false;
        } else {
            clearError(nameInput, 'name-error');
        }

        // Validate Email
        if (!isValidEmail(emailVal)) {
            showError(emailInput, 'email-error', 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError(emailInput, 'email-error');
        }

        // Validate Message
        if (msgVal.length < 10) {
            showError(messageInput, 'message-error', 'Message must be at least 10 characters.');
            isValid = false;
        } else {
            clearError(messageInput, 'message-error');
        }

        if (isValid) {
            const recipient = 'harisiddarth.jr@gmail.com';
            const subject = encodeURIComponent(`Portfolio Inquiry from ${nameVal}`);
            const body = encodeURIComponent(
                `Hello Hari,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${msgVal}\n\n---\nSent from Portfolio Website`
            );
            const mailtoUri = `mailto:${recipient}?subject=${subject}&body=${body}`;

            if (formInfoBox) {
                formInfoBox.innerHTML = `
                    <div style="display:flex; align-items:flex-start; gap:10px;">
                        <i class="ri-mail-send-line" style="font-size:1.2rem; color:var(--accent); flex-shrink:0; margin-top:2px;"></i>
                        <div>
                            <div><strong>Launching your email app to send message...</strong></div>
                            <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">
                                If your email client does not open automatically, <a href="${mailtoUri}" style="color:var(--accent); text-decoration:underline; font-weight:600;">click here to open directly</a> or email me at <a href="mailto:${recipient}" style="color:var(--accent); font-weight:600;">${recipient}</a>.
                            </div>
                        </div>
                    </div>
                `;
                formInfoBox.classList.add('show');
            }

            // Launch default mail client
            window.location.href = mailtoUri;
        }
    });
}


/* ── SMOOTH SCROLL: SAFE SELECTOR HANDLING ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || !href.startsWith('#')) return;

        let target = null;
        try {
            target = document.querySelector(href);
        } catch (err) {
            return;
        }

        if (target) {
            e.preventDefault();
            const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});


/* ── STAGGERED FADE-IN DELAYS ── */
function addStaggerDelay(selector, delay = 80) {
    const items = document.querySelectorAll(selector);
    items.forEach((el, i) => {
        el.style.transitionDelay = `${i * delay}ms`;
    });
}

addStaggerDelay('.skill-card', 60);
addStaggerDelay('.project-card', 100);
addStaggerDelay('.education-card', 90);
addStaggerDelay('.credential-card', 90);
addStaggerDelay('.highlight-item', 70);


/* ── CARD HOVER TILT EFFECT (SUBTLE & SMOOTH) ── */
document.querySelectorAll('.project-card, .credential-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -3;
        const rotY = ((x - cx) / cx) * 3;
        card.style.transform = `translateY(-6px) perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});