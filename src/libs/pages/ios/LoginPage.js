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
          accessibilityIdentifier: 'username-login-input'
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
          accessibilityIdentifier: 'password-login-input'
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
          accessibilityIdentifier: 'login-button'
        }
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
      const isLogin =
        data.response?.content?.text?.includes('{"clientlogin":{"status":"PASS"') ?? false
      const isOk = data.response?.status == 200 ?? false
      return isResponse && isLogin && isOk
    })
  }
}
