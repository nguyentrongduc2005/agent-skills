# Architecture Rules

> Mandatory when changing module boundaries, dependencies, data flow,
> integrations, or cross-cutting behavior.

## Approved Architecture

- Architecture style: {{ARCHITECTURE_STYLE}}
- Primary module root: `{{MODULE_ROOT_PATH}}`
- Shared code location: `{{SHARED_CODE_PATH}}`
- Detailed architecture: `{{ARCHITECTURE_DOC_PATH}}`

## Module Boundaries

- Each module must have one clear responsibility.
- Keep public interfaces small and explicit.
- Do not access another module's internal classes or storage directly.
- Communicate across boundaries through {{MODULE_COMMUNICATION_STYLE}}.
- Place behavior in the module that owns the affected data and rules.
- {{PROJECT_MODULE_RULE}}

## Dependency Direction

- Dependencies flow from {{OUTER_LAYER}} toward {{INNER_LAYER}}.
- Domain logic must not depend directly on transport, persistence, or vendor
  SDK details.
- Infrastructure implementations may depend on application-defined ports.
- Avoid circular dependencies.
- Add shared abstractions only after {{ABSTRACTION_THRESHOLD}} real consumers
  require them.

## Change Rules

- Follow existing package and module organization.
- Extend an existing boundary instead of creating a parallel architecture.
- Do not perform unrelated structural refactors.
- Update architecture docs when ownership, boundaries, or data flow changes.
- Stop for approval before replacing an approved architecture pattern.

## Integration Rules

- Isolate external systems behind {{INTEGRATION_BOUNDARY_PATTERN}}.
- Define timeouts and failure behavior for network calls.
- Do not leak provider-specific models into domain interfaces.
- Make retry and idempotency behavior explicit where applicable.
- {{PROJECT_INTEGRATION_RULE}}

## Review Checklist

- [ ] The owning module is clear.
- [ ] Dependency direction is preserved.
- [ ] Public interfaces are minimal.
- [ ] No circular or hidden dependency was introduced.
- [ ] Architecture documentation was updated when required.
