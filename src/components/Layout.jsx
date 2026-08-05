import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">Drive Clone</span>
        <nav className="nav-links">
          <NavLink to="/" end>My Drive</NavLink>
          <NavLink to="/shared">Shared with me</NavLink>
          <NavLink to="/activity">Activity</NavLink>
        </nav>
        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <button className="btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
