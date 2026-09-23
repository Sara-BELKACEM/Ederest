# EDEREST — Learner Feedback Loop Prototype

> **EdTech Hack&Hire · 3-Day Project Brief**
> Mastercard Foundation EdTech Fellowship · 3 working days · Team of 4 · 22–24 September

---

## 1. Project Context

### 1.1 About Ederest (The Startup)

Ederest runs **two products on one stack**:

- **LMS / Academy** — a web application delivering professional programmes (notably SAP).
- **Digital Adoption Platform (DAP)** — a Chromium browser extension that overlays guided tutorials on real software.

**Existing tech stack:**

| Layer       | Technology                             |
| ----------- | -------------------------------------- |
| Backend     | Python · FastAPI · modular monolith    |
| Frontend    | React SPA                              |
| Database    | PostgreSQL                             |
| Analytics   | Self-hosted PostHog                    |
| Hosting     | Azure                                  |
| AI in prod  | Screenshots → step-by-step tutorials  |

### 1.2 The Problem

Ederest captures **technical events** (clicks, page views), but does **not** systematically collect:

- **Where** a learner gets stuck on a task
- **What** they think at that moment
- **Why** they give up

That feedback exists only in scattered conversations. Additionally, today's exercises assume a mouse — learners who cannot use one are excluded entirely.

### 1.3 The Challenge

> Build a **lightweight, accessible feedback loop** around a guided software task:
> 1. **Detect** the moment a learner is stuck
> 2. **Offer** help and a short question at that moment
> 3. **Turn** the raw free-text answers into readable insight for the team

---

## 2. Testable Hypothesis (Agreed with Startup — Day 1)

> **If** a learner who is stuck on a step gets an accessible hint and a one-tap question at that exact moment, **then** more learners will get past that step, **and** the AI-surfaced themes will identify the same steps as the measured drop-off data, with enough specificity for the team to name a concrete fix.

**Falsification measure:** The step named by the top AI theme is *not* among the steps with the highest measured drop-off, or completion past the blocking step does not improve with hints on.

---

## 3. Business / User Objectives

- Give Ederest a **structured, continuous source** of learner feedback instead of ad-hoc conversations.
- Make **blocking steps visible** so guides and content can be fixed where it actually hurts.
- Make the guide **usable by every learner**, including learners who cannot use a mouse.
- Show how AI can compress dozens of free-text comments into a **short list of actionable themes**.
- Collect the team's own **product ideas** on accessibility and on making software easier to learn.

---

## 4. Proposed MVP

An accessible learner feedback loop made of **four connected pieces**:

```
┌─────────────────────┐     ┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  1. PRACTICE TASK   │────▶│  2. SURVEY WIDGET │────▶│  3. COLLECTION API   │────▶│  4. DASHBOARD + AI   │
│  Mock software      │     │  Rating + open    │     │  Anonymous storage   │     │  Rates, drop-off,    │
│  screen with step   │     │  question at      │     │  with step context   │     │  themes, actionable  │
│  guide + hints      │     │  stuck moments    │     │                      │     │  summaries           │
└─────────────────────┘     └──────────────────┘     └──────────────────────┘     └──────────────────────┘
```

### User Journey

1. **Input** — A learner practises a task on the mock software screen, gets stuck on a step or leaves, and is offered a hint and a two-question survey.
2. **Process** — The answer and session events are stored anonymously with step context; the AI layer periodically analyses the collected free text.
3. **Output** — The Ederest team opens the dashboard and sees response rates, drop-off and ratings per step, and 3–5 themes summarising what learners said.
4. **User action** — The team decides which step, hint or instruction to fix first, based on the ranked themes.

---

## 5. Team Composition

| Role                     | Count | Responsibilities                                                                                                         |
| ------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------ |
| **Full-Stack Developer** | 2     | Practice screen with step guide, embeddable micro-survey component, collection API, insight dashboard                   |
| **AI Engineer**          | 1     | Analysis layer: clustering free-text answers into themes with sentiment and suggested actions                            |
| **Digital Marketer**     | 1     | Stuck moment design, survey wording for high response rates, KPI definitions, tester recruitment                         |

> Every participant contributes **2 idea cards** (see section 7.3).

---

## 6. Functional Requirements

### 6.1 Must Have

- [ ] **Guided practice task** — a mock business software screen (e.g. "create a purchase order") with a **4-step guide** showing the current step and a hint.
- [ ] **Stuck detection** — triggers the survey when:
  - No progress on a step for a set time
  - Repeated wrong clicks
  - Learner leaves the task
  - End of the task
