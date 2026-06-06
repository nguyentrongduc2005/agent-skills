# {{PROJECT_NAME}} Architecture Overview

> This is orientation, not exhaustive design documentation. Keep mandatory
> rules in `.agents/rules/architecture.md` and details in `docs/`.

## Architecture Style

{{PROJECT_NAME}} uses {{ARCHITECTURE_STYLE}}.

Key characteristics:

- {{ARCHITECTURE_CHARACTERISTIC_1}}
- {{ARCHITECTURE_CHARACTERISTIC_2}}
- {{ARCHITECTURE_CHARACTERISTIC_3}}

## System Components

| Component       | Responsibility                 | Technology                 | Location               |
| --------------- | ------------------------------ | -------------------------- | ---------------------- |
| {{COMPONENT_1}} | {{COMPONENT_1_RESPONSIBILITY}} | {{COMPONENT_1_TECHNOLOGY}} | `{{COMPONENT_1_PATH}}` |
| {{COMPONENT_2}} | {{COMPONENT_2_RESPONSIBILITY}} | {{COMPONENT_2_TECHNOLOGY}} | `{{COMPONENT_2_PATH}}` |
| {{COMPONENT_3}} | {{COMPONENT_3_RESPONSIBILITY}} | {{COMPONENT_3_TECHNOLOGY}} | `{{COMPONENT_3_PATH}}` |

## Dependency Direction

```text
{{ENTRY_LAYER}}
    -> {{APPLICATION_LAYER}}
        -> {{DOMAIN_LAYER}}
            -> {{INFRASTRUCTURE_PORTS}}
```

- {{DEPENDENCY_RULE_1}}
- {{DEPENDENCY_RULE_2}}
- {{DEPENDENCY_RULE_3}}

## Main Data Flow

1. {{DATA_FLOW_STEP_1}}
2. {{DATA_FLOW_STEP_2}}
3. {{DATA_FLOW_STEP_3}}
4. {{DATA_FLOW_STEP_4}}

## Data Ownership

| Data              | Owning component | Source of truth            |
| ----------------- | ---------------- | -------------------------- |
| {{DATA_DOMAIN_1}} | {{DATA_OWNER_1}} | {{DATA_SOURCE_OF_TRUTH_1}} |
| {{DATA_DOMAIN_2}} | {{DATA_OWNER_2}} | {{DATA_SOURCE_OF_TRUTH_2}} |

## Integration Boundaries

| Integration       | Direction                   | Protocol                   | Failure strategy                   |
| ----------------- | --------------------------- | -------------------------- | ---------------------------------- |
| {{INTEGRATION_1}} | {{INTEGRATION_1_DIRECTION}} | {{INTEGRATION_1_PROTOCOL}} | {{INTEGRATION_1_FAILURE_STRATEGY}} |
| {{INTEGRATION_2}} | {{INTEGRATION_2_DIRECTION}} | {{INTEGRATION_2_PROTOCOL}} | {{INTEGRATION_2_FAILURE_STRATEGY}} |

## Cross-Cutting Concerns

- Authentication: {{AUTHENTICATION_OVERVIEW}}
- Authorization: {{AUTHORIZATION_OVERVIEW}}
- Observability: {{OBSERVABILITY_OVERVIEW}}
- Error handling: {{ERROR_HANDLING_OVERVIEW}}
- Configuration: {{CONFIGURATION_OVERVIEW}}

## Architecture Documentation

- `{{DETAILED_ARCHITECTURE_DOC_PATH}}`
- `{{ARCHITECTURE_DECISION_RECORD_PATH}}`
