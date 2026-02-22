// MedVoice Studio Logic
console.log('Studio Logic loaded');

// Mermaid loaded lazily on first use
let mermaidModule = null;
async function getMermaid() {
    if (!mermaidModule) {
        const m = await import('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs');
        mermaidModule = m.default;
        mermaidModule.initialize({ startOnLoad: false, theme: 'dark' });
    }
    return mermaidModule;
}

// DOM Elements
const quickPicker = document.getElementById('quick-picker');
const mapWrapper = document.getElementById('concept-map-wrapper');
const mermaidContainer = document.getElementById('mermaid-container');
const topicTitle = document.getElementById('topic-title');
const takeawaysList = document.getElementById('takeaways-list');

// Demo Data
const demoTakeaways = [
    { title: "Roots (C5-T1)", text: "Formed by anterior rami of spinal nerves." },
    { title: "Trunks", text: "Superior (C5-6), Middle (C7), Inferior (C8-T1)." },
    { title: "Divisions", text: "Anterior (flexors) and Posterior (extensors)." },
    { title: "Cords", text: "Named relative to axillary artery." }
];

const demoGraph = `
graph TD
    A[Brachial Plexus] --> B(Roots)
    A --> C(Trunks)
    A --> D(Divisions)
    A --> E(Cords)
    A --> F(Branches)
    B --> B1[C5]
    B --> B2[C6]
    B --> B3[C7]
    B --> B4[C8]
    B --> B5[T1]
    C --- C1[Superior]
    C --- C2[Middle]
    C --- C3[Inferior]
    style A fill:#0ea5e9,stroke:#0ea5e9,stroke-width:2px,color:#fff
    style B fill:#0f172a,stroke:#334155,color:#cbd5e1
    style C fill:#0f172a,stroke:#334155,color:#cbd5e1
    style D fill:#0f172a,stroke:#334155,color:#cbd5e1
    style E fill:#0f172a,stroke:#334155,color:#cbd5e1
    style F fill:#0f172a,stroke:#334155,color:#cbd5e1
`;

// Expose function to global scope for HTML onclick
window.loadDemoTopic = async function () {
    console.log('Loading demo topic...');
    quickPicker.style.display = 'none';
    mapWrapper.style.display = 'block';
    topicTitle.textContent = "Brachial Plexus";

    try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render('graphDiv', demoGraph);
        mermaidContainer.innerHTML = svg;
    } catch (e) {
        console.error('Mermaid render failed:', e);
        mermaidContainer.innerHTML = '<p style="color:red">Error loading map</p>';
    }

    takeawaysList.style.opacity = '1';
    takeawaysList.innerHTML = '';
    demoTakeaways.forEach(t => {
        const li = document.createElement('li');
        li.style.cssText = 'background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border-left: 2px solid var(--accent-secondary);';
        li.innerHTML = `<strong style="display: block; color: #fff; margin-bottom: 4px; font-size: 0.85rem;">${t.title}</strong><span style="font-size: 0.8rem; color: var(--text-muted);">${t.text}</span>`;
        takeawaysList.appendChild(li);
    });

    // Update transcript with current mode
    if (transcriptArea) transcriptArea.textContent = demoTranscripts[currentMode];
};

// ===== AUDIO TUTOR CONTROLS =====
const demoTranscripts = {
    story: "Imagine karo ki brachial plexus ek highway system hai. C5 se T1 tak — ye 5 roots hain jo spinal cord se nikalte hain. Phir ye merge hote hain 3 trunks mein — Superior, Middle, aur Inferior. Fir har trunk split hota hai anterior aur posterior divisions mein. Finally, ye cords banate hain jo axillary artery ke around wrap hote hain.",
    facts: "The brachial plexus is formed by the ventral rami of C5-T1. It consists of 5 roots, 3 trunks (superior, middle, inferior), 6 divisions (3 anterior, 3 posterior), 3 cords (lateral, posterior, medial), and terminal branches. Key branches include the musculocutaneous, median, ulnar, radial, and axillary nerves.",
    patient: "Think of your arm's nerve supply like a tree. The roots come from your spine, they join into thick trunks, split into branches, then wrap around a major blood vessel before spreading out to control your arm muscles and sensation."
};

let currentMode = 'story';
let isPlaying = false;
let speechUtterance = null;

const transcriptArea = document.querySelector('.studio-col-right div[style*="overflow-y: auto"] p');
const playBtn = document.querySelector('.studio-col-right .btn-primary');
const visBars = document.querySelectorAll('.vis-bar');
const rightCol = document.querySelector('.studio-col-right');
const modeBtnContainer = rightCol ? rightCol.querySelector('div[style*="gap: 2px"]') : null;

