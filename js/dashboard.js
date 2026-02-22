// MedVoice Dashboard Logic
function loadCurriculum() {
    return window.safeJsonParse('medvoice_curriculum', []);
}

function init() {
    var curriculum = loadCurriculum();
    var allTopics = curriculum.flatMap(function(s) { return s.units.flatMap(function(u) { return u.topics; }); });
    var mastered = allTopics.filter(function(t) { return t.status === 'Mastered'; });
    var inProgress = allTopics.filter(function(t) { return t.status === 'In-Progress'; });
    var locked = allTopics.filter(function(t) { return t.status === 'Locked'; });

    // Greeting
    var userData = window.safeJsonParse('medvoice_user', null);
    if (userData) {
        document.getElementById('greeting').textContent = 'Hello, ' + (userData.name || 'Dr. Future') + ' 🩺';
    }

    // Curriculum Hero — find most active subject
    var activeSubject = curriculum[0];
    var maxActive = 0;
    curriculum.forEach(function(sub) {
        var active = sub.units.reduce(function(s, u) { return s + u.topics.filter(function(t) { return t.status === 'In-Progress'; }).length; }, 0);
        if (active > maxActive) { maxActive = active; activeSubject = sub; }
    });

    if (activeSubject) {
        var total = activeSubject.units.reduce(function(s, u) { return s + u.topics.length; }, 0);
        var done = activeSubject.units.reduce(function(s, u) { return s + u.topics.filter(function(t) { return t.status === 'Mastered'; }).length; }, 0);
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;
        document.getElementById('hero-subject').textContent = activeSubject.subject;
        document.getElementById('hero-pct').textContent = pct + '%';
        document.getElementById('hero-detail').textContent = done + '/' + total + ' topics mastered · ' + activeSubject.units.length + ' units';
        document.getElementById('hero-ring').setAttribute('stroke-dasharray', pct + ', 100');
        if (pct >= 80) document.getElementById('hero-ring').setAttribute('stroke', '#14b8a6');
    }

    // Stats
    document.getElementById('stat-mastered').textContent = mastered.length;
    document.getElementById('stat-progress').textContent = inProgress.length;
    document.getElementById('stat-subjects').textContent = curriculum.length;

    // Daily Mix
    var mixList = document.getElementById('daily-mix-list');
    var reviewTopics = inProgress.slice(0, 3);
    if (reviewTopics.length > 0) {
        reviewTopics.forEach(function(t) {
            var div = document.createElement('div');
            div.className = 'daily-mix-item';
            div.innerHTML = '<span>' + t.title + '</span><span class="mix-score">' + t.best_score + '%</span>';
            // Deep-link to learn page with topic
            div.style.cursor = 'pointer';
            div.addEventListener('click', function() {
                window.location.href = 'learn.html?topic=' + encodeURIComponent(t.title);
            });
            mixList.appendChild(div);
        });
        var est = document.createElement('p');
        est.className = 'mix-estimate';
        est.textContent = '⏱ Est. ' + (reviewTopics.length * 5) + ' min total';
        mixList.after(est);
    } else {
        mixList.innerHTML = '<p class="text-muted-sm">No reviews due today! 🎉</p>';
    }

    // Mastery Matrix
    var matrix = document.getElementById('mastery-matrix');
    curriculum.forEach(function(sub) {
        var topicsWithMeta = [];
        sub.units.forEach(function(u) {
            u.topics.forEach(function(t) {
                topicsWithMeta.push(Object.assign({}, t, { unit: u.unit_name, subject: sub.subject }));
            });
        });
        if (topicsWithMeta.length === 0) return;

        var row = document.createElement('div');
        row.className = 'subject-row';
        var label = document.createElement('div');
        label.className = 'subject-name';
        label.textContent = sub.subject;
        row.appendChild(label);

        var tilesWrap = document.createElement('div');
        tilesWrap.className = 'heatmap-grid';
        topicsWithMeta.forEach(function(topic) {
            var cell = document.createElement('div');
            cell.className = 'tile';
            var scoreText = topic.best_score > 0 ? ' – ' + topic.best_score + '%' : '';
            cell.setAttribute('data-tooltip', '[' + topic.subject + '] ' + topic.unit + ': ' + topic.title + scoreText);
            if (topic.status === 'Mastered') cell.classList.add('mastered');
            else if (topic.status === 'In-Progress') cell.classList.add('in-progress');
            else cell.classList.add('not-started');
            // Click tile to deep-link to learn page
            cell.addEventListener('click', function() {
                window.location.href = 'learn.html?topic=' + encodeURIComponent(topic.title);
            });
            tilesWrap.appendChild(cell);
        });
        row.appendChild(tilesWrap);
        matrix.appendChild(row);
    });

    document.getElementById('heatmap-summary').textContent =
        mastered.length + ' mastered · ' + inProgress.length + ' in progress · ' + locked.length + ' not started';

    // Focus Areas
    var focusDiv = document.getElementById('focus-areas');
    var weakTopics = allTopics.filter(function(t) { return t.status === 'In-Progress' && t.best_score < 80 && t.best_score > 0; });
    var strongTopics = allTopics.filter(function(t) { return t.status === 'Mastered'; });

    if (weakTopics.length === 0 && strongTopics.length === 0) {
        focusDiv.innerHTML = '<p class="text-muted-sm">Start learning to see focus areas.</p>';
    } else {
        weakTopics.forEach(function(t) {
            var tag = document.createElement('span');
            tag.className = 'focus-tag weak';
            tag.textContent = t.title;
            tag.style.cursor = 'pointer';
            tag.addEventListener('click', function() {
                window.location.href = 'learn.html?topic=' + encodeURIComponent(t.title);
            });
            focusDiv.appendChild(tag);
        });
        strongTopics.slice(0, 2).forEach(function(t) {
            var tag = document.createElement('span');
            tag.className = 'focus-tag strong';
            tag.textContent = t.title;
            focusDiv.appendChild(tag);
        });
    }

    // Drop Zone
    var dropZone = document.getElementById('drop-zone');
    var fileInput = document.getElementById('file-input');
    var browseBtn = document.getElementById('browse-btn');

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });
    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('drag-active');
    });
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    });
    browseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        var names = Array.from(files).map(function(f) { return f.name; }).join(', ');
        dropZone.querySelector('h4').textContent = '✅ ' + files.length + ' file(s) received';
        dropZone.querySelector('p').textContent = names;
        browseBtn.textContent = 'Upload More';
        window.showToast('📄 ' + files.length + ' file(s) ready for processing');
    }
}

window.addEventListener('DOMContentLoaded', init);
