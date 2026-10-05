import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--accent-light)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '42px',
    height: '24px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  btn: {
    padding: '8px 20px',
    borderRadius: 'var(--radius)',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  btnOutline: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  },
  btnPrimary: {
    background: 'var(--accent)',
    color: '#fff',
  },
  navLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  userEmail: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <img src="/gcx-logo.svg" alt="Good Crypto X" style={styles.logoIcon} />
        Good Crypto X
      </Link>
      <div style={styles.buttons}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/alerts" style={styles.navLink}>Alerts</Link>
            <Link to="/connect" style={styles.navLink}>API Keys</Link>
            <span style={styles.userEmail}>{user.email}</span>
            <button onClick={logout} style={{ ...styles.btn, ...styles.btnOutline }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.btn, ...styles.btnOutline }}>
              Login
            </Link>
            <Link to="/signup" style={{ ...styles.btn, ...styles.btnPrimary }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
