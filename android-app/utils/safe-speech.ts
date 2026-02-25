import { Platform } from 'react-native';

/**
 * A safe wrapper for expo-speech-recognition and whisper
 * to prevent crashes in Expo Go or incompatible environments.
 */

export const isNativeModuleAvailable = () => {
    // In a real dev build, you'd check if the native module exists.
    // For Expo Go, we'll return false to use the fallback.
    return false;
};

export const startRecordingSafe = async (onResult: (text: string) => void) => {
    console.log("Speech recognition not available in Expo Go - Using Mock Mode");
    // Simulate successful recognition after 2 seconds for testing
    setTimeout(() => {
        onResult("This is a mock result for testing offline UI.");
    }, 2000);
};

export const stopRecordingSafe = async () => {
    console.log("Stopped Mock Recording");
};

export const getSpeechFeedback = (actual: string, expected: string) => {
    const normActual = actual.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const normExpected = expected.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();

    if (normActual === normExpected) return 100;

    // Basic percentage calculation for demo
    const actualWords = normActual.split(' ');
    const expectedWords = normExpected.split(' ');
    const matches = actualWords.filter(w => expectedWords.includes(w)).length;

    return Math.round((matches / expectedWords.length) * 100);
};
