# Active Context & Current Focus

## Goal
Refactor MCP core and server packages for consistency, testability, and adherence to SDK patterns. Address build issues and ensure correct package naming/dependencies. Finalize and prepare for release.

## Design Decisions & Understanding
- **Core Tool Input:** All core tools (`*-core`) should handle **batch inputs** (e.g., `{ items: [...] }`) in their `inputSchema` and `execute` function for efficiency and reusability.
- **Core Tool Logic:** The `execute` function within each `McpTool` object handles *all* logic (validation, core operation, error handling, output formatting). Pure functions should *not* be exported separately just for testing; tests should target the `execute` method (potentially with mocks for I/O).
- **Core Tool Output (`BaseMcpToolOutput`):** The `content: McpContentPart[]` type in `@sylphlab/mcp-core` needs refinement.
    - **Requirement:** Must be structurally compatible with the array type expected by `@modelcontextprotocol/sdk`'s `server.tool()` handler (which includes specific types like text, image, audio, resource).
    - **Solution (Plan C):** Redefine `McpContentPart` in `@sylphlab/mcp-core` to be a union explicitly matching the SDK's known content part structures (text, image, audio, resource), *without* directly importing SDK types. This ensures compatibility while allowing future extension of `McpContentPart` within our ecosystem if needed.
- **`registerTools` Helper (`@sylphlab/mcp-utils`):** This helper *will* be used by all server packages.
    - **Functionality:** It acts as a *minimal* bridge. It takes the `McpServer` instance and an array of `McpTool` objects. Inside, it loops and calls `server.tool()` for each tool.
    - **Schema Handling:** It should pass `tool.inputSchema.shape` to `server.tool()`.
    - **Handler Function:** The wrapper function passed to `server.tool()` should accept `args: unknown`, re-validate `args` against the full `tool.inputSchema` (which expects the batch structure like `{ items: [...] }`), call `tool.execute(validatedArgs, ...)`, and return the `BaseMcpToolOutput` result directly. Thanks to the refined `McpContentPart` (see above), no complex type mapping or `as any` should be needed in the return.
- **Package Naming:** Core packages use `@sylphlab/mcp-<name>-core`, server packages use `@sylphlab/mcp-<name>`.
- **Server Executability:** All server packages must have a `bin` field in `package.json`.
- **Fetch/Net:** `fetch-core` and `fetch` packages will remain separate from `net-core` and `net` for modularity.

## Progress
- **Completed:**
    - Initial refactoring attempts (some parts incorrect).
    - Package renaming (`reader`->`pdf`, corrected scopes).
    - Build script corrections (`"build": "tsup"`).
    - `tsconfig.json` fixes (`moduleResolution`, `module`).
    - Build artifact cleanup.
    - Dependency updates and successful `pnpm install`.
    - Successful `pnpm run build`.
    - Test failure investigation (`filesystem-core`) and skipping problematic tests.
    - GitHub repo description/topics update.
    - `bin` field added to server packages.
    - Changeset created, version bumps applied, commits pushed.
    - **Task 1: Refine Core Types:** Modified `McpContentPart` in `packages/core/src/index.ts`.
    - **Task 2: Revert Core Tools to Batch Input:** Updated core tools (primarily `base64-core`) for batch input.
    - **Task 3: Correct `registerTools` Helper:** Updated `packages/utils/src/registerTools.ts`.
    - **Task 4: Verify Server Packages:** Verified all server packages use the updated helper.
    - **Task 5: Build & Test:** Successfully built and tested the monorepo, resolving errors and passing all tests.
    - **Task 6: Finalize Release:** Created changeset, versioned, committed, and pushed tags for the refactoring changes.
    - **RAG Core Foundation:** Established package structure (`rag-core`), implemented AST/fallback chunking (`chunking.ts`), Ollama embedding via Vercel AI SDK (`embedding.ts`), ChromaDB/InMemory index management placeholders (`indexManager.ts`), language detection using `highlight.js` (`indexContentTool.ts`), and supporting modules (`parsing.ts`, `types.ts`, `copy-wasm.mjs`). Ensured the package builds successfully.
- **Current State:** MCP core/server refactoring complete. Foundational structure and core logic (chunking, Ollama embedding, ChromaDB indexing placeholders, language detection) for `rag-core` implemented and builds successfully. Markdown AST chunking deferred.

## Next Actions
- Add tests for the implemented `rag-core` functionality (chunking, embedding, indexing).
- Implement remaining vector DB providers (e.g., Pinecone) in `indexManager.ts`.
- Implement remaining embedding providers (e.g., Http) in `embedding.ts`.
- Refine chunking combination/overlap logic.
- Address deferred Markdown AST chunking (requires WASM compilation solution).

## Waiting For
N/A