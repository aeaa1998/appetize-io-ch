// This class will continue all the functionalities shared in the main activity
// like interacting with the bottom navigation bar
export default class MainViewPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Opens the more options from the bottom navigation
   */
  async openNavMoreContainer() {
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/nav_more_container'
        }
      }
    })
  }

  /**
   * Clicks on the login option from the drawer
   * shown after nav more container is displayed
   */
  async tapLoginOption() {
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/main_drawer_account_container'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/main_drawer_account_container'
        }
      }
    })
  }
}
