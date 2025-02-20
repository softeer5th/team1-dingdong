import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ['places', 'geometry']
});

loader.load().then(() => {
  window.google = google;
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch(e => {
  console.error('Error loading Google Maps:', e);
});

