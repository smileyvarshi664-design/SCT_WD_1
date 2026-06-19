document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contactForm');

    /* 1. Navbar Scroll Transformation & Active Link Tracking */
    window.addEventListener('scroll', () => {
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    /* 2. Mobile Responsive Menu Toggle */
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

   
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* 3. High Performance Intersection Observer for Scroll Animations */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optimize performance by stopping watch once loaded
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    /* 4. Contact Form Submission Engine (AJAX Fetch API) */
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner');
        const formStatus = document.getElementById('formStatus');

      
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                formStatus.textContent = data.message || 'Message sent successfully!';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Server processing error encountered.');
            }
        } catch (error) {
            formStatus.textContent = error.message || 'Failed to connect to the backend server.';
            formStatus.classList.add('error');
        } finally {
            // Revert state indicators back
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
});