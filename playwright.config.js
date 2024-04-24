import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
//   testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 120 * 1000,
  expect: {
    // recommended ratio for screenshot testing
    toMatchSnapshot: {
        maxDiffPixelRatio: 0.05,
    }
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  fullyParallel: false,
  reporter: 'html',
  projects: [
    {
        name: 'Android Pixel 7',
        outputDir: './test-results/android/',
        testDir: './e2e/android/',
        use: {
            // Appetize session configuration for Android
            config: {
                device: 'pixel7',
                publicKey: 'u3axx7l2xnq73yvarsku7bm7dy',
                params: {
                    skipOnboarding: true
                }
            }  
        }
    },
    {
        name: 'iOS iPhone 14 Pro',
        outputDir: './test-results/ios/',
        testDir: './e2e/ios/',
        use: {
            // Appetize session configuration for iOS
            config: {
                device: 'iphone14pro',
                osVersion: '17.2',
                publicKey: 'ar6uoq4tg7px7ducbwqebvcrcu',
                params: {
                    skipOnboarding: true
                }
            }  
        }
    }
  ],
  use: {
    trace: 'retain-on-failure',
    baseURL: 'https://appetize.io',
  },
})
