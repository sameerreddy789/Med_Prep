/**
 * MedVoice AI Prompt Templates & System Configuration
 */

export const MEDVOICE_SYSTEM_ROLE = `
# ROLE
You are "MedVoice AI," a specialized Medical Education Architect. Your goal is to transform complex medical syllabi into structured, multi-modal learning journeys (Audio Scripts, Visual Maps, and Adaptive Quizzes).

# CONSTRAINTS
- Never hallucinate medical facts. If a resource is unclear, state "Insufficient clinical data."
- Use "Plus Jakarta Sans" font styling cues in descriptions.
- Keep "Patient Mode" simple enough for a non-medic to understand.
`;

export const PROMPT_TEMPLATES = {
  /**
   * Protocol 1: Syllabus Parsing
   * Input: Raw Text/PDF content
   */
  SYLLABUS_PARSING: (rawText) => `
${MEDVOICE_SYSTEM_ROLE}
# TASK: Syllabus Parsing
Parse the following syllabus content into a strict JSON structure:
{
  "subject": "Name",
  "units": [
    { "unit_name": "Unit 1", "topics": ["Topic A", "Topic B"] }
  ]
}

CONTENT:
${rawText}
`,

  /**
   * Protocol 2: Content Generation (Dual-Stream)
   * Input: Topic, Mode (Story/Exam/Patient), Resource Context
   */
  CONTENT_GENERATION: (topic, subject, mode, resourceContext) => `
${MEDVOICE_SYSTEM_ROLE}
# TASK: Content Generation
Act as the MedVoice Content Engine. Process the topic [${topic}] from [${subject}].
Context: "${resourceContext}"

# OUTPUT REQUIREMENTS
1. **Visual**: Create a Mermaid.js 'graph TD' flowchart breaking down the topic.
2. **Audio**: Write a script based on [${mode}] mode.
    - Story Mode: Hinglish, analogies.
    - Exam Mode: Professional English, high-yield.
3. **Takeaways**: Extract 3-5 micro-concepts.

# OUTPUT FORMAT (STRICT JSON)
{
  "mermaid_code": "graph TD; A[Node] --> B[Node]; ...",
  "audio_script": "Full text for TTS...",
  "takeaways": [
    {"term": "Concept Name", "definition": "Simple explanation"}
  ],
  "quiz_preview": "Hook for upcoming test."
}
`,

  /**
   * Protocol 3: Mastery Gate (Quiz)
   * Input: Topic
   */
  QUIZ_GENERATION: (topic) => `
${MEDVOICE_SYSTEM_ROLE}
# TASK: Quiz Generation
Generate 10 high-yield MCQs for [${topic}]. 
Include 4 options for each. 
Tag each question with a sub-concept (e.g., 'Pathophysiology', 'Treatment', 'Anatomy') so I can track my weaknesses.
Format: JSON array with "question", "options", "correct_index", and "concept_tag".
`,

  /**
   * Protocol 4: Remediation Logic
   * Input: Score, Topic, Missed Tags
   */
  REMEDIATION: (score, topic, missedTags) => `
${MEDVOICE_SYSTEM_ROLE}
# TASK: Remediation
I scored [${score}/10] on [${topic}]. 
I missed questions related to these concepts: [${missedTags.join(', ')}]. 
Provide a concise, 3-paragraph 'Clinical Correction' explaining these concepts simply so I can re-take the exam and pass the 80% threshold.
Tone: Medical Resident persona (encouraging).
`
};
