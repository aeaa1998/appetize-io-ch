export default class WikiPageView {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Saves the current page.
   */
  async pressSavePage() {
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/page_save'
      }
    })

    await this.session.tap({
      attributes: {
        'resource-id': 'org.wikipedia:id/page_save'
      }
    })
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
    // Before interacting with the options Menu let's wait for the view to become idle
    await this.session.waitForAnimations()

    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/page_toolbar_button_show_overflow_menu'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/page_toolbar_button_show_overflow_menu'
        }
      }
    })
    // Wait for the options to be displayed
    await this.session.waitForAnimations()
  }

  /**
   * Clicks on the share page option
   */
  async clickPageShare() {
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/page_share'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/page_share'
        }
      }
    })

    // Wait for animations until the share view it's shown
    await this.session.waitForAnimations()
  }
}
