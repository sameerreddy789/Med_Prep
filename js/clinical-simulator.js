// MedVoice Clinical Simulator Logic
console.log('Simulator logic loaded');

const chatWindow = document.getElementById('chat-window');
const chatInput = document.querySelector('main input[type="text"]');
const sendBtn = document.querySelector('main .btn-primary');
const endSimBtn = document.querySelector('.btn-alert');
const taskItems = document.querySelectorAll('main ul li');

const patientResponses = {
    history: [
        "The pain started around 6 AM, Doctor. I was just having my morning tea.",
        "I have been taking BP medicine for 5 years. Sometimes I forget to take it.",
        "My father had a heart attack at 55. I am a smoker — about 10 cigarettes a day.",
        "No, I haven't had any surgery before. But I do feel breathless sometimes when climbing stairs.",
        "I also felt a bit nauseous and sweaty when the pain started."
    ],
    exam: [
        "It hurts more when you press here, Doctor *points to left chest*.",
        "I can feel my heart beating very fast.",
        "My breathing feels a bit heavy but I can manage."
    ],
    labs: [
        "Doctor, when will the reports come? I am feeling a bit anxious.",
        "Should I be worried about the results?"
    ],
    diagnose: [
        "What does that mean, Doctor? Is it serious?",
        "Will I need to stay in the hospital?"
    ]
};

let currentPhase = 'history';
let responseIndex = 0;
let simActive = true;

function getNextResponse() {
    const pool = patientResponses[currentPhase] || patientResponses.history;
    const response = pool[responseIndex % pool.length];
    responseIndex++;
    return response;
}

function appendMessage(text, isUser) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `display: flex; gap: 16px;${isUser ? ' flex-direction: row-reverse;' : ''}`;

    const avatar = document.createElement('div');
    avatar.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;';
    avatar.style.background = isUser ? 'var(--accent-primary)' : '#cbd5e1';
    avatar.textContent = isUser ? '🩺' : '👨‍🦳';

    const bubble = document.createElement('div');
    const radius = isUser ? '16px 0 16px 16px' : '0 16px 16px 16px';
    bubble.style.cssText = `padding: 16px; max-width: 70%; border-radius: ${radius};`;
    bubble.style.background = isUser ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)';

    const p = document.createElement('p');
    p.style.cssText = 'color: white; margin: 0;';
    p.textContent = text;
    bubble.appendChild(p);

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function advanceTask() {
    const phases = ['history', 'exam', 'labs', 'diagnose'];
    const idx = phases.indexOf(currentPhase);
    if (taskItems[idx]) {
        taskItems[idx].textContent = '✅ ' + taskItems[idx].textContent.replace(/^[✅⬜]\s*/, '');
    }
    if (idx < phases.length - 1) {
        currentPhase = phases[idx + 1];
        responseIndex = 0;
    }
}

function handleSend() {
    if (!simActive) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    chatInput.value = '';

    const lower = text.toLowerCase();
    if (lower.includes('exam') || lower.includes('auscult') || lower.includes('palpat') || lower.includes('inspect')) {
        advanceTask(); currentPhase = 'exam';
    } else if (lower.includes('lab') || lower.includes('test') || lower.includes('ecg') || lower.includes('troponin') || lower.includes('blood')) {
        advanceTask(); currentPhase = 'labs';
    } else if (lower.includes('diagnos') || lower.includes('impression') || lower.includes('assessment') || lower.includes('mi') || lower.includes('angina')) {
        advanceTask(); currentPhase = 'diagnose';
    }

    // Show typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.style.cssText = 'display: flex; gap: 16px;';
    typingBubble.innerHTML = '<div style="width:40px;height:40px;border-radius:50%;background:#cbd5e1;display:flex;align-items:center;justify-content:center;flex-shrink:0;">👨‍🦳</div>' +
        '<div style="padding:16px;border-radius:0 16px 16px 16px;background:rgba(255,255,255,0.1);">' +
        '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
    chatWindow.appendChild(typingBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
        if (!simActive) return;
        chatWindow.removeChild(typingBubble);
        appendMessage(getNextResponse(), false);
    }, 800 + Math.random() * 700);
}

if (sendBtn) sendBtn.addEventListener('click', handleSend);
if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    });
}

if (endSimBtn) {
    endSimBtn.addEventListener('click', () => {
        if (!simActive) return;
        simActive = false;

        taskItems.forEach(li => {
            li.textContent = '✅ ' + li.textContent.replace(/^[✅⬜]\s*/, '');
        });

        // Track simulation performance in localStorage
        var simHistory = window.safeJsonParse('medvoice_sim_history', []);
        simHistory.push({
            patient: 'Mr. Sharma',
            phase: currentPhase,
            messagesExchanged: responseIndex,
            completedAt: new Date().toISOString()
        });
        localStorage.setItem('medvoice_sim_history', JSON.stringify(simHistory));

        const endMsg = document.createElement('div');
        endMsg.style.cssText = 'text-align: center; padding: 24px; background: rgba(20,184,166,0.1); border: 1px solid rgba(20,184,166,0.3); border-radius: 12px;';
        endMsg.innerHTML = '<div style="font-size: 2rem; margin-bottom: 8px;">🏁</div>' +
            '<h3 style="margin-bottom: 4px;">Simulation Complete</h3>' +
            '<p style="font-size: 0.85rem; margin-bottom: 16px;">Great work, Doctor. You exchanged ' + responseIndex + ' messages and reached the ' + currentPhase + ' phase.</p>' +
            '<div style="display: flex; gap: 8px; justify-content: center;">' +
            '<a href="dashboard.html" class="btn btn-primary" style="display: inline-flex; text-decoration: none;">Back to Dashboard</a>' +
            '<button class="btn btn-glass" id="restart-sim-btn">🔄 Restart</button>' +
            '</div>';
        chatWindow.appendChild(endMsg);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        chatInput.disabled = true;
        chatInput.placeholder = 'Simulation ended';
        sendBtn.disabled = true;
        endSimBtn.disabled = true;

        const liveIndicator = document.getElementById('live-indicator');
        if (liveIndicator) liveIndicator.style.display = 'none';

        if (typeof window.showToast === 'function') window.showToast('🏁 Simulation complete!', 'success');

        // Restart button handler
        document.getElementById('restart-sim-btn').addEventListener('click', () => {
            location.reload();
        });
    });
}
