/**
 * Gemini Service for MedVoice
 * Handles all AI interactions using specific MedVoice protocols.
 */

import { appState } from './app-state.js';
import { PROMPT_TEMPLATES } from './prompts.js';

class GeminiService {
    constructor() {
        this.apiKey = null;
        this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
        this.isMockMode = true;
    }

    init(key) {
        this.apiKey = key;
        if (key) this.isMockMode = false;
    }

    async _callAPI(prompt) {
        if (this.isMockMode) {
            console.log(" [Mock API Call] Prompt sent:\n", prompt);
            await new Promise(r => setTimeout(r, 1500));
            return null; // Mocks handle return values individually
        }
        // Real API implementation would go here
    }

    /**
     * PROTOCOL 1: Syllabus Parsing
     */
    async parseSyllabus(rawText) {
        const prompt = PROMPT_TEMPLATES.SYLLABUS_PARSING(rawText);
        await this._callAPI(prompt);

        // Mock Response
        return {
            subject: "Cardiology",
            units: [
                { unit_name: "Fundamentals", topics: ["Cardiac Cycle", "Action Potential"] },
                { unit_name: "Pathology", topics: ["Ischemic Heart Disease", "Heart Failure"] }
            ]
        };
    }

    /**
     * PROTOCOL 2: Content Generation
     */
    async generateContent(topic, subject, mode, context = "Standard Textbook") {
        const prompt = PROMPT_TEMPLATES.CONTENT_GENERATION(topic, subject, mode, context);
        await this._callAPI(prompt);

        // Mock Response based on Mode and New Protocol
        const isStory = mode.toLowerCase().includes("story");

        return {
            mermaid_code: `graph TD
A[${topic}] --> B(Diastole)
A --> C(Systole)
B --> B1[Isovolumetric Relaxation]
B --> B2[Ventricular Filling]
C --> C1[Isovolumetric Contraction]
C --> C2[Ejection]
style A fill:#0ea5e9,stroke:#fff,stroke-width:2px`,
            audio_script: isStory
                ? "Imagine karo heart ek water pump hai. Jab ye relax karta hai (Diastole), tab blood fill hota hai like a tank..."
                : "The cardiac cycle consists of two major phases: Diastole (relaxation) and Systole (contraction). Key events include...",
            takeaways: [
                { term: "Diastole", definition: "Relaxation phase where ventricles fill." },
                { term: "Systole", definition: "Contraction phase where blood is ejected." },
                { term: "Stroke Volume", definition: "Volume of blood pumped per beat." }
            ],
            quiz_preview: "Ready to test your knowledge on Pressure-Volume loops?"
        };
    }

    /**
     * PROTOCOL 3: Mastery Gate (Quiz)
     */
    async generateQuiz(topic) {
        const prompt = PROMPT_TEMPLATES.QUIZ_GENERATION(topic);
        await this._callAPI(prompt);

        // Mock Response
        return Array(10).fill(0).map((_, i) => ({
            id: i,
            question: `Question ${i + 1} about ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct_index: 0,
            concept_tag: i % 2 === 0 ? "Physiology" : "Anatomy"
        }));
    }

    /**
     * PROTOCOL 4: Remediation Logic
     */
    async generateRemediation(score, topic, missedTags) {
        if (score >= 8) return null; // No remediation needed

        const prompt = PROMPT_TEMPLATES.REMEDIATION(score, topic, missedTags);
        await this._callAPI(prompt);

        return {
            brief: `Hey Doc, looks like we slipped up on ${missedTags.join(', ')}. Here's the deal: ... (Remediation Content)`,
            action: "Review these concepts and retry."
        };
    }

    /**
     * Clinical Simulator Chat (Legacy support, updated to use templates if needed later)
     */
    async chatWithPatient(history, userMessage) {
        // Simple heuristic mock for now
        await new Promise(r => setTimeout(r, 800));

        // ... kept as is or updated similarly
        return "It hurts when I breathe, Doctor.";
    }
}

export const geminiService = new GeminiService();
