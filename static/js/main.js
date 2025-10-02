// Fonctions globales pour toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du compteur du panier
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 3; // Valeur initiale

    // Animation des éléments au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .product-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    // Initialiser les animations
    const animatedElements = document.querySelectorAll('.category-card, .product-card');
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "all 0.6s ease";
    });

    // Écouter l'événement de défilement
    window.addEventListener('scroll', animateOnScroll);
    
    // Déclencher une première fois
    animateOnScroll();

    // Gestion de la recherche
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', function() {
        performSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            window.location.href = `tous-les-articles.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    // Gestion des dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.querySelector('.dropdown-menu').style.opacity = "1";
            this.querySelector('.dropdown-menu').style.visibility = "visible";
            this.querySelector('.dropdown-menu').style.transform = "translateY(0)";
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.querySelector('.dropdown-menu').style.opacity = "0";
            this.querySelector('.dropdown-menu').style.visibility = "hidden";
            this.querySelector('.dropdown-menu').style.transform = "translateY(10px)";
        });
    });

    // Fonction pour ajouter au panier
    window.addToCart = function(productId, productName) {
        cartItems++;
        cartCount.textContent = cartItems;
        
        // Animation de feedback
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
        
        // Message de confirmation
        showNotification(`${productName} ajouté au panier`, 'success');
    };

    // Fonction d'affichage des notifications
    window.showNotification = function(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles de base pour les notifications
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = 'var(--success-color)';
        } else if (type === 'error') {
            notification.style.backgroundColor = 'var(--secondary-color)';
        } else {
            notification.style.backgroundColor = 'var(--accent-color)';
        }
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après 5 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    };

    // Ajouter les keyframes d'animation pour les notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});