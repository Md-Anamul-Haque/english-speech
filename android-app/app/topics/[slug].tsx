import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';
import { dataProvider } from "../../data/DataProvider";
import { ITopic, IWord, ISentence } from "../../types";
import { startRecordingSafe, stopRecordingSafe, getSpeechFeedback } from "../../utils/safe-speech";

const { width } = Dimensions.get('window');

const TopicPlayground = () => {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const [topic, setTopic] = useState<ITopic | null>(null);
    const [activeTab, setActiveTab] = useState<'words' | 'sentences'>('words');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [recognizedText, setRecognizedText] = useState("");

    // Performance Tracking
    const [verifiedWords, setVerifiedWords] = useState<Set<string>>(new Set());
    const [verifiedSentences, setVerifiedSentences] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (slug) {
            const data = dataProvider.getTopicBySlug(slug);
            if (data) {
                setTopic(data);
            }
        }
    }, [slug]);

    if (!topic) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading offline content...</Text>
            </View>
        );
    }

    const words = topic.words as IWord[];
    const sentences = topic.sentences as ISentence[];
    const currentList = activeTab === 'words' ? words : sentences;
    const currentItem = currentList[currentIndex];

    const handleSpeech = async () => {
        if (isRecording) {
            await stopRecordingSafe();
            setIsRecording(false);
        } else {
            setIsRecording(true);
            setScore(null);
            setRecognizedText("");

            await startRecordingSafe((text) => {
                setRecognizedText(text);
                const target = activeTab === 'words' ? currentItem.english : currentItem.english;
                const result = getSpeechFeedback(text, target);
                setScore(result);
                setIsRecording(false);

                if (result > 80) {
                    if (activeTab === 'words') {
                        setVerifiedWords(prev => new Set(prev).add(currentItem.english));
                    } else {
                        setVerifiedSentences(prev => new Set(prev).add(currentItem.english));
                    }
                }
            });
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
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

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'words' && styles.activeTab]}
                    onPress={() => { setActiveTab('words'); setCurrentIndex(0); setScore(null); }}
                >
                    <Text style={[styles.tabText, activeTab === 'words' && styles.activeTabText]}>Words (20)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sentences' && styles.activeTab]}
                    onPress={() => { setActiveTab('sentences'); setCurrentIndex(0); setScore(null); }}
                >
                    <Text style={[styles.tabText, activeTab === 'sentences' && styles.activeTabText]}>Sentences (10)</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content Card */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Animated.View key={`${activeTab}-${currentIndex}`} entering={FadeInUp} style={styles.mainCard}>
                    {activeTab === 'words' ? (
                        <View style={styles.wordContent}>
                            <View style={styles.posBadge}>
                                <Text style={styles.posText}>{(currentItem as IWord).partOfSpeech || 'noun'}</Text>
                            </View>
                            <Text style={styles.englishText}>{currentItem.english}</Text>
                            <Text style={styles.pronunciationText}>/{(currentItem as IWord).pronunciation || '...'}/</Text>
                            <View style={styles.divider} />
                            <Text style={styles.banglaText}>{currentItem.bangla}</Text>
                        </View>
                    ) : (
                        <View style={styles.sentenceContent}>
                            <View style={[styles.contextBadge, { backgroundColor: (currentItem as ISentence).contextColor }]}>
                                <Text style={styles.contextText}>{(currentItem as ISentence).context}</Text>
                            </View>
                            <Text style={styles.englishText}>{currentItem.english}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.banglaText}>{currentItem.bangla}</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Feedback Section */}
                {recognizedText ? (
                    <Animated.View entering={FadeInRight} style={styles.feedbackCard}>
                        <Text style={styles.feedbackTitle}>You said:</Text>
                        <Text style={styles.recognizedText}>"{recognizedText}"</Text>
                        {score !== null && (
                            <View style={styles.scoreRow}>
                                <View style={[styles.scoreCircle, { borderColor: score > 70 ? '#22C55E' : '#EF4444' }]}>
                                    <Text style={[styles.scoreText, { color: score > 70 ? '#22C55E' : '#EF4444' }]}>{score}%</Text>
                                </View>
                                <Text style={styles.scoreLabel}>{score > 70 ? 'Great Job!' : 'Keep practicing!'}</Text>
                            </View>
                        )}
                    </Animated.View>
                ) : null}
            </ScrollView>

            {/* Footer Controls */}
            <View style={styles.footer}>
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        disabled={currentIndex === 0}
                        onPress={() => { setCurrentIndex(i => i - 1); setScore(null); setRecognizedText(""); }}
                        style={[styles.navButton, currentIndex === 0 && { opacity: 0.3 }]}
                    >
                        <Ionicons name="chevron-back" size={24} color="#0F172A" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSpeech}
                        style={[styles.micButton, isRecording && styles.micButtonActive]}
                    >
                        <Ionicons name={isRecording ? "stop" : "mic"} size={32} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={currentIndex === currentList.length - 1}
                        onPress={() => { setCurrentIndex(i => i + 1); setScore(null); setRecognizedText(""); }}
                        style={[styles.navButton, currentIndex === currentList.length - 1 && { opacity: 0.3 }]}
                    >
                        <Ionicons name="chevron-forward" size={24} color="#0F172A" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.progressCounter}>Item {currentIndex + 1} of {currentList.length}</Text>
            </View>
        </SafeAreaView>
    );
};

export default TopicPlayground;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    loadingText: { marginTop: 16, color: '#64748B', fontSize: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
    headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    difficultyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: '#E2E8F0' },
    difficultyLabel: { fontSize: 10, fontWeight: '800', color: '#475569' },
    diff_beginner: { backgroundColor: '#DCFCE7' },
    diff_intermediate: { backgroundColor: '#FEF9C3' },
    diff_advanced: { backgroundColor: '#FEE2E2' },
    tabContainer: { flexDirection: 'row', padding: 16, gap: 12 },
    tab: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
    activeTab: { backgroundColor: '#3B82F6' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    activeTabText: { color: '#FFF' },
    scrollContent: { padding: 16, paddingBottom: 120 },
    mainCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 32,
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    wordContent: { alignItems: 'center' },
    sentenceContent: { alignItems: 'center' },
    posBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#F1F5F9', marginBottom: 16 },
    posText: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
    contextBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 16 },
    contextText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
    englishText: { fontSize: 36, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
    pronunciationText: { fontSize: 20, color: '#3B82F6', marginTop: 8, fontStyle: 'italic' },
    divider: { width: 60, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginVertical: 24 },
    banglaText: { fontSize: 24, color: '#64748B', fontWeight: '500', textAlign: 'center' },
    feedbackCard: { marginTop: 24, padding: 20, backgroundColor: '#F0F9FF', borderRadius: 20, borderWidth: 1, borderColor: '#BAE6FD' },
    feedbackTitle: { fontSize: 14, color: '#0369A1', fontWeight: '600', marginBottom: 8 },
    recognizedText: { fontSize: 18, color: '#0F172A', fontStyle: 'italic', marginBottom: 16 },
    scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    scoreCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
    scoreText: { fontSize: 18, fontWeight: '800' },
    scoreLabel: { fontSize: 16, fontWeight: '700' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    navButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    navButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
    micButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
    micButtonActive: { backgroundColor: '#EF4444' },
    progressCounter: { textAlign: 'center', fontSize: 12, color: '#94A3B8', fontWeight: '600' }
});
