import {
  OnboardingPage,
  WikiPageView,
  LoginPage,
  ExploreViewPage,
  SettingsPage
} from '@/libs/pages/ios'

/**
 * Does the login flow in the iOS application for wikipedia
 * @param {object} session The current session from appetize emulator
 * @param {string} username The username to use for login
 * @param {string} password The password to use for login
 */
const loginFlow = async (session, username, password) => {
  const exploreViewPage = new ExploreViewPage(session)
  const settingsPage = new SettingsPage(session)
  const loginPage = new LoginPage(session)

  // Open the settings
  await exploreViewPage.openSettings()
  // Navigate to login
  await settingsPage.clickLoginOrAccount()

  // Perform the login action
  await loginPage.login(username, password)

  // Wait for correct login
  await loginPage.waitForLoginResponse()
}

export default loginFlow