function stopAudio() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    isPlaying = false;
    if (playBtn) playBtn.textContent = '▶';
    visBars.forEach(b => b.style.animationPlayState = 'paused');
}

function playAudio() {
    if (!window.speechSynthesis) return;
    const text = demoTranscripts[currentMode];
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.rate = 0.95;
    speechUtterance.onend = () => stopAudio();
    window.speechSynthesis.speak(speechUtterance);
    isPlaying = true;
    if (playBtn) playBtn.textContent = '⏸';
    visBars.forEach(b => b.style.animationPlayState = 'running');
    if (transcriptArea) transcriptArea.textContent = text;
}

// Mode toggle
if (modeBtnContainer) {
    const btns = modeBtnContainer.querySelectorAll('button');
    const storyBtn = btns[0], factsBtn = btns[1], patientBtn = btns[2];

    function setActiveMode(mode, activeBtn) {
        currentMode = mode;
        [storyBtn, factsBtn, patientBtn].forEach(b => {
            b.style.background = 'transparent';
            b.style.border = 'none';
        });
        activeBtn.style.background = 'rgba(255,255,255,0.1)';
        if (transcriptArea && topicTitle.textContent !== 'Select a Topic') {
            transcriptArea.textContent = demoTranscripts[mode];
        }
        if (isPlaying) stopAudio();
    }

    storyBtn.addEventListener('click', () => setActiveMode('story', storyBtn));
    factsBtn.addEventListener('click', () => setActiveMode('facts', factsBtn));
    patientBtn.addEventListener('click', () => setActiveMode('patient', patientBtn));
}

// Play/Pause button
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (topicTitle.textContent === 'Select a Topic') return;
        if (isPlaying) { stopAudio(); } else { playAudio(); }
    });
}

// Skip buttons (rewind/forward)
const skipBtns = rightCol ? rightCol.querySelectorAll('button[style*="border-radius: 50%"]') : [];
if (skipBtns.length >= 3) {
    skipBtns[0].addEventListener('click', () => { if (isPlaying) { stopAudio(); playAudio(); } });
    skipBtns[2].addEventListener('click', () => { if (isPlaying) { stopAudio(); playAudio(); } });
}

// Follow-up chat input
const followUpInput = rightCol ? rightCol.querySelector('input[type="text"]') : null;
if (followUpInput) {
    followUpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const q = followUpInput.value.trim();
            if (!q) return;
            if (transcriptArea) {
                transcriptArea.textContent = 'You asked: "' + q + '"\n\n[AI response will appear here once Gemini API is connected. For now, try the audio modes above.]';
            }
            followUpInput.value = '';
        }
    });
}

// Notes & Save Session header buttons
const headerBtns = document.querySelectorAll('.glass-header .btn-glass');
headerBtns.forEach(btn => {
    if (btn.textContent.includes('Notes')) {
        btn.addEventListener('click', () => alert('📂 Notes feature coming soon! Your takeaways will be saved here.'));
    }
    if (btn.textContent.includes('Save')) {
        btn.addEventListener('click', () => {
            const session = { topic: topicTitle.textContent, mode: currentMode, timestamp: new Date().toISOString() };
            localStorage.setItem('medvoice_last_session', JSON.stringify(session));
            alert('💾 Session saved!');
        });
    }
});

// ===== URL PARAM DEEP-LINKING =====
// If ?topic=... is in the URL, auto-load that topic
(function() {
    var params = new URLSearchParams(window.location.search);
    var topicParam = params.get('topic');
    if (topicParam) {
        // For now, load the demo topic (in future, this would fetch from AI)
        window.loadDemoTopic();
        topicTitle.textContent = topicParam;
    }
})();

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Space to play/pause audio (only when not typing)
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (topicTitle.textContent === 'Select a Topic') return;
        if (isPlaying) { stopAudio(); } else { playAudio(); }
    }
});

