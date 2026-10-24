const features = [
  {
    icon: '↻',
    title: 'Automated Trading',
    description: 'Set your strategy and let the bot execute trades 24/7 without manual intervention.',
  },
  {
    icon: 'ϟ',
    title: 'Easy Setup',
    description: 'Connect your exchange API key in seconds. No complex configuration needed.',
  },
  {
    icon: '🔒',
    title: 'Secure API Keys',
    description: 'Your API keys are encrypted and stored securely. We never request withdrawal access.',
  },
]

function FeatureCards() {
  return (
    <section className="features" aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <div className={`feature-icon ${feature.title === 'Easy Setup' ? 'bolt' : ''}`} aria-hidden="true">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureCards
