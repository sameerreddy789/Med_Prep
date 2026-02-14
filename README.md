    # 🧠 MedVoice

    > **Your Intelligent Medical Study Companion**
    > *Simplifying complex medical concepts through interactive audio, visual maps, and clinical simulations.*

    MedVoice is a web-based study aid designed to help medical students overcome language barriers and retention challenges. It transforms static lecture notes (PDFs, PPTs) into engaging audio lessons, interactive concept maps, and realistic clinical scenarios.

    ---

    ## 🚀 Key Features

    ### 1. 📥 Intelligent Ingestion ("The Simplifier")
    -   **Multi-format Support**: Drag-and-drop support for PDFs, PowerPoint slides, and Images (Diagrams/X-rays).
    -   **Visual Mapping**: Automatically converts linear notes into interactive **Visual Topic Maps** (Flowcharts/Mind Maps).

    ### 2. 🎧 Audio Tutor
    -   **Adaptive Learning Modes**:
        -   **Story Mode** (Hindi/Hinglish): Narrative-style explanations for visualization.
        -   **Exam Mode** (English): High-yield bullet points for rapid revision.
        -   **Patient Mode**: Explains concepts using simple analogies.
    -   **Smart Player**: Interactive timeline with key takeaways.

    ### 3. 🏥 Simulation Arena
    -   **Clinical Cases**: AI-driven patient roleplay. You act as the doctor (History -> Vials -> Diagnosis).
    -   **Real-time Feedback**: Immediate scoring and explanations for your diagnostic choices.

    ### 4. 🧠 Retention Vault
    -   **Weakness Radar**: Visual heatmap of your strong and weak topics.
    -   **Spaced Repetition**: Algorithms schedule reviews based on your forgetting curve.

    ---

    ## 🛠️ Technology Stack

    -   **Frontend**: HTML5, CSS3 (Modern Glassmorphism Theme), JavaScript (ES6+ Modules).
    -   **State Management**: Custom `AppState` class with `localStorage` persistence.
    -   **AI Integration**: Google Gemini 1.5 Pro (via `GeminiService` - currently mocked for demo).
    -   **Visualization**: Mermaid.js for dynamic concept maps.
    -   **Styling**: Vanilla CSS with CSS Variables and Flexbox/Grid layouts.

    ---

    ## 📂 Project Structure

    ```bash
    MedVoice/
    ├── css/
    │   └── styles.css       # Core styles, variables, and glassmorphism utilities
    ├── js/
    │   ├── app.js           # Main entry point
    │   ├── app-state.js     # User session and progress management
    │   ├── audio-manager.js # Audio playback logic
    │   ├── gemini-service.js# AI service layer (Gemini API / Mocks)
    │   ├── simulator.js     # Clinical case simulation logic
    │   ├── studio.js        # Study studio interaction logic
    │   └── visual-map.js    # Concept map rendering (Mermaid/D3)
    ├── index.html           # Dashboard (Upload, Weakness Radar, Daily Mix)
    ├── studio.html          # Study Interface (Map + Audio)
    ├── simulation.html      # Exam/Clinical Simulation Interface
    └── README.md            # You are here
    ```

    ---

    ## 🏗️ Architecture & Planning

    ### Data Flow
    1.  **User Input** (File/Text) -> **GeminiService**
    2.  **GeminiService** -> Extracts Concepts & Generates Script
    3.  **Concepts** -> **VisualMap** (Rendered in Studio)
    4.  **Audio Script** -> **AudioManager** (played to user)
    5.  **Quiz Results** -> **AppState** -> **WeaknessRadar** (Dashboard)

    ### Implementation Roadmap
    - [x] **Phase 1: Foundation**
        - Project Structure & Glassmorphism UI
        - Core Navigation & Pages
        - Basic Service Layer Stubbing
    - [ ] **Phase 2: Interactivity**
        - [ ] Drag-and-drop file handling
        - [ ] Audio playback controls
        - [ ] Chat interface for Simulator
    - [ ] **Phase 3: AI Integration**
        - [ ] Connect `GeminiService` to real API
        - [ ] Dynamic Mermaid diagram generation
    - [ ] **Phase 4: Retention**
        - [ ] Implement Spaced Repetition Logic
        - [ ] persistent User Profiles

    ---

    ## 🎨 Design System

    We use a **Glassmorphism** aesthetic to provide a modern, clean, and "medical premium" feel.
    -   **Colors**: Deep Blue/Slate background with Neon Blue (`#0ea5e9`) and Teal (`#14b8a6`) accents.
    -   **Typography**: *Plus Jakarta Sans* (Headings) and *Inter* (Body).
    -   **Effects**: Background blurs (`backdrop-filter`), translucent panels, and smooth gradients.

    ---

    *Built with ❤️ for Medical Students.*
