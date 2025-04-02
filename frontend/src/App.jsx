import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import Profile from './pages/Profile';
import EditVideo from './pages/EditVideo';
import VideoPlayer from "./components/VideoPlayer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";
import Upload from "./pages/Upload"; 
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/view/:videoId" element={<VideoPlayer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/upload" element={<Upload />} /> 
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-video/:videoId" element={<EditVideo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;