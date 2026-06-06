# Coding Style Rules

> Apply to all source and test code. Replace language-specific placeholders
> and remove sections that do not apply.

## General

- Language and version: {{LANGUAGE_AND_VERSION}}
- Formatter: `{{FORMAT_COMMAND}}`
- Linter or static analysis: `{{LINT_COMMAND}}`
- Follow naming, layout, and idioms in the surrounding code.
- Prefer readable code over clever code.
- Keep functions and classes focused on one responsibility.
- Avoid unrelated cleanup during scoped work.

## Naming

- Types: `{{TYPE_NAMING_EXAMPLE}}`
- Functions or methods: `{{FUNCTION_NAMING_EXAMPLE}}`
- Variables: `{{VARIABLE_NAMING_EXAMPLE}}`
- Constants: `{{CONSTANT_NAMING_EXAMPLE}}`
- Files: `{{FILE_NAMING_EXAMPLE}}`
- Tests: `{{TEST_NAMING_EXAMPLE}}`

Use domain terminology from `.agents/context/glossary.md`.

## Structure

- Preferred file size: {{PREFERRED_FILE_SIZE_OR_GUIDANCE}}
- Preferred function size: {{PREFERRED_FUNCTION_SIZE_OR_GUIDANCE}}
- Dependency injection style: {{DEPENDENCY_INJECTION_STYLE}}
- Error handling style: {{ERROR_HANDLING_STYLE}}
- Null or optional-value policy: {{NULL_HANDLING_POLICY}}
- Asynchronous code style: {{ASYNC_STYLE_OR_REMOVE}}

## Imports and Dependencies

- Follow the project's import ordering.
- Remove unused imports and dead code introduced by the change.
- Prefer the standard library or existing dependencies.
- New dependencies require {{DEPENDENCY_APPROVAL_REQUIREMENT}}.

## Comments and Documentation

- Comment why a non-obvious decision exists, not what obvious code does.
- Follow project conventions for public API documentation.
- Remove debug output, commented-out code, and temporary comments.

## Language-Specific Rules

- {{LANGUAGE_SPECIFIC_RULE_1}}
- {{LANGUAGE_SPECIFIC_RULE_2}}
- {{LANGUAGE_SPECIFIC_RULE_3}}

## Verification

- Run: `{{FORMAT_COMMAND}}`
- Run: `{{LINT_COMMAND}}`
- Run: `{{COMPILE_OR_TYPECHECK_COMMAND}}`
