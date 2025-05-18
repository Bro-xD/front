import { createCookieStore } from '$lib/cookieStore';

// Le token JWT, stocké dans un cookie "userToken"
// On peut définir une valeur initiale vide.
export const userToken = createCookieStore('userToken', '');

// Les informations de l'utilisateur courant, par exemple en JSON
// On stocke sous forme de chaîne JSON, puis on les parse dans les composants si nécessaire.
export const currentUser = createCookieStore('currentUser', '');