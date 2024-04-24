import { LoginPage, FeedViewPage, OnboardingPage, WikiPageView } from '@/libs/pages/android'
import loginFlow from './loginFlow'

/**
 * Contains the flow to do the share and article flow after login
 * @param {object} session The current session of appetize
 * @param {object} { username, password }  The username an password to use to login the app
 * @param {object} { skipLogin, skipOnboarding } Flags that specify launch options for the application.
 */
const shareFlow = async (session, { username, password }, { skipLogin, skipOnboarding }) => {
  // Create the login page and request the pages
  const onboardingPage = new OnboardingPage(session)
  const loginPage = new LoginPage(session)
  const feedViewPage = new FeedViewPage(session)
  const wikiPageView = new WikiPageView(session)

  // If we are nos skipping onboarding
  if (!skipOnboarding) {
    await onboardingPage.skipOnboarding()
  }

  // When we skip login we ommit the login flow
  if (!skipLogin) {
    await loginFlow(session, username, password)
  } else {
    // Else just wait for confirmation of login
    await loginPage.waitForLoginResponse()
  }

  // The feed fragment is displayed after login success
  await feedViewPage.isDisplayed()
  await feedViewPage.tapOnFirstArticle()

  await wikiPageView.openOptionsMenu()
  await wikiPageView.clickPageShare()
}

export default shareFlow
