import { Platform } from 'react-native';

/**
 * For Android Emulators, 'localhost' refers to the device itself.
 * To access the host machine's localhost, we must use '10.0.2.2'.
 */
const DEV_BACKEND_URL = Platform.select({
    android: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000',
    default: 'http://localhost:3000',
});

export const Config = {
    API_URL: DEV_BACKEND_URL,
};
