import { initializeApp } from "firebase/app";
import { 
    GoogleAuthProvider, 
    getAuth, 
    signInWithPopup, 
    signInWithRedirect, 
    getRedirectResult 
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBHDhTYjxVZn54JgKbumDGXSuyYHYyweXU",
    authDomain: "blogging-website-1979c.firebaseapp.com",
    projectId: "blogging-website-1979c",
    storageBucket: "blogging-website-1979c.firebasestorage.app",
    messagingSenderId: "698733995597",
    appId: "1:698733995597:web:ba53a97c4d9a4533ab1e04",
    measurementId: "G-HR27THP5KC"
};

const app = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    try {
        // First, try popup method
        try {
            const popupResult = await signInWithPopup(auth, provider);
            return popupResult.user;
        } catch (popupError) {
            // If popup fails (e.g., blocked by browser), fall back to redirect
            console.warn('Popup authentication failed, falling back to redirect:', popupError);
            
            // Initiate redirect authentication
            await signInWithRedirect(auth, provider);
            
            // This will be handled in a separate method or component
            return null;
        }
    } catch (err) {
        console.error('Google Authentication Error:', err);
        return null;
    }
}

// Add this method to handle redirect result in your main authentication flow
export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            return result.user;
        }
        return null;
    } catch (err) {
        console.error('Redirect Result Error:', err);
        return null;
    }
}