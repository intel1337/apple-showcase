import { writable } from 'svelte/store';

function createAuthStore() {
    const { subscribe, set, update } = writable(false);

    // Initialiser l'état en fonction du localStorage
    if (typeof window !== 'undefined') {
        set(!!localStorage.getItem('token'));
    }

    return {
        subscribe,
        login: (token) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                set(true);
            }
        },
        logout: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                set(false);
            }
        }
    };
}

export const auth = createAuthStore(); 