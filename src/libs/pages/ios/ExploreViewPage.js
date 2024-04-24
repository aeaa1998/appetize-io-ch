export default class ExploreViewPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Opens the settings dropdown menu
   */
  async openSettings() {
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'settings-button-bar'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          accessibilityIdentifier: 'settings-button-bar'
        }
      }
    })
  }

  /**
   * Assert the main view is being displayed
   */
  async isDisplayed() {
    await this.session.waitForAnimations()
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'explore-main-view'
      }
    })
  }

  /**
   * Taps on the first article visible in the explore view
   */
  async tapOnFirstArticle() {
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'article-full-width-image-cv-cell-title'
      }
    })
    await this.session.tap({
      element: {
        attributes: {
          accessibilityIdentifier: 'article-full-width-image-cv-cell-title'
        }
      }
    })
  }
}
