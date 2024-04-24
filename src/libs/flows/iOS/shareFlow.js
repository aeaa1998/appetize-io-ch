import {
  OnboardingPage,
  WikiPageView,
  LoginPage,
  ExploreViewPage,
  SettingsPage
} from '@/libs/pages/ios'
import loginFlow from './loginFlow'

/**
 * Contains the flow to do the share and article flow after login.
 * @param {object} session The current session of appetize
 * @param {object} { username, password }  The username an password to use to login the app
 * @param {object} { skipLogin, skipOnboarding } Flags that specify launch options for the application.
 */
const shareFlow = async (session, { username, password }, { skipLogin, skipOnboarding }) => {
  // Create the login page and request the pages
  const onboardingPage = new OnboardingPage(session)
  const exploreViewPage = new ExploreViewPage(session)
  const settingsPage = new SettingsPage(session)
  const loginPage = new LoginPage(session)
  const wikiPageView = new WikiPageView(session)
  session.on('log', (messagge) => {
    console.log(messagge)
  })
  // If we are nos skipping onboarding
  if (!skipOnboarding) {
    await onboardingPage.skipOnboarding()
  }

  // When we skip login we ommit the login flow
  if (!skipLogin) {
    await loginFlow(session, username, password)
  } else {
    // Else just wait for login to be completed
    await loginPage.waitForLoginResponse()
  }

  // Continue with the flow in case we did not skipped login
  if (!skipLogin) {
    await settingsPage.closeSettings()
  }

  // The explore view is when closing settings
  await exploreViewPage.isDisplayed()
  await exploreViewPage.tapOnFirstArticle()

  await wikiPageView.openOptionsMenu()
  await wikiPageView.clickPageShare()
}

export default shareFlow
