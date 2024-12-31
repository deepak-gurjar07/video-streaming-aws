import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css'; // Import custom CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate("/");
    window.location.reload(); // Reload the page to update the Navbar state
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-left">
          <Link to="/" className="app-name logo-link">Vidora</Link>
        </div>
        <div className="navbar-center">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
        <div className="navbar-right">
          {!user ? (
            <>
              <button onClick={handleLogin} className="btn-login">Login</button>
              <button onClick={handleSignup} className="btn-signup">Sign Up</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/upload")} className="btn-upload">Upload</button>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
              <button onClick={() => navigate("/profile")} className="btn-profile">{user.email}</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;