export default class LoginPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Types the username into the username input field.
   * @param {string} username The username to be typed into the username field
   */
  async typeUsername(username) {
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/login_username_text'
        }
      }
    })

    await this.session.type(username)
  }

  /**
   * Types the passed password into the password field.
   * @param {string} password The password to be typed into the field
   */
  async typePassword(password) {
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/login_password_input'
        }
      }
    })

    await this.session.type(password)
  }

  /**
   * This function encapsulates all the steps needed to be taken in order to make the login action
   * in the login view
   * @param {string} username The username to be used to login
   * @param {string} password The password to be used to login
   */
  async login(username, password) {
    await this.typeUsername(username)
    await this.typePassword(password)
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/login_button'
        }
      }
    })
  }

  /**
   * Asserts that a snackbar with success log in message was displayed
   */
  async loginSuccessSnackbarVisible() {
    // Logged in snackbar message is displayed
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/snackbar_text',
        text: 'Logged in!'
      }
    })
  }

  /**
   * Asserts that the login response is ok by intercepting the network calls
   */
  async waitForLoginResponse() {
    await this.session.waitForEvent('network', (data) => {
      // resolves only when this condition is met
      const isResponse = data.type === 'response'
      const isLogin = data.request?.url?.includes('action=clientlogin') ?? false
      // Check for the login
      if (isResponse && isLogin) {
        const response = JSON.parse(data.response?.content?.text ?? '{}')
        const isOk = response?.clientlogin?.status?.toLowerCase() == 'pass'
        return isOk
      }
      return false
    })
  }
}