- [ ] **Embeddable survey widget** — one rating question + one open question, triggerable at stuck moments.
- [ ] **Keyboard-only accessibility** — visible focus, Tab, Enter, Escape, with labels for screen readers. The entire guide and widget must work without a mouse.
- [ ] **Collection endpoint** — stores the answer with task & step context, trigger type and timestamp, **without personal identifiers**.
- [ ] **Dashboard** — shows:
  - Response rate per trigger moment
  - Average rating per step
  - List of raw comments
- [ ] **AI analysis view** — groups comments into 3–5 themes with a short summary per theme.
- [ ] **Evidence instrumentation** — drop-off per step computed from session events (independent of survey answers), so AI themes can be cross-checked.
- [ ] **Theme traceability** — each generated theme must cite the number of comments behind it and the step(s) concerned.
- [ ] **Idea cards** — 2 per participant (one on accessibility, one on making software easier to learn): the moment, the idea, how to test it, how to measure it. Included in handover pack.

### 6.2 Should Have

- [ ] Voice command to drive the guide ("next", "repeat", "back") via browser speech recognition.
- [ ] Read-aloud of the current step.
- [ ] Hints on/off switch to compare completion with and without hints.
- [ ] Sentiment classification per comment (positive / neutral / negative).
- [ ] Drop-off view showing at which step learners stop.
- [ ] Export of the insight summary as a shareable file.

### 6.3 Could Have / Stretch Goals

- [ ] AI-suggested rewrite of the step instruction behind each theme.
- [ ] Multi-language handling (French, English, Arabic) in the analysis layer.
- [ ] Weekly digest email mock-up.

---

## 7. Technical Requirements

### 7.1 Stack

| Layer      | Technology                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Frontend   | **React + TypeScript** — practice screen, guide, widget, dashboard. Guide + widget = one self-contained component (for future DAP extension embedding). |
| Backend    | **Python FastAPI** (or equivalent) — 2–3 endpoints: `events`, `responses`, `insights`.              |
| Database   | **PostgreSQL or SQLite** — 4–5 tables: `steps`, `sessions`, `events`, `responses`, `themes`.        |
| AI         | Existing **LLM API** for clustering and summarisation. No model training.                           |

### 7.2 Privacy (Hard Constraint)

- Store an **anonymous session identifier only** — never names, emails, or IP addresses.
- **Strip emails and phone numbers** from comments before storage.
- This is a deliberate design constraint from Ederest (privacy-by-design).

### 7.3 Accessibility

- **Keyboard-only walkthrough** of the entire task before the demo.
- **Automated audit** (Lighthouse or axe) before the demo.

### 7.4 Data Seeding

- Seed the database with **30–60 realistic sample responses** and matching session events so the dashboard is meaningful during the demo.

---

## 8. Evidence of Learning — What to Measure

| Metric                     | Description                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Response rate              | Per trigger moment — a signal nobody answers is not a signal                             |
| Diagnostic validity        | Do the AI-surfaced themes match the steps with the highest measured drop-off?            |
| Persistence                | Do more testers get past the blocking step with hints on vs. hints off?                  |
| Accessibility              | Can the whole task, hint and survey be completed with keyboard only?                     |
| Dashboard readability      | Can a reader name the step to fix first (and why) in under 60 seconds?                   |
| Theme specificity          | "Step 3 doesn't say which field to fill" = actionable · "the software is difficult" = not |

---

## 9. Acceptance Criteria

- [ ] A survey submitted during the demo is visible in the dashboard **within a few seconds**.
- [ ] The dashboard displays **response rate and average rating per step**.
- [ ] The AI layer produces **3–5 coherent themes** from collected comments.
- [ ] **No personal identifier** is stored anywhere in the database.
- [ ] The whole task, hint and survey can be completed with **keyboard only**.
- [ ] The whole loop can be demonstrated in **under 3 minutes**.
- [ ] The **top AI theme** corresponds to a step that the independent drop-off data also flags.
- [ ] A reader unfamiliar with the project can **name the step to fix first** after 60 seconds on the dashboard.

---

## 10. What Is NOT Expected

> [!IMPORTANT]
> These items are explicitly **out of scope**. Do not build them.

- ❌ Integration into the production LMS, the DAP browser extension, or PostHog.
- ❌ Azure or Kubernetes deployment.
- ❌ Authentication and user management.
- ❌ Automated test coverage or CI/CD pipelines.
- ❌ Production-ready code — the prototype proves the idea; Ederest's product team rebuilds what is kept.
- ❌ Scraping tools, mobile applications, or QA process documentation.
- ❌ CNDP compliance documentation.

---

## 11. Assumptions

- A standalone prototype with a mock software screen is acceptable; **no access to production data or code** is required.
- Sample learner comments and session events can be **generated by the team** if the startup cannot provide real ones.
- An **LLM API key** will be available.
- **Anonymous collection** is sufficient for the prototype (privacy-by-design).

---

## 12. Agreed Design Decisions (from Startup Q&A)

