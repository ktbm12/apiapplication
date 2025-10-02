// Compte à rebours pour les promotions
function updateCountdown() {
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 12); // 12 jours à partir d'aujourd'hui
    
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const countdownNumbers = document.querySelectorAll('.countdown-number');
    if (countdownNumbers.length >= 4) {
        countdownNumbers[0].textContent = days.toString().padStart(2, '0');
        countdownNumbers[1].textContent = hours.toString().padStart(2, '0');
        countdownNumbers[2].textContent = minutes.toString().padStart(2, '0');
        countdownNumbers[3].textContent = seconds.toString().padStart(2, '0');
    }
}

// Animation au défilement
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les sections pour l'animation
    const sections = document.querySelectorAll('.categories, .featured-products, .promotions, .newsletter');
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Gestion du panier
function initCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation du bouton
            this.style.backgroundColor = '#27ae60';
            this.innerHTML = '<i class="fas fa-check"></i>';
            
            // Mettre à jour le compteur du panier
            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            
            // Réinitialiser le bouton après 2 secondes
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            }, 2000);
        });
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Démarrer le compte à rebours
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Initialiser les animations
    initScrollAnimations();
    
    // Initialiser la gestion du panier
    initCart();
    
    // Gestion de la recherche
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            if (searchInput.value.trim() !== '') {
                alert('Recherche pour: ' + searchInput.value);
                // Ici vous redirigeriez vers la page de résultats de recherche
            }
        });
    }
});