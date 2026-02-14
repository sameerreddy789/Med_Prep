/**
 * Gemini Service for MedVoice
 * Handles all AI interactions: Concept Extraction, Simplification, and Chat.
 */

import { appState } from './app-state.js';

class GeminiService {
    constructor() {
        this.apiKey = null; // In real app, fetch from env or backend proxy
        this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
        this.isMockMode = true; // For demo purposes without a backend key proxy
    }

    init(key) {
        this.apiKey = key;
        if (key) this.isMockMode = false;
    }

    /**
     * Upload & Analyze (The "Simplifier")
     * Takes text or file context and returns a structured Concept Map.
     */
    async analyzeMaterial(textOrContext) {
        console.log("Analyzing material...");

        if (this.isMockMode) {
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            return {
                title: "Cardiac Cycle Dynamics",
                concepts: [
                    { id: "c1", label: "Diastole (Relaxation)", type: "process" },
                    { id: "c2", label: "Systole (Contraction)", type: "process" },
                    { id: "c3", label: "Heart Sounds (Lubb-Dubb)", type: "outcome" },
                    { id: "c4", label: "Valvular Function", type: "mechanism" }
                ],
                links: [
                    { source: "c1", target: "c4", label: "Depends on" },
                    { source: "c2", target: "c4", label: "Forces close" },
                    { source: "c4", target: "c3", label: "Creates" }
                ]
            };
        }
        // TODO: Real API Call implementation
    }

    /**
     * Generate Audio Script (The "Audio Tutor")
     * Converts a concept into a specific style (Patient, Story, Exam).
     */
    async generateAudioScript(concept, mode = "story") {
        console.log(`Generating script for ${concept} in ${mode} mode...`);

        const language = appState.settings.language; // "english" or "hinglish"

        if (this.isMockMode) {
            await new Promise(r => setTimeout(r, 1000));

            if (mode === "patient") {
                return "Doctor, honestly, I just feel like my heart is taking a long nap (Diastole) and then suddenly sprinting (Systole). Is that normal?";
            }
            if (language === "hinglish") {
                return `Imagine karo heart ek pump hai. Jab ye relax karta hai (Diastole), tab blood fill hota hai like water tank filling up. Phir contractions start hote hain (Systole) to push blood out.`;
            }
            return `Imagine the heart as a two-stage pump. First, the relaxation phase, or Diastole, acting like a vacuum to suck blood in. Then, the powerful squeeze of Systole to shoot it out to the body.`;
        }
    }

    /**
     * Clinical Simulator Chat
     */
    async chatWithPatient(history, userMessage) {
        // Simple heuristic mock for now
        await new Promise(r => setTimeout(r, 800));

        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes("pain") || lowerMsg.includes("hurt")) {
            return "It's a sharp pain, Doctor. Right in the center of my chest. Starts to radiate to my jaw sometimes.";
        }
        if (lowerMsg.includes("breath") || lowerMsg.includes("short")) {
            return "Yes, I get winded just walking to the bathroom.";
        }
        return "I'm not sure, Doctor. I just feel very weak and anxious.";
    }
}

export const geminiService = new GeminiService();
