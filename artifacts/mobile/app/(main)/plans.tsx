import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlanCard } from "@/components/PlanCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["Todos", "Básico", "Estándar", "Pro", "Business"];

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, plans } = useAuth();
  const [filter, setFilter] = useState("Todos");
  const isWeb = Platform.OS === "web";

  const filtered = filter === "Todos" ? plans : plans.filter(p => p.name === filter);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Planes de Internet</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Conectividad rápida y confiable para cada necesidad
        </Text>

        <View style={styles.compare}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={[styles.compareText, { color: colors.mutedForeground }]}>Sin contratos forzosos · Instalación incluida · Soporte 24/7</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, { backgroundColor: filter === f ? colors.primary : colors.card, borderColor: filter === f ? colors.primary : colors.border }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, { color: filter === f ? colors.primaryForeground : colors.mutedForeground }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map(plan => (
          <PlanCard key={plan.id} plan={plan} isActive={plan.id === user?.activePlanId} />
        ))}

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Todos nuestros planes incluyen soporte técnico 24/7 y no tienen límite de datos.
            La instalación es gratuita en zonas de cobertura.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 14 },
  compare: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  compareText: { fontSize: 12, flex: 1 },
  filterScroll: { marginBottom: 20 },
  filterChip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "600" },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
