import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZodObject, ZodRawShape } from 'zod';
import { McpTool, BaseMcpToolOutput, McpContentPart } from '@sylphlab/mcp-core';

/**
 * Registers an array of McpTool objects with an McpServer instance.
 *
 * @param server The McpServer instance.
 * @param tools An array of McpTool objects to register.
 */
export function registerTools(server: McpServer, tools: McpTool<any, any>[]) {
  tools.forEach((tool) => {
    // Basic validation of the tool object structure
    if (tool && tool.name && typeof tool.name === 'string' &&
        tool.execute && typeof tool.execute === 'function' &&
        tool.inputSchema instanceof ZodObject)
    {
      const zodShape: ZodRawShape = tool.inputSchema.shape;

      // Use simpler handler signature, return Promise<any> to bypass strict SDK type check for now
      const handler = async (args: unknown): Promise<BaseMcpToolOutput> => { // Return BaseMcpToolOutput
            const workspaceRoot = process.cwd();
            let result: BaseMcpToolOutput; // Use BaseMcpToolOutput internally

            try {
                // Validate args using the tool's full Zod schema
                const validatedArgs = tool.inputSchema.parse(args);

                // Call the original tool's execute function
                const executeOptions = {}; // Pass empty options for now
                result = await tool.execute(validatedArgs, workspaceRoot, executeOptions);
            } catch (execError: any) {
                 // Catch errors during validation (parse) or execution
                 console.error(`Error during registration wrapper for ${tool.name}:`, execError);
                 // Format error consistent with BaseMcpToolOutput structure
                 const errorMessage = execError instanceof Error ? execError.message : 'Unknown execution error';
                 result = {
                     success: false,
                     error: `Tool execution failed: ${errorMessage}`,
                     content: [{ type: 'text', text: `Tool execution failed: ${errorMessage}` }]
                 };
            }
            // Return the result object - relies on BaseMcpToolOutput being structurally compatible
            return result;
      };

      server.tool(
        tool.name,
        tool.description || '',
        zodShape,
        handler // Pass the handler
      );
      console.info(`Registered tool via helper: ${tool.name}`); // Use info for success
    } else {
      console.warn('Skipping invalid tool definition during registration via helper:', tool);
    }
  });
}