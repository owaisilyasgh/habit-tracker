// ui.js - UI rendering and interaction logic

import { habits2, habits6 } from './config.js';
import { getMonthData, saveMonthData } from './db.js';

// --- DOM Element References ---
const calendarGrid = document.getElementById('calendar-grid');
const darkModeSwitch = document.getElementById('dark-mode-switch');
const navbar = document.querySelector('.navbar');

// --- Global State (UI related) ---
let currentView = '2-habit-view'; // Default view
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

// --- Dark Mode ---
export function applyDarkMode(isDark) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (navbar) {
        navbar.setAttribute('data-bs-theme', theme);
    }
    // Keep body class for custom non-Bootstrap styles
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

export function loadDarkModePreference() {
    const preference = localStorage.getItem('darkMode');
    const isDark = preference === 'enabled';
    applyDarkMode(isDark);
    if (darkModeSwitch) {
        darkModeSwitch.checked = isDark;
    }
}

export function saveDarkModePreference(isDark) {
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// --- Color Scheme ---
/**
 * Applies the selected color scheme by adding the corresponding class to the body.
 * @param {string} schemeName - The key of the scheme (e.g., 'light-default').
 */
export function applyColorScheme(schemeName) {
    // Remove any existing color scheme classes
    document.body.className = document.body.className.replace(/\bcolor-scheme-\S+/g, '').trim();
    // Add the new scheme class
    if (schemeName) {
        document.body.classList.add(`color-scheme-${schemeName}`);
        console.log(`Applied color scheme: ${schemeName}`);
    } else {
         console.warn("No color scheme name provided to apply.");
    }
}


// --- Calendar Rendering ---

/**
 * Main function to render the selected view's calendar grid.
 * @param {string} viewType - '2-habit-view' or '6-habit-view'.
 */
export function renderView(viewType) {
    currentView = viewType;
    if (!calendarGrid) return;

    calendarGrid.innerHTML = ''; // Clear previous grid
    calendarGrid.className = 'calendar-grid'; // Reset classes

    if (viewType === '2-habit-view') {
        calendarGrid.classList.add('hexagon-grid-2');
        renderMonths(render2HabitHexagonGrid);
    } else if (viewType === '6-habit-view') {
        calendarGrid.classList.add('hexagon-grid-6');
        renderMonths(render6HabitHexagonGrid);
    }

    restoreScrollPosition();
}

/**
 * Renders month containers and calls the specific day population function.
 * @param {function} populateDaysFunction - The function to render days for the current view.
 */
function renderMonths(populateDaysFunction) {
    const fragment = document.createDocumentFragment(); // Use fragment for performance
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' });

        // Create card structure
        const cardElement = document.createElement('div');
        // Add card, shadow, and margin bottom classes
        cardElement.classList.add('card', 'shadow-sm', 'mb-4');
        if (month === currentMonth && year === currentYear) {
            cardElement.id = 'current-month'; // ID on the card itself
        }

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'p-2'); // Add some padding inside card

        // Create month header (will go inside card body)
        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header', 'mb-2'); // Add margin bottom
        monthHeader.textContent = `${monthName} ${year}`;

        // Create days grid (will go inside card body)
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');

        // Append header and grid to card body
        cardBody.appendChild(monthHeader);
        cardBody.appendChild(daysGrid);

        // Append card body to card
        cardElement.appendChild(cardBody);

        fragment.appendChild(cardElement); // Append card to fragment

        // Populate days for this month
        populateDaysFunction(month, year, daysGrid);
    }
    calendarGrid.appendChild(fragment); // Append all months at once
}

/** Populates days for the 2-Habit View */
function render2HabitHexagonGrid(month, year, container) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const fragment = document.createDocumentFragment();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.id = 'current-day'; // Add ID for current day
        }

        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon-2');

        habits2.forEach(habit => {
            const habitDiv = document.createElement('div');
            habitDiv.classList.add('habit', habit.name);
            habitDiv.dataset.habit = habit.name;
            habitDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHabitCompletion(year, month, day, habit.name, habitDiv);
            });
            hexagon.appendChild(habitDiv);
        });

        const dayNumber = createDayNumberElement(day);
        dayCell.appendChild(hexagon);
        dayCell.appendChild(dayNumber);
        fragment.appendChild(dayCell);

        loadHabitDataForView(year, month, day, hexagon, habits2);
    }
    container.appendChild(fragment);
}

