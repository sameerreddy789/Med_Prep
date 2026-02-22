// MedVoice Main App — Seeds default data if localStorage is empty
console.log('MedVoice App Main loaded');

(function seedDefaults() {
    var DEFAULT_CURRICULUM = [
        {
            subject: "Anatomy", progress: 45, avgScore: 72,
            units: [
                { unit_name: "Upper Limb", topics: [
                    { title: "Brachial Plexus", status: "Mastered", best_score: 90 },
                    { title: "Axillary Artery", status: "Mastered", best_score: 85 }
                ]},
                { unit_name: "Thorax", topics: [
                    { title: "Cardiac Cycle", status: "In-Progress", best_score: 60 },
                    { title: "Lungs & Mediastinum", status: "Locked", best_score: 0 }
                ]},
                { unit_name: "Abdomen", topics: [
                    { title: "GI Tract Overview", status: "Locked", best_score: 0 }
                ]}
            ]
        },
        {
            subject: "Physiology", progress: 20, avgScore: 50,
            units: [
                { unit_name: "General Physiology", topics: [
                    { title: "Cell Membrane Transport", status: "In-Progress", best_score: 50 }
                ]}
            ]
        }
    ];

    var DEFAULT_USER = {
        name: "Dr. Future",
        year: "2nd Year MBBS",
        language: "Hinglish",
        weaknessRadar: [],
        recentTopics: [],
        streak: 0,
        totalScore: 0
    };

    if (!localStorage.getItem('medvoice_curriculum')) {
        localStorage.setItem('medvoice_curriculum', JSON.stringify(DEFAULT_CURRICULUM));
    }
    if (!localStorage.getItem('medvoice_user')) {
        localStorage.setItem('medvoice_user', JSON.stringify(DEFAULT_USER));
    }
})();

// Safe JSON parse helper exposed globally
window.safeJsonParse = function(key, fallback) {
    try {
        var stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
        console.error('Corrupt localStorage for key:', key, e);
        localStorage.removeItem(key);
        return fallback;
    }
};

// ===== TOAST NOTIFICATION SYSTEM =====
(function() {
    var container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);

    window.showToast = function(message, type) {
        var toast = document.createElement('div');
        toast.className = 'toast ' + (type || 'info');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    };
})();

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        var modal = document.getElementById('subject-modal');
        if (modal && modal.style.display === 'flex') {
            if (typeof closeModal === 'function') closeModal();
        }
    }
});

// ===== RESET DATA OPTION =====
window.resetMedVoiceData = function() {
    if (confirm('⚠️ This will clear all your progress, subjects, and profile data. Continue?')) {
        localStorage.removeItem('medvoice_curriculum');
        localStorage.removeItem('medvoice_user');
        localStorage.removeItem('medvoice_settings');
        localStorage.removeItem('medvoice_last_session');
        window.showToast('🗑️ All data cleared. Reloading...');
        setTimeout(function() { location.reload(); }, 1000);
    }
};

// ===== DARK/LIGHT THEME TOGGLE =====
(function() {
    // Restore saved theme
    var saved = localStorage.getItem('medvoice_theme');
    if (saved === 'light') document.body.classList.add('theme-light');

    // Inject toggle button into every nav
    var nav = document.querySelector('.nav-container');
    if (!nav) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light/dark theme');
    btn.textContent = document.body.classList.contains('theme-light') ? '🌙' : '☀️';

    // Insert before the last child (profile btn or end)
    var profileBtn = nav.querySelector('.nav-profile-btn');
    if (profileBtn) {
        nav.insertBefore(btn, profileBtn);
    } else {
        nav.appendChild(btn);
    }

    btn.addEventListener('click', function() {
        document.body.classList.toggle('theme-light');
        var isLight = document.body.classList.contains('theme-light');
        btn.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('medvoice_theme', isLight ? 'light' : 'dark');
    });
})();