| Question                                         | Decision                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| When should the survey appear?                   | When stuck on a step (no progress, repeated wrong clicks), leaves the task, or finishes it.                  |
| Can Ederest share real learner feedback?          | The team generates realistic samples; Ederest reviews them.                                                  |
| Which KPIs on the dashboard?                     | Completion per task, drop-off per step, response rate per trigger moment, top blockers.                      |
| Which languages do learners write in?            | Mostly French; analysis should also handle English and Arabic.                                                |
| Embeddable in DAP extension or LMS only?          | In the DAP extension later; guide + widget built as one self-contained component.                            |

---

## 13. 3-Day Execution Plan

### Day 1 — Frame, Scope & Build the Foundation (Remote)

- [ ] Understand the practice task and agree on stuck moments with the startup.
- [ ] Fix the data model and survey questions (Digital Marketer leads the wording).
- [ ] Set up the project, database, and mock software screen with step guide.

**Deliverables (submit by 17:00):**

| ID   | Deliverable              | Description                                                                                               |
| ---- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| D1.1 | Challenge Canvas         | One page: the learning problem, the product decision, and the evidence that would show it worked.        |
| D1.2 | Testable hypothesis      | Written out and confirmed with startup, including the falsification measure.                              |
| D1.3 | Scope confirmed          | Must-Have list reviewed with startup; additions/drops justified.                                         |
| D1.4 | Technical foundation     | Mock screen + step guide, data model, survey wording, stuck moments — all demonstrable.                  |
| D1.5 | Stand-up                 | 2 minutes to coordinator: the hypothesis and chosen measure, stated out loud.                             |

---

### Day 2 — Build, Integrate & Instrument (On-Site)

- [ ] Build the widget, stuck detection, and collection endpoint.
- [ ] Seed realistic sample data and build dashboard views.
- [ ] Build and test the AI clustering and summarisation layer.
- [ ] Connect the dashboard to AI output.
- [ ] Verify end-to-end: learner stuck → answers widget → answer appears in dashboard.
- [ ] Run the keyboard-only walkthrough.

**Deliverables (submit by 16:30, before technical dry-run):**

| ID   | Deliverable              | Description                                                                                               |
| ---- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| D2.1 | Working vertical slice   | End-to-end: stuck learner answers widget → answer in dashboard.                                          |
| D2.2 | Evidence instrumented    | Drop-off per step computed independently; AI theme output stored alongside for comparison.                |
| D2.3 | First measurement        | At least one real run of the measure, numbers written down (rough is fine, absent is not).                |
| D2.4 | Scope and risk log       | What will be finished tomorrow, what will not, and what could still break.                                |
| D2.5 | Dry-run                  | 3-minute demo of the working slice to the Geeks mentors.                                                 |

---

### Day 3 — Finalise, Measure & Pitch (On-Site)

- [ ] Complete Must-Haves and stop new development by late morning.
- [ ] Check AI summary quality against seeded data and adjust the prompt.
- [ ] Improve dashboard readability, fix bugs, and finalise idea cards.
- [ ] Prepare the demo scenario and pitch.

**Deliverables (submit by 12:00, before pitch session):**

| ID   | Deliverable         | Description                                                                                                    |
| ---- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| D3.1 | MVP complete        | Against the Must-Have list and acceptance criteria.                                                            |
| D3.2 | Evidence report     | 1 page: AI themes vs. drop-off comparison, 60-sec readability test (3+ people), keyboard walkthrough result.  |
| D3.3 | Pitch deck          | ≤10 slides: hypothesis, evidence collected, what it would take to test at scale.                               |
| D3.4 | Handover pack       | Repository, README, open questions for the startup, and idea cards.                                            |
| D3.5 | Pitch               | 10 minutes + 5 minutes Q&A before the jury.                                                                   |

---

## 14. Development Tasks Breakdown

> [!NOTE]
> This is the full task list derived from the project brief, organized by component. Each task maps directly to a Must-Have or Should-Have requirement.

### 14.1 Frontend — Practice Screen & Step Guide

- [ ] Create the mock business software screen (e.g. "Create a Purchase Order" in an SAP-like UI).
- [ ] Implement a 4-step guide overlay showing the current step number, instruction, and a hint.
- [ ] Build stuck detection logic:
  - Timer-based: no progress on a step after N seconds.
  - Click-based: repeated wrong clicks detected.
  - Navigation-based: learner navigates away / leaves the task.
  - Completion trigger: end of the task.
- [ ] Ensure full keyboard navigation: visible focus ring, Tab / Shift+Tab, Enter to confirm, Escape to dismiss.
- [ ] Add ARIA labels and screen reader support.
- [ ] Build the guide + widget as a **single self-contained component** (for future DAP extension embedding).

### 14.2 Frontend — Survey Widget