/** Populates days for the 6-Habit View */
function render6HabitHexagonGrid(month, year, container) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
     const fragment = document.createDocumentFragment();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.id = 'current-day'; // Add ID for current day
        }

        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon-6');

        habits6.forEach((habit, index) => {
            const segmentDiv = document.createElement('div');
            segmentDiv.classList.add('segment', `segment-${index + 1}`, habit.name);
            segmentDiv.dataset.habit = habit.name;
            segmentDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHabitCompletion(year, month, day, habit.name, segmentDiv);
            });
            hexagon.appendChild(segmentDiv);
        });

        const dayNumber = createDayNumberElement(day);
        dayCell.appendChild(hexagon);
        dayCell.appendChild(dayNumber);
        fragment.appendChild(dayCell);

        loadHabitDataForView(year, month, day, hexagon, habits6);
    }
     container.appendChild(fragment);
}

/** Helper to create the day number element */
function createDayNumberElement(day) {
    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = day;
    return dayNumber;
}

// --- Data Interaction and UI Update ---

/**
 * Toggles habit completion state in DB and updates the UI element.
 * Uses async/await for DB operations.
 */
async function toggleHabitCompletion(year, month, day, habitName, element) {
    const monthKey = `${year}-${month + 1}`;
    try {
        let data = await getMonthData(monthKey);

        if (!data) {
            data = { month: monthKey, days: {} };
        }
        if (!data.days[day]) {
            data.days[day] = {};
        }

        if (!data.days[day][currentView]) { // Add viewType check
            data.days[day][currentView] = {};
        }


        const wasCompleted = data.days[day][currentView][habitName] || false; // Use viewType
        data.days[day][currentView][habitName] = !wasCompleted; // Use viewType

        await saveMonthData(data); // Wait for save to complete

        // Update UI
        if (data.days[day][currentView][habitName]) { // Use viewType
            element.classList.add('completed');
        } else {
            element.classList.remove('completed');
        }
    } catch (error) {
        console.error(`Failed to toggle habit ${habitName} for ${monthKey}-${day}:`, error);
        // Optionally: Show user feedback about the error
    }
}

/**
 * Loads habit data for a specific day/view and updates the UI elements.
 * Uses async/await for DB operations.
 */
async function loadHabitDataForView(year, month, day, hexagonElement, habitArray) {
    const monthKey = `${year}-${month + 1}`;
    try {
        const data = await getMonthData(monthKey);

        if (data && data.days && data.days[day]) {
            const viewData = data.days[day][currentView]; // Get view-specific data
            if (viewData) {
                habitArray.forEach(habit => {
                    const habitState = viewData[habit.name]; // Use view-specific data
                    const habitElement = hexagonElement.querySelector(`.${habit.name}`);
                    if (habitElement) {
                        if (habitState) {
                            habitElement.classList.add('completed');
                        } else {
                            habitElement.classList.remove('completed');
                        }
                    } else {
                        // console.warn(`Element for habit ${habit.name} not found in hexagon for ${year}-${month+1}-${day}`);
                    }
                });
            } else {
                // Ensure all elements are in the 'off' state if no data exists for this view
                habitArray.forEach(habit => {
                    const habitElement = hexagonElement.querySelector(`.${habit.name}`);
                    if (habitElement) {
                        habitElement.classList.remove('completed');
                    }
                });
            }
        } else {
            // Ensure all elements are in the 'off' state if no month/day data exists
            habitArray.forEach(habit => {
                const habitElement = hexagonElement.querySelector(`.${habit.name}`);
                if (habitElement) {
                    habitElement.classList.remove('completed');
                }
            });
        }
    } catch (error) {
         console.error(`Failed to load habit data for ${monthKey}-${day}:`, error);
    }
}

// --- Scroll Position ---
export function restoreScrollPosition() {
    setTimeout(() => {
        const scrollPosition = localStorage.getItem('scrollPosition');
        const currentMonthElement = document.getElementById('current-month');
        const currentDayElement = document.getElementById('current-day'); // Get current day element

        if (scrollPosition !== null) {
            window.scrollTo({ top: parseInt(scrollPosition), behavior: 'auto' });
        } else if (currentDayElement) {
            currentDayElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to current day if available
        } else if (currentMonthElement) {
            currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}
