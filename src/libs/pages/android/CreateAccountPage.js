export default class CreateAccountPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Opens the login view from the create account view
   */
  async openLogin() {
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/create_account_login_button'
        }
      }
    })
  }
}
