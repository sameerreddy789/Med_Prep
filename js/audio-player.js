/**
 * MedVoice Audio Player Module
 * Handles text-to-speech playback with mode switching, rate control, and timeline events.
 */

export class AudioPlayer {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.rate = 1.0;
        this.currentText = '';
        this.onStart = null;
        this.onEnd = null;
        this.onPause = null;
        this.onResume = null;
        this.onBoundary = null;
    }

    /** Check if speech synthesis is available */
    get isSupported() {
        return !!this.synth;
    }

    /** Set playback speed (0.5 - 2.0) */
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2.0, rate));
    }

    /**
     * Speak the given text. Stops any current playback first.
     * @param {string} text - The text to speak
     * @param {object} [options] - Optional config { rate, pitch, lang }
     */
    play(text, options = {}) {
        if (!this.isSupported) {
            console.warn('AudioPlayer: SpeechSynthesis not supported in this browser.');
            return;
        }

        this.stop();
        this.currentText = text;

        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = options.rate || this.rate;
        this.utterance.pitch = options.pitch || 1.0;
        if (options.lang) this.utterance.lang = options.lang;

        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            if (this.onStart) this.onStart();
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            if (this.onEnd) this.onEnd();
        };

        this.utterance.onpause = () => {
            this.isPaused = true;
            if (this.onPause) this.onPause();
        };

        this.utterance.onresume = () => {
            this.isPaused = false;
            if (this.onResume) this.onResume();
        };

        this.utterance.onboundary = (event) => {
            if (this.onBoundary) this.onBoundary(event);
        };

        this.synth.speak(this.utterance);
    }

    /** Pause current playback */
    pause() {
        if (this.isPlaying && this.synth) {
            this.synth.pause();
        }
    }

    /** Resume paused playback */
    resume() {
        if (this.isPaused && this.synth) {
            this.synth.resume();
        }
    }

    /** Toggle play/pause */
    toggle(text) {
        if (this.isPlaying && !this.isPaused) {
            this.pause();
        } else if (this.isPaused) {
            this.resume();
        } else if (text) {
            this.play(text);
        }
    }

    /** Stop and cancel all speech */
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.isPlaying = false;
        this.isPaused = false;
        this.utterance = null;
    }

    /** Get available voices */
    getVoices() {
        if (!this.synth) return [];
        return this.synth.getVoices();
    }

    /** Destroy and clean up */
    destroy() {
        this.stop();
        this.onStart = null;
        this.onEnd = null;
        this.onPause = null;
        this.onResume = null;
        this.onBoundary = null;
    }
}

export const audioPlayer = new AudioPlayer();
