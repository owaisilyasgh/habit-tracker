// main.js - Main application entry point

import { colorSchemes } from './config.js'; // Import schemes
import { initDB } from './db.js';
import {
    renderView,
    applyColorScheme, // Import apply function
    applyDarkMode,
    loadDarkModePreference,
    saveDarkModePreference
} from './ui.js';

// --- DOM Element References ---
const viewToggleSwitch = document.getElementById('toggle-switch');
const darkModeSwitch = document.getElementById('dark-mode-switch');
const colorSchemeSelect = document.getElementById('color-scheme-select'); // Get scheme select
const installButton = document.getElementById('install-button');

// --- Color Scheme Logic ---
const DEFAULT_LIGHT_SCHEME = 'light-default';
const DEFAULT_DARK_SCHEME = 'dark-default';

/**
 * Populates the color scheme dropdown based on the current mode (light/dark).
 * @param {string} currentMode - 'light' or 'dark'.
 */
function populateColorSchemeSelect(currentMode) {
    if (!colorSchemeSelect) return;
    const currentVal = colorSchemeSelect.value; // Remember current selection if possible
    colorSchemeSelect.innerHTML = ''; // Clear existing options

    for (const schemeKey in colorSchemes) {
        if (colorSchemes[schemeKey].mode === currentMode) { // Filter by mode
            const option = document.createElement('option');
            option.value = schemeKey;
            option.textContent = colorSchemes[schemeKey].name;
            colorSchemeSelect.appendChild(option);
        }
    }
    // Try to restore previous selection if it's valid for the new mode
    if (colorSchemes[currentVal]?.mode === currentMode) {
         colorSchemeSelect.value = currentVal;
    } else {
        // Otherwise, set to default for the current mode
        colorSchemeSelect.value = currentMode === 'dark' ? DEFAULT_DARK_SCHEME : DEFAULT_LIGHT_SCHEME;
    }
}


// --- PWA Installation ---
let deferredPrompt;

function setupPwaInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) {
            installButton.style.display = 'block';
            installButton.onclick = () => {
                installButton.style.display = 'none';
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        } else {
                            console.log('User dismissed the install prompt');
                        }
                        deferredPrompt = null;
                    });
                }
            };
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully!');
        if (installButton) {
            installButton.style.display = 'none';
        }
        deferredPrompt = null; // Clear the prompt
    });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // View Toggle Switch
    if (viewToggleSwitch) {
        viewToggleSwitch.addEventListener('change', (event) => {
            renderView(event.target.value);
        });
    }

    // Dark Mode Toggle Switch
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', (event) => {
            const isDark = event.target.checked;
            const newMode = isDark ? 'dark' : 'light';
            applyDarkMode(isDark); // Applies data-bs-theme
            saveDarkModePreference(isDark);

            // Repopulate and select default scheme for the new mode
            populateColorSchemeSelect(newMode);
            const defaultSchemeForMode = newMode === 'dark' ? DEFAULT_DARK_SCHEME : DEFAULT_LIGHT_SCHEME;
            applyColorScheme(defaultSchemeForMode);
            saveColorSchemePreference(defaultSchemeForMode);
        });
    }

    // Color Scheme Select
    if (colorSchemeSelect) {
         colorSchemeSelect.addEventListener('change', (event) => {
            const selectedScheme = event.target.value;
            applyColorScheme(selectedScheme);
            saveColorSchemePreference(selectedScheme);
            // Optional: Force dark/light mode based on scheme's mode property
            // const isDark = colorSchemes[selectedScheme]?.mode === 'dark';
            // if (darkModeSwitch.checked !== isDark) {
            //     darkModeSwitch.checked = isDark;
            //     applyDarkMode(isDark);
            //     saveDarkModePreference(isDark);
            // }
         });
    }

    // Save scroll position
    window.addEventListener('scroll', () => {
        localStorage.setItem('scrollPosition', window.scrollY);
    });
}

// --- Update Detection ---
function detectServiceWorkerUpdate() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service worker updated, prompt user to reload
        showUpdateButton();
    });

    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        if (!registration.waiting) return; // No update waiting

        // Check if there's a new service worker waiting to activate
        if (registration.waiting) {
            showUpdateButton();
        }

        // Listen for updates from the service worker
        registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available, prompt user to reload
                    showUpdateButton();
                }
            };
        });
    });
}

function showUpdateButton() {
    // Check if button already exists
    if (document.getElementById('update-app-button')) return;

    const updateButton = document.createElement('button');
    updateButton.id = 'update-app-button';
    updateButton.textContent = 'Update App';
    // Removed Bootstrap classes: 'btn', 'btn-primary', 'ms-2'
    updateButton.addEventListener('click', () => {
        // Force reload to activate new service worker
        caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
        });
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            } 
        });
        window.location.reload(true); // Force reload from server
    });

    // Append to body instead of navbar
    document.body.appendChild(updateButton);
}


// --- Initialization ---
async function initializeApp() {
    try {
        // Determine initial mode
        const initialDarkModePref = localStorage.getItem('darkMode') === 'enabled';
        const initialMode = initialDarkModePref ? 'dark' : 'light';

        populateColorSchemeSelect(initialMode); // Populate dropdown based on initial mode

        await initDB(); // Initialize database

        loadDarkModePreference(); // Apply dark/light mode theme (sets data-bs-theme)

        // Load saved scheme, check if valid for current mode, apply
        let savedScheme = localStorage.getItem('colorScheme');
        if (!savedScheme || colorSchemes[savedScheme]?.mode !== initialMode) {
            // If saved scheme is invalid for current mode, use default for this mode
            savedScheme = initialMode === 'dark' ? DEFAULT_DARK_SCHEME : DEFAULT_LIGHT_SCHEME;
            saveColorSchemePreference(savedScheme); // Save the corrected default
        }
        applyColorScheme(savedScheme); // Apply scheme CSS class
        if (colorSchemeSelect) {
             colorSchemeSelect.value = savedScheme; // Set dropdown to valid saved/default value
        }

        setupEventListeners(); // Setup listeners AFTER elements exist and prefs loaded
        setupPwaInstall(); // Setup PWA install prompt
        renderView('2-habit-view'); // Render default view

        detectServiceWorkerUpdate(); // Start listening for updates
    } catch (error) {
        console.error("Failed to initialize the app:", error);
        // Optionally display an error message to the user
    }
}

// Start the application
initializeApp();
