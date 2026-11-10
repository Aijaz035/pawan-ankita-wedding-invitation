import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/pinyon-script/400.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import './styles.css';
import paper from './assets/paper.webp';
import App from './App';

document.documentElement.style.setProperty('--paper', `url(${paper})`);
const bg = document.createElement('div');
bg.className = 'desk-bg';
bg.style.backgroundImage = `url(${paper})`;
document.body.prepend(bg);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
