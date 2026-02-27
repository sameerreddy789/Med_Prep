/**
 * MedVoice Concept Map Module
 * Handles Mermaid.js diagram rendering with lazy loading, zoom, and theme support.
 */

let mermaidInstance = null;

/**
 * Lazy-load and initialize Mermaid.js
 * @returns {Promise<object>} The mermaid module
 */
async function loadMermaid() {
    if (mermaidInstance) return mermaidInstance;

    const m = await import('https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs');
    mermaidInstance = m.default;
    mermaidInstance.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
            primaryColor: '#0ea5e9',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#334155',
            lineColor: '#475569',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
        },
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 16
        }
    });

    return mermaidInstance;
}

/**
 * Render a Mermaid diagram into a container element.
 * @param {HTMLElement} container - The DOM element to render into
 * @param {string} graphDefinition - Mermaid graph definition string
 * @param {string} [id='conceptMap'] - Unique ID for the rendered SVG
 * @returns {Promise<string>} The rendered SVG string
 */
export async function renderConceptMap(container, graphDefinition, id = 'conceptMap') {
    if (!container) {
        console.error('ConceptMap: No container element provided.');
        return '';
    }

    // Show loading state
    container.innerHTML = '<div class="loading-overlay"><div class="spinner"></div><span>Generating concept map...</span></div>';

    try {
        const mermaid = await loadMermaid();
        const { svg } = await mermaid.render(id, graphDefinition);
        container.innerHTML = svg;

        // Make SVG responsive
        const svgEl = container.querySelector('svg');
        if (svgEl) {
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
        }

        return svg;
    } catch (err) {
        console.error('ConceptMap: Render failed', err);
        container.innerHTML = '<p style="color:#fca5a5; text-align:center; padding:24px;">Error rendering concept map. Check the graph definition.</p>';
        return '';
    }
}

/**
 * Generate a basic Mermaid graph definition from a topic structure.
 * @param {string} rootTopic - The central topic name
 * @param {Array<{name: string, children?: string[]}>} branches - Sub-topics
 * @returns {string} Mermaid graph TD definition
 */
export function buildGraphDefinition(rootTopic, branches = []) {
    let lines = ['graph TD'];
    const rootId = 'ROOT';
    lines.push(`    ${rootId}[${rootTopic}]`);

    branches.forEach((branch, i) => {
        const branchId = `B${i}`;
        lines.push(`    ${rootId} --> ${branchId}(${branch.name})`);

        if (branch.children) {
            branch.children.forEach((child, j) => {
                const childId = `B${i}C${j}`;
                lines.push(`    ${branchId} --> ${childId}[${child}]`);
            });
        }
    });

    // Style the root node
    lines.push(`    style ${rootId} fill:#0ea5e9,stroke:#fff,stroke-width:2px,color:#fff`);

    return lines.join('\n');
}

/**
 * Clear the concept map container.
 * @param {HTMLElement} container
 */
export function clearConceptMap(container) {
    if (container) container.innerHTML = '';
}
