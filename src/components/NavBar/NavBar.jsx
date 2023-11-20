import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthProvider"
import navStyles from "./NavBar.module.css"

const NavBar = () => {
  const { user, isLoadingUser } = useAuth()
  return (
    <nav className={`navbar navbar-expand-lg ${navStyles.navBar}`}>
      <div className={`container-fluid`}>
        <a className="navbar-brand" href="/">
          Moodo
        </a>
        <button
          className={`navbar-toggler ${navStyles.navBtn}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse flex-grow-0"
          id="navbarSupportedContent"
        >
          {user ? (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className={`nav-item ${navStyles.navItem}`}>
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/journal"
                >
                  Journal
                </Link>
              </li>
              <li className={`nav-item ${navStyles.navItem}`}>
                <Link className="nav-link" to="/community">
                  Community
                </Link>
              </li>
              <li className={`nav-item ${navStyles.navItem}`}>
                <Link className="nav-link" to="/meditation">
                  Meditation Center
                </Link>
              </li>
              <li className={`nav-item ${navStyles.navItem}`}>
                <Link className="nav-link" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            !user &&
            !isLoadingUser && (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className={`nav-item ${navStyles.navItem}`}>
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className={`nav-item ${navStyles.navItem}`}>
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </ul>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
