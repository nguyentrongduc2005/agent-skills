# API Design Rules

> Apply when creating or changing HTTP, RPC, event, or other public
> application interfaces.

## API Style

- API type: {{API_TYPE}}
- Base path or namespace: `{{API_BASE_PATH}}`
- Versioning strategy: {{API_VERSIONING_STRATEGY}}
- Contract source of truth: `{{API_CONTRACT_PATH}}`

## Naming and Resources

- Use {{RESOURCE_NAMING_CONVENTION}} for resource names.
- Use consistent pluralization.
- Prefer nouns for resources and protocol semantics for actions.
- Keep fields consistent with existing APIs.
- Do not expose persistence entities directly.

## Requests

- Validate input at the boundary.
- Define required, optional, nullable, and defaulted fields explicitly.
- Unknown field policy: {{UNKNOWN_FIELD_POLICY}}
- Maximum request size: {{MAX_REQUEST_SIZE_OR_POLICY}}
- Pagination style: {{PAGINATION_STYLE}}
- Filtering and sorting style: {{FILTER_SORT_STYLE}}

## Responses

- Success envelope: {{SUCCESS_RESPONSE_STYLE}}
- Error envelope: {{ERROR_RESPONSE_STYLE}}
- Date and time format: {{DATE_TIME_FORMAT}}
- Identifier format: {{IDENTIFIER_FORMAT}}
- Empty result behavior: {{EMPTY_RESULT_BEHAVIOR}}

## Status and Errors

| Condition          | Status                     | Error code                       |
| ------------------ | -------------------------- | -------------------------------- |
| Validation failure | {{VALIDATION_STATUS}}      | `{{VALIDATION_ERROR_CODE}}`      |
| Unauthenticated    | {{UNAUTHENTICATED_STATUS}} | `{{UNAUTHENTICATED_ERROR_CODE}}` |
| Forbidden          | {{FORBIDDEN_STATUS}}       | `{{FORBIDDEN_ERROR_CODE}}`       |
| Not found          | {{NOT_FOUND_STATUS}}       | `{{NOT_FOUND_ERROR_CODE}}`       |
| Conflict           | {{CONFLICT_STATUS}}        | `{{CONFLICT_ERROR_CODE}}`        |
| Unexpected failure | {{SERVER_ERROR_STATUS}}    | `{{SERVER_ERROR_CODE}}`          |

- Do not expose stack traces or internal exception details.
- Use one stable error contract across endpoints.

## Compatibility

- Preserve backward compatibility unless an approved spec permits a breaking
  change.
- Additive field policy: {{ADDITIVE_FIELD_POLICY}}
- Breaking change process: {{BREAKING_CHANGE_PROCESS}}
- Update contracts and examples whenever behavior changes.

## Security and Testing

- Authenticate and authorize at the boundary.
- Never return secrets, password hashes, or internal security state.
- Rate-limit policy: {{RATE_LIMITED_ENDPOINTS_OR_POLICY}}
- Follow `.agents/rules/security.md`.
- API verification command: `{{API_TEST_COMMAND}}`