// ===== QUIZ SYSTEM =====
// Mock quiz data (would come from ai-service.js in production)
var quizData = [
    { question: "Which roots form the brachial plexus?", options: ["C3-C7", "C5-T1", "C4-T2", "C6-T1"], correct: 1, tag: "Anatomy" },
    { question: "How many trunks does the brachial plexus have?", options: ["2", "3", "4", "5"], correct: 1, tag: "Anatomy" },
    { question: "The cords are named relative to which artery?", options: ["Brachial", "Axillary", "Subclavian", "Radial"], correct: 1, tag: "Anatomy" },
    { question: "Which nerve arises from the lateral cord?", options: ["Ulnar", "Radial", "Musculocutaneous", "Axillary"], correct: 2, tag: "Anatomy" },
    { question: "Erb-Duchenne palsy affects which roots?", options: ["C8-T1", "C5-C6", "C7", "C5-T1"], correct: 1, tag: "Clinical" }
];

var quizState = { current: 0, score: 0, answers: [] };

// Create quiz modal
var quizModal = document.createElement('div');
quizModal.id = 'quiz-modal';
quizModal.style.cssText = 'display:none; position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); align-items:center; justify-content:center;';
quizModal.innerHTML = '<div style="background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:32px; width:90%; max-width:520px; box-shadow:0 24px 80px rgba(0,0,0,0.5);">' +
    '<div id="quiz-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">' +
    '<h3>🧠 Mastery Gate</h3><span id="quiz-progress" style="font-size:0.8rem; color:var(--text-muted);">1/5</span></div>' +
    '<p id="quiz-question" style="font-size:1rem; color:white; margin-bottom:20px; line-height:1.5;"></p>' +
    '<div id="quiz-options" style="display:flex; flex-direction:column; gap:8px;"></div>' +
    '<div id="quiz-result" style="display:none; text-align:center; padding:24px 0;"></div>' +
    '</div>';
document.body.appendChild(quizModal);

function startQuiz() {
    quizState = { current: 0, score: 0, answers: [] };
    quizModal.style.display = 'flex';
    renderQuestion();
}

function renderQuestion() {
    var q = quizData[quizState.current];
    document.getElementById('quiz-progress').textContent = (quizState.current + 1) + '/' + quizData.length;
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-result').style.display = 'none';

    var optionsDiv = document.getElementById('quiz-options');
    optionsDiv.style.display = 'flex';
    optionsDiv.innerHTML = '';
    q.options.forEach(function(opt, i) {
        var btn = document.createElement('button');
        btn.className = 'btn btn-glass';
        btn.style.cssText = 'width:100%; text-align:left; padding:12px 16px; justify-content:flex-start;';
        btn.textContent = String.fromCharCode(65 + i) + '. ' + opt;
        btn.addEventListener('click', function() { selectAnswer(i); });
        optionsDiv.appendChild(btn);
    });
}

function selectAnswer(idx) {
    var q = quizData[quizState.current];
    var btns = document.getElementById('quiz-options').querySelectorAll('button');
    btns.forEach(function(b, i) {
        b.disabled = true;
        if (i === q.correct) { b.style.background = 'rgba(34,197,94,0.2)'; b.style.borderColor = '#22c55e'; }
        if (i === idx && idx !== q.correct) { b.style.background = 'rgba(239,68,68,0.2)'; b.style.borderColor = '#ef4444'; }
    });
    if (idx === q.correct) quizState.score++;
    quizState.answers.push({ question: q.question, correct: idx === q.correct, tag: q.tag });

    setTimeout(function() {
        quizState.current++;
        if (quizState.current < quizData.length) {
            renderQuestion();
        } else {
            showQuizResult();
        }
    }, 1000);
}

function showQuizResult() {
    document.getElementById('quiz-options').style.display = 'none';
    document.getElementById('quiz-question').style.display = 'none';
    var pct = Math.round((quizState.score / quizData.length) * 100);
    var passed = pct >= 80;
    var resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="font-size:3rem; margin-bottom:12px;">' + (passed ? '🎉' : '📚') + '</div>' +
        '<h2 style="margin-bottom:8px;">' + pct + '% — ' + (passed ? 'Mastered!' : 'Keep Going') + '</h2>' +
        '<p style="font-size:0.85rem; margin-bottom:20px;">' + quizState.score + '/' + quizData.length + ' correct</p>' +
        '<div style="display:flex; gap:8px; justify-content:center;">' +
        '<button class="btn btn-primary" onclick="document.getElementById(\'quiz-modal\').style.display=\'none\'">Close</button>' +
        (passed ? '' : '<button class="btn btn-glass" onclick="startQuiz()">Retry</button>') +
        '</div>';
    if (typeof window.showToast === 'function') {
        window.showToast(passed ? '🎉 Topic mastered!' : '📚 Review and try again', passed ? 'success' : 'warning');
    }
}

// Expose globally
window.startQuiz = startQuiz;
