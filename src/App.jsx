import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface/>} />
        <Route path="/chat/:sessionId" element={<ChatInterface/>} />
      </Routes>
    </Router>
  );
};

export default App;
