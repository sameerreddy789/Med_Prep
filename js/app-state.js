/**
 * AppState Management for MedVoice
 * Handles user session, progress tracking, and global settings.
 */

class AppState {
    constructor() {
        this.user = this.loadUser();
        this.currentSession = null;
        this.settings = this.loadSettings();
    }

    init() {
        console.log("🧠 MedVoice App Initialized");
        this.updateUI();
    }

    // --- User Management ---
    loadUser() {
        const stored = localStorage.getItem('medvoice_user');
        return stored ? JSON.parse(stored) : {
            name: "Dr. Future",
            weaknessRadar: [], // { topic: "Pharma", score: 40 }
            recentTopics: [],
            totalScore: 0
        };
    }

    saveUser() {
        localStorage.setItem('medvoice_user', JSON.stringify(this.user));
        this.updateUI();
    }

    // --- Settings Management ---
    loadSettings() {
        const stored = localStorage.getItem('medvoice_settings');
        return stored ? JSON.parse(stored) : {
            language: "english", // "english" | "hnglish"
            theme: "glass",
            audioSpeed: 1.0
        };
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('medvoice_settings', JSON.stringify(this.settings));
        // Broadcast change event if needed
    }

    // --- Progress Tracking ---
    addWeakness(topic) {
        if (!this.user.weaknessRadar.find(w => w.topic === topic)) {
            this.user.weaknessRadar.push({ topic, score: 50 }); // Start at 50%
            this.saveUser();
        }
    }

    updateTopicScore(topic, isCorrect) {
        const weakness = this.user.weaknessRadar.find(w => w.topic === topic);
        if (weakness) {
            weakness.score = isCorrect
                ? Math.min(100, weakness.score + 10)
                : Math.max(0, weakness.score - 10);
        } else if (!isCorrect) {
            this.addWeakness(topic);
        }
        this.saveUser();
    }

    // --- UI Helpers ---
    updateUI() {
        // Updates common UI elements like profile name or badges
        const profileBtns = document.querySelectorAll('.profile-btn-text');
        profileBtns.forEach(btn => btn.innerText = this.user.name);
    }
}

export const appState = new AppState();
// Auto-init
document.addEventListener('DOMContentLoaded', () => appState.init());
