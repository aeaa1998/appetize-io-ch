import { CreateAccountPage, LoginPage, MainViewPage } from '@/libs/pages/android'

/**
 * Does the whole login flow inside the application
 * @param {object} session The current session
 * @param {string} username The username to authenticate
 * @param {string} password The password to use for authentication
 */
const loginFlow = async (session, username, password) => {
  const createAccountPage = new CreateAccountPage(session)
  const loginPage = new LoginPage(session)
  const mainViewPage = new MainViewPage(session)
  // Navigate to login
  await mainViewPage.openNavMoreContainer()
  await mainViewPage.tapLoginOption()

  // Create account view is displayed
  await createAccountPage.openLogin()

  await loginPage.login(username, password)

  // Wait for a success response
  await loginPage.waitForLoginResponse()
}

export default loginFlow
