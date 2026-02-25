// MedVoice Sidebar Component
// Renders the sidebar navigation into any page

(function () {
    var currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    function isActive(page) {
        return currentPage === page ? 'active' : '';
    }

    // Build sidebar HTML
    var sidebarHTML = `
    <div class="sidebar" id="app-sidebar">
        <div class="sidebar-header">
            <a href="dashboard.html" class="sidebar-logo">
                <span class="sidebar-logo-icon">🧠</span>
                <span class="sidebar-logo-text">MedVoice</span>
            </a>
            <button class="sidebar-toggle-btn" onclick="toggleSidebar()" aria-label="Toggle sidebar">
                <div class="hamburger-icon"><span></span><span></span><span></span></div>
            </button>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-section-title">Main</div>
            <a href="dashboard.html" class="sidebar-link ${isActive('dashboard.html')}" data-tooltip="Dashboard">
                <span class="sidebar-link-icon">📊</span>
                <span class="sidebar-link-text">Dashboard</span>
            </a>
            <a href="learn.html" class="sidebar-link ${isActive('learn.html')}" data-tooltip="Study Studio">
                <span class="sidebar-link-icon">🧬</span>
                <span class="sidebar-link-text">Study Studio</span>
            </a>
            <a href="clinical-sim.html" class="sidebar-link ${isActive('clinical-sim.html')}" data-tooltip="Clinical Sim">
                <span class="sidebar-link-icon">🏥</span>
                <span class="sidebar-link-text">Clinical Sim</span>
            </a>

            <div class="nav-section-title">Manage</div>
            <a href="mission-control.html" class="sidebar-link ${isActive('mission-control.html')}" data-tooltip="Mission Control">
                <span class="sidebar-link-icon">🎯</span>
                <span class="sidebar-link-text">Mission Control</span>
            </a>
        </nav>

        <div class="sidebar-progress-card" id="sidebar-progress">
            <div class="progress-main-row">
                <div>
                    <div class="progress-percent-big" id="sp-pct">0%</div>
                    <div class="progress-label">Overall Mastery</div>
                </div>
            </div>
            <div class="progress-track">
                <div class="progress-track-fill" id="sp-bar" style="width: 0%"></div>
            </div>
            <div class="progress-mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-icon">✅</span>
                    <div>
                        <div class="mini-stat-value" id="sp-mastered">0</div>
                        <div class="mini-stat-label">Mastered</div>
                    </div>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-icon">📚</span>
                    <div>
                        <div class="mini-stat-value" id="sp-total">0</div>
                        <div class="mini-stat-label">Topics</div>
                    </div>
                </div>
            </div>
            <a href="learn.html" class="progress-action-btn">Continue Learning →</a>
        </div>

        <div class="sidebar-footer">
            <div class="user-info-widget" onclick="window.location.href='mission-control.html'" style="cursor:pointer;">
                <div class="user-avatar-widget" id="sp-avatar">🩺</div>
                <div class="user-details-widget">
                    <div class="user-name-widget" id="sp-name">Dr. Future</div>
                    <div class="user-role-widget" id="sp-role">2nd Year MBBS</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Header -->
    <div class="mobile-header">
        <a href="dashboard.html" class="mobile-header-logo">🧠 MedVoice</a>
        <button class="mobile-hamburger" onclick="openMobileSidebar()" aria-label="Open menu">☰</button>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="closeMobileSidebar()"></div>
    `;

    // Inject at start of body
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Populate sidebar stats from localStorage
    var curriculum = window.safeJsonParse ? window.safeJsonParse('medvoice_curriculum', []) : [];
    var allTopics = curriculum.flatMap(function (s) { return s.units.flatMap(function (u) { return u.topics; }); });
    var mastered = allTopics.filter(function (t) { return t.status === 'Mastered'; }).length;
    var total = allTopics.length;
    var pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    var pctEl = document.getElementById('sp-pct');
    var barEl = document.getElementById('sp-bar');
    var masteredEl = document.getElementById('sp-mastered');
    var totalEl = document.getElementById('sp-total');
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.style.width = pct + '%';
    if (masteredEl) masteredEl.textContent = mastered;
    if (totalEl) totalEl.textContent = total;

    // User info
    var userData = window.safeJsonParse ? window.safeJsonParse('medvoice_user', null) : null;
    if (userData) {
        var nameEl = document.getElementById('sp-name');
        var roleEl = document.getElementById('sp-role');
        if (nameEl) nameEl.textContent = userData.name || 'Dr. Future';
        if (roleEl) roleEl.textContent = userData.year || '2nd Year MBBS';
    }

    // Restore collapsed state
    if (localStorage.getItem('medvoice_sidebar_collapsed') === 'true') {
        var sidebar = document.getElementById('app-sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
    }

    // Toggle sidebar
    window.toggleSidebar = function () {
        var sidebar = document.getElementById('app-sidebar');
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('medvoice_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    };

    // Mobile sidebar
    window.openMobileSidebar = function () {
        document.getElementById('app-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('active');
    };
    window.closeMobileSidebar = function () {
        document.getElementById('app-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
    };
})();
