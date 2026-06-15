---
name: code-quality-review
description: |
  Review the React/Vite codebase for syntax errors, potential bugs, unhandled exceptions,
  and code quality issues. Use ESLint, static analysis, and project conventions to identify
  problematic patterns and suggest fixes. Prefer actionable recommendations for React,
  JavaScript, and configuration files.
applyTo:
  - "**/*.{js,jsx,ts,tsx,json,md}"
---

# Code Quality Review Agent

This custom agent is designed to inspect the project for:
- syntax errors and invalid JavaScript/JSX
- potential runtime bugs and unhandled exceptions
- bad patterns in React components and Router use
- configuration or dependency issues in Vite, ESLint, and package files
- code quality risks, including inconsistent patterns or likely sources of errors

Use this agent when you want a focused, project-wide code review that surfaces
fixes and improvements instead of general development assistance.

## Example prompts
- "Scan the entire project for syntax errors, potential bugs, and unhandled exceptions."
- "Check my codebase for code quality issues or patterns that could lead to errors."
- "Review React components and recommend fixes for any unsafe or inconsistent code."
