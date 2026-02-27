# 🧠 MedVoice

> **Your Intelligent Medical Study Companion**

MedVoice transforms complex medical concepts into interactive audio lessons, visual concept maps, and clinical simulations. Built for medical students who want to learn smarter.

---

## Key Features

- **📥 Smart Ingestion** — Drag-and-drop PDFs, PPTs, and images
- **🧬 Visual Topic Maps** — Interactive Mermaid.js concept maps
- **🎧 Audio Tutor** — Story Mode (Hinglish), Exam Mode (English), Patient Mode
- **🏥 Clinical Simulator** — AI-driven patient roleplay with vitals monitoring
- **📝 Mastery Gate** — Quiz system with score tracking and progress persistence
- **🗺️ Mastery Matrix** — Visual heatmap of topic mastery across subjects
- **🎯 Mission Control** — Profile management, syllabus builder, achievements

## Tech Stack

- HTML5, CSS3 (Glassmorphism Design System), JavaScript (ES6+)
- Mermaid.js for dynamic concept maps (lazy-loaded)
- Web Speech API for text-to-speech audio
- localStorage for client-side persistence
- Zero dependencies, zero build step

## Project Structure

```
MedVoice/
├── css/styles.css              # Design system, components, responsive
├── js/
│   ├── main.js                 # Seed data, toast system, theme toggle
│   ├── sidebar.js              # Shared navigation component
│   ├── dashboard.js            # Dashboard stats, mastery matrix, file upload
│   ├── learn-studio.js         # Concept maps, audio tutor, quiz system
│   ├── clinical-simulator.js   # Patient chat, vitals, task tracking
│   └── mission-control.js      # Syllabus CRUD, profile editor
├── index.html                  # Landing page
├── dashboard.html              # Main hub
├── learn.html                  # Study Studio
├── clinical-sim.html           # Simulation Arena
├── mission-control.html        # Profile & Syllabus
└── 404.html                    # Error page
```

## Getting Started

Open `index.html` in any modern browser. No build step required.
