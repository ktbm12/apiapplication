document.addEventListener('DOMContentLoaded', function() {
    // Toggle Sidebar
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Fermer le sidebar en cliquant sur un lien (mobile)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992 && sidebar) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });

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

    // Fonction utilitaire pour les graphiques
    window.createLineChart = function(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const defaultOptions = {
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
        };
        
        return new Chart(ctx, {
            type: 'line',
            data: data,
            options: { ...defaultOptions, ...options }
        });
    };

    window.createDoughnutChart = function(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const defaultOptions = {
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
        };
        
        return new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: { ...defaultOptions, ...options }
        });
    };

    // Redimensionner les graphiques lors du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Cette fonction sera override par les pages spécifiques si nécessaire
        if (window.currentCharts) {
            window.currentCharts.forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }
    });
});