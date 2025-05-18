import { writable } from 'svelte/store';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 7) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

export function createCookieStore(cookieName, initialValue, days = 7) {
    let cookieValue = getCookie(cookieName);
    if (cookieValue === null && initialValue !== undefined) {
        cookieValue = initialValue;
        setCookie(cookieName, cookieValue, days);
    }
    const { subscribe, set, update } = writable(cookieValue);
    return {
        subscribe,
        set: (value) => {
            setCookie(cookieName, value, days);
            set(value);
        },
        update
    };
}
