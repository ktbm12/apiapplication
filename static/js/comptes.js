// JavaScript spécifique à la page de création de compte

document.addEventListener('DOMContentLoaded', function() {
    // Navigation entre les étapes
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Initialiser les sélecteurs de date
    initializeDateSelectors();
    
    // Gérer les boutons suivant
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const nextStepNumber = this.getAttribute('data-next');
            const nextStep = document.querySelector(`.form-step[data-step="${nextStepNumber}"]`);
            
            // Valider l'étape actuelle avant de passer à la suivante
            if (validateStep(currentStep.getAttribute('data-step'))) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // Mettre à jour la barre de progression
                updateProgressBar(nextStepNumber);
                
                // Si on passe à l'étape 3, mettre à jour le résumé
                if (nextStepNumber === '3') {
                    updateSummary();
                }
            }
        });
    });
    
    // Gérer les boutons précédent
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.form-step.active');
            const prevStepNumber = this.getAttribute('data-prev');
            const prevStep = document.querySelector(`.form-step[data-step="${prevStepNumber}"]`);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            
            // Mettre à jour la barre de progression
            updateProgressBar(prevStepNumber);
        });
    });
    
    // Mettre à jour la barre de progression
    function updateProgressBar(stepNumber) {
        progressSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) <= parseInt(stepNumber)) {
                step.classList.add('active');
            }
        });
    }
    
    // Valider une étape
    function validateStep(stepNumber) {
        const currentStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const inputs = currentStep.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#e0e0e0';
            }
            
            // Validation spécifique pour l'email
            if (input.type === 'email' && input.value.trim()) {
                if (!isValidEmail(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    showMessage('Veuillez saisir une adresse email valide.', 'error');
                }
            }
            
            // Validation des mots de passe
            if (input.id === 'confirm-password' && input.value.trim()) {
                const password = document.getElementById('password').value;
                if (input.value !== password) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    showMessage('Les mots de passe ne correspondent pas.', 'error');
                }
            }
        });
        
        if (!isValid) {
            showMessage('Veuillez remplir correctement tous les champs obligatoires.', 'error');
        }
        
        return isValid;
    }
    
    // Initialiser les sélecteurs de date
    function initializeDateSelectors() {
        const daySelect = document.getElementById('birth-day');
        const monthSelect = document.getElementById('birth-month');
        const yearSelect = document.getElementById('birth-year');
        
        // Remplir les jours (1-31)
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            daySelect.appendChild(option);
        }
        
        // Remplir les mois
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        
        // Remplir les années (1900-année actuelle)
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1900; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    }
    
    // Basculer la visibilité des mots de passe
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, this);
        });
    }
    
    function togglePasswordVisibility(input, button) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Changer l'icône
        const icon = button.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
    
    // Indicateur de force du mot de passe
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    function checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength');
        const strengthFill = document.querySelector('.strength-fill');
        const strengthLabel = document.getElementById('strength-label');
        
        if (!strengthBar || !strengthFill || !strengthLabel) return;
        
        let strength = 0;
        let feedback = '';
        
        // Longueur minimale
        if (password.length >= 8) strength++;
        // Contient des minuscules
        if (/[a-z]/.test(password)) strength++;
        // Contient des majuscules
        if (/[A-Z]/.test(password)) strength++;
        // Contient des chiffres
        if (/[0-9]/.test(password)) strength++;
        // Contient des caractères spéciaux
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Mettre à jour l'affichage
        strengthBar.className = 'password-strength';
        if (strength <= 2) {
            strengthBar.classList.add('strength-weak');
            feedback = 'Faible';
        } else if (strength <= 4) {
            strengthBar.classList.add('strength-medium');
            feedback = 'Moyen';
        } else {
            strengthBar.classList.add('strength-strong');
            feedback = 'Fort';
        }
        
        strengthLabel.textContent = feedback;
    }
    
    // Soumission du formulaire
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Valider la dernière étape
            if (validateStep('3')) {
                // Récupérer les données du formulaire
                const formData = {
                    firstname: document.getElementById('firstname').value,
                    lastname: document.getElementById('lastname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    birthDate: {
                        day: document.getElementById('birth-day').value,
                        month: document.getElementById('birth-month').value,
                        year: document.getElementById('birth-year').value
                    },
                    newsletter: document.getElementById('newsletter').checked
                };
                
                // Simulation d'enregistrement
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
                submitBtn.disabled = true;
                
                // Simulation d'un délai de traitement
                setTimeout(() => {
                    showMessage('Compte créé avec succès! Redirection...', 'success');
                    
                    // Redirection après un délai
                    setTimeout(() => {
                        window.location.href = '/mon-compte/';
                    }, 2000);
                    
                }, 2000);
            }
        });
    }
    
    // Mettre à jour le résumé
    function updateSummary() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) return;
        
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const newsletter = document.getElementById('newsletter').checked;
        
        summaryContent.innerHTML = `
            <p><strong>Nom:</strong> ${firstname} ${lastname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
            <p><strong>Newsletter:</strong> ${newsletter ? 'Oui' : 'Non'}</p>
        `;
    }
    
    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            max-width: 300px;
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


    document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  if (!registerForm) return;

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    const data = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Compte créé avec succès !");
        window.location.href = "/login/"; // redirection vers la page de connexion
      } else {
        alert("⚠️ " + (result.detail || "Erreur lors de la création du compte."));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau, veuillez réessayer plus tard.");
    }
  });
});

});