import { Alert } from "react-native";
import React from 'react';

/**
 * A fail-safe wrapper that prevents crashes if the native module is missing.
 * We use dynamic require to avoid top-level import errors in Metro.
 */
let NativeModule: any = null;
let NativeHook: any = null;

try {
    const Lib = require("expo-speech-recognition");
    NativeModule = Lib.ExpoSpeechRecognitionModule;
    NativeHook = Lib.useSpeechRecognitionEvent;
} catch (e) {
    console.warn("Could not find expo-speech-recognition library.");
}

// Detection for missing native module behavior
const isNativeAvailable = !!NativeModule && typeof NativeModule.requestPermissionsAsync === 'function';

export const ExpoSpeechRecognitionModule = isNativeAvailable ? NativeModule : {
    requestPermissionsAsync: async () => {
        Alert.alert("Development Build Required", "Native Speech Recognition is not available in Expo Go. Use 'npx expo run:android' to build a compatible client.");
        return { granted: false };
    },
    start: () => console.log("[Mock] Speech Recognition Start"),
    stop: () => console.log("[Mock] Speech Recognition Stop"),
    abort: () => console.log("[Mock] Speech Recognition Abort"),
    getStateAsync: async () => ({ status: 'idle' }),
};

export const useSpeechRecognitionEvent = (eventName: string, callback: (event: any) => void) => {
    // If native is available, use the real hook
    if (isNativeAvailable && NativeHook) {
        return NativeHook(eventName, callback);
    }

    // Otherwise, do nothing (silent mock)
    React.useEffect(() => {
        console.log(`[Mock] Registered listener for: ${eventName}`);
    }, [eventName]);
};
