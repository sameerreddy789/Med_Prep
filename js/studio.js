// MedVoice Studio Logic
console.log('Studio Logic loaded');

// Initialize Mermaid
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

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

    // 1. Switch Views
    quickPicker.style.display = 'none';
    mapWrapper.style.display = 'block';

    // 2. Update Metadata
    topicTitle.textContent = "Brachial Plexus";

    // 3. Render Mermaid Map
    try {
        const { svg } = await mermaid.render('graphDiv', demoGraph);
        mermaidContainer.innerHTML = svg;
    } catch (e) {
        console.error('Mermaid render failed:', e);
        mermaidContainer.innerHTML = '<p style="color:red">Error loading map</p>';
    }

    // 4. Populate Takeaways
    takeawaysList.style.opacity = '1';
    takeawaysList.innerHTML = '';
    demoTakeaways.forEach(t => {
        const li = document.createElement('li');
        li.style.cssText = 'background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border-left: 2px solid var(--accent-secondary);';
        li.innerHTML = `<strong style="display: block; color: #fff; margin-bottom: 4px; font-size: 0.85rem;">${t.title}</strong><span style="font-size: 0.8rem; color: var(--text-muted);">${t.text}</span>`;
        takeawaysList.appendChild(li);
    });
};
