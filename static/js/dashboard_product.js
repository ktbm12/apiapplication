// Dashboard Product Management JavaScript
// Variables globales
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 10;
let productToDelete = null;

// Configuration API
const API_URL = "http://127.0.0.1:9000/api/catalogue/products/";
const CATEGORIES_URL = "http://127.0.0.1:9000/api/catalogue/categories/";

// 🔹 Fonction pour obtenir le CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// 🔹 Gestion du formulaire
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    loadCategories();
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('productForm').reset();
}

// 🔹 Charger les catégories pour le formulaire
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const categories = await response.json();
        const categorySelect = document.getElementById('category');
        
        categorySelect.innerHTML = '<option value="">Sélectionnez une catégorie</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories :', error);
    }
}

// 🔹 Charger les produits
async function loadProducts() {
    const tableBody = document.getElementById('productsTable');
    showLoadingState(tableBody);

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        currentProducts = data;
        
        // Si pas de données, utiliser des données de démonstration
        if (!data || data.length === 0) {
            console.log('Aucune donnée reçue, utilisation de données de démonstration');
            currentProducts = getDemoProducts();
        }
        
        updateStats(currentProducts);
        renderProductsTable(currentProducts);
        setupPagination(currentProducts);
        updateCharts(currentProducts);
        updateActivityFeed(currentProducts);
        
    } catch (error) {
        console.error('Erreur lors du chargement :', error);
        console.log('Utilisation de données de démonstration en cas d\'erreur');
        
        // En cas d'erreur, utiliser des données de démonstration
        currentProducts = getDemoProducts();
        updateStats(currentProducts);
        renderProductsTable(currentProducts);
        setupPagination(currentProducts);
        updateCharts(currentProducts);
        updateActivityFeed(currentProducts);
    }
}

// 🔹 Données de démonstration pour les graphiques
function getDemoProducts() {
    return [
        {
            id: 1,
            title: "iPhone 15 Pro Max",
            price: 1199.99,
            stock: 25,
            category_name: "Électronique",
            description: "Le dernier iPhone avec toutes les fonctionnalités",
            is_active: true,
            created: new Date().toISOString()
        },
        {
            id: 2,
            title: "MacBook Pro M3",
            price: 2499.99,
            stock: 15,
            category_name: "Électronique",
            description: "Ordinateur portable professionnel",
            is_active: true,
            created: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 3,
            title: "Nike Air Max",
            price: 129.99,
            stock: 50,
            category_name: "Mode",
            description: "Chaussures de sport confortables",
            is_active: true,
            created: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: 4,
            title: "Samsung Galaxy S24",
            price: 899.99,
            stock: 8,
            category_name: "Électronique",
            description: "Smartphone Android haut de gamme",
            is_active: true,
            created: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: 5,
            title: "Adidas T-Shirt",
            price: 29.99,
            stock: 100,
            category_name: "Mode",
            description: "T-shirt de sport en coton",
            is_active: true,
            created: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: 6,
            title: "Sony WH-1000XM5",
            price: 399.99,
            stock: 3,
            category_name: "Électronique",
            description: "Casque audio sans fil avec réduction de bruit",
            is_active: true,
            created: new Date(Date.now() - 432000000).toISOString()
        },
        {
            id: 7,
            title: "Levi's Jeans",
            price: 89.99,
            stock: 75,
            category_name: "Mode",
            description: "Jeans classique en denim",
            is_active: true,
            created: new Date(Date.now() - 518400000).toISOString()
        },
        {
            id: 8,
            title: "iPad Air",
            price: 599.99,
            stock: 20,
            category_name: "Électronique",
            description: "Tablette Apple polyvalente",
            is_active: true,
            created: new Date(Date.now() - 604800000).toISOString()
        }
    ];
}

// 🔹 États d'affichage
function showLoadingState(container) {
    container.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    <span>Chargement des produits...</span>
                </div>
            </td>
        </tr>
    `;
}

function showErrorState(container, message) {
    container.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span>${message}</span>
                </div>
            </td>
        </tr>
    `;
}

// 🔹 Mettre à jour les statistiques
function updateStats(products) {
    document.getElementById('totalProducts').textContent = products.length;
    
    const activeProducts = products.filter(p => p.is_active !== false).length;
    document.getElementById('activeProducts').textContent = activeProducts;
    
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    document.getElementById('lowStockProducts').textContent = lowStockProducts;
    
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    document.getElementById('totalValue').textContent = `${totalValue.toLocaleString()}€`;
}

