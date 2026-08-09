import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: 'tests/playwright',
    // Configure Playwright to use the container's native Fedora Chromium package
    use: {
        launchOptions: {
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    },
    // Run your local dev server before starting the tests.
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173
    },
});
