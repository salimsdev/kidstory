// An array of routes that are accessible to the public
// These routes do not require authentication

export const publicRoutes = [
    "/",
    "/verification-email",
    "/api/webhook",
    "/politique-de-confidentialite",
    "/conditions-generales",
    "/api/reset"
]

// An array of routes that are used for authentication
// These routes will redirect logged in users to /chat

export const authRoutes = [
    "/s-inscrire",
    "/se-connecter",
    "/authentification-erreur",
    "/reset",
    "/nouveau-mot-de-passe"
]

// The prefix for API authentication routes
// Routes that start with this prefix are used for API authentication purposes

export const apiAuthPrefix = "/api/auth"

// The default redirect path after logging in

export const DEFAULT_LOGIN_REDIRECT = '/bibliotheque'