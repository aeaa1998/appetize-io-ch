import AppetizePlaywright from '@appetize/playwright'
import { writeBuffer } from "./../utils/files.js"
import { ExploreViewPage } from "@/libs/pages/ios"

const { test } = AppetizePlaywright

test.use({
    config: {
        // Use dark mode for the test
        appearance: 'dark'
    },
});

// reinstall app after each test to reset data
test.afterEach(async ({ session }) => {
    await session.reinstallApp()
})

test('[iOS] Set to dark mode and should return screenshot of homepage', async ({ session, config }, testInfo) => {
    const exploreViewPage = new ExploreViewPage(session)
    // Wait for the feed view to be visible in the emulator
    await exploreViewPage.isDisplayed()

    // Wait for the animations to finish
    await session.waitForAnimations()
    
    const file = testInfo.outputPath(`screenshots/${config.device}`, 'homepage-dark-mode.png');

    const screenshot = await session.screenshot('buffer')

    await writeBuffer(file, screenshot.data);

})