import { Platform } from 'react-native';

/**
 * For Android Emulators, 'localhost' refers to the device itself.
 * To access the host machine's localhost, we must use '10.0.2.2'.
 */
const PRODUCTION_BACKEND_URL = 'https://api-english-speech.udvabok.com';

const DEV_BACKEND_URL = Platform.select({
    android: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000',
    default: 'http://localhost:3000',
});

// Switch to PRODUCTION_BACKEND_URL for the hosted version
export const Config = {
    API_URL: PRODUCTION_BACKEND_URL,
};
