// Dashboard Images Management JavaScript
// Variables globales
let currentImages = [];
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 12;
let imageToDelete = null;

// Configuration API
const API_URL = "http://127.0.0.1:9000/api/catalogue/product-images/";
const PRODUCTS_URL = "http://127.0.0.1:9000/api/catalogue/products/";

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
function showAddImageForm() {
    document.getElementById('addImageForm').style.display = 'block';
    loadProducts();
}

function hideAddImageForm() {
    document.getElementById('addImageForm').style.display = 'none';
    document.getElementById('imageUploadForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
}

// 🔹 Charger les produits pour les sélecteurs
async function loadProducts() {
    try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const products = await response.json();
        currentProducts = products;
        
        // Remplir le sélecteur du formulaire
        const productSelect = document.getElementById('productSelect');
        productSelect.innerHTML = '<option value="">Choisir un produit...</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.title;
            productSelect.appendChild(option);
        });
        
        // Remplir le filtre
        const productFilter = document.getElementById('productFilter');
        productFilter.innerHTML = '<option value="">Tous les produits</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.title;
            productFilter.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
        showNotification('Erreur lors du chargement des produits', 'error');
    }
}

// 🔹 Prévisualisation des images
function previewImages(input) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (input.files && input.files.length > 0) {
        preview.style.display = 'grid';
        
        Array.from(input.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="image-preview-remove" onclick="removePreviewImage(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    } else {
        preview.style.display = 'none';
    }
}

// 🔹 Supprimer une image de prévisualisation
function removePreviewImage(button) {
    button.parentElement.remove();
    
    // Vérifier s'il reste des images
    const preview = document.getElementById('imagePreview');
    if (preview.children.length === 0) {
        preview.style.display = 'none';
    }
}

// 🔹 Charger les images
async function loadImages() {
    const imagesGrid = document.getElementById('imagesGrid');
    showLoadingState(imagesGrid);

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        currentImages = data;
        
        updateStats(data);
        renderImagesGrid(data);
        setupPagination(data);
        
    } catch (error) {
        console.error('Erreur lors du chargement :', error);
        showErrorState(imagesGrid, 'Erreur lors du chargement des images');
    }
}

// 🔹 États d'affichage
function showLoadingState(container) {
    container.innerHTML = `
        <div class="loading-state col-span-full">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            <span>Chargement des images...</span>
        </div>
    `;
}

function showErrorState(container, message) {
    container.innerHTML = `
        <div class="error-state col-span-full">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
}

// 🔹 Mettre à jour les statistiques
function updateStats(images) {
    document.getElementById('totalImages').textContent = images.length;
    
    const mainImages = images.filter(img => img.is_main).length;
    document.getElementById('mainImages').textContent = mainImages;
    
    const productsWithImages = new Set(images.map(img => img.product)).size;
    document.getElementById('productsWithImages').textContent = productsWithImages;
    
    const productsWithoutImages = currentProducts.length - productsWithImages;
    document.getElementById('productsWithoutImages').textContent = productsWithoutImages;
}

// 🔹 Afficher les images dans la grille
function renderImagesGrid(images) {
    const imagesGrid = document.getElementById('imagesGrid');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productFilter = document.getElementById('productFilter').value;
    
    // Filtrer les images
    let filteredImages = images.filter(image => {
        const matchesSearch = image.product_title.toLowerCase().includes(searchTerm);
        const matchesFilter = !productFilter || image.product == productFilter;
        return matchesSearch && matchesFilter;
    });
    
    if (filteredImages.length === 0) {
        imagesGrid.innerHTML = `
            <div class="empty-state col-span-full">
                <i class="fas fa-images mr-2"></i>
                <span>Aucune image trouvée</span>
            </div>
        `;
        return;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);
    
    imagesGrid.innerHTML = paginatedImages.map(image => `
        <div class="image-card">
            <div class="image-container">
                <img src="${image.image_url}" alt="${image.alt_text || image.product_title}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
                <div class="image-overlay">
                    <div class="image-actions">
                        <button class="btn-secondary btn-sm" onclick="setMainImage(${image.id})" 
                                title="Définir comme principale" ${image.is_main ? 'disabled' : ''}>
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn-danger btn-sm" onclick="confirmDelete(${image.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="image-info">
                <div class="image-title">${image.product_title}</div>
                <div class="image-product">Produit ID: ${image.product}</div>
                <div class="image-meta">
                    <span class="image-status ${image.is_main ? 'status-main' : 'status-secondary'}">
                        ${image.is_main ? 'Principale' : 'Secondaire'}
                    </span>
                    <span>${formatDate(image.created)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour les informations de pagination
    document.getElementById('showingCount').textContent = paginatedImages.length;
    document.getElementById('totalCount').textContent = filteredImages.length;
}

// 🔹 Configuration de la pagination
function setupPagination(images) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productFilter = document.getElementById('productFilter').value;
    
    let filteredImages = images.filter(image => {
        const matchesSearch = image.product_title.toLowerCase().includes(searchTerm);
        const matchesFilter = !productFilter || image.product == productFilter;
        return matchesSearch && matchesFilter;
    });
    
    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentPageSpan = document.getElementById('currentPage');
    
    currentPageSpan.textContent = currentPage;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderImagesGrid(images);
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderImagesGrid(images);
        }
    };
}

