# Habit Tracker PWA

A simple Progressive Web App (PWA) to track daily habits, specifically <strong>Exercise</strong> and <strong>Walking</strong>. The app features a hexagonal calendar grid for six months, allowing users to mark habits as completed by interacting with the respective halves of each hexagon. It runs locally, works offline, and stores data using IndexedDB.</p>
    
## Features
- Track Two Habits: Exercise and Walking.
- Hexagonal Day Cells: Each day is represented by a hexagon divided into two equal parts for each habit.
- Toggle Completion: Click to select or deselect habit completion.
- Local Data Storage: Uses IndexedDB to persist data locally.
- Offline Functionality: Fully functional without an internet connection.
- Responsive Design: Optimized for desktop use.

    
# Project Structure

<code><pre>habit-tracker/
│
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
└── service-worker.js  # Service Worker for offline support
</pre></code>
