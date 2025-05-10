// config.js - Habit definitions and constants

// Base habit names (used as keys in schemes)
const habitNames = ['habit1', 'habit2', 'habit3', 'habit4', 'habit5', 'habit6'];

// --- Color Schemes ---

const baseOnColors = {
    habit1: '#2196f3', // Blue
    habit2: '#4caf50', // Green
    habit3: '#673ab7', // Deep Purple
    habit4: '#ffc107', // Amber
    habit5: '#f44336', // Red
    habit6: '#795548'  // Brown
};

const pastelOnColors = {
    habit1: '#64b5f6', // Soft Blue
    habit2: '#81c784', // Soft Green
    habit3: '#9575cd', // Soft Purple
    habit4: '#ffd54f', // Soft Amber
    habit5: '#e57373', // Soft Red
    habit6: '#a1887f'  // Soft Brown
};

const neonOnColors = {
    habit1: '#29b6f6', // Bright Blue
    habit2: '#66bb6a', // Bright Green
    habit3: '#7e57c2', // Bright Purple
    habit4: '#ffee58', // Bright Yellow
    habit5: '#ef5350', // Bright Red
    habit6: '#bcaaa4'  // Lighter Brown
};

export const colorSchemes = {
    'light-default': {
        name: 'Light - Default',
        mode: 'light',
        off: {
            habit1: '#bbdefb', habit2: '#c8e6c9', habit3: '#d1c4e9',
            habit4: '#ffecb3', habit5: '#ffcdd2', habit6: '#d7ccc8'
        },
        on: baseOnColors
    },
    'light-contrast': {
        name: 'Light - Contrast',
        mode: 'light',
        off: { // Use a single light gray for all off states
            habit1: '#e9ecef', habit2: '#e9ecef', habit3: '#e9ecef',
            habit4: '#e9ecef', habit5: '#e9ecef', habit6: '#e9ecef'
        },
        on: baseOnColors
    },
    'light-pastel': {
        name: 'Light - Pastel',
        mode: 'light',
        off: { // Use a single light gray for all off states
            habit1: '#e9ecef', habit2: '#e9ecef', habit3: '#e9ecef',
            habit4: '#e9ecef', habit5: '#e9ecef', habit6: '#e9ecef'
        },
        on: pastelOnColors
    },
    'dark-default': {
        name: 'Dark - Default',
        mode: 'dark',
        off: {
            habit1: '#4a6a8a', habit2: '#5f8a61', habit3: '#4a4a6a',
            habit4: '#8a7a4a', habit5: '#8a5f5f', habit6: '#6a4a3a'
        },
        on: baseOnColors
    },
    'dark-contrast': {
        name: 'Dark - Contrast',
        mode: 'dark',
        off: { // Use a single dark gray for all off states
            habit1: '#495057', habit2: '#495057', habit3: '#495057',
            habit4: '#495057', habit5: '#495057', habit6: '#495057'
        },
        on: baseOnColors
    },
    'dark-neon': {
        name: 'Dark - Neon',
        mode: 'dark',
        off: { // Use a single very dark gray for all off states
            habit1: '#343a40', habit2: '#343a40', habit3: '#343a40',
            habit4: '#343a40', habit5: '#343a40', habit6: '#343a40'
        },
        on: neonOnColors
    }
};

// --- Original Habit Definitions (still needed by ui.js for structure) ---
export const habits2 = [
    { name: 'habit1' }, // Colors are now handled by schemes
    { name: 'habit2' }
];

export const habits6 = [
    { name: 'habit1' }, { name: 'habit2' }, { name: 'habit3' },
    { name: 'habit4' }, { name: 'habit5' }, { name: 'habit6' }
];

// Definition for the 5-Habit View
export const habits5 = [
    { name: 'habit1' }, { name: 'habit2' }, { name: 'habit3' },
    { name: 'habit4' }, { name: 'habit5' }
];
