export default class WikiPageView {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Navigates back to the previous view
   */
  async navigateBack() {
    await this.session.tap({
      element: {
        attributes: {
          'content-desc': 'Navigate up',
          class: 'android.widget.ImageButton'
        }
      }
    })
  }

  /**
   * Open the options in a page view
   */
  async openOptionsMenu() {
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'article-toolbar-more-button'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          accessibilityIdentifier: 'article-toolbar-more-button'
        }
      }
    })

    // Wait for the options button to be displayed
    await this.session.waitForAnimations()
  }

  /**
   * Clicks on the share page option
   */
  async clickPageShare() {
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'article-context-share-button'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          accessibilityIdentifier: 'article-context-share-button'
        }
      }
    })

    await this.session.waitForAnimations()
  }
}
