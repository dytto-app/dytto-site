# Dytto Site

This repository contains the codebase for the Dytto marketing website.

## Automated Documentation with AI Librarian

This project utilizes an automated AI Librarian workflow to ensure documentation remains accurate and up-to-date.

**How it works:**
- On every push to the `main` or `master` branches, or when manually triggered via `workflow_dispatch`, the `AI Librarian (Corrected Goal-Oriented Workflow)` GitHub Action (`.github/workflows/GeminiDocumentor.yml`) is executed.
- The workflow runs an AI agent (powered by Google Gemini) with the responsibility of analyzing recent code changes and updating relevant documentation files.
- If the AI agent makes any changes to the documentation, it automatically creates a pull request titled "📖 From the Librarian: Documentation Update" for review.

This automation helps maintain high-quality documentation with minimal manual effort.