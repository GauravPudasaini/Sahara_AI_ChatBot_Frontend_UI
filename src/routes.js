// routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatInterface from './components/ChatInterface/ChatInterface';

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<ChatInterface />} />
    <Route path="/chat/:sessionId" element={<ChatInterface />} />
  </Routes>
);

export default RoutesConfig;
