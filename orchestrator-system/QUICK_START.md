# Quick Start: 9-Window Parallel Build

## Window Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR (Window 0)                       │
│              Paste: ORCHESTRATOR_AGENT.md                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Window 1   │  Window 2   │  Window 3   │  Window 4   │
│  DATABASE   │   LAYOUT    │ COMPONENTS  │EXPERIMENTAL │
│             │             │             │             │
│   Phase 1   │   Phase 1   │   Phase 1   │   Phase 1   │
└─────────────┴─────────────┴─────────────┴─────────────┘
        │             │             │             │
        └─────────────┴──────┬──────┴─────────────┘
                             │
                      CHECKPOINT 1
                             │
        ┌─────────────┬──────┴──────┬─────────────┐
        │             │             │             │
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Window 5   │  Window 6   │  Window 7   │  Window 8   │
│    AUTH     │     API     │    GRID     │ ANIMATIONS  │
│             │             │             │             │
│   Phase 2   │   Phase 2   │   Phase 2   │   Phase 2   │
└─────────────┴─────────────┴─────────────┴─────────────┘
        │             │             │             │
        └─────────────┴──────┬──────┴─────────────┘
                             │
                      CHECKPOINT 2
                             │
                          DEPLOY
```

---

## Step-by-Step Commands

### 1. Open Orchestrator Window (Window 0)

```bash
cd /Users/johnnysheng/lavasht
claude
```

Then paste the contents of:
```
orchestrator-system/agent-prompts/ORCHESTRATOR_AGENT.md
```

The orchestrator will guide you through setup and tell you when to launch agents.

---

### 2. Phase 1 - Open 4 Agent Windows

**Window 1 - DATABASE:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_1_DATABASE.md
```

**Window 2 - LAYOUT:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_2_LAYOUT.md
```

**Window 3 - COMPONENTS:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_3_COMPONENTS.md
```

**Window 4 - EXPERIMENTAL:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_4_EXPERIMENTAL.md
```

**Wait for:** `.done-database`, `.done-layout`, `.done-components`, `.done-experimental`

---

### 3. Checkpoint 1 (Orchestrator Does This)

```bash
git checkout main
git merge feature/database feature/layout feature/components feature/experimental --no-edit
npm install
npm run build
```

---

### 4. Phase 2 - Open 4 Agent Windows (reuse or new)

**Window 5 - AUTH:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_5_AUTH.md
```

**Window 6 - API:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_6_API.md
```

**Window 7 - GRID:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_7_GRID.md
```

**Window 8 - ANIMATIONS:**
```bash
cd /path/to/joanie-store
claude
# Paste: orchestrator-system/agent-prompts/AGENT_8_ANIMATIONS.md
```

**Wait for:** `.done-auth`, `.done-api`, `.done-grid`, `.done-animations`

---

### 5. Checkpoint 2 & Launch

```bash
git checkout main
git merge feature/auth feature/api feature/grid feature/animations --no-edit
npm install
npm run build
npm run dev
```

---

## Files Reference

| Window | Agent | Prompt File | Branch |
|--------|-------|-------------|--------|
| 0 | ORCHESTRATOR | `ORCHESTRATOR_AGENT.md` | main |
| 1 | DATABASE | `AGENT_1_DATABASE.md` | feature/database |
| 2 | LAYOUT | `AGENT_2_LAYOUT.md` | feature/layout |
| 3 | COMPONENTS | `AGENT_3_COMPONENTS.md` | feature/components |
| 4 | EXPERIMENTAL | `AGENT_4_EXPERIMENTAL.md` | feature/experimental |
| 5 | AUTH | `AGENT_5_AUTH.md` | feature/auth |
| 6 | API | `AGENT_6_API.md` | feature/api |
| 7 | GRID | `AGENT_7_GRID.md` | feature/grid |
| 8 | ANIMATIONS | `AGENT_8_ANIMATIONS.md` | feature/animations |

---

## Completion Signals

Each agent creates a file when done:

| Agent | Signal File |
|-------|-------------|
| DATABASE | `.done-database` |
| LAYOUT | `.done-layout` |
| COMPONENTS | `.done-components` |
| EXPERIMENTAL | `.done-experimental` |
| AUTH | `.done-auth` |
| API | `.done-api` |
| GRID | `.done-grid` |
| ANIMATIONS | `.done-animations` |

Check with: `ls -la .done-*`

---

## Troubleshooting Quick Fixes

**Agent stuck:** Ask "What step are you on? Please continue."

**Merge conflict:** `git checkout --theirs <file>` or manually edit

**Build fails:** `npx tsc --noEmit` to find type errors

**Missing dependency:** `npm install <package>`

**Prisma error:** `npx prisma generate`

---

## Estimated Timeline

| Phase | Duration |
|-------|----------|
| Setup | 10 min |
| Phase 1 (parallel) | 30-45 min |
| Checkpoint 1 | 10 min |
| Phase 2 (parallel) | 30-45 min |
| Checkpoint 2 | 10 min |
| Testing & Deploy | 20 min |
| **Total** | **~2 hours** |
