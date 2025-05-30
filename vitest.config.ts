import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'threads',
    // Remove workspace option, use include instead
    // workspace: ['packages/*'],
    include: ['packages/*/src/**/*.test.ts'], // Include test files from all packages
    exclude: [
      'packages/tools-rag/**', // Exclude the entire tools-rag package
      '**/node_modules/**', // Keep existing excludes
      '**/dist/**',
    ],
    globals: true, // Ensure globals are enabled for tests using vi, describe etc.
    environment: 'node', // Default environment
    // Configure coverage for the entire workspace
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // Choose your preferred reporters
      // Explicitly include only 'src' directories within packages
      include: ['packages/*/src/**'],
      // Exclude specific file types and directories globally
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/*.schema.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/coverage/**', // Exclude previous coverage reports if any remain
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/tsup.config.*',
        // Add other patterns if needed
      ],
      // all: true, // Removing this to see if it cleans up the report
    },
  },
})