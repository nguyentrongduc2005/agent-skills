# Testing Rules

> Apply to all behavior changes. Tests provide evidence for the approved
> specification and implementation plan.

## Test Stack

- Unit framework: {{UNIT_TEST_FRAMEWORK}}
- Integration framework: {{INTEGRATION_TEST_FRAMEWORK}}
- End-to-end framework: {{E2E_TEST_FRAMEWORK_OR_REMOVE}}
- Fixtures: `{{TEST_FIXTURE_PATH}}`

## Test Levels

### Unit Tests

- Cover isolated business rules and edge cases.
- Mock only external boundaries or expensive collaborators.
- Do not mock the unit under test.

### Integration Tests

- Cover configuration, persistence, serialization, and collaboration.
- External dependency environment: {{INTEGRATION_TEST_ENVIRONMENT}}

### End-to-End Tests

- Critical flows: {{CRITICAL_E2E_FLOWS_OR_REMOVE}}
- Keep test data isolated and repeatable.

## Required Coverage

Cover where applicable:

- Successful behavior.
- Validation failure.
- Authentication and authorization failure.
- Boundary and edge cases.
- External dependency failure.
- Regression for the original defect.

Coverage policy: {{COVERAGE_POLICY}}

## Test Quality

- Tests must be deterministic and independent.
- Use behavior-oriented names.
- Assert meaningful outputs and side effects.
- Avoid sleeps, order dependence, shared mutable state, and production
  services.
- Do not weaken or delete tests only to obtain a passing result.
- Flaky test policy: {{FLAKY_TEST_POLICY}}

## Commands

- Unit: `{{UNIT_TEST_COMMAND}}`
- Integration: `{{INTEGRATION_TEST_COMMAND}}`
- End-to-end: `{{E2E_TEST_COMMAND_OR_REMOVE}}`
- Full suite: `{{FULL_TEST_COMMAND}}`

## Completion Criteria

- Focused tests pass.
- Relevant regression tests pass.
- Unrun tests and pre-existing failures are reported.
- Acceptance criteria map to verification evidence.
