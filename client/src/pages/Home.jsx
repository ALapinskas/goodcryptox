import FeatureCards from '../components/FeatureCards'
import Navbar from '../components/Navbar'
import PriceDisplay from '../components/PriceDisplay'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="app-shell" id="top">
      <Navbar />
      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <h1 id="hero-title">Good Crypto X Test Project</h1>
          <p className="hero-copy">
            Connect your exchange API key and let the bot trade ETH<br className="desktop-break" /> for you.
          </p>
          <a className="connect-button" href="/connect-key">Connect API Key</a>
          <PriceDisplay />
        </section>
        <FeatureCards />
      </main>
      <Footer />
    </div>
  )
}

export default Home
