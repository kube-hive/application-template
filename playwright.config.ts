import { defineConfig } from '@playwright/test';
import type {LaunchOptions} from "playwright-core";

function getLaunchOptions(): Omit<LaunchOptions, 'tracesDir'> | undefined {
    if(!process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ) {
        return undefined;
    }

    return {
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
}

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: 'tests/playwright',
    // Configure Playwright to use the container's native Fedora Chromium package
    use: {
        launchOptions: getLaunchOptions(),
    },
    // Run your local dev server before starting the tests.
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173
    },
});
