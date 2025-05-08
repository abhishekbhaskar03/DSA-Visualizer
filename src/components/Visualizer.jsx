// Visualizer.jsx
import React, { useState, useEffect, useRef } from 'react';
import SortingVisualizer from './SortingVisualizerComponent';
import LinkedListVisualizer from './LinkedListVisualizer';
import DoublyLinkedListVisualizer from './DoublyLinkedListVisualizer';
import StackVisualizer from './StackVisualizer';
import QueueVisualizer from './QueueVisualizer';
import TreeVisualizer from './TreeVisualizer';
import '../css/Visualizer.css';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const sidebarRef = useRef();
  const toggleButtonRef = useRef();

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
        </ul>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'home' && (
          <div className="hero-section">
            {/* Background video */}
            <div className="video-background">
              <video autoPlay muted loop playsInline 
              style={{ backgroundColor: '#000' }} // Fallback color
              className="background-video">
                <source src="https://cdn.pixabay.com/video/2023/10/19/185629-876210579_large.mp4" type="video/mp4" />

                
              </video>
              <div className="video-overlay"></div>
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
        {/* Add other views here */}
      </main>
    </div>
  );
};

export default App;