import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
<NavLink
  to="/"
  style={{
    ...styles.logo,
    textDecoration: "none",
    color: "#1f1f1f",
  }}
>
  Literary Heritage
</NavLink>


        <nav style={styles.nav}>
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Home
          </NavLink>
          <NavLink
  to="/authors"
  style={({ isActive }) =>
    isActive ? styles.activeLink : styles.link
  }
>
  Authors
</NavLink>


          <NavLink
            to="/explore"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/progress"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Progress
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    background: "#ffffff",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    zIndex: 10,
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontWeight: 700,
    fontSize: "18px",
    letterSpacing: "0.02em",
  },
  nav: {
    display: "flex",
    gap: "18px",
  },
  link: {
    textDecoration: "none",
    color: "#1f1f1f",
    opacity: 0.7,
    fontWeight: 500,
  },
  activeLink: {
    textDecoration: "none",
    color: "#1f1f1f",
    fontWeight: 600,
    borderBottom: "2px solid #1f1f1f",
    paddingBottom: "2px",
  },
};

export default Header;
