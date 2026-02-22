// ===== CURRICULUM DATA ENGINE =====
function loadCurriculum() {
    return window.safeJsonParse('medvoice_curriculum', []);
}

function saveCurriculum(data) {
    localStorage.setItem('medvoice_curriculum', JSON.stringify(data));
}

// ===== ACCORDION RENDER ENGINE =====
function renderSyllabus() {
    const curriculum = loadCurriculum();
    const tree = document.getElementById('syllabus-tree');
    tree.innerHTML = '';

    if (curriculum.length === 0) {
        tree.innerHTML = `<div class="glass-card" style="text-align: center; padding: 48px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">📭</div>
            <h3 style="margin-bottom: 8px;">No subjects yet</h3>
            <p style="font-size: 0.85rem;">Click "Add Subject" to build your curriculum.</p>
        </div>`;
        return;
    }

    curriculum.forEach((sub, si) => {
        const totalTopics = sub.units.reduce((s, u) => s + u.topics.length, 0);
        const mastered = sub.units.reduce((s, u) => s + u.topics.filter(t => t.status === 'Mastered').length, 0);
        const progress = totalTopics > 0 ? Math.round((mastered / totalTopics) * 100) : 0;
        const isMastered = progress >= 80;
        const accentColor = isMastered ? '#14b8a6' : '#0ea5e9';

        const card = document.createElement('div');
        card.className = 'glass-card subject-card';

        // Subject Header
        let html = `
        <div onclick="toggleUnits(${si})" style="display: flex; align-items: center; gap: 16px;">
            <div style="position: relative; width: 56px; height: 56px; flex-shrink: 0;">
                <svg viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="${accentColor}" stroke-width="3" stroke-dasharray="${progress}, 100" stroke-linecap="round"/>
                </svg>
                <span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700;">${progress}%</span>
            </div>
            <div style="flex: 1;">
                <h3 style="margin-bottom: 2px;">${sub.subject}</h3>
                <p style="font-size: 0.8rem;">${sub.units.length} Units · ${totalTopics} Topics</p>
            </div>
            ${isMastered
                ? '<span class="status-badge mastered">Mastered</span>'
                : progress > 0
                    ? '<span class="status-badge in-progress">In Progress</span>'
                    : '<span class="status-badge locked">New</span>'
            }
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--text-muted)" fill="none" stroke-width="2" style="transition: transform 0.3s;" id="chevron-${si}"><polyline points="6 9 12 15 18 9"/></svg>
        </div>`;

        // Units (hidden initially)
        html += `<div id="units-${si}" style="display: none; margin-top: 16px; padding-left: 12px; border-left: 2px solid rgba(255,255,255,0.06); flex-direction: column; gap: 10px;">`;

        sub.units.forEach(unit => {
            const unitMastered = unit.topics.length > 0 && unit.topics.every(t => t.status === 'Mastered');
            const unitLocked = unit.topics.length > 0 && unit.topics.every(t => t.status === 'Locked');

            const badge = unitMastered ? '<span class="status-badge mastered" style="font-size:0.6rem;">MASTERED</span>'
                : unitLocked ? '<span class="status-badge locked" style="font-size:0.6rem;">LOCKED</span>'
                    : '<span class="status-badge in-progress" style="font-size:0.6rem;">LEARNING</span>';

            const bg = unitLocked ? 'rgba(0,0,0,0.15)' : unitMastered ? 'rgba(20,184,166,0.06)' : 'rgba(14,165,233,0.04)';
            const border = unitLocked ? 'transparent' : unitMastered ? 'rgba(20,184,166,0.15)' : 'rgba(14,165,233,0.1)';
            const opacity = unitLocked ? 'opacity: 0.45;' : '';

            html += `<div class="unit-block" style="padding: 12px; background: ${bg}; border-radius: 10px; border: 1px solid ${border}; ${opacity}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="font-size: 0.9rem;">${unit.unit_name}</h4>
                    ${badge}
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">`;

            unit.topics.forEach(topic => {
                let scoreColor = 'var(--text-muted)';
                let scoreText = '—';
                let action = '';

                if (topic.status === 'Mastered') {
                    scoreColor = '#4ade80';
                    scoreText = topic.best_score + '%';
                } else if (topic.status === 'In-Progress') {
                    scoreColor = topic.best_score >= 80 ? '#4ade80' : '#f59e0b';
                    scoreText = topic.best_score + '%';
                    if (topic.best_score < 80 && topic.best_score > 0) {
                        action = '<a href="learn.html?topic=' + encodeURIComponent(topic.title) + '" class="btn btn-glass" style="padding: 3px 8px; font-size: 0.7rem; margin-left: 8px; text-decoration: none;">Revise</a>';
                    }
                }

                html += `<div class="topic-row">
                    <span>${topic.title}</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="color: ${scoreColor}; font-weight: 600;">${scoreText}</span>
                        ${action}
                    </div>
                </div>`;
            });

            if (unit.topics.length === 0) {
                html += `<div class="topic-row" style="color: var(--text-muted); font-style: italic;">No topics added yet</div>`;
            }

            html += `</div></div>`;
        });

        html += `</div>`;
        card.innerHTML = html;
        tree.appendChild(card);
    });

    // Ensure all unit panels start hidden
    document.querySelectorAll('[id^="units-"]').forEach(el => el.style.display = 'none');
}

