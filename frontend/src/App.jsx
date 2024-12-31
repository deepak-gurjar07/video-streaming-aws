import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import Profile from './pages/Profile';
import VideoPlayer from "./components/VideoPlayer";
import Navbar from "./components/Navbar";
import SearchResults from "./components/SearchResults";
import Upload from "./pages/Upload"; // Import the Upload component
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/view/:videoId" element={<VideoPlayer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/upload" element={<Upload />} /> <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;