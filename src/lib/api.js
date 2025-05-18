import ky from 'ky';
import { get } from 'svelte/store';
import { userToken } from '$lib/stores/auth';

const api = ky.create({
    prefixUrl: 'http://192.168.1.115:3000/', // optionnel, pour préfixer vos URL
    hooks: {
        beforeRequest: [
            (request) => {
                const token = get(userToken);
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            }
        ]
    }
});

export default api;