// 🔹 Upload d'images
document.getElementById('imageUploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    const productId = document.getElementById('productSelect').value;
    const imageFiles = document.getElementById('imageFiles').files;
    const altText = document.getElementById('altText').value;
    const isMain = document.getElementById('isMain').checked;

    if (!productId || imageFiles.length === 0) {
        showNotification('Veuillez sélectionner un produit et au moins une image.', 'error');
        return;
    }

    // Désactiver le bouton pendant l'upload
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Upload en cours...';

    try {
        // Upload des images une par une
        const uploadPromises = Array.from(imageFiles).map(async (file, index) => {
            const formData = new FormData();
            formData.append('product', productId);
            formData.append('image', file);
            formData.append('alt_text', altText);
            formData.append('is_main', index === 0 && isMain); // Première image comme principale si demandé

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur upload image ${index + 1}`);
            }

            return response.json();
        });

        await Promise.all(uploadPromises);
        
        form.reset();
        hideAddImageForm();
        await loadImages();
        showNotification(`${imageFiles.length} image(s) uploadée(s) avec succès!`, 'success');
        
    } catch (error) {
        console.error("Erreur d'upload :", error);
        showNotification("Erreur lors de l'upload des images.", 'error');
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// 🔹 Définir une image comme principale
async function setMainImage(imageId) {
    try {
        const response = await fetch(`${API_URL}${imageId}/set_main/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
        });
        
        if (response.ok) {
            await loadImages();
            showNotification('Image définie comme principale!', 'success');
        } else {
            showNotification('Erreur lors de la mise à jour.', 'error');
        }
    } catch (error) {
        console.error("Erreur set main :", error);
        showNotification("Impossible de définir l'image comme principale.", 'error');
    }
}

// 🔹 Confirmer la suppression
function confirmDelete(id) {
    imageToDelete = id;
    document.getElementById('deleteModal').style.display = 'flex';
    
    document.getElementById('confirmDeleteBtn').onclick = performDelete;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    imageToDelete = null;
}

// 🔹 Supprimer une image
async function performDelete() {
    if (!imageToDelete) return;

    const deleteBtn = document.getElementById('confirmDeleteBtn');
    const originalText = deleteBtn.innerHTML;
    
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Suppression...';

    try {
        const response = await fetch(`${API_URL}${imageToDelete}/`, { 
            method: "DELETE",
            headers: { "X-CSRFToken": csrftoken }
        });
        
        if (response.ok) {
            closeDeleteModal();
            await loadImages();
            showNotification('Image supprimée avec succès!', 'success');
        } else {
            showNotification('Erreur lors de la suppression.', 'error');
        }
    } catch (error) {
        console.error("Erreur suppression :", error);
        showNotification("Impossible de supprimer l'image.", 'error');
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = originalText;
    }
}

// 🔹 Actualiser les images
function refreshImages() {
    currentPage = 1;
    loadImages();
}

// 🔹 Formatage de la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// 🔹 Recherche et filtrage en temps réel
document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    renderImagesGrid(currentImages);
    setupPagination(currentImages);
});

document.getElementById('productFilter').addEventListener('change', () => {
    currentPage = 1;
    renderImagesGrid(currentImages);
    setupPagination(currentImages);
});

// 🔹 Système de notification
function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la gestion des images...');
    loadProducts();
    loadImages();
});
