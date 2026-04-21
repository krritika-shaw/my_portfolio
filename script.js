document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Remove observer once shown
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    /* --- Mobile Menu Toggle --- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        // Toggle mobile nav simply by applying conditional display
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(7, 7, 10, 0.95)';
            navLinks.style.padding = '2rem 0';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        }
    });

    /* --- Web3Forms AJAX Submission --- */
    const form = document.getElementById('contactForm');
    const result = document.getElementById('form-result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable button while submitting
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="ph ph-spinner ph-spin"></i>';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => object[key] = value);
        const json = JSON.stringify(object);

        result.innerHTML = "Sending...";
        result.style.color = "var(--text-muted)";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResp = await response.json();
            if (response.status == 200) {
                result.innerHTML = "<i class='ph ph-check-circle'></i> " + jsonResp.message;
                result.style.color = "var(--accent-cyan)";
            } else {
                console.log(response);
                result.innerHTML = "<i class='ph ph-warning-circle'></i> " + jsonResp.message;
                result.style.color = "var(--accent-purple)";
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "<i class='ph ph-warning-circle'></i> Something went wrong!";
            result.style.color = "red";
        })
        .finally(() => {
            form.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Remove the success/error message after 5 seconds
            setTimeout(() => {
                result.innerHTML = "";
            }, 5000);
        });
    });

    // Make smooth scrolling for anchor links slightly offset by navbar height
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // hide mobile menu on click
            if(window.innerWidth <= 600) {
                navLinks.style.display = 'none';
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            const navbarHeight = 80; // approximate height when scrolled

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial slight delay to show navbar and hero
    setTimeout(() => {
        document.querySelector('.hero').classList.add('show');
        document.querySelector('.navbar').classList.remove('hidden-onload');
    }, 100);
});
