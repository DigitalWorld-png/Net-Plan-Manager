import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface PromoCardProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  color: string;
}

export function PromoCard({ title, subtitle, badge, icon, color }: PromoCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: color + "18", borderColor: color + "44" }]}>
      <View style={styles.left}>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <View style={[styles.iconCircle, { backgroundColor: color + "33" }]}>
        <Ionicons name={icon as any} size={36} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  left: { flex: 1, gap: 6 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start" },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  title: { fontSize: 17, fontWeight: "700", lineHeight: 22 },
  subtitle: { fontSize: 13 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginLeft: 12 },
});
