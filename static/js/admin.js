
   
    
        document.addEventListener('DOMContentLoaded', function() {
            // Toggle Sidebar
            const toggleSidebar = document.querySelector('.toggle-sidebar');
            const sidebar = document.querySelector('.admin-sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            toggleSidebar.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });

            // Fermer le sidebar en cliquant sur un lien (mobile)
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 992) {
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                });
            });

            // Graphique des ventes
            const salesCtx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'Chiffre d\'affaires (€)',
                        data: [18500, 19200, 21000, 19800, 22500, 24000, 25800, 24500, 26200, 27800, 24580, 26500],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
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
                            },
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString('fr-FR') + ' €';
                                }
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

            // Graphique des catégories
            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            const categoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Mode Femme', 'Mode Homme', 'Électronique', 'Maison', 'Beauté'],
                    datasets: [{
                        data: [35, 25, 20, 12, 8],
                        backgroundColor: [
                            '#e74c3c',
                            '#3498db',
                            '#27ae60',
                            '#f39c12',
                            '#9b59b6'
                        ],
                        borderWidth: 0
                    }]
                },
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

            // Redimensionner les graphiques lors du redimensionnement de la fenêtre
            window.addEventListener('resize', function() {
                salesChart.resize();
                categoryChart.resize();
            });

            // Simulation de données en temps réel
            function updateStats() {
                // Cette fonction pourrait être connectée à une API en temps réel
                console.log('Mise à jour des statistiques...');
            }

            // Mettre à jour les stats toutes les 30 secondes
            setInterval(updateStats, 30000);

            // Gestion des notifications
            const notificationIcons = document.querySelectorAll('.header-icon');
            notificationIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    const badge = this.querySelector('.icon-badge');
                    if (badge) {
                        badge.style.display = 'none';
                    }
                });
            });
        });
    