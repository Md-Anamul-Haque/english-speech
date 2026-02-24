import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>English Speech</Text>
          <Text style={styles.subtitleText}>Master your pronunciation with AI-powered feedback.</Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="mic" size={80} color="#3B82F6" />
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Link href={"/topics" as any} asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Start Learning</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Quick Practice</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#F1F5F9",
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
  secondaryButton: {
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "600",
  },
});
