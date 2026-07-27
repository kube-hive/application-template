import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: 'tests/playwright',
    // Run your local dev server before starting the tests.
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173
    },
});
