// JavaScript spécifique à la page de contact

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordéon
    initFAQAccordion();
    
    // Formulaire de contact
    initContactForm();
    
    // Animations au défilement
    initScrollAnimations();
});

// Initialiser l'accordéon FAQ
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fermer tous les autres éléments
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Basculer l'élément actuel
            item.classList.toggle('active');
        });
    });
}

// Initialiser le formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des valeurs du formulaire
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validation
        if (!validateContactForm(firstname, lastname, email, subject, message)) {
            return;
        }
        
        // Envoi du formulaire
        sendContactForm(firstname, lastname, email, subject, message);
    });
}

// Valider le formulaire de contact
function validateContactForm(firstname, lastname, email, subject, message) {
    let isValid = true;
    const errors = [];
    
    // Validation des champs obligatoires
    if (!firstname.trim()) {
        errors.push('Le prénom est obligatoire');
        highlightField('firstname', false);
        isValid = false;
    } else {
        highlightField('firstname', true);
    }
    
    if (!lastname.trim()) {
        errors.push('Le nom est obligatoire');
        highlightField('lastname', false);
        isValid = false;
    } else {
        highlightField('lastname', true);
    }
    
    if (!email.trim()) {
        errors.push('L\'email est obligatoire');
        highlightField('email', false);
        isValid = false;
    } else if (!isValidEmail(email)) {
        errors.push('L\'email n\'est pas valide');
        highlightField('email', false);
        isValid = false;
    } else {
        highlightField('email', true);
    }
    
    if (!subject) {
        errors.push('Le sujet est obligatoire');
        highlightField('subject', false);
        isValid = false;
    } else {
        highlightField('subject', true);
    }
    
    if (!message.trim()) {
        errors.push('Le message est obligatoire');
        highlightField('message', false);
        isValid = false;
    } else {
        highlightField('message', true);
    }
    
    // Afficher les erreurs
    if (!isValid) {
        showMessage('Veuillez corriger les erreurs suivantes: ' + errors.join(', '), 'error');
    }
    
    return isValid;
}

// Mettre en évidence un champ
function highlightField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    if (isValid) {
        field.style.borderColor = '#27ae60';
        field.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.2)';
    } else {
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.2)';
    }
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }, 3000);
}

// Envoyer le formulaire de contact
function sendContactForm(firstname, lastname, email, subject, message) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Désactiver le bouton et changer le texte
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation d'envoi (remplacez par votre logique d'envoi réelle)
    setTimeout(() => {
        // Message de succès
        showMessage('Merci ' + firstname + '! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Réinitialisation du formulaire
        document.getElementById('contact-form').reset();
        
        // Restauration du bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Envoyer les données au serveur (exemple avec fetch)
        sendToServer(firstname, lastname, email, subject, message);
        
    }, 1500);
}

// Envoyer les données au serveur
function sendToServer(firstname, lastname, email, subject, message) {
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('csrfmiddlewaretoken', getCSRFToken());
    
    // Exemple d'envoi avec fetch (à adapter selon votre backend)
    fetch('/api/contact/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Message envoyé avec succès');
        } else {
            console.error('Erreur lors de l\'envoi du message');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}

// Récupérer le token CSRF
function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfToken ? csrfToken.value : '';
}

// Fonction de validation d'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialiser les animations au défilement
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
    const sections = document.querySelectorAll('.contact-section, .faq-section, .map-section');
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Fonction d'affichage des messages
function showMessage(message, type) {
    // Supprimer les messages existants
    const existingMessage = document.querySelector('.message-alert');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert message-${type}`;
    messageDiv.textContent = message;
    
    // Styles pour le message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Couleur selon le type
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#e74c3c';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#27ae60';
    } else {
        messageDiv.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(messageDiv);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Ajouter les keyframes d'animation pour les messages
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