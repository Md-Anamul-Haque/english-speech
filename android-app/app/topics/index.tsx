import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { dataProvider } from "../../data/DataProvider";
import { ITopic } from "../../types";

const TopicsScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const allTopics = dataProvider.getTopics();

    const filteredTopics = searchQuery
        ? dataProvider.searchTopics(searchQuery)
        : allTopics;

    const renderItem = ({ item, index }: { item: ITopic; index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 50).springify().damping(12)}>
            <Link href={`/topics/${item.slug}` as any} asChild>
                <TouchableOpacity style={styles.topicCard} activeOpacity={0.7}>
                    <View style={styles.topicInfo}>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelLabel}>LVL</Text>
                            <Text style={styles.levelText}>{item.level}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.topicTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.topicDescription} numberOfLines={2}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
                    </View>
                </TouchableOpacity>
            </Link>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Offline Course</Text>
                <Text style={styles.headerSubtitle}>{allTopics.length} Lessons Available</Text>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>

            <FlatList
                data={filteredTopics}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.slug + index}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                windowSize={5}
            />
        </SafeAreaView>
    );
};

export default TopicsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        padding: 24,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0F172A",
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#64748B",
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginTop: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#0F172A',
    },
    listContent: {
        padding: 16,
    },
    topicCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    topicInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    levelBadge: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: "#E0F2FE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    levelLabel: {
        fontSize: 8,
        fontWeight: "800",
        color: "#0369A1",
        letterSpacing: 1,
    },
    levelText: {
        color: "#0369A1",
        fontWeight: "900",
        fontSize: 18,
        marginTop: -2,
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },
    topicDescription: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 4,
        lineHeight: 20,
    },
    separator: {
        height: 12,
    },
});
