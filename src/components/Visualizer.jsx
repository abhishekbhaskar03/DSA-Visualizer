// Visualizer.jsx
import React, { useState, useEffect, useRef } from 'react';
import About from "./About";
import Contact from "./Contact";
import SortingVisualizer from './SortingVisualizerComponent';
import LinkedListVisualizer from './LinkedListVisualizer';
import DoublyLinkedListVisualizer from './DoublyLinkedListVisualizer';
import StackVisualizer from './StackVisualizer';
import QueueVisualizer from './QueueVisualizer';
import TreeVisualizer from './TreeVisualizer';
import '../css/Visualizer.css';
import GraphVisualizer from './GraphVisualizer';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const sidebarRef = useRef();
  const toggleButtonRef = useRef();
  const videoRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen &&
        !sidebarRef.current?.contains(event.target) &&
        !toggleButtonRef.current?.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  const handleSidebarLinkClick = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };
  // Add video initialization
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay error:', error);
      });
    }
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <button
          ref={toggleButtonRef}
          className="sidebar-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!isSidebarOpen);
          }}
        >
          ☰
        </button>
        <h1>DSA Visualizer</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('home')}>Home</button>
          <button onClick={() => setCurrentView('about')}>About</button>
          <button onClick={() => setCurrentView('contact')}>Contact</button>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Data Structures</h3>
        <ul>
          <li onClick={() => handleSidebarLinkClick('sorting')}>Sorting Visualizer</li>
          <li onClick={() => handleSidebarLinkClick('linkedlist')}>Linked List Visualizer</li>
          <li onClick={() => handleSidebarLinkClick('stack')}>Stack Visualizer</li>
          <li onClick={() => handleSidebarLinkClick('queue')}>Queue Visualizer</li>
          <li onClick={() => handleSidebarLinkClick('tree')}>Tree Visualizer</li>
          <li onClick={() => handleSidebarLinkClick('graph')}>Graph Visualizer</li>
        </ul>
      </div>

      {/* Main Content */}
      <main
        className={`main-content ${currentView === 'home' ? 'home-page' : ''}`} style={{ marginTop: '-400px' }}
      >
        {currentView === 'home' && (
          <div className="hero-section">
            {/* Background video */}
            <div className="video-background">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                style={{ backgroundColor: '#000' }} // Fallback color
                className="background-video">
                <source src="/video/background.mp4" type="video/mp4" />
              </video>

            </div>
            <div className="hero-content">
              <h2>Welcome to DSA Visualizer</h2>
              <p>
                An interactive learning tool that helps you understand algorithms and
                data structures through visualization. Explore sorting algorithms,
                linked lists, trees, and more with interactive animations and
                step-by-step explanations.
              </p>
            </div>

          </div>
        )}
        {currentView === 'about' && <About />}
        {currentView === 'contact' && <Contact />}
        {/* Add other views here */}

        {currentView === 'sorting' && <SortingVisualizer />}
        {currentView === 'linkedlist' && (
          <>
            <LinkedListVisualizer />
            <DoublyLinkedListVisualizer />
          </>
        )}
        {currentView === 'stack' && <StackVisualizer />}
        {currentView === 'queue' && <QueueVisualizer />}
        {currentView === 'tree' && <TreeVisualizer />}
        {currentView === 'graph' && <GraphVisualizer />}
        {/* Add other views here */}
      </main>
    </div>
  );
};

export default App;