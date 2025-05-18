// src/lib/stores/userInfo.js
import { createCookieStore } from '$lib/cookieStore';

export const userInfo = createCookieStore('user', null);
