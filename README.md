# EDEREST — Learner Feedback Loop Prototype

Accessible, privacy-first feedback collection for a guided software practice
task. The prototype records anonymous learning events and survey responses,
then presents drop-off evidence and AI-generated feedback themes to the team.

## Project structure

```text
.
├── frontend/                         # React + TypeScript SPA
│   └── src/
│       ├── app/                      # App bootstrap, routing, providers
│       ├── assets/                   # Static application assets
│       ├── components/
│       │   ├── dashboard/            # Metrics, themes, comments, drop-off UI
│       │   ├── feedback-loop/        # Embeddable guide + survey widget
│       │   ├── practice-task/        # SAP-like mock task interface
│       │   └── ui/                   # Reusable accessible UI primitives
│       ├── hooks/                    # Stuck detection and UI hooks
│       ├── pages/                    # Practice and dashboard routes
│       ├── services/                 # API client and analytics event helpers
│       ├── styles/                   # Global styles and design tokens
│       └── types/                    # Shared frontend TypeScript types
├── backend/                          # FastAPI service
│   └── app/
│       ├── api/routes/               # events, responses, insights endpoints
│       ├── core/                     # Configuration and application setup
│       ├── db/                       # Database connection and repositories
│       ├── models/                   # steps, sessions, events, responses, themes
│       ├── schemas/                  # Request and response contracts
│       ├── services/
│       │   ├── analysis/             # LLM clustering and insight generation
│       │   └── privacy/              # PII stripping and anonymisation
│       └── seed/                     # Database seed loading
├── data/
│   ├── seed/                         # 30–60 sample responses and session events
│   └── exports/                      # Generated, shareable insight exports
├── docs/
│   ├── accessibility/                # Keyboard walkthrough and audit results
│   ├── deliverables/                 # Challenge canvas, idea cards, handover
│   ├── evidence/                     # Metrics and AI-theme/drop-off comparison
│   └── product/                      # Hypothesis, scope, survey wording
├── scripts/                          # Local seed and maintenance scripts
└── ProjectCont/                      # Supplied project brief and UI/UX reference
```

## MVP boundaries

- `frontend/src/components/feedback-loop` remains self-contained so it can
  later be embedded in Ederest's DAP browser extension.
- `backend/app/services/privacy` removes emails and phone numbers before a
  comment is persisted; sessions must stay anonymous.
- Drop-off evidence is calculated from `events`, independently of survey
  responses and AI themes.
