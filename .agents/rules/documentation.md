# Documentation Rules

> Apply when a change affects behavior, architecture, APIs, data,
> configuration, deployment, or developer workflows.

## Sources of Truth

| Topic        | Document                    |
| ------------ | --------------------------- |
| Architecture | `{{ARCHITECTURE_DOC_PATH}}` |
| API          | `{{API_DOC_PATH}}`          |
| Database     | `{{DATABASE_DOC_PATH}}`     |
| Deployment   | `{{DEPLOYMENT_DOC_PATH}}`   |
| Operations   | `{{OPERATIONS_DOC_PATH}}`   |

Context files under `.agents/context/` provide concise orientation and must
not duplicate detailed official documentation.

## When to Update

Update docs when a change modifies:

- Public behavior or user workflows.
- API contracts, errors, or authentication.
- Database schema or data ownership.
- Module boundaries or architecture.
- Environment variables or configuration.
- Deployment, migration, or operational procedures.

## Writing Style

- Audience: {{DOCUMENTATION_AUDIENCE}}
- Language: {{DOCUMENTATION_LANGUAGE}}
- Use concise headings and concrete examples.
- State defaults, prerequisites, and failure behavior.
- Use exact commands and paths verified in the project.
- Avoid future promises and unresolved placeholders.

## Diagrams

- Format: {{DIAGRAM_FORMAT}}
- Location: `{{DIAGRAM_PATH}}`
- Update diagrams when relationships or data flow change.
- Keep labels consistent with code and glossary terms.

## Examples

- Examples must match the current contract.
- Use safe placeholder credentials and secrets.
- Document required, optional, and default values.
- Validate example commands where practical.

## Review Checklist

- [ ] Affected source-of-truth documents were updated.
- [ ] Context summaries remain accurate.
- [ ] Links, commands, paths, and examples are valid.
- [ ] No real secrets or private data appear in docs.
- [ ] Removed behavior is no longer documented as available.
