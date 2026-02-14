/**
 * AppState Management for MedVoice
 * Handles user session, curriculum, progress tracking, and settings.
 */

class AppState {
    constructor() {
        this.user = this.loadUser();
        this.curriculum = this.loadCurriculum();
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
            year: "2nd Year MBBS",
            language: "Hinglish",
            weaknessRadar: [],
            recentTopics: [],
            streak: 0,
            totalScore: 0
        };
    }

    saveUser() {
        localStorage.setItem('medvoice_user', JSON.stringify(this.user));
        this.updateUI();
    }

    // --- Curriculum Management ---
    loadCurriculum() {
        const stored = localStorage.getItem('medvoice_curriculum');
        return stored ? JSON.parse(stored) : [
            {
                subject: "Anatomy",
                progress: 45,
                units: [
                    {
                        unit_name: "Upper Limb",
                        topics: [
                            { title: "Brachial Plexus", status: "Mastered", best_score: 90 },
                            { title: "Axillary Artery", status: "Mastered", best_score: 85 }
                        ]
                    },
                    {
                        unit_name: "Thorax",
                        topics: [
                            { title: "Cardiac Cycle", status: "In-Progress", best_score: 60 },
                            { title: "Lungs & Mediastinum", status: "Locked", best_score: 0 }
                        ]
                    },
                    {
                        unit_name: "Abdomen",
                        topics: [
                            { title: "GI Tract Overview", status: "Locked", best_score: 0 }
                        ]
                    }
                ]
            },
            {
                subject: "Physiology",
                progress: 20,
                units: [
                    {
                        unit_name: "General Physiology",
                        topics: [
                            { title: "Cell Membrane Transport", status: "In-Progress", best_score: 50 }
                        ]
                    }
                ]
            }
        ];
    }

    saveCurriculum() {
        localStorage.setItem('medvoice_curriculum', JSON.stringify(this.curriculum));
    }

    updateTopicStatus(subject, unitName, topicTitle, newStatus, score) {
        const sub = this.curriculum.find(s => s.subject === subject);
        if (!sub) return;
        const unit = sub.units.find(u => u.unit_name === unitName);
        if (!unit) return;
        const topic = unit.topics.find(t => t.title === topicTitle);
        if (!topic) return;

        topic.status = newStatus;
        if (score !== undefined) topic.best_score = Math.max(topic.best_score, score);

        // Recalculate subject progress
        const allTopics = sub.units.flatMap(u => u.topics);
        const mastered = allTopics.filter(t => t.status === "Mastered").length;
        sub.progress = Math.round((mastered / allTopics.length) * 100);

        this.saveCurriculum();
    }

    getMasteredCount() {
        return this.curriculum.flatMap(s => s.units.flatMap(u => u.topics))
            .filter(t => t.status === "Mastered").length;
    }

    getTotalTopicCount() {
        return this.curriculum.flatMap(s => s.units.flatMap(u => u.topics)).length;
    }

    // --- Settings Management ---
    loadSettings() {
        const stored = localStorage.getItem('medvoice_settings');
        return stored ? JSON.parse(stored) : {
            language: "hinglish",
            theme: "glass",
            audioSpeed: 1.0
        };
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('medvoice_settings', JSON.stringify(this.settings));
    }

    // --- Progress Tracking ---
    addWeakness(topic) {
        if (!this.user.weaknessRadar.find(w => w.topic === topic)) {
            this.user.weaknessRadar.push({ topic, score: 50 });
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
        const profileBtns = document.querySelectorAll('.profile-btn-text');
        profileBtns.forEach(btn => btn.innerText = this.user.name);
    }
}

export const appState = new AppState();
document.addEventListener('DOMContentLoaded', () => appState.init());
