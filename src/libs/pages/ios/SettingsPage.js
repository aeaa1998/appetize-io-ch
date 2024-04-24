export default class SettingsPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Click on the login or account button from the table view in iOS
   */
  async clickLoginOrAccount() {
    const loginOrAccountElement = {
      attributes: {
        accessibilityIdentifier: 'WMFSettingsTableViewCell_0'
      }
    }
    await this.session.findElement(loginOrAccountElement)
    await this.session.tap({
      element: loginOrAccountElement
    })
  }

  /**
   * Clicks on the x mark on the navigation bar
   */
  async closeSettings() {
    const closeSettings = {
      attributes: {
        accessibilityIdentifier: 'close-settings-button'
      }
    }
    await this.session.waitForAnimations()
    await this.session.findElement(closeSettings)
    await this.session.tap({
      element: closeSettings
    })
  }
}
