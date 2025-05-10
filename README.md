# Habit Tracker PWA

A Progressive Web App (PWA) for tracking daily habits with multiple visualization options. Choose between 2-habit, 5-habit (pentagon), or 6-habit (hexagon) views displayed on a calendar grid spanning the last six months. The app runs locally, works offline, and stores data using IndexedDB.

## Key Features

-   **Multiple Views:** Track 2, 5, or 6 habits per day using different visual layouts (split hexagon, pentagon segments, hexagon segments). Selectable via the "View" dropdown in the header.
-   **Interactive Calendar:** Visualize habit completion over the last six months.
-   **Toggle Completion:**
    -   2-Habit View: Click the top or bottom half of the hexagon.
    -   5/6-Habit View: Click the main shape to open a modal, then click individual segments to toggle completion.
-   **Customization:**
    -   **Dark Mode:** Toggle between light and dark themes.
    -   **Color Schemes:** Choose from various pre-defined color schemes for both light and dark modes.
-   **Local Data Storage:** Uses IndexedDB to persist habit data locally in the browser.
-   **Offline Functionality:** Caches application files using a Service Worker for offline access.
-   **PWA Features:**
    -   Installable to home screen/desktop via the "Install App" button (appears if supported by the browser).
    -   Update notifications: A button appears at the bottom-right when a new version is available.
    -   Manual update check available in the Settings modal.
-   **Settings Modal:** Access Dark Mode, Color Scheme, and Manual Update Check via the gear icon in the header.

## How to Use

1.  **Select View:** Use the "View" dropdown in the header to choose between 2, 5, or 6 habits.
2.  **Mark Habits:**
    -   In 2-Habit view, click the top/bottom half of a day's hexagon.
    -   In 5/6-Habit view, click the day's shape to open the modal, then click segments within the modal.
3.  **Customize:** Click the gear icon (<i class="bi bi-gear-fill"></i>) in the header to open the Settings modal. Adjust the Color Scheme and Dark Mode.
4.  **Update:** If the "Update App" button appears at the bottom-right, click it to load the latest version. You can also manually trigger a check from the Settings modal.
5.  **Install:** If the "Install App" button appears (bottom-right), click it to install the PWA.

## Project Structure

```
habit-tracker-experimental/
│
├── index.html         # Main HTML structure
├── styles.css         # CSS styles (including shapes, themes)
├── config.js          # Habit definitions, color schemes
├── main.js            # Main application logic, event listeners, initialization
├── ui.js              # UI rendering functions (calendar, modals), theme application
├── db.js              # IndexedDB interaction logic
├── manifest.json      # PWA manifest file
├── service-worker.js  # Service Worker for offline caching and updates
├── README.md          # This file
└── icons/             # Directory containing app icons
    ├── ... (various icon files)

```

## Local Development

To run this project locally with full functionality (including Service Worker and module loading), you need to serve the files using a local web server due to browser security restrictions on the `file:///` protocol.

A simple way is to use Python's built-in server (if Python is installed):

1.  Navigate to the project directory (`habit-tracker-experimental`) in your terminal.
2.  Run `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
3.  Open your browser and go to `http://localhost:8000` (or the port specified by the server).

Alternatively, use other tools like `npx serve` or the Live Server extension in VS Code.
