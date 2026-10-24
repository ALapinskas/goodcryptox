function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-arc brand-arc-left" />
      <span className="brand-arc brand-arc-right" />
    </span>
  )
}

function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label="Good Crypto X home">
        <BrandMark />
        <span>Good Crypto X</span>
      </a>
      <nav className="nav-actions" aria-label="Account navigation">
        <a className="button button-login" href="/login">Login</a>
        <a className="button button-signup" href="/signup">Sign Up</a>
      </nav>
    </header>
  )
}

export default Navbar