// 🔹 Afficher les produits dans le tableau
function renderProductsTable(products) {
    const tableBody = document.getElementById('productsTable');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filtrer les produits
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm))
    );
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-box mr-2"></i>
                        <span>Aucun produit trouvé</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    
    tableBody.innerHTML = paginatedProducts.map(product => `
        <tr class="hover:bg-gray-50 transition-colors duration-200">
            <td><strong class="text-blue-600">#${product.id}</strong></td>
            <td>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        ${product.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="font-semibold text-gray-900">${product.title}</div>
                        <div class="text-sm text-gray-500">${product.description ? product.description.substring(0, 50) + '...' : 'Aucune description'}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    ${product.category_name || 'Non catégorisé'}
                </span>
            </td>
            <td>
                <span class="font-semibold text-green-600">${product.price}€</span>
            </td>
            <td>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${product.stock < 10 ? 'bg-red-100 text-red-800' : product.stock < 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="status-${product.is_active === false ? 'inactive' : 'active'}">
                    ${product.is_active === false ? 'Inactif' : 'Actif'}
                </span>
            </td>
            <td>
                <div class="flex gap-2 justify-center">
                    <button class="btn-secondary btn-sm" onclick="editProduct(${product.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger btn-sm" onclick="confirmDelete(${product.id}, '${product.title.replace(/'/g, "\\'")}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Mettre à jour les informations de pagination
    document.getElementById('showingCount').textContent = paginatedProducts.length;
    document.getElementById('totalCount').textContent = filteredProducts.length;
}

// 🔹 Configuration de la pagination
function setupPagination(products) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm))
    );
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentPageSpan = document.getElementById('currentPage');
    
    currentPageSpan.textContent = currentPage;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderProductsTable(products);
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProductsTable(products);
        }
    };
}

// 🔹 Graphiques
function updateCharts(products) {
    // Vérifier que Chart.js est disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js n\'est pas chargé');
        return;
    }

    // Graphique de répartition par catégorie
    const categoryCanvas = document.getElementById('categoryChart');
    if (!categoryCanvas) {
        console.error('Élément categoryChart non trouvé');
        return;
    }

    const categoryCtx = categoryCanvas.getContext('2d');
    const categoryData = {};
    
    products.forEach(product => {
        const category = product.category_name || 'Non catégorisé';
        categoryData[category] = (categoryData[category] || 0) + 1;
    });
    
    const categoryChartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
            ],
            borderWidth: 0
        }]
    };
    
    // Détruire le graphique existant s'il existe
    if (window.categoryChart) {
        window.categoryChart.destroy();
    }
    
    try {
        window.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: categoryChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        console.log('Graphique de catégories créé avec succès');
    } catch (error) {
        console.error('Erreur lors de la création du graphique de catégories:', error);
    }

    // Graphique d'évolution des prix
    const priceCanvas = document.getElementById('priceChart');
    if (!priceCanvas) {
        console.error('Élément priceChart non trouvé');
        return;
    }

    const priceCtx = priceCanvas.getContext('2d');
    const sortedProducts = products.sort((a, b) => a.price - b.price).slice(0, 10);
    
    const priceChartData = {
        labels: sortedProducts.map(p => p.title.substring(0, 15) + '...'),
        datasets: [{
            label: 'Prix (€)',
            data: sortedProducts.map(p => p.price),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 2
        }]
    };
    
    // Détruire le graphique existant s'il existe
    if (window.priceChart) {
        window.priceChart.destroy();
    }
    
    try {
        window.priceChart = new Chart(priceCtx, {
            type: 'bar',
            data: priceChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        console.log('Graphique de prix créé avec succès');
    } catch (error) {
        console.error('Erreur lors de la création du graphique de prix:', error);
    }
}

// 🔹 Mettre à jour le flux d'activité
function updateActivityFeed(products) {
    const activityContainer = document.getElementById('productActivity');
    const recentProducts = products
        .sort((a, b) => new Date(b.created || b.date_created) - new Date(a.created || a.date_created))
        .slice(0, 5);
    
    if (recentProducts.length === 0) {
        activityContainer.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon product">
                    <i class="fas fa-box"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">Aucune activité récente</div>
                    <div class="activity-time">--</div>
                </div>
            </div>
        `;
        return;
    }
    
    activityContainer.innerHTML = recentProducts.map(product => `
        <div class="activity-item">
            <div class="activity-icon product">
                <i class="fas fa-box"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">Nouveau produit ajouté: <strong>${product.title}</strong></div>
                <div class="activity-time">${formatTimeAgo(new Date(product.created || product.date_created))}</div>
            </div>
        </div>
    `).join('');
}

