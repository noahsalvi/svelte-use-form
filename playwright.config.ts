import type { PlaywrightTestConfig } from "@playwright/test";

// Run 'npm start build' before running the tests

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build && npm run preview -- --port 4175",
    port: 4175,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
