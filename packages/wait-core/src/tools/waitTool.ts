import { z } from 'zod';
import { McpTool, BaseMcpToolOutput, McpToolInput, McpToolExecuteOptions } from '@sylphlab/mcp-core';

// --- Zod Schemas ---

// Schema for a single wait item
const WaitInputItemSchema = z.object({
  id: z.string().optional(),
  ms: z.number().int().min(0, 'Milliseconds must be a non-negative integer.'),
});

// Main input schema: an array of wait items
export const WaitToolInputSchema = z.object({
  items: z.array(WaitInputItemSchema).min(1, 'At least one wait duration is required.'),
});

// --- TypeScript Types ---
export type WaitInputItem = z.infer<typeof WaitInputItemSchema>;
export type WaitToolInput = z.infer<typeof WaitToolInputSchema>;

// Interface for a single wait result item
export interface WaitResultItem {
  id?: string;
  success: boolean;
  durationWaitedMs?: number;
  error?: string;
  // No suggestion needed for wait
}

// Output interface for the tool (includes multiple results)
export interface WaitToolOutput extends BaseMcpToolOutput {
  results: WaitResultItem[];
  totalDurationWaitedMs?: number; // Sum of successful waits
  error?: string; // Optional overall error if the tool itself fails unexpectedly
}

// --- Helper Function ---

// Helper function to process a single wait item
async function processSingleWait(item: WaitInputItem): Promise<WaitResultItem> {
  const { id, ms } = item;
  const resultItem: WaitResultItem = { id, success: false };

  try {
    console.log(`Waiting for ${ms}ms... (ID: ${id ?? 'N/A'})`);
    await new Promise(resolve => setTimeout(resolve, ms));
    console.log(`Wait finished for ${ms}ms. (ID: ${id ?? 'N/A'})`);
    resultItem.success = true;
    resultItem.durationWaitedMs = ms;
  } catch (e: any) {
    // This catch block is unlikely to be hit for setTimeout unless there's a very strange environment issue.
    resultItem.error = `Wait failed: ${e.message}`;
    console.error(`${resultItem.error} (ID: ${id ?? 'N/A'})`);
    resultItem.success = false;
  }
  return resultItem;
}


// --- Tool Definition ---
export const waitTool: McpTool<typeof WaitToolInputSchema, WaitToolOutput> = {
  name: 'wait',
  description: 'Waits sequentially for one or more specified durations in milliseconds.',
  inputSchema: WaitToolInputSchema, // Schema expects { items: [...] }

  async execute(input: WaitToolInput, workspaceRoot: string, options?: McpToolExecuteOptions): Promise<WaitToolOutput> {
    // Input validation happens before execute in the registerTools helper
    const { items } = input;
    const results: WaitResultItem[] = [];
    let overallSuccess = true;
    let totalWaited = 0;

    try {
      // Process waits sequentially
      for (const item of items) {
        const result = await processSingleWait(item); // Process each item
        results.push(result);
        // Check for success AND that durationWaitedMs is a number (including 0)
        if (result.success && typeof result.durationWaitedMs === 'number') {
          totalWaited += result.durationWaitedMs;
        } else if (!result.success) { // Only set overallSuccess to false if an item actually failed
          overallSuccess = false;
          // Optionally break here if one wait fails? For now, continue processing others.
        }
      }

      return {
        success: overallSuccess,
        results: results,
        totalDurationWaitedMs: totalWaited,
        content: [{ type: 'text', text: `Processed ${items.length} wait operations. Total duration waited: ${totalWaited}ms. Overall success: ${overallSuccess}` }],
      };
    } catch (e: any) {
      // Catch unexpected errors during the loop itself (should be rare)
      const errorMsg = `Unexpected error during wait tool execution: ${e.message}`;
      console.error(errorMsg);
      return {
        success: false,
        results: results, // Return partial results if any
        totalDurationWaitedMs: totalWaited,
        error: errorMsg,
        content: [],
      };
    }
  },
};

console.log('MCP Wait Core Tool (Batch Operation) Loaded');