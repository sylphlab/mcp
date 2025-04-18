import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { Stats } from 'node:fs'; // Import Stats type
import { z } from 'zod';
import { McpTool, BaseMcpToolOutput, McpToolInput } from '@sylphlab/mcp-core'; // Import base types

// --- Zod Schema for Input Validation ---
export const ReadFilesToolInputSchema = z.object({
  paths: z.array(
      z.string({ required_error: 'Each path must be a string' })
       .min(1, 'Path cannot be empty')
    )
    .min(1, 'paths array cannot be empty'),
  encoding: z.enum(['utf-8', 'base64']).optional().default('utf-8'),
  includeStats: z.boolean().optional().default(false),
});

// Infer the TypeScript type from the Zod schema
export type ReadFilesToolInput = z.infer<typeof ReadFilesToolInputSchema>;

// --- Output Types ---
export interface ReadFileResult {
  /** The file path provided in the input. */
  path: string;
  /** Whether the read operation for this specific file was successful. */
  success: boolean;
  /** The content of the file, as a string (respecting encoding). */
  content?: string;
  /** Optional file system stats (if includeStats was true). */
  stat?: Stats;
  /** Optional error message if the operation failed for this file. */
  error?: string;
  /** Optional suggestion for fixing the error. */
  suggestion?: string;
  // encodingUsed?: 'utf-8' | 'base64'; // Could add if needed
}

// Extend the base output type
export interface ReadFilesToolOutput extends BaseMcpToolOutput {
  /** Overall operation success (true if at least one file was read successfully). */
  // success: boolean; // Inherited
  /** Optional general error message if the tool encountered a major issue. */
  error?: string;
  /** Array of results for each file read operation. */
  results: ReadFileResult[];
}

// --- Tool Definition (following SDK pattern) ---

export const readFilesTool: McpTool<typeof ReadFilesToolInputSchema, ReadFilesToolOutput> = {
  name: 'readFilesTool',
  description: 'Reads the content of one or more files within the workspace.',
  inputSchema: ReadFilesToolInputSchema,

  async execute(input: ReadFilesToolInput, workspaceRoot: string): Promise<ReadFilesToolOutput> {
    // Zod validation
    const parsed = ReadFilesToolInputSchema.safeParse(input);
    if (!parsed.success) {
      const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      return {
        success: false,
        error: `Input validation failed: ${errorMessages}`,
        results: [],
        content: [], // Add required content field
      };
    }
    const { paths: inputPaths, encoding, includeStats } = parsed.data;
    // --- End Zod Validation ---

    const results: ReadFileResult[] = [];
    let anySuccess = false;

    for (const itemPath of inputPaths) {
      const fullPath = path.resolve(workspaceRoot, itemPath);
      let itemSuccess = false;
      let content: string | undefined = undefined;
      let itemStat: Stats | undefined = undefined;
      let error: string | undefined;
      let suggestionForError: string | undefined;

      // --- Security Check ---
      const relativePath = path.relative(workspaceRoot, fullPath);
      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
          error = `Path validation failed: Path must resolve within the workspace root ('${workspaceRoot}'). Relative Path: '${relativePath}'`;
          console.error(`Skipping read for ${itemPath}: ${error}`);
          // Assign suggestion directly here as we don't proceed further
          results.push({ path: itemPath, success: false, error, suggestion: `Ensure the path '${itemPath}' is relative to the workspace root and does not attempt to go outside it.` });
          anySuccess = false; // Ensure overall success reflects this failure if it's the only path
          continue; // Skip to next itemPath
      } else {
        try {
            // Optionally get stats first
            if (includeStats) {
                itemStat = await stat(fullPath);
                // Ensure it's a file if stats are requested
                 if (!itemStat.isFile()) {
                    throw new Error(`Path '${itemPath}' is not a file.`);
                 }
            }

            // Read the file content with specified encoding
            const fileBuffer = await readFile(fullPath);
            content = fileBuffer.toString(encoding);

            itemSuccess = true;
            anySuccess = true; // Mark overall success if at least one works

        } catch (e: any) {
            itemSuccess = false;
            // Provide specific errors
            if (e.code === 'ENOENT') {
                 error = `Failed to read '${itemPath}': File not found.`;
            } else if (e.code === 'EISDIR') {
                 error = `Failed to read '${itemPath}': Path is a directory, not a file.`;
            } else {
                 error = `Failed to read '${itemPath}': ${e.message}`;
            }
            console.error(error);
            // Add suggestion based on error
            if (e.code === 'ENOENT') {
                const parentDir = path.dirname(itemPath);
                suggestionForError = `Ensure the file path '${itemPath}' is correct and the file exists. You could try listing the directory contents using listFilesTool on '${parentDir === '.' ? '.' : parentDir}' to check available files.`;
            } else if (e.code === 'EISDIR' || e.message.includes('is not a file')) {
                suggestionForError = `The path '${itemPath}' points to a directory. Provide a path to a file.`;
            } else if (e.code === 'EACCES') {
                suggestionForError = `Check read permissions for the file '${itemPath}'.`;
            } else {
                suggestionForError = `Check the file path and permissions.`;
            }
            // Assign suggestion to the result object later
        }
      }

      results.push({
        path: itemPath,
        success: itemSuccess,
        content,
        stat: itemStat,
        error,
        suggestion: !itemSuccess ? suggestionForError : undefined, // Use the suggestion calculated in the catch block
      });
    }

    return {
      success: anySuccess, // True if at least one read succeeded
      results,
      // Add a default success message to content if overall successful
      content: anySuccess
        ? [{ type: 'text', text: `Read operation completed. Success: ${anySuccess}` }]
        : [],
    };
  },
};