- [ ] Create the embeddable micro-survey widget:
  - One rating question (e.g. 1–5 stars or emoji scale).
  - One open-text question.
- [ ] Trigger the widget on stuck detection events.
- [ ] Make the widget fully keyboard-accessible.
- [ ] Add close / dismiss functionality (Escape key).

### 14.3 Backend — Collection API (FastAPI)

- [ ] Set up Python FastAPI project structure.
- [ ] Design and implement the database schema (4–5 tables: `steps`, `sessions`, `events`, `responses`, `themes`).
- [ ] `POST /events` — record session events (step transitions, clicks, time spent).
- [ ] `POST /responses` — store survey answers with task/step context, trigger type, and timestamp.
- [ ] `GET /insights` — return aggregated data for the dashboard.
- [ ] Implement **PII stripping** — remove emails and phone numbers from comments before storage.
- [ ] Ensure **no personal identifiers** are stored (anonymous session ID only).

### 14.4 Frontend — Dashboard

- [ ] Build the main dashboard page with:
  - Response rate per trigger moment.
  - Average rating per step.
  - List of raw comments.
- [ ] Build the **AI analysis view**:
  - Display 3–5 themes with summary per theme.
  - Show comment count and step(s) per theme.
- [ ] Build the **drop-off view** showing at which step learners stop (evidence instrumentation).
- [ ] Ensure dashboard readability: a reader should name the step to fix in under 60 seconds.

### 14.5 AI — Clustering & Summarisation Layer

- [ ] Integrate with an LLM API (e.g. OpenAI, Anthropic, or equivalent).
- [ ] Build the clustering pipeline: group free-text comments into 3–5 themes.
- [ ] Generate a short summary per theme with:
  - Number of comments behind it.
  - Step(s) concerned.
  - Actionable specificity (not vague).
- [ ] Store AI-generated themes in the database for dashboard retrieval.
- [ ] Handle multi-language input (French primarily, plus English and Arabic).

### 14.6 Data Seeding

- [ ] Generate **30–60 realistic sample survey responses** across all 4 steps.
- [ ] Generate matching **session events** (step transitions, timings, clicks, drop-offs).
- [ ] Ensure seeded data produces meaningful dashboard visualisations and AI themes.
- [ ] Vary the data to create clear patterns (e.g. Step 3 has the highest drop-off and most negative comments).

### 14.7 Accessibility & QA

- [ ] Complete keyboard-only walkthrough of the entire flow.
- [ ] Run automated accessibility audit (Lighthouse or axe).
- [ ] Fix any accessibility issues found.
- [ ] Run the 60-second readability test with 3+ people outside the team.

### 14.8 Evidence & Measurement

- [ ] Compute drop-off per step independently from session events (not from survey data).
- [ ] Compare AI-surfaced themes against drop-off data — do they flag the same steps?
- [ ] Test hints on/off if time allows — does completion change?
- [ ] Write the one-page evidence report (D3.2).

### 14.9 Deliverables & Presentation

- [ ] Write the Challenge Canvas (D1.1).
- [ ] Document the testable hypothesis (D1.2).
- [ ] Confirm and document the scope (D1.3).
- [ ] Create the pitch deck (≤10 slides) (D3.3).
- [ ] Prepare the handover pack: repo, README, open questions, idea cards (D3.4).
- [ ] Prepare and rehearse the demo scenario (≤3 min loop).
- [ ] Create 2 idea cards per participant (8 total).

---

## 15. Optional Enhancements (If Time Permits)

- [ ] Voice command: "next", "repeat", "back" via Web Speech API.
- [ ] Read-aloud of current step instruction.
- [ ] Hints on/off toggle for A/B comparison.
- [ ] Sentiment classification per comment (positive / neutral / negative).
- [ ] Export insight summary as PDF or shareable file.
- [ ] AI-suggested rewrite of step instructions per theme.
- [ ] Weekly digest email mock-up.

---

## 16. Key Constraints Summary

| Constraint       | Detail                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| **Privacy**      | Anonymous session ID only. Strip PII from comments. No names/emails/IPs. |
| **Accessibility**| Full keyboard navigation. ARIA labels. Lighthouse/axe audit.           |
| **Scope**        | Prototype only — no production deployment, no auth, no CI/CD.          |
| **Data**         | 30–60 seeded responses. No real production data needed.                |
| **AI**           | LLM API only. No model training. Diagnostic accuracy is the measure.   |
| **Timeline**     | 3 days. Must-Haves frozen by Day 3 late morning.                       |
| **Languages**    | French (primary), English, Arabic.                                     |

---

> **Source:** [Ederest Project Brief — agreed scope.pdf](file:///c:/Users/hp/Ederest/Doc/Ederest%20Project%20Brief%20-%20agreed%20scope.pdf)
