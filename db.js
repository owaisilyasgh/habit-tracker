// db.js - IndexedDB interactions using Promises

let db;
const DB_NAME = 'HabitTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'habits';

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(`Database error: ${event.target.error}`);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME, { keyPath: 'month' });
                console.log(`Object store '${STORE_NAME}' created.`);
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database opened successfully.');
            resolve(db);
        };
    });
}

/**
 * Gets habit data for a specific month.
 * @param {string} monthKey - The month key (e.g., '2024-7').
 * @returns {Promise<object|null>} A promise that resolves with the month data or null if not found/error.
 */
export async function getMonthData(monthKey) {
    if (!db) await initDB(); // Ensure DB is initialized

    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.get(monthKey);

            request.onsuccess = (event) => {
                resolve(event.target.result || null); // Resolve with data or null
            };

            request.onerror = (event) => {
                console.error(`Error fetching data for ${monthKey}:`, event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error starting readonly transaction:", error);
            reject(error);
        }
    });
}

/**
 * Saves habit data for a month.
 * @param {object} data - The month data object to save.
 * @returns {Promise<void>} A promise that resolves when saving is complete or rejects on error.
 */
export async function saveMonthData(data) {
    if (!db) await initDB(); // Ensure DB is initialized

    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.put(data);

            request.onsuccess = () => {
                // console.log(`Data for ${data.month} saved successfully.`); // Less verbose
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Error saving data for ${data.month}:`, event.target.error);
                reject(event.target.error);
            };
        } catch (error) {
            console.error("Error starting readwrite transaction:", error);
            reject(error);
        }
    });
}
