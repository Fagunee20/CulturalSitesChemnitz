// src/components/markerIcons.js

import L from 'leaflet';

// Import local icons
import blueIconUrl from './icons/marker-icon-blue.png';     // Restaurants
import greenIconUrl from './icons/marker-icon-green.png';   // Museums
import yellowIconUrl from './icons/marker-icon-yellow.png'; // Theatres
import grayIconUrl from './icons/marker-icon-grey.png';     // User location (You are here)
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Red marker from external URL (for artwork or default fallback)
const redIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';

// Utility function to create a Leaflet icon
const createIcon = (iconUrl) =>
  new L.Icon({
    iconUrl,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

// Export marker icons by category/type
export const markerIcons = {
  restaurant: createIcon(blueIconUrl),
  museum: createIcon(greenIconUrl),
  theatre: createIcon(yellowIconUrl),
  user: createIcon(grayIconUrl),         // For "You are here" marker
  artwork: createIcon(redIconUrl),       // For artwork or cultural sites
  default: createIcon(redIconUrl),       // Fallback icon
};
