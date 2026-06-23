# Domain Context: Zen Koans

This document maps out the domain language and core concepts of the Zen Koans workspace to establish a consistent glossary for maintainers and AI assistants.

## Domain Glossary

### Evaluation
The process of validating a user's answer to a koan. It takes the user's input, injects it into the koan's template, compiles it via a language adapter, and runs it against the assertions defined in the template.

### Compiler Adapter
A concrete implementation that translates user code from a specific programming language (e.g. ClojureScript, Gleam, TypeScript) into JavaScript that can be executed by the runtime.

### Sandbox
A secure, off-thread execution environment (implemented via Web Workers) used to evaluate compiled JavaScript. It enforces strict execution timeouts (to prevent infinite loops freezing the UI) and prevents access to the browser's DOM and cookies.

---

## Architectural Decisions

- **Off-Thread Execution**: All compiler outputs must be executed off the main thread inside the **Sandbox** to maintain UI responsiveness.
- **Unified Seam**: Rather than adapters managing their own thread boundaries and evaluators, they should compile to JavaScript and leverage the **Sandbox** module's leverage for execution.
