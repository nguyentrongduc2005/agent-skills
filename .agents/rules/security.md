# Security Rules

> Mandatory for every change. Apply additional sections when handling
> identity, authorization, sensitive data, or external input.

## Secrets

- Never hardcode secrets, credentials, private keys, or access tokens.
- Load secrets through {{SECRET_CONFIGURATION_METHOD}}.
- Do not place real secrets in source, tests, examples, or docs.
- Do not log complete secrets or tokens.
- Rotation process: {{SECRET_ROTATION_PROCESS}}

## Authentication

- Mechanism: {{AUTHENTICATION_MECHANISM}}
- Identity source: {{IDENTITY_SOURCE}}
- Session or token lifetime: {{AUTH_LIFETIME_POLICY}}
- Password hashing: {{PASSWORD_HASHING_ALGORITHM_OR_REMOVE}}
- Revocation policy: {{IDENTITY_REVOCATION_POLICY}}

## Authorization

- Model: {{AUTHORIZATION_MODEL}}
- Enforce authorization server-side at every protected boundary.
- Deny access by default.
- Do not trust client-provided identity, role, ownership, or permissions.
- Ownership rule: {{RESOURCE_OWNERSHIP_RULE}}

## Input and Output

- Validate all external input.
- Encode or sanitize output for its destination.
- Use parameterized queries and structured APIs.
- File upload policy: {{FILE_UPLOAD_POLICY_OR_REMOVE}}
- SSRF protection: {{SSRF_PROTECTION_POLICY_OR_REMOVE}}

## Sensitive Data

- Categories: {{SENSITIVE_DATA_CATEGORIES}}
- Encryption in transit: {{TRANSPORT_ENCRYPTION_POLICY}}
- Encryption at rest: {{STORAGE_ENCRYPTION_POLICY}}
- Retention: {{DATA_RETENTION_POLICY}}
- Log redaction: {{LOG_REDACTION_POLICY}}

## Errors and Logging

- Do not expose stack traces, secrets, internal paths, or security decisions.
- Use generic authentication errors when details enable account enumeration.
- Security audit mechanism: {{SECURITY_AUDIT_MECHANISM}}
- Never log passwords, keys, full tokens, or
  {{ADDITIONAL_LOG_PROHIBITION}}.

## Dependencies and Verification

- Use supported dependency versions.
- Review new dependencies for maintenance, license, and vulnerabilities.
- Vulnerability scan: `{{SECURITY_SCAN_COMMAND}}`
- Security tests: `{{SECURITY_TEST_COMMAND}}`

## Review Checklist

- [ ] Authentication and authorization failures are tested.
- [ ] External input is validated.
- [ ] Sensitive data is absent from logs and responses.
- [ ] Security configuration fails safely.
