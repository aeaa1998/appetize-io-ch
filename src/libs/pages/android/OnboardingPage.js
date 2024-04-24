export default class OnboardingPage {
  session

  constructor(session) {
    this.session = session
  }

  // Tap on skip onboarding action
  async skipOnboarding() {
    await this.session.findElement({
      attributes: {
        'resource-id': 'org.wikipedia:id/fragment_onboarding_skip_button'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          'resource-id': 'org.wikipedia:id/fragment_onboarding_skip_button'
        }
      }
    })
  }
}
