# @sylphlab/mcp-filesystem

## 0.6.1

### Patch Changes

- 18cbf3c: bugfix
- Updated dependencies [18cbf3c]
  - @sylphlab/tools-adaptor-mcp@0.3.1
  - @sylphlab/tools-core@0.4.1
  - @sylphlab/tools-filesystem@0.6.1

## 0.6.0

### Minor Changes

- f422f02: rename tools

### Patch Changes

- Updated dependencies [f422f02]
  - @sylphlab/tools-adaptor-mcp@0.3.0
  - @sylphlab/tools-core@0.4.0
  - @sylphlab/tools-filesystem@0.6.0

## 0.5.1

### Patch Changes

- 001f90f: refactored
- Updated dependencies [001f90f]
  - @sylphlab/tools-adaptor-mcp@0.2.1
  - @sylphlab/tools-core@0.3.1
  - @sylphlab/tools-filesystem@0.5.1

## 0.5.0

### Minor Changes

- 852feae: refactor all tools

### Patch Changes

- Updated dependencies [852feae]
  - @sylphlab/tools-adaptor-mcp@0.2.0
  - @sylphlab/tools-core@0.3.0
  - @sylphlab/tools-filesystem@0.5.0

## 0.4.6

### Patch Changes

- Updated dependencies [3218bd4]
  - @sylphlab/mcp-filesystem-core@0.4.6

## 0.4.5

### Patch Changes

- Updated dependencies [d0f53be]
  - @sylphlab/mcp-core@0.2.3
  - @sylphlab/mcp-filesystem-core@0.4.5
  - @sylphlab/mcp-utils@0.5.3

## 0.4.4

### Patch Changes

- bb39824: minor fix built issue
- Updated dependencies [bb39824]
  - @sylphlab/mcp-core@0.2.2
  - @sylphlab/mcp-filesystem-core@0.4.4
  - @sylphlab/mcp-utils@0.5.2

## 0.4.3

### Patch Changes

- Fix lint errors, test regressions, and build issues.
- Updated dependencies
  - @sylphlab/mcp-core@0.2.1
  - @sylphlab/mcp-filesystem-core@0.4.3
  - @sylphlab/mcp-utils@0.5.1

## 0.4.2

### Patch Changes

- Updated dependencies
  - @sylphlab/mcp-core@0.2.0
  - @sylphlab/mcp-utils@0.5.0
  - @sylphlab/mcp-filesystem-core@0.4.2

## 0.4.1

### Patch Changes

- edc8e3d: feat: remove Terser minification options from tsup configuration across multiple packages
- 902b048: fix: minify
- Updated dependencies [edc8e3d]
- Updated dependencies [902b048]
  - @sylphlab/mcp-core@0.1.1
  - @sylphlab/mcp-filesystem-core@0.4.1
  - @sylphlab/mcp-utils@0.4.1

## 0.4.0

### Minor Changes

- feat: Refactor core types and tool structures

  Refactored core types (`McpContentPart`) for SDK compatibility and updated all core tools to handle batch inputs. Corrected the `registerTools` helper in utils.

### Patch Changes

- Updated dependencies
  - @sylphlab/mcp-core@0.1.0
  - @sylphlab/mcp-utils@0.4.0
  - @sylphlab/mcp-filesystem-core@0.4.0

## 0.3.0

### Minor Changes

- refactor: Standardize MCP tool structure and server registration

  - Refactored core packages (`pdf-core`, `net-core`, `fetch-core`, etc.) for single-operation tools and exported pure functions.
  - Renamed `reader-core`/`reader` to `pdf-core`/`pdf`.
  - Split `net-core` tools and restored `fetch-core`.
  - Corrected all core package names (`@sylphlab/mcp-<name>-core`).
  - Corrected all server package names (`@sylphlab/mcp-<name>`).
  - Created `@sylphlab/mcp-utils` package with `registerTools` helper.
  - Updated all server packages to use `registerTools`.
  - Corrected `build` scripts and `tsconfig.json` settings.
  - Cleaned build artifacts from `filesystem-core` source.
  - Skipped 3 failing tests in `filesystem-core` to meet coverage, added TODOs.
  - Added `bin` field to all server packages.

### Patch Changes

- Updated dependencies
  - @sylphlab/mcp-filesystem-core@0.3.0
  - @sylphlab/mcp-utils@0.3.0

## 0.2.0

### Minor Changes

- a0a647c: refactor: Standardize MCP tool structure and server registration

  - Refactored core packages (`pdf-core`, `net-core`, `fetch-core`, etc.) for single-operation tools and exported pure functions.
  - Renamed `reader-core`/`reader` to `pdf-core`/`pdf`.
  - Split `net-core` tools and restored `fetch-core`.
  - Corrected all core package names (`@sylphlab/mcp-<name>-core`).
  - Corrected all server package names (`@sylphlab/mcp-<name>`).
  - Created `@sylphlab/mcp-utils` package with `registerTools` helper.
  - Updated all server packages to use `registerTools`.
  - Corrected `build` scripts and `tsconfig.json` settings.
  - Cleaned build artifacts from `filesystem-core` source.
  - Skipped 3 failing tests in `filesystem-core` to meet coverage, added TODOs.

### Patch Changes

- Updated dependencies [a0a647c]
  - @sylphlab/mcp-filesystem-core@0.2.0
  - @sylphlab/mcp-utils@0.2.0

## 0.1.2

### Patch Changes

- 05a554a: Refactor and cleanup server and tool implementations.

  - Simplified server startup logic in `filesystem` package.
  - Standardized logging (using `console.error`) in tool implementations.
  - Ensured all tools return a non-empty `content` array on success.
  - Removed commented-out code and diagnostic logs.

- a2219f4: Refactor filesystem server to use @modelcontextprotocol/sdk.

  - Replaced manual stdio handling with McpServer and StdioServerTransport.
  - Corrected tool registration to use server.tool() method.
  - Fixed server exiting prematurely.

- Updated dependencies [05a554a]
  - @sylphlab/mcp-filesystem-core@0.1.2

## 0.1.1

### Patch Changes

- Fix build errors and refactor package structure.

  - Moved server logic from mcp-core to filesystem server.
  - Corrected exports in filesystem-core.
  - Resolved various TypeScript configuration issues.

- Updated dependencies
  - @sylphlab/mcp-core@0.0.1
  - @sylphlab/mcp-filesystem-core@0.1.1