function toggleUnits(idx) {
    const panel = document.getElementById(`units-${idx}`);
    const chevron = document.getElementById(`chevron-${idx}`);
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'flex';
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// ===== MODAL CONTROLS =====
function openModal() {
    const modal = document.getElementById('subject-modal');
    modal.style.display = 'flex';
    document.getElementById('modal-subject-name').value = '';
    document.getElementById('modal-units').value = '';
    document.getElementById('modal-error').style.display = 'none';
    document.getElementById('modal-bulk-text').value = '';
    switchTab('manual');
    setTimeout(() => document.getElementById('modal-subject-name').focus(), 100);
}

function closeModal() {
    document.getElementById('subject-modal').style.display = 'none';
}

function switchTab(tab) {
    document.getElementById('panel-manual').style.display = tab === 'manual' ? 'block' : 'none';
    document.getElementById('panel-bulk').style.display = tab === 'bulk' ? 'block' : 'none';
    document.getElementById('tab-manual').classList.toggle('active', tab === 'manual');
    document.getElementById('tab-bulk').classList.toggle('active', tab === 'bulk');
}

// ===== SUBMIT: Manual Entry =====
function submitManualSubject() {
    const name = document.getElementById('modal-subject-name').value.trim();
    const unitsRaw = document.getElementById('modal-units').value.trim();
    const errorEl = document.getElementById('modal-error');

    if (!name) {
        errorEl.textContent = '⚠️ Please enter a subject name.';
        errorEl.style.display = 'block';
        return;
    }

    const curriculum = loadCurriculum();
    if (curriculum.find(s => s.subject.toLowerCase() === name.toLowerCase())) {
        errorEl.textContent = `⚠️ "${name}" already exists in your curriculum.`;
        errorEl.style.display = 'block';
        return;
    }

    const units = unitsRaw
        ? unitsRaw.split(',').map(u => ({ unit_name: u.trim(), topics: [] })).filter(u => u.unit_name)
        : [];

    curriculum.push({ subject: name, progress: 0, avgScore: 0, units });
    saveCurriculum(curriculum);
    renderSyllabus();
    updateOverviewStats();
    closeModal();
    window.showToast('✅ Subject added to curriculum');
}

// ===== SUBMIT: Bulk Ingest (Smart Parser) =====
function submitBulkIngest() {
    const text = document.getElementById('modal-bulk-text').value.trim();
    if (!text) return;

    const curriculum = loadCurriculum();
    let currentSubject = null;
    let currentUnit = null;

    text.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const indent = line.search(/\S/);

        if (indent === 0 && !trimmed.startsWith('-') && !trimmed.match(/^Unit/i)) {
            // Subject level
            const existing = curriculum.find(s => s.subject.toLowerCase() === trimmed.toLowerCase());
            if (existing) {
                currentSubject = existing;
            } else {
                currentSubject = { subject: trimmed, progress: 0, avgScore: 0, units: [] };
                curriculum.push(currentSubject);
            }
            currentUnit = null;
        } else if (currentSubject && (trimmed.match(/^Unit/i) || (indent >= 2 && indent <= 4 && !trimmed.startsWith('-')))) {
            // Unit level
            const unitName = trimmed.replace(/^Unit\s*\d*:?\s*/i, '');
            currentUnit = { unit_name: unitName, topics: [] };
            currentSubject.units.push(currentUnit);
        } else if (currentUnit && trimmed.startsWith('-')) {
            // Topic level
            const topicName = trimmed.replace(/^-\s*/, '');
            currentUnit.topics.push({ title: topicName, status: 'Locked', best_score: 0 });
        }
    });

    saveCurriculum(curriculum);
    renderSyllabus();
    updateOverviewStats();
    closeModal();
    window.showToast('✅ Subject added to curriculum');
}

// ===== OVERVIEW STATS =====
function updateOverviewStats() {
    const curriculum = loadCurriculum();
    const allTopics = curriculum.flatMap(s => s.units.flatMap(u => u.topics));
    const mastered = allTopics.filter(t => t.status === 'Mastered').length;
    const total = allTopics.length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    const masteredEl = document.querySelector('[data-stat="mastered"]');
    const subjectsEl = document.querySelector('[data-stat="subjects"]');
    const progressEl = document.querySelector('[data-stat="progress"]');

    if (masteredEl) masteredEl.textContent = `${mastered} / ${total}`;
    if (subjectsEl) subjectsEl.textContent = curriculum.length;
    if (progressEl) progressEl.style.width = `${pct}%`;
}

// ===== PROFILE =====
function toggleEditProfile() {
    const form = document.getElementById('edit-profile-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function saveProfile() {
    const name = document.getElementById('input-name').value;
    const year = document.getElementById('input-year').value;
    const lang = document.getElementById('input-language').value;
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-school').textContent = year;
    // Merge with existing data to preserve weaknessRadar, streak, etc.
    const existing = window.safeJsonParse('medvoice_user', {});
    const updated = Object.assign({}, existing, { name: name, year: year, language: lang });
    localStorage.setItem('medvoice_user', JSON.stringify(updated));
    toggleEditProfile();
}

// Close modal on backdrop click
document.getElementById('subject-modal')?.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    const data = window.safeJsonParse('medvoice_user', null);
    if (data) {
        document.getElementById('profile-name').textContent = data.name || 'Dr. Future';
        document.getElementById('profile-school').textContent = data.year || '2nd Year MBBS';
        document.getElementById('input-name').value = data.name || '';
        document.getElementById('input-year').value = data.year || '2nd Year MBBS';
        document.getElementById('input-language').value = data.language || 'Hinglish';
    }
    renderSyllabus();
    updateOverviewStats();
});