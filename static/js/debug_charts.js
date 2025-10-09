// Script de débogage pour les graphiques
console.log('=== DÉBOGAGE DES GRAPHIQUES ===');

// Vérifier Chart.js
console.log('Chart.js disponible:', typeof Chart !== 'undefined');
if (typeof Chart !== 'undefined') {
    console.log('Version Chart.js:', Chart.version);
}

// Vérifier les éléments canvas
const categoryCanvas = document.getElementById('categoryChart');
const priceCanvas = document.getElementById('priceChart');

console.log('Canvas categoryChart trouvé:', !!categoryCanvas);
console.log('Canvas priceChart trouvé:', !!priceCanvas);

if (categoryCanvas) {
    console.log('Dimensions categoryChart:', categoryCanvas.width, 'x', categoryCanvas.height);
}

if (priceCanvas) {
    console.log('Dimensions priceCanvas:', priceCanvas.width, 'x', priceCanvas.height);
}

// Vérifier les données
console.log('Données produits:', currentProducts);
console.log('Nombre de produits:', currentProducts ? currentProducts.length : 0);

// Fonction pour tester la création d'un graphique simple
function testSimpleChart() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js non disponible');
        return;
    }

    const testCanvas = document.createElement('canvas');
    testCanvas.id = 'testChart';
    testCanvas.width = 200;
    testCanvas.height = 200;
    document.body.appendChild(testCanvas);

    try {
        const ctx = testCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Test 1', 'Test 2'],
                datasets: [{
                    data: [30, 70],
                    backgroundColor: ['#FF6384', '#36A2EB']
                }]
            }
        });
        console.log('✅ Graphique de test créé avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de la création du graphique de test:', error);
    }
}

// Exécuter le test après un délai
setTimeout(testSimpleChart, 1000);

console.log('=== FIN DÉBOGAGE ===');
