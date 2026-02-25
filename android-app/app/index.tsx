import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>English Speech</Text>
          <Text style={styles.subtitleText}>Master your pronunciation with offline AI lessons.</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400)} style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <View style={styles.micCircleInner}>
              <Ionicons name="mic" size={80} color="#3B82F6" />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)} style={styles.actionContainer}>
          <Link href={"/topics" as any} asChild>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Start Learning</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </Link>

          <View style={styles.statusBadge}>
            <Ionicons name="airplane" size={16} color="#64748B" />
            <Text style={styles.statusText}>Offline Mode Enabled</Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "500",
  },
  titleText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 12,
    lineHeight: 24,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  micCircleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  actionContainer: {
    marginBottom: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  }
});
