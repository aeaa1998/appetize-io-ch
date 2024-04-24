export default class OnboardingPage {
  session

  constructor(session) {
    this.session = session
  }

  // Tap on skip onboarding action
  async skipOnboarding() {
    await this.session.findElement({
      attributes: {
        accessibilityIdentifier: 'skipWelcome'
      }
    })

    await this.session.tap({
      element: {
        attributes: {
          accessibilityIdentifier: 'skipWelcome'
        }
      }
    })
  }
}
