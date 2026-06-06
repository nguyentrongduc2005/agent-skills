# {{PROJECT_NAME}} AGENTS

> Replace every `{{PLACEHOLDER}}` before using this template. Remove sections
> or entries that do not apply to the project.

## Project Overview

{{PROJECT_SUMMARY}}

{{PRIMARY_USER}} uses the system to:

- {{PRIMARY_CAPABILITY_1}}
- {{PRIMARY_CAPABILITY_2}}
- {{PRIMARY_CAPABILITY_3}}

The goal is to {{PROJECT_GOAL}}.

---

## Tech Stack

Backend:

- {{BACKEND_LANGUAGE_AND_VERSION}}
- {{BACKEND_FRAMEWORK}}

Frontend:

- {{FRONTEND_FRAMEWORK}}

Database:

- {{DATABASE}}

Cache:

- {{CACHE_OR_REMOVE_SECTION}}

Messaging:

- {{MESSAGING_OR_REMOVE_SECTION}}

External or AI Services:

- {{EXTERNAL_SERVICE_OR_REMOVE_SECTION}}

---

## Core Principles

- Prefer simple solutions over unnecessary abstractions.
- Follow the existing project architecture and conventions.
- Keep changes focused on the requested scope.
- Do not introduce frameworks or dependencies without clear justification.
- Preserve existing behavior and backward compatibility unless the approved
  specification requires a change.
- {{PROJECT_SPECIFIC_PRINCIPLE}}

---

## Context

Read only the context relevant to the current task. Context files explain the
project and domain; they do not replace rules or official documentation.

### Project Overview

- `.agents/context/project-overview.md` — project purpose, users, boundaries,
  and high-level system flow

### Glossary

- `.agents/context/glossary.md` — domain terms and project-specific language

### Architecture Context

- `.agents/context/architecture-overview.md` — short orientation to modules,
  services, and ownership boundaries

### Additional Context

- `{{ADDITIONAL_CONTEXT_PATH}}` — {{WHEN_TO_READ_THIS_CONTEXT}}

---

## Workflow Rules

Before making changes:

1. Inspect the existing code and current project state.
2. Understand the impacted modules and behavior.
3. Read only the relevant context and rule documents.
4. Use the matching workflow skill.
5. Do not implement a feature until its required specification and plan are
   approved.

After making changes:

1. Run the focused verification required by the implementation plan.
2. Run the relevant broader test, build, lint, or type-check commands.
3. Confirm the acceptance criteria.
4. Update official documentation when behavior or architecture changes.
5. Report any unrun checks, known failures, deviations, or remaining risks.

---

## References

Read the following rule files when relevant. Rule files contain mandatory
project instructions.

### Architecture

- `.agents/rules/architecture.md`

### Coding Standards

- `.agents/rules/coding-style.md`

### API Design

- `.agents/rules/api-design.md`

### Database

- `.agents/rules/database.md`

### Security

- `.agents/rules/security.md`

### Testing

- `.agents/rules/testing.md`

### Documentation

- `.agents/rules/documentation.md`

### Additional Rules

- `{{ADDITIONAL_RULE_PATH}}` — {{WHEN_THIS_RULE_APPLIES}}

---

## Skills

Use the skill that matches the current workflow stage.

### Brainstorming

- `.agents/skills/brainstorming/SKILL.md`
- Use for new features, components, behavior changes, and design decisions.
- Output: an approved specification in `docs/specs/`.

### Writing Plans

- `.agents/skills/writing-plans/SKILL.md`
- Use after an approved specification exists.
- Output: an approved implementation plan in `docs/plans/`.

### Executing Plans

- `.agents/skills/executing-plans/SKILL.md`
- Use only when an approved implementation plan exists and the user explicitly
  requests implementation.
- Output: implemented and verified project changes.

### Additional Skill

- `{{ADDITIONAL_SKILL_PATH}}` — {{SKILL_PURPOSE}}

When a task matches a skill, read its `SKILL.md` before proceeding. Complete
one workflow stage before starting the next.

---

## Important Constraints

- Do not modify unrelated files.
- Do not discard or overwrite existing user changes.
- Do not rewrite working code without a requirement or technical reason.
- Prefer consistency with the existing codebase.
- Follow applicable rules from `.agents/rules/`.
- Never hardcode, expose, or log secrets.
- Do not claim that verification passed when it was not run.
- Stop and ask before changing an approved API, schema, security rule,
  architecture, or acceptance criterion.
- {{PROJECT_SPECIFIC_CONSTRAINT}}
