// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // Optional for styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
