
// Initialize IndexedDB
let db;
const request = indexedDB.open('HabitTrackerDB', 1);

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('habits', { keyPath: 'month' });
    objectStore.createIndex('month', 'month', { unique: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    initializeCalendar();
};

// Define the habits
const habits = [
    { name: 'exercise', color: 'blue' },
    { name: 'walking', color: 'green' }
];

// Get current date
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

// Initialize Calendar for 6 months (5 past months + current month)
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Clear any previous content
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' });
        const monthElement = document.createElement('div');
        monthElement.classList.add('month');
        if (month === currentMonth && year === currentYear) {
            monthElement.id = 'current-month';
        }
        const monthHeader = document.createElement('div');
        monthHeader.classList.add('month-header');
        monthHeader.textContent = `${monthName} ${year}`;
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');
        monthElement.appendChild(monthHeader);
        monthElement.appendChild(daysGrid);
        calendarGrid.appendChild(monthElement);
        populateDays(month, year, daysGrid);
    }
}

// Populate days for a given month and year
function populateDays(month, year, container) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon');
        // Create habit halves
        habits.forEach(habit => {
            const habitDiv = document.createElement('div');
            habitDiv.classList.add('habit', habit.name);
            habitDiv.dataset.habit = habit.name;
            habitDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHabitCompletion(year, month, day, habit.name, habitDiv);
            });
            hexagon.appendChild(habitDiv);
        });
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayCell.appendChild(hexagon);
        dayCell.appendChild(dayNumber);
        container.appendChild(dayCell);
        // Load saved data
        loadHabitData(year, month, day, hexagon);
    }
}

// Toggle habit completion
function toggleHabitCompletion(year, month, day, habitName, habitDiv) {
    const monthKey = `${year}-${month + 1}`;
    getMonthData(monthKey, (data) => {
        if (!data) {
            data = { month: monthKey, days: {} };
        }
        if (!data.days[day]) {
            data.days[day] = {};
        }
        const wasCompleted = data.days[day][habitName];
        data.days[day][habitName] = !wasCompleted;
        saveMonthData(data);
        // Update UI
        if (data.days[day][habitName]) {
            habitDiv.classList.add('completed');
        } else {
            habitDiv.classList.remove('completed');
        }
    });
}

// Save data to IndexedDB
function saveMonthData(data) {
    const transaction = db.transaction(['habits'], 'readwrite');
    const objectStore = transaction.objectStore('habits');
    const request = objectStore.put(data);
    request.onsuccess = function() {
        console.log(`Data for ${data.month} saved successfully.`);
    };
    request.onerror = function(event) {
        console.error('Error saving data:', event.target.errorCode);
    };
}

// Get data from IndexedDB
function getMonthData(monthKey, callback) {
    const transaction = db.transaction(['habits'], 'readonly');
    const objectStore = transaction.objectStore('habits');
    const request = objectStore.get(monthKey);
    request.onsuccess = function(event) {
        callback(event.target.result);
    };
    request.onerror = function(event) {
        console.error('Error fetching data:', event.target.errorCode);
        callback(null);
    };
}

// Load habit data and update UI
function loadHabitData(year, month, day, hexagon) {
    const monthKey = `${year}-${month + 1}`;
    getMonthData(monthKey, (data) => {
        if (data && data.days && data.days[day]) {
            habits.forEach(habit => {
                const habitState = data.days[day][habit.name];
                const habitDiv = hexagon.querySelector(`.habit.${habit.name}`);
                if (habitState) {
                    habitDiv.classList.add('completed');
                } else {
                    habitDiv.classList.remove('completed');
                }
            });
        }
    });
}

// Add scroll position saving
window.addEventListener('scroll', () => {
    localStorage.setItem('scrollPosition', window.scrollY);
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function () {
    const settingsGear = document.getElementById('settings-gear');
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = document.querySelector('.close-button');

    // Check if elements exist before adding event listeners
    if (settingsGear && settingsModal && closeButton) {
        // Open modal when 'Gear' icon is clicked
        settingsGear.addEventListener('click', () => {
            if (settingsModal) {
                settingsModal.style.display = 'flex'; // Show the modal
            }
        });

        // Close modal when 'X' button is clicked
        closeButton.addEventListener('click', () => {
            if (settingsModal) {
                settingsModal.style.display = 'none'; // Hide the modal
            }
        });

        // Optional: Close modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none'; // Hide if clicking outside modal content
            }
        });
    }

    // Initialize the calendar
    initializeCalendar();
});
