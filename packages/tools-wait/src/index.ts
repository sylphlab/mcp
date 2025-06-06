// src/index.ts for @sylphlab/mcp-wait-core

// Export the tool implementation, Zod schema, and inferred type
export { waitTool } from './tools/waitTool.js';
export { waitToolInputSchema } from './tools/waitTool.schema.js'; // Export schema from schema file
export type { WaitToolInput, WaitResultItem, WaitInputItem } from './tools/waitTool.js';
