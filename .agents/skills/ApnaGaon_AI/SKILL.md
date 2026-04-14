```markdown
# ApnaGaon_AI Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns, coding conventions, and workflows used in the ApnaGaon_AI JavaScript codebase. You'll learn how to structure files, write imports/exports, follow commit conventions, and implement and test features in a consistent, maintainable way.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.js`, `dataFetcher.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { fetchData } from './dataFetcher';
    ```

### Export Style
- Use **named exports** for functions, objects, or constants.
  - Example:
    ```javascript
    // In dataFetcher.js
    export function fetchData() { ... }
    ```

### Commit Messages
- Follow the **conventional commit** format.
- Use the `feat` prefix for new features.
- Keep commit messages concise (average 38 characters).
  - Example:
    ```
    feat: add user profile component
    ```

## Workflows

### Feature Development
**Trigger:** When adding a new feature  
**Command:** `/feature-development`

1. Create a new file using camelCase naming.
2. Write your module using named exports.
3. Import any dependencies using relative paths.
4. Commit your changes using the conventional commit format with the `feat` prefix.
5. (Optional) Add or update test files matching `*.test.*`.

### Testing
**Trigger:** When verifying code correctness  
**Command:** `/run-tests`

1. Identify or create test files following the `*.test.*` pattern.
2. Use your preferred testing framework (none detected; choose one if needed).
3. Run tests manually or with your chosen test runner.

## Testing Patterns

- Test files follow the `*.test.*` naming pattern (e.g., `userProfile.test.js`).
- The specific testing framework is not detected; standard JavaScript testing approaches apply.
- Place test files alongside the modules they test or in a dedicated test directory.

## Commands
| Command                | Purpose                                   |
|------------------------|-------------------------------------------|
| /feature-development   | Start the process for adding a new feature|
| /run-tests             | Run all test files in the codebase        |
```