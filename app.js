// app.js 

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

// Add PWA install functionality
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to show the install button
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        // Hide the install button
        installButton.style.display = 'none';
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully!');
});

// Render Group Activity 2 (Circle with 5 wedges)
function renderGroupActivity2Grid() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Clear the grid

    for (let i = 1; i <= 31; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        const circle = document.createElement('div');
        circle.classList.add('circle');

        // Create 5 wedge segments
        for (let j = 1; j <= 5; j++) {
            const wedge = document.createElement('div');
            wedge.classList.add(`wedge-${j}`);
            circle.appendChild(wedge);
        }

        // Log for debugging
        console.log(`Day ${i}: Circle with wedges created`);

        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = i;

        dayCell.appendChild(circle);
        dayCell.appendChild(dayNumber);
        calendarGrid.appendChild(dayCell);
    }
}


// Modify the toggle switch logic to reflect "Group Activity 2"
document.getElementById('toggle-switch').addEventListener('change', (event) => {
    const selectedView = event.target.value;
    const calendarGrid = document.getElementById('calendar-grid');
    const header = document.querySelector('header');

    // Clear the existing grid before rendering the new view
    calendarGrid.innerHTML = '';

    if (selectedView === 'group-activity-2') {
        // Switch to Group Activity 2 (Circle view) and apply a new dark theme
        document.body.classList.remove('hexagon-theme');
        document.body.classList.add('circle-theme'); // Use circle-theme instead
        calendarGrid.classList.remove('hexagon-grid');
        calendarGrid.classList.add('circle-grid'); // New class for circle grid
        header.classList.add('circle-theme'); // New class for header style in circle view
        renderGroupActivity2Grid();  // Render circles with 5 wedges
    } else {
        // Switch back to hexagon view and revert to light theme
        document.body.classList.remove('circle-theme');
        document.body.classList.add('hexagon-theme');
        calendarGrid.classList.remove('circle-grid');
        calendarGrid.classList.add('hexagon-grid');
        header.classList.remove('circle-theme');
        initializeCalendar();  // Re-render hexagon view
    }
});


