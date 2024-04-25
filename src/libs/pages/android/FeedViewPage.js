export default class FeedViewPage {
  session

  constructor(session) {
    this.session = session
  }

  /**
   * Asserts that the feed view is actually being displayed on the screen
   */
  async isDisplayed() {
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/feed_view'
      }
    })
  }

  /**
   * Taps on the first article visible in the feed view
   */
  async tapOnFirstArticle() {
    // Before making an action let's make sure there are no animation UI is idle
    await this.session.waitForAnimations()

    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/articleImage'
      }
    })
    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/articleImage'
        }
      }
    })
  }
}