// 🔹 Formatage du temps
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR');
}

// 🔹 Ajouter un produit
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    const formData = new FormData(form);
    const productData = {
        title: formData.get('title'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category'),
        description: formData.get('description')
    };

    if (!productData.title || !productData.price || !productData.stock || !productData.category) {
        showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
    }

    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Ajout en cours...';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            form.reset();
            hideAddForm();
            await loadProducts();
            showNotification('Produit ajouté avec succès!', 'success');
        } else {
            const err = await response.json();
            showNotification('Erreur: ' + JSON.stringify(err), 'error');
        }
    } catch (error) {
        console.error("Erreur d'ajout :", error);
        showNotification("Impossible d'ajouter le produit.", 'error');
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// 🔹 Confirmer la suppression
function confirmDelete(id, title) {
    productToDelete = id;
    document.getElementById('deleteProductName').textContent = title;
    document.getElementById('deleteModal').style.display = 'flex';
    
    document.getElementById('confirmDeleteBtn').onclick = performDelete;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    productToDelete = null;
}

// 🔹 Supprimer un produit
async function performDelete() {
    if (!productToDelete) return;

    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const originalText = deleteBtn.innerHTML;
    
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Suppression...';

    try {
        const response = await fetch(`${API_URL}${productToDelete}/`, { 
            method: "DELETE",
            headers: { "X-CSRFToken": csrftoken }
        });
        
        if (response.ok) {
            closeDeleteModal();
            await loadProducts();
            showNotification('Produit supprimé avec succès!', 'success');
        } else {
            showNotification('Erreur lors de la suppression.', 'error');
        }
    } catch (error) {
        console.error("Erreur suppression :", error);
        showNotification("Impossible de supprimer le produit.", 'error');
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = originalText;
    }
}

// 🔹 Éditer un produit
function editProduct(id) {
    showNotification('Fonctionnalité d\'édition à implémenter', 'info');
    // À implémenter selon vos besoins
}

// 🔹 Exporter les produits
function exportProducts() {
    showNotification('Fonctionnalité d\'export à implémenter', 'info');
    // À implémenter selon vos besoins
}

// 🔹 Mettre à jour le graphique
function updateCategoryChart() {
    console.log('Mise à jour du graphique des catégories');
    // À implémenter selon vos besoins
}

// 🔹 Recherche en temps réel
document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    renderProductsTable(currentProducts);
    setupPagination(currentProducts);
});

// 🔹 Système de notification
function showNotification(message, type = 'info') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm transform translate-x-full opacity-0 transition-all duration-300`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const colorMap = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600'
    };
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${iconMap[type]} ${colorMap[type]}"></i>
            <span class="text-gray-800">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// 🔹 Initialisation des graphiques avec délai
function initializeCharts() {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
        if (currentProducts && currentProducts.length > 0) {
            updateCharts(currentProducts);
        } else {
            // Utiliser des données de démonstration pour initialiser les graphiques
            const demoProducts = getDemoProducts();
            updateCharts(demoProducts);
        }
    }, 500);
}

// 🔹 Vérifier que Chart.js est chargé
function checkChartJS() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js n\'est pas chargé. Vérifiez que le script est inclus dans le template de base.');
        return false;
    }
    console.log('Chart.js chargé avec succès, version:', Chart.version);
    return true;
}

// Charger les produits au démarrage
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    
    // Vérifier Chart.js
    if (checkChartJS()) {
        // Charger les produits
        loadProducts();
        
        // Initialiser les graphiques avec un délai
        initializeCharts();
    } else {
        console.error('Impossible d\'initialiser les graphiques sans Chart.js');
        // Charger quand même les produits sans graphiques
        loadProducts();
    }
});

// Stocker les graphiques pour le redimensionnement
window.currentCharts = [];