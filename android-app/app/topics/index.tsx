import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { ITopic } from "../../types";
import { Config } from "../../constants/Config";

const TopicsScreen = () => {
    const [topics, setTopics] = useState<ITopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`${Config.API_URL}/api/topics`);
                if (res.ok) {
                    const data = await res.json();
                    setTopics(data);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const renderItem = ({ item }: { item: ITopic }) => (
        <Link href={`/topics/${item.slug}` as any} asChild>
            <TouchableOpacity style={styles.topicCard}>
                <View style={styles.topicInfo}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Lvl {item.level}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.topicTitle}>{item.title}</Text>
                        <Text style={styles.topicDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
            </TouchableOpacity>
        </Link>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Learning Path</Text>
                <Text style={styles.headerSubtitle}>Choose a topic to begin your lesson</Text>
            </View>

            <FlatList
                data={topics}
                renderItem={renderItem}
                keyExtractor={(item) => item._id || item.slug}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },
    levelText: {
        color: "#3B82F6",
        fontWeight: "800",
        fontSize: 12,
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
