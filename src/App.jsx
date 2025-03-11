// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login.jsx';

function App() {
  return (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

export default App;