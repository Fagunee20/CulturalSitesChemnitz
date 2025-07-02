import React from 'react';
import '../styles.css'; // 👈 Make sure this path matches where you save the CSS

export default function About() {
  return (
    <div className="about-container">
      <h1>📖 About This App</h1>

      <p>
        This cultural exploration app lets you <strong>discover</strong>, <strong>collect</strong>, and <strong>trade</strong> cultural places across Chemnitz.
        Inspired by Pokémon-like mechanics, it turns cultural engagement into a fun, interactive experience.
      </p>

      <h2>🎯 Purpose</h2>
      <ul>
        <li>Promote cultural discovery and local tourism</li>
        <li>Encourage walking and exploring the city</li>
        <li>Gamify learning through collecting and trading</li>
      </ul>

      <h2>🧰 Features</h2>
      <ul>
        <li>Live map of cultural sites using Leaflet</li>
        <li>User accounts and location tracking</li>
        <li>Mark places as visited and collect them</li>
        <li>Leave and read reviews of places</li>
        <li>Trade places with other users</li>
      </ul>

      <h2>🌍 Data Sources</h2>
      <ul>
        <li>
          <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
            OpenStreetMap (OSM)
          </a>
        </li>
        <li>
          <a href="https://www.chemnitz.de/opendata" target="_blank" rel="noopener noreferrer">
            City of Chemnitz Open Data Portal
          </a>
        </li>
      </ul>

      <h2>🛠 Built With</h2>
      <ul>
        <li>React & React Router</li>
        <li>Apollo Client & Server (GraphQL)</li>
        <li>MongoDB & Mongoose</li>
        <li>Leaflet.js for interactive mapping</li>
      </ul>

      <h2>🙋 Why Cultural Places?</h2>
      <p>
        Cities are more than infrastructure—they are stories and Chemnitz is the main city for explorig different cultural aspects. This app helps you engage with your surroundings in a meaningful way, whether you're a tourist or a local rediscovering familiar streets.
      </p>
    </div>
  );
}
