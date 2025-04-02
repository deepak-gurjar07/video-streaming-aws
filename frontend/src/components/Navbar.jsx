import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear the search input after search
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-dark-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop menu */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center text-primary-400 font-bold text-2xl hover:text-primary-300 transition-colors no-underline"
              style={{ textDecoration: 'none' }}
            >
              Vidora
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-dark-100 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-dark-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="submit"
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search
              </button>
            </form>
          </div>

          {/* Navigation and user menu (desktop) */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {!user ? (
              <>
                <button 
                  onClick={handleLogin} 
                  className="text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignup} 
                  className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/upload")} 
                  className="text-white bg-secondary-600 hover:bg-secondary-700 px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
                <button 
                  onClick={() => navigate("/profile")} 
                  className="text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  My Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-100 focus:outline-none focus:bg-dark-100 focus:text-white transition duration-150 ease-in-out"
            >
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-dark-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {!user ? (
            <>
              <button 
                onClick={handleLogin} 
                className="block w-full text-left text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </button>
              <button 
                onClick={handleSignup} 
                className="block w-full text-left text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate("/upload")} 
                className="block w-full text-left text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Upload
              </button>
              <button 
                onClick={() => navigate("/profile")} 
                className="block w-full text-left text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                My Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left text-gray-300 hover:bg-dark-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;