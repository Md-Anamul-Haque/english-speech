import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "../../utils/safe-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import type { ISentence, IWord, ITopic } from "../../types/index";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Config } from "../../constants/Config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.4;
const CARD_MARGIN = 12;

const speakMaleVoice = async (text: string) => {
    const voices = await Speech.getAvailableVoicesAsync();
    const maleVoices = voices.filter(
        (voice) =>
            voice.quality === Speech.VoiceQuality.Enhanced &&
            voice.name.toLowerCase().includes('male')
    );

    const selectedVoice = maleVoices.length > 0 ? maleVoices[0].identifier : undefined;

    Speech.speak(text, {
        voice: selectedVoice,
        rate: 1.0,
        pitch: 1.0,
    });
};

const speak = (text: string) => {
    speakMaleVoice(text);
};

export default function TopicPlayground() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();

    const [topic, setTopic] = useState<ITopic | null>(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [verifiedWords, setVerifiedWords] = useState<Set<string>>(new Set());
    const [verifiedSentences, setVerifiedSentences] = useState<Set<string>>(new Set());
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [verificationFeedback, setVerificationFeedback] = useState<{
        [key: string]: string | null;
    }>({});

    const activeVerificationRef = useRef<{
        type: "word" | "sentence";
        id: string;
        text: string;
    } | null>(null);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const res = await fetch(`${Config.API_URL}/api/topics/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setTopic(data);
                } else {
                    Alert.alert("Error", "Failed to load topic data.");
                    router.back();
                }
            } catch (error) {
                console.error("Error fetching topic payload:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchTopicData();
    }, [slug]);

    const comparePronunciation = (
        expected: string,
        transcribed: string
    ): { isCorrect: boolean; similarity: number } => {
        const expectedLower = expected.toLowerCase().trim().replace(/[.,!?;:]/g, "");
        const transcribedLower = transcribed.toLowerCase().trim().replace(/[.,!?;:]/g, "");

        if (!transcribedLower) return { isCorrect: false, similarity: 0 };
        if (expectedLower === transcribedLower) return { isCorrect: true, similarity: 100 };

        const expectedWords = expectedLower.split(/\s+/);
        const transcribedWords = transcribedLower.split(/\s+/);

        let matches = 0;
        expectedWords.forEach((word) => {
            if (transcribedWords.includes(word)) matches += 1;
        });

        const similarity = (matches / expectedWords.length) * 100;
        return { isCorrect: similarity >= 80, similarity: Math.round(similarity) };
    };

    const handleSpeechResult = (spokenText: string) => {
        const current = activeVerificationRef.current;
        if (!current) return;

        const key = `${current.type}-${current.id}`;
        const result = comparePronunciation(current.text, spokenText);

        setVerificationFeedback((prev) => ({
            ...prev,
            [key]: result.isCorrect
                ? `Great! (${result.similarity}% match)`
                : `Heard: "${spokenText}" (${result.similarity}%)`,
        }));

        if (result.isCorrect) {
            if (current.type === "word") {
                setVerifiedWords((prev) => new Set([...prev, current.id]));
            } else {
                setVerifiedSentences((prev) => new Set([...prev, current.id]));
            }
        }

        setIsRecording(false);
        activeVerificationRef.current = null;
    };

    useSpeechRecognitionEvent("end", () => setIsRecording(false));
    useSpeechRecognitionEvent("result", (event) => {
        const text = event.results[0]?.transcript ?? "";
        if (text && event.isFinal) handleSpeechResult(text);
    });

    const startVoice = async (type: "word" | "sentence", id: string, text: string) => {
        try {
            const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!permission.granted) return Alert.alert("Permission Required", "Microphone access is needed.");

            ExpoSpeechRecognitionModule.abort();
            activeVerificationRef.current = { type, id, text };
            setIsRecording(true);
            setVerificationFeedback(prev => ({ ...prev, [`${type}-${id}`]: "Listening..." }));

            ExpoSpeechRecognitionModule.start({ lang: "en-US" });
        } catch (e) {
            setIsRecording(false);
        }
    };

    if (isLoading || !topic) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Preparing lesson...</Text>
            </View>
        );
    }

    const words = topic.words as IWord[];
    const sentences = topic.sentences as ISentence[];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            <View style={[styles.header as any]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{topic.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.headerSubtitle}>Progress: {verifiedWords.size + verifiedSentences.size} items</Text>
                        <View style={[styles.difficultyBadge, (styles as any)[`diff_${words[0]?.difficulty || 'beginner'}`]]}>
                            <Text style={styles.difficultyLabel}>{(words[0]?.difficulty || 'beginner').toUpperCase()}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Step 1: Learn Vocabulary</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wordsRow}>
                        {words.map((word) => {
                            const id = word._id!;
                            const isVerifying = isRecording && activeVerificationRef.current?.id === id;
                            const isDone = verifiedWords.has(id);

                            return (
                                <TouchableOpacity key={id} style={[styles.wordCard, isDone && styles.wordCardDone]}>
                                    <View style={styles.wordHeader}>
                                        <Text style={styles.wordEnglish}>{word.english.split(' (')[0]}</Text>
                                        <View style={styles.posBadge}>
                                            <Text style={styles.posLabel}>{word.partOfSpeech?.substring(0, 1).toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    {word.pronunciation && (
                                        <Text style={styles.wordPronunciation}>({word.pronunciation})</Text>
                                    )}
                                    <Text style={styles.wordBangla}>{word.bangla}</Text>

                                    <View style={styles.wordActions}>
                                        <TouchableOpacity onPress={() => speak(word.english)}>
                                            <Ionicons name="volume-high" size={20} color="#3B82F6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => startVoice("word", id, word.english)}>
                                            <Ionicons
                                                name={isVerifying ? "stop-circle" : isDone ? "checkmark-circle" : "mic-outline"}
                                                size={24}
                                                color={isVerifying ? "#EF4444" : isDone ? "#10B981" : "#64748B"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {verificationFeedback[`word-${id}`] && (
                                        <Text style={styles.feedbackMini}>{verificationFeedback[`word-${id}`]}</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Step 2: Practice Sentences</Text>
                    {sentences.map((item) => {
                        const id = item._id!;
                        const isDone = verifiedSentences.has(id);
                        const isVerifying = isRecording && activeVerificationRef.current?.id === id;

                        return (
                            <View key={id} style={[styles.sentenceCard, isDone && styles.sentenceCardDone]}>
                                <View style={styles.sentenceMain}>
                                    <View style={styles.sentenceText}>
                                        <Text style={styles.sEnglish}>{item.english}</Text>
                                        <Text style={styles.sBangla}>{item.bangla}</Text>
                                    </View>
                                    <View style={[styles.contextBadge, { backgroundColor: item.contextColor }]}>
                                        <Text style={styles.contextLabel}>{item.context}</Text>
                                    </View>
                                </View>

                                <View style={styles.sentenceActions}>
                                    <TouchableOpacity style={styles.sBtn} onPress={() => speak(item.english)}>
                                        <Ionicons name="volume-high" size={20} color="#3B82F6" />
                                        <Text style={styles.sBtnText}>Listen</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.sBtn, styles.sBtnPrimary]}
                                        onPress={() => startVoice("sentence", id, item.english)}
                                    >
                                        <Ionicons name={isVerifying ? "stop-circle" : "mic"} size={20} color="#FFF" />
                                        <Text style={[styles.sBtnText, { color: '#FFF' }]}>
                                            {isVerifying ? "Stop" : isDone ? "Redo" : "Speak"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {(item.feedback || verificationFeedback[`sentence-${id}`]) && (
                                    <View style={styles.feedbackBox}>
                                        <Ionicons name="sparkles" size={16} color="#10B981" />
                                        <Text style={styles.feedbackText}>
                                            {verificationFeedback[`sentence-${id}`] || item.feedback}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, color: "#64748B" },
    header: { padding: 20, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
    backButton: { marginRight: 16, padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
    headerSubtitle: { fontSize: 13, color: "#64748B" },
    scrollContent: { padding: 20 },
    section: { marginBottom: 32 },
    sectionLabel: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: "#1E293B" },
    wordsRow: { paddingRight: 40 },
    wordCard: {
        width: 150,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginRight: 12
    },
    wordCardDone: { borderColor: "#10B981", backgroundColor: "#F0FDF4" },
    wordEnglish: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
    wordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    wordPronunciation: { fontSize: 13, color: "#3B82F6", fontWeight: "600", marginTop: 2 },
    wordBangla: { fontSize: 14, color: "#64748B", marginTop: 6 },
    posBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#F1F5F9' },
    posLabel: { fontSize: 9, fontWeight: '800', color: '#64748B' },
    difficultyBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    difficultyLabel: { fontSize: 10, fontWeight: '800', color: '#FFF' },
    diff_beginner: { backgroundColor: '#10B981' },
    diff_intermediate: { backgroundColor: '#F59E0B' },
    diff_advanced: { backgroundColor: '#EF4444' },
    wordActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, alignItems: "center" },
    feedbackMini: { fontSize: 10, color: "#3B82F6", marginTop: 8 },
    sentenceCard: { padding: 18, borderRadius: 20, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#F1F5F9", marginBottom: 16, elevation: 2 },
    sentenceCardDone: { borderColor: "#10B981" },
    sentenceMain: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    sentenceText: { flex: 1, paddingRight: 10 },
    sEnglish: { fontSize: 17, fontWeight: "600", color: "#0F172A", lineHeight: 24 },
    sBangla: { fontSize: 15, color: "#64748B", marginTop: 4 },
    contextBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    contextLabel: { fontSize: 10, fontWeight: "700", color: "#FFF" },
    sentenceActions: { flexDirection: "row", gap: 12, marginTop: 20 },
    sBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 12, backgroundColor: "#F1F5F9", gap: 8 },
    sBtnPrimary: { backgroundColor: "#3B82F6" },
    sBtnText: { fontSize: 14, fontWeight: "600", color: "#475569" },
    feedbackBox: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, padding: 12, backgroundColor: "#F0FDF4", borderRadius: 10 },
    feedbackText: { fontSize: 13, color: "#106141", fontWeight: "500" }
});
