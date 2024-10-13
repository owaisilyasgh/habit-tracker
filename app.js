
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
    console.info('Database opened successfully');
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
    if (!db) {
        console.error('Database is not initialized yet. Retrying...');
        setTimeout(initializeCalendar, 100); // Retry after a short delay
        return;
    }

    console.debug('Initializing calendar...');
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.error('Calendar grid element not found.');
        return;
    }
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month}`;
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
        console.debug('Populating days for:', year, month + 1);
        getMonthData(monthKey, (data) => {
            populateDays(month, year, daysGrid, data);
        });
    }

    // Restore scroll position after calendar is rendered
    setTimeout(() => {
        const scrollPosition = localStorage.getItem('scrollPosition');
        if (scrollPosition !== null) {
            window.scrollTo({
                top: parseInt(scrollPosition),
                behavior: 'smooth'
            });
        }
    }, 100); // Delay to ensure rendering is complete
}

// Populate days for a given month and year
function populateDays(month, year, container, monthData) {
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
            if (monthData && monthData[`${day}-${habit.name}`]) {
                habitDiv.classList.add('completed');
            }
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

        // Append elements correctly to day cell
        dayCell.appendChild(hexagon);
        dayCell.appendChild(dayNumber);
        container.appendChild(dayCell);
    }
}

// Save data to IndexedDB
function saveMonthData(monthKey, data) {
    if (!db) {
        console.error('Database is not initialized');
        return;
    }
    const transaction = db.transaction(['habits'], 'readwrite');
    const objectStore = transaction.objectStore('habits');
    const request = objectStore.put({ month: monthKey, ...data });
    request.onsuccess = function() {
        console.log(`Data for ${monthKey} saved successfully.`);
    };
    request.onerror = function(event) {
        console.error('Error saving data:', event.target.errorCode);
    };
}

// Get data from IndexedDB
function getMonthData(monthKey, callback) {
    if (!db) {
        console.error('Database is not initialized');
        return;
    }
    const transaction = db.transaction(['habits'], 'readonly');
    const objectStore = transaction.objectStore('habits');
    const request = objectStore.get(monthKey);
    request.onsuccess = function(event) {
        callback(event.target.result ? event.target.result : {});
    };
    request.onerror = function(event) {
        console.error('Error getting data:', event.target.errorCode);
    };
}

// Toggle habit completion
function toggleHabitCompletion(year, month, day, habitName, element) {
    console.debug('Toggling habit:', habitName, 'for day:', day);
    element.classList.toggle('completed');
    const monthKey = `${year}-${month}`;
    getMonthData(monthKey, (monthData) => {
        const updatedData = monthData || {};
        updatedData[`${day}-${habitName}`] = element.classList.contains('completed');
        saveMonthData(monthKey, updatedData);
    });
}

// Event listener for settings button to open modal
document.getElementById('settings-button').addEventListener('click', () => {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.style.display = 'block';
    }
});

// Close modal when clicking outside or on the close button
document.addEventListener('click', (event) => {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal && event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Rest of original app.js content remains unchanged